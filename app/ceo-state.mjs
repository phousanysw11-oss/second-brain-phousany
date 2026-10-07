import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID,createHash} from 'node:crypto';

export const emptyCalendar=()=>({mode:'unavailable',source:'not in the data',retrieved_at:'',range_start:'',range_end:'',events:[]});
const fail=m=>{throw Error(m)};
const str=(v,n=5000)=>typeof v==='string'&&v.length<=n;
const date=v=>str(v,10)&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(Date.parse(v))&&new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;
const tz=v=>{try{new Intl.DateTimeFormat('en',{timeZone:v});return !!v}catch{return false}};
export async function readState(root){return JSON.parse(await fs.readFile(path.join(root,'data/state.json'),'utf8'))}
export function validateState(s){
 if(!s||!Number.isInteger(s.revision)||s.revision<0||!s.profile||!Array.isArray(s.tasks)||s.tasks.length>2000)fail('Invalid state');
 for(const k of ['name','department','role','goal'])if(!str(s.profile[k],2000))fail('Invalid profile '+k);
 const ids=new Set();for(const t of s.tasks){
  if(!/^[\w-]{1,80}$/.test(t.id)||ids.has(t.id)||!str(t.title,240)||!t.title.trim())fail('Invalid or duplicate task');ids.add(t.id);
  if(!['todo','doing','blocked','done'].includes(t.status))fail('Invalid task status');
  for(const k of ['owner','next','doneWhen','evidence','blocker','project','due','priority'])if(!str(t[k]??''))fail('Invalid task '+k);
  if(t.due&&!date(t.due))fail('Invalid task date');
  if(t.status==='done'&&(!t.evidence||!t.doneWhen)&&t.completion?.kind!=='user_reported')fail('Done requires evidence or an explicit unverified user report');
 }
 if(s.ceo){
  if(s.ceo.calendar)validateCalendar(s.ceo.calendar);
  if(!s.ceo.company||!/^[a-z0-9_-]{1,64}$/.test(s.ceo.company.id)||!str(s.ceo.company.name,120)||!s.ceo.company.name||!tz(s.ceo.company.timezone))fail('Invalid company context');
  if(typeof s.ceo.company.fictional!=='boolean'||!Array.isArray(s.ceo.priorities)||s.ceo.priorities.length>3||s.ceo.priorities.some(p=>!str(p,180)))fail('Invalid priorities/company type');
 }
 return s;
}
export async function projectState(root,s){
 await fs.mkdir(path.join(root,'context'),{recursive:true});await fs.mkdir(path.join(root,'work'),{recursive:true});
 const p=s.profile;
 await fs.writeFile(path.join(root,'context/me.md'),`# My profile\n\nProjection of data/state.json revision ${s.revision}.\n\nName: ${p.name}\nRole: ${p.role}\nDepartment: ${p.department}\nGoal: ${p.goal}\nCompany: ${s.ceo?.company?.name||'not supplied'}\n`);
 await fs.writeFile(path.join(root,'work/tasks.md'),'# Tasks\n\nProjection of data/state.json revision '+s.revision+'\n\n'+s.tasks.map(t=>`## ${t.id}: ${t.title}\nStatus: ${t.status}\nOwner: ${t.owner||'unknown'}\nDue: ${t.due||'unknown'}\nNext: ${t.next||''}\nDone when: ${t.doneWhen||''}\nEvidence: ${t.evidence||'not supplied'}\nCompletion review: ${t.completion?.kind||'see evidence'}\n`).join('\n'));
 if(s.ceo){
  await fs.mkdir(path.join(root,'work/ceo'),{recursive:true});
  await fs.writeFile(path.join(root,'work/ceo/INDEX.md'),'# Saved CEO work\n\nProjection of data/state.json. Re-read actual sources before reuse.\n\n'+(s.ceo.results||[]).map(r=>`- ${r.id}: [${r.path}](../../${r.path}) | ${r.status} | ${r.updated_at} | sha256 ${r.sha256}`).join('\n')+'\n');
 }
}
export async function saveState(root,next){
 validateState(next);const dataDir=path.join(root,'data'),lock=path.join(dataDir,'.state-write-lock');
 await fs.mkdir(dataDir,{recursive:true});
 try{await fs.mkdir(lock)}catch(e){if(e.code==='EEXIST'){const err=Error('Another state write is active; retry after it finishes. A crash lock must be inspected before recovery.');err.status=409;throw err}throw e}
 try{
  const old=await readState(root);
  if(next.revision!==old.revision){const e=Error('State changed. Reload before saving; your changes were not applied.');e.status=409;throw e}
  const saved={...old,...next,revision:old.revision+1};
  await fs.mkdir(path.join(dataDir,'backups'),{recursive:true});
  await fs.writeFile(path.join(dataDir,'backups',`state-${old.revision}-${randomUUID()}.json`),JSON.stringify(old,null,2),{flag:'wx'});
  const tmp=path.join(dataDir,`.state-${randomUUID()}.tmp`);
  await fs.writeFile(tmp,JSON.stringify(saved,null,2),{flag:'wx'});await fs.rename(tmp,path.join(dataDir,'state.json'));
  try{await projectState(root,saved)}catch(e){Object.defineProperty(saved,'projectionWarning',{value:'State committed at revision '+saved.revision+'; Markdown projections need repair: '+e.message})}return saved;
 }finally{await fs.rmdir(lock)}
}
export function toDesk(s){
 if(!s.ceo?.company)fail('Company context is missing. Supply the business name/timezone, or explicitly request the synthetic demo.');
 if(s.tasks.length>50)fail('This original Desk supports 50 tasks. Keep the full state; select a bounded workflow before opening.');
 const c=s.ceo;
 return {schema_version:1,workspace_id:c.company.id,fictional:c.company.fictional,profile:{business:c.company.name,role:s.profile.role,timezone:c.company.timezone,working_hours:c.working_hours||'',daily_view:c.daily_view||'Today'},priorities:c.priorities||[],tasks:s.tasks.map(t=>({id:t.id,title:t.title,owner:t.owner||'',due:t.due||'',status:t.status==='blocked'?'waiting':t.status,source_ids:t.source_ids||[],review_status:t.review_status||'draft'})),calendar:c.calendar||emptyCalendar(),results:(c.results||[]).slice(-10).map(r=>({workshop:['AI_EMPLOYEE','MONDAY_BRIEF'].includes(r.id)?'WS5':r.id,title:r.title||r.id,status:r.status,source:r.path})).filter(r=>/^WS[1-5]$/.test(r.workshop))};
}
export function validateCalendar(c){

 if(!c||!['connector-read','snapshot','demo','unavailable'].includes(c.mode)||!str(c.source)||!str(c.retrieved_at)||!Array.isArray(c.events)||c.events.length>100)fail('Invalid Calendar');
 if(![c.range_start,c.range_end].every(x=>x===''||date(x))||(c.range_start&&c.range_end&&c.range_end<c.range_start))fail('Invalid Calendar dates');
 const stamp=v=>{if(!str(v)||!date(v.slice(0,10)))return false;const m=v.match(/^\d{4}-\d{2}-\d{2}T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(Z|[+-](\d{2}):(\d{2}))$/);return !!m&&Number(m[1])<24&&Number(m[2])<60&&Number(m[3]||0)<60&&Number(m[5]||0)<=14&&Number(m[6]||0)<60&&!(Number(m[5])===14&&Number(m[6])!==0)&&!isNaN(Date.parse(v))};
 if(c.mode==='connector-read'&&!stamp(c.retrieved_at))fail('Connector timestamp required');
 const ei=new Set();for(const e of c.events){if(!str(e.id,100)||!e.id||ei.has(e.id)||!str(e.title,180)||!e.title||!str(e.source_id,180)||!tz(e.timezone)||(e.all_day===true?(!date(e.start)||!date(e.end)):(!stamp(e.start)||!stamp(e.end)))||Date.parse(e.end)<=Date.parse(e.start))fail('Invalid Calendar event');ei.add(e.id)}
 return c;
}
export function validateDesk(d){
 if(!d||d.schema_version!==1||!/^[a-z0-9_-]{1,64}$/.test(d.workspace_id))fail('Invalid Desk workspace');
 validateCalendar(d.calendar);
 if(!('profile'in d))return 'calendar';
 if(typeof d.fictional!=='boolean'||!d.profile||!str(d.profile.business,120)||!d.profile.business||!str(d.profile.role,80)||!tz(d.profile.timezone)||!str(d.profile.working_hours,120)||!str(d.profile.daily_view,80))fail('Invalid Desk profile');
 if(!Array.isArray(d.priorities)||d.priorities.length>3||d.priorities.some(v=>!str(v,180)))fail('Invalid Desk priorities');
 if(!Array.isArray(d.tasks)||d.tasks.length>50)fail('Desk supports 50 tasks');
 const ids=new Set();for(const t of d.tasks){if(!/^[\w-]{1,80}$/.test(t.id)||ids.has(t.id)||!str(t.title,180)||!t.title.trim()||!str(t.owner,80)||!(t.due===''||date(t.due))||!['todo','doing','waiting','done'].includes(t.status)||!['draft','checked','proposed'].includes(t.review_status)||!Array.isArray(t.source_ids)||t.source_ids.length>15||t.source_ids.some(x=>!str(x,180)))fail('Invalid Desk task');ids.add(t.id)}
 if(!Array.isArray(d.results)||d.results.length>10||d.results.some(r=>!/^WS[1-5]$/.test(r.workshop)||!str(r.title,180)||!str(r.status,80)||!str(r.source,300)))fail('Invalid Desk results');
 return 'full';
}
export function fromDesk(s,d){
 const type=validateDesk(d),c=s.ceo;
 if(!c||d.workspace_id!==c.company.id)fail('Backup belongs to another company');
 if(type==='calendar')return {...s,ceo:{...c,calendar:d.calendar}};
 if(d.fictional!==c.company.fictional)fail('Cannot mix synthetic and real company data');
 const tasks=d.tasks.map(t=>{const old=s.tasks.find(x=>x.id===t.id)||{};return {...old,...t,status:t.status==='waiting'?'blocked':t.status,...(t.status==='done'&&!old.evidence?{completion:{kind:'user_reported',at:new Date().toISOString(),source:'CEO Desk'}}:{})}});
 return {...s,profile:{...s.profile,role:d.profile.role},tasks,ceo:{...c,company:{...c.company,name:d.profile.business,timezone:d.profile.timezone},working_hours:d.profile.working_hours,daily_view:d.profile.daily_view,priorities:d.priorities,calendar:d.calendar}};
}
export const sha256=s=>createHash('sha256').update(s).digest('hex');
export function servedDesk(html,s){
 const d=toDesk(s);validateDesk(d);
 // Preserve the distributed original; adapt only the served copy. Ignore browser caches.
 return html.replace(/(<script[^>]*id="initial-data"[^>]*>)[\s\S]*?(<\/script>)/,(_,a,b)=>a+JSON.stringify(d).replace(/</g,'\\u003c')+b)
 .replace(/try\{validate\(initial\);const active=localStorage[\s\S]*?\}render\(\);/, 'validate(initial);render();')
 .replace('Refresh in ChatGPT, then import the new Calendar JSON.','Ask Codex to refresh the saved Calendar snapshot.')
 .replace('Copy this prompt into your own Project and invoke BNI CEO Desk. After checking the Calendar result, import its JSON here.','Ask Codex to update Calendar in this project. It can save the checked snapshot directly; manual JSON import is also available.')
 .replace('</body>','<script src="/ceo-desk-adapter.js"></script></body>');
}
