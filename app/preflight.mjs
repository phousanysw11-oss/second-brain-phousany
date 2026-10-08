import fs from 'node:fs/promises';
import path from 'node:path';
import net from 'node:net';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const errors=[];
function pass(s){console.log('PASS '+s)}
function fail(s){errors.push(s);console.log('FAIL '+s)}
if(Number(process.versions.node.split('.')[0])<22)fail('Node.js 22+ is required. Install a supported LTS from https://nodejs.org/en/download then reopen Terminal.');else pass('Node.js '+process.versions.node+' / '+process.platform+' '+process.arch);
const required=['AGENTS.md','CLAUDE.md','context/me.md','data/state.json','app/server.mjs','app/config.json','app/index.html','app/app.js','app/style.css','llm-wiki/AGENTS.md','llm-wiki/wiki/index.md','apps/3d-brain/brain.config.json','apps/3d-brain/serve.mjs','apps/3d-brain/build.mjs','apps/3d-brain/config.mjs','apps/3d-brain/codex-memory.mjs','apps/3d-brain/index.html','apps/3d-brain/dist/app.js'];
for(const f of required)try{await fs.access(path.join(ROOT,f));}catch{fail('Missing '+f+'. Extract the entire ZIP again into a new folder.');}
if(!errors.length)pass('Dashboard, wiki and 3D app files present');
let shippedSkills;try{const manifest=JSON.parse(await fs.readFile(path.join(ROOT,'MANIFEST.json'),'utf8'));shippedSkills=[...new Set(Object.keys(manifest.files).filter(p=>/^\.agents\/skills\/[^/]+\/SKILL\.md$/.test(p)).map(p=>p.split('/')[2]))]}catch{shippedSkills=(await fs.readdir(path.join(ROOT,'.agents/skills'),{withFileTypes:true})).filter(e=>e.isDirectory()).map(e=>e.name)}
for(const name of shippedSkills){
try{
 const a=path.join(ROOT,'.agents/skills',name),c=path.join(ROOT,'.claude/skills',name);
 const text=await fs.readFile(path.join(a,'SKILL.md'),'utf8');
 if(!text.startsWith('---')||!text.includes('name: '+name))throw Error('metadata');
 async function compare(dir,rel=''){
  for(const e of await fs.readdir(path.join(dir,rel),{withFileTypes:true})){
   const p=path.join(rel,e.name);if(e.isSymbolicLink())throw Error('symlink');
   if(e.isDirectory())await compare(dir,p);else if(!(await fs.readFile(path.join(a,p))).equals(await fs.readFile(path.join(c,p))))throw Error('mirror mismatch '+p);
  }
 }
 await compare(a);pass('Skill '+name+' and supporting files match across both apps');
}catch(e){fail('Skill '+name+' is missing or incomplete: '+e.message);}
}
try{
 const s=JSON.parse(await fs.readFile(path.join(ROOT,'data/state.json'),'utf8'));
 if(!Number.isInteger(s.revision)||!Array.isArray(s.tasks)||!s.profile)throw Error('invalid task store');
 JSON.parse(await fs.readFile(path.join(ROOT,'app/config.json'),'utf8'));
 const cfg=JSON.parse(await fs.readFile(path.join(ROOT,'apps/3d-brain/brain.config.json'),'utf8'));
 if(path.resolve(ROOT,'apps/3d-brain',cfg.root)!==ROOT)throw Error('brain root does not point to this learner folder');
 const guides=await Promise.all(['AGENTS.md','CLAUDE.md'].map(f=>fs.readFile(path.join(ROOT,f),'utf8')));const blocks=guides.map(t=>t.match(/<!-- CEO_TEAM_START -->[\s\S]*?<!-- CEO_TEAM_END -->/)?.[0]);if(!blocks[0]||blocks[0]!==blocks[1])throw Error('Managed CEO routing blocks differ; preserve custom text and review the upgrade report');
 pass('Local task store, config and shared instructions');
}catch(e){fail('Configuration: '+e.message);}
try{
 const probe=path.join(ROOT,'data','.setup-check-'+randomUUID()+'.tmp');
 await fs.writeFile(probe,'local setup check',{flag:'wx'});await fs.unlink(probe);pass('Folder is writable');
}catch{fail('Folder is not writable. Extract to your own Documents folder, outside the ZIP preview.');}
for(const port of [Number(process.env.TRAINING_PORT||4781),Number(process.env.BRAIN_PORT||4782)]){
 if(!Number.isInteger(port)||port<1024||port>65535){fail('Invalid local port');continue;}
 await new Promise(resolve=>{
  const server=net.createServer();server.once('error',()=>{fail('Port '+port+' is busy. If you already opened this kit, use that window. Otherwise choose unused TRAINING_PORT and BRAIN_PORT; do not stop an unrelated app.');resolve()});
  server.listen(port,'127.0.0.1',()=>server.close(()=>{pass('Local port '+port+' available');resolve()}));
 });
}
const roleFiles=await fs.readdir(path.join(ROOT,'.codex/agents')).catch(()=>[]);
if(['chief_of_staff','cfo_analyst','customer_analyst','competitor_analyst','investor_strategy_analyst','lao_business_advisor','ai_employee_builder','evidence_reviewer'].some(n=>!roleFiles.includes('ceo_'+n+'.toml')))fail('Missing packaged CEO role file; run scripts/verify-ceo.mjs');else pass('Eight native role files present; fresh-session discovery still requires actual testing');
if(errors.length){console.log('\nSETUP NEEDS ATTENTION. Fix the FAIL items above, then run this check again.');process.exitCode=1;}
else console.log('\nLOCAL SETUP READY. Open OPEN_WINDOWS.cmd or OPEN_MAC.command.\nThis check verifies local files and runtime only. Check skill loading in your own Codex/Claude Code session. Live Google sources require separate administrator setup.');
