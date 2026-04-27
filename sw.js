// SpearFactor Conditions — Service Worker
// Version is bumped on every deploy to bust cache
const CACHE_VERSION = 'sf-v20260426d';
const CACHE_FILES = [
  '/',
  '/dive-conditions-v2.html',
  '/manifest.json'
];

// Install: cache current version
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate immediately, don't wait
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(CACHE_FILES))
  );
});

// Activate: delete ALL old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim()) // Take control of all pages immediately
  );
});

// Fetch strategy:
//   HTML pages → STALE-WHILE-REVALIDATE: serve cached HTML instantly, fetch a
//   fresh copy in the background and cache it for the NEXT visit. This makes
//   page loads feel instant on every warm visit. New code lands on the visit
//   after a deploy — the activate handler + skipWaiting() above keeps that gap
//   to a single page load.
//
//   Static assets (manifest, icons) → CACHE-FIRST.
//
//   Cross-origin requests (NOAA, HYCOM, our worker, etc.) → bypass entirely.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls, ERDDAP, NOAA, etc — always network, never cache through SW
  if (url.origin !== self.location.origin) return;

  // HTML pages — stale-while-revalidate
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      caches.open(CACHE_VERSION).then(async cache => {
        const cached = await cache.match(event.request);
        // Kick off the network fetch in the background regardless
        const networkPromise = fetch(event.request).then(response => {
          // Only cache 2xx
          if (response && response.status >= 200 && response.status < 300) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => null);

        // If we have something cached, return it immediately. Otherwise wait
        // for the network (first-ever visit / cleared cache).
        if (cached) {
          // Don't await networkPromise — let it update cache in background.
          event.waitUntil(networkPromise);
          return cached;
        }
        const fresh = await networkPromise;
        return fresh || new Response('Offline', { status: 503 });
      })
    );
    return;
  }

  // Everything else (manifest, icons) — cache first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
