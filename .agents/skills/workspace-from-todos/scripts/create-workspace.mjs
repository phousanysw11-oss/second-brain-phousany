import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const files = ['index.html', 'styles.css', 'app.js', 'server.mjs', 'build.mjs', 'package.json', '.gitignore'];
const targetArgument = process.argv[2];
if (!targetArgument || process.argv.length !== 3) {
  console.error('Usage: node create-workspace.mjs <new-output-directory>');
  process.exit(1);
}
const target = path.resolve(targetArgument);
const source = path.resolve(here, '../assets/template');
try {
  for (const file of files) {
    if (!(await fs.stat(path.join(source, file))).isFile()) throw new Error(`Missing template file: ${file}`);
  }
  await fs.mkdir(target); // Exclusive: never overwrite an existing directory or its data.
  for (const file of files) await fs.copyFile(path.join(source, file), path.join(target, file), 1);
  console.log(JSON.stringify({status:'created', directory:target, files, next:['Open a terminal in this directory', 'node server.mjs', 'Open http://127.0.0.1:4173', 'Paste tasks using Add from list; export a backup regularly']}, null, 2));
} catch (error) {
  console.error(error.code === 'EEXIST' ? `Destination already exists; choose a new directory: ${target}` : error.message);
  process.exitCode = 1;
}
