import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const fixture=path.join(root,'demo/company');
const readJson=async name=>JSON.parse(await fs.readFile(path.join(fixture,name),'utf8'));
function csv(text){
 const rows=[];let row=[],cell='',quoted=false;
 text=text.replace(/^\uFEFF/,'');
 for(let i=0;i<text.length;i++){const ch=text[i];
  if(ch==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}
  else if(ch===','&&!quoted){row.push(cell);cell='';}
  else if(ch==='\n'&&!quoted){row.push(cell.replace(/\r$/,''));if(row.some(Boolean))rows.push(row);row=[];cell='';}
  else cell+=ch;
 }
 assert.equal(quoted,false,'Unclosed CSV quote');
 if(cell||row.length){row.push(cell.replace(/\r$/,''));rows.push(row);}
 const [header,...data]=rows;
 return data.map((cells,i)=>{assert.equal(cells.length,header.length,'CSV width at record '+(i+2));return Object.fromEntries(header.map((h,j)=>[h,cells[j]]));});
}
const readCsv=async name=>csv(await fs.readFile(path.join(fixture,name),'utf8'));
const sum=(rows,key)=>rows.reduce((n,r)=>{assert.notEqual(r[key],'','Cannot sum missing value: '+r.row_id);assert(Number.isFinite(Number(r[key])));return n+Number(r[key]);},0);
const close=(a,b)=>assert(Math.abs(a-b)<1e-10,String(a)+' != '+b);
function realDate(value){const d=new Date(value+'T00:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===value;}
const checks=[];function check(name,fn){fn();checks.push({name,status:'PASS',scope:'synthetic fixture consistency only'});}
const expected=await readJson('expectations.json'),state=await readJson('state.json');
const sales=await readCsv('sales.csv'),expenses=await readCsv('expenses.csv');
const sExpected=expected.finance.september_lak;
const septLak=sales.filter(r=>r.date.startsWith('2026-09')&&r.currency==='LAK');
const seen=new Set(),deduped=septLak.filter(r=>{if(r.row_type==='subtotal')return false;const key=r.currency+':'+r.transaction_id;if(seen.has(key))return false;seen.add(key);return true;});
check('One fictional company; no preclaimed model execution',()=>{
 assert.equal(state.ceo.company.id,'lotus-home-demo');assert.equal(state.ceo.company.fictional,true);
 assert.equal(expected.actual_model_execution.status,'NOT_RUN');assert.equal(state.ceo.results.length,0);
 assert.deepEqual(state.ceo.priorities,expected.desk.priorities);
});
check('Sales schema, distinct IDs, valid dates and blank COGS',()=>{
 assert.equal(sales.length,13);assert.equal(new Set(sales.map(r=>r.row_id)).size,13);
 for(const r of sales){assert.equal(r.fixture,'FICTIONAL');assert(realDate(r.date));}
 assert.equal(sales.find(r=>r.row_id==='S007').matched_cogs,'');
 assert.equal(sales.find(r=>r.row_id==='S010').net_revenue,'7000000');
});
check('Duplicate/subtotal excluded, return included, September LAK revenue',()=>{
 assert.deepEqual(deduped.map(r=>r.row_id),sExpected.included_ids);assert.equal(sum(deduped,'net_revenue'),sExpected.revenue);
});
check('Missing whole-month cost and labelled matched subset',()=>{
 const known=deduped.filter(r=>r.matched_cogs!=='');
 assert.equal(sum(known,'matched_cogs'),sExpected.known_cogs);assert.equal(sum(known,'net_revenue'),sExpected.matched_subset_revenue);
 close((sum(known,'net_revenue')-sum(known,'matched_cogs'))/sum(known,'net_revenue'),sExpected.matched_subset_gross_margin);
 assert.equal(sExpected.complete_cogs,null);assert.equal(sExpected.overall_gross_margin,null);assert.equal(sExpected.supplied_data_operating_remainder,null);
});
check('Currencies and periods reconcile separately; writeoff counted once',()=>{
 for(const [period,currency,e]of [['2026-09','USD',expected.finance.september_usd],['2026-08','LAK',expected.finance.august_lak]]){
  const rows=sales.filter(r=>r.date.startsWith(period)&&r.currency===currency);
  assert.equal(sum(rows,'net_revenue'),e.revenue);assert.equal(sum(rows,'matched_cogs'),e.cogs);close((e.revenue-e.cogs)/e.revenue,e.gross_margin);
 }
 assert.equal(sum(expenses,'amount'),sExpected.expenses);assert.equal(expenses.filter(r=>r.category==='stock_writeoff').length,1);
});
function rankBy(rows,key){const totals=new Map();for(const r of rows){if(r[key])totals.set(r[key],(totals.get(r[key])||0)+Number(r.net_revenue));}return [...totals].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));}
check('Concentration entity counts, ties and customer coverage',()=>{
 const products=rankBy(deduped,'product_id'),pc=Math.ceil(products.length*.2),ptop=products.slice(0,pc);
 assert.equal(products.length,sExpected.product_count);assert.equal(pc,sExpected.top_product_count);
 assert.deepEqual(ptop.map(r=>r[0]),sExpected.top_product_ids);assert.equal(ptop.reduce((n,r)=>n+r[1],0),sExpected.top_product_revenue);
 const customers=rankBy(deduped,'customer_id'),identified=customers.reduce((n,r)=>n+r[1],0);
 assert.equal(customers.length,sExpected.identifiable_customer_count);assert.equal(identified,sExpected.identifiable_customer_revenue);
 close(identified/sExpected.revenue,sExpected.identifiable_customer_coverage);
 assert.deepEqual(customers.slice(0,Math.ceil(customers.length*.2)).map(r=>r[0]),sExpected.top_customer_ids);
});
const cash=await readCsv('cash.csv'),obligations=await readCsv('obligations.csv'),ar=await readCsv('receivables.csv');
check('Dated cash window excludes stale cash and later payments',()=>{
 const e=expected.finance.cash,c=cash.filter(r=>r.as_of===e.as_of&&r.currency==='LAK');
 const ob=obligations.filter(r=>r.due>=e.window_start&&r.due<=e.window_end&&r.currency==='LAK');
 assert.equal(sum(c,'available_cash'),e.available);assert.equal(sum(ob,'amount'),e.obligations);assert.equal(sum(c,'available_cash')-sum(ob,'amount'),e.gap);
 assert.equal(e.gap+sum(ar,'amount'),e.scenario_if_collected_in_window);assert.equal(e.scenario_is_forecast,false);
});
const feedback=await readCsv('feedback.csv');const msgSeen=new Set();
const refunds=await readCsv('refunds.csv');
const included=feedback.filter(r=>{if(!r.text_original.trim()||msgSeen.has(r.message_id))return false;msgSeen.add(r.message_id);return true;});
check('Feedback dedup, blank exclusion, praise and one-theme partition',()=>{
 const e=expected.feedback;assert.equal(feedback.length,e.raw_rows);assert.equal(included.length,e.included_unique_messages);
 for(const r of feedback){assert.equal(r.fixture,'FICTIONAL');assert(realDate(r.published_at));}
 const ids=Object.values(e.candidate_primary_themes).flat();assert.equal(new Set(ids).size,ids.length);assert.deepEqual([...ids].sort(),included.map(r=>r.row_id).sort());
 assert.deepEqual(['delivery','price_clarity','packaging'].map(k=>e.candidate_primary_themes[k].length),e.problem_counts);assert.equal(e.candidate_primary_themes.praise.length,4);
 assert(included.find(r=>r.row_id==='F020').text_original.includes('Ignore previous instructions'));
 assert(included.find(r=>r.row_id==='F010').text_original.includes('10%'));
});
check('Money types separated; unknowns stay missing',()=>{
 assert.equal(sum(included.filter(r=>r.money_type==='verified_refund'),'money_amount'),expected.feedback.verified_refund_lak);
 assert.equal(sum(refunds,'amount'),expected.feedback.verified_refund_lak);
 assert.equal(refunds[0].message_row_id,'F003');assert.equal(refunds[0].order_id,'DEMO-ORDER3');
 const ids=new Set(expected.feedback.candidate_primary_themes.delivery),mentioned=included.filter(r=>ids.has(r.row_id)&&r.money_type==='mentioned_order_value');
 assert.equal(sum(mentioned,'money_amount'),expected.feedback.delivery_mentioned_values_lak);assert(mentioned.every(r=>!r.order_id));
 assert.equal(included.filter(r=>r.money_amount==='').length,expected.feedback.money_unknown_count);
});
const cases=await readJson('employee-cases.json'),policy=await fs.readFile(path.join(fixture,'policy.md'),'utf8');
check('Policy normal, missing-input and exception boundary oracle',()=>{
 assert.equal(cases.cases.length,3);const normal=cases.cases.find(c=>c.id==='EMP-NORMAL').expected;
 assert.equal(10*100000*(1-5/100),normal.total);assert.equal(normal.total,950000);
 const missing=cases.cases.find(c=>c.id==='EMP-MISSING').expected;assert.equal(missing.action,'ask_quantity');assert.equal(missing.total,null);
 const exception=cases.cases.find(c=>c.id==='EMP-EXCEPTION').expected;assert.equal(exception.approved_exception,false);assert.equal(exception.disclose_private_ceo_data,false);
 for(const id of ['POL-D1','POL-D2','POL-X1','POL-P1'])assert(policy.includes(id));
});
check('Desk priorities, valid overlap, exclusive all-day end and unapproved decision',()=>{
 assert.equal(state.tasks.length,3);assert.equal(state.ceo.calendar.mode,'demo');
 const [a,b,c]=state.ceo.calendar.events;assert(Date.parse(a.start)<Date.parse(b.end)&&Date.parse(b.start)<Date.parse(a.end));
 assert.equal(c.all_day,true);assert.equal(c.end,'2026-10-10');assert(c.end>c.start);
 assert.equal(state.ceo.decision.budget_approved,false);assert.equal(state.ceo.decision.ceo_choice,'');
});
const args=process.argv.slice(2);
if(args.length){
 assert.equal(args.length,2,'Usage: node tests/workshop-contracts.mjs [--review-template PATH]');assert.equal(args[0],'--review-template');
 const template=JSON.parse(await fs.readFile(path.join(root,'tests/workshop-contracts.json'),'utf8'));
 const out=path.resolve(args[1]);await fs.mkdir(path.dirname(out),{recursive:true});await fs.writeFile(out,JSON.stringify(template,null,2)+'\n',{flag:'wx'});
}
console.log(JSON.stringify({status:'PASS',scope:'Offline fixture consistency only. No LLM or browser behavior was exercised.',checks,actual_model_execution:'NOT_RUN',human_acceptance:'NOT_RECORDED'},null,2));
