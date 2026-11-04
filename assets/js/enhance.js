/* ConceptLab · enhance.js (v16)
   1. Motion governor  – keeps scrolling smooth by pausing decorative infinite CSS animations
                         while the page scrolls and whenever they are off-screen.
   2. Welcome guide    – short pop-up with the student's name right after a new sign-up.
   3. Quick search     – Ctrl/⌘+K (or the 🔍 button) finds any chapter, game, lab or page.
   4. Resume strip     – "continue where you left off" on the home page.
   5. Small quality-of-life helpers (offline toast, lazy images).                                  */
(function () {
  'use strict';
  var doc = document, html = doc.documentElement;
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ 1. motion governor */
  var Gov = (function () {
    var timer = 0, mine = (typeof WeakSet === 'function') ? new WeakSet() : null, syncTimer = 0;
    function all() { try { return doc.getAnimations ? doc.getAnimations() : []; } catch (e) { return []; } }
    function isInfinite(a) {
      try { var t = a.effect && a.effect.getTiming && a.effect.getTiming(); return !!t && t.iterations === Infinity && (typeof CSSAnimation === 'undefined' || a instanceof CSSAnimation); } catch (e) { return false; }
    }
    function visible(a) {
      var el = a.effect && a.effect.target; if (!el || !el.getBoundingClientRect) return true;
      var r = el.getBoundingClientRect(), vh = window.innerHeight || 800, vw = window.innerWidth || 1200, m = 260;
      if (r.width === 0 && r.height === 0) return true;
      return r.bottom > -m && r.top < vh + m && r.right > -m && r.left < vw + m;
    }
    function pauseAll() {
      all().forEach(function (a) { if (a.playState === 'running' && isInfinite(a)) { a.pause(); if (mine) mine.add(a); } });
    }
    function sync() {
      if (doc.hidden) return;
      all().forEach(function (a) {
        if (!isInfinite(a)) return;
        var vis = visible(a);
        if (vis && a.playState === 'paused' && mine && mine.has(a)) { a.play(); mine.delete(a); }
        else if (!vis && a.playState === 'running') { a.pause(); if (mine) mine.add(a); }
      });
    }
    function later(ms) { clearTimeout(syncTimer); syncTimer = setTimeout(sync, ms || 260); }
    /* v22: scrolling / touch-holding never pauses animations. Only distance from the viewport does:
       blocks inside (or ~260px near) the screen keep animating, farther ones pause. */
    var lastSync = 0, pending = 0;
    function onScroll() {
      if (pending) return;
      pending = setTimeout(function () { pending = 0; lastSync = Date.now(); sync(); }, Math.max(0, 120 - (Date.now() - lastSync)));
    }
    function init() {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', function () { later(300); }, { passive: true });
      window.addEventListener('hashchange', function () { later(500); later(1400); });
      doc.addEventListener('visibilitychange', function () { if (!doc.hidden) later(100); });
      var app = $('#app');
      if (app && window.MutationObserver) new MutationObserver(function () { later(400); }).observe(app, { childList: true });
      later(900); setTimeout(sync, 2600);
    }
    return { init: init, sync: sync };
  })();

  /* ------------------------------------------------------------------ 2. welcome guide */
  var Welcome = (function () {
    var KEY = 'clWelcomePending', DONE = 'clWelcomeShown', box = null, prevFocus = null;
    function close() {
      if (!box) return; var b = box; box = null; b.classList.remove('on');
      doc.removeEventListener('keydown', onKey, true);
      setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 260);
      html.classList.remove('cl-modal-open');
      try { prevFocus && prevFocus.focus && prevFocus.focus(); } catch (e) { }
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key === 'Tab' && box) {
        var f = $$('button,a[href]', box); if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    function show(user) {
      if (box) return;
      var name = String((user && user.name) || '').trim().split(/\s+/).slice(0, 3).join(' ') || 'বন্ধু';
      if (name.length > 26) name = name.slice(0, 25) + '…';
      prevFocus = doc.activeElement;
      box = doc.createElement('div'); box.className = 'cl-welcome'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-labelledby', 'clWelTitle');
      box.innerHTML =
        '<div class="cl-wel-card">' +
        '<button type="button" class="cl-wel-x" data-wel="close" aria-label="বন্ধ করুন">×</button>' +
        '<div class="cl-wel-head"><span class="cl-wel-badge" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 1.2 4.8L18 9l-4.8 1.2L12 15l-1.2-4.8L6 9l4.8-1.2L12 3ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15ZM5 2l.7 2.3L8 5l-2.3.7L5 8l-.7-2.3L2 5l2.3-.7L5 2Z"/></svg></span>' +
        '<h2 id="clWelTitle">স্বাগতম, <span>' + esc(name) + '</span>!</h2>' +
        '<p>ConceptLab-এ তোমার অ্যাকাউন্ট তৈরি হয়েছে। ১ মিনিটের ছোট্ট গাইড:</p></div>' +
        '<ul class="cl-wel-list">' +
        '<li><i><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 5.5v16"/></svg></i><div><b>অধ্যায়</b><span>☰ মেনু → <em>Explore Chapters</em> — ধারণা থেকে শেখা শুরু করো।</span></div></li>' +
        '<li><i><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8h12a4 4 0 0 1 3.8 5.2l-1.2 4A2.5 2.5 0 0 1 16 18l-2-2h-4l-2 2a2.5 2.5 0 0 1-4.6-.8l-1.2-4A4 4 0 0 1 6 8Z"/><path d="M7 11v4m-2-2h4m7-1h.01M18 14h.01"/></svg></i><div><b>গেমস ও ল্যাব</b><span>নিচের বারে <em>Games</em>, <em>Labs</em>, <em>Graphs</em> — খেলে ও সিমুলেশন চালিয়ে প্র্যাকটিস।</span></div></li>' +
        '<li><i><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5"/></svg></i><div><b>Student Hub</b><span>নিচের বারে <em>Hub</em> — প্ল্যানার, ফোকাস টাইমার, ফর্মুলা সলভার।</span></div></li>' +
        '<li><i><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18M7 15l4-5 4 3 5-7"/></svg></i><div><b>অগ্রগতি</b><span>☰ মেনু → <em>My Progress</em> — XP, স্ট্রিক ও লিডারবোর্ড।</span></div></li>' +
        '<li><i><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/></svg></i><div><b>সেটিংস</b><span>উপরের গিয়ার আইকনে — Light/Dark থিম, সাউন্ড ও মোশন বদলাও।</span></div></li>' +
        '<li><i><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></i><div><b>খুঁজে নাও</b><span><em>Ctrl + K</em> বা উপরের সার্চ আইকনে — যেকোনো অধ্যায়, গেম বা ল্যাব।</span></div></li>' +
        '</ul>' +
        '<div class="cl-wel-actions"><a class="btn pri" href="#/chapters" data-wel="go">শুরু করি →</a><button type="button" class="btn" data-wel="close">পরে দেখব</button></div>' +
        '</div>';
      box.addEventListener('click', function (e) {
        var t = e.target;
        if (t === box || (t.closest && t.closest('[data-wel]'))) close();
      });
      doc.body.appendChild(box); html.classList.add('cl-modal-open');
      doc.addEventListener('keydown', onKey, true);
      requestAnimationFrame(function () { box && box.classList.add('on'); var g = $('[data-wel="go"]', box); g && g.focus({ preventScroll: true }); });
      try { if (window.FX && FX.confetti && !reduce) setTimeout(function () { FX.confetti(innerWidth / 2, innerHeight * .3, 70); }, 250); } catch (e) { }
      lsSet(DONE, 1);
    }
    function queue(user) {
      lsSet(KEY, { name: user && user.name, t: Date.now() });
      setTimeout(flush, 650);
    }
    function flush() {
      var p = lsGet(KEY, null); if (!p) return;
      if (/^#\/account\/(signup|signin)/.test(location.hash)) { setTimeout(flush, 500); return; }
      try { localStorage.removeItem(KEY); } catch (e) { }
      if (Date.now() - (p.t || 0) < 10 * 60 * 1000) show(p);
    }
    return { queue: queue, show: show, flush: flush };
  })();
  window.CLWelcome = Welcome;

  /* ------------------------------------------------------------------ 3. quick search */
  var Search = (function () {
    var pages = [
      ['Home', 'হোম', '#/', '🏠', 'home main'], ['Explore Chapters', 'অধ্যায়সমূহ', '#/chapters', '📖', 'chapters lesson physics chemistry math অধ্যায়'],
      ['Games', 'গেমস', '#/play', '🎮', 'games play quiz খেলা'], ['Simulations', 'সিমুলেশন ল্যাব', '#/lab', '🔬', 'lab simulation experiment পরীক্ষা'],
      ['Graph Lab', 'গ্রাফ ল্যাব', '#/graphs', '📈', 'graph plot গ্রাফ'], ['Leaderboard', 'লিডারবোর্ড', '#/leaderboard', '🏆', 'rank leaderboard র‍্যাংক'],
      ['My Progress', 'আমার অগ্রগতি', '#/progress', '📊', 'progress xp streak অগ্রগতি'], ['Study Space', 'স্টাডি স্পেস', '#/study-space', '🪴', 'study space notes'],
      ['Student Hub', 'স্টুডেন্ট হাব', '#/hub', '🎓', 'hub planner timer calculator tools'], ['Daily & Missions', 'ডেইলি মিশন', '#/daily', '🎯', 'daily mission challenge'],
      ['Smart Practice', 'স্মার্ট প্র্যাকটিস', '#/smart-practice', '🧠', 'practice mcq smart'], ['Analytics', 'অ্যানালিটিক্স', '#/analytics', '📉', 'analytics report'],
      ['Formula Solver', 'ফর্মুলা সলভার', '#/solver', '🧮', 'formula solver calculate সূত্র'], ['Reference Shelf', 'রেফারেন্স শেলফ', '#/reference', '📚', 'reference constants সূত্র ধ্রুবক'],
      ['Shortcut Tricks', 'শর্টকাট ট্রিকস', '#/shortcuts', '⚡', 'shortcut tricks শর্টকাট'], ['Progress Card', 'প্রোগ্রেস কার্ড', '#/share-card', '🏅', 'share card'],
      ['Settings', 'সেটিংস', '#/settings', '⚙️', 'settings theme light dark sound থিম'], ['Profile', 'প্রোফাইল', '#/profile', '👤', 'profile account'],
      ['About', 'সম্পর্কে', '#/about', '✦', 'about contact feedback']
    ];
    var items = null, box = null, sel = 0, shown = [], prevFocus = null;
    var subj = { phy: 'পদার্থবিজ্ঞান', chem: 'রসায়ন', math: 'উচ্চতর গণিত' };
    function build() {
      if (items) return items; items = [];
      pages.forEach(function (p) { items.push({ t: p[0], sub: p[1], href: p[2], ico: p[3], k: (p[0] + ' ' + p[1] + ' ' + p[4]).toLowerCase(), type: 'পেজ', w: 3 }); });
      var D = window.CL_DEF || {};
      (D.chapters || []).forEach(function (c) { if (c && c.id && c.t) items.push({ t: c.t, sub: subj[c.s] || 'অধ্যায়', href: '#/chapter/' + c.id, ico: c.s === 'phy' ? '⚛️' : c.s === 'chem' ? '🧪' : '∑', k: (c.t + ' ' + (subj[c.s] || '') + ' ' + (c.s || '')).toLowerCase(), type: 'অধ্যায়', w: 2 }); });
      (D.games || []).forEach(function (g) { if (g && g.id && g.t && g.on !== false) items.push({ t: g.t, sub: 'গেম' + (g.diff ? ' · ' + g.diff : ''), href: '#/play/' + g.id, ico: g.icon || '🎮', k: (g.t + ' game খেলা ' + (g.d || '')).toLowerCase(), type: 'গেম', w: 1 }); });
      (D.labs || []).forEach(function (l) { if (l && l.id && l.t && l.on !== false) items.push({ t: l.t, sub: (l.sub || 'ল্যাব') + (l.chapter ? ' · ' + l.chapter : ''), href: '#/lab/' + l.id, ico: l.icon || '🔬', k: (l.t + ' lab simulation ' + (l.sub || '') + ' ' + (l.chapter || '')).toLowerCase(), type: 'ল্যাব', w: 1 }); });
      return items;
    }
    function score(it, toks) {
      var s = 0, t = it.t.toLowerCase();
      for (var i = 0; i < toks.length; i++) {
        var q = toks[i], idx = it.k.indexOf(q); if (idx < 0) return -1;
        s += (t.indexOf(q) === 0 ? 30 : t.indexOf(q) > 0 ? 18 : 8) + (idx === 0 ? 4 : 0);
      }
      return s + it.w;
    }
    function results(q) {
      var list = build(); q = String(q || '').trim().toLowerCase();
      if (!q) return pages.slice(0, 8).map(function (p) { return list.filter(function (x) { return x.href === p[2]; })[0]; }).filter(Boolean);
      var toks = q.split(/\s+/), out = [];
      list.forEach(function (it) { var s = score(it, toks); if (s >= 0) out.push([s, it]); });
      out.sort(function (a, b) { return b[0] - a[0]; });
      return out.slice(0, 12).map(function (x) { return x[1]; });
    }
    function render() {
      var q = $('#clSearchInput', box).value, list = $('#clSearchList', box);
      shown = results(q); sel = 0;
      if (!shown.length) { list.innerHTML = '<li class="cl-sr-empty">“' + esc(q) + '” পাওয়া যায়নি। অন্য শব্দ দিয়ে চেষ্টা করো।</li>'; return; }
      list.innerHTML = shown.map(function (it, i) {
        return '<li role="option" id="clSr' + i + '" data-i="' + i + '" class="' + (i === 0 ? 'on' : '') + '" aria-selected="' + (i === 0) + '"><i aria-hidden="true">' + esc(it.ico) + '</i><span><b>' + esc(it.t) + '</b><small>' + esc(it.sub) + '</small></span><em>' + esc(it.type) + '</em></li>';
      }).join('');
    }
    function mark() {
      $$('#clSearchList li', box).forEach(function (li, i) { li.classList.toggle('on', i === sel); li.setAttribute('aria-selected', i === sel ? 'true' : 'false'); if (i === sel) li.scrollIntoView({ block: 'nearest' }); });
    }
    function go(i) {
      var it = shown[i]; if (!it) return; close(); location.hash = it.href;
    }
    function close() {
      if (!box) return; var b = box; box = null; b.classList.remove('on'); html.classList.remove('cl-modal-open');
      setTimeout(function () { b.parentNode && b.parentNode.removeChild(b); }, 200);
      try { prevFocus && prevFocus.focus && prevFocus.focus(); } catch (e) { }
    }
    function open() {
      if (box) { $('#clSearchInput', box).focus(); return; }
      prevFocus = doc.activeElement;
      box = doc.createElement('div'); box.className = 'cl-search'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'খুঁজুন');
      box.innerHTML = '<div class="cl-search-card"><div class="cl-search-bar"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
        '<input id="clSearchInput" type="text" autocomplete="off" spellcheck="false" placeholder="অধ্যায়, গেম, ল্যাব বা টুল খুঁজুন…" role="combobox" aria-expanded="true" aria-controls="clSearchList"><kbd>Esc</kbd></div>' +
        '<ul id="clSearchList" role="listbox"></ul><div class="cl-search-foot"><span><kbd>↑</kbd><kbd>↓</kbd> বাছাই</span><span><kbd>Enter</kbd> খুলুন</span><span class="cl-sf-r"><kbd>Ctrl</kbd>+<kbd>K</kbd></span></div></div>';
      doc.body.appendChild(box); html.classList.add('cl-modal-open'); render();
      var inp = $('#clSearchInput', box);
      inp.addEventListener('input', render);
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(shown.length - 1, sel + 1); mark(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); }
        else if (e.key === 'Enter') { e.preventDefault(); go(sel); }
      });
      box.addEventListener('mousedown', function (e) {
        var li = e.target.closest && e.target.closest('li[data-i]'); if (li) { e.preventDefault(); go(+li.getAttribute('data-i')); }
        else if (e.target === box) close();
      });
      requestAnimationFrame(function () { box && box.classList.add('on'); inp.focus(); });
    }
    function injectButton() {
      var hx = $('.hx'); if (!hx || $('#clSearchBtn')) return;
      var b = doc.createElement('button'); b.type = 'button'; b.id = 'clSearchBtn'; b.className = 'header-search-btn'; b.setAttribute('aria-label', 'খুঁজুন (Ctrl+K)'); b.title = 'খুঁজুন (Ctrl+K)';
      b.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
      b.addEventListener('click', open);
      var s = $('#headerSettingsLink', hx); hx.insertBefore(b, s || hx.firstChild);
    }
    function injectNavItem() {
      var nav = $('#nav'); if (!nav || $('#clNavSearch', nav)) return;
      var a = doc.createElement('a'); a.href = '#/'; a.id = 'clNavSearch'; a.className = 'cl-nav-search'; a.setAttribute('role', 'button');
      a.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg> খুঁজুন</span> <small>Ctrl+K</small>';
      a.addEventListener('click', function (e) { e.preventDefault(); var b = $('#navBackdrop'); if (doc.body.classList.contains('navopen') && b) b.click(); setTimeout(open, 60); });
      nav.insertBefore(a, nav.firstChild);
    }
    function init() {
      injectButton(); injectNavItem();
      window.addEventListener('hashchange', function () { injectButton(); injectNavItem(); });
      doc.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); box ? close() : open(); }
        else if (e.key === 'Escape' && box) { e.preventDefault(); close(); }
        else if (e.key === '/' && !box && !/^(INPUT|TEXTAREA|SELECT)$/.test((doc.activeElement || {}).tagName || '') && !(doc.activeElement && doc.activeElement.isContentEditable)) { e.preventDefault(); open(); }
      });
    }
    return { init: init, open: open, title: function (href) { var l = build().filter(function (x) { return x.href === href; })[0]; return l || null; } };
  })();
  window.CLSearch = Search;

  /* ------------------------------------------------------------------ 4. resume strip */
  var Resume = (function () {
    var K = 'clResume_v1';
    function track() {
      var m = /^#\/(chapter|lab|play)\/([^\/?#]+)/.exec(location.hash || ''); if (!m) return;
      var href = '#/' + m[1] + '/' + m[2], it = Search.title(href); if (!it) return;
      lsSet(K, { href: href, t: it.t, sub: it.sub, ico: it.ico, type: it.type, at: Date.now() });
    }
    function paint() {
      var app = $('#app'); if (!app || app.getAttribute('data-page') !== 'home' || $('#clResume')) return;
      var r = lsGet(K, null); if (!r || !r.href) return;
      var anchor = $('.marq', app) || app.children[1]; if (!anchor) return;
      var d = doc.createElement('div'); d.id = 'clResume'; d.className = 'cl-resume w';
      d.innerHTML = '<a href="' + esc(r.href) + '"><i aria-hidden="true">' + esc(r.ico || '▶') + '</i><span><small>শেষবার যেখানে ছিলে · ' + esc(r.type || '') + '</small><b>' + esc(r.t) + '</b></span><em>চালিয়ে যাও →</em></a>';
      anchor.parentNode.insertBefore(d, anchor.nextSibling);
    }
    function init() {
      track(); window.addEventListener('hashchange', function () { track(); setTimeout(paint, 450); });
      var app = $('#app'); if (app && window.MutationObserver) new MutationObserver(function () { paint(); }).observe(app, { childList: true });
      setTimeout(paint, 700);
    }
    return { init: init };
  })();

  /* ------------------------------------------------------------------ 5. helpers */
  function helpers() {
    var app = $('#app');
    function lazy() { $$('#app img:not([loading])').forEach(function (im) { im.loading = 'lazy'; im.decoding = 'async'; }); }
    if (app && window.MutationObserver) { new MutationObserver(function () { lazy(); }).observe(app, { childList: true, subtree: true }); }
    lazy();
    var off = false;
    window.addEventListener('offline', function () { off = true; try { FX.toast('📡 ইন্টারনেট নেই — সেভ করা কনটেন্ট চলবে।', 'bad'); } catch (e) { } });
    window.addEventListener('online', function () { if (off) { off = false; try { FX.toast('✅ আবার অনলাইনে ফিরেছ।', 'ok'); } catch (e) { } } });
  }

  function boot() {
    Gov.init(); Search.init(); Resume.init(); helpers(); Welcome.flush();
    /* A logged-in student might open the site on a fresh tab right after signing up. */
    window.addEventListener('hashchange', function () { if (lsGet('clWelcomePending', null)) Welcome.flush(); });
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot); else boot();
})();
