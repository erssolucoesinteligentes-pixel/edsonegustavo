/* O build injeta a lista completa, incluindo WASM, workers e fontes. Nunca guarda respostas do Supabase. */
const CACHE = "ers-financas-99c7bdc15879";
const ASSETS = ["/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.b4eb097d35f44ed943676fd56f6bdc51.ttf","/assets/node_modules/@expo-google-fonts/manrope/200ExtraLight/Manrope_200ExtraLight.3b88abd10509dbd972f179a2fc60d3bf.ttf","/assets/node_modules/@expo-google-fonts/manrope/300Light/Manrope_300Light.8b432e90d552ee87adaea8fa1244fc68.ttf","/assets/node_modules/@expo-google-fonts/manrope/400Regular/Manrope_400Regular.bd3f6311d61e60094df4c83d68779675.ttf","/assets/node_modules/@expo-google-fonts/manrope/500Medium/Manrope_500Medium.ec05fba6bf4223e33f1a5402cbbf7491.ttf","/assets/node_modules/@expo-google-fonts/manrope/600SemiBold/Manrope_600SemiBold.d7c844e508c4dbacda2468f820e0b4b4.ttf","/assets/node_modules/@expo-google-fonts/manrope/700Bold/Manrope_700Bold.33e6a451fdf22e8244d143288b957ba0.ttf","/assets/node_modules/@expo-google-fonts/manrope/800ExtraBold/Manrope_800ExtraBold.bf7f0a128c232a15714167173b998717.ttf","/assets/node_modules/expo-router/assets/arrow_down.017bc6ba3fc25503e5eb5e53826d48a8.png","/assets/node_modules/expo-router/assets/error.d1ea1496f9057eb392d5bbf3732a61b7.png","/assets/node_modules/expo-router/assets/file.19eeb73b9593a38f8e9f418337fc7d10.png","/assets/node_modules/expo-router/assets/forward.d8b800c443b8972542883e0b9de2bdc6.png","/assets/node_modules/expo-router/assets/pkg.ab19f4cbc543357183a20571f68380a3.png","/assets/node_modules/expo-router/assets/react-navigation/elements/back-icon-mask.0a328cd9c1afd0afe8e3b1ec5165b1b4.png","/assets/node_modules/expo-router/assets/react-navigation/elements/back-icon.35ba0eaec5a4f5ed12ca16fabeae451d.png","/assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55.png","/assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@2x.png","/assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@3x.png","/assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@4x.png","/assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7.png","/assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@2x.png","/assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@3x.png","/assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@4x.png","/assets/node_modules/expo-router/assets/react-navigation/elements/search-icon.286d67d3f74808a60a78d3ebf1a5fb57.png","/assets/node_modules/expo-router/assets/sitemap.412dd9275b6b48ad28f5e3d81bb1f626.png","/assets/node_modules/expo-router/assets/unmatched.20e71bdf79e3a97bf55fd9e164041578.png","/assets/node_modules/expo-sqlite/web/wa-sqlite/wa-sqlite.5e61fe84c4a4f49e0b1a33661b45c791.wasm","/favicon.ico","/icon-192.png","/icon-512.png","/index.html","/manifest.json","/metadata.json","/_expo/static/js/web/cambio-849445e57c0664641711c123a8e16125.js","/_expo/static/js/web/codigo-2217c542b7a7697885375b2763d02fc8.js","/_expo/static/js/web/contas-902037099a93a15d85d45471c512e812.js","/_expo/static/js/web/editar-06cfbbe2371d6de2a14e92a7c6005c75.js","/_expo/static/js/web/editar-0abbf35e4e1b26accf4788a3e11a6d8a.js","/_expo/static/js/web/entrar-8e01e1d934a10a20d5f13a1c3276c7e8.js","/_expo/static/js/web/entry-a674910262448d1e3e60f2724955506b.js","/_expo/static/js/web/extrato-d3a7b39eb023c2c58418dce2ee885ab0.js","/_expo/static/js/web/index-1d2ca4397c12977cbf635c6db4d9559f.js","/_expo/static/js/web/index-250d13af09d9ee0a5ac645e44fbb2f11.js","/_expo/static/js/web/index-6ad79b4327c98eea263beaf4a2c2fc17.js","/_expo/static/js/web/index-c2bd7f1a775d028b6c342130709fdec4.js","/_expo/static/js/web/mais-a18ae7a8fdd61ebbc69d08c58c3506bb.js","/_expo/static/js/web/metas-b0daa64a95a6d0f1cf843d2dd9288c79.js","/_expo/static/js/web/nova-70d8245da348cfc5201d2cd3bb07626f.js","/_expo/static/js/web/nova-bc97402f12d028175474ab8c7949b804.js","/_expo/static/js/web/nova-f5dffd9afd99db8d1c7046b74302cb57.js","/_expo/static/js/web/novo-2a2efba4d8d1a8be7587c082df593fb9.js","/_expo/static/js/web/novo-d2c98ddeaabcbfdaa2a0f38d7d2ffd4d.js","/_expo/static/js/web/orcamentos-6633e22e9c52b83c23ece541fc9ae505.js","/_expo/static/js/web/recorrencias-da100f7764069bab7c65b23b5e497bf4.js","/_expo/static/js/web/recuperar-32609dbd35f75abc662ef53656af36f5.js","/_expo/static/js/web/relatorios-e18ceb25cf2e37b04933e3d6bd604a3e.js","/_expo/static/js/web/worker-036c89bdae8bfe38a6420bcdb5c00efc.js","/_expo/static/js/web/[id]-1e43636f303610ecbaa0b63df287a4a7.js","/_expo/static/js/web/[id]-203cfc5d1c571c1aca33c964e93c06df.js","/_expo/static/js/web/[id]-217e860eea993f0abf048d659b9b890c.js","/_expo/static/js/web/[id]-2a02e65eed5aff62983e0d61ae8d0805.js","/_expo/static/js/web/[id]-3c2c8156ec0a1cc0120d22900cb7b7a9.js","/_expo/static/js/web/[id]-789f3f7179386ed78932174b76f44216.js","/_expo/static/js/web/[id]-a40a7292e1619493e8723a77b34c3f3c.js","/_expo/static/js/web/[id]-a616ac0c88f34ef5b565bde2950dbdbb.js","/_expo/static/js/web/[id]-aa83b935cc878f49996f8288dbe51777.js","/_expo/static/js/web/[id]-b4f70bef0bbdde6d672bc59fb65e346a.js","/_expo/static/js/web/[id]-c3a3f8b377a4602a28b037ff75c79cb1.js","/_expo/static/js/web/[id]-d26510832c2af43db17e3257bcc91e72.js","/_expo/static/js/web/_layout-84d22330de46ff4a301fcf42ef56ff0d.js","/_expo/static/js/web/_layout-9bc606c4621dee22c8f60bfd4385f177.js","/_expo/static/js/web/__common-f5de4a1182bf49280cd0b43baf72a490.js","/_expo/static/js/web/__expo-metro-runtime-9f1a7b6acd20011e290bc79f0164ae37.js"];
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
