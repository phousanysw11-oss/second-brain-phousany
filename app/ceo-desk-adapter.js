/* Runs after the unchanged Desk script in the served copy. Server state is authoritative. */
let deskRevision,deskToken,deskReady=false,deskSaving=false;
const deskFields=[['project','Project'],['priority','Priority / focus'],['next','Next action'],['doneWhen','Done when'],['evidence','Evidence / result to check'],['blocker','Waiting for / blocker']];
const taskForm=$('taskForm'),taskTools=taskForm.querySelector('.tools');
for(const [key,label]of deskFields){const wrapper=node('label'),caption=node('span',label),input=document.createElement(['doneWhen','evidence','blocker'].includes(key)?'textarea':'input');input.id='detail_'+key;input.maxLength=5000;if(input.tagName==='TEXTAREA')input.rows=2;wrapper.append(caption,input);taskForm.insertBefore(wrapper,taskTools)}
$('taskTitle').maxLength=240;$('taskOwner').maxLength=5000;$('taskSources').maxLength=2800;
const completionHint=node('p','Marking done records your report. Evidence and the completion criterion still need review.','muted');taskForm.insertBefore(completionHint,taskTools);
const originalEditTask=editTask;
editTask=function(id){originalEditTask(id);const task=data.tasks.find(t=>t.id===id)||{};for(const [key]of deskFields)$('detail_'+key).value=task[key]||''};
taskForm.onsubmit=e=>{e.preventDefault();try{
 const old=data.tasks.find(t=>t.id===$('taskId').value)||{},task={...old,id:old.id||'TASK-'+crypto.randomUUID(),title:$('taskTitle').value.trim(),owner:$('taskOwner').value.trim(),due:$('taskDue').value,status:$('taskStatus').value,review_status:$('taskReview').value,source_ids:$('taskSources').value.split(',').map(s=>s.trim()).filter(Boolean)};
 for(const [key]of deskFields)task[key]=$('detail_'+key).value.trim();
 const next=clone(data),index=next.tasks.findIndex(t=>t.id===task.id);if(index<0)next.tasks.push(task);else next.tasks[index]=task;validate(next);data=next;persist();render();
 }catch(e){say(e.message,true)}};
const resultDialog=document.createElement('dialog');resultDialog.id='resultDialog';resultDialog.setAttribute('aria-labelledby','resultHeading');const resultHeading=node('h2','Saved result');resultHeading.id='resultHeading';const resultText=node('pre');resultText.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;font:inherit';resultDialog.append(resultHeading,resultText,button('Close',()=>resultDialog.close()));document.body.append(resultDialog);
const safeStyles=node('style','dialog{max-height:90dvh;overflow-y:auto}.task p,.result{overflow-wrap:anywhere}.task-detail{white-space:pre-wrap}');document.head.append(safeStyles);
const originalRender=render;
const controls=disabled=>document.querySelectorAll('button,input,textarea,select').forEach(e=>e.disabled=disabled);
render=function(){originalRender();$('demoNotice').textContent='FICTIONAL TRAINING DATA · '+data.profile.business+'. These tasks and events are examples, not real business records.';
 const filter=$('taskFilter').value,visible=data.tasks.filter(t=>filter==='all'||(filter==='done'?t.status==='done':t.status!=='done'));
 document.querySelectorAll('#taskList article.task').forEach((row,i)=>{const task=visible[i],actions=row.querySelector('.tools');for(const [key,label]of deskFields)if(task[key])row.insertBefore(node('p',label+': '+task[key],'muted task-detail'),actions);if(task.status==='done')row.insertBefore(node('p',task.evidence&&task.doneWhen?'Reported done · review the stated evidence and completion criterion.':'Reported done · evidence or completion criterion still missing.','muted'),actions)});
 document.querySelectorAll('#resultList .result').forEach((row,i)=>{const result=data.results[i];if(result.source?.endsWith('.md'))row.append(button('Read saved result',async()=>{resultHeading.textContent=result.title;resultText.textContent='Loading saved file…';resultDialog.showModal();try{const r=await deskRequest('/api/read?path='+encodeURIComponent(result.source));resultText.textContent=r.text}catch(e){resultText.textContent='Could not read saved result: '+e.message}}))});
 if(!deskReady||deskSaving)controls(true)};
controls(true);
async function deskRequest(url,options={}){const r=await fetch(url,options),body=await r.json();if(!r.ok)throw Error(body.error||'Could not save');return body}
async function loadCanonicalDesk(){
 try{const r=await deskRequest('/api/ceo-desk');deskRevision=r.revision;deskToken=r.token;data=r.desk;deskReady=true;controls(false);$('applyImport').disabled=true;render();$('saveInfo').textContent='Saved in this project folder · revision '+deskRevision;
 $('profileInfo').textContent+=' · One local company state';
 }catch(e){say('Desk unavailable: '+e.message,true)}
}
persist=function(){
 if(!deskReady||deskSaving){say('Wait for the current save to finish.',true);return false}
 deskSaving=true;controls(true);$('saveInfo').textContent='Saving to project folder…';
 deskRequest('/api/ceo-desk',{method:'PUT',headers:{'content-type':'application/json','x-local-token':deskToken},body:JSON.stringify({revision:deskRevision,desk:clone(data)})}).then(r=>{
  deskRevision=r.revision;data=r.desk;deskSaving=false;controls(false);render();$('saveInfo').textContent='Saved in this project folder · revision '+deskRevision;
  for(const id of ['taskDialog','profileDialog','importDialog'])if($(id).open)$(id).close();
  say(r.warning||'Saved to data/state.json. Completion marks are user reports until evidence is checked.',!!r.warning);
 }).catch(e=>{deskSaving=false;deskReady=false;controls(true);$('backup').disabled=false;$('saveInfo').textContent='Save unconfirmed · Download backup before reloading';say(e.message+' Save was not confirmed. Download your attempted edits as a backup, then reload to inspect the current project state.',true)});
 return false; // The asynchronous server acknowledgement closes dialogs, never a browser cache.
};
const originalPreview=$('previewImport').onclick;
$('previewImport').onclick=()=>{originalPreview();if(pending&&pending.data.workspace_id!==data.workspace_id){pending=null;$('applyImport').disabled=true;$('importFeedback').textContent='Rejected: this backup belongs to another company.'}};
$('refreshText').closest('dialog').querySelector('h2').textContent='Refresh in Codex';
loadCanonicalDesk();
