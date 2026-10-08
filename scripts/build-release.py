"""Build the preview from tracked public sources and the frozen blank learner scaffold.

Stage new public files before running. Never run the historical parent build_release.py.
Output is deterministic. --output selects an isolated directory; default updates release
artifacts/bootstrap checksums in this repository. No publish, push, or installation.
"""
import argparse
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import re
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]
VERSION = '4.1.0-four-workshops-preview'
BRANCH = 'codex/ceo-team-workshops'
RAW = 'https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/' + BRANCH
EXCLUDE = {'MY_SECOND_BRAIN.zip', 'MANIFEST.json', 'release.json', 'SHA256SUMS.txt',
           'scripts/install-from-github.ps1', 'scripts/install-from-github.sh'}

spec = importlib.util.spec_from_file_location('sb_install', ROOT / 'install.py')
installer = importlib.util.module_from_spec(spec); spec.loader.exec_module(installer)

def encode(value):
    return (json.dumps(value, indent=2, sort_keys=True, ensure_ascii=False) + '\n').encode()

def source_files():
    tracked = subprocess.check_output(['git', '-C', str(ROOT), 'ls-files', '-z']).decode().split('\0')
    result = {}
    for name in sorted(filter(None, tracked)):
        if name in EXCLUDE or name.startswith('.github/') or installer.user_file(name):
            continue
        installer.safe_name(name)
        path = ROOT / name
        if path.is_symlink():
            raise ValueError('No symlinks in public source: ' + name)
        if not path.is_file():
            raise ValueError('Tracked source missing: ' + name)
        result[name] = path.read_bytes()
    scaffold_index = json.loads((ROOT / 'templates/learner-sources.json').read_text(encoding='utf-8'))
    for name in scaffold_index['files']:
        installer.safe_name(name)
        source = 'templates/learner/' + name
        if source not in result:
            raise ValueError('Blank scaffold must be tracked: ' + source)
        if not installer.user_file(name):
            raise ValueError('Scaffold path is not an allowed personal path: ' + name)
        result[name] = result[source]
    return result

def validate(data):
    if data['AGENTS.md'] != data['CLAUDE.md']:
        raise ValueError('AGENTS.md and CLAUDE.md differ')
    baseline = json.loads((ROOT / 'templates/release-baseline.json').read_text(encoding='utf-8'))
    skills = sorted(n.split('/')[2] for n in data if n.startswith('.agents/skills/') and n.count('/') == 3 and n.endswith('/SKILL.md'))
    for name in baseline['original_skills']:
        if name not in skills:
            raise ValueError('Original skill missing: ' + name)
    for name, content in data.items():
        if name.startswith('.agents/skills/'):
            mirror = name.replace('.agents/', '.claude/', 1)
            if data.get(mirror) != content:
                raise ValueError('Skill mirror mismatch: ' + name)
    roles = sorted(n for n in data if n.startswith('.codex/agents/') and n.endswith('.toml'))
    if not roles:
        raise ValueError('No native CEO roles packaged')
    try:
        import tomllib
        native_names = [tomllib.loads(data[n].decode('utf-8-sig')).get('name', Path(n).stem) for n in roles]
        if len(native_names) != len(set(native_names)):
            raise ValueError('Duplicate native role names')
    except ImportError:
        raise ValueError('Release build needs Python 3.11+ for native TOML validation')
    state = json.loads(data['data/state.json'])
    if state.get('tasks') or any(state.get('profile', {}).values()):
        raise ValueError('Public learner scaffold contains personal state')
    for name, content in data.items():
        if name.endswith(('.md','.txt','.json','.toml','.yaml','.yml','.py','.ps1','.mjs','.js','.html')):
            text = content.decode('utf-8-sig', errors='replace')
            if re.search(r'(?:sk-[A-Za-z0-9]{30,}|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[A-Z0-9]{16})', text):
                raise ValueError('Possible credential in public file: ' + name)
            if re.search(r'C:[/\\]Users[/\\]ADVICE', text, re.I):
                raise ValueError('Private local path in public file: ' + name)
    return skills, roles

def zip_bytes(data):
    manifest = {'package':'MY_SECOND_BRAIN', 'version':VERSION,
                'files':{n:{'bytes':len(v),'sha256':installer.digest(v)} for n,v in sorted(data.items())}}
    payload = {**data, 'MANIFEST.json':encode(manifest)}
    output = io.BytesIO()
    with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for name, content in sorted(payload.items()):
            info = zipfile.ZipInfo(name, (2026,10,7,0,0,0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            z.writestr(info, content)
    return output.getvalue(), installer.digest(payload['MANIFEST.json'])

def build(output, check_only=False):
    data = source_files()
    skills, roles = validate(data)
    package, manifest_sha = zip_bytes(data)
    if package != zip_bytes(data)[0]:
        raise ValueError('Non-deterministic build')
    installer.verified_package(io.BytesIO(package))
    metadata = {'version':VERSION,'branch':BRANCH,'package':'MY_SECOND_BRAIN.zip',
                'sha256':installer.digest(package),'manifest_sha256':manifest_sha,
                'bytes':len(package),'files':len(data)+1,'skills_per_host':len(skills),
                'skill_names':skills,'native_roles':roles,'native_role_count':len(roles),
                'macos_native_tested':False}
    if not check_only:
        output.mkdir(parents=True, exist_ok=True)
        (output/'MY_SECOND_BRAIN.zip').write_bytes(package)
        (output/'release.json').write_bytes(encode(metadata))
        (output/'SHA256SUMS.txt').write_text(metadata['sha256']+'  MY_SECOND_BRAIN.zip\n', encoding='utf-8', newline='\n')
        for ext in ('ps1','sh'):
            name = 'scripts/install-from-github.' + ext
            script = (ROOT/name).read_text(encoding='utf-8-sig')
            if ext == 'ps1':
                script = re.sub(r"(?m)^\$expected = '[^']*'", "$expected = '"+metadata['sha256']+"'", script)
                script = re.sub(r"(?m)^\$url = '[^']*'", "$url = '"+RAW+"/MY_SECOND_BRAIN.zip'", script)
            else:
                script = re.sub(r"(?m)^expected='[^']*'", "expected='"+metadata['sha256']+"'", script)
                script = re.sub(r"(?m)^url='[^']*'", "url='"+RAW+"/MY_SECOND_BRAIN.zip'", script)
            dest = output/name; dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(script,encoding='utf-8',newline='\n')
    return metadata

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output',type=Path,default=ROOT)
    parser.add_argument('--check',action='store_true')
    args=parser.parse_args()
    print(json.dumps(build(args.output.resolve(),args.check),indent=2))
