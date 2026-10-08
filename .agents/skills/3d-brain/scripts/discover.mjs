import {promises as fs} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
const at=process.argv.indexOf('--root');
const root=path.resolve(at>=0?process.argv[at+1]:process.cwd());
const candidates=[];
async function add(label,p,type='markdown'){try{const stat=await fs.stat(p);candidates.push({label,path:p,type,isDirectory:stat.isDirectory()});}catch{}}
for(const [label,p] of [['Business knowledge','context'],['Business wiki','llm-wiki/wiki'],['Sources','llm-wiki/raw'],['Notes','notes'],['Work','work'],['Meetings','meetings'],['Projects','projects'],['References','references'],['Skills','.agents/skills']]) await add(label,path.join(root,p));
if(process.argv.includes('--include-external-memory')){
await add('Codex Memory',path.join(process.env.CODEX_HOME||path.join(os.homedir(),'.codex'),'memories'),'codex-memory');
const claude=path.join(os.homedir(),'.claude','projects');
const encoded=root.replace(/[^a-zA-Z0-9]/g,'-').toLowerCase();
try{for(const entry of await fs.readdir(claude,{withFileTypes:true}))if(entry.isDirectory() && entry.name.toLowerCase()===encoded)await add('Claude memory',path.join(claude,entry.name,'memory'));}catch{}
}
console.log(JSON.stringify({root,candidates,note:'Candidate paths only. Default discovery stays inside this AIOS. External memory discovery requires --include-external-memory after an explicit request; choose exact paths before reading content.'},null,2));
