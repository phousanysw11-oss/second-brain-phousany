/* Development-only browser test. Set CEO_PLAYWRIGHT to an available playwright module. */
const fs=require('node:fs/promises'),path=require('node:path'),os=require('node:os'),net=require('node:net');
const {spawn}=require('node:child_process');const assert=require('node:assert/strict');
const {chromium}=require(process.env.CEO_PLAYWRIGHT||'playwright');
const source=path.resolve(__dirname,'..');
(async()=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'ceo-browser-'));let server,browser;
 const output=process.env.CEO_TEST_EVIDENCE||path.join(root,'evidence');await fs.mkdir(output,{recursive:true});
 const results=[];
 try{
  for(const dir of ['app','demo'])await fs.cp(path.join(source,dir),path.join(root,dir),{recursive:true});
  const asset='.agents/skills/bni-second-brain/assets/CEO_DESK.html';await fs.mkdir(path.dirname(path.join(root,asset)),{recursive:true});await fs.copyFile(path.join(source,asset),path.join(root,asset));
  await fs.mkdir(path.join(root,'data'));await fs.copyFile(path.join(root,'demo/company/state.json'),path.join(root,'data/state.json'));
  const port=await new Promise(resolve=>{const s=net.createServer();s.listen(0,'127.0.0.1',()=>{const p=s.address().port;s.close(()=>resolve(p))})});
  const url=`http://127.0.0.1:${port}`;
  async function start(){server=spawn(process.execPath,[path.join(root,'app/server.mjs')],{cwd:root,env:{...process.env,TRAINING_PORT:String(port),NO_BRAIN:'1',NO_OPEN:'1'},windowsHide:true,stdio:'pipe'});for(let i=0;i<60;i++){try{if((await fetch(url+'/api/ceo-desk')).ok)return}catch{}await new Promise(r=>setTimeout(r,100))}throw Error('Test server did not start')}
  await start();browser=await chromium.launch({headless:true,...(process.env.CEO_BROWSER_CHANNEL?{channel:process.env.CEO_BROWSER_CHANNEL}:{})});
  let page=await browser.newPage({viewport:{width:1300,height:950}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url+'/ceo-desk');await page.waitForFunction(()=>document.querySelector('#saveInfo').textContent.includes('project folder'));assert.match(await page.locator('#demoNotice').textContent(),/Lotus Home Demo/);assert.doesNotMatch(await page.locator('#demoNotice').textContent(),/Mekong Brew/);
  const saved=()=>page.waitForFunction(()=>document.querySelector('#saveInfo').textContent.includes('Saved in this project folder')&&!document.querySelector('#addTask').disabled);
  await page.locator('#addTask').click();await page.locator('#taskTitle').fill('Browser persistence test');await page.locator('#taskOwner').fill('Synthetic Owner');await page.locator('#taskDue').fill('2026-10-12');await page.locator('#taskForm button[type=submit]').click();await saved();
  let state=JSON.parse(await fs.readFile(path.join(root,'data/state.json'),'utf8'));let task=state.tasks.find(t=>t.title==='Browser persistence test');assert.ok(task);results.push('add task saved to canonical state');
  let row=page.locator('article.task').filter({hasText:'Browser persistence test'});await row.getByRole('button',{name:'Edit',exact:true}).click();await page.locator('#taskTitle').fill('Edited persistence test');await page.locator('#taskForm button[type=submit]').click();await saved();
  row=page.locator('article.task').filter({hasText:'Edited persistence test'});await row.getByRole('button',{name:'Mark done',exact:true}).click();await saved();await page.locator('#taskFilter').selectOption('all');
  state=JSON.parse(await fs.readFile(path.join(root,'data/state.json'),'utf8'));task=state.tasks.find(t=>t.id===task.id);assert.equal(task.status,'done');assert.equal(task.completion.kind,'user_reported');results.push('edit/complete marks unverified user report');
  await page.reload();await saved();await page.locator('#taskFilter').selectOption('all');row=page.locator('article.task').filter({hasText:'Edited persistence test'});await row.getByRole('button',{name:'Reopen',exact:true}).click();await saved();results.push('reload and reopen persist');
  const dl=page.waitForEvent('download');await page.locator('#backup').click();const download=await dl;await download.saveAs(path.join(output,'desk-backup.json'));const backup=JSON.parse(await fs.readFile(path.join(output,'desk-backup.json'),'utf8'));
  row=page.locator('article.task').filter({hasText:'Edited persistence test'});await row.getByRole('button',{name:'Edit',exact:true}).click();await page.locator('#taskTitle').fill('Temporary change');await page.locator('#taskForm button[type=submit]').click();await saved();
  await page.locator('#openImport').click();await page.locator('#jsonInput').fill(JSON.stringify(backup));await page.locator('#previewImport').click();await page.locator('#applyImport').click();await saved();assert.equal(await page.getByText('Edited persistence test',{exact:true}).count(),1);results.push('actual downloaded backup restored');
  await page.locator('#openImport').click();await page.locator('#jsonInput').fill(JSON.stringify({...backup,workspace_id:'wrong-company'}));await page.locator('#previewImport').click();assert.ok(await page.locator('#applyImport').isDisabled());await page.getByRole('button',{name:'Cancel',exact:true}).click();results.push('wrong-company restore rejected');
  const before=JSON.parse(await fs.readFile(path.join(root,'data/state.json'),'utf8'));
  await page.locator('#openImport').click();await page.locator('#jsonInput').fill(JSON.stringify({schema_version:1,workspace_id:backup.workspace_id,calendar:{...backup.calendar,source:'updated synthetic snapshot'}}));await page.locator('#previewImport').click();await page.locator('#applyImport').click();await saved();
  const after=JSON.parse(await fs.readFile(path.join(root,'data/state.json'),'utf8'));assert.deepEqual(after.tasks,before.tasks);assert.deepEqual(after.ceo.priorities,before.ceo.priorities);results.push('Calendar-only update preserves tasks/priorities');
  const stale=await (await fetch(url+'/api/ceo-desk')).json();const changed=structuredClone(stale.desk);changed.priorities=['A','B','C'];
  const write=body=>fetch(url+'/api/ceo-desk',{method:'PUT',headers:{'content-type':'application/json','x-local-token':stale.token},body:JSON.stringify(body)});
  assert.equal((await write({revision:stale.revision,desk:changed})).status,200);assert.equal((await write({revision:stale.revision,desk:stale.desk})).status,409);results.push('stale API revision rejected');
  await page.close();server.kill();await new Promise(r=>server.once('exit',r));await start();page=await browser.newPage();await page.goto(url+'/ceo-desk');await saved();assert.equal(await page.getByText('Edited persistence test',{exact:true}).count(),1);results.push('new browser context and restarted server reuse canonical work');
  await page.screenshot({path:path.join(output,'ceo-desk.png'),fullPage:true});assert.deepEqual(errors,[]);
  await page.route('**/api/ceo-desk',async route=>{if(route.request().method()==='PUT')return route.fulfill({status:409,contentType:'application/json',body:JSON.stringify({error:'Synthetic conflict'})});return route.continue()});
  await page.locator('#addTask').click();await page.locator('#taskTitle').fill('Unsaved recoverable edit');await page.locator('#taskForm button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('#saveInfo').textContent.includes('Save unconfirmed'));assert.ok(await page.locator('#backup').isEnabled());
  await page.locator('#taskDialog button[data-close]').click({force:true}).catch(()=>{});
  await page.evaluate(()=>document.querySelector('#taskDialog').close());const failedDownload=page.waitForEvent('download');await page.locator('#backup').click();await (await failedDownload).saveAs(path.join(output,'unsaved-backup.json'));assert.match(await fs.readFile(path.join(output,'unsaved-backup.json'),'utf8'),/Unsaved recoverable edit/);results.push('failed write retains attempted edits and permits backup download');
  const report={status:'PASS',checks:results,platform:process.platform,node:process.version,original_asset:'preserved',completion:'User reported; not independent completion evidence'};
  await fs.writeFile(path.join(output,'desk-browser.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser?.close();server?.kill();/* Retain bounded synthetic temp folder for failed-test diagnosis. */}
})().catch(e=>{console.error(e);process.exitCode=1});
