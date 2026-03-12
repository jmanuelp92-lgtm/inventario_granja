const CACHE_NAME = 'granja-pro-offline-v2';

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
// Borra cachés antiguos cuando se actualiza el Service Worker
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});