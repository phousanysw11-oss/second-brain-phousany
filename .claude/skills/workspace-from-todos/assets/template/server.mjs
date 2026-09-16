import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT must be an integer between 1024 and 65535.');
const allowed = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']]
]);
const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, {'Allow':'GET, HEAD'}); res.end(); return; }
  let route;
  try { route = new URL(req.url, 'http://127.0.0.1').pathname; } catch { res.writeHead(400); res.end(); return; }
  const asset = allowed.get(route);
  if (!asset) { res.writeHead(404); res.end('Not found'); return; }
  try {
    const body = await fs.readFile(path.join(root, asset[0]));
    res.writeHead(200, {'Content-Type':asset[1], 'Content-Length':body.length});
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(500); res.end('Could not read app file.'); }
});
server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Stop the existing app or choose another PORT; each port has separate browser data.` : error.message); process.exitCode = 1; });
server.listen(port, '127.0.0.1', () => console.log(`Work & Second Brain: http://127.0.0.1:${port}\nStored in this browser only. Export a backup before changing browser, port or URL.\nPress Ctrl+C to stop.`));
