/* ConceptLab v26 — lightweight labels and cached, frame-throttled swipe progress. */
(function () {
  'use strict';
  var SHORT = {
    'Marks Needed Calculator':'Marks Needed','Goals & Milestones':'Goals','Backup & Restore':'Backup','Percent & Ratio':'Percent',
    'Eisenhower Matrix':'Eisenhower','Exam Plan Builder':'Exam Plan','Feynman Notebook':'Feynman','Study Checklists':'Checklists',
    'Revision Tracker':'Revision','Syllabus Tracker':'Syllabus','Vector Calculator':'Vector','Matrix Calculator':'Matrix',
    'Geometry Tools':'Geometry','GPA Calculator':'GPA','Weekly Planner':'Weekly Plan','Monthly Planner':'Monthly Plan',
    'Reference Shelf':'Reference','Shortcut Tricks':'Shortcuts','Formula Solver':'Solver','Score Tracker':'Scores',
    'Exam Countdown':'Countdown','Mistake Notebook (ভুলের খাতা)':'Mistake Notebook','Time Blocks (দিনের সময়সূচি)':'Time Blocks',
    'Eye Rest (২০-২০-২০)':'Eye Rest','দ্বিঘাত সমীকরণ সমাধান':'দ্বিঘাত সমীকরণ','মোলার ভর নির্ণয়':'মোলার ভর'
  };
  var mq = window.matchMedia ? window.matchMedia('(max-width:700px)') : { matches: false };
  var cachedGrid = null, bar = null, maxScroll = 0, travelPercent = 0;
  var queued = false, scrollQueued = false, atStart = null, atEnd = null;

  function grid() { return document.getElementById('launchToolGrid'); }
  function shorten(g) {
    if (!g) return;
    var tiles = g.querySelectorAll('.launch-tool');
    for (var i = 0; i < tiles.length; i++) {
      var el = tiles[i].children[1];
      if (!el) continue;
      if (!el.hasAttribute('data-full')) el.setAttribute('data-full', el.textContent.trim());
      var full = el.getAttribute('data-full');
      var want = mq.matches ? (SHORT[full] || full.replace(/\s*\([^)]*\)\s*$/, '')) : full;
      if (el.textContent !== want) el.textContent = want;
    }
  }
  function measure(g) {
    if (!g) return;
    cachedGrid = g;
    bar = g.parentNode && g.parentNode.querySelector('.launch-swipe-bar i');
    var width = g.clientWidth;
    var contentWidth = g.scrollWidth;
    maxScroll = Math.max(0, contentWidth - width);
    var ratio = contentWidth > 0 ? Math.min(1, width / contentWidth) : 1;
    travelPercent = ratio > 0 ? (1 / ratio - 1) * 100 : 0;
    if (bar) bar.style.width = (ratio * 100).toFixed(1) + '%';
    atStart = null;
    atEnd = null;
    update(g);
  }
  function update(g) {
    if (!g) return;
    if (g !== cachedGrid) { measure(g); return; }
    var left = g.scrollLeft;
    var start = left <= 2;
    var end = maxScroll <= 2 || left >= maxScroll - 3;
    if (start !== atStart) { g.classList.toggle('at-start', start); atStart = start; }
    if (end !== atEnd) { g.classList.toggle('at-end', end); atEnd = end; }
    if (bar && maxScroll > 0) {
      var next = (left / maxScroll * travelPercent).toFixed(1);
      bar.style.transform = 'translate3d(' + next + '%,0,0)';
    } else if (bar) {
      bar.style.transform = 'translate3d(0,0,0)';
    }
  }
  function bindDesktopDrag(g) {
    if (!g || g.__clDesktopDragBound) return;
    g.__clDesktopDragBound = true;
    var pointer = null, startX = 0, startLeft = 0, dragging = false;
    g.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0 || g.scrollWidth <= g.clientWidth + 2) return;
      pointer = e.pointerId; startX = e.clientX; startLeft = g.scrollLeft; dragging = false;
    }, true);
    g.addEventListener('pointermove', function (e) {
      if (pointer === null || e.pointerId !== pointer) return;
      var dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) > 6) {
        dragging = true; g.classList.add('is-dragging');
        if (g.setPointerCapture) { try { g.setPointerCapture(pointer); } catch (err) {} }
      }
      if (dragging) { g.scrollLeft = startLeft - dx; e.preventDefault(); }
    }, { capture: true, passive: false });
    function finish(e) {
      if (pointer === null || (e && e.pointerId !== pointer)) return;
      var didDrag = dragging;
      pointer = null; dragging = false; g.classList.remove('is-dragging');
      if (didDrag) {
        g.setAttribute('data-suppress-drag-click', '1');
        window.setTimeout(function () { g.removeAttribute('data-suppress-drag-click'); }, 350);
      }
    }
    g.addEventListener('pointerup', finish, true);
    g.addEventListener('pointercancel', finish, true);
    g.addEventListener('lostpointercapture', finish, true);
    g.addEventListener('click', function (e) {
      if (g.getAttribute('data-suppress-drag-click') === '1') {
        e.preventDefault(); e.stopPropagation(); g.removeAttribute('data-suppress-drag-click');
      }
    }, true);
  }
  function refresh() {
    queued = false;
    var g = grid();
    if (!g) { cachedGrid = null; bar = null; return; }
    shorten(g);
    bindDesktopDrag(g);
    measure(g);
  }
  function queue() {
    if (!queued) { queued = true; requestAnimationFrame(refresh); }
  }

  document.addEventListener('scroll', function (e) {
    var target = e.target;
    if (!target || target.id !== 'launchToolGrid' || scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(function () {
      scrollQueued = false;
      update(target);
    });
  }, { capture: true, passive: true });
  window.addEventListener('resize', queue, { passive: true });
  if (mq.addEventListener) mq.addEventListener('change', queue);

  function observeApp() {
    var app = document.getElementById('app');
    if (!app || !window.MutationObserver) { queue(); return; }
    /* Only observe page-level replacements, never nested card mutations or scroll frames. */
    new MutationObserver(queue).observe(app, { childList: true });
    queue();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observeApp, { once: true });
  else observeApp();
})();
