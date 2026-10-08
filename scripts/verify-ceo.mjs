import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const errors=[],roles=['ceo_chief_of_staff','ceo_cfo_analyst','ceo_customer_analyst','ceo_competitor_analyst','ceo_investor_strategy_analyst','ceo_lao_business_advisor','ceo_ai_employee_builder','ceo_evidence_reviewer'];
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const role of roles){try{const s=await fs.readFile(path.join(root,'.codex/agents',role+'.toml'),'utf8');for(const key of ['name','description','developer_instructions'])if(!new RegExp('^'+key+'\\s*=','m').test(s))throw Error('missing '+key)}catch(e){errors.push(role+': '+e.message)}}
let shipped;try{const manifest=JSON.parse(await fs.readFile(path.join(root,'MANIFEST.json'),'utf8'));shipped=new Set(Object.keys(manifest.files).filter(p=>/^\.agents\/skills\/[^/]+\/SKILL\.md$/.test(p)).map(p=>p.split('/')[2]))}catch(e){if(e.code!=='ENOENT')errors.push('Manifest unreadable: '+e.message)}
const skills=(await fs.readdir(path.join(root,'.agents/skills'),{withFileTypes:true})).filter(e=>!shipped||shipped.has(e.name));let count=0;
async function compare(dir,rel=''){for(const e of await fs.readdir(path.join(root,'.agents/skills',dir,rel),{withFileTypes:true})){const p=path.join(dir,rel,e.name);if(e.isSymbolicLink())throw Error('symlink '+p);if(e.isDirectory())await compare(dir,path.join(rel,e.name));else{const a=await fs.readFile(path.join(root,'.agents/skills',p)),b=await fs.readFile(path.join(root,'.claude/skills',p));if(!a.equals(b))throw Error('mirror mismatch '+p)}}}
for(const e of skills.filter(e=>e.isDirectory())){try{const s=await fs.readFile(path.join(root,'.agents/skills',e.name,'SKILL.md'),'utf8');if(!/^---\r?\n/.test(s)||!/^name:\s*\S+/m.test(s)||!/^description:\s*\S+/m.test(s))throw Error('metadata');await compare(e.name);count++}catch(err){errors.push(e.name+': '+err.message)}}
try{const b=await fs.readFile(path.join(root,'.agents/skills/bni-second-brain/assets/CEO_DESK.html'));if(hash(b)!=='a04f9c80cf720f26caec3372e29e2483f5afd25f5438f137a5c684a5d051c0ad')throw Error('Original Desk changed')}catch(e){errors.push(e.message)}
for(const p of ['data/state.json','demo/company/state.json','docs/CEO_TEAM_CATALOG.md','scripts/ceo.mjs','app/ceo-state.mjs'])try{await fs.access(path.join(root,p))}catch{errors.push('Missing '+p)}
if(Number(process.versions.node.split('.')[0])<22)errors.push('Node.js 22+ required for CEO Desk/helpers');
console.log(JSON.stringify({status:errors.length?'FAIL':'PASS',node:process.version,platform:process.platform,roles:roles.length,skills:count,errors,native_discovery:'Requires a fresh Codex session; file checks do not prove runtime discovery',scheduler:'not installed'},null,2));process.exitCode=errors.length?1:0;
