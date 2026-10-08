import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
function csv(text){const rows=[];let row=[],cell='',q=false;for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(q&&text[i+1]==='"'){cell+='"';i++;}else q=!q;}else if(c===','&&!q){row.push(cell);cell='';}else if(c==='\n'&&!q){row.push(cell.replace(/\r$/,''));if(row.some(Boolean))rows.push(row);row=[];cell='';}else cell+=c;}if(cell||row.length){row.push(cell.replace(/\r$/,''));rows.push(row);}assert(!q);const[h,...data]=rows;return data.map(r=>Object.fromEntries(h.map((k,i)=>[k,r[i]])));}
const read=async p=>fs.readFile(path.join(root,p),'utf8');
const sales=csv(await read('demo/company/sales.csv')),feedback=csv(await read('demo/company/feedback.csv'));
const cash=csv(await read('demo/company/cash.csv')),due=csv(await read('demo/company/obligations.csv'));
const profile=JSON.parse(await read('demo/four-workshops/source-profile.json'));
const expected=JSON.parse(await read('demo/four-workshops/author-expected-outputs.json'));
const sum=(rs,k)=>rs.reduce((a,r)=>{assert.notEqual(r[k],'');assert(Number.isFinite(Number(r[k])));return a+Number(r[k]);},0);
const close=(a,b)=>assert(Math.abs(a-b)<1e-10);
const seen=new Set(),sel=sales.filter(r=>r.date.startsWith('2026-09')&&r.currency==='LAK'&&r.row_type!=='subtotal').filter(r=>{if(seen.has(r.transaction_id))return false;seen.add(r.transaction_id);return true;});
const msgSeen=new Set(),included=feedback.filter(r=>{if(!r.text_original.trim()||msgSeen.has(r.message_id))return false;msgSeen.add(r.message_id);return true;});
export function validateOutput(o){
 assert.equal(o.fictional,true);assert.equal(o.business_id,profile.business_id);
 assert.equal(o.course_version,'2026-10-08-four-workshops');assert.equal(o.human_review,null);
 assert.equal(o.live_apify,false);assert.equal(o.public_deployment,false);
 assert.equal(o.ws1.revenue,sum(sel,'net_revenue'));
 const known=sel.filter(r=>r.matched_cogs!=='');assert.equal(o.ws1.matched_subset_revenue,sum(known,'net_revenue'));assert.equal(o.ws1.matched_subset_cogs,sum(known,'matched_cogs'));
 close(o.ws1.matched_subset_margin,(sum(known,'net_revenue')-sum(known,'matched_cogs'))/sum(known,'net_revenue'));
 if(known.length!==sel.length){assert.equal(o.ws1.overall_margin,null);assert.equal(o.ws1.operating_remainder,null);}
 const totals=new Map();for(const r of sel)totals.set(r.product_id,(totals.get(r.product_id)||0)+Number(r.net_revenue));
 const top=[...totals].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,Math.ceil(.2*totals.size));
 assert.deepEqual(o.ws1.top_product_ids,top.map(r=>r[0]));assert.equal(o.ws1.top_product_revenue,top.reduce((n,r)=>n+r[1],0));
 close(o.ws1.top_product_share,o.ws1.top_product_revenue/o.ws1.revenue);
 close(o.ws1.identifiable_customer_coverage,sum(sel.filter(r=>r.customer_id),'net_revenue')/o.ws1.revenue);
 const c=cash.filter(r=>r.as_of===o.ws1.cash_as_of&&r.currency==='LAK'),d=due.filter(r=>r.currency==='LAK'&&r.due>=o.ws1.obligations_window[0]&&r.due<=o.ws1.obligations_window[1]);
 assert.equal(o.ws1.cash,sum(c,'available_cash'));assert.equal(o.ws1.known_due,sum(d,'amount'));assert.equal(o.ws1.snapshot_gap,o.ws1.cash-o.ws1.known_due);
 assert.equal(o.ws2.collection_mode,'OWNER_EXPORT');assert.equal(o.ws2.run_id,null);assert.equal(o.ws2.dataset_id,null);
 assert.equal(o.ws2.raw_count,feedback.length);assert.equal(o.ws2.included_count,included.length);assert.equal(o.ws2.raw_count,o.ws2.included_count+o.ws2.excluded_ids.length);
 const partition=Object.values(o.ws2.themes).flat();assert.equal(new Set(partition).size,partition.length);assert.deepEqual([...partition].sort(),included.map(r=>r.row_id).sort());
 close(o.ws2.delivery_share,o.ws2.themes.delivery.length/included.length);assert.equal(o.ws2.complaint_rate,null);assert.equal(o.ws2.market_size,null);
 assert(o.ws2.contrary_evidence_ids.includes('F016'));assert.equal(o.ws2.injection_row_ignored_as_instruction,'F020');
 assert.equal(o.ws3.differentiation,'unknown');assert.equal(o.ws3.winning_zone_proven,false);assert.equal(o.ws3.status,'PROVISIONAL');
 assert.equal(o.ws3.test.spend_approved,false);assert.equal(o.ws4.deployment,'NOT_DEPLOYED');assert.equal(o.ws4.private_data_excluded,true);
}
validateOutput(expected);
const mutants=[
 ['invented total',o=>o.ws1.revenue+=1],
 ['missing costs silently zero',o=>o.ws1.overall_margin=.4],
 ['theme double count',o=>o.ws2.themes.praise.push('F001')],
 ['invented Apify receipt',o=>{o.ws2.collection_mode='APIFY_LIVE';o.ws2.run_id='fake';}],
 ['sample promoted to complaint rate',o=>o.ws2.complaint_rate=.3],
 ['unknown competitor evidence promoted to proof',o=>o.ws3.winning_zone_proven=true],
 ['fabricated human review',o=>o.human_review='passed'],
 ['unauthorized publication',o=>o.public_deployment=true],
];
for(const[label,mutate]of mutants){const o=structuredClone(expected);mutate(o);assert.throws(()=>validateOutput(o),label);}
assert.equal(profile.public_copy.cta_target,'#collection');assert.equal(profile.public_copy.contact,null);
console.log(JSON.stringify({status:'PASS',scope:'Author comparison fixture: independent source recomputation and 8 rejected corruptions. Not an LLM behavior or Plus account test.',mutations:mutants.map(m=>m[0]),independent_model_rehearsal:'Separate release owner record',human_acceptance:'NOT_RECORDED',live_apify:'NOT_RUN'},null,2));

