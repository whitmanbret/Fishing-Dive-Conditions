// SpearFactor Conditions — Service Worker
// Version is bumped on every deploy to bust cache
const CACHE_VERSION = 'sf-v20260719b';
const CACHE_FILES = [
  '/',
  '/manifest.json'
];
// NOTE 5/9/2026: Removed /dive-conditions-v2.html from CACHE_FILES because
// Cloudflare on conditions.spearfactor.com strips .html extensions via a
// 308 redirect to /dive-conditions-v2 (no extension). cache.addAll() rejects
// redirected responses, which was causing the entire SW install to fail
// silently — users got stuck with the previous SW. Pre-caching only the
// root path which doesn't redirect.

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
//   HTML pages → NETWORK-WITH-CACHE-FALLBACK: race network and cache with a
//   1.5s timeout. If network beats the timeout (typical), user gets fresh
//   HTML this visit. If network is slow/offline, fall back to cached HTML
//   and let the network update the cache for the next visit. Replaced the
//   prior stale-while-revalidate strategy, which made deploys take a full
//   extra visit to land for some users (especially Safari).
//
//   Static assets (manifest, icons) → CACHE-FIRST.
//
//   Cross-origin requests (NOAA, HYCOM, our worker, etc.) → bypass entirely.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls, ERDDAP, NOAA, etc — always network, never cache through SW
  if (url.origin !== self.location.origin) return;

  // HTML pages — NETWORK-WITH-CACHE-FALLBACK (race with 1.5s timeout).
  //
  // We used to do pure stale-while-revalidate, which serves cached HTML
  // instantly + updates cache in background. The problem: on the first
  // visit after a deploy, the user sees the OLD HTML (no new chart, old
  // calibration text, etc.) and only sees fresh on visit 2. For an actively
  // updated tool this was confusing — users on Safari especially saw stale
  // text for hours because Safari is slow to activate new SW versions.
  //
  // New approach: race network and cache. If network responds within 1.5s
  // we use it (fresh content this visit). If network is slow or offline we
  // fall back to the cached copy. Cache is still updated for the next visit.
  // Cold network = ~200-500ms typical, so most visits feel just as fast as
  // stale-while-revalidate did, but now reflect the latest deploy.
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      caches.open(CACHE_VERSION).then(async cache => {
        const cached = await cache.match(event.request);
        const networkPromise = fetch(event.request).then(response => {
          // Only cache 2xx AND non-redirected responses. Safari refuses to
          // serve cached responses that were originally created via a redirect
          // chain (e.g., github.io → conditions.spearfactor.com 301), throwing
          // "Response served by service worker has redirections" errors on
          // navigation. Skip caching those — the next request will fetch
          // fresh and (usually) hit the canonical URL directly.
          if (response && response.status >= 200 && response.status < 300 && !response.redirected) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => null);

        // No cached copy yet (first-ever visit) — wait for network.
        if (!cached) {
          const fresh = await networkPromise;
          return fresh || new Response('Offline', { status: 503 });
        }

        // Have a cached copy. Race network with a 1.5s timeout. If network
        // beats the timeout, serve fresh; otherwise serve cached and let
        // the network finish updating the cache for the next visit.
        const winner = await Promise.race([
          networkPromise,
          new Promise(r => setTimeout(() => r(null), 1500)),
        ]);
        if (winner) return winner;
        // Network slow — fall back to cache, but keep the network fetch alive
        // so it can populate the cache for next time.
        event.waitUntil(networkPromise);
        return cached;
      })
    );
    return;
  }

  // Everything else (manifest, icons) — cache first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
