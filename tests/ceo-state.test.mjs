import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {saveState,readState,toDesk,toStandaloneDesk,fromDesk,validateDesk,validateState,servedDesk,emptyCalendar} from '../app/ceo-state.mjs';
const initial=()=>({revision:0,custom:{keep:true},profile:{name:'Synthetic CEO',department:'',role:'CEO',goal:''},tasks:[{id:'T1',title:'One task',status:'todo',source_ids:['S1'],extra:'preserve'}],ceo:{company:{id:'demo',name:'Synthetic company',fictional:true,timezone:'Asia/Vientiane',currencies:['LAK']},priorities:['A','B','C'],calendar:emptyCalendar(),results:[],decisions:[{id:'D1',status:'undecided'}]}});
test('Desk round-trip retains unknown metadata and canonical decisions; maps waiting explicitly',()=>{
 const s=initial(),d=toDesk(s);d.tasks[0].status='waiting';d.tasks[0].title='Edited';const n=fromDesk(s,d);
 assert.equal(n.tasks[0].status,'blocked');assert.equal(n.tasks[0].extra,'preserve');assert.deepEqual(n.ceo.decisions,s.ceo.decisions);assert.deepEqual(n.custom,s.custom);
 d.tasks[0].status='done';assert.equal(fromDesk(s,d).tasks[0].completion.kind,'user_reported');
});
test('rich task fields and more than 50 tasks survive Desk backup and restore',()=>{
 const s=initial();s.tasks=Array.from({length:60},(_,i)=>({...s.tasks[0],id:'T'+i,title:'Task '+i,next:'Call supplier',doneWhen:'Owner accepts delivery',evidence:'notes/result.md',blocker:'Stock confirmation',project:'Launch',priority:'focus'}));
 const d=toDesk(s);assert.equal(validateDesk(d),'full');assert.equal(d.tasks.length,60);
 const restored=fromDesk(s,JSON.parse(JSON.stringify(d)));for(const k of ['next','doneWhen','evidence','blocker','project','priority'])assert.equal(restored.tasks[59][k],s.tasks[59][k]);
 d.tasks[0].next={bad:true};assert.throws(()=>validateDesk(d),/Invalid Desk task/);
});

test('Done reports stay unverified with existing evidence and completion edits invalidate earlier review',()=>{
 for(const change of [{doneWhen:''},{evidence:'',doneWhen:''},{evidence:'draft result',doneWhen:'owner accepts'}]){
  const s=initial();s.tasks[0].evidence='existing result';s.tasks[0].doneWhen='';
  const d=toDesk(s);Object.assign(d.tasks[0],change,{status:'done'});
  const saved=fromDesk(s,d);assert.equal(validateState(saved),saved);assert.equal(saved.tasks[0].completion.kind,'user_reported');
 }
 const s=initial();Object.assign(s.tasks[0],{status:'done',evidence:'checked source',doneWhen:'accepted',completion:{kind:'human_reviewed',reviewer:'synthetic owner'}});
 let d=toDesk(s);d.tasks[0].owner='New synthetic assignee';assert.deepEqual(fromDesk(s,d).tasks[0].completion,s.tasks[0].completion);
 d=toDesk(s);d.tasks[0].evidence='changed evidence';const n=fromDesk(s,d);assert.equal(n.tasks[0].completion.kind,'user_reported');assert.equal(validateState(n),n);
});
test('four workshops and optional Desk results retain distinct labels and canonical authority',()=>{
 const s=initial();s.ceo.results=['WS1','WS2','WS3','WS4','CEO_DESK','AI_EMPLOYEE','MONDAY_BRIEF'].map(id=>({id,path:'work/ceo/'+id+'.md',status:'draft',course_version:'2026-10-08-four-workshops'}));
 const d=toDesk(s);assert.equal(validateDesk(d),'full');assert.equal(d.results.find(r=>r.workshop==='WS2').title,'Market X-Ray');assert.equal(d.results.find(r=>r.workshop==='WS3').title,'Winning Zone');assert.equal(d.results.find(r=>r.workshop==='WS4').title,'Business Website');assert.ok(d.results.find(r=>r.workshop==='CEO_DESK'));
 d.results[0].title='Client must not rewrite ledger';assert.deepEqual(fromDesk(s,d).ceo.results,s.ceo.results);
});

test('separate standalone export passes the actual original HTML validator without relabelling optional IDs',async()=>{
 const s=initial();s.tasks[0].next='Full local next step';s.ceo.results=[{id:'WS2',title:'Market X-ray',course_version:'2026-10-08-four-workshops',status:'Draft',path:'work/ceo/market.md'},{id:'CEO_DESK',status:'Draft',path:'work/ceo/desk.md'}];
 const html=await fs.readFile(new URL('../.agents/skills/bni-second-brain/assets/CEO_DESK.html',import.meta.url),'utf8');
 const validator="const statuses=['todo','doing','waiting','done'];\n"+html.slice(html.indexOf('const text='),html.indexOf('function key()'));
 const check=vm.runInNewContext(validator+'\nvalidate');assert.throws(()=>check(toDesk(s)),/Result index is invalid/);
 const d=toStandaloneDesk(s);assert.equal(check(d),'full');assert.equal(d.results.length,1);assert.equal(d.results[0].title,'Market X-ray');assert.equal('next' in d.tasks[0],false);assert.equal(s.tasks[0].next,'Full local next step');
 s.tasks=Array.from({length:51},(_,i)=>({...s.tasks[0],id:'T'+i}));assert.throws(()=>toStandaloneDesk(s),/no tasks were truncated/);
 s.tasks=s.tasks.slice(0,1);s.tasks[0].owner='x'.repeat(81);assert.throws(()=>toStandaloneDesk(s),/no text was truncated/);
 s.tasks[0].owner='';s.ceo.calendar.source='x'.repeat(501);assert.throws(()=>toStandaloneDesk(s),/Calendar source\/freshness/);
 s.ceo.calendar.source='source';s.ceo.calendar.retrieved_at='x'.repeat(501);assert.throws(()=>toStandaloneDesk(s),/Calendar source\/freshness/);
});
test('old workshop results keep their original meaning after four-workshop migration',()=>{
 const s=initial();s.ceo.results=[{id:'WS2',status:'draft',path:'work/ceo/old.md'},{id:'WS4',title:'My old board decision',status:'draft',path:'work/ceo/board.md'}];const d=toDesk(s);assert.equal(d.results[0].title,'CEO Desk (legacy course)');assert.equal(d.results[1].title,'My old board decision (legacy course)');assert.equal(validateDesk(d),'full');
});
test('wrong-company backup, mixed demo, duplicate id and impossible date rejected',()=>{
 const s=initial();let d=toDesk(s);d.workspace_id='another';assert.throws(()=>fromDesk(s,d),/another company/);
 d=toDesk(s);d.fictional=false;assert.throws(()=>fromDesk(s,d),/synthetic/);
 d=toDesk(s);d.tasks.push({...d.tasks[0]});assert.throws(()=>validateDesk(d));
 d=toDesk(s);d.tasks[0].due='2026-02-30';assert.throws(()=>validateDesk(d));
 d=toDesk(s);d.calendar.events=[{id:'X',title:'Impossible',source_id:'X',timezone:'Asia/Vientiane',start:'2026-02-30T10:00:00+07:00',end:'2026-02-30T11:00:00+07:00'}];assert.throws(()=>validateDesk(d));
 s.ceo.calendar={mode:'invalid',events:'not an array'};assert.throws(()=>validateState(s));
});
test('committed state reports a projection warning instead of false save failure',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ceo-projection-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));await fs.mkdir(path.join(root,'data'));await fs.writeFile(path.join(root,'data/state.json'),JSON.stringify(initial()));await fs.writeFile(path.join(root,'context'),'block projection');
 const saved=await saveState(root,initial());assert.equal(saved.revision,1);assert.match(saved.projectionWarning,/State committed/);assert.equal((await readState(root)).revision,1);assert.equal((await readState(root)).projectionWarning,undefined);
});
test('calendar-only refresh retains tasks, priorities and result authority',()=>{
 const s=initial(),calendar={...emptyCalendar(),mode:'snapshot',source:'provided.csv'};
 const n=fromDesk(s,{schema_version:1,workspace_id:'demo',calendar});assert.deepEqual(n.tasks,s.tasks);assert.deepEqual(n.ceo.priorities,s.ceo.priorities);assert.deepEqual(n.ceo.results,s.ceo.results);
});
test('atomic revision writes, backup and stale-write rejection persist across reads',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ceo-state-'));t.after(()=>fs.rm(root,{recursive:true,force:true}));await fs.mkdir(path.join(root,'data'));const s=initial();await fs.writeFile(path.join(root,'data/state.json'),JSON.stringify(s));
 const saved=await saveState(root,fromDesk(s,toDesk(s)));assert.equal(saved.revision,1);assert.equal((await readState(root)).custom.keep,true);
 await assert.rejects(saveState(root,s),/State changed/);assert.equal((await fs.readdir(path.join(root,'data/backups'))).length,1);
 assert.match(await fs.readFile(path.join(root,'work/tasks.md'),'utf8'),/T1/);
 const a=await readState(root),b=await readState(root);const outcomes=await Promise.allSettled([saveState(root,a),saveState(root,b)]);assert.equal(outcomes.filter(x=>x.status==='fulfilled').length,1);
});
test('served original Desk uses canonical bootstrap and retains original source unchanged',async()=>{
 const p=new URL('../.agents/skills/bni-second-brain/assets/CEO_DESK.html',import.meta.url),html=await fs.readFile(p,'utf8');const out=servedDesk(html,initial());
 assert.match(out,/ceo-desk-adapter.js/);assert.doesNotMatch(out,/const active=localStorage/);assert.match(out,/Synthetic company/);assert.equal(await fs.readFile(p,'utf8'),html);
 assert.match(out,/d.tasks.length<=2000/);assert.doesNotMatch(out,/d.tasks.length<=50/);assert.match(out,/CEO_DESK\|AI_BOARD/);
});
