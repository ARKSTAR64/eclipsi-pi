const CACHE_NAME = 'pwa-app-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/pages/login.html',
  '/pages/cadastro-medico.html',
  '/pages/cadastro-user.html',
  '/pages/user.html',
  '/pages/admin.html',
  '/pages/medico.html',
  '/css/cadastro.css',
  '/css/user.css',
  '/css/medico.css',
  '/css/style.css',
  '/js/admin.js',
  '/js/user.js',
  '/js/medico.js',
  '/js/api.js',
  '/images/logo-ruim.png',
];

// Instalação: adiciona arquivos ao cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Intercepta requisições e serve do cache quando offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
