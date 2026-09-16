"""Install a verified Second Brain ZIP into a chosen local folder. Python 3 stdlib."""
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import zipfile

RECEIPT = '.second-brain-install.json'
CORE = ['AGENTS.md', 'CLAUDE.md', '.agents/skills/onboard/SKILL.md',
        '.claude/skills/onboard/SKILL.md', 'data/state.json', 'aios-intake.md']

def safe_name(name):
    if not name or '\\' in name or ':' in name or name.startswith('/'):
        raise ValueError('Unsafe archive path: ' + name)
    parts = name.rstrip('/').split('/')
    for part in parts:
        if part in ('', '.', '..') or part.endswith((' ', '.')) or re.search(r'[\x00-\x1f<>"|?*]', part):
            raise ValueError('Unsafe archive path: ' + name)
        if re.match(r'^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)', part, re.I):
            raise ValueError('Reserved archive path: ' + name)
    return PurePosixPath(*parts)

def plain_path(path):
    for p in [path, *path.parents]:
        if p.is_symlink() or (hasattr(p, 'is_junction') and p.is_junction()):
            raise ValueError('Linked destination path: ' + str(p))

def install(archive, destination):
    target = Path(os.path.abspath(destination))
    plain_path(target)
    if target.exists() and not target.is_dir():
        raise ValueError('Destination must be a folder')
    with zipfile.ZipFile(archive) as z:
        entries = {}
        seen = set()
        if len(z.infolist()) > 4000 or sum(e.file_size for e in z.infolist()) > 60_000_000:
            raise ValueError('Archive exceeds package limits')
        for e in z.infolist():
            name = safe_name(e.filename).as_posix()
            key = name.casefold()
            if key in seen:
                raise ValueError('Duplicate archive path: ' + name)
            seen.add(key)
            if stat.S_ISLNK(e.external_attr >> 16):
                raise ValueError('Archive symlink: ' + name)
            if not e.is_dir():
                entries[name] = e
        manifest = json.loads(z.read(entries['MANIFEST.json']))
        files = manifest['files']
        if manifest['package'] != 'MY_SECOND_BRAIN' or set(files) != set(entries) - {'MANIFEST.json'}:
            raise ValueError('Manifest does not match archive')
        data = {}
        for name, expected in files.items():
            safe_name(name)
            content = z.read(entries[name])
            if len(content) != expected['bytes'] or hashlib.sha256(content).hexdigest() != expected['sha256']:
                raise ValueError('Integrity failure: ' + name)
            data[name] = content
        data['MANIFEST.json'] = z.read(entries['MANIFEST.json'])
        for name in data:
            # Detect a file that is also another entry's parent before writing anything.
            for parent in PurePosixPath(name).parents:
                if parent.as_posix().casefold() in {n.casefold() for n in data}:
                    raise ValueError('Archive file/directory collision: ' + name)
        receipt = target / RECEIPT
        plain_path(receipt)
        if receipt.exists():
            old = json.loads(receipt.read_text(encoding='utf-8-sig'))
            if old.get('manifest_sha256') != hashlib.sha256(data['MANIFEST.json']).hexdigest():
                raise ValueError('Different installed version. Preserve this folder; use a new folder or reviewed migration.')
            for name in data:
                plain_path(target / name)
                if not (target / name).is_file():
                    raise ValueError('Existing installation needs repair: ' + name)
            return {'status': 'already_installed', 'destination': str(target), 'preserved_user_changes': True}
        pending = []
        for name, content in data.items():
            dest = target / name
            plain_path(dest)
            for parent in dest.parents:
                if parent.exists() and not parent.is_dir():
                    raise ValueError('Parent is not a directory: ' + str(parent))
            if dest.exists():
                if not dest.is_file() or dest.read_bytes() != content:
                    raise ValueError('Existing file differs; no files changed: ' + name)
            else:
                pending.append((dest, content))
        for dest, content in pending:
            plain_path(dest)
            dest.parent.mkdir(parents=True, exist_ok=True)
            with dest.open('xb') as stream:
                stream.write(content)
        for name, content in data.items():
            if (target / name).read_bytes() != content:
                raise ValueError('Read-back failed: ' + name)
        result = {'package': manifest['package'], 'version': manifest['version'],
                  'manifest_sha256': hashlib.sha256(data['MANIFEST.json']).hexdigest(),
                  'status': 'installed', 'files_verified': len(data)}
        with receipt.open('x', encoding='utf-8') as stream:
            json.dump(result, stream, indent=2)
        return {**result, 'destination': str(target)}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive')
    parser.add_argument('destination')
    args = parser.parse_args()
    try:
        print(json.dumps(install(args.archive, args.destination), indent=2))
    except (ValueError, OSError, KeyError, zipfile.BadZipFile) as error:
        parser.exit(1, 'INSTALL STOPPED: ' + str(error) + '\n')
