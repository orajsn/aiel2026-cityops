// Keeps the map files (/models/...) on the device after the first visit, so opening CityOps again does not
// download ~50 MB through the tunnel (owner, 25 Oct: "so slow download"). The browser's normal cache drops files
// this big; the Cache Storage used here keeps them. Only /models/ is touched: the app's code and everything else
// load as usual. Files are stored exactly as received (no change in quality). Bump VERSION if a map file changes.
const VERSION = 'cityops-models-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (key.startsWith('cityops-models-') && key !== VERSION) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.includes('/models/')) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(VERSION);
      const hit = await cache.match(req, { ignoreSearch: true, ignoreVary: true });
      if (hit) return hit;
      const res = await fetch(req);
      if (res.status === 200) await cache.put(req, res.clone()).catch(() => {});
      return res;
    })(),
  );
});
