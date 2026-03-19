const CACHE_NAME = 'spearfactor-v2';
const STATIC_ASSETS = [
  '/dive-conditions-v2.html',
  '/manifest.json',
  '/icon-192.jpg',
  '/icon-512.jpg',
  '/og-image.jpg'
];

// Install: cache static assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first for API calls, cache-first for static assets
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // API calls: always try network first, never cache
  if (url.hostname !== location.hostname) {
    return; // let browser handle external requests normally
  }

  // Static assets: network first, fall back to cache
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Update cache with fresh version
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
