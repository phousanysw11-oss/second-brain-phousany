"""Installer behavior tests. Run: python -m unittest discover -s tests -v.

Windows automatically repeats the suite through native PowerShell. Fixtures are
synthetic. Run tests/check-real-upgrade.py separately with the preserved original
3.0.1 ZIP and the newly built release for real-archive migration validation.
"""
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
import zipfile

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('installer',ROOT/'install.py')
installer=importlib.util.module_from_spec(spec);spec.loader.exec_module(installer)
PS=shutil.which('powershell') or shutil.which('pwsh')
BLOCK=b'<!-- SECOND_BRAIN_CORE_START -->\nRead references/ceo-team.md.\n<!-- SECOND_BRAIN_CORE_END -->'
OLD={'AGENTS.md':b'Original manual\n','CLAUDE.md':b'Original manual\n',
     'aios-intake.md':b'blank intake\n','data/state.json':b'{"tasks":[],"profile":{}}\n',
     'context/me.md':b'blank\n','app/app.js':b'old code\n',
     '.agents/skills/onboard/SKILL.md':b'onboard\n',
     '.claude/skills/onboard/SKILL.md':b'onboard\n'}
NEW={**OLD,'AGENTS.md':b'New manual\n'+BLOCK+b'\n','CLAUDE.md':b'New manual\n'+BLOCK+b'\n',
     'app/app.js':b'new code\n',
     '.codex/agents/ceo_operator.toml':b'name = "ceo_operator"\n',
     '.agents/skills/ceo-team/SKILL.md':b'ceo team\n',
     '.claude/skills/ceo-team/SKILL.md':b'ceo team\n'}

def package(path,version='4.0.0-ceo-preview',files=None):
    files=NEW if files is None else files
    manifest={'package':'MY_SECOND_BRAIN','version':version,'files':{n:{'bytes':len(v),'sha256':installer.digest(v)} for n,v in files.items()}}
    with zipfile.ZipFile(path,'w') as z:
        for n,v in files.items():z.writestr(n,v)
        z.writestr('MANIFEST.json',json.dumps(manifest))
    return path

class InstallerTests(unittest.TestCase):
    backend='python'
    def setUp(self):
        scratch=ROOT/'release-build';scratch.mkdir(exist_ok=True)
        self.temp=tempfile.TemporaryDirectory(prefix='sb-install-test-',dir=scratch)
        if os.name=='nt':self.temp.name='\\\\?\\'+self.temp.name
        self.root=Path(self.temp.name);self.dest=self.root/'Learner folder';self.archive=package(self.root/'new.zip')
    def tearDown(self):
        self.assertTrue(str(self.root.resolve()).removeprefix('\\\\?\\').startswith(str((ROOT/'release-build').resolve()) + os.sep))
        self.temp.cleanup()
    def run_install(self,archive=None,expected=None):
        archive=archive or self.archive
        result=installer.install(archive,self.dest)
        if expected:self.assertEqual(expected,result['status'])
        return result
    def legacy(self):
        oldzip=package(self.root/'old.zip','3.0.1',OLD)
        self.run_install(oldzip,'installed')
        # Convert the modern test receipt into the actual old schema.
        receipt=self.dest/installer.RECEIPT
        data=json.loads(receipt.read_text());data.pop('baseline');data.pop('managed_sections')
        receipt.write_text(json.dumps(data))
    def test_clean_and_exact_reinstall(self):
        self.run_install(expected='installed')
        self.assertEqual(NEW['app/app.js'],(self.dest/'app/app.js').read_bytes())
        self.run_install(expected='already_installed')
        self.assertEqual(1,len(list((self.dest/'.codex/agents').glob('*.toml'))))
    def test_legacy_upgrade_preserves_answers_custom_roles_and_skills(self):
        self.legacy()
        personal=b'{"tasks":[{"title":"private","custom":41}],"profile":{"name":"Learner","unknown":"keep"}}'
        (self.dest/'data/state.json').write_bytes(personal)
        (self.dest/'context/me.md').write_text('My real business')
        for n in ('AGENTS.md','CLAUDE.md'):(self.dest/n).write_bytes(b'My own rules\n')
        role=self.dest/'.codex/agents/my_custom.toml';role.parent.mkdir(parents=True);role.write_text('name = "my_custom"')
        skill=self.dest/'.agents/skills/custom/SKILL.md';skill.parent.mkdir(parents=True);skill.write_text('custom skill')
        result=self.run_install(expected='upgraded')
        self.assertEqual(personal,(self.dest/'data/state.json').read_bytes())
        self.assertEqual('My real business',(self.dest/'context/me.md').read_text())
        self.assertIn('AGENTS.md',result['managed_guides_merged'])
        self.assertTrue((self.dest/'AGENTS.md').read_bytes().startswith(b'My own rules\n'))
        self.assertEqual(1,(self.dest/'AGENTS.md').read_bytes().count(BLOCK))
        self.assertTrue(role.exists());self.assertEqual('custom skill',skill.read_text())
        self.assertEqual(NEW['app/app.js'],(self.dest/'app/app.js').read_bytes())
        self.assertEqual(OLD['app/app.js'],next((self.dest/installer.UPGRADES).glob('*/backup/app/app.js')).read_bytes())
        self.run_install(expected='already_installed')
        self.assertEqual(1,(self.dest/'AGENTS.md').read_bytes().count(BLOCK))
    def test_modified_shipped_code_remains_conflict_until_resolved(self):
        self.legacy();(self.dest/'app/app.js').write_bytes(b'my code')
        result=self.run_install(expected='needs_review')
        self.assertIn('app/app.js',result['conflicts'])
        self.assertEqual(b'my code',(self.dest/'app/app.js').read_bytes())
        incoming=next((self.dest/installer.UPGRADES).glob('*/incoming/app/app.js'))
        self.assertEqual(NEW['app/app.js'],incoming.read_bytes())
        self.run_install(expected='needs_review')
        (self.dest/'app/app.js').write_bytes(incoming.read_bytes())
        self.run_install(expected='already_installed')
    def test_custom_same_role_path_is_staged_outside_active_roles(self):
        role=self.dest/'.codex/agents/ceo_operator.toml';role.parent.mkdir(parents=True);role.write_text('my customized role')
        self.run_install(expected='needs_review');self.run_install(expected='needs_review')
        self.assertEqual('my customized role',role.read_text())
        self.assertEqual(1,len(list(role.parent.glob('*.toml'))))
    def test_custom_role_with_same_declared_name_avoids_duplicate(self):
        custom=self.dest/'.codex/agents/my-local-name.toml';custom.parent.mkdir(parents=True)
        custom.write_text('name = "ceo_operator"\n')
        result=self.run_install(expected='needs_review')
        self.assertIn('.codex/agents/ceo_operator.toml',result['conflicts'])
        self.assertFalse((self.dest/'.codex/agents/ceo_operator.toml').exists())
        self.assertEqual(1,len(list(custom.parent.glob('*.toml'))))
    def test_custom_managed_section_not_overwritten(self):
        self.run_install(expected='installed')
        (self.dest/'AGENTS.md').write_bytes(b'New manual\n'+BLOCK.replace(b'ceo-team.md',b'my-rules.md'))
        result=self.run_install(expected='needs_review')
        self.assertIn('AGENTS.md',result['conflicts'])
    def test_missing_file_repaired(self):
        self.run_install(expected='installed');(self.dest/'app/app.js').unlink()
        self.run_install(expected='repaired');self.assertEqual(NEW['app/app.js'],(self.dest/'app/app.js').read_bytes())
    def test_new_onboarding_modes_never_replace_saved_intake(self):
        self.legacy()
        answers=b'Status: complete-with-gaps\nMode: import\nBusiness: My saved company\nLater correction: preserve me\n'
        (self.dest/'aios-intake.md').write_bytes(answers)
        self.run_install(expected='upgraded')
        self.run_install(expected='already_installed')
        self.assertEqual(answers,(self.dest/'aios-intake.md').read_bytes())
    def test_deferred_intake_is_preserved_during_first_install(self):
        self.dest.mkdir()
        deferred=b'Status: deferred\nMode: later\nNext topic: resume when requested\n'
        (self.dest/'aios-intake.md').write_bytes(deferred)
        self.run_install(expected='installed')
        self.assertEqual(deferred,(self.dest/'aios-intake.md').read_bytes())
    def test_modified_onboarding_skill_staged_without_overwrite(self):
        self.legacy()
        skill=self.dest/'.agents/skills/onboard/SKILL.md'
        custom=b'My carefully customized onboarding questions\n'
        skill.write_bytes(custom)
        result=self.run_install(expected='needs_review')
        self.assertIn('.agents/skills/onboard/SKILL.md',result['conflicts'])
        self.assertEqual(custom,skill.read_bytes())
        staged=next((self.dest/installer.UPGRADES).glob('*/incoming/.agents/skills/onboard/SKILL.md'))
        self.assertEqual(NEW['.agents/skills/onboard/SKILL.md'],staged.read_bytes())
    def test_plain_browser_export_files_are_preserved(self):
        self.legacy()
        export=self.dest/'work/browser-handoff.md'
        export.parent.mkdir(parents=True,exist_ok=True)
        content=b'# Handoff\nCompany: chosen learner business\nSource E1: imported manually\n'
        export.write_bytes(content)
        self.run_install(expected='upgraded')
        self.assertEqual(content,export.read_bytes())
    def test_interrupted_legacy_upgrade_resumes_from_checkpoint(self):
        self.legacy()
        receipt=self.dest/installer.RECEIPT
        prior=json.loads((self.dest/'MANIFEST.json').read_text())
        checkpoint=json.loads(receipt.read_text())
        checkpoint['baseline']={n:v['sha256'] for n,v in prior['files'].items()}
        checkpoint['baseline']['MANIFEST.json']=installer.digest((self.dest/'MANIFEST.json').read_bytes())
        checkpoint['status']='upgrading'
        receipt.write_text(json.dumps(checkpoint))
        with zipfile.ZipFile(self.archive) as z:(self.dest/'MANIFEST.json').write_bytes(z.read('MANIFEST.json'))
        self.run_install(expected='upgraded')
        self.assertEqual(NEW['app/app.js'],(self.dest/'app/app.js').read_bytes())
    def test_parent_file_collision_stops_before_payload_writes(self):
        self.dest.mkdir();(self.dest/'.codex').write_text('existing file')
        with self.assertRaises((ValueError,OSError)):self.run_install()
        self.assertFalse((self.dest/'AGENTS.md').exists())
    def test_tampered_manifest_stops_legacy_upgrade(self):
        self.legacy();(self.dest/'MANIFEST.json').write_text('{}')
        with self.assertRaises((ValueError,KeyError)):self.run_install()
        self.assertEqual(OLD['app/app.js'],(self.dest/'app/app.js').read_bytes())
    def test_unsafe_archive_paths(self):
        for name in ('../escape','/absolute','C:/escape','CON.txt','.git/config','.second-brain-install.json','name.','parent\\file'):
            with self.subTest(name=name):
                archive=package(self.root/'unsafe.zip',files={name:b'bad'})
                with self.assertRaises((ValueError,KeyError)):self.run_install(archive)
                self.assertFalse(self.dest.exists())
    def test_integrity_failure(self):
        with zipfile.ZipFile(self.archive) as z:items={n:z.read(n) for n in z.namelist()}
        items['app/app.js']=b'tampered'
        with zipfile.ZipFile(self.archive,'w') as z:
            for n,v in items.items():z.writestr(n,v)
        with self.assertRaises(ValueError):self.run_install()
        self.assertFalse(self.dest.exists())
    def test_case_collision(self):
        archive=package(self.root/'case.zip',files={'one.md':b'a','ONE.md':b'b'})
        with self.assertRaises(ValueError):self.run_install(archive)
        self.assertFalse(self.dest.exists())
    def test_file_directory_collision(self):
        archive=package(self.root/'collision.zip',files={'one':b'a','one/child':b'b'})
        with self.assertRaises(ValueError):self.run_install(archive)
        self.assertFalse(self.dest.exists())
    def test_linked_destination(self):
        outside=self.root/'outside';outside.mkdir();self.dest.mkdir()
        try:(self.dest/'app').symlink_to(outside,target_is_directory=True)
        except OSError:
            if os.name!='nt' or not PS:self.skipTest('link creation unavailable')
            quote=lambda p: "'"+str(p).removeprefix('\\\\?\\').replace("'","''")+"'"
            proc=subprocess.run([PS,'-NoProfile','-Command','New-Item -ItemType Junction -Path '+quote(self.dest/'app')+' -Target '+quote(outside)+' | Out-Null'],capture_output=True,text=True)
            if proc.returncode:self.skipTest('junction creation unavailable')
        with self.assertRaises(ValueError):self.run_install()
        self.assertFalse((outside/'app.js').exists())

@unittest.skipUnless(PS,'Native PowerShell unavailable')
class PowerShellInstallerTests(InstallerTests):
    backend='powershell'
    def run_install(self,archive=None,expected=None):
        archive=archive or self.archive
        quote=lambda p: "'"+str(p).replace("'","''")+"'"
        command="& ([scriptblock]::Create([IO.File]::ReadAllText("+quote(ROOT/'install.ps1')+"))) -Archive "+quote(archive)+" -Destination "+quote(self.dest)
        proc=subprocess.run([PS,'-NoProfile','-Command',command],capture_output=True,text=True)
        if proc.returncode not in (0,2):raise ValueError(proc.stderr.strip())
        result=json.loads(proc.stdout)
        self.assertEqual(2 if result['status']=='needs_review' else 0,proc.returncode)
        if expected:self.assertEqual(expected,result['status'])
        return result

if __name__=='__main__':unittest.main()
