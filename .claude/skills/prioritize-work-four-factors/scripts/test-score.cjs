'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const s=require('./score.cjs');let checks=0;
function eq(a,b){assert.deepEqual(a,b);checks++;}
const base={name:'งาน',money:0,time:0,impact:0,impactReason:'ตรวจแล้วไม่มีผลเสีย',frequency:1,costIncludes:'ไม่รวมค่าแรง',timeUnit:'minutes',frequencyBasis:'monthly'};
const input=tasks=>({context:{business:'สมมติ',period:'เดือนสมมติ',currency:'LAK'},tasks,thresholdReason:'ใช้ค่าเริ่มต้น'});
const row=changes=>s.audit(input([{...base,...changes}])).rows[0];
const examples=s.fromCanonical(JSON.parse(fs.readFileSync(path.join(__dirname,'../assets/example.json'),'utf8')));
eq(s.audit(examples).ranked.map(x=>x.total),[10,7,4]);
for(const [key,[lo,hi]] of Object.entries(s.defaults))for(const [value,want] of [[0,0],[0.001,1],[lo-0.001,1],[lo,1],[lo+0.001,2],[hi-0.001,2],[hi,2],[hi+0.001,3]])eq(s.band(value,s.defaults[key]),want);
for(const field of ['money','time','impact','frequency'])for(const value of ['',null,'?',undefined]){const r=row({[field]:value});eq(r.total,null);eq(r.rank,null);}
for(const field of ['money','time','impact','frequency'])for(const value of [-1,NaN,Infinity,-Infinity,true,{},'1,000','abc'])eq(row({[field]:value}).status,'invalid');
for(const value of [4,0.5])eq(row({impact:value}).status,'invalid');
eq(row({impactReason:'?'}).total,null);eq(row({money:0,time:0,impact:0,frequency:0}).total,0);eq(row({frequency:0,money:999999,time:99,impact:3}).rank,null);
eq(row({frequency:0.5}).scores.repetition,1);
eq(row({time:1.5,timeUnit:'hours'}).normalized.minutes,90);
eq(row({time:1,timeUnit:'days'}).status,'invalid');
eq(row({frequency:2,frequencyBasis:'daily',workingDays:22}).normalized.monthly,44);
eq(row({frequency:2,frequencyBasis:'daily'}).total,null);
eq(row({frequency:2,frequencyBasis:'daily',workingDays:0}).rank,null);
for(const days of [-1,1.5,32])eq(row({frequency:2,frequencyBasis:'daily',workingDays:days}).status,'invalid');
eq(row({frequency:6,frequencyBasis:'yearly'}).normalized.monthly,0.5);
eq(row({frequency:1,frequencyBasis:'weekly'}).status,'invalid');
eq(row({monthly:2}).status,'invalid');
for(const [field,value] of [['currency','USD'],['business','อื่น'],['period','อื่น']])eq(row({[field]:value}).status,'invalid');
let ties=s.audit(input([{...base,name:'A'}, {...base,name:'B'}])).ranked;eq(ties.map(x=>x.rank),[1,1]);
ties=s.audit(input([{...base,name:'A',money:1},{...base,name:'B',impact:1}])).ranked;eq(ties.map(x=>x.name),['B','A']);eq(ties.map(x=>x.rank),[1,2]);
const ease={fixMinutes:10,easeEvidence:'ตรวจขั้นตอนและเวลาแล้ว',easeBasis:'สร้าง ทดสอบ ฝึกทีม'};
ties=s.audit(input([{...base,name:'A',...ease},{...base,name:'B',...ease,fixMinutes:5}])).ranked;eq(ties.map(x=>x.name),['B','A']);eq(ties.map(x=>x.rank),[1,2]);
ties=s.audit(input([{...base,...ease},{...base}])).ranked;eq(ties.map(x=>x.rank),[1,1]);
ties=s.audit(input([{...base,...ease},{...base,...ease,easeBasis:'ต่าง'}])).ranked;eq(ties.map(x=>x.rank),[1,1]);
const custom=input([{...base,money:20},{...base,money:20}]);custom.thresholds={money:[10,30],time:[15,60],repetition:[4,20]};eq(s.audit(custom).rows.map(x=>x.scores.money),[2,2]);
for(const invalid of [[0,1],[2,1],[1,1],[1,Infinity],[-1,2]]){assert.throws(()=>s.thresholds({money:invalid}));checks++;}
const round=s.fromCanonical(s.toCanonical({...examples,thresholdReason:'ทดสอบ'}));eq(s.audit(round).ranked.map(x=>x.total),[10,7,4]);
const hours=input([{...base,time:1.5,timeUnit:'hours'}]);eq(s.toCanonical(hours).tasks[0].human_minutes,90);
assert.throws(()=>s.fromCanonical({business:'x',tasks:[{frequency:{unit:'monthly',count:1,working_days_per_month:22}}]}));checks++;
const html=fs.readFileSync(path.join(__dirname,'../assets/calculator.html'),'utf8');const engine=fs.readFileSync(path.join(__dirname,'score.cjs'),'utf8');assert.ok(html.includes(engine));checks++;
console.log(JSON.stringify({checks,examples:[10,7,4],status:'PASS'}));
