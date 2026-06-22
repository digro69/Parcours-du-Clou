// ── Service Worker – Golf du Clou Stableford ──
// Stratégie : Cache First – fonctionne 100% hors réseau sur le parcours
// ⚠️  Incrémenter CACHE_NAME à chaque déploiement pour forcer la mise à jour
const CACHE_NAME = 'golf-clou-v12';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  // Photos des trous
  './photos/hole-01.jpg',
  './photos/hole-02.jpg',
  './photos/hole-03.jpg',
  './photos/hole-04.jpg',
  './photos/hole-05.jpg',
  './photos/hole-06.jpg',
  './photos/hole-07.jpg',
  './photos/hole-08.jpg',
  './photos/hole-09.jpg',
  './photos/hole-10.jpg',
  './photos/hole-11.jpg',
  './photos/hole-12.jpg',
  './photos/hole-13.jpg',
  './photos/hole-14.jpg',
  './photos/hole-15.jpg',
  './photos/hole-16.jpg',
  './photos/hole-17.jpg',
  './photos/hole-18.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())   // active immédiatement sans attendre fermeture
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())  // prend le contrôle des onglets ouverts
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
