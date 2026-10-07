"""Use real release archives to test native Windows migration; no personal data.
Usage: python tests/check-real-upgrade.py OLD.zip NEW.zip [unique-output-name]
"""
import json, subprocess, sys, zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def run(old_archive,new_archive,name):
    dest=ROOT/'release-build'/name
    if dest.exists():raise ValueError('Use a fresh output name; test never deletes a prior folder')
    dest=Path('\\\\?\\'+str(dest))
    with zipfile.ZipFile(old_archive) as z:
        namespace={'__name__':'legacy_test'};exec(compile(z.read('install.py'),'legacy_install.py','exec'),namespace)
        assert namespace['install'](old_archive,dest)['status']=='installed'
    state=dest/'data/state.json';saved=json.loads(state.read_text());saved['profile']['name']='Synthetic learner';saved['profile']['customField']='keep';saved['tasks']=[{'id':'t1','title':'User task','customValue':17}];saved['myCustomRoot']={'value':'preserve'};state.write_text(json.dumps(saved));state_bytes=state.read_bytes()
    for guide in ('AGENTS.md','CLAUDE.md'):
        path=dest/guide;path.write_text(path.read_text()+'\nMy local custom instruction must survive.\n')
    (dest/'context/me.md').write_text('Synthetic learner business context')
    role=dest/'.codex/agents/custom_role.toml';role.parent.mkdir(parents=True);role.write_text('name = "custom_role"\n')
    skill=dest/'.agents/skills/my-special/SKILL.md';skill.parent.mkdir(parents=True);skill.write_text('my custom skill')
    quote=lambda p: "'"+str(p).replace("'","''")+"'"
    command="& ([scriptblock]::Create([IO.File]::ReadAllText("+quote(ROOT/'install.ps1')+"))) -Archive "+quote(new_archive)+" -Destination "+quote(dest)
    proc=subprocess.run(['powershell','-NoProfile','-Command',command],capture_output=True,text=True)
    if proc.returncode:raise RuntimeError(proc.stderr+'\n'+proc.stdout)
    result=json.loads(proc.stdout)
    assert result['status']=='upgraded',result
    assert state.read_bytes()==state_bytes
    assert 'My local custom instruction must survive.' in (dest/'AGENTS.md').read_text()
    assert (dest/'AGENTS.md').read_text().count('<!-- CEO_TEAM_START -->')==1
    assert (dest/'context/me.md').read_text()=='Synthetic learner business context'
    assert role.exists() and skill.read_text()=='my custom skill'
    native_count=len(list((dest/'.codex/agents').glob('*.toml')))
    with zipfile.ZipFile(new_archive) as z:expected_roles=sum(n.startswith('.codex/agents/') and n.endswith('.toml') for n in z.namelist())
    assert native_count==expected_roles+1
    again=subprocess.run(['powershell','-NoProfile','-Command',command],capture_output=True,text=True)
    assert again.returncode==0,(again.stderr,again.stdout)
    assert json.loads(again.stdout)['status']=='already_installed'
    report={'actual_legacy':'3.0.1 original ZIP/installer','preview_status':result['status'],'files_verified':result['files_verified'],'preserved_state_bytes':True,'preserved_instructions':True,'merged_router_once':True,'preserved_custom_role_and_skill':True,'native_role_files_including_custom':native_count,'exact_reinstall':'already_installed'}
    print(json.dumps(report,indent=2))
    (ROOT/'release-build'/('result-'+name+'.json')).write_text(json.dumps(report,indent=2))

if __name__=='__main__':run(Path(sys.argv[1]).resolve(),Path(sys.argv[2]).resolve(),sys.argv[3] if len(sys.argv)>3 else 'real-legacy-upgrade')
