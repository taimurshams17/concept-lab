/* ConceptLab · lightweight viewport-aware animation lifecycle.
   Observe animation-owning sections rather than hundreds of individual cards. */
(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) return;

  var selectors = [
    '#app .hero-visual-card',
    '#app .hub-home-spotlight',
    '#app .hub-dashboard',
    '#app .home-launchpad',
    '#app .sec-stages',
    '#app .sec-features',
    '#app .sec-sims',
    '#app .home-brain-sprint',
    '#app .home-science-outro',
    '#app .home-games',
    '#app .home-lab',
    '#app .home-final-cta',
    '#app .arcade-page .ga-hero',
    '#app .arcade-page .ga-subject-block',
    '#app .lab-page',
    '#app .graph-page',
    'footer.site-footer'
  ].join(',');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        entry.target.classList.remove('cl-motion-paused');
      } else {
        entry.target.classList.add('cl-motion-paused');
      }
    });
  }, { root: null, rootMargin: '220px 0px 260px 0px', threshold: 0.01 });

  function watch(scope) {
    if (!scope || !scope.querySelectorAll) return;
    var nodes = [];
    if (scope.matches && scope.matches(selectors)) nodes.push(scope);
    var found = scope.querySelectorAll(selectors);
    for (var i = 0; i < found.length; i++) nodes.push(found[i]);
    nodes.forEach(function (node) {
      if (node.dataset.clMotionObserved === '1') return;
      node.dataset.clMotionObserved = '1';
      node.classList.add('cl-motion-paused');
      observer.observe(node);
    });
  }

  function scan() {
    watch(document.getElementById('app'));
    watch(document.querySelector('footer.site-footer'));
  }

  var pending = false;
  function scheduleScan() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(function () {
      pending = false;
      scan();
    });
  }

  scan();
  var app = document.getElementById('app');
  if (app && 'MutationObserver' in window) {
    new MutationObserver(scheduleScan).observe(app, { childList: true, subtree: true });
  }
  document.addEventListener('visibilitychange', function () {
    document.documentElement.classList.toggle('cl-page-hidden', document.hidden);
    if (!document.hidden) scheduleScan();
  });
})();
