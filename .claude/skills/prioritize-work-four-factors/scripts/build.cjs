'use strict';
const fs=require('node:fs'), path=require('node:path');
const base=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(__dirname,'score.cjs'),'utf8');
const template=fs.readFileSync(path.join(base,'assets/calculator.template.html'),'utf8');
if(source.includes('</script>'))throw Error('Unsafe script closing tag in engine');
fs.writeFileSync(path.join(base,'assets/calculator.html'),template.replace('/* INSERT_SCORE_ENGINE */',source));
console.log('Built standalone assets/calculator.html from shared score.cjs');
