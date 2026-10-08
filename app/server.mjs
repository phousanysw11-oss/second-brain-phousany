import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {randomUUID,randomBytes} from 'node:crypto';
import {readState as readSharedState,saveState,toDesk,fromDesk,servedDesk} from './ceo-state.mjs';
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'..');
const port=Number(process.env.TRAINING_PORT||4781),brainPort=Number(process.env.BRAIN_PORT||4782);
const stateFile=path.join(ROOT,'data/state.json'),token=randomBytes(24).toString('hex');
const hosts=new Set([`127.0.0.1:${port}`,`localhost:${port}`]);
let queue=Promise.resolve(),brain;
async function readState(){return readSharedState(ROOT)}
async function save(s){return saveState(ROOT,s)}
async function listFiles(){
 const files=[];
 async function walk(d){for(const e of await fs.readdir(path.join(ROOT,d),{withFileTypes:true}).catch(()=>[])){if(e.isSymbolicLink())continue;const p=path.posix.join(d,e.name);if(e.isDirectory())await walk(p);else if(e.name.endsWith('.md'))files.push(p);}}
 for(const d of ['context','work','notes','llm-wiki/wiki','llm-wiki/raw','references'])await walk(d);return files;
}
const send=(res,status,data,type='application/json; charset=utf-8')=>{res.writeHead(status,{'content-type':type,'cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer'});res.end(typeof data==='string'||Buffer.isBuffer(data)?data:JSON.stringify(data));};
const server=http.createServer(async(req,res)=>{
 try{
  if(!hosts.has(req.headers.host))return send(res,403,{error:'Local requests only'});
  if(req.headers.origin&&!hosts.has(new URL(req.headers.origin).host))return send(res,403,{error:'Cross-origin request rejected'});
  const url=new URL(req.url,`http://127.0.0.1:${port}`);
  if(req.method==='GET'){
   if(url.pathname==='/ceo-desk'){const html=await fs.readFile(path.join(ROOT,'.agents/skills/bni-second-brain/assets/CEO_DESK.html'),'utf8');return send(res,200,servedDesk(html,await readState()),'text/html; charset=utf-8');}
   if(url.pathname==='/ceo-desk-adapter.js')return send(res,200,await fs.readFile(path.join(HERE,'ceo-desk-adapter.js')),'text/javascript; charset=utf-8');
   if(url.pathname==='/api/ceo-desk'){const s=await readState();return send(res,200,{token,revision:s.revision,desk:toDesk(s)});}

   const staticFiles={'/':['index.html','text/html; charset=utf-8'],'/app.js':['app.js','text/javascript; charset=utf-8'],'/style.css':['style.css','text/css; charset=utf-8']};
   if(staticFiles[url.pathname]){const [f,t]=staticFiles[url.pathname];return send(res,200,await fs.readFile(path.join(HERE,f)),t);}
   if(url.pathname==='/api/init'){const config=JSON.parse(await fs.readFile(path.join(HERE,'config.json'),'utf8'));return send(res,200,{token,state:await readState(),config,brainUrl:`http://127.0.0.1:${brainPort}`});}
   if(url.pathname==='/api/team-snapshot'){try{return send(res,200,JSON.parse(await fs.readFile(path.join(ROOT,'data/team-data.json'),'utf8')));}catch(e){if(e.code==='ENOENT')return send(res,200,{mode:'not-configured',records:[]});throw e;}}
   if(url.pathname==='/api/files')return send(res,200,await listFiles());
   if(url.pathname==='/api/read'){const p=url.searchParams.get('path');if(!(await listFiles()).includes(p))return send(res,404,{error:'File not available'});const f=await fs.realpath(path.join(ROOT,p));if(!f.startsWith(ROOT+path.sep))return send(res,403,{error:'Outside workspace'});return send(res,200,{path:p,text:await fs.readFile(f,'utf8')});}
   return send(res,404,{error:'Not found'});
  }
  if(req.headers['x-local-token']!==token||!String(req.headers['content-type']).startsWith('application/json'))return send(res,403,{error:'Local token required'});
  let raw='';for await(const c of req){raw+=c;if(raw.length>1_000_000)return send(res,413,{error:'Too large'});}const body=JSON.parse(raw);
  if(url.pathname==='/api/ceo-desk'&&req.method==='PUT'){
   const action=queue.catch(()=>{}).then(async()=>{const s=await readState();if(body.revision!==s.revision){const e=Error('State changed. Reload before saving.');e.status=409;throw e}const saved=await save(fromDesk(s,body.desk));return {revision:saved.revision,desk:toDesk(saved),warning:saved.projectionWarning||null}});queue=action;return send(res,200,await action);
  }
  if(url.pathname==='/api/state'&&req.method==='PUT'){const action=queue.catch(()=>{}).then(()=>save(body));queue=action;const saved=await action;if(saved.projectionWarning)res.setHeader('x-projection-warning',encodeURIComponent(saved.projectionWarning));return send(res,200,saved);}
  if(url.pathname==='/api/note'&&req.method==='POST'){
   if(!String(body.title||'').trim()||String(body.text||'').length>40000)return send(res,400,{error:'ระบุชื่อโน้ตและเนื้อหาที่ไม่เกิน 40,000 ตัวอักษร'});
   const name=new Date().toISOString().slice(0,10)+'-'+randomUUID().slice(0,8)+'.md';const f='notes/'+name;await fs.mkdir(path.join(ROOT,'notes'),{recursive:true});await fs.writeFile(path.join(ROOT,f),'# '+String(body.title).slice(0,200)+'\n\n'+String(body.text||'')+'\n\n[งาน](../work/tasks.md) · [ดัชนีความรู้](../llm-wiki/wiki/index.md)\n',{flag:'wx'});return send(res,201,{path:f});
  }
  return send(res,405,{error:'Method not allowed'});
 }catch(e){return send(res,e.status||400,{error:e.message});}
});
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'Port occupied; use the running app or choose TRAINING_PORT and BRAIN_PORT.':e.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>{
 console.log(`My Second Brain: http://127.0.0.1:${port} | CEO Desk: http://127.0.0.1:${port}/ceo-desk`);
 if(!process.env.NO_BRAIN){brain=spawn(process.execPath,[path.join(ROOT,'apps/3d-brain/serve.mjs'),'--port',String(brainPort)],{cwd:ROOT,stdio:'inherit',windowsHide:true});}
 if(!process.env.NO_OPEN){const u=`http://127.0.0.1:${port}`;const child=process.platform==='win32'?spawn('cmd.exe',['/c','start','',u],{windowsHide:true,stdio:'ignore'}):spawn('open',[u],{stdio:'ignore'});child.on('error',()=>{});}
});
for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>{brain?.kill();server.close(()=>process.exit(0));});
