const CACHE_NAME = 'granja-pro-offline-v1';

// Guarda el index.html en la memoria del teléfono/PC
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(['./']))
  );
});

// Cuando no hay internet, carga la página desde la memoria
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});