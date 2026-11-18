/* ConceptLab v63 — keeps every simulation canvas fully visible on wide screens.
   Publishes each canvas' width/height ratio as --ar so CSS can cap its height (70vh)
   without stretching the drawing. Tiny, passive, and only touches simulation canvases. */
(function () {
  'use strict';
  var SEL = '#app .lab-detail-page .simcard canvas, #app .ga-direct-simulation .simcard canvas';
  var pending = false;
  function apply() {
    pending = false;
    var list = document.querySelectorAll(SEL);
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (!c.width || !c.height) continue;
      var ar = (c.width / c.height).toFixed(4);
      if (c.style.getPropertyValue('--ar') !== ar) c.style.setProperty('--ar', ar);
    }
  }
  function schedule() {
    if (pending) return;
    pending = true;
    (window.requestAnimationFrame || setTimeout)(apply);
  }
  function start() {
    var app = document.getElementById('app');
    if (!app) return;
    schedule();
    if ('MutationObserver' in window) new MutationObserver(schedule).observe(app, { childList: true, subtree: true });
    window.addEventListener('hashchange', schedule);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
