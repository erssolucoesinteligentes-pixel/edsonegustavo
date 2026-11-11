/* O build injeta a lista completa, incluindo WASM, workers e fontes. Nunca guarda respostas do Supabase. */
const CACHE = /*BUILD_CACHE*/ null;
const ASSETS = /*BUILD_ASSETS*/ [];
self.addEventListener('install', (event) => {
  if (CACHE) event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  else self.skipWaiting();
});
self.addEventListener('activate', (event) =>
  event.waitUntil(
    (async () => {
      if (CACHE) {
        for (const name of await caches.keys())
          if (name.startsWith('ers-financas-') && name !== CACHE) await caches.delete(name);
      }
      await self.clients.claim();
    })(),
  ),
);
self.addEventListener('message', (event) => {
  if (event.data === 'ACTIVATE_UPDATE') self.skipWaiting();
});
function isolated(response) {
  if (response.status === 0) return response;
  const headers = new Headers(response.headers);
  headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (
    req.method !== 'GET' ||
    new URL(req.url).origin !== self.location.origin ||
    (req.cache === 'only-if-cached' && req.mode !== 'same-origin')
  )
    return;
  event.respondWith(
    (async () => {
      let response;
      if (CACHE) {
        const cache = await caches.open(CACHE);
        if (req.mode === 'navigate') {
          response = await cache.match('/index.html');
        } else response = await cache.match(req, { ignoreSearch: true });
      }
      if (!response) response = await fetch(req);
      return isolated(response);
    })(),
  );
});
