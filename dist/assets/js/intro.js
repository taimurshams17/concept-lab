/* ConceptLab cinematic intro — gentle soundtrack controlled from Settings. */
(function () {
  'use strict';
  var el = document.getElementById('intro'), root = document.documentElement;
  if (!el || root.classList.contains('intro-seen')) { if (el) el.remove(); return; }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MIN = reduce ? 2000 : 4300, MAX = 6800, t0 = performance.now();
  var loaded = document.readyState === 'complete', done = false, raf = 0;
  var fill = el.querySelector('.in-fill'), nodes = [].slice.call(el.querySelectorAll('.in-prog li'));
  root.classList.add('intro-on');
  function ready() { loaded = true; }
  if (!loaded) window.addEventListener('load', ready, { once: true });

  var MUSIC_KEY = 'cl_intro_music_v1';
  var music = null, musicRAF = 0, musicStarted = false, gestureFallbackArmed = false;
  var musicTarget = 0.28;
  function readMusicPreference() {
    var pref = { on: true, vol: 0.28 };
    try {
      var saved = JSON.parse(localStorage.getItem(MUSIC_KEY) || 'null');
      if (saved && typeof saved === 'object') {
        if (typeof saved.on === 'boolean') pref.on = saved.on;
        if (isFinite(saved.vol)) pref.vol = Math.max(0, Math.min(0.32, +saved.vol));
      }
    } catch (e) {}
    return pref;
  }
  function beginFade() {
    if (!music || done) return;
    cancelAnimationFrame(musicRAF);
    var startedAt = performance.now();
    function fadeIn() {
      if (!music || done) return;
      var amount = Math.min(1, (performance.now() - startedAt) / 1100);
      try { music.volume = musicTarget * amount; } catch (e) {}
      if (amount < 1) musicRAF = requestAnimationFrame(fadeIn);
    }
    musicRAF = requestAnimationFrame(fadeIn);
  }
  function startMusic() {
    if (done || !music || musicStarted) return;
    musicStarted = true;
    try {
      music.currentTime = 0;
      var promise = music.play();
      if (promise && typeof promise.then === 'function') {
        promise.then(function () { if (!done) beginFade(); }).catch(function () { musicStarted = false; });
      } else if (!music.paused) beginFade();
      else musicStarted = false;
    } catch (e) { musicStarted = false; }
  }
  function installGestureFallback() {
    if (gestureFallbackArmed || done || !music) return;
    gestureFallbackArmed = true;
    var unlock = function (event) {
      var target = event && event.target;
      if (target && target.closest && target.closest('#introSkip')) return;
      if (!done) startMusic();
    };
    document.addEventListener('pointerdown', unlock, { once: true, capture: true, passive: true });
    document.addEventListener('touchstart', unlock, { once: true, capture: true, passive: true });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' && !done) startMusic();
    }, { once: true, capture: true });
  }
  function prepareMusic() {
    var pref = readMusicPreference();
    if (!pref.on || pref.vol <= 0) return;
    /* Lower than the previous build: the soundtrack stays in the background. */
    musicTarget = Math.min(0.28, pref.vol || 0.28);
    music = document.createElement('audio');
    music.src = 'assets/audio/intro-cinematic.mp3?v=20261101-v19-soft-intro';
    music.preload = 'auto'; music.loop = false; music.volume = 0;
    music.setAttribute('playsinline', ''); music.setAttribute('aria-hidden', 'true');
    music.addEventListener('error', function () {
      musicStarted = false;
      if (music && music.parentNode) music.parentNode.removeChild(music);
      music = null;
    });
    music.addEventListener('ended', function () { musicStarted = false; });
    document.body.appendChild(music);
    installGestureFallback();
    /* Try autoplay; Settings includes a preview control to grant a user-gesture unlock when needed. */
    startMusic();
  }
  function stopMusic() {
    if (!music) return;
    cancelAnimationFrame(musicRAF);
    var started = performance.now(), initial = music.volume;
    function fadeOut() {
      if (!music) return;
      var amount = Math.min(1, (performance.now() - started) / 420);
      try { music.volume = Math.max(0, initial * (1 - amount)); } catch (e) {}
      if (amount < 1) { musicRAF = requestAnimationFrame(fadeOut); return; }
      try { music.pause(); music.currentTime = 0; } catch (e) {}
      if (music.parentNode) music.parentNode.removeChild(music);
      music = null;
    }
    musicRAF = requestAnimationFrame(fadeOut);
  }
  prepareMusic();

  function ease(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
  function finish() {
    if (done) return;
    done = true; cancelAnimationFrame(raf); stopMusic();
    try { sessionStorage.setItem('cl-intro-seen', '1'); } catch (e) {}
    el.classList.add('out');
    setTimeout(function () {
      root.classList.remove('intro-on'); root.classList.add('intro-seen');
      if (el.parentNode) el.parentNode.removeChild(el);
    }, reduce ? 160 : 930);
  }
  var closing = false;
  function tick(now) {
    if (done || closing) return;
    var elapsed = now - t0, progress = ease(Math.min(1, elapsed / MIN));
    if (!loaded && elapsed < MAX) progress = Math.min(progress, 0.94);
    if (fill) fill.style.transform = 'scaleX(' + progress.toFixed(4) + ')';
    for (var i = 0; i < nodes.length; i++) nodes[i].classList.toggle('on', progress >= i / Math.max(1, nodes.length - 1) - 0.001 && (i > 0 || elapsed > 1100));
    if (progress >= 1) { closing = true; setTimeout(finish, reduce ? 40 : 480); return; }
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  var skip = document.getElementById('introSkip');
  if (skip) skip.addEventListener('click', finish);
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); }, { once: true });
})();
