const CACHE_NAME = 'granja-pro-offline-v3'; // Cambiamos la versión

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Obliga al nuevo Service Worker a instalarse de inmediato
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(['./', './index.html', './manifest.json']))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key); // Borra las versiones viejas
        }
      }));
    })
  );
  return self.clients.claim(); // Toma el control de la aplicación al instante
});

self.addEventListener('fetch', (e) => {
  // Estrategia: Red primero, luego Caché (Network First)
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Si hay internet, guarda la copia nueva en caché de forma silenciosa
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, resClone);
        });
        return response;
      })
      .catch(() => {
        // Si no hay internet (falla el fetch), saca la versión guardada en caché
        return caches.match(e.request);
      })
  );
});