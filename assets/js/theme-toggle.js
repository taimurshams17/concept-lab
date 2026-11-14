/* ConceptLab — single header theme button. Cycle: Dark (default) → Indigo → Light → Dark.
 * The switch is animated with a circular reveal that expands from the button
 * (View Transitions API, with an overlay fallback) and a morphing icon. */
(function () {
  'use strict';
  var ORDER = ['dark', 'purple', 'light'];
  var LABEL = { dark: 'Dark', purple: 'Indigo', light: 'Light' };
  var BG = { dark: '#02060c', purple: '#080b25', light: '#f4f8fd' };
  var GLOW = { dark: '125,211,252', purple: '99,102,241', light: '255,196,87' };
  var busy = false;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)');

  var ICONS =
    '<svg class="tt-ico tt-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z"/></svg>' +
    '<svg class="tt-ico tt-violet" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 14.4 9l6.3 2.4-6.3 2.4L12 20.2 9.6 13.8 3.3 11.4 9.6 9z"/><path d="M19 3.5v3M17.5 5h3"/></svg>' +
    '<svg class="tt-ico tt-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.4M12 19v2.4M2.6 12H5M19 12h2.4M5.4 5.4l1.7 1.7M16.9 16.9l1.7 1.7M5.4 18.6l1.7-1.7M16.9 7.1l1.7-1.7"/></svg>';

  function current() {
    var t = document.documentElement.getAttribute('data-theme');
    return ORDER.indexOf(t) >= 0 ? t : 'dark';
  }
  function nextOf(t) { return ORDER[(ORDER.indexOf(t) + 1) % ORDER.length]; }

  function save(theme) {
    var p = {};
    try { p = JSON.parse(localStorage.getItem('clpx_prefs') || '{}') || {}; } catch (e) { }
    p.theme = theme;
    try { localStorage.setItem('clpx_prefs', JSON.stringify(p)); } catch (e) { }
  }
  function apply(theme) {
    save(theme);
    if (typeof window.CL_APPLY_PREFS === 'function') window.CL_APPLY_PREFS();
    else {
      var r = document.documentElement; r.setAttribute('data-theme', theme); r.style.colorScheme = theme === 'light' ? 'light' : 'dark';
      var lc = document.getElementById('clLightCss'); if (lc) lc.media = theme === 'light' ? 'all' : 'not all';
    }
    refresh();
  }

  function refresh() {
    var b = document.getElementById('themeToggle'); if (!b) return;
    var t = current(), n = nextOf(t);
    b.setAttribute('data-mode', t);
    b.title = 'Theme: ' + LABEL[t] + ' — click for ' + LABEL[n];
    b.setAttribute('aria-label', 'Change theme. Current: ' + LABEL[t] + '. Next: ' + LABEL[n]);
    // keep Settings page theme buttons in sync if it is open
    var btns = document.querySelectorAll('.px-theme-btn[data-pxtheme]');
    Array.prototype.forEach.call(btns, function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-pxtheme') === t ? 'true' : 'false'); });
  }

  function origin(btn) {
    var r = btn.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  function radius(o) {
    var w = innerWidth, h = innerHeight;
    return Math.hypot(Math.max(o.x, w - o.x), Math.max(o.y, h - o.y)) + 8;
  }
  function pulse(btn, theme) {
    btn.style.setProperty('--tt-glow', GLOW[theme]);
    btn.classList.remove('tt-pop'); void btn.offsetWidth; btn.classList.add('tt-pop');
    setTimeout(function () { btn.classList.remove('tt-pop'); }, 900);
  }

  function change(btn) {
    if (busy) return;
    var from = current(), to = nextOf(from), o = origin(btn), R = radius(o);
    pulse(btn, to);
    try { if (window.CL_SFX && CL_SFX.play) CL_SFX.play('soft'); } catch (e) { }

    if (reduce && reduce.matches) { apply(to); return; }
    busy = true;
    var root = document.documentElement;
    root.style.setProperty('--tt-x', o.x + 'px'); root.style.setProperty('--tt-y', o.y + 'px');
    root.style.setProperty('--tt-r', R + 'px');

    if (document.startViewTransition) {
      root.classList.add('tt-vt');
      var vt;
      try { vt = document.startViewTransition(function () { apply(to); }); }
      catch (e) { root.classList.remove('tt-vt'); apply(to); busy = false; return; }
      vt.ready.then(function () {
        var d = 900;
        root.animate(
          { clipPath: ['circle(0px at ' + o.x + 'px ' + o.y + 'px)', 'circle(' + R + 'px at ' + o.x + 'px ' + o.y + 'px)'] },
          { duration: d, easing: 'cubic-bezier(.65,.02,.2,1)', pseudoElement: '::view-transition-new(root)', fill: 'both' }
        );
        root.animate(
          { transform: ['scale(1)', 'scale(1.015)', 'scale(1)'], filter: ['brightness(1)', 'brightness(1.12)', 'brightness(1)'] },
          { duration: d, easing: 'ease-in-out', pseudoElement: '::view-transition-old(root)', fill: 'both' }
        );
      }).catch(function () { });
      var done = function () { root.classList.remove('tt-vt'); busy = false; };
      vt.finished.then(done, done);
      return;
    }

    // Fallback: expanding coloured veil, theme swaps underneath, veil dissolves.
    var veil = document.createElement('div'); veil.className = 'tt-veil';
    veil.style.cssText = 'background:radial-gradient(circle at ' + o.x + 'px ' + o.y + 'px,rgba(' + GLOW[to] + ',.35),' + BG[to] + ' 55%);clip-path:circle(0px at ' + o.x + 'px ' + o.y + 'px)';
    document.body.appendChild(veil);
    var grow = veil.animate({ clipPath: ['circle(0px at ' + o.x + 'px ' + o.y + 'px)', 'circle(' + R + 'px at ' + o.x + 'px ' + o.y + 'px)'] },
      { duration: 520, easing: 'cubic-bezier(.65,.02,.2,1)', fill: 'forwards' });
    grow.onfinish = function () {
      apply(to);
      var out = veil.animate({ opacity: [1, 0] }, { duration: 420, easing: 'ease-out', fill: 'forwards' });
      out.onfinish = function () { veil.remove(); busy = false; };
    };
  }

  function mount() {
    var hx = document.querySelector('header .hx'); if (!hx) return;
    var b = document.getElementById('themeToggle');
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.id = 'themeToggle';
      b.className = 'header-settings-link header-theme-toggle';
      b.innerHTML = '<span class="tt-stage">' + ICONS + '</span><span class="tt-ring" aria-hidden="true"></span>';
      b.addEventListener('click', function () { change(b); });
    }
    var settings = document.getElementById('headerSettingsLink');
    var anchor = settings || document.getElementById('burger') || null;
    if (b.parentNode !== hx || (anchor && b.nextSibling !== anchor)) hx.insertBefore(b, anchor);
    refresh();
  }

  function init() {
    mount();
    var hx = document.querySelector('header .hx');
    if (hx && window.MutationObserver) new MutationObserver(function () {
      var b = document.getElementById('themeToggle'), s = document.getElementById('headerSettingsLink');
      if (!b || (s && b.nextSibling !== s)) mount();
    }).observe(hx, { childList: true });
    window.addEventListener('cl-theme', refresh);
    window.addEventListener('storage', function (e) { if (e.key === 'clpx_prefs') refresh(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
