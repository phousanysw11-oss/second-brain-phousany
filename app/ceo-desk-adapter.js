/* Runs after the unchanged Desk script in the served copy. Server state is authoritative. */
let deskRevision,deskToken,deskReady=false,deskSaving=false;
const originalRender=render;
const controls=disabled=>document.querySelectorAll('button,input,textarea,select').forEach(e=>e.disabled=disabled);
render=function(){originalRender();$('demoNotice').textContent='FICTIONAL TRAINING DATA · '+data.profile.business+'. These tasks and events are examples, not real business records.';if(!deskReady||deskSaving)controls(true)};
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
