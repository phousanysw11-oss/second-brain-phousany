import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const destination = path.join(root, 'dist');
const files = ['index.html', 'styles.css', 'app.js'];
try {
  if ((await fs.lstat(destination)).isSymbolicLink()) throw new Error('Refusing a symbolic-link dist directory.');
  const old = await fs.readdir(destination);
  const unknown = old.filter(name => !files.includes(name));
  if (unknown.length) throw new Error(`Unexpected files in dist; review before building: ${unknown.join(', ')}`);
} catch (error) { if (error.code !== 'ENOENT') throw error; }
await fs.mkdir(destination, {recursive:true});
for (const file of files) {
  const target = path.join(destination, file);
  try { if ((await fs.lstat(target)).isSymbolicLink()) throw new Error(`Refusing symbolic link: ${target}`); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  await fs.copyFile(path.join(root, file), target);
}
console.log('Built dist/: index.html, styles.css, app.js. Review that app assets contain no private task data before any deployment.');
