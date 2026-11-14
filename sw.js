/* ConceptLab service worker — network-first so updates always win; cache is only an offline fallback.
   Never caches /api/ or /admin/ routes (including API responses). */
const VERSION = 'conceptlab-20261114-v124-wide-labs-v63';
const SHELL = ['assets/css/bundle-1.css?v=20261114-v63-bundle', 'assets/css/theme-light.css?v=20261105-v9-teal', 'assets/css/bundle-2.css?v=20261114-v63-bundle', 'assets/js/toolkit-swipe.js?v=20261112-v34-desktop-swipe', 'assets/js/theme-toggle.js?v=20261112-v37-indigo', 'assets/js/app.js?v=20261114-v63',
  'assets/js/lab-fit-v63.js?v=20261114-v63', 'assets/js/hub-plus.js?v=20261109-v1', 'assets/js/study-room.js?v=20261109-v1', 'assets/js/hub-tools-plus.js?v=20261109-v1', 'assets/js/visibility-motion.js?v=20261110-v3-light-render-profile', 'assets/js/vibrant.js?v=20261108-v5-footer-icons', 'assets/js/creator-photos.js?v=20261105-v21', 'assets/js/enhance.js?v=20261112-v42-scroll-governor-optimized', './', 'index.html', 'assets/js/intro.js?v=20261101-v19-settings-audio', 'assets/audio/intro-cinematic.mp3', 'assets/js/texts.js', 'assets/js/defaults.js?v=20261114-v59', 'assets/js/fx.js?v=20261108-v4-violet-motion-fix', 'assets/js/sims.js?v=20261114-v63', 'assets/js/topic-sims.js?v=20261114-v63', 'assets/js/additional-sims.js?v=20261114-v63', 'assets/js/physics-labs.js?v=20261114-v63', 'assets/js/moment-inertia-lab.js?v=20261114-v63-wide', 'assets/js/graphs.js?v=20261103-v3-sharp-canvas', 'assets/js/shortcuts.js?v=20261101-v26-premium',
  'assets/js/games.js?v=20261111-v33-simulation-presets', 'assets/js/game-academy.js?v=20261108-v2-learning-match-games', 'assets/js/arcade-expansion.js?v=20261108-v5-63-playable-games', 'assets/js/ayat-hadith.js', 'assets/js/casio991.js', 'assets/js/hub.js?v=20261108-v30-hub-spotlight', 'assets/js/premium.js?v=20261112-v42-theme-settings-cleanup', 'assets/js/studio.js?v=20261112-v34-tool-registry', 'assets/js/sfx.js?v=20261108-v1-collapsible-sound-library', 'assets/js/mono-icons.js',
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
