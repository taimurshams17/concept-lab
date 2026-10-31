from pathlib import Path
import re

ROOT = Path('/mnt/data/conceptlab_v19_work')

# ---------- Intro soundtrack behavior ----------
intro_js = r'''/* ConceptLab cinematic intro — gentle soundtrack controlled from Settings. */
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
'''
(ROOT / 'assets/js/intro.js').write_text(intro_js, encoding='utf-8')

# ---------- Sound effects engine: louder button click and additional original cues ----------
sfx_path = ROOT / 'assets/js/sfx.js'
sfx = sfx_path.read_text(encoding='utf-8')
sfx = sfx.replace("var st = { on: true, vol: 0.6, haptics: true };", "var st = { on: true, vol: 0.68, haptics: true };")
sfx = sfx.replace("master.gain.value = st.vol * 0.9;", "master.gain.value = st.vol * 1.04;")
sfx = sfx.replace("if (master) master.gain.value = st.vol * 0.9;", "if (master) master.gain.value = st.vol * 1.04;")
sfx = sfx.replace("tap: function (t) { /* a warm, glassy major chord instead of the old electronic click */ tone(659.25, t, 0.19, 'sine', 0.105, 587.33); tone(987.77, t + 0.025, 0.22, 'sine', 0.052, 880); tone(1318.51, t + 0.045, 0.25, 'sine', 0.026, 1174.66); },",
"tap: function (t) { /* fuller, brighter glass-bell click with a gentle rounded tail */ tone(659.25, t, 0.2, 'sine', 0.16, 587.33); tone(987.77, t + 0.022, 0.23, 'sine', 0.082, 880); tone(1318.51, t + 0.045, 0.27, 'sine', 0.046, 1174.66); tone(523.25, t + 0.018, 0.16, 'triangle', 0.025, 587.33); },")
sfx = sfx.replace("    countdown: function (t) { tone(440, t, 0.07, 'square', 0.035); tone(330, t + 0.11, 0.09, 'square', 0.045); }",
"    countdown: function (t) { tone(440, t, 0.07, 'square', 0.035); tone(330, t + 0.11, 0.09, 'square', 0.045); },\n    save: function (t) { tone(523.25, t, 0.12, 'sine', 0.09); tone(659.25, t + 0.07, 0.15, 'sine', 0.11); tone(1046.5, t + 0.13, 0.22, 'sine', 0.055); },\n    remove: function (t) { tone(659.25, t, 0.11, 'triangle', 0.065, 523.25); tone(440, t + 0.08, 0.16, 'sine', 0.055, 349.23); },\n    bookmark: function (t) { tone(783.99, t, 0.16, 'sine', 0.085); tone(1174.66, t + 0.08, 0.24, 'sine', 0.065); tone(1567.98, t + 0.12, 0.3, 'triangle', 0.035); },\n    focus: function (t) { tone(293.66, t, 0.22, 'sine', 0.075, 349.23); tone(587.33, t + 0.13, 0.3, 'sine', 0.045, 659.25); },\n    filter: function (t) { tone(880, t, 0.095, 'sine', 0.07, 783.99); tone(1174.66, t + 0.09, 0.13, 'sine', 0.065, 1046.5); },\n    reminder: function (t) { tone(659.25, t, 0.25, 'sine', 0.075); tone(880, t + 0.28, 0.32, 'sine', 0.055); },\n    reset: function (t) { tone(783.99, t, 0.12, 'sine', 0.07, 659.25); tone(587.33, t + 0.10, 0.14, 'sine', 0.065, 523.25); tone(392, t + 0.20, 0.18, 'triangle', 0.045); }")
sfx = sfx.replace("var HAPTIC = { correct: 14, wrong: [18, 40, 18], win: [14, 30, 14, 30, 40], perfect: [14, 25, 14, 25, 30], gameStart: [10, 25, 10], levelup: [14, 30, 14, 30, 40], badge: [20, 40, 30], unlock: [10, 25, 20], on: 8, off: 8, error: [20, 30, 20] };",
"var HAPTIC = { correct: 14, wrong: [18, 40, 18], win: [14, 30, 14, 30, 40], perfect: [14, 25, 14, 25, 30], gameStart: [10, 25, 10], levelup: [14, 30, 14, 30, 40], badge: [20, 40, 30], unlock: [10, 25, 20], on: 8, off: 8, error: [20, 30, 20], save: 10, bookmark: 8, focus: 8, reset: [12, 20, 12] };")
sfx = sfx.replace("var MIN_GAP = { tap: 45, soft: 45, nav: 90, tick: 55, notify: 250, coin: 200, select: 90, gameStart: 350, streak: 180, perfect: 700, complete: 650, unlock: 450, mystery: 600, countdown: 100 };",
"var MIN_GAP = { tap: 50, soft: 55, nav: 90, tick: 55, notify: 250, coin: 200, select: 90, gameStart: 350, streak: 180, perfect: 700, complete: 650, unlock: 450, mystery: 600, countdown: 100, save: 250, remove: 250, bookmark: 220, focus: 220, filter: 100, reminder: 450, reset: 350 };")
# Add intro music preference state after local sound preference loading.
needle = "  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { } }\n\n  var ctx = null, master = null, noiseBuf = null, lastPlay = {}, lastSpecial = 0, lastAnswer = 0, lastClick = 0;"
repl = """  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { } }

  var INTRO_KEY = 'cl_intro_music_v1';
  var introPref = { on: true, vol: 0.28 };
  try {
    var introSaved = JSON.parse(localStorage.getItem(INTRO_KEY) || 'null');
    if (introSaved && typeof introSaved === 'object') {
      if (typeof introSaved.on === 'boolean') introPref.on = introSaved.on;
      if (isFinite(introSaved.vol)) introPref.vol = Math.max(0, Math.min(0.28, +introSaved.vol));
    }
  } catch (e) { }
  var introPreviewAudio = null, introPreviewRAF = 0;
  function saveIntroPref() { try { localStorage.setItem(INTRO_KEY, JSON.stringify(introPref)); } catch (e) { } }
  function stopIntroPreview() {
    if (!introPreviewAudio) return;
    cancelAnimationFrame(introPreviewRAF);
    var audio = introPreviewAudio, started = performance.now(), initial = audio.volume;
    function fade() {
      if (introPreviewAudio !== audio) return;
      var p = Math.min(1, (performance.now() - started) / 240);
      audio.volume = Math.max(0, initial * (1 - p));
      if (p < 1) { introPreviewRAF = requestAnimationFrame(fade); return; }
      try { audio.pause(); audio.currentTime = 0; } catch (e) { }
      introPreviewAudio = null;
      syncIntroPreviewStatus('Preview stopped');
    }
    introPreviewRAF = requestAnimationFrame(fade);
  }
  function syncIntroPreviewStatus(message) {
    var status = document.getElementById('introMusicStatus');
    if (status) status.textContent = message || (introPref.on ? 'Enabled for the next intro' : 'Disabled');
    var btn = document.querySelector('[data-intro-preview]');
    if (btn) btn.textContent = introPreviewAudio ? 'Stop preview' : 'Preview intro music';
  }
  function playIntroPreview() {
    if (introPreviewAudio) { stopIntroPreview(); return; }
    var audio = new Audio('assets/audio/intro-cinematic.mp3?v=20261101-v19-soft-intro');
    introPreviewAudio = audio;
    audio.preload = 'auto'; audio.loop = false; audio.volume = Math.max(0.02, Math.min(0.28, introPref.vol || 0.28));
    audio.addEventListener('ended', function () { if (introPreviewAudio === audio) { introPreviewAudio = null; syncIntroPreviewStatus('Preview finished'); } });
    audio.addEventListener('error', function () { if (introPreviewAudio === audio) { introPreviewAudio = null; syncIntroPreviewStatus('Audio could not be loaded'); } });
    syncIntroPreviewStatus('Playing preview…');
    var result = audio.play();
    if (result && typeof result.catch === 'function') result.catch(function () { if (introPreviewAudio === audio) { introPreviewAudio = null; syncIntroPreviewStatus('Tap Preview to allow audio'); } });
  }
"""
if needle not in sfx:
    raise SystemExit('Could not find SFX state insertion anchor')
sfx = sfx.replace(needle, repl)
# Extend click exclusion and action mapping.
sfx = sfx.replace("if (!t || t.disabled || t.hasAttribute('data-nosfx') || t.hasAttribute('data-sfx-tog') || t.hasAttribute('data-sfx-prev')) return;",
"if (!t || t.disabled || t.hasAttribute('data-nosfx') || t.hasAttribute('data-sfx-tog') || t.hasAttribute('data-sfx-prev') || t.hasAttribute('data-intro-music') || t.hasAttribute('data-intro-preview')) return;")
sfx = sfx.replace("      if (t.hasAttribute('data-ga-subject')) { play('select'); return; }",
"      if (t.hasAttribute('data-ga-subject')) { play('select'); return; }\n      if (t.hasAttribute('data-bookmark') || /bookmark|save-fav/i.test((t.id || '') + ' ' + (t.className || ''))) { play('bookmark'); return; }\n      if (/delete|remove/i.test((t.id || '') + ' ' + (t.className || ''))) { play('remove'); return; }\n      if (/save|submit|apply/i.test((t.id || '') + ' ' + (t.className || ''))) { play('save'); return; }\n      if (/reset|clear/i.test((t.id || '') + ' ' + (t.className || ''))) { play('reset'); return; }\n      if (/filter|sort/i.test((t.id || '') + ' ' + (t.className || ''))) { play('filter'); return; }\n      if (/focus|timer/i.test((t.id || '') + ' ' + (t.className || ''))) { play('focus'); return; }")
# sync music switch, and expand settings UI.
sfx = sfx.replace("    var v = document.querySelector('[data-sfx-vol]'); if (v && document.activeElement !== v) v.value = Math.round(st.vol * 100);\n    var vt = document.getElementById('sfxVolTxt'); if (vt) vt.textContent = Math.round(st.vol * 100) + '%';",
"    var v = document.querySelector('[data-sfx-vol]'); if (v && document.activeElement !== v) v.value = Math.round(st.vol * 100);\n    var vt = document.getElementById('sfxVolTxt'); if (vt) vt.textContent = Math.round(st.vol * 100) + '%';\n    var im = document.querySelector('[data-intro-music]'); if (im) im.setAttribute('aria-checked', String(introPref.on));\n    syncIntroPreviewStatus();")
old_settings = """  function settingsHtml() {
    var prev = [['tap', 'Button click'], ['nav', 'Navigation'], ['correct', 'Correct'], ['wrong', 'Wrong'], ['gameStart', 'Game start'], ['streak', 'Streak'], ['coin', 'XP'], ['badge', 'Badge'], ['levelup', 'Level up'], ['complete', 'Complete'], ['perfect', 'Perfect'], ['unlock', 'Unlock'], ['hint', 'Hint'], ['mystery', 'Mystery'], ['countdown', 'Countdown']].map(function (p) { return '<button type=\"button\" class=\"sfx-prev-btn\" data-sfx-prev=\"' + p[0] + '\">' + p[1] + '</button>'; }).join('');
    return '<section class=\"px-pref-section sfx-pref\"><h3>Sound &amp; feedback</h3>' +
      '<div class=\"px-switch\"><div><b>Sound effects</b><small>Distinct game-start, answer, streak, achievement, hint and completion sounds</small></div><button type=\"button\" class=\"px-toggle\" role=\"switch\" data-sfx-tog=\"on\" aria-checked=\"' + st.on + '\" aria-label=\"Sound effects\"></button></div>' +
      '<div class=\"px-switch\"><div><b>Vibration</b><small>Short haptic feedback on phones that support it</small></div><button type=\"button\" class=\"px-toggle\" role=\"switch\" data-sfx-tog=\"haptics\" aria-checked=\"' + st.haptics + '\" aria-label=\"Vibration\"></button></div>' +
      '<div class=\"px-switch sfx-vol\"><div><b>Volume</b><small id=\"sfxVolTxt\">' + Math.round(st.vol * 100) + '%</small></div><input type=\"range\" min=\"0\" max=\"100\" step=\"5\" value=\"' + Math.round(st.vol * 100) + '\" data-sfx-vol aria-label=\"Sound volume\"></div>' +
      '<div class=\"sfx-prev-row\"><span>Preview</span><div>' + prev + '</div></div></section>';
  }
"""
new_settings = """  function settingsHtml() {
    var prev = [['tap', 'Button click'], ['soft', 'Soft tap'], ['nav', 'Navigation'], ['select', 'Selection'], ['open', 'Open'], ['close', 'Close'], ['correct', 'Correct'], ['wrong', 'Wrong'], ['gameStart', 'Game start'], ['streak', 'Streak'], ['coin', 'XP'], ['badge', 'Badge'], ['levelup', 'Level up'], ['complete', 'Complete'], ['perfect', 'Perfect'], ['unlock', 'Unlock'], ['hint', 'Hint'], ['mystery', 'Mystery'], ['countdown', 'Countdown'], ['save', 'Save'], ['remove', 'Remove'], ['bookmark', 'Bookmark'], ['focus', 'Focus'], ['filter', 'Filter'], ['reminder', 'Reminder'], ['reset', 'Reset']].map(function (p) { return '<button type=\"button\" class=\"sfx-prev-btn\" data-sfx-prev=\"' + p[0] + '\">' + p[1] + '</button>'; }).join('');
    return '<section class=\"px-pref-section sfx-pref\"><h3>Sound &amp; feedback</h3>' +
      '<div class=\"px-switch\"><div><b>Sound effects</b><small>Distinct, musical feedback for buttons, navigation, answers and achievements</small></div><button type=\"button\" class=\"px-toggle\" role=\"switch\" data-sfx-tog=\"on\" aria-checked=\"' + st.on + '\" aria-label=\"Sound effects\"></button></div>' +
      '<div class=\"px-switch\"><div><b>Vibration</b><small>Short haptic feedback on phones that support it</small></div><button type=\"button\" class=\"px-toggle\" role=\"switch\" data-sfx-tog=\"haptics\" aria-checked=\"' + st.haptics + '\" aria-label=\"Vibration\"></button></div>' +
      '<div class=\"px-switch sfx-vol\"><div class=\"sfx-vol-copy\"><b>Volume</b><small id=\"sfxVolTxt\">' + Math.round(st.vol * 100) + '%</small></div><input type=\"range\" min=\"0\" max=\"100\" step=\"5\" value=\"' + Math.round(st.vol * 100) + '\" data-sfx-vol aria-label=\"Sound effects volume\"></div>' +
      '<div class=\"px-switch sfx-intro-switch\"><div><b>Intro music</b><small>Soft cinematic music during the opening animation</small></div><button type=\"button\" class=\"px-toggle\" role=\"switch\" data-intro-music aria-checked=\"' + introPref.on + '\" aria-label=\"Intro music\"></button></div>' +
      '<div class=\"sfx-intro-preview\"><button type=\"button\" class=\"sfx-prev-btn\" data-intro-preview>Preview intro music</button><small id=\"introMusicStatus\" aria-live=\"polite\">' + (introPref.on ? 'Enabled for the next intro' : 'Disabled') + '</small></div>' +
      '<div class=\"sfx-prev-row\"><span>Sound library</span><div>' + prev + '</div></div></section>';
  }
"""
if old_settings not in sfx:
    raise SystemExit('Could not locate original settingsHtml function')
sfx = sfx.replace(old_settings, new_settings)
# Handle new controls before existing SFX toggles.
sfx = sfx.replace("  function onUiClick(e) {\n    var tg = e.target.closest && e.target.closest('[data-sfx-tog]');",
"  function onUiClick(e) {\n    var introTog = e.target.closest && e.target.closest('[data-intro-music]');\n    if (introTog) {\n      introPref.on = !introPref.on; saveIntroPref(); syncUi();\n      if (introPref.on) playIntroPreview(); else stopIntroPreview();\n      return;\n    }\n    var introPreview = e.target.closest && e.target.closest('[data-intro-preview]');\n    if (introPreview) { playIntroPreview(); return; }\n    var tg = e.target.closest && e.target.closest('[data-sfx-tog]');")
# When the effects toggle switches on/off, use the new louder on/off sound after state update.
# Existing logic already does this via setEnabled.
# Avoid stale status when switching tabs / hiding page.
sfx = sfx.replace("    window.addEventListener('storage', function (e) { if (e.key === KEY) { try { var s = JSON.parse(e.newValue || '{}'); if (typeof s.on === 'boolean') st.on = s.on; if (typeof s.haptics === 'boolean') st.haptics = s.haptics; if (isFinite(s.vol)) st.vol = +s.vol; syncUi(); } catch (x) { } } });",
"    window.addEventListener('storage', function (e) {\n      if (e.key === KEY) { try { var s = JSON.parse(e.newValue || '{}'); if (typeof s.on === 'boolean') st.on = s.on; if (typeof s.haptics === 'boolean') st.haptics = s.haptics; if (isFinite(s.vol)) st.vol = +s.vol; syncUi(); } catch (x) { } }\n      if (e.key === INTRO_KEY) { try { var p = JSON.parse(e.newValue || '{}'); if (typeof p.on === 'boolean') introPref.on = p.on; if (isFinite(p.vol)) introPref.vol = Math.max(0, Math.min(0.28, +p.vol)); if (!introPref.on) stopIntroPreview(); syncUi(); } catch (x) { } }\n    });\n    document.addEventListener('visibilitychange', function () { if (document.hidden) stopIntroPreview(); });")
sfx_path.write_text(sfx, encoding='utf-8')

# ---------- Settings mobile layout and new sound controls ----------
boost_path = ROOT / 'assets/css/boost.css'
css = boost_path.read_text(encoding='utf-8')
css += r'''

/* ============ v19: intro soundtrack in Settings + clean mobile sound controls ============ */
#app .px-settings-page .sfx-vol{
  display:grid!important;
  grid-template-columns:minmax(0,1fr) minmax(120px,220px)!important;
  align-items:center!important;
  gap:12px!important;
  min-width:0!important;
}
#app .px-settings-page .sfx-vol .sfx-vol-copy{
  display:flex!important;
  align-items:center!important;
  justify-content:space-between!important;
  gap:10px!important;
  min-width:0!important;
  padding:0!important;
}
#app .px-settings-page .sfx-vol .sfx-vol-copy b{
  display:block!important;
  flex:0 1 auto!important;
  min-width:0!important;
  white-space:nowrap!important;
  line-height:1.4!important;
}
#app .px-settings-page .sfx-vol .sfx-vol-copy small{
  display:block!important;
  flex:0 0 auto!important;
  white-space:nowrap!important;
  margin:0!important;
  line-height:1.4!important;
}
#app .px-settings-page .sfx-vol input[type="range"]{
  display:block!important;
  width:100%!important;
  min-width:0!important;
  max-width:none!important;
  margin:0!important;
  box-sizing:border-box!important;
  accent-color:var(--p,#38bdf8)!important;
}
#app .px-settings-page .sfx-intro-switch{margin-top:2px!important;}
#app .px-settings-page .sfx-intro-preview{
  display:flex!important;
  flex-wrap:wrap!important;
  align-items:center!important;
  justify-content:space-between!important;
  gap:9px 12px!important;
  min-width:0!important;
  padding:11px 13px!important;
  border:1px solid rgba(125,211,252,.14)!important;
  border-radius:13px!important;
  background:rgba(4,12,20,.52)!important;
}
#app .px-settings-page .sfx-intro-preview .sfx-prev-btn{min-height:36px!important;height:auto!important;padding:8px 13px!important;}
#app .px-settings-page .sfx-intro-preview small{display:block!important;min-width:0!important;color:#89a7bc!important;font-size:11px!important;line-height:1.4!important;overflow-wrap:anywhere!important;}
#app .px-settings-page .sfx-prev-row{align-items:flex-start!important;}
#app .px-settings-page .sfx-prev-row>div{flex:1 1 100%!important;min-width:0!important;}
#app .px-settings-page .sfx-prev-btn{min-height:32px!important;height:auto!important;padding:7px 11px!important;line-height:1.2!important;}
@media(max-width:560px){
  #app .px-settings-page .sfx-vol{grid-template-columns:minmax(0,1fr)!important;gap:8px!important;padding:12px 13px!important;}
  #app .px-settings-page .sfx-vol .sfx-vol-copy{width:100%!important;justify-content:space-between!important;gap:12px!important;}
  #app .px-settings-page .sfx-vol input[type="range"]{grid-column:1;width:100%!important;max-width:none!important;}
  #app .px-settings-page .sfx-intro-preview{align-items:flex-start!important;flex-direction:column!important;}
  #app .px-settings-page .sfx-intro-preview .sfx-prev-btn{width:100%!important;justify-content:center!important;}
  #app .px-settings-page .sfx-prev-row>div{gap:7px!important;}
}
@media(max-width:360px){
  #app .px-settings-page .sfx-vol .sfx-vol-copy b{font-size:12px!important;}
  #app .px-settings-page .sfx-vol .sfx-vol-copy small{font-size:11px!important;}
  #app .px-settings-page .sfx-prev-btn{font-size:11px!important;padding:7px 9px!important;}
}
'''
boost_path.write_text(css, encoding='utf-8')

# ---------- Cache-bust references ----------
index_path = ROOT / 'index.html'
html = index_path.read_text(encoding='utf-8')
html = html.replace('20261101-v18-settings-music', '20261101-v19-settings-audio')
html = html.replace('20261101-v18-sound-settings', '20261101-v19-settings-audio')
html = html.replace('20261101-v18-richer-sounds', '20261101-v19-richer-click-sounds')
index_path.write_text(html, encoding='utf-8')

sw_path = ROOT / 'sw.js'
sw = sw_path.read_text(encoding='utf-8')
sw = sw.replace("const VERSION = 'conceptlab-20261101-v17-sprint-false-visible';", "const VERSION = 'conceptlab-20261101-v19-settings-audio';")
sw = sw.replace("assets/css/intro.css?v=20261031-v15-audio-control", "assets/css/intro.css?v=20261101-v19-settings-audio")
sw = sw.replace("assets/js/intro.js?v=20261031-v15-audio-fix", "assets/js/intro.js?v=20261101-v19-settings-audio")
sw = sw.replace("assets/css/boost.css?v=20261101-v17-sprint-desktop-false-visible", "assets/css/boost.css?v=20261101-v19-settings-audio")
sw = sw.replace("assets/js/sfx.js?v=20261031-v16-soft-bell-audio", "assets/js/sfx.js?v=20261101-v19-richer-click-sounds")
sw_path.write_text(sw, encoding='utf-8')

# ensure any existing intro control styles are completely removed, in case CSS was stale
intro_css_path = ROOT / 'assets/css/intro.css'
intro_css = intro_css_path.read_text(encoding='utf-8')
intro_css = re.sub(r'\n/\* First-use audio unlock:.*?(?=\n\s*$)', '', intro_css, flags=re.S)
intro_css = intro_css.replace('.in-sound{', '.in-sound{display:none;')
intro_css_path.write_text(intro_css, encoding='utf-8')

# build dist now so published static folder matches source
print('Updated v19 source files.')
