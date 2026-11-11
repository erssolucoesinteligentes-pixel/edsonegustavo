import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css',
  '.json': 'application/json',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};
http
  .createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405);
      return res.end();
    }
    try {
      const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let f = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
      if (!f.startsWith(root + path.sep)) {
        res.writeHead(403);
        return res.end();
      }
      try {
        if (!(await stat(f)).isFile()) throw Error();
      } catch {
        if (path.extname(name)) {
          res.writeHead(404);
          return res.end();
        }
        f = path.join(root, 'index.html');
      }
      const data = await readFile(f);
      res.writeHead(200, {
        'Content-Type': mime[path.extname(f)] || 'application/octet-stream',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'same-origin',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch {
      res.writeHead(500);
      res.end('Não foi possível abrir o aplicativo. Execute npm run build:web.');
    }
  })
  .listen(process.env.PORT || 3000, '0.0.0.0', () =>
    console.log('ERS Finanças em http://localhost:' + (process.env.PORT || 3000)),
  );
