"""Build the seven-skill kit from public tracked sources and frozen blank context.

Stage new source files before building. Recipient context is never read for a build.
No install, server, external account or publication action is performed.
"""
import argparse,hashlib,importlib.util,io,json,re,subprocess,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
VERSION='3.1.0-core-seven'
BRANCH='codex/second-brain-core-7'
RAW='https://raw.githubusercontent.com/phousanysw11-oss/second-brain-phousany/'+BRANCH
SKILLS={'onboard','grill-me','audit','level-up','wiki-helper','3d-brain','open-3d-brain'}
EXCLUDE={'MY_SECOND_BRAIN.zip','MANIFEST.json','release.json','SHA256SUMS.txt','scripts/install-from-github.ps1','scripts/install-from-github.sh','scripts/build-core.py'}
spec=importlib.util.spec_from_file_location('installer',ROOT/'install.py')
installer=importlib.util.module_from_spec(spec);spec.loader.exec_module(installer)
def encode(v):return (json.dumps(v,ensure_ascii=False,sort_keys=True,indent=2)+'\n').encode()
def sources():
    tracked=subprocess.check_output(['git','-C',str(ROOT),'ls-files','-z']).decode().split('\0')
    data={}
    for name in sorted(filter(None,tracked)):
        if name in EXCLUDE or name.startswith(('templates/','tests/','.github/','release-build/')) or installer.user_file(name):continue
        installer.safe_name(name);p=ROOT/name
        if p.is_symlink() or not p.is_file():raise ValueError('Invalid public source: '+name)
        data[name]=p.read_bytes()
    for p in sorted((ROOT/'templates/learner').rglob('*')):
        if not p.is_file():continue
        name=p.relative_to(ROOT/'templates/learner').as_posix()
        if 'templates/learner/'+name not in tracked:raise ValueError('Stage frozen scaffold: '+name)
        if not installer.user_file(name):raise ValueError('Scaffold not protected: '+name)
        data[name]=p.read_bytes()
    return data
def validate(data):
    if data['AGENTS.md']!=data['CLAUDE.md']:raise ValueError('Manual mirrors differ')
    for host in ['.agents','.claude']:
        names={n.split('/')[2] for n in data if n.startswith(host+'/skills/') and n.count('/')==3 and n.endswith('/SKILL.md')}
        if names!=SKILLS:raise ValueError('Skill inventory mismatch '+host+': '+str(names))
    for n,b in data.items():
        if n.startswith('.agents/skills/') and data.get(n.replace('.agents/','.claude/',1))!=b:raise ValueError('Skill mirror differs: '+n)
        if n.startswith(('app/','.codex/','.claude/agents/')):raise ValueError('Removed runtime/role packaged: '+n)
        if n.endswith(('.md','.txt','.json','.yaml','.yml','.py','.ps1','.mjs','.js','.html')):
            t=b.decode('utf-8-sig',errors='replace')
            if re.search(r'C:[/\\]Users[/\\]ADVICE',t,re.I):raise ValueError('Private absolute path: '+n)
            if re.search(r'(?:sk-[A-Za-z0-9]{30,}|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[A-Z0-9]{16})',t):raise ValueError('Possible credential: '+n)
    if data['llm-wiki/AGENTS.md']!=data['llm-wiki/CLAUDE.md']:raise ValueError('Wiki mirrors differ')
def package(data):
    manifest={'package':'MY_SECOND_BRAIN','version':VERSION,'files':{n:{'bytes':len(b),'sha256':installer.digest(b)} for n,b in sorted(data.items())}}
    payload={**data,'MANIFEST.json':encode(manifest)}
    out=io.BytesIO()
    with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for n,b in sorted(payload.items()):
            info=zipfile.ZipInfo(n,(2026,10,8,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,b)
    return out.getvalue(),installer.digest(payload['MANIFEST.json'])
def build(check=False):
    data=sources();validate(data);blob,manifest_sha=package(data)
    if blob!=package(data)[0]:raise ValueError('Non-deterministic build')
    installer.verified_package(io.BytesIO(blob))
    meta={'package':'MY_SECOND_BRAIN.zip','version':VERSION,'based_on':'3.0.1','source_commit':'33360aafce3daa5f95660c87188b5addf03e3128','branch':BRANCH,'skills_per_host':7,'skill_names':sorted(SKILLS),'custom_agent_count':0,'dashboard_included':False,'bytes':len(blob),'files':len(data)+1,'sha256':installer.digest(blob),'manifest_sha256':manifest_sha}
    if not check:
        (ROOT/'MY_SECOND_BRAIN.zip').write_bytes(blob);(ROOT/'release.json').write_bytes(encode(meta));(ROOT/'SHA256SUMS.txt').write_text(meta['sha256']+'  MY_SECOND_BRAIN.zip\n',encoding='utf-8',newline='\n')
        for ext in ['ps1','sh']:
            p=ROOT/('scripts/install-from-github.'+ext);t=p.read_text(encoding='utf-8-sig')
            if ext=='ps1':
                t=re.sub(r"(?m)^\$expected = '[^']*'","$expected = '"+meta['sha256']+"'",t)
                t=re.sub(r"(?m)^\$url = '[^']*'","$url = '"+RAW+"/MY_SECOND_BRAIN.zip'",t)
            else:
                t=re.sub(r"(?m)^expected='[^']*'","expected='"+meta['sha256']+"'",t)
                t=re.sub(r"(?m)^url='[^']*'","url='"+RAW+"/MY_SECOND_BRAIN.zip'",t)
            p.write_text(t,encoding='utf-8',newline='\n')
    return meta
if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--check',action='store_true');a=p.parse_args();print(json.dumps(build(a.check),indent=2))
