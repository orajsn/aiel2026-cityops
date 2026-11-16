// Keeps the map files (/models/...) on the device after the first visit, so opening CityOps again does not
// download ~50 MB through the tunnel (owner, 25 Oct: "so slow download"). The browser's normal cache drops files
// this big; the Cache Storage used here keeps them. Only /models/ is touched: the app's code and everything else
// load as usual. Files are stored exactly as received (no change in quality). Bump VERSION if a map file changes.
// v2 (28 Oct): v1 also cached script requests under a model's path (a '?import&url' module), so a .glb could be
// served as a script and the app would not start; the new version drops that cache
const VERSION = 'senayan-models-v1';
/** only real model files and their textures are kept; never scripts, whatever their path */
const MODEL_FILE = /\.(glb|gltf|bin|jpe?g|png|webp|ktx2)$/i;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (key.startsWith('senayan-models-') && key !== VERSION) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.includes('/models/')) return;
  if (!MODEL_FILE.test(url.pathname) || req.destination === 'script' || url.search) return;
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
