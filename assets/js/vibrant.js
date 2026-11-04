/* ConceptLab - vibrant.js (v17)
   1) Student-friendly blurry background layer (science / study icons) - used by Light (strong) and Dark (subtle)
   2) Colourful footer decoration
   3) Creator photo guard (About page): photo always shows, even on slow loads / cache issues
   Pure decoration: no existing behaviour is changed. */
(function () {
  'use strict';
  var doc = document;
  var S = 'viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
  var ICONS = {
    atom: '<ellipse cx="32" cy="32" rx="26" ry="10"/><ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(60 32 32)"/><ellipse cx="32" cy="32" rx="26" ry="10" transform="rotate(120 32 32)"/><circle cx="32" cy="32" r="3.2" fill="currentColor"/>',
    flask: '<path d="M26 8h12M28 8v16L12 52a4 4 0 0 0 3.5 6h33a4 4 0 0 0 3.5-6L36 24V8"/><path d="M19 42h26"/>',
    book: '<path d="M8 12c8-3 16-3 24 2v38c-8-5-16-5-24-2z"/><path d="M56 12c-8-3-16-3-24 2v38c8-5 16-5 24-2z"/>',
    pencil: '<path d="m10 54 4-14L42 12a5 5 0 0 1 7 0l3 3a5 5 0 0 1 0 7L24 50z"/><path d="m38 16 10 10"/>',
    gear: '<circle cx="32" cy="32" r="9"/><path d="M32 6v8M32 50v8M6 32h8M50 32h8M13.6 13.6l5.7 5.7M44.7 44.7l5.7 5.7M13.6 50.4l5.7-5.7M44.7 19.3l5.7-5.7"/>',
    calc: '<rect x="12" y="6" width="40" height="52" rx="6"/><rect x="18" y="12" width="28" height="12" rx="2"/><path d="M20 34h4M30 34h4M40 34h4M20 42h4M30 42h4M40 42h4M20 50h4M30 50h4M40 50h4"/>',
    magnet: '<path d="M14 8v26a18 18 0 0 0 36 0V8H38v26a6 6 0 0 1-12 0V8z"/><path d="M14 18h12M38 18h12"/>',
    prism: '<path d="M32 8 8 54h48z"/><path d="M4 36l22-6M38 30l22-10M38 34l22 4"/>',
    dna: '<path d="M18 6c0 14 28 14 28 26S18 46 18 58M46 6c0 14-28 14-28 26s28 14 28 26"/><path d="M22 14h20M20 32h24M22 50h20"/>',
    ruler: '<rect x="4" y="22" width="56" height="20" rx="3" transform="rotate(-30 32 32)"/><path d="m18 40 3-2M26 35l3-2M34 30l3-2M42 25l3-2"/>',
    cap: '<path d="M32 12 4 26l28 14 28-14z"/><path d="M14 33v12c8 8 28 8 36 0V33"/><path d="M60 26v16"/>',
    bulb: '<path d="M22 44c0-4-8-8-8-18a18 18 0 0 1 36 0c0 10-8 14-8 18z"/><path d="M24 52h16M27 58h10"/>',
    beaker: '<path d="M18 8h28M22 8v40a6 6 0 0 0 6 6h8a6 6 0 0 0 6-6V8"/><path d="M22 30h20"/>',
    pi: '<path d="M10 18h44M22 18v32M42 18v26c0 5 3 8 8 6"/>',
    globe: '<circle cx="32" cy="32" r="24"/><path d="M8 32h48M32 8c-12 12-12 36 0 48M32 8c12 12 12 36 0 48"/>',
    clip: '<rect x="14" y="10" width="36" height="48" rx="5"/><rect x="24" y="4" width="16" height="10" rx="3"/><path d="M22 28h20M22 38h20M22 48h12"/>'
  };
  var COLORS = ['#2563eb', '#7c3aed', '#50e4d0', '#f97316', '#10b981', '#06b6d4', '#f59e0b', '#ef4444'];

  /* [icon, left%, top%, size px, rotate deg, blur px, colour idx, float duration s, delay s] */
  var LAYOUT = [
    ['atom', 4, 8, 74, -12, 2.2, 0, 22, 0], ['book', 90, 6, 92, 10, 2.8, 1, 26, 1.2], ['flask', 15, 26, 58, 14, 1.4, 4, 20, .4],
    ['gear', 82, 24, 66, -8, 2.0, 3, 28, .8], ['pencil', 6, 46, 82, 24, 2.6, 6, 24, 1.6], ['calc', 93, 44, 70, 12, 1.6, 5, 23, .2],
    ['bulb', 10, 66, 86, -10, 2.8, 6, 27, 1.0], ['magnet', 88, 64, 78, 18, 2.2, 7, 25, .6], ['prism', 20, 88, 70, 8, 1.8, 2, 21, 1.4],
    ['dna', 78, 86, 84, -14, 2.6, 4, 29, .3], ['cap', 48, 4, 74, -6, 2.4, 1, 24, .9], ['pi', 52, 92, 66, 6, 1.6, 0, 22, 1.8],
    ['ruler', 30, 52, 60, -20, 3.4, 3, 30, .5], ['globe', 66, 40, 64, 10, 3.6, 5, 31, 1.1], ['beaker', 36, 14, 50, 12, 3.2, 2, 26, 1.5],
    ['clip', 70, 12, 56, -9, 3.4, 7, 28, .7]
  ];

  function ico(n) { return '<svg ' + S + ' aria-hidden="true" focusable="false">' + ICONS[n] + '</svg>'; }

  function buildDecor() {
    if (doc.getElementById('clDecor')) return;
    var d = doc.createElement('div'); d.id = 'clDecor'; d.className = 'cl-decor'; d.setAttribute('aria-hidden', 'true');
    var html = '<i class="cl-blob b1"></i><i class="cl-blob b2"></i><i class="cl-blob b3"></i><i class="cl-blob b4"></i><i class="cl-dots"></i>';
    LAYOUT.forEach(function (o, i) {
      html += '<span class="cl-di' + (i > 9 ? ' cl-di-x' : '') + '" style="left:' + o[1] + '%;top:' + o[2] + '%;--sz:' + o[3] + 'px;--rot:' + o[4] + 'deg;--bl:' + o[5] + 'px;--c:' + COLORS[o[6]] + ';--du:' + o[7] + 's;--de:-' + o[8] + 's">' + ico(o[0]) + '</span>';
    });
    d.innerHTML = html;
    doc.body.insertBefore(d, doc.body.firstChild);
  }

  function buildFooterDecor() {
    var f = doc.querySelector('footer.site-footer');
    if (!f || f.querySelector('.pf-deco')) return;
    var names = ['atom', 'flask', 'book', 'bulb', 'gear', 'cap', 'pencil', 'calc', 'dna', 'globe'];
    var cols = ['#7dd3fc', '#fda4af', '#fde68a', '#86efac', '#c4b5fd', '#fdba74', '#67e8f9', '#f9a8d4'];
    var x = '<div class="pf-deco" aria-hidden="true">';
    names.forEach(function (n, i) {
      x += '<span style="left:' + (4 + i * 10.4) + '%;top:' + (i % 2 ? 62 : 8) + '%;--sz:' + (34 + (i % 3) * 12) + 'px;--c:' + cols[i % cols.length] + ';--de:-' + (i * 1.7) + 's;--rot:' + (i % 2 ? 12 : -12) + 'deg">' + ico(n) + '</span>';
    });
    x += '</div><div class="pf-rainbow" aria-hidden="true"></div>';
    f.insertAdjacentHTML('afterbegin', x);
  }

  /* ---- creator photos: never leave the About-page portraits blank ---- */
  function guardCreators() {
    var P = window.CL_CREATOR_PHOTOS || {};
    var imgs = doc.querySelectorAll('#app .creator-avatar-ring img');
    for (var i = 0; i < imgs.length; i++) {
      (function (img) {
        var ring = img.parentNode;
        if (!ring || ring.__clg) return; ring.__clg = 1;
        var key = /moshiur/i.test(img.src + ' ' + (img.alt || '')) ? 'moshiur' : (/taimur/i.test(img.src + ' ' + (img.alt || '')) ? 'taimur' : '');
        var data = key && P[key];
        if (data) { img.src = data; ring.style.setProperty('--photo', 'url("' + data + '")'); }
        else { var src = img.currentSrc || img.src; if (src) ring.style.setProperty('--photo', 'url("' + src + '")'); }
        ring.classList.add('image-loaded'); ring.classList.remove('image-missing');
        img.style.cssText += ';opacity:1;visibility:visible;display:block';
      })(imgs[i]);
    }
  }

  /* pause infinite CSS animations of sections that are off-screen (big CPU/GPU saver) */
  var io = null;
  function watchSections() {
    if (!('IntersectionObserver' in window)) return;
    if (!io) io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('cl-off', !e.isIntersecting); });
    }, { rootMargin: '260px 0px', threshold: 0 });
    var t = doc.querySelectorAll('#app section, #app .hero, #app article.card, footer.site-footer, .footer-formula-motion');
    for (var i = 0; i < t.length; i++) { if (!t[i].__clw) { t[i].__clw = 1; io.observe(t[i]); } }
  }

  function init() {
    watchSections();
    buildDecor(); buildFooterDecor(); guardCreators();
    var app = doc.getElementById('app');
    if (app && window.MutationObserver) {
      var wt = 0; new MutationObserver(function () { if (app.querySelector('.creator-avatar-ring')) guardCreators(); clearTimeout(wt); wt = setTimeout(watchSections, 150); }).observe(app, { childList: true, subtree: true });
    }
    window.addEventListener('hashchange', function () { setTimeout(guardCreators, 120); });
    doc.addEventListener('visibilitychange', function () { doc.documentElement.classList.toggle('cl-hidden', doc.hidden); });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
