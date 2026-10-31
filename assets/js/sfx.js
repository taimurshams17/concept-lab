/* ConceptLab sound effects (v13). Synthesised with the Web Audio API, so there are no audio files to download.
   Public API: SFX.play(name), SFX.enabled(), SFX.setEnabled(bool), SFX.settingsHtml()
   Load order: right after fx.js, before app.js, so the FX.toast / FX.confetti wrappers are in place first. */
window.SFX = (function () {
  'use strict';
  var KEY = 'cl_sfx_v1';
  var st = { on: true, vol: 0.68, haptics: true };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved && typeof saved === 'object') { if (typeof saved.on === 'boolean') st.on = saved.on; if (typeof saved.haptics === 'boolean') st.haptics = saved.haptics; if (isFinite(saved.vol)) st.vol = Math.max(0, Math.min(1, +saved.vol)); } } catch (e) { }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { } }

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


  var ctx = null, master = null, noiseBuf = null, lastPlay = {}, lastSpecial = 0, lastAnswer = 0, lastClick = 0;

  function ensure() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) {
      try {
        ctx = new AC();
        master = ctx.createGain(); master.gain.value = st.vol * 1.04;
        var comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -16; comp.ratio.value = 6; comp.attack.value = 0.003; comp.release.value = 0.2;
        master.connect(comp); comp.connect(ctx.destination);
      } catch (e) { ctx = null; return null; }
    }
    if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { } }
    return ctx;
  }

  function tone(f, t0, dur, type, peak, f2) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f, t0);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function noise(t0, dur, peak, f0, f1) {
    if (!noiseBuf) {
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    var s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(f0, t0); bp.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t0 + dur * 0.35);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(bp); bp.connect(g); g.connect(master);
    s.start(t0); s.stop(t0 + dur + 0.05);
  }

  /* Each recipe receives the audio clock time `t`. Kept short and soft so repeated use is never tiring. */
  var R = {
    tap: function (t) { /* fuller, brighter glass-bell click with a gentle rounded tail */ tone(659.25, t, 0.2, 'sine', 0.16, 587.33); tone(987.77, t + 0.022, 0.23, 'sine', 0.082, 880); tone(1318.51, t + 0.045, 0.27, 'sine', 0.046, 1174.66); tone(523.25, t + 0.018, 0.16, 'triangle', 0.025, 587.33); },
    soft: function (t) { tone(587.33, t, 0.17, 'sine', 0.075, 523.25); tone(880, t + 0.035, 0.2, 'sine', 0.038, 784); },
    nav: function (t) { tone(523.25, t, 0.18, 'sine', 0.11, 587.33); tone(783.99, t + 0.075, 0.24, 'sine', 0.07, 880); },
    open: function (t) { tone(380, t, 0.15, 'sine', 0.12, 720); noise(t, 0.12, 0.03, 700, 2600); },
    close: function (t) { tone(720, t, 0.14, 'sine', 0.1, 380); },
    on: function (t) { tone(587, t, 0.09, 'sine', 0.12); tone(880, t + 0.07, 0.13, 'sine', 0.12); },
    off: function (t) { tone(660, t, 0.09, 'sine', 0.1); tone(440, t + 0.07, 0.13, 'sine', 0.1); },
    tick: function (t, p) { tone(360 + 520 * (p == null ? 0.5 : p), t, 0.03, 'sine', 0.06); },
    correct: function (t) {
      tone(523.25, t, 0.16, 'triangle', 0.15); tone(659.25, t + 0.075, 0.16, 'triangle', 0.15); tone(783.99, t + 0.15, 0.3, 'triangle', 0.16);
      tone(1567.98, t + 0.15, 0.22, 'sine', 0.03);
    },
    wrong: function (t) { tone(230, t, 0.22, 'triangle', 0.17, 150); tone(172, t + 0.09, 0.26, 'sawtooth', 0.045, 110); },
    coin: function (t) { tone(988, t, 0.07, 'square', 0.045); tone(1319, t + 0.07, 0.22, 'square', 0.045); },
    notify: function (t) { tone(880, t, 0.12, 'sine', 0.1); tone(1175, t + 0.1, 0.2, 'sine', 0.1); },
    badge: function (t) { tone(1046.5, t, 0.55, 'sine', 0.13); tone(1568, t, 0.42, 'sine', 0.055); tone(2093, t + 0.02, 0.3, 'sine', 0.03); tone(784, t + 0.12, 0.5, 'sine', 0.07); },
    levelup: function (t) {
      var n = [523.25, 587.33, 659.25, 783.99, 880, 1046.5]; n.forEach(function (f, i) { tone(f, t + i * 0.07, 0.2, 'triangle', 0.13); });
      tone(1318.5, t + 0.45, 0.5, 'sine', 0.08); noise(t + 0.4, 0.4, 0.025, 3000, 7000);
    },
    win: function (t) {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { tone(f, t + i * 0.09, 0.2, 'triangle', 0.14); });
      [1046.5, 1318.5, 1568].forEach(function (f) { tone(f, t + 0.38, 0.55, 'sine', 0.07); });
    },
    error: function (t) { tone(300, t, 0.14, 'square', 0.05, 220); tone(300, t + 0.17, 0.16, 'square', 0.05, 200); },
    select: function (t) { tone(587.33, t, 0.15, 'sine', 0.09, 659.25); tone(880, t + 0.045, 0.2, 'sine', 0.052, 987.77); },
    gameStart: function (t) { tone(392, t, 0.11, 'triangle', 0.09); tone(523.25, t + 0.085, 0.11, 'triangle', 0.095); tone(659.25, t + 0.17, 0.12, 'triangle', 0.10); tone(783.99, t + 0.255, 0.22, 'sine', 0.095); noise(t + 0.24, 0.16, 0.012, 1800, 5200); },
    streak: function (t) { tone(698.46, t, 0.08, 'sine', 0.085); tone(880, t + 0.065, 0.09, 'sine', 0.09); tone(1174.66, t + 0.13, 0.16, 'triangle', 0.08); },
    perfect: function (t) { [659.25, 830.61, 987.77, 1318.51].forEach(function (f, i) { tone(f, t + i * 0.085, 0.24, 'triangle', 0.105); }); tone(1975.53, t + 0.32, 0.34, 'sine', 0.035); },
    complete: function (t) { tone(261.63, t, 0.34, 'sine', 0.075); tone(329.63, t + 0.015, 0.32, 'triangle', 0.07); tone(392, t + 0.03, 0.38, 'sine', 0.065); tone(523.25, t + 0.18, 0.4, 'triangle', 0.07); },
    unlock: function (t) { tone(523.25, t, 0.24, 'sine', 0.065); tone(1046.5, t + 0.04, 0.3, 'sine', 0.06); tone(1567.98, t + 0.11, 0.42, 'triangle', 0.05); noise(t + 0.08, 0.2, 0.012, 2400, 6800); },
    hint: function (t) { tone(392, t, 0.17, 'sine', 0.055, 587.33); tone(587.33, t + 0.12, 0.16, 'sine', 0.045, 783.99); },
    mystery: function (t) { tone(196, t, 0.3, 'sine', 0.075, 146.83); tone(587.33, t + 0.12, 0.2, 'triangle', 0.045); tone(880, t + 0.31, 0.32, 'sine', 0.04); },
    countdown: function (t) { tone(440, t, 0.07, 'square', 0.035); tone(330, t + 0.11, 0.09, 'square', 0.045); },
    save: function (t) { tone(523.25, t, 0.12, 'sine', 0.09); tone(659.25, t + 0.07, 0.15, 'sine', 0.11); tone(1046.5, t + 0.13, 0.22, 'sine', 0.055); },
    remove: function (t) { tone(659.25, t, 0.11, 'triangle', 0.065, 523.25); tone(440, t + 0.08, 0.16, 'sine', 0.055, 349.23); },
    bookmark: function (t) { tone(783.99, t, 0.16, 'sine', 0.085); tone(1174.66, t + 0.08, 0.24, 'sine', 0.065); tone(1567.98, t + 0.12, 0.3, 'triangle', 0.035); },
    focus: function (t) { tone(293.66, t, 0.22, 'sine', 0.075, 349.23); tone(587.33, t + 0.13, 0.3, 'sine', 0.045, 659.25); },
    filter: function (t) { tone(880, t, 0.095, 'sine', 0.07, 783.99); tone(1174.66, t + 0.09, 0.13, 'sine', 0.065, 1046.5); },
    reminder: function (t) { tone(659.25, t, 0.25, 'sine', 0.075); tone(880, t + 0.28, 0.32, 'sine', 0.055); },
    reset: function (t) { tone(783.99, t, 0.12, 'sine', 0.07, 659.25); tone(587.33, t + 0.10, 0.14, 'sine', 0.065, 523.25); tone(392, t + 0.20, 0.18, 'triangle', 0.045); }
  };
  var HAPTIC = { correct: 14, wrong: [18, 40, 18], win: [14, 30, 14, 30, 40], perfect: [14, 25, 14, 25, 30], gameStart: [10, 25, 10], levelup: [14, 30, 14, 30, 40], badge: [20, 40, 30], unlock: [10, 25, 20], on: 8, off: 8, error: [20, 30, 20], save: 10, bookmark: 8, focus: 8, reset: [12, 20, 12] };
  var MIN_GAP = { tap: 50, soft: 55, nav: 90, tick: 55, notify: 250, coin: 200, select: 90, gameStart: 350, streak: 180, perfect: 700, complete: 650, unlock: 450, mystery: 600, countdown: 100, save: 250, remove: 250, bookmark: 220, focus: 220, filter: 100, reminder: 450, reset: 350 };

  function play(name, arg) {
    if (!R[name]) return;
    var now = Date.now();
    if (now - (lastPlay[name] || 0) < (MIN_GAP[name] || 70)) return;
    lastPlay[name] = now;
    if (name !== 'tap' && name !== 'soft' && name !== 'nav' && name !== 'tick' && name !== 'on' && name !== 'off' && name !== 'open' && name !== 'close') lastSpecial = now;
    if (st.on) {
      var c = ensure();
      if (c) { try { R[name](c.currentTime + 0.005, arg); } catch (e) { } }
    }
    if (st.haptics && HAPTIC[name] && navigator.vibrate) { try { navigator.vibrate(HAPTIC[name]); } catch (e) { } }
  }

  function setEnabled(v) {
    st.on = !!v; save(); syncUi();
    if (st.on) { ensure(); setTimeout(function () { play('on'); }, 30); }
  }
  function setVolume(v) { st.vol = Math.max(0, Math.min(1, v)); save(); if (master) master.gain.value = st.vol * 1.04; }
  function setHaptics(v) { st.haptics = !!v; save(); syncUi(); }

  /* ---------- wrap FX helpers (toast / confetti) so XP, badges, level-ups and results get their own sounds ---------- */
  function wrapFx() {
    var FX = window.FX; if (!FX || FX.__sfx) return; FX.__sfx = true;
    var toast = FX.toast, conf = FX.confetti;
    if (typeof toast === 'function') FX.toast = function (html, kind) {
      try { play(kind === 'lv' ? 'levelup' : kind === 'bd' ? 'unlock' : kind === 'xp' ? 'coin' : (kind === 'bad' || kind === 'err' || kind === 'error') ? 'error' : 'notify'); } catch (e) { }
      return toast.apply(this, arguments);
    };
    if (typeof conf === 'function') FX.confetti = function () {
      try { if (Date.now() - lastSpecial > 700) play('win'); } catch (e) { }
      return conf.apply(this, arguments);
    };
  }

  /* ---------- answer feedback: watch class changes inside the app for correct / wrong states ---------- */
  var RIGHT = ['correct', 'is-correct', 'good', 'is-good', 'ok', 'okb', 'hintok'];
  var WRONG = ['incorrect', 'is-wrong', 'wrong', 'bad', 'is-bad', 'no', 'nob'];
  var NODE_RIGHT = ['correct', 'is-correct', 'good', 'is-good'];
  var NODE_WRONG = ['incorrect', 'is-wrong', 'bad', 'is-bad'];
  function hasAny(list, arr) { for (var i = 0; i < arr.length; i++) if (list.indexOf(arr[i]) > -1) return true; return false; }
  var lastComboVal = 1;
  function watchAnswers() {
    var app = document.getElementById('app'); if (!app || !window.MutationObserver) return;
    var mo = new MutationObserver(function (recs) {
      if (Date.now() - lastClick > 1600) return; /* answers always follow a tap; ignores passive animation state changes */
      var right = false, wrong = false, streak = false;
      for (var i = 0; i < recs.length; i++) {
        var r = recs[i];
        if (r.type === 'attributes') {
          var oldC = (r.oldValue || '').split(/\s+/), newC = (r.target.className && r.target.className.baseVal != null ? r.target.className.baseVal : r.target.className || '').split(/\s+/);
          var added = newC.filter(function (c) { return c && oldC.indexOf(c) < 0; });
          if (!added.length) continue;
          if (hasAny(added, WRONG)) wrong = true; else if (hasAny(added, RIGHT)) right = true;
        } else if (r.type === 'childList') {
          if (r.target && r.target.id === 'gm') lastComboVal = 1;
          if (r.target && r.target.id === 'cb') { var cm = Number((String(r.target.textContent || '').match(/x(\d+)/i) || [])[1] || 1); if (cm >= 2 && cm > lastComboVal) streak = true; lastComboVal = cm; }
          for (var j = 0; j < r.addedNodes.length; j++) {
            var n = r.addedNodes[j]; if (n.nodeType !== 1) continue;
            var cl = (n.className && n.className.baseVal != null ? n.className.baseVal : n.className || '').split(/\s+/);
            if (hasAny(cl, NODE_WRONG)) wrong = true; else if (hasAny(cl, NODE_RIGHT)) right = true;
          }
        }
      }
      if (wrong) { lastAnswer = Date.now(); play('wrong'); }
      else if (right) { lastAnswer = Date.now(); play(streak ? 'streak' : 'correct'); }
    });
    mo.observe(app, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
  }

  /* ---------- click / tap feedback ---------- */
  var CLICKABLE = 'a[href],button,summary,[role="button"],[role="switch"],[role="tab"],.gdeck-card,.btn';
  function onClick(e) {
    lastClick = Date.now();
    var t = e.target && e.target.closest ? e.target.closest(CLICKABLE) : null;
    if (!t || t.disabled || t.hasAttribute('data-nosfx') || t.hasAttribute('data-sfx-tog') || t.hasAttribute('data-sfx-prev') || t.hasAttribute('data-intro-music') || t.hasAttribute('data-intro-preview')) return;
    /* Defer by one tick so answer / toast sounds (triggered inside the real handler) can claim this tap first. */
    setTimeout(function () {
      if (Date.now() - lastSpecial < 220 || Date.now() - lastAnswer < 220) return;
      if (t.id === 'burger') { play(t.getAttribute('aria-expanded') === 'true' ? 'open' : 'close'); return; }
      var customSound = t.getAttribute('data-sfx');
      if (customSound && R[customSound]) { play(customSound); return; }
      if (t.hasAttribute('data-ga-subject')) { play('select'); return; }
      if (t.hasAttribute('data-bookmark') || /bookmark|save-fav/i.test((t.id || '') + ' ' + (t.className || ''))) { play('bookmark'); return; }
      if (/delete|remove/i.test((t.id || '') + ' ' + (t.className || ''))) { play('remove'); return; }
      if (/save|submit|apply/i.test((t.id || '') + ' ' + (t.className || ''))) { play('save'); return; }
      if (/reset|clear/i.test((t.id || '') + ' ' + (t.className || ''))) { play('reset'); return; }
      if (/filter|sort/i.test((t.id || '') + ' ' + (t.className || ''))) { play('filter'); return; }
      if (/focus|timer/i.test((t.id || '') + ' ' + (t.className || ''))) { play('focus'); return; }
      if (/remind|due-date|notification/i.test((t.id || '') + ' ' + (t.className || ''))) { play('reminder'); return; }
      if (/add-task|create-task/i.test((t.id || '') + ' ' + (t.className || ''))) { play('save'); return; }
      if (t.hasAttribute('data-ga-daily')) { play('mystery'); return; }
      if (t.hasAttribute('data-again')) { play('gameStart'); return; }
      if (t.hasAttribute('data-hint') || /hint|help/i.test(t.id || '')) { play('hint'); return; }
      if (t.getAttribute('role') === 'switch' || /\bpx-toggle\b/.test(t.className || '')) { play(t.getAttribute('aria-checked') === 'true' ? 'on' : 'off'); return; }
      if (t.tagName === 'SUMMARY') { play('soft'); return; }
      var href = t.getAttribute && t.getAttribute('href');
      if (href && /^#\//.test(href)) { play('nav'); return; }
      play('tap');
    }, 0);
  }
  var lastTickVal = null;
  function onInput(e) {
    var el = e.target;
    if (el && el.matches && el.matches('input[type="range"]') && !el.hasAttribute('data-sfx-vol')) {
      var mn = +el.min || 0, mx = +el.max || 100, p = mx > mn ? (+el.value - mn) / (mx - mn) : 0.5;
      play('tick', p);
    }
  }

  /* ---------- UI: header toggle + settings section ---------- */
  function syncUi() {
    var q = document.querySelectorAll('[data-sfx-tog]');
    Array.prototype.forEach.call(q, function (x) { var k = x.getAttribute('data-sfx-tog'); x.setAttribute('aria-checked', String(k === 'on' ? st.on : st.haptics)); });
    var v = document.querySelector('[data-sfx-vol]'); if (v && document.activeElement !== v) v.value = Math.round(st.vol * 100);
    var vt = document.getElementById('sfxVolTxt'); if (vt) vt.textContent = Math.round(st.vol * 100) + '%';
    var im = document.querySelector('[data-intro-music]'); if (im) im.setAttribute('aria-checked', String(introPref.on));
    syncIntroPreviewStatus();
  }
  function mountHeaderButton() {
    var hx = document.querySelector('header .hx'); if (!hx || document.getElementById('headerSettingsLink')) return;
    var link = document.createElement('a'); link.id = 'headerSettingsLink'; link.className = 'header-settings-link';
    link.href = '#/settings'; link.title = 'Settings'; link.setAttribute('aria-label', 'Settings');
    link.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M19.14 12.94c.04-.31.06-.62.06-.94s-.02-.63-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7.2 7.2 0 0 0-1.63-.94l-.36-2.53a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.53c-.59.24-1.13.56-1.63.94l-2.39-.96a.5.5 0 0 0-.61.22L2.62 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.05.31-.07.63-.07.94s.02.63.07.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .61.22l2.39-.96c.5.38 1.04.7 1.63.94l.36 2.53a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.53c.59-.24 1.13-.56 1.63-.94l2.39.96a.5.5 0 0 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.02-1.58ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/></svg>';
    var burger = document.getElementById('burger'); hx.insertBefore(link, burger || null);
  }
  function settingsHtml() {
    var prev = [['tap', 'Button click'], ['soft', 'Soft tap'], ['nav', 'Navigation'], ['select', 'Selection'], ['open', 'Open'], ['close', 'Close'], ['correct', 'Correct'], ['wrong', 'Wrong'], ['gameStart', 'Game start'], ['streak', 'Streak'], ['coin', 'XP'], ['badge', 'Badge'], ['levelup', 'Level up'], ['complete', 'Complete'], ['perfect', 'Perfect'], ['unlock', 'Unlock'], ['hint', 'Hint'], ['mystery', 'Mystery'], ['countdown', 'Countdown'], ['save', 'Save'], ['remove', 'Remove'], ['bookmark', 'Bookmark'], ['focus', 'Focus'], ['filter', 'Filter'], ['reminder', 'Reminder'], ['reset', 'Reset']].map(function (p) { return '<button type="button" class="sfx-prev-btn" data-sfx-prev="' + p[0] + '">' + p[1] + '</button>'; }).join('');
    return '<section class="px-pref-section sfx-pref"><h3>Sound &amp; feedback</h3>' +
      '<div class="px-switch"><div><b>Sound effects</b><small>Distinct, musical feedback for buttons, navigation, answers and achievements</small></div><button type="button" class="px-toggle" role="switch" data-sfx-tog="on" aria-checked="' + st.on + '" aria-label="Sound effects"></button></div>' +
      '<div class="px-switch"><div><b>Vibration</b><small>Short haptic feedback on phones that support it</small></div><button type="button" class="px-toggle" role="switch" data-sfx-tog="haptics" aria-checked="' + st.haptics + '" aria-label="Vibration"></button></div>' +
      '<div class="px-switch sfx-vol"><div class="sfx-vol-copy"><b>Volume</b><small id="sfxVolTxt">' + Math.round(st.vol * 100) + '%</small></div><input type="range" min="0" max="100" step="5" value="' + Math.round(st.vol * 100) + '" data-sfx-vol aria-label="Sound effects volume"></div>' +
      '<div class="px-switch sfx-intro-switch"><div><b>Intro music</b><small>Soft cinematic music during the opening animation</small></div><button type="button" class="px-toggle" role="switch" data-intro-music aria-checked="' + introPref.on + '" aria-label="Intro music"></button></div>' +
      '<div class="sfx-intro-preview"><button type="button" class="sfx-prev-btn" data-intro-preview>Preview intro music</button><small id="introMusicStatus" aria-live="polite">' + (introPref.on ? 'Enabled for the next intro' : 'Disabled') + '</small></div>' +
      '<div class="sfx-prev-row"><span>Sound library</span><div>' + prev + '</div></div></section>';
  }

  function onUiClick(e) {
    var introTog = e.target.closest && e.target.closest('[data-intro-music]');
    if (introTog) {
      introPref.on = !introPref.on; saveIntroPref(); syncUi();
      if (introPref.on) { if (introPref.vol <= 0) introPref.vol = 0.28; saveIntroPref(); playIntroPreview(); } else stopIntroPreview();
      return;
    }
    var introPreview = e.target.closest && e.target.closest('[data-intro-preview]');
    if (introPreview) { playIntroPreview(); return; }
    var tg = e.target.closest && e.target.closest('[data-sfx-tog]');
    if (tg) { var k = tg.getAttribute('data-sfx-tog'); if (k === 'on') setEnabled(!st.on); else { setHaptics(!st.haptics); if (st.haptics && navigator.vibrate) { try { navigator.vibrate(12); } catch (x) { } } } return; }
    var pv = e.target.closest && e.target.closest('[data-sfx-prev]');
    if (pv) { var was = st.on; if (!was) { st.on = true; } lastPlay = {}; play(pv.getAttribute('data-sfx-prev')); st.on = was; }
  }
  function onUiInput(e) {
    var v = e.target && e.target.closest && e.target.closest('[data-sfx-vol]');
    if (!v) return;
    setVolume(+v.value / 100); var vt = document.getElementById('sfxVolTxt'); if (vt) vt.textContent = Math.round(st.vol * 100) + '%';
  }
  function onUiChange(e) { var v = e.target && e.target.closest && e.target.closest('[data-sfx-vol]'); if (v && st.on) { lastPlay = {}; play('tap'); } }

  /* ---------- tactile press ripple on .btn buttons (skipped in Calm mode / reduced motion) ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function onPress(e) {
    if (reduceMotion || document.body.classList.contains('px-calm')) return;
    var t = e.target && e.target.closest ? e.target.closest('.btn') : null;
    if (!t || t.disabled || t.getAttribute('aria-disabled') === 'true') return;
    var r = t.getBoundingClientRect(), d = Math.max(r.width, r.height) * 1.6;
    var s = document.createElement('span'); s.className = 'cl-rip'; s.setAttribute('aria-hidden', 'true');
    s.style.cssText = 'width:' + d + 'px;height:' + d + 'px;left:' + (e.clientX - r.left - d / 2) + 'px;top:' + (e.clientY - r.top - d / 2) + 'px';
    t.classList.add('cl-rip-host'); t.appendChild(s);
    setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 620);
  }
  function unlock() { ensure(); }
  function init() {
    mountHeaderButton(); watchAnswers(); syncUi();
    document.addEventListener('click', onClick, true);
    document.addEventListener('pointerdown', onPress, { passive: true });
    document.addEventListener('click', onUiClick);
    document.addEventListener('input', onInput, true);
    document.addEventListener('input', onUiInput);
    document.addEventListener('change', onUiChange);
    ['pointerdown', 'touchstart', 'keydown'].forEach(function (ev) { document.addEventListener(ev, unlock, { once: true, passive: true, capture: true }); });
    window.addEventListener('storage', function (e) {
      if (e.key === KEY) { try { var s = JSON.parse(e.newValue || '{}'); if (typeof s.on === 'boolean') st.on = s.on; if (typeof s.haptics === 'boolean') st.haptics = s.haptics; if (isFinite(s.vol)) st.vol = +s.vol; syncUi(); } catch (x) { } }
      if (e.key === INTRO_KEY) { try { var p = JSON.parse(e.newValue || '{}'); if (typeof p.on === 'boolean') introPref.on = p.on; if (isFinite(p.vol)) introPref.vol = Math.max(0, Math.min(0.28, +p.vol)); if (!introPref.on) stopIntroPreview(); syncUi(); } catch (x) { } }
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stopIntroPreview(); });
    window.addEventListener('hashchange', stopIntroPreview);
  }
  wrapFx();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  return { play: play, enabled: function () { return st.on; }, setEnabled: setEnabled, settingsHtml: settingsHtml, sync: syncUi };
})();
