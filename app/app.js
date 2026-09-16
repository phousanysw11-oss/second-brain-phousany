const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={Today:'วันนี้',Week:'สัปดาห์',Month:'เดือน',Projects:'โครงการ',Team:'ทีม', 'Second Brain':'ความรู้'};
const statusLabel={todo:'ยังไม่เริ่ม',doing:'กำลังทำ',blocked:'ติดขัด',done:'เสร็จแล้ว'};
const deptLabel={operations:'Operation',marketing:'การตลาด',sourcing:'หาสินค้า',bd:'BD',admin:'แอดมิน',purchasing:'จัดซื้อ',warehouse:'คลังสินค้า',cod:'COD',service:'บริการลูกค้า',finance:'การเงิน',hr:'HR'};
const today=()=>new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Vientiane'});
let state,localToken,config,view='Today',snapshot={records:[]},live=null,idToken='',refreshTimer=null,notes=[];
function notice(text,error=false){$('#notice').textContent=text;$('#notice').className=error?'error':'';}
async function request(url,options={}){const r=await fetch(url,options),d=await r.json();if(!r.ok)throw new Error(d.error||'อ่านข้อมูลไม่สำเร็จ');return d;}
async function save(next){const result=await request('/api/state',{method:'PUT',headers:{'content-type':'application/json','x-local-token':localToken},body:JSON.stringify(next)});state=result;notice('บันทึกลงโฟลเดอร์แล้ว · revision '+state.revision);render();}
function heading(title,sub,button=''){return `<div class="heading"><div><h1>${esc(title)}</h1><p class="sub">${esc(sub)}</p></div>${button}</div>`;}
function stats(tasks){const done=tasks.filter(t=>t.status==='done').length,late=tasks.filter(t=>t.due&&t.due<today()&&t.status!=='done').length;return `<div class="summary"><div class="stat"><strong>${tasks.length}</strong><span>งานที่บันทึก</span></div><div class="stat"><strong>${done}</strong><span>เสร็จพร้อมหลักฐาน</span></div><div class="stat"><strong>${late}</strong><span>เกินวันส่ง</span></div><div class="stat"><strong>${tasks.filter(t=>t.status==='blocked').length}</strong><span>ติดขัด</span></div></div>`;}
function taskRows(tasks,shared=false){if(!tasks.length)return '<div class="empty"><strong>พื้นที่สำหรับงานที่สำคัญ</strong>เพิ่มงานจริงหนึ่งเรื่อง ระบุผลส่งมอบและขั้นตอนถัดไป แล้วเริ่มลงมือทำ</div>';return tasks.map(t=>`<article class="task"><span class="dot ${esc(t.status)}" aria-hidden="true"></span><div><div class="task-title">${esc(t.title)} ${t.priority==='focus'?'<span class="tag">โฟกัสวันนี้</span>':''}</div><div class="meta">${esc(statusLabel[t.status])} · ${esc(t.owner||'ยังไม่ระบุผู้รับผิดชอบ')} · ${esc(t.project||'ยังไม่ระบุโครงการ')} <span class="${t.due&&t.due<today()&&t.status!=='done'?'late':''}">${t.due?'· ส่ง '+esc(t.due):'· ยังไม่กำหนดวันส่ง'}</span></div>${t.next?`<p class="task-next">ขั้นต่อไป: ${esc(t.next)}</p>`:''}${t.status==='blocked'?`<p class="task-next error">ติดขัด: ${esc(t.blocker||'ยังไม่ระบุเหตุผล')}</p>`:''}${t.status==='done'?`<p class="task-next">หลักฐาน: ${esc(t.evidence)}</p>`:''}</div>${shared?`<span class="tag">${esc(deptLabel[t.department]||t.department)}</span>`:`<button data-edit="${esc(t.id)}">เปิดงาน</button>`}</article>`).join('');}
function profile(){return `<section class="panel"><h2>หน้าที่และเป้าหมายของฉัน</h2><form id="profileForm"><div class="form-grid"><label>ชื่อ<input name="name" value="${esc(state.profile.name)}" required></label><label>แผนก<select name="department">${Object.entries(deptLabel).map(([k,v])=>`<option value="${k}" ${state.profile.department===k?'selected':''}>${v}</option>`).join('')}</select></label><label>หน้าที่<input name="role" value="${esc(state.profile.role)}" required></label><label>เป้าหมายที่รับผิดชอบ<input name="goal" value="${esc(state.profile.goal)}" required></label></div><p class="muted">ข้อมูลนี้ใช้ช่วยวางแผนของคุณ สิทธิ์ข้อมูลทีมกำหนดจากบัญชีที่ผู้ดูแลยืนยัน</p><button class="primary">บันทึกโปรไฟล์</button></form></section>`;}
function safeLink(v){try{const u=new URL(v);return ['https:','http:'].includes(u.protocol)?u.href:'#';}catch{return '#';}}
function render(){
 $('#identity').textContent=(state.profile.name||'ผู้เรียนใหม่')+' · '+(deptLabel[state.profile.department]||'กรอกโปรไฟล์เพื่อเริ่ม');
 $('#nav').innerHTML=Object.entries(labels).map(([k,v])=>`<button data-view="${k}" class="${view===k?'active':''}" ${view===k?'aria-current="page"':''}>${k} <small>· ${v}</small></button>`).join('');
 const add='<button class="primary" id="addTask">+ เพิ่มงาน</button>';let html='';
 if(view==='Today'){
  const tasks=state.tasks.filter(t=>t.status!=='done').sort((a,b)=>(b.priority==='focus')-(a.priority==='focus')||(a.due||'9999').localeCompare(b.due||'9999'));
  html=heading('วันนี้ทำอะไรให้เสร็จ','เลือกจากวันส่ง ผลกระทบ และงานที่คนอื่นรอ',add)+stats(state.tasks);
  if(!state.profile.name)html+=profile();
  html+=`<h2>งานสำคัญของฉัน</h2>${taskRows(tasks)}`;
 }else if(view==='Week'||view==='Month'){
  const now=new Date(today()+'T12:00:00+07:00'),end=new Date(now);end.setDate(now.getDate()+6);const endStr=end.toLocaleDateString('en-CA',{timeZone:'Asia/Vientiane'});
  const tasks=state.tasks.filter(t=>view==='Month'?(t.due||'').slice(0,7)===today().slice(0,7):t.due&&t.due>=today()&&t.due<=endStr).sort((a,b)=>a.due.localeCompare(b.due));
  html=heading(view==='Week'?'แผน 7 วันข้างหน้า':'งานในเดือนนี้',view==='Week'?today()+' ถึง '+endStr:today().slice(0,7),add)+stats(tasks)+taskRows(tasks)+`<h2>งานที่ยังไม่กำหนดวันส่ง</h2>${taskRows(state.tasks.filter(t=>!t.due&&t.status!=='done'))}`;
 }else if(view==='Projects'){
  const projects=[...new Set(state.tasks.map(t=>t.project||'ยังไม่ระบุโครงการ'))];html=heading('โครงการของฉัน','ผลลัพธ์ของโครงการเกิดจากงานที่มีผู้รับผิดชอบ',add);
  html+=projects.length?projects.map(p=>`<section class="week-group"><h2>${esc(p)}</h2>${taskRows(state.tasks.filter(t=>(t.project||'ยังไม่ระบุโครงการ')===p))}</section>`).join(''):'<div class="empty">เพิ่มงานแล้วระบุโครงการ งานจะรวมอยู่ที่นี่</div>';
 }else if(view==='Team'){
  const data=live||snapshot,rows=data.records||[];
  html=heading('ผลงานของทีม','ดูการทำงานควบคู่กับ KPI ผลลัพธ์','<button id="refresh">อ่านข้อมูลใหม่</button>');
  html+=`<p class="kpi-note">${live?'อ่านจากแหล่งผ่านบัญชีที่ตรวจสิทธิ์แล้ว':'ข้อมูลตามวันที่ในไฟล์ที่ผู้สอนจัดให้'} · ${esc(data.collectedAt||'ยังไม่มีข้อมูล')}<br>ข้อมูลสองแท็บอาจต่างกันและยังไม่ตรวจต้นทางทุกสูตร การมีค่าหรือ % บรรลุไม่ใช่หลักฐานว่าผลงานผ่าน</p>`;
  html+=`<h2>งานของทีม</h2>${live?stats(live.tasks||[])+taskRows(live.tasks||[],true):'<p class="muted">งานร่วมของทีมจะแสดงหลังเชื่อม gateway ส่วนงานของคุณยังบันทึกในเครื่องได้</p>'}`;
  html+='<h2>KPI จากต้นทาง</h2><div class="toolbar"><input id="kpiSearch" aria-label="ค้นหา KPI" placeholder="ค้นหาตัวชี้วัด / แผนก"></div>';
  html+=rows.length?`<div class="table-wrap"><table id="kpiTable"><thead><tr><th>ตัวชี้วัดและแหล่ง</th><th>เป้า/วัน</th><th>เป้า/เดือน</th><th>ผลจริงในชีต</th><th>% ตามชีต</th></tr></thead><tbody>${rows.map(r=>`<tr><td class="metric"><strong>${esc(r.label)}</strong><span class="source">${esc(r.departmentLabel||r.department)} · ${esc(r.unit)} · ${esc(r.period)}</span><a class="source" target="_blank" rel="noopener" href="${esc(safeLink(r.sourceUrl))}">${esc(r.sheet)}!${esc(r.range)}</a>${(r.flags||[]).map(f=>`<span class="flag">${esc(f)}</span>`).join('')}</td><td>${esc(r.dailyTarget||'—')}</td><td>${esc(r.monthlyTarget||'—')}</td><td>${esc(r.actualDisplay===''||r.actualDisplay==null?'ยังไม่ทราบ':r.actualDisplay)}</td><td>${esc(r.attainmentDisplay||'—')}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty"><strong>ยังไม่มีข้อมูลที่เปิดได้</strong>เชื่อม Google เมื่อผู้ดูแลตั้งค่าแล้ว หรือวาง team-data.json ที่ผู้สอนจัดให้ตามสิทธิ์ใน data/</div>';
  if(data.issues?.length)html+='<p class="error">มี '+data.issues.length+' ตัวชี้วัดที่โครงสร้างเปลี่ยน ต้องให้ผู้ดูแลตรวจ mapping</p>';
 }else{
  html=heading('Second Brain ของฉัน','หน้าที่ งาน ความรู้ และบทเรียนอยู่ในโฟลเดอร์เดียว')+profile();
  html+='<section class="panel"><h2>โน้ตที่กลับมาใช้ได้</h2><form id="noteForm" class="inline-note"><label>ชื่อเรื่อง<input name="title" required></label><label>สิ่งที่เรียนรู้ / แหล่งที่มา<textarea name="text" rows="4" required></textarea></label><button class="primary">บันทึกโน้ต</button></form></section>';
  html+='<h2>ไฟล์ความรู้</h2><p class="muted">แก้และสรุปความรู้ด้วย AI ในโฟลเดอร์นี้ แล้ว Rebuild เพื่อดูใน 3D Brain</p><div class="note-list">'+notes.map(n=>`<button data-note="${esc(n)}">${esc(n.split('/').pop().replace('.md',''))}<small>${esc(n)}</small></button>`).join('')+'</div>';
 }
 $('#content').innerHTML=html;
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=async()=>{view=b.dataset.view;if(view==='Second Brain')notes=await request('/api/files');render();});
 document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>edit(b.dataset.edit));
 $('#addTask')?.addEventListener('click',()=>edit());
 $('#refresh')?.addEventListener('click',()=>refresh().catch(e=>notice(e.message,true)));
 $('#profileForm')?.addEventListener('submit',async e=>{e.preventDefault();try{const p=Object.fromEntries(new FormData(e.target));await save({...state,profile:p});}catch(e){notice(e.message,true);}});
 $('#noteForm')?.addEventListener('submit',async e=>{e.preventDefault();try{const d=await request('/api/note',{method:'POST',headers:{'content-type':'application/json','x-local-token':localToken},body:JSON.stringify(Object.fromEntries(new FormData(e.target)))});notes=await request('/api/files');render();notice('บันทึก '+d.path+' แล้ว เปิด 3D Brain และกด Rebuild');}catch(e){notice(e.message,true);}});
 document.querySelectorAll('[data-note]').forEach(b=>b.onclick=async()=>{try{const d=await request('/api/read?path='+encodeURIComponent(b.dataset.note));$('#readText').textContent=d.text;$('#reader').showModal();}catch(e){notice(e.message,true);}});
 $('#kpiSearch')?.addEventListener('input',e=>document.querySelectorAll('#kpiTable tbody tr').forEach(r=>r.hidden=!r.textContent.toLowerCase().includes(e.target.value.toLowerCase())));
}
function edit(id){const t=state.tasks.find(t=>t.id===id)||{id:crypto.randomUUID(),title:'',owner:state.profile.name,project:'',due:'',priority:'normal',next:'',doneWhen:'',evidence:'',status:'todo',blocker:''};const f=$('#taskForm');for(const k of ['id','title','owner','project','due','priority','next','doneWhen','evidence','status','blocker'])f.elements[k].value=t[k]||'';$('#formError').textContent='';$('#editor').showModal();}
$('#closeEditor').onclick=()=>$('#editor').close();$('#closeReader').onclick=()=>$('#reader').close();
$('#taskForm').onsubmit=async e=>{
 e.preventDefault();const t=Object.fromEntries(new FormData(e.target)),old=state.tasks.find(x=>x.id===t.id);if(old?.sharedId){t.sharedId=old.sharedId;t.sharedRevision=old.sharedRevision;}
 if(t.status==='done'&&(!t.doneWhen.trim()||!t.evidence.trim())){$('#formError').textContent='ก่อนปิดงาน ระบุเกณฑ์เสร็จและหลักฐานผลงาน';return;}
 try{
  const tasks=state.tasks.some(x=>x.id===t.id)?state.tasks.map(x=>x.id===t.id?t:x):[...state.tasks,t];await save({...state,tasks});$('#editor').close();
  if(idToken){
   try{const result=await gateway('/api/task',{method:'POST',body:JSON.stringify({...t,id:t.sharedId,revision:t.sharedRevision})});const updated=state.tasks.map(x=>x.id===t.id?{...x,sharedId:result.task.id,sharedRevision:result.task.revision}:x);await save({...state,tasks:updated});notice('บันทึกในเครื่องและส่งเข้ารายการทีมแล้ว');await refresh();}
   catch(err){notice('บันทึกในเครื่องแล้ว แต่ส่งเข้าทีมไม่สำเร็จ: '+err.message,true);}
  }
 }catch(err){$('#formError').textContent=err.message;}
};
async function gateway(p,options={}){if(!config.gatewayUrl||!config.googleClientId)throw Error('ผู้ดูแลยังไม่ได้ตั้งค่าการเชื่อมต่อ');const url=new URL(config.gatewayUrl);if(url.protocol!=='https:')throw Error('gateway ต้องใช้ HTTPS');return request(config.gatewayUrl.replace(/\/$/,'')+p,{...options,headers:{authorization:'Bearer '+idToken,'content-type':'application/json',...(options.headers||{})}});}
async function refresh(){
 if(!idToken){snapshot=await request('/api/team-snapshot');render();notice('อ่านไฟล์ข้อมูลตามวันที่แล้ว ยังไม่ได้เชื่อมอัตโนมัติ');return;}
 try{live=await gateway('/api/data');if(view==='Team')render();notice('อ่านข้อมูลใหม่เมื่อ '+new Date(live.collectedAt).toLocaleTimeString('th-TH'));}
 catch(e){live=null;if(view==='Team')render();notice('อ่านข้อมูลสดไม่สำเร็จ: '+e.message+' · ข้อมูลไฟล์เป็นข้อมูลตามวันที่',true);throw e;}
}
$('#connect').onclick=async()=>{
 if(idToken){idToken='';live=null;clearInterval(refreshTimer);$('#connect').textContent='เชื่อม Google';render();notice('ออกจากระบบแล้ว หยุดอ่านข้อมูลอัตโนมัติ');return;}
 if(!config.googleClientId||!config.gatewayUrl){notice('ผู้ดูแลต้องตั้งค่า gatewayUrl และ googleClientId ก่อน ขณะนี้ยังไม่เชื่อมข้อมูลอัตโนมัติ',true);return;}
 try{
  if(!window.google?.accounts){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.onload=resolve;s.onerror=reject;document.head.append(s);});}
  let box=$('#connectBox');if(!box){box=document.createElement('div');box.id='connectBox';$('#notice').after(box);}box.textContent='เข้าสู่ระบบด้วยบัญชีที่ผู้ดูแลกำหนดสิทธิ์ ';
  google.accounts.id.initialize({client_id:config.googleClientId,callback:async response=>{idToken=response.credential;live=null;box.remove();$('#connect').textContent='ออกจาก Google';try{const who=await gateway('/api/identity');await refresh();refreshTimer=setInterval(()=>refresh().catch(()=>{}),Math.max(60,Number(config.refreshSeconds)||60)*1000);}catch(e){try{const who=await gateway('/api/identity');notice('ยังไม่พร้อมอ่านทีม: '+e.message+' · แจ้งผู้ดูแล Account ID: '+who.sub,true);}catch{notice('การเข้าสู่ระบบไม่สำเร็จ',true);}}}});
  google.accounts.id.renderButton(box,{theme:'outline',size:'large'});
 }catch{notice('เปิด Google Sign-In ไม่สำเร็จ ตรวจอินเทอร์เน็ตและการตั้งค่า',true);}
};
$('#backup').onclick=()=>{const b=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='second-brain-backup-'+today()+'.json';a.click();URL.revokeObjectURL(a.href);notice('ดาวน์โหลดสำรองแล้ว เก็บไฟล์นี้ในที่ส่วนตัว');};
try{const d=await request('/api/init');state=d.state;localToken=d.token;config=d.config;$('#brainLink').href=d.brainUrl;snapshot=await request('/api/team-snapshot');render();notice('ข้อมูลในเครื่องพร้อมใช้งาน · การเชื่อมอัตโนมัติ '+(config.gatewayUrl?'รอเข้าสู่ระบบ':'ยังไม่ตั้งค่า'));}catch(e){notice('เปิดไม่ได้: '+e.message,true);}
