/**
 * Servidor estático local para ver o site no navegador.
 * Uso: node scripts/servidor.mjs   (abre em http://localhost:8080)
 */
import { createServer } from 'http';
import { createReadStream, statSync } from 'fs';
import { join, extname, normalize, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 8080;
// npm run rede (ou HOST=0.0.0.0) abre o site para outros aparelhos no mesmo Wi-Fi.
const HOST = process.argv.includes('--rede') ? '0.0.0.0' : (process.env.HOST || '127.0.0.1');

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp4': 'video/mp4'
};

createServer((req, res) => {
  let caminho;
  try { caminho = decodeURIComponent(new URL(req.url, 'http://x').pathname); }
  catch { res.writeHead(400).end(); return; }
  if (caminho.endsWith('/')) caminho += 'index.html';

  // Não deixa sair da pasta do site.
  const arquivo = normalize(join(root, caminho));
  if (!arquivo.startsWith(root)) { res.writeHead(403).end(); return; }

  let info;
  try { info = statSync(arquivo); } catch { info = null; }
  if (!info || !info.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado'); return; }

  res.writeHead(200, {
    'Content-Type': TIPOS[extname(arquivo).toLowerCase()] || 'application/octet-stream',
    'Content-Length': info.size,
    'Cache-Control': 'no-cache'
  });
  createReadStream(arquivo).pipe(res);
}).listen(PORT, HOST, () => {
  console.log('Site no ar em http://localhost:' + PORT + (HOST === '0.0.0.0' ? ' (também na rede local)' : ''));
});
