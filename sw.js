/* Service Worker – Offline-Betrieb für die Praxis-App
   Strategie: App-Shell vorgeladen; HTML/JS/CSS network-first mit kurzem
   Timeout (bei schlechtem Praxis-WLAN antwortet sofort der Cache),
   übrige same-origin GETs cache-first mit Laufzeit-Cache. */
const VERSION = 'praxis-v10';
const NETWORK_TIMEOUT_MS = 3500;
const SHELL = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'data/abrechnung.js',
  'data/nachschlagen.js',
  'data/suche-aliase.js',
  'data/medizin.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      // cache:'reload' verhindert, dass veraltete HTTP-Cache-Kopien eingefroren werden
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function store(req, res) {
  if (res && res.status === 200 && res.type === 'basic') {
    const copy = res.clone();
    caches.open(VERSION).then(c => c.put(req, copy));
  }
  return res;
}

function fetchWithTimeout(req) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), NETWORK_TIMEOUT_MS);
  return fetch(req, { signal: ctrl.signal }).finally(() => clearTimeout(timer));
}

/* Inhalt (immer möglichst frisch): zuerst Netz mit Timeout; bei Offline,
   Timeout oder HTTP-Fehlerstatus (z. B. 404 während eines Deployments)
   aus dem Cache. */
function networkFirst(req) {
  return fetchWithTimeout(req)
    .then(res => {
      if (!res.ok) return caches.match(req).then(cached => cached || res);
      return store(req, res);
    })
    .catch(() =>
      caches.match(req).then(cached =>
        cached || (req.mode === 'navigate' ? caches.match('index.html') : undefined))
    );
}

/* Rest (schnell & robust): zuerst Cache, sonst Netz */
function cacheFirst(req) {
  return caches.match(req).then(cached => cached || fetch(req).then(res => store(req, res)));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // externe Links direkt durchlassen

  const isContent = req.mode === 'navigate' || url.pathname.endsWith('/') || /\.(html|js|css)$/.test(url.pathname);
  e.respondWith(isContent ? networkFirst(req) : cacheFirst(req));
});
