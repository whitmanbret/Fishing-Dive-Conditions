// SpearFactor Conditions — Service Worker
// Version is bumped on every deploy to bust cache
const CACHE_VERSION = 'sf-v20260403i';
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

// Fetch: network-first strategy for HTML (always get fresh code)
// Cache-first for static assets only
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls, ERDDAP, NOAA, etc — always network, never cache
  if (url.origin !== self.location.origin) return;

  // HTML pages — network first, fall back to cache for offline
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request).then(response => {
        // Update cache with fresh version
        const clone = response.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request)) // Offline fallback
    );
    return;
  }

  // Everything else (manifest, icons) — cache first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
