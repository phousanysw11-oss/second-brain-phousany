import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {saveState,readState,toDesk,fromDesk,validateDesk,validateState,servedDesk,emptyCalendar} from '../app/ceo-state.mjs';
const initial=()=>({revision:0,custom:{keep:true},profile:{name:'Synthetic CEO',department:'',role:'CEO',goal:''},tasks:[{id:'T1',title:'One task',status:'todo',source_ids:['S1'],extra:'preserve'}],ceo:{company:{id:'demo',name:'Synthetic company',fictional:true,timezone:'Asia/Vientiane',currencies:['LAK']},priorities:['A','B','C'],calendar:emptyCalendar(),results:[],decisions:[{id:'D1',status:'undecided'}]}});
test('Desk round-trip retains unknown metadata and canonical decisions; maps waiting explicitly',()=>{
 const s=initial(),d=toDesk(s);d.tasks[0].status='waiting';d.tasks[0].title='Edited';const n=fromDesk(s,d);
 assert.equal(n.tasks[0].status,'blocked');assert.equal(n.tasks[0].extra,'preserve');assert.deepEqual(n.ceo.decisions,s.ceo.decisions);assert.deepEqual(n.custom,s.custom);
 d.tasks[0].status='done';assert.equal(fromDesk(s,d).tasks[0].completion.kind,'user_reported');
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
});
