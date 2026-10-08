"""Verify the real built ZIP, inventory, mirrors, source links and installer receipt."""
import hashlib,io,json,re,subprocess,uuid,zipfile
import sys
from pathlib import Path
from urllib.parse import unquote
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'release-build'/('core-check-'+uuid.uuid4().hex[:8]);OUT.mkdir(parents=True)
meta=json.loads((ROOT/'release.json').read_text(encoding='utf-8'))
blob=(ROOT/'MY_SECOND_BRAIN.zip').read_bytes()
digest=lambda b:hashlib.sha256(b).hexdigest()
assert digest(blob)==meta['sha256']
expected={'grill-me','audit','level-up','3d-brain','open-3d-brain','onboard','wiki-helper'}
with zipfile.ZipFile(io.BytesIO(blob)) as z:
    assert z.testzip() is None
    names=set(z.namelist());manifest=json.loads(z.read('MANIFEST.json'))
    assert len(names)==meta['files'] and set(manifest['files'])==names-{'MANIFEST.json'}
    for n,item in manifest['files'].items():
        b=z.read(n);assert len(b)==item['bytes'] and digest(b)==item['sha256'],n
    for host in ['.agents','.claude']:
        actual={n.split('/')[2] for n in names if n.startswith(host+'/skills/') and n.count('/')==3 and n.endswith('/SKILL.md')}
        assert actual==expected,(host,actual)
    for n in names:
        if n.startswith('.agents/skills/'):assert z.read(n)==z.read(n.replace('.agents/','.claude/',1)),n
    assert not any(n.startswith(('app/','.codex/','.claude/agents/','templates/','tests/')) for n in names)
    assert 'data/state.json' not in names
    assert z.read('AGENTS.md')==z.read('CLAUDE.md')
    assert z.read('llm-wiki/AGENTS.md')==z.read('llm-wiki/CLAUDE.md')
    links=[]
    import posixpath
    for n in names:
        if not n.endswith('.md'):continue
        text=z.read(n).decode('utf-8-sig')
        for m in re.finditer(r'\[[^\]]*\]\(([^)]+)\)',text):
            target=m.group(1).strip().strip('<>').split('#')[0]
            if not target or re.match(r'^[a-z][a-z0-9+.-]*:',target,re.I) or any(t in target for t in ['{{','$']):continue
            target=unquote(re.sub(r'\s+"[^"]*"$','',target));resolved=posixpath.normpath(posixpath.join(posixpath.dirname(n),target))
            assert resolved in names or any(p.startswith(resolved.rstrip('/')+'/') for p in names),(n,target,resolved)
            links.append([n,target])
    cfg=json.loads(z.read('apps/3d-brain/brain.config.json'))
    assert cfg['name']=='My Second Brain'
    assert not any(s.get('kind')=='codex-memory' for s in cfg['sources'])
    for n in ['.agents/skills/3d-brain/agents/openai.yaml','.agents/skills/open-3d-brain/agents/openai.yaml']:
        assert 'allow_implicit_invocation: false' in z.read(n).decode()
dest=OUT/'fresh-learner'
quote=lambda p:"'"+str(p).replace("'","''")+"'"
def ps_install(label,target):
    cmd="& ([scriptblock]::Create([IO.File]::ReadAllText("+quote(ROOT/'scripts/install-from-github.ps1')+"))) -Archive "+quote(ROOT/'MY_SECOND_BRAIN.zip')+" -Destination "+quote(target)
    r=subprocess.run(['powershell','-NoProfile','-Command',cmd],capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=120)
    (OUT/(label+'.txt')).write_text(r.stdout+'\n'+r.stderr,encoding='utf-8')
    assert r.returncode==0,(label,r.returncode,r.stdout,r.stderr)
    return json.loads(r.stdout)
fresh=ps_install('fresh',dest);assert fresh['status']=='installed'
for n,item in manifest['files'].items():assert digest((dest/n).read_bytes())==item['sha256'],n
assert not (dest/'app').exists() and not (dest/'.codex').exists()
repeat=ps_install('repeat',dest);assert repeat['status']=='already_installed'
# User answers and additional personal files must survive a repeated install.
saved={'aios-intake.md':b'Status: paused\nMode: guided\nName: Synthetic learner\nNext topic: priority\n','context/me.md':b'# Synthetic learner\nPreserve exactly.\n','notes/retained.md':b'Synthetic note\n'}
for n,b in saved.items():(dest/n).parent.mkdir(parents=True,exist_ok=True);(dest/n).write_bytes(b)
personal_repeat=ps_install('personal-repeat',dest)
assert personal_repeat['status']=='already_installed'
for n,b in saved.items():assert (dest/n).read_bytes()==b,n
rejections=[]
for backend in ['python','powershell']:
    for prior in ['unrelated-content','older-kit-receipt']:
        target=OUT/(backend+'-'+prior);target.mkdir();(target/'retained.md').write_bytes(b'Synthetic existing work. Preserve exactly.\n')
        if prior=='older-kit-receipt':
            (target/'.second-brain-install.json').write_text(json.dumps({'package':'MY_SECOND_BRAIN','version':'3.0.1','manifest_sha256':'0'*64}),encoding='utf-8')
        snapshot=lambda:{p.relative_to(target).as_posix():p.read_bytes() for p in target.rglob('*') if p.is_file()}
        before=snapshot()
        if backend=='python':cmd=[sys.executable,str(ROOT/'install.py'),str(ROOT/'MY_SECOND_BRAIN.zip'),str(target)]
        else:
            code="& ([scriptblock]::Create([IO.File]::ReadAllText("+quote(ROOT/'scripts/install-from-github.ps1')+"))) -Archive "+quote(ROOT/'MY_SECOND_BRAIN.zip')+" -Destination "+quote(target)
            cmd=['powershell','-NoProfile','-Command',code]
        r=subprocess.run(cmd,capture_output=True,text=True,encoding='utf-8',errors='replace',timeout=120)
        assert r.returncode!=0 and 'Core Seven requires' in r.stdout+r.stderr,(backend,prior,r.stdout,r.stderr)
        assert snapshot()==before,(backend,prior,'unexpected write')
        rejections.append(backend+': '+prior+' rejected before writes')
summary={'status':'PASS','version':meta['version'],'sha256':meta['sha256'],'files':len(names),'all_member_hashes_read_back':True,'skills_per_host':7,'custom_agents':0,'local_links':len(links),'mirror_bytes_equal':True,'dashboard_absent':True,'json_profile_runtime_absent':True,'fresh':'installed','repeat':'already_installed','populated_repeat':'already_installed','personal_files_preserved':list(saved),'older_or_unrelated_folder_guard':rejections,'fresh_folder':str(dest),'limits':['offline Windows bootstrap','recipient account/skill discovery not tested','existing full-kit downgrade requires a fresh folder; no deletion or migration claimed']}
(OUT/'summary.json').write_text(json.dumps(summary,indent=2),encoding='utf-8');print(json.dumps(summary,indent=2))
