/* ConceptLab v70 — improve arrow state when the homepage tool rail is refreshed. */
(function () {
  'use strict';
  function sync() {
    var rail = document.getElementById('launchToolGrid');
    if (!rail) return;
    var wrap = rail.parentNode;
    var prev = wrap && wrap.querySelector('[data-launch-dir="prev"]');
    var next = wrap && wrap.querySelector('[data-launch-dir="next"]');
    var max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    if (prev) { prev.disabled = rail.scrollLeft <= 2; prev.setAttribute('aria-disabled', prev.disabled ? 'true' : 'false'); }
    if (next) { next.disabled = max <= 2 || rail.scrollLeft >= max - 3; next.setAttribute('aria-disabled', next.disabled ? 'true' : 'false'); }
  }
  document.addEventListener('scroll', function (event) {
    if (event.target && event.target.id === 'launchToolGrid') window.requestAnimationFrame(sync);
  }, true);
  window.addEventListener('resize', sync, { passive: true });
  if (window.MutationObserver) {
    var app = document.getElementById('app');
    if (app) new MutationObserver(sync).observe(app, { childList: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync, { once: true });
  else sync();
})();
