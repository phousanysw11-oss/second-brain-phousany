/* Shared deterministic engine: Node CLI + embedded browser calculator. */
(function (root) {
  'use strict';
  const defaults = Object.freeze({money: Object.freeze([100000, 500000]), time: Object.freeze([15, 60]), repetition: Object.freeze([4, 20])});
  const present = x => typeof x === 'string' && x.trim() !== '' && x.trim() !== '?';
  function number(x) {
    if (x == null || (typeof x === 'string' && (x.trim() === '' || x.trim() === '?'))) return {kind:'missing', value:null};
    if (!['number','string'].includes(typeof x) || (typeof x === 'string' && !/^[+\-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+\-]?\d+)?$/i.test(x.trim()))) return {kind:'invalid', value:null};
    const value = Number(x);
    return Number.isFinite(value) && value >= 0 ? {kind:'ok', value} : {kind:'invalid', value:null};
  }
  function band(value, limits) { return value === 0 ? 0 : value <= limits[0] ? 1 : value <= limits[1] ? 2 : 3; }
  function thresholds(config) {
    const result = {};
    for (const key of Object.keys(defaults)) {
      const a = config?.[key] ?? defaults[key];
      if (!Array.isArray(a) || a.length !== 2 || a.some(x => number(x).kind !== 'ok') || Number(a[0]) <= 0 || Number(a[1]) <= Number(a[0])) throw Error('เกณฑ์ '+key+' ต้องเป็นตัวเลขบวก 2 ค่า เรียงจากน้อยไปมาก');
      result[key] = a.map(Number);
    }
    return result;
  }
  function evaluate(task, context, limits) {
    const missing=[], errors=[], notes=[];
    const read=(x,label)=>{const n=number(x); if(n.kind==='missing')missing.push(label);if(n.kind==='invalid')errors.push(label+': ต้องเป็นตัวเลขไม่ติดลบและมีค่าจำกัด');return n.value;};
    if (!present(task.name)) missing.push('ชื่องาน');
    if (!present(task.costIncludes)) missing.push('นิยามค่าใช้จ่าย');
    if (task.fixMinutes != null && number(task.fixMinutes).kind === 'invalid') errors.push('เวลาแก้ต้องเป็นตัวเลขไม่ติดลบและมีค่าจำกัด');
    if (task.business != null && task.business !== context.business) errors.push('ธุรกิจไม่ตรงกับชุดเปรียบเทียบ');
    if (task.period != null && task.period !== context.period) errors.push('ช่วงเวลาไม่ตรงกับชุดเปรียบเทียบ');
    const currency = task.currency ?? context.currency;
    if (currency !== 'LAK') errors.push('สกุลเงินต้องเป็น LAK');
    let money=read(task.money,'เงิน/ครั้ง'), minutes=read(task.time,'เวลาคน/ครั้ง');
    const timeUnit=task.timeUnit ?? 'minutes';
    if (!['minutes','hours'].includes(timeUnit)) {errors.push('หน่วยเวลาต้องเป็น minutes หรือ hours');minutes=null;}
    else if (minutes !== null && timeUnit==='hours') {minutes *= 60; notes.push('ชั่วโมงคน × 60 เป็นนาทีคน');}
    if (minutes !== null && !Number.isFinite(minutes)) {errors.push('เวลาแปลงแล้วเกินขอบเขตตัวเลข');minutes=null;}
    let impact=read(task.impact,'ผลกระทบ');
    if (impact !== null && (!Number.isInteger(impact) || impact > 3)) {errors.push('ผลกระทบต้องเป็นจำนวนเต็ม 0–3');impact=null;}
    if (!present(task.impactReason)) {missing.push('เหตุผลผลกระทบ');impact=null;}
    let monthly=read(task.frequency,'จำนวนครั้ง');
    const basis=task.frequencyBasis ?? 'monthly';
    if (task.monthly != null || task.daily != null || task.yearly != null) errors.push('ใช้ frequency กับ frequencyBasis ฐานเดียว ห้ามส่งยอดความถี่ซ้ำ');
    if (basis==='daily') {
      const days=read(task.workingDays,'วันทำงานจริงของงานในเดือนอ้างอิง');
      if (days !== null && (days > 31 || !Number.isInteger(days))) errors.push('วันทำงานจริงต้องเป็นจำนวนเต็ม 0–31');
      monthly=monthly === null || days === null ? null : monthly*days;
      notes.push('รายวัน × วันทำงานจริงของงาน ไม่ใช้ 30 โดยอัตโนมัติ');
    } else if (basis==='yearly') {if(monthly!==null)monthly/=12; notes.push('รายปี ÷ 12 เป็นค่าเฉลี่ยต่อเดือน ไม่ใช่จำนวนเกิดจริงเดือนนี้');}
    else if (!present(basis)) {missing.push('ฐานความถี่');monthly=null;}
    else if (basis!=='monthly') {errors.push('ฐานความถี่ต้องเป็น monthly, daily หรือ yearly');monthly=null;}
    if (monthly !== null && !Number.isFinite(monthly)) {errors.push('ความถี่แปลงแล้วเกินขอบเขตตัวเลข');monthly=null;}
    if(currency!=='LAK')money=null;
    const scores={money:money===null?null:band(money,limits.money),time:minutes===null?null:band(minutes,limits.time),impact,repetition:monthly===null?null:band(monthly,limits.repetition)};
    const total=missing.length || errors.length ? null : Object.values(scores).reduce((a,b)=>a+b,0);
    const inactive=monthly===0;
    if (!present(task.evidence)) notes.push('ขาดแหล่งข้อมูล/ฐานประมาณ ยังไม่ยืนยันค่าที่กรอก');
    return {name:task.name, impactReason:task.impactReason, scores,total,rank:null,inactive,status:errors.length?'invalid':missing.length?'missing':inactive?'inactive':'active',missing,errors,notes,normalized:{money,minutes,monthly},ease:{fixMinutes:task.fixMinutes,evidence:task.easeEvidence,basis:task.easeBasis}};
  }
  function rank(rows) {
    const active=rows.filter(x=>x.status==='active').sort((a,b)=>b.total-a.total || b.scores.impact-a.scores.impact);
    const ranked=[];
    for(let i=0;i<active.length;) {
      let j=i+1;
      while(j<active.length && active[j].total===active[i].total && active[j].scores.impact===active[i].scores.impact)j++;
      const group=active.slice(i,j);
      const ready=r=>r && number(r.fixMinutes).kind==='ok' && present(r.evidence) && present(r.basis);
      const hasEase=group.length>1 && group.every(x=>ready(x.ease)) && new Set(group.map(x=>x.ease.basis)).size===1;
      if(hasEase)group.sort((a,b)=>Number(a.ease.fixMinutes)-Number(b.ease.fixMinutes));
      let groupRank=i+1;
      group.forEach((x,k)=>{if(hasEase && k>0 && Number(x.ease.fixMinutes)!==Number(group[k-1].ease.fixMinutes))groupRank=i+k+1;x.rank=groupRank;x.tieBreak=hasEase?'verified ease':'score then impact; shared if equal';ranked.push(x);});
      i=j;
    }
    return ranked;
  }
  function audit(input) {
    if (!input || !Array.isArray(input.tasks)) throw Error('ต้องมี tasks เป็นรายการงาน');
    const context=input.context ?? {}, contextErrors=[];
    if(!present(context.business))contextErrors.push('ระบุธุรกิจเดียว');
    if(!present(context.period))contextErrors.push('ระบุเดือนหรือช่วงอ้างอิงร่วม');
    if(context.currency!=='LAK')contextErrors.push('สกุลเงินของชุดต้องเป็น LAK');
    const limits=thresholds(input.thresholds);
    const rows=input.tasks.map(t=>evaluate(t ?? {},context,limits));
    if(contextErrors.length)rows.forEach(x=>{x.errors.push(...contextErrors);x.status='invalid';x.total=null;});
    const ranked=rank(rows);
    return {context,thresholds:limits,contextErrors,rows,ranked};
  }
  function toCanonical(input) {
    const numeric=x=>number(x).kind==='ok'?Number(x):number(x).kind==='missing'?null:x;
    return {...input.context,thresholds:thresholds(input.thresholds),threshold_reason:input.thresholdReason,tasks:input.tasks.map(t=>{
      let minutes=numeric(t.time);if(typeof minutes==='number' && t.timeUnit==='hours')minutes*=60;
      const freq={unit:t.frequencyBasis ?? 'monthly',count:numeric(t.frequency)};
      if(freq.unit==='daily')freq.working_days_per_month=numeric(t.workingDays);
      const row={name:t.name,direct_cost_lak:numeric(t.money),cost_includes:t.costIncludes,human_minutes:minutes,impact:numeric(t.impact),impact_reason:t.impactReason,frequency:freq,evidence:t.evidence};
      for(const k of ['business','period','currency'])if(t[k]!=null)row[k]=t[k];
      if(t.fixMinutes!=null)Object.assign(row,{fix_minutes:numeric(t.fixMinutes),ease_evidence:t.easeEvidence,ease_basis:t.easeBasis});
      return row;
    })};
  }
  function fromCanonical(data) {
    if(!data || !Array.isArray(data.tasks))throw Error('ต้องมีรายการ tasks');
    const top=['business','period','currency','tasks','thresholds','threshold_reason'];
    if(Object.keys(data).some(k=>!top.includes(k)))throw Error('พบชื่อช่องระดับบนที่ไม่รองรับ');
    const allowed=['name','direct_cost_lak','cost_includes','human_minutes','impact','impact_reason','frequency','evidence','business','period','currency','fix_minutes','ease_evidence','ease_basis'];
    return {context:{business:data.business,period:data.period,currency:data.currency},thresholds:data.thresholds,thresholdReason:data.threshold_reason??'เกณฑ์เริ่มต้นที่อนุมัติ เป็น heuristic',tasks:data.tasks.map(t=>{
      if(!t || typeof t!=='object' || Object.keys(t).some(k=>!allowed.includes(k)))throw Error('พบช่องงานที่ไม่รองรับ');
      const f=t.frequency??{};
      if(typeof f!=='object' || Object.keys(f).some(k=>!['unit','count',...(f.unit==='daily'?['working_days_per_month']:[])].includes(k)))throw Error('ฐานความถี่ผิดหรือมีการนับซ้ำ');
      const r={name:t.name??'',money:t.direct_cost_lak??'',costIncludes:t.cost_includes??'',time:t.human_minutes??'',timeUnit:'minutes',impact:t.impact??'',impactReason:t.impact_reason??'',frequency:f.count??'',frequencyBasis:f.unit??'',workingDays:f.working_days_per_month??'',evidence:t.evidence??''};
      for(const k of ['business','period','currency'])if(t[k]!=null)r[k]=t[k];
      if(t.fix_minutes!=null)Object.assign(r,{fixMinutes:t.fix_minutes,easeEvidence:t.ease_evidence,easeBasis:t.ease_basis});
      return r;
    })};
  }
  const api={defaults,number,band,thresholds,audit,toCanonical,fromCanonical};
  if(typeof module!=='undefined' && module.exports){module.exports=api;if(require.main===module){try{const fs=require('node:fs');process.stdout.write(JSON.stringify(audit(JSON.parse(fs.readFileSync(process.argv[2],'utf8'))),null,2)+'\n');}catch(e){process.stderr.write(e.message+'\n');process.exitCode=1;}}}
  else root.TaskPriority=api;
})(globalThis);
