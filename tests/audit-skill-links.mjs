import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
async function walk(dir){let out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){if(e.name==='node_modules')continue;const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else if(e.name.endsWith('.md'))out.push(p);}return out;}
const inventory=[],broken=[],mirrors=[],links=[];
for(const e of await fs.readdir(path.join(root,'.agents/skills'),{withFileTypes:true})){
 if(!e.isDirectory())continue;
 const dir=path.join(root,'.agents/skills',e.name),file=path.join(dir,'SKILL.md');
 const text=await fs.readFile(file,'utf8'),fm=text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
 const claude=path.join(root,'.claude/skills',e.name,'SKILL.md');
 let mirror='missing';try{mirror=(await fs.readFile(claude,'utf8'))===text?'identical':'different';}catch{}
 inventory.push({skill:e.name,frontmatter:Boolean(fm&&/name:/.test(fm[1])&&/description:/.test(fm[1])),lines:text.split(/\r?\n/).length,mirror,scope:'static contract/dependency audit; no invocation claim'});
 if(mirror!=='identical')mirrors.push(e.name);
 for(const md of await walk(dir)){
  const body=await fs.readFile(md,'utf8');
  for(const match of body.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
   let target=match[1].trim().replace(/^<|>$/g,'').split('#')[0];
   if(!target||/^[a-z][a-z0-9+.-]*:/i.test(target)||target.includes('{{')||target.includes('$'))continue;
   target=target.replace(/\s+"[^"]*"$/,'');
   try{target=decodeURIComponent(target);}catch{}
   const dest=path.resolve(path.dirname(md),target);
   try{await fs.access(dest);links.push({file:path.relative(root,md),target});}
   catch{broken.push({file:path.relative(root,md),target});}
  }
 }
}
const report={scope:'Every packaged Codex skill frontmatter, Claude mirror and local Markdown dependency; not behavioral validation',skills:inventory.length,valid_links:links.length,inventory,broken_links:broken,nonidentical_mirrors:mirrors,status:broken.length||mirrors.length||inventory.some(s=>!s.frontmatter)?'FAIL':'PASS'};
if(process.argv.includes('--save')){await fs.mkdir(path.join(root,'audits'),{recursive:true});await fs.writeFile(path.join(root,'audits/skill-dependency-inventory-2026-10-08.json'),JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify(report,null,2));if(report.status==='FAIL')process.exitCode=1;

