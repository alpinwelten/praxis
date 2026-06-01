/* Service Worker – Offline-Betrieb für die Praxis-App
   Strategie: App-Shell cache-first vorgeladen; übrige same-origin GETs
   (z. B. PDFs) werden beim ersten Zugriff in den Laufzeit-Cache gelegt. */
const VERSION = 'praxis-v3';
const SHELL = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'data/abrechnung.js',
  'data/nachschlagen.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
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
// Inhalt (immer möglichst frisch): zuerst Netz, bei Offline aus dem Cache
function networkFirst(req) {
  return fetch(req).then(res => store(req, res)).catch(() => caches.match(req));
}
// Rest (schnell & robust): zuerst Cache, sonst Netz
function cacheFirst(req) {
  return caches.match(req).then(cached => cached || fetch(req).then(res => store(req, res)));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // externe Links direkt durchlassen

  // HTML/JS/CSS/Daten = Inhalt → network-first (Updates kommen ohne Neuinstallation an)
  const isContent = req.mode === 'navigate' || url.pathname.endsWith('/') || /\.(html|js|css)$/.test(url.pathname);
  e.respondWith(isContent ? networkFirst(req) : cacheFirst(req));
});
