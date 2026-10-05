const VERSION = 'v2';
const STATIC = `eclipsi-static-${VERSION}`;
const RUNTIME = `eclipsi-runtime-${VERSION}`;

const PRECACHE = [
  '/', '/index.html', '/offline.html', '/manifest.json',
  '/pages/login.html', '/pages/cadastro.html', '/pages/cadastro-user.html',
  '/pages/cadastro-medico.html', '/pages/user.html', '/pages/medico.html',
  '/pages/admin.html', '/pages/pagamento.html',
  '/css/style.css', '/css/cadastro.css', '/css/user.css', '/css/medico.css',
  '/js/pwa.js', '/js/script.js', '/js/api.js', '/js/user.js',
  '/js/medico.js', '/js/admin.js', '/js/pagamento.js',
  '/icons/icon-192.png', '/icons/icon-512.png', '/images/logo-ruim.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC).then((cache) =>
      Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => console.warn('SW: falhou cache de', url))))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => ![STATIC, RUNTIME].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // API: sempre rede; offline devolve JSON de erro
  if (url.origin === location.origin && url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req).catch(() => new Response(
        JSON.stringify({ success: false, message: 'Sem conexão. Tente novamente quando estiver online.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      ))
    );
    return;
  }

  // Navegação: rede primeiro, cache, depois página offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(RUNTIME).then((c) => c.put(req, copy));
        return res;
      }).catch(() =>
        caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('/offline.html'))
      )
    );
    return;
  }

  // Estáticos (inclui Font Awesome do CDN): cache primeiro, atualiza em segundo plano
  event.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
