/* ConceptLab service worker — network-first so updates always win; cache is only an offline fallback.
   Never caches /api/ or /admin/ routes (including API responses). */
const VERSION = 'conceptlab-20261110-v97-subject-explore-scroll-fix';
const SHELL = ['assets/js/toolkit-swipe.js?v=20261110-v27-cached-scroll-metrics', 'assets/css/intro-premium-v21.css?v=20261110-v21-violet-stable-light-premium', 'assets/css/home-toolkit-compact.css?v=20261110-v31-subject-icons-glow', 'assets/css/subject-card-polish.css?v=20261110-v2-soft-glow-colored-explore', 'assets/css/theme-toggle.css?v=20261110-v2-centered', 'assets/js/theme-toggle.js?v=20261110-v1', 'assets/css/premium-polish-v12.css?v=20261110-v3-fast-cards-dark-header', 'assets/js/app.js?v=20261110-v12-instant-subject-chapters', 'assets/css/arcade-fit-fix.css?v=20261109-v1', 'assets/css/study-room.css?v=20261109-v1', 'assets/css/hub-tools-plus.css?v=20261109-v1', 'assets/css/alinur-font.css?v=20261109-v1', 'assets/css/student-hub-premium-fix.css?v=20261110-v1-navigation-hub-premium-aqua', 'assets/css/premium-polish-v10.css?v=20261110-v1-compact-hub-feature-showcase', 'assets/css/theme-consistency-v12.css?v=20261110-v3-theme-cleanup', 'assets/js/hub-plus.js?v=20261109-v1', 'assets/js/study-room.js?v=20261109-v1', 'assets/js/hub-tools-plus.js?v=20261109-v1', 'assets/css/vibrant.css?v=20261105-v24', 'assets/css/light-calm.css?v=20261105-v27-softer', 'assets/css/experience-upgrade.css?v=20261107-v1-purple-glass', 'assets/css/premium-violet-refine.css?v=20261107-v3-violet-glass-3d', 'assets/css/comfort-glass.css?v=20261108-v2-scroll-performance', 'assets/css/theme-refresh.css?v=20261108-v3-white-intro-plum-backdrop', 'assets/css/theme-final.css?v=20261108-v3c-premium', 'assets/css/studio-pro.css?v=20261108-v1-calm-light-midnight-purple', 'assets/css/student-hub-upgrade.css?v=20261108-v1-student-hub-spotlight', 'assets/css/intro-motion-upgrade.css?v=20261108-v1-cinematic-motion', 'assets/css/arcade-premium.css?v=20261108-v2-arcade-violet-darkhub', 'assets/css/premium-experience-v5.css?v=20261108-v52-premium-polish', 'assets/css/premium-polish-v6.css?v=20261108-v6-compact-amethyst-motion', 'assets/css/premium-polish-v7.css?v=20261108-v7-arcade-all-tabs-fast-motion', 'assets/css/premium-polish-v8.css?v=20261108-v8-hub-stats-violet-settings-sound', 'assets/css/premium-polish-v9.css?v=20261108-v10-violet-blueprint-arcade-light', 'assets/js/visibility-motion.js?v=20261110-v3-light-render-profile', 'assets/js/vibrant.js?v=20261108-v5-footer-icons', 'assets/js/creator-photos.js?v=20261105-v21', 'assets/css/smooth.css?v=20261105-v17', 'assets/css/light-pro.css?v=20261104-v16', 'assets/js/enhance.js?v=20261108-v19-arcade-label', './', 'index.html', 'assets/css/intro.css?v=20261101-v19-settings-audio', 'assets/js/intro.js?v=20261101-v19-settings-audio', 'assets/audio/intro-cinematic.mp3', 'assets/css/main.css?v=20261105-v27-teal', 'assets/css/polish.css?v=20261103-v35-simulation-mobile-spacing', 'assets/css/theme-light.css?v=20261105-v9-teal', 'assets/css/performance.css?v=20261102-v1-low-power-graph-draw', 'assets/css/ux-fixes.css?v=20261103-v8-mobile-header-compact', 'assets/css/mono-icons.css?v=20261030-mobile-control-fix-1', 'assets/css/premium.css?v=20261105-v18-teal',
  'assets/js/texts.js', 'assets/js/defaults.js?v=20261108-v33-settings-intro-simplified', 'assets/js/fx.js?v=20261108-v4-violet-motion-fix', 'assets/js/sims.js', 'assets/js/topic-sims.js', 'assets/js/additional-sims.js', 'assets/js/physics-labs.js', 'assets/js/moment-inertia-lab.js?v=20261103-v1-14-mode-moment-inertia', 'assets/js/graphs.js?v=20261103-v3-sharp-canvas', 'assets/js/shortcuts.js?v=20261101-v26-premium',
  'assets/js/games.js?v=20261101-v17-sprint-answer-controls', 'assets/js/game-academy.js?v=20261108-v2-learning-match-games', 'assets/js/arcade-expansion.js?v=20261108-v5-63-playable-games', 'assets/js/ayat-hadith.js', 'assets/js/casio991.js', 'assets/js/hub.js?v=20261108-v30-hub-spotlight', 'assets/js/premium.js?v=20261110-v7-theme-api', 'assets/js/studio.js?v=20261102-v12-base-converter-plus', 'assets/css/studio.css?v=20261105-v12-teal', 'assets/css/boost.css?v=20261105-v21-teal', 'assets/js/sfx.js?v=20261108-v1-collapsible-sound-library', 'assets/js/mono-icons.js',
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
