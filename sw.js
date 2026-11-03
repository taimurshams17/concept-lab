/* ConceptLab service worker — network-first so updates always win; cache is only an offline fallback.
   Never caches /api/ or /admin/ routes (including API responses). */
const VERSION = 'conceptlab-20261103-v49-fast-smooth-home-navigation';
const SHELL = ['./', 'index.html', 'assets/css/intro.css?v=20261101-v19-settings-audio', 'assets/js/intro.js?v=20261101-v19-settings-audio', 'assets/audio/intro-cinematic.mp3', 'assets/css/main.css?v=20261101-v26-premium', 'assets/css/polish.css?v=20261103-v35-simulation-mobile-spacing', 'assets/css/theme-light.css?v=20261103-v8-light-reveal-restored', 'assets/css/performance.css?v=20261102-v1-low-power-graph-draw', 'assets/css/ux-fixes.css?v=20261103-v7-fast-smooth-home-reveals', 'assets/css/mono-icons.css?v=20261030-mobile-control-fix-1', 'assets/css/premium.css?v=20261103-v17-theme-selector-creator-layer',
  'assets/js/texts.js', 'assets/js/defaults.js?v=20261102-v30-why-copy-compact', 'assets/js/fx.js?v=20261103-v7-prewarm-reveals', 'assets/js/sims.js', 'assets/js/topic-sims.js', 'assets/js/additional-sims.js', 'assets/js/physics-labs.js', 'assets/js/moment-inertia-lab.js?v=20261103-v1-14-mode-moment-inertia', 'assets/js/graphs.js?v=20261103-v2-remove-subject-chapter-label', 'assets/js/shortcuts.js?v=20261101-v26-premium',
  'assets/js/games.js?v=20261101-v17-sprint-answer-controls', 'assets/js/game-academy.js', 'assets/js/ayat-hadith.js', 'assets/js/casio991.js', 'assets/js/hub.js?v=20261102-v29-hubcount', 'assets/js/premium.js?v=20261103-v18-settings-kicker-removed', 'assets/js/studio.js?v=20261102-v12-base-converter-plus', 'assets/css/studio.css?v=20261031-v11-6-layout', 'assets/css/boost.css?v=20261101-v20-arcade-mobile', 'assets/js/app.js?v=20261103-v10-mobile-arcade-home-top-fast-reveals', 'assets/js/sfx.js?v=20261102-v21-soft-premium-click', 'assets/js/mono-icons.js',
  'assets/images/conceptlab-main-logo.webp', 'assets/images/tiger-real.webp', 'assets/images/deer-real.webp', 'assets/images/creator-taimur.webp', 'assets/images/creator-moshiur.webp', 'manifest.webmanifest'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (/^\/(api|admin|\.netlify)\//.test(url.pathname)) return;
    e.respondWith(fetch(req).then((res) => {
      if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {}); }
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))));
  } else if (/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then((hit) => {
      const net = fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)).catch(() => {}); return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
