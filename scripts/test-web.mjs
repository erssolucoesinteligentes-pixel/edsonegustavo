import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import vm from 'node:vm';
import path from 'node:path';
test('cache inclui shell, fontes, WASM e telas; responde offline sem cachear Supabase', async () => {
  const source = await readFile('dist/coi-serviceworker.js', 'utf8');
  const handlers = {},
    stores = new Map();
  let skipped = 0;
  const key = (r) =>
    typeof r === 'string' ? new URL(r, 'http://localhost').pathname : new URL(r.url).pathname;
  const caches = {
    keys: async () => [...stores.keys()],
    delete: async (n) => stores.delete(n),
    open: async (name) => {
      if (!stores.has(name)) stores.set(name, new Map());
      const rows = stores.get(name);
      return {
        addAll: async (urls) => {
          for (const url of urls)
            rows.set(key(url), new Response(await readFile(path.join('dist', key(url)))));
        },
        match: async (req) => rows.get(key(req))?.clone(),
      };
    },
  };
  vm.runInNewContext(source, {
    self: {
      location: { origin: 'http://localhost' },
      clients: { claim: async () => {} },
      skipWaiting: () => skipped++,
      addEventListener: (n, f) => (handlers[n] = f),
    },
    caches,
    fetch: async () => {
      throw Error('offline');
    },
    Headers,
    Response,
    URL,
  });
  let installing;
  handlers.install({ waitUntil: (p) => (installing = p) });
  await installing;
  const rows = [...stores.values()][0];
  assert(rows.has('/index.html'));
  assert([...rows.keys()].some((x) => x.endsWith('.wasm')));
  assert([...rows.keys()].some((x) => x.endsWith('.ttf')));
  assert([...rows.keys()].some((x) => x.includes('relatorios-')));
  let response;
  handlers.fetch({
    request: { url: 'http://localhost/nuvem', method: 'GET', mode: 'navigate' },
    respondWith: (p) => (response = p),
  });
  const html = await response;
  assert.equal(html.headers.get('Cross-Origin-Opener-Policy'), 'same-origin');
  assert.match(await html.text(), /manifest/);
  let captured = false;
  handlers.fetch({
    request: { url: 'https://example.supabase.co/rest/v1/fin_accounts', method: 'GET' },
    respondWith: () => (captured = true),
  });
  assert.equal(captured, false);
  handlers.message({ data: 'ACTIVATE_UPDATE' });
  assert.equal(skipped, 1);
});
test('servidor entrega SPA com cabeçalhos e bloqueia travessia e métodos de escrita', async () => {
  const server = spawn(process.execPath, ['scripts/serve-web.mjs'], {
    env: { ...process.env, PORT: '31987' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  try {
    await new Promise((resolve, reject) => {
      server.stdout.once('data', resolve);
      server.once('error', reject);
      server.once('exit', () => reject(Error('Servidor encerrou')));
    });
    const base = 'http://localhost:31987';
    for (const route of [
      '/',
      '/nuvem',
      '/transacao/nova',
      '/manifest.json',
      '/coi-serviceworker.js',
    ]) {
      const r = await fetch(base + route);
      assert.equal(r.status, 200, route);
      assert.equal(r.headers.get('Cross-Origin-Opener-Policy'), 'same-origin');
    }
    assert.equal((await fetch(base + '/%2e%2e%2fpackage.json')).status, 403);
    assert.equal((await fetch(base + '/', { method: 'POST' })).status, 405);
    assert.equal((await fetch(base + '/ausente.js')).status, 404);
  } finally {
    server.kill();
  }
});
