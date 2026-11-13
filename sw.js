// Offline support. Network first (so updates show up right away),
// falling back to the saved copy when there's no connection.
const CACHE = 'abc-game-v2';
const SHELL = [
  './',
  'index.html',
  'css/styles.css',
  'js/main.js',
  'js/letters.js',
  'js/speech.js',
  'js/sounds.js',
  'js/fx.js',
  'js/explore.js',
  'js/find-game.js',
  'js/rewards.js',
  'js/collection.js',
  'js/creatures.js',
  'js/creature-art.js',
  'manifest.webmanifest',
  'icons/icon.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
