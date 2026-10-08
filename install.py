"""Verified, recoverable install/upgrade; Python 3 stdlib. Exit 0 ready, 2 review, 1 error."""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import tempfile
import zipfile

RECEIPT = '.second-brain-install.json'
UPGRADES = '.second-brain-upgrades'
USER_ROOTS = ('context/', 'data/', 'work/', 'notes/', 'inbox/', 'projects/',
              'brainstorms/', 'decisions/', 'audits/', 'archives/',
              'llm-wiki/raw/', 'llm-wiki/wiki/', 'apps/3d-brain/data/')
USER_FILES = {'aios-intake.md', 'connections.md', 'references/voice.md',
              'app/config.json', 'apps/3d-brain/brain.config.json'}
START, END = '<!-- SECOND_BRAIN_CORE_START -->', '<!-- SECOND_BRAIN_CORE_END -->'

def digest(content):
    return hashlib.sha256(content).hexdigest()

def safe_name(name):
    if not name or '\\' in name or ':' in name or name.startswith('/'):
        raise ValueError('Unsafe archive path: ' + name)
    parts = name.rstrip('/').split('/')
    for part in parts:
        if part in ('', '.', '..') or part.endswith((' ', '.')) or re.search(r'[\x00-\x1f<>"|?*]', part):
            raise ValueError('Unsafe archive path: ' + name)
        if re.match(r'^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)', part, re.I):
            raise ValueError('Reserved archive path: ' + name)
    if parts[0].casefold() in {'.git', RECEIPT.casefold(), UPGRADES.casefold()}:
        raise ValueError('Reserved installer path: ' + name)
    return PurePosixPath(*parts)

def plain_path(path):
    for p in [path, *path.parents]:
        if p.is_symlink() or (hasattr(p, 'is_junction') and p.is_junction()):
            raise ValueError('Linked destination path: ' + str(p))
        if p != path and p.exists() and not p.is_dir():
            raise ValueError('Parent is not a directory: ' + str(p))

def role_name(content):
    match = re.search(r'''(?m)^\s*name\s*=\s*["']([^"']+)["']''', content.decode('utf-8-sig'))
    return match.group(1).casefold() if match else None

def user_file(name):
    return name in USER_FILES or name.startswith(USER_ROOTS)

def section(content):
    text = content.decode('utf-8-sig')
    if START not in text and END not in text:
        return None
    if text.count(START) != 1 or text.count(END) != 1 or text.index(START) > text.index(END):
        raise ValueError('Ambiguous core managed section')
    return text[text.index(START):text.index(END) + len(END)]

def verified_package(archive):
    with zipfile.ZipFile(archive) as z:
        entries, seen = {}, set()
        if len(z.infolist()) > 6000 or sum(e.file_size for e in z.infolist()) > 100_000_000:
            raise ValueError('Archive exceeds package limits')
        for e in z.infolist():
            name = safe_name(e.filename).as_posix()
            if name.casefold() in seen:
                raise ValueError('Duplicate archive path: ' + name)
            seen.add(name.casefold())
            if stat.S_ISLNK(e.external_attr >> 16):
                raise ValueError('Archive symlink: ' + name)
            if not e.is_dir():
                entries[name] = e
        manifest_bytes = z.read(entries['MANIFEST.json'])
        manifest = json.loads(manifest_bytes)
        files = manifest['files']
        if manifest['package'] != 'MY_SECOND_BRAIN' or set(files) != set(entries) - {'MANIFEST.json'}:
            raise ValueError('Manifest does not match archive')
        data = {}
        for name, expected in files.items():
            safe_name(name)
            content = z.read(entries[name])
            if len(content) != expected['bytes'] or digest(content) != expected['sha256']:
                raise ValueError('Integrity failure: ' + name)
            data[name] = content
        data['MANIFEST.json'] = manifest_bytes
        keys = {n.casefold() for n in data}
        for name in data:
            if any(p.as_posix().casefold() in keys for p in PurePosixPath(name).parents):
                raise ValueError('Archive file/directory collision: ' + name)
        return manifest, data

def write_atomic(path, content):
    plain_path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, tmp = tempfile.mkstemp(prefix='.second-brain-write-', dir=path.parent)
    try:
        with os.fdopen(descriptor, 'wb') as stream:
            stream.write(content)
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)
    if path.read_bytes() != content:
        raise ValueError('Read-back failed: ' + str(path))

def install(archive, destination):
    target = Path(os.path.abspath(destination))
    if os.name == 'nt' and not str(target).startswith('\\\\?\\'):
        target = Path('\\\\?\\UNC\\' + str(target)[2:] if str(target).startswith('\\\\') else '\\\\?\\' + str(target))
    plain_path(target)
    if target.exists() and not target.is_dir():
        raise ValueError('Destination must be a folder')
    manifest, data = verified_package(archive)
    incoming_sha = digest(data['MANIFEST.json'])
    receipt = target / RECEIPT
    plain_path(receipt)
    old = json.loads(receipt.read_text(encoding='utf-8-sig')) if receipt.exists() else {}
    if old and old.get('package') != 'MY_SECOND_BRAIN':
        raise ValueError('Unrecognized installation receipt')
    if manifest['version'].endswith('-core-seven'):
        if old and old.get('manifest_sha256') != incoming_sha:
            raise ValueError('Core Seven requires a new empty folder or this exact release receipt. Nothing changed.')
        if not old and target.exists() and any(target.iterdir()):
            raise ValueError('Core Seven requires a new empty folder. Nothing changed; preserve the existing folder.')
    baseline = old.get('baseline', {})
    if old and not baseline:
        prior_manifest = target / 'MANIFEST.json'
        plain_path(prior_manifest)
        raw = prior_manifest.read_bytes()
        if digest(raw) != old.get('manifest_sha256'):
            raise ValueError('Installed manifest changed; preserve folder and review migration')
        prior = json.loads(raw)
        if prior.get('package') != 'MY_SECOND_BRAIN':
            raise ValueError('Unrecognized installed manifest')
        baseline = {n: v['sha256'] for n, v in prior['files'].items()}
        baseline['MANIFEST.json'] = digest(raw)
    for name, sha in baseline.items():
        safe_name(name)
        if not re.fullmatch('[a-f0-9]{64}', sha):
            raise ValueError('Invalid baseline hash: ' + name)
    saved_sections = old.get('managed_sections', {})
    next_baseline, next_sections = dict(baseline), dict(saved_sections)
    pending, incoming, preserved, conflicts, merged = {}, {}, [], [], []
    recovery = target / UPGRADES / incoming_sha[:16]
    plain_path(recovery)
    custom_role_names = {}
    role_directory = target / '.codex/agents'
    plain_path(role_directory)
    if role_directory.is_dir():
        for role in role_directory.glob('*.toml'):
            plain_path(role)
            relative = role.relative_to(target).as_posix()
            if relative not in data:
                declared = role_name(role.read_bytes())
                if declared:
                    custom_role_names[declared] = relative
    for name, content in sorted(data.items()):
        if name.startswith('.codex/agents/') and name.endswith('.toml') and role_name(content) in custom_role_names:
            incoming[name] = content
            conflicts.append(name)
            continue
        dest = target / name
        plain_path(dest)
        if dest.exists() and not dest.is_file():
            raise ValueError('Destination is not a file: ' + name)
        current = dest.read_bytes() if dest.exists() else None
        sha = digest(content)
        if current is None:
            pending[name] = content
            next_baseline[name] = sha
        elif current == content:
            next_baseline[name] = sha
        elif user_file(name):
            preserved.append(name)
            next_baseline[name] = baseline.get(name, sha)
        elif baseline.get(name) == digest(current):
            pending[name] = content
            next_baseline[name] = sha
        else:
            new_section = section(content) if name in ('AGENTS.md', 'CLAUDE.md') else None
            old_section = section(current) if new_section else None
            if new_section and (old_section is None or digest(old_section.encode()) == saved_sections.get(name)):
                text = current.decode('utf-8-sig')
                combined = (text.rstrip() + '\n\n' + new_section + '\n') if old_section is None else text.replace(old_section, new_section)
                if combined.encode() != current:
                    pending[name] = combined.encode()
                    merged.append(name)
                next_sections[name] = digest(new_section.encode())
                preserved.append(name)
                incoming[name] = content
            elif new_section and old_section == new_section:
                preserved.append(name)
                next_sections[name] = digest(new_section.encode())
            else:
                incoming[name] = content
                conflicts.append(name)
        if name in ('AGENTS.md', 'CLAUDE.md') and name not in conflicts and name not in merged and (current is None or current == content or name in pending):
            block = section(content)
            if block:
                next_sections[name] = digest(block.encode())
    obsolete = sorted(n for n in baseline if n not in data and not user_file(n))
    conflicts.extend('obsolete: ' + n for n in obsolete if (target / n).exists())
    plain_path(recovery / 'report.json')
    if (recovery / 'report.json').exists() and not (recovery / 'report.json').is_file():
        raise ValueError('Recovery report path is not a file')
    for name in [*pending, *incoming, RECEIPT]:
        for kind in ('backup', 'incoming'):
            p = recovery / kind / name
            plain_path(p)
            if p.exists() and not p.is_file():
                raise ValueError('Recovery path is not a file: ' + str(p))
    for name in pending:
        dest = target / name
        if dest.exists():
            backup = recovery / 'backup' / name
            if not backup.exists():
                write_atomic(backup, dest.read_bytes())
    if old and (pending or incoming):
        backup = recovery / 'backup' / RECEIPT
        if not backup.exists():
            write_atomic(backup, receipt.read_bytes())
    for name, content in incoming.items():
        write_atomic(recovery / 'incoming' / name, content)
    if old and pending:
        # Persist the original baseline before payload replacement, so interrupted
        # legacy upgrades can resume even if MANIFEST.json was already replaced.
        transition = {**old, 'baseline': baseline, 'status': 'upgrading'}
        write_atomic(receipt, (json.dumps(transition, indent=2) + '\n').encode())
    for name, content in pending.items():
        write_atomic(target / name, content)
    status = 'needs_review' if conflicts else ('installed' if not old else ('upgraded' if old.get('manifest_sha256') != incoming_sha else ('repaired' if pending else 'already_installed')))
    result = {'package': manifest['package'], 'version': manifest['version'],
              'manifest_sha256': incoming_sha, 'status': status,
              'files_verified': len(data), 'files_written': len(pending),
              'preserved': preserved, 'managed_guides_merged': merged,
              'conflicts': conflicts, 'baseline': next_baseline,
              'managed_sections': next_sections}
    if pending or incoming or old.get('status') != status or old.get('manifest_sha256') != incoming_sha:
        write_atomic(receipt, (json.dumps(result, indent=2, sort_keys=True) + '\n').encode())
    if incoming or conflicts or merged:
        write_atomic(recovery / 'report.json', (json.dumps({k: v for k, v in result.items() if k != 'baseline'}, indent=2) + '\n').encode())
    return {k: v for k, v in {**result, 'destination': str(target), 'recovery': str(recovery) if (incoming or conflicts or merged or pending and old) else None}.items() if k != 'baseline'}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive')
    parser.add_argument('destination')
    args = parser.parse_args()
    try:
        result = install(args.archive, args.destination)
        print(json.dumps(result, indent=2))
        parser.exit(2 if result['status'] == 'needs_review' else 0)
    except (ValueError, OSError, KeyError, TypeError, zipfile.BadZipFile) as error:
        parser.exit(1, 'INSTALL STOPPED: ' + str(error) + '\n')
