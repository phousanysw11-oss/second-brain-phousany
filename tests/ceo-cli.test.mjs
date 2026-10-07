import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const source=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const tempRoot=path.resolve(os.tmpdir());

async function fixture(t){
 const root=await fs.mkdtemp(path.join(tempRoot,'ceo-cli-'));
 t.after(async()=>{
  const resolved=path.resolve(root);
  assert(resolved.startsWith(tempRoot+path.sep)&&/^ceo-cli-[A-Za-z0-9_-]+$/.test(path.basename(resolved)),'Refuse out-of-scope cleanup');
  await fs.rm(resolved,{recursive:true,force:true});
 });
 await fs.mkdir(path.join(root,'app'));
 await fs.mkdir(path.join(root,'scripts'));
 await fs.mkdir(path.join(root,'data'));
 await fs.copyFile(path.join(source,'app/ceo-state.mjs'),path.join(root,'app/ceo-state.mjs'));
 await fs.copyFile(path.join(source,'scripts/ceo.mjs'),path.join(root,'scripts/ceo.mjs'));
 await fs.cp(path.join(source,'demo/company'),path.join(root,'demo/company'),{recursive:true});
 const initial=JSON.parse(await fs.readFile(path.join(root,'demo/company/state.json'),'utf8'));
 const write=async(file,data)=>{
  const target=path.join(root,file);await fs.mkdir(path.dirname(target),{recursive:true});
  await fs.writeFile(target,typeof data==='string'?data:JSON.stringify(data,null,2));
 };
 const state=async value=>write('data/state.json',value);
 const cli=(...args)=>spawnSync(process.execPath,[path.join(root,'scripts/ceo.mjs'),...args],{cwd:root,encoding:'utf8',windowsHide:true,timeout:30000});
 const packet=async()=>{
  const run=cli('packet');assert.equal(run.status,0,run.stderr||run.stdout);
  const text=await fs.readFile(path.join(root,'work/ceo/evidence-packet.md'),'utf8');
  const record=JSON.parse(run.stdout);
  assert.equal(record.sha256,createHash('sha256').update(text).digest('hex'));
  return text;
 };
 return {root,initial,write,state,cli,packet};
}

test('init-demo refuses a role-only learner and preserves exact existing bytes',async t=>{
 const f=await fixture(t);
 const existing={revision:7,profile:{name:'',department:'',role:'Synthetic existing role',goal:''},tasks:[],custom:{preserve:'ROLE_ONLY_SENTINEL'}};
 await f.state(existing);await f.write('context/me.md','EXISTING_PROFILE_PROJECTION');await f.write('work/tasks.md','EXISTING_TASK_PROJECTION');
 const bytes=await fs.readFile(path.join(f.root,'data/state.json'));
 const result=f.cli('init-demo');assert.notEqual(result.status,0);assert.match(result.stderr,/empty learner folder/);
 assert.deepEqual(await fs.readFile(path.join(f.root,'data/state.json')),bytes);
 assert.equal(await fs.readFile(path.join(f.root,'context/me.md'),'utf8'),'EXISTING_PROFILE_PROJECTION');
 assert.equal(await fs.readFile(path.join(f.root,'work/tasks.md'),'utf8'),'EXISTING_TASK_PROJECTION');
 await assert.rejects(fs.access(path.join(f.root,'data/backups')));
});

test('init-demo also refuses extra profile fields even when the four core strings are blank',async t=>{
 const f=await fixture(t),existing={revision:0,profile:{name:'',department:'',role:'',goal:'',confirmedPreference:'KEEP_CUSTOM_PROFILE'},tasks:[]};
 await f.state(existing);const before=await fs.readFile(path.join(f.root,'data/state.json'));const run=f.cli('init-demo');
 assert.notEqual(run.status,0);assert.deepEqual(await fs.readFile(path.join(f.root,'data/state.json')),before);
});

test('Board packet excludes prior CEO extras and non-whitelisted decision answers',async t=>{
 const f=await fixture(t),s=f.initial;
 s.ceo.previous_seats={cfo:'PRIVATE_PRIOR_SEAT_SENTINEL'};
 s.ceo.review_oracle={answer:'PRIVATE_CEO_ORACLE_SENTINEL'};
 s.ceo.unrelated_private_notes='PRIVATE_CEO_EXTRA_SENTINEL';
 s.ceo.decision.previous_answer='PRIVATE_DECISION_ANSWER_SENTINEL';
 await f.state(s);const output=await f.packet();
 for(const marker of ['PRIVATE_PRIOR_SEAT_SENTINEL','PRIVATE_CEO_ORACLE_SENTINEL','PRIVATE_CEO_EXTRA_SENTINEL','PRIVATE_DECISION_ANSWER_SENTINEL'])assert(!output.includes(marker),marker+' leaked');
 assert(output.includes(s.ceo.decision.question));assert(output.includes('FIN-SALES-v1'));
});

test('Board packet includes same-company WS1 evidence but excludes prior WS4 and other-company result metadata',async t=>{
 const f=await fixture(t),s=f.initial;
 await f.write('work/ceo/ws1.md','# FICTIONAL\nALLOWED_WS1_EVIDENCE_SENTINEL');
 await f.write('work/ceo/ws4-prior.md','# FICTIONAL\nPRIOR_WS4_ANSWER_SENTINEL');
 await f.write('work/ceo/wrong-company.md','# FICTIONAL\nOTHER_COMPANY_RESULT_SENTINEL');
 s.ceo.results=[
  {id:'WS1',company_id:s.ceo.company.id,path:'work/ceo/ws1.md',status:'Draft'},
  {id:'WS4',company_id:s.ceo.company.id,path:'work/ceo/ws4-prior.md',status:'Draft',note:'PRIOR_WS4_METADATA_SENTINEL'},
  {id:'WS2',company_id:'unrelated-synthetic-company',path:'work/ceo/wrong-company.md',status:'Draft',note:'OTHER_COMPANY_RESULT_METADATA_SENTINEL'}
 ];
 await f.state(s);const output=await f.packet();assert(output.includes('ALLOWED_WS1_EVIDENCE_SENTINEL'));
 for(const marker of ['PRIOR_WS4_ANSWER_SENTINEL','PRIOR_WS4_METADATA_SENTINEL','ws4-prior.md','OTHER_COMPANY_RESULT_SENTINEL','OTHER_COMPANY_RESULT_METADATA_SENTINEL'])assert(!output.includes(marker),marker+' leaked');
});

test('Real-company branch uses only explicitly scoped synthetic source records and ignores other inbox files',async t=>{
 const f=await fixture(t),s=f.initial;
 // false exercises the real-company routing branch. Every byte remains synthetic.
 s.ceo.company.fictional=false;
 s.ceo.sources=[
  {id:'SELECTED-SOURCE',business_id:s.ceo.company.id,path:'inbox/selected.md'},
  {id:'OTHER-SOURCE',business_id:'unrelated-synthetic-company',path:'inbox/other-company.md',note:'OTHER_REGISTRY_METADATA_SENTINEL'}
 ];
 await f.write('inbox/selected.md','# FICTIONAL\nALLOWED_SELECTED_SOURCE_SENTINEL');
 await f.write('inbox/other-company.md','# FICTIONAL\nOTHER_REGISTRY_CONTENT_SENTINEL');
 await f.write('inbox/unregistered.md','# FICTIONAL\nUNREGISTERED_INBOX_SENTINEL');
 await f.state(s);const output=await f.packet();assert(output.includes('ALLOWED_SELECTED_SOURCE_SENTINEL'));
 for(const marker of ['OTHER_REGISTRY_METADATA_SENTINEL','OTHER_REGISTRY_CONTENT_SENTINEL','UNREGISTERED_INBOX_SENTINEL','other-company.md','unregistered.md'])assert(!output.includes(marker),marker+' leaked');
});

test('Board packet excludes registered expectation and employee-case oracle content AND metadata',async t=>{
 const f=await fixture(t),s=f.initial;
 await f.write('demo/company/expectations.json',{fictional:true,answer:'ORACLE_FILE_CONTENT_SENTINEL'});
 await f.write('demo/company/employee-cases.json',{fictional:true,expected:'EMPLOYEE_EXPECTED_CONTENT_SENTINEL'});
 s.ceo.sources.push(
  {id:'ORACLE_SOURCE_ID_SENTINEL',business_id:s.ceo.company.id,path:'demo/company/expectations.json',answer:'ORACLE_REGISTRY_METADATA_SENTINEL'},
  {id:'EMPLOYEE_CASE_ORACLE_ID_SENTINEL',business_id:s.ceo.company.id,path:'demo/company/employee-cases.json',answer:'EMPLOYEE_REGISTRY_METADATA_SENTINEL'}
 );
 await f.state(s);const output=await f.packet();
 for(const marker of ['ORACLE_FILE_CONTENT_SENTINEL','EMPLOYEE_EXPECTED_CONTENT_SENTINEL','ORACLE_SOURCE_ID_SENTINEL','ORACLE_REGISTRY_METADATA_SENTINEL','EMPLOYEE_CASE_ORACLE_ID_SENTINEL','EMPLOYEE_REGISTRY_METADATA_SENTINEL','demo/company/expectations.json','demo/company/employee-cases.json'])assert(!output.includes(marker),marker+' leaked');
});

test('Board packet refuses no scoped sources rather than silently reading inbox',async t=>{
 const f=await fixture(t),s=f.initial;s.ceo.sources=[];
 await f.state(s);await f.write('inbox/unregistered.md','# FICTIONAL\nMUST_NOT_FALL_BACK');
 const run=f.cli('packet');assert.notEqual(run.status,0);assert.match(run.stderr,/Register the selected company sources/);
 await assert.rejects(fs.access(path.join(f.root,'work/ceo/evidence-packet.md')));
});

test('Board source cannot traverse from allowed demo prefix into canonical state',async t=>{
 const f=await fixture(t),s=f.initial;
 s.ceo.previous_seats={answer:'TRAVERSAL_PRIOR_SEAT_SENTINEL'};
 s.ceo.sources.push({id:'TRAVERSAL',business_id:s.ceo.company.id,path:'demo/company/../../data/state.json'});
 await f.state(s);const run=f.cli('packet');
 assert.notEqual(run.status,0,'A lexical allowed prefix must not permit a resolved path outside its scoped source directory.');
 await assert.rejects(fs.access(path.join(f.root,'work/ceo/evidence-packet.md')));
});
