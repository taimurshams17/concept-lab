/* ConceptLab Study Room v1 — per-subject study timer, session log, goals, stats.
   Route: #/hub/study-room.  Data: localStorage "clroom_v1" (client only).
   Timer is timestamp-based, so it survives reloads, tab sleep and navigation. */
(function () {
  'use strict';
  var HP = window.CL_HUBPLUS; if (!HP) return;
  var u = HP.u, E = u.E, bd = u.bd, K = 'clroom_v1';

  var COLORS = ['#38bdf8', '#a78bfa', '#34d399', '#fbbf24', '#fb7185', '#f472b6', '#22d3ee', '#fb923c', '#a3e635', '#818cf8'];
  var DEFAULT_SUBJECTS = [
    ['পদার্থবিজ্ঞান', '⚛️'], ['রসায়ন', '🧪'], ['উচ্চতর গণিত', '📐'], ['জীববিজ্ঞান', '🧬'],
    ['ইংরেজি', '🔤'], ['বাংলা', '📖'], ['ICT', '💻']
  ];
  var QUOTES = ['ছোট ছোট সেশনই বড় ফলাফল আনে।', 'আজ ২৫ মিনিট—কাল আরও ভালো।', 'ফোন দূরে রাখুন, মনোযোগ কাছে আনুন।', 'নিয়মিত থাকাটাই সবচেয়ে বড় শক্তি।', 'একটি টপিক শেষ করে তবেই পরেরটি ধরুন।', 'বিরতিও পড়ার অংশ—চোখ ও মাথাকে বিশ্রাম দিন।'];
  var RANGES = [['today', 'আজ'], ['7', '৭ দিন'], ['30', '৩০ দিন'], ['all', 'সব']];
  var ICONS = ['📚', '⚛️', '🧪', '📐', '🧬', '🔤', '📖', '💻', '🌍', '🧠', '✍️', '🎨', '🧮', '⚗️', '🔭', '🕌'];

  /* ---------- state ---------- */
  function fresh() {
    var subs = DEFAULT_SUBJECTS.map(function (s, i) { return { id: 's' + i, name: s[0], icon: s[1], color: COLORS[i % COLORS.length], goal: 0 }; });
    return { v: 1, subjects: subs, sessions: [], active: null, pending: null, sel: 's0', mode: 'stopwatch', cd: 45,
      settings: { focus: 25, brk: 5, long: 15, every: 4, daily: 180, sound: true, wake: false, auto: true } };
  }
  var D = null;
  function load() {
    D = u.load(K, null);
    if (!D || !Array.isArray(D.subjects)) D = fresh();
    var f = fresh();
    D.settings = Object.assign({}, f.settings, D.settings || {});
    D.sessions = Array.isArray(D.sessions) ? D.sessions : [];
    if (!D.subjects.length) D.subjects = f.subjects;
    if (!subj(D.sel)) D.sel = D.subjects[0].id;
    D.mode = D.mode || 'stopwatch'; D.cd = D.cd || 45;
  }
  function save() { u.save(K, D); }
  function subj(id) { for (var i = 0; i < D.subjects.length; i++) if (D.subjects[i].id === id) return D.subjects[i]; return null; }
  load();

  var tab = 'timer', range = '7', histSub = 'all', focusMode = false, editId = null, showAdd = false, wakeLock = null, baseTitle = '';

  /* ---------- timer engine ---------- */
  function now() { return Date.now(); }
  function elapsedMs(a) { a = a || D.active; return a ? a.acc + (a.running ? now() - a.t0 : 0) : 0; }
  function targetMs(a) { return a && a.target ? a.target * 1000 : 0; }
  function isFocusPhase(a) { return !a || a.phase !== 'break'; }

  function startTimer() {
    if (D.active) return;
    if (D.pending) { u.toast('আগে আগের সেশনটি সেভ বা বাতিল করুন'); return; }
    var s = D.settings, a = { sid: D.sel, mode: D.mode, acc: 0, t0: now(), running: true, startedAt: now(), phase: 'focus', cycle: 1, target: 0, dist: 0 };
    if (D.mode === 'countdown') a.target = Math.max(1, D.cd) * 60;
    if (D.mode === 'pomodoro') a.target = s.focus * 60;
    D.active = a; save(); keepAwake(true); tickAll(); HP.paint();
  }
  function pauseTimer() { var a = D.active; if (!a || !a.running) return; a.acc += now() - a.t0; a.running = false; save(); tickAll(); HP.paint(); }
  function resumeTimer() { var a = D.active; if (!a || a.running) return; a.t0 = now(); a.running = true; save(); tickAll(); HP.paint(); }
  function makeDraft(a, endTs) {
    var secs = Math.round(elapsedMs(a) / 1000);
    return { id: u.uid(), sid: a.sid, start: a.startedAt, end: endTs || now(), secs: secs, mode: a.mode, dist: a.dist || 0, note: '', focus: 0 };
  }
  /* finish the current focus segment → pending review (or discard when too short) */
  function finishTimer(auto) {
    var a = D.active; if (!a) return;
    var wasFocus = isFocusPhase(a), draft = makeDraft(a);
    D.active = null; keepAwake(false); restoreTitle();
    if (wasFocus && draft.secs >= 10) { D.pending = draft; } else if (wasFocus) { u.toast('১০ সেকেন্ডের কম—সেশন সেভ হয়নি'); }
    save(); tickAll(); HP.paint(); updateChip();
    if (auto && D.settings.sound) u.beep();
  }
  function discardTimer() { if (!D.active) return; if (!confirm('এই সেশনটি বাতিল করবেন? সময় সেভ হবে না।')) return; D.active = null; keepAwake(false); restoreTitle(); save(); HP.paint(); updateChip(); }
  function switchSubject(sid) {
    var a = D.active; D.sel = sid;
    if (a && a.sid !== sid && isFocusPhase(a)) {
      var draft = makeDraft(a);
      if (draft.secs >= 10) { D.sessions.push(draft); u.toast(subj(a.sid).name + ' — ' + u.dur(draft.secs) + ' সেভ হয়েছে'); }
      a.sid = sid; a.acc = 0; a.t0 = now(); a.startedAt = now(); a.dist = 0;
      if (a.mode !== 'stopwatch') { a.cycle = a.cycle; }
    } else if (a && a.sid !== sid) { a.sid = sid; }
    save(); HP.paint(); updateChip();
  }
  function savePending(note, focus) {
    var p = D.pending; if (!p) return; p.note = String(note || '').slice(0, 300); p.focus = +focus || 0;
    D.sessions.push(p); D.pending = null; save(); HP.paint(); updateChip(); u.toast('সেশন সেভ হয়েছে ✓');
  }
  function dropPending() { if (!D.pending || !confirm('এই সেশনের সময় মুছে ফেলবেন?')) return; D.pending = null; save(); HP.paint(); }

  /* completion for countdown / pomodoro; called by ticker */
  function checkComplete() {
    var a = D.active; if (!a || !a.running || !a.target) return;
    if (elapsedMs(a) < targetMs(a)) return;
    var s = D.settings;
    if (a.mode === 'countdown') { a.acc = a.target * 1000; a.running = false; finishTimer(true); u.toast('কাউন্টডাউন শেষ! চমৎকার 🎉'); return; }
    if (a.mode === 'pomodoro') {
      if (a.phase === 'focus') {
        var draft = makeDraft(a); draft.secs = a.target; draft.mode = 'pomodoro';
        D.sessions.push(draft);
        var long = a.cycle % s.every === 0;
        a.phase = 'break'; a.acc = 0; a.t0 = now(); a.target = (long ? s.long : s.brk) * 60; a.dist = 0;
        a.long = long; save(); if (s.sound) u.beep(); u.toast('ফোকাস সেশন শেষ ✓ — ' + (long ? 'লম্বা' : 'ছোট') + ' বিরতি শুরু'); HP.paint();
      } else {
        a.phase = 'focus'; a.cycle += 1; a.acc = 0; a.t0 = now(); a.startedAt = now(); a.target = s.focus * 60; a.dist = 0; a.long = false;
        if (!s.auto) { a.running = false; }
        save(); if (s.sound) u.beep([[660, 0, .2], [880, .25, .3]]); u.toast('বিরতি শেষ — আবার পড়ায় ফিরুন'); HP.paint();
      }
    }
  }
  function skipPhase() {
    var a = D.active; if (!a || a.mode !== 'pomodoro') return;
    if (a.phase === 'focus') { a.acc = a.target * 1000 - 1; a.t0 = now(); a.running = true; } else { a.acc = a.target * 1000 - 1; a.t0 = now(); a.running = true; }
    checkComplete();
  }

  /* ---------- screen wake lock ---------- */
  function keepAwake(on) {
    try {
      if (on && D.settings.wake && navigator.wakeLock && !wakeLock) navigator.wakeLock.request('screen').then(function (l) { wakeLock = l; l.addEventListener('release', function () { wakeLock = null; }); }).catch(function () { });
      if (!on && wakeLock) { wakeLock.release(); wakeLock = null; }
    } catch (e) { }
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { if (D.active && D.active.running) keepAwake(true); tickAll(); } });

  /* ---------- aggregation ---------- */
  function startOfDay(ts) { var d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function sessionsIn(r) {
    var t0 = startOfDay(now());
    var from = r === 'today' ? t0 : r === 'all' ? 0 : t0 - (+r - 1) * 86400000;
    return D.sessions.filter(function (s) { return s.start >= from; });
  }
  function bySubject(list) {
    var m = {}; list.forEach(function (s) { m[s.sid] = (m[s.sid] || 0) + s.secs; });
    return Object.keys(m).map(function (id) { return { id: id, secs: m[id] }; }).sort(function (a, b) { return b.secs - a.secs; });
  }
  function total(list) { return list.reduce(function (n, s) { return n + s.secs; }, 0); }
  function dayTotals() { var m = {}; D.sessions.forEach(function (s) { var k = u.dayKey(s.start); m[k] = (m[k] || 0) + s.secs; }); return m; }
  function streak() {
    var m = dayTotals(), d = new Date(), n = 0;
    if (!m[u.dayKey(d)]) d.setDate(d.getDate() - 1);
    while (m[u.dayKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function todaySecs() { var s = total(sessionsIn('today')); var a = D.active; if (a && isFocusPhase(a) && a.mode !== 'pomodoro' || (a && a.mode === 'pomodoro' && isFocusPhase(a))) s += Math.round(elapsedMs(a) / 1000); return s; }
  function subjName(id) { var s = subj(id); return s ? s.name : 'মুছে ফেলা সাবজেক্ট'; }
  function subjColor(id) { var s = subj(id); return s ? s.color : '#94a3b8'; }
  function subjIcon(id) { var s = subj(id); return s ? s.icon : '📁'; }

  /* ---------- floating mini timer chip (visible on every page while a timer is live) ---------- */
  function ensureChip() {
    var c = document.getElementById('srChip');
    if (!c) {
      c = document.createElement('a'); c.id = 'srChip'; c.className = 'sr-chip'; c.href = '#/hub/study-room'; c.hidden = true;
      c.innerHTML = '<span class="sr-chip-dot"></span><span class="sr-chip-txt"><b id="srChipT">00:00</b><small id="srChipS"></small></span>';
      document.body.appendChild(c);
    }
    return c;
  }
  function onRoomPage() { return /^#\/hub\/study-room/.test(location.hash); }
  function updateChip() {
    var c = ensureChip(), a = D.active;
    if (!a || onRoomPage()) { c.hidden = true; return; }
    c.hidden = false; c.classList.toggle('paused', !a.running);
    document.getElementById('srChipT').textContent = displayTime(a);
    document.getElementById('srChipS').textContent = (a.phase === 'break' ? 'বিরতি' : subjName(a.sid));
  }
  function displayTime(a) {
    if (!a) return '00:00';
    var e = elapsedMs(a);
    return u.hms(a.target ? Math.max(0, Math.ceil((targetMs(a) - e) / 1000)) : e / 1000);
  }

  /* ---------- global ticker ---------- */
  var ticker = null;
  function tickAll() {
    checkComplete();
    var a = D.active;
    updateChip();
    var t = document.getElementById('srTime');
    if (t) {
      t.textContent = displayTime(a);
      var ring = document.getElementById('srRingFg');
      if (ring) {
        var C = 2 * Math.PI * 108, frac;
        if (a && a.target) frac = Math.min(1, elapsedMs(a) / targetMs(a)); else if (a) frac = (elapsedMs(a) / 60000 % 60) / 60; else frac = 0;
        ring.style.strokeDashoffset = String(C * (1 - frac));
      }
      var ts = document.getElementById('srToday'); if (ts) ts.textContent = u.dur(todaySecs());
      var tg = document.getElementById('srGoalFill');
      if (tg) { var g = D.settings.daily * 60; tg.style.width = Math.min(100, g ? todaySecs() / g * 100 : 0).toFixed(1) + '%'; }
      var tt = document.getElementById('srGoalTxt'); if (tt) tt.textContent = goalText();
    }
    if (a && a.running) {
      if (!baseTitle) baseTitle = document.title;
      document.title = (isFocusPhase(a) ? '⏱ ' : '☕ ') + displayTime(a) + ' · ' + (a.phase === 'break' ? 'বিরতি' : subjName(a.sid));
    }
    if (!a || !a.running) { if (baseTitle && !a) restoreTitle(); }
  }
  function restoreTitle() { if (baseTitle) { document.title = baseTitle; baseTitle = ''; } }
  function startTicker() { if (!ticker) ticker = setInterval(tickAll, 500); }
  startTicker();
  window.addEventListener('hashchange', function () { setTimeout(function () { updateChip(); }, 50); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && focusMode) { focusMode = false; HP.paint(); } });
  if (D.active) setTimeout(function () { ensureChip(); updateChip(); }, 400);
  window.addEventListener('storage', function (e) { if (e.key === K) { load(); updateChip(); if (onRoomPage()) HP.paint(); } });

  function goalText() {
    var g = D.settings.daily, s = Math.round(todaySecs() / 60);
    if (!g) return 'দৈনিক লক্ষ্য সেট করা নেই';
    return s >= g ? 'আজকের লক্ষ্য পূরণ ✓ (' + u.dur(todaySecs()) + ')' : u.dur(todaySecs()) + ' / ' + u.dur(g * 60) + ' · আর ' + u.dur((g - s) * 60) + ' বাকি';
  }

  /* ---------- views ---------- */
  var MODES = [['stopwatch', 'স্টপওয়াচ', 'যতক্ষণ পড়েন ততক্ষণ গোনে'], ['countdown', 'কাউন্টডাউন', 'নির্দিষ্ট সময় ঠিক করে পড়ুন'], ['pomodoro', 'পোমোডোরো', 'ফোকাস + বিরতির চক্র']];
  var TABS = [['timer', '⏱', 'টাইমার'], ['stats', '📊', 'পরিসংখ্যান'], ['history', '🗂', 'ইতিহাস'], ['subjects', '🎯', 'সাবজেক্ট ও সেটিংস']];

  function tabsView() {
    return '<div class="sr-tabs" role="tablist">' + TABS.map(function (t) {
      return '<button type="button" role="tab" class="sr-tab' + (tab === t[0] ? ' on' : '') + '" aria-selected="' + (tab === t[0]) + '" data-a="tab" data-v="' + t[0] + '"><span aria-hidden="true">' + t[1] + '</span><b>' + t[2] + '</b></button>';
    }).join('') + '</div>';
  }

  function subjectChips() {
    var today = {}; sessionsIn('today').forEach(function (s) { today[s.sid] = (today[s.sid] || 0) + s.secs; });
    return '<div class="sr-chips" role="radiogroup" aria-label="সাবজেক্ট বেছে নিন">' + D.subjects.map(function (s) {
      var on = (D.active ? D.active.sid : D.sel) === s.id;
      return '<button type="button" role="radio" aria-checked="' + on + '" class="sr-chip-btn' + (on ? ' on' : '') + '" style="--c:' + s.color + '" data-a="pick" data-v="' + s.id + '"><span class="sr-ci no-mono" aria-hidden="true">' + E(s.icon) + '</span><span class="sr-cn">' + E(s.name) + '</span><small>' + (today[s.id] ? u.dur(today[s.id]) : 'আজ ০ মি') + '</small></button>';
    }).join('') + '</div>';
  }

  function ringView(a) {
    var C = 2 * Math.PI * 108, col = a && a.phase === 'break' ? '#34d399' : (subjColor(a ? a.sid : D.sel));
    var phase = !a ? 'প্রস্তুত' : a.phase === 'break' ? (a.long ? 'লম্বা বিরতি' : 'ছোট বিরতি') : (a.running ? 'মনোযোগ দিয়ে পড়ছেন' : 'বিরতিতে (পজ)');
    var sub = a ? (a.phase === 'break' ? 'চোখ বন্ধ করে একটু বিশ্রাম নিন' : subjIcon(a.sid) + ' ' + subjName(a.sid)) : subjIcon(D.sel) + ' ' + subjName(D.sel);
    var cyc = a && a.mode === 'pomodoro' ? '<div class="sr-cycles" aria-label="পোমোডোরো চক্র">' + Array.apply(null, Array(D.settings.every)).map(function (_, i) {
      var n = i + 1, cur = ((a.cycle - 1) % D.settings.every) + 1; return '<i class="' + (n < cur || (n === cur && a.phase === 'break') ? 'done' : n === cur ? 'now' : '') + '"></i>';
    }).join('') + '<small>চক্র ' + bd(a.cycle) + '</small></div>' : '';
    return '<div class="sr-ring"><svg viewBox="0 0 240 240" aria-hidden="true"><circle class="sr-ring-bg" cx="120" cy="120" r="108"/><circle id="srRingFg" class="sr-ring-fg" cx="120" cy="120" r="108" style="stroke:' + col + ';stroke-dasharray:' + C.toFixed(2) + ';stroke-dashoffset:' + C.toFixed(2) + '" transform="rotate(-90 120 120)"/></svg>' +
      '<div class="sr-ring-in"><span class="sr-phase">' + phase + '</span><div class="sr-time" id="srTime" role="timer" aria-live="off">' + displayTime(a) + '</div><span class="sr-sub no-mono">' + E(sub) + '</span>' + cyc + '</div></div>';
  }

  function controls(a) {
    var b = '';
    if (!a) b = '<button type="button" class="sr-btn sr-go" data-a="start">▶ শুরু করুন</button>';
    else {
      b = (a.running ? '<button type="button" class="sr-btn sr-pause" data-a="pause">⏸ পজ</button>' : '<button type="button" class="sr-btn sr-go" data-a="resume">▶ চালু করুন</button>') +
        '<button type="button" class="sr-btn sr-stop" data-a="finish">■ শেষ ও সেভ</button>';
    }
    var extra = a ? '<div class="sr-ctl-row">' +
      (isFocusPhase(a) ? '<button type="button" class="sr-mini" data-a="dist" title="মনোযোগ নষ্ট হলে চাপুন">🔔 মনোযোগ ভঙ্গ <b>' + bd(a.dist || 0) + '</b></button>' : '') +
      (a.mode === 'pomodoro' ? '<button type="button" class="sr-mini" data-a="skip">⏭ ধাপ বাদ দিন</button>' : '') +
      '<button type="button" class="sr-mini" data-a="discard">🗑 বাতিল</button></div>' : '';
    return '<div class="sr-ctl">' + b + '</div>' + extra;
  }

  function modeSetup(a) {
    var seg = '<div class="sr-seg" role="radiogroup" aria-label="টাইমার মোড">' + MODES.map(function (m) {
      return '<button type="button" role="radio" aria-checked="' + (D.mode === m[0]) + '" class="' + (D.mode === m[0] ? 'on' : '') + '"' + (a ? ' disabled' : '') + ' data-a="mode" data-v="' + m[0] + '"><b>' + m[1] + '</b><small>' + m[2] + '</small></button>';
    }).join('') + '</div>';
    var more = '';
    if (!a && D.mode === 'countdown') {
      more = '<div class="sr-presets"><span>সময় (মিনিট):</span>' + [15, 25, 30, 45, 60, 90, 120].map(function (m) { return '<button type="button" class="' + (D.cd === m ? 'on' : '') + '" data-a="cd" data-v="' + m + '">' + bd(m) + '</button>'; }).join('') +
        '<label class="sr-num"><input id="srCdCustom" type="number" min="1" max="600" inputmode="numeric" value="' + D.cd + '" aria-label="কাস্টম মিনিট"><em>মি</em></label></div>';
    }
    if (!a && D.mode === 'pomodoro') {
      more = '<p class="sr-note">' + bd(D.settings.focus) + ' মি ফোকাস → ' + bd(D.settings.brk) + ' মি বিরতি, প্রতি ' + bd(D.settings.every) + 'টি চক্রে ' + bd(D.settings.long) + ' মি লম্বা বিরতি। <button type="button" class="sr-link" data-a="tab" data-v="subjects">সময় বদলান</button></p>';
    }
    return seg + more;
  }

  function pendingView() {
    var p = D.pending; if (!p) return '';
    var stars = [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" class="sr-star' + (p._f >= n ? ' on' : '') + '" data-a="star" data-v="' + n + '" aria-label="' + n + ' তারা">★</button>'; }).join('');
    return '<section class="sr-pending card" aria-label="সেশন সংরক্ষণ"><div class="sr-pending-head"><span class="sr-pending-ico no-mono" style="--c:' + subjColor(p.sid) + '">' + E(subjIcon(p.sid)) + '</span><div><b>সেশন শেষ! 🎉</b><p>' + E(subjName(p.sid)) + ' · <strong>' + u.dur(p.secs) + '</strong>' + (p.dist ? ' · মনোযোগ ভঙ্গ ' + bd(p.dist) + ' বার' : '') + '</p></div></div>' +
      '<div class="sr-rate"><span>আজকের মনোযোগ কেমন ছিল?</span><div>' + stars + '</div></div>' +
      '<label class="sr-field"><span>কী পড়লেন? (ঐচ্ছিক)</span><textarea id="srNote" rows="2" maxlength="300" placeholder="যেমন: Vector অধ্যায়ের ৫টি অংক"></textarea></label>' +
      '<div class="sr-row-btns"><button type="button" class="sr-btn sr-go" data-a="savepending">✓ সেভ করুন</button><button type="button" class="sr-btn sr-ghost" data-a="droppending">মুছে ফেলুন</button></div></section>';
  }

  function sideToday() {
    var list = sessionsIn('today'), subs = bySubject(list), tot = todaySecs(), g = D.settings.daily * 60;
    return '<aside class="sr-side"><div class="sr-card sr-today"><div class="sr-card-h"><h3>আজকের হিসাব</h3><span class="sr-streak" title="টানা পড়ার দিন">🔥 ' + bd(streak()) + ' দিন</span></div>' +
      '<div class="sr-big" id="srToday">' + u.dur(tot) + '</div>' +
      '<div class="sr-bar"><i id="srGoalFill" style="width:' + Math.min(100, g ? tot / g * 100 : 0).toFixed(1) + '%"></i></div><p class="sr-goal-t" id="srGoalTxt">' + goalText() + '</p>' +
      '<div class="sr-mini-stats"><span><b>' + bd(list.length) + '</b>সেশন</span><span><b>' + bd(subs.length) + '</b>সাবজেক্ট</span><span><b>' + (list.length ? bd(Math.round(list.reduce(function (n, s) { return n + (s.focus || 0); }, 0) / Math.max(1, list.filter(function (s) { return s.focus; }).length) * 10) / 10 || 0) : '০') + '</b>গড় ফোকাস</span></div></div>' +
      '<div class="sr-card"><div class="sr-card-h"><h3>আজকের সাবজেক্ট</h3></div>' + (subs.length ? subs.map(function (s) {
        return '<div class="sr-line"><span class="sr-dot" style="background:' + subjColor(s.id) + '"></span><span class="sr-ln">' + E(subjName(s.id)) + '</span><b>' + u.dur(s.secs) + '</b></div>';
      }).join('') : '<p class="sr-empty">এখনও কিছু পড়া হয়নি। একটি সাবজেক্ট বেছে ▶ চাপুন।</p>') + '</div>' +
      '<div class="sr-card sr-quote"><span aria-hidden="true">💡</span><p>' + QUOTES[new Date().getDate() % QUOTES.length] + '</p></div></aside>';
  }

  function manualAdd() {
    var today = u.dayKey(new Date());
    return '<details class="sr-card sr-manual"' + (showAdd ? ' open' : '') + '><summary>✍️ ভুলে টাইমার চালু করেননি? হাতে সময় যোগ করুন</summary><div class="sr-manual-grid">' +
      '<label class="sr-field"><span>সাবজেক্ট</span><select id="srMSub">' + D.subjects.map(function (s) { return '<option value="' + s.id + '"' + (s.id === D.sel ? ' selected' : '') + '>' + E(s.icon + ' ' + s.name) + '</option>'; }).join('') + '</select></label>' +
      '<label class="sr-field"><span>তারিখ</span><input id="srMDate" type="date" value="' + today + '" max="' + today + '"></label>' +
      '<label class="sr-field"><span>ঘণ্টা</span><input id="srMH" type="number" min="0" max="23" inputmode="numeric" value="0"></label>' +
      '<label class="sr-field"><span>মিনিট</span><input id="srMM" type="number" min="0" max="59" inputmode="numeric" value="30"></label>' +
      '<label class="sr-field sr-span2"><span>নোট (ঐচ্ছিক)</span><input id="srMNote" type="text" maxlength="120" placeholder="কী পড়লেন?"></label></div>' +
      '<button type="button" class="sr-btn sr-go sr-wide" data-a="manual">+ সময় যোগ করুন</button></details>';
  }

  function timerTab() {
    var a = D.active;
    return '<div class="sr-grid"><div class="sr-main">' +
      '<div class="sr-card sr-pick"><div class="sr-card-h"><h3>১. সাবজেক্ট বেছে নিন</h3>' + (a ? '<small>চলার সময়ও বদলাতে পারবেন—আগের সময় নিজে থেকে সেভ হবে</small>' : '') + '</div>' + subjectChips() + '</div>' +
      pendingView() +
      '<div class="sr-card sr-timer-card' + (focusMode ? ' sr-fs' : '') + '"><div class="sr-card-h"><h3>২. টাইমার</h3><div class="sr-card-tools">' +
      '<button type="button" class="sr-mini" data-a="fs" aria-pressed="' + focusMode + '">' + (focusMode ? '✕ ফোকাস মোড বন্ধ' : '⛶ ফোকাস মোড') + '</button></div></div>' +
      modeSetup(a) + ringView(a) + controls(a) + '</div>' + manualAdd() + '</div>' + sideToday() + '</div>';
  }

  /* ----- stats ----- */
  function donut(rows, totalSecs) {
    var R = 70, C = 2 * Math.PI * R, off = 0, segs = rows.map(function (r) {
      var f = totalSecs ? r.secs / totalSecs : 0, len = f * C, s = '<circle cx="90" cy="90" r="' + R + '" fill="none" stroke="' + subjColor(r.id) + '" stroke-width="22" stroke-dasharray="' + Math.max(0, len - 1.5).toFixed(2) + ' ' + (C - Math.max(0, len - 1.5)).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 90 90)"/>';
      off += len; return s;
    }).join('');
    return '<svg class="sr-donut" viewBox="0 0 180 180" role="img" aria-label="সাবজেক্ট অনুযায়ী সময়ের ভাগ"><circle cx="90" cy="90" r="' + R + '" fill="none" class="sr-donut-bg" stroke-width="22"/>' + segs + '<text x="90" y="86" text-anchor="middle" class="sr-d1">' + u.dur(totalSecs) + '</text><text x="90" y="106" text-anchor="middle" class="sr-d2">মোট</text></svg>';
  }
  function dayBars(n) {
    var days = [], t0 = startOfDay(now()), i;
    for (i = n - 1; i >= 0; i--) days.push(t0 - i * 86400000);
    var byDay = days.map(function (d) {
      var seg = {}; D.sessions.forEach(function (s) { if (s.start >= d && s.start < d + 86400000) seg[s.sid] = (seg[s.sid] || 0) + s.secs; });
      return { d: d, seg: seg, tot: Object.keys(seg).reduce(function (x, k) { return x + seg[k]; }, 0) };
    });
    var max = Math.max.apply(null, byDay.map(function (x) { return x.tot; }).concat([D.settings.daily * 60 * .5, 3600])), W = 420, H = 200, pl = 34, pb = 26, pt = 8, gw = (W - pl - 6) / n, bw = Math.max(6, Math.min(34, gw * .62));
    var gl = [0, .5, 1].map(function (f) { var y = pt + (H - pb - pt) * (1 - f); return '<line x1="' + pl + '" x2="' + W + '" y1="' + y + '" y2="' + y + '" class="sr-grid-l"/><text x="' + (pl - 5) + '" y="' + (y + 3) + '" text-anchor="end" class="sr-ax">' + (f ? bd(Math.round(max * f / 360) / 10) + 'ঘ' : '০') + '</text>'; }).join('');
    var goalY = D.settings.daily ? pt + (H - pb - pt) * (1 - Math.min(1, D.settings.daily * 60 / max)) : null;
    var bars = byDay.map(function (x, k) {
      var cx = pl + gw * k + gw / 2, y = H - pb, parts = '';
      Object.keys(x.seg).sort().forEach(function (sid) { var h = (H - pb - pt) * x.seg[sid] / max; y -= h; parts += '<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(1, h).toFixed(1) + '" rx="3" fill="' + subjColor(sid) + '"><title>' + E(subjName(sid)) + ': ' + u.dur(x.seg[sid]) + '</title></rect>'; });
      var dt = new Date(x.d), lab = n <= 7 ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'][dt.getDay()] : (k % 5 === 0 || k === n - 1 ? bd(dt.getDate()) : '');
      return parts + '<text x="' + cx.toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle" class="sr-ax' + (x.d === t0 ? ' now' : '') + '">' + lab + '</text>';
    }).join('');
    return '<svg class="sr-bars" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="দৈনিক পড়ার সময়ের চার্ট" preserveAspectRatio="xMidYMid meet">' + gl + (goalY !== null ? '<line x1="' + pl + '" x2="' + W + '" y1="' + goalY.toFixed(1) + '" y2="' + goalY.toFixed(1) + '" class="sr-goal-l"/>' : '') + bars + '</svg>';
  }
  function heatmap() {
    var m = dayTotals(), t0 = startOfDay(now()), dow = new Date(t0).getDay(), weeks = 14, cells = '', max = 1;
    Object.keys(m).forEach(function (k) { max = Math.max(max, m[k]); });
    for (var w = 0; w < weeks; w++) {
      var col = '';
      for (var d = 0; d < 7; d++) {
        var offset = (weeks - 1 - w) * 7 + (dow - d), ts = t0 - offset * 86400000;
        if (offset < 0) { col += '<i class="e"></i>'; continue; }
        var v = m[u.dayKey(ts)] || 0, lvl = !v ? 0 : Math.min(4, 1 + Math.floor(v / max * 3.99));
        col += '<i class="l' + lvl + '" title="' + u.dayKey(ts) + ': ' + u.dur(v) + '"></i>';
      }
      cells += '<div>' + col + '</div>';
    }
    return '<div class="sr-heat" role="img" aria-label="গত ১৪ সপ্তাহের হিটম্যাপ">' + cells + '</div><div class="sr-legend"><span>কম</span><i class="l0"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i><span>বেশি</span></div>';
  }
  function hourBuckets() {
    var B = [['ভোর', 4, 8], ['সকাল', 8, 12], ['দুপুর', 12, 16], ['বিকাল', 16, 19], ['সন্ধ্যা', 19, 22], ['রাত', 22, 28]], tot = B.map(function () { return 0; });
    D.sessions.forEach(function (s) { var h = new Date(s.start).getHours(); if (h < 4) h += 24; for (var i = 0; i < B.length; i++) if (h >= B[i][1] && h < B[i][2]) { tot[i] += s.secs; break; } });
    var mx = Math.max.apply(null, tot.concat([1]));
    return '<div class="sr-hours">' + B.map(function (b, i) { return '<div class="' + (tot[i] === mx && mx > 1 ? 'top' : '') + '"><i style="height:' + Math.max(4, tot[i] / mx * 100).toFixed(0) + '%"></i><b>' + b[0] + '</b><small>' + (tot[i] ? u.dur(tot[i]) : '—') + '</small></div>'; }).join('') + '</div>';
  }
  function statsTab() {
    var list = sessionsIn(range), tot = total(list), subs = bySubject(list), days = {}; list.forEach(function (s) { days[u.dayKey(s.start)] = 1; });
    var nd = Math.max(1, range === 'today' ? 1 : range === 'all' ? Math.max(1, Math.ceil((now() - Math.min.apply(null, D.sessions.map(function (s) { return s.start; }).concat([now()]))) / 86400000)) : +range);
    var best = 0, bestDay = ''; var dm = {}; list.forEach(function (s) { var k = u.dayKey(s.start); dm[k] = (dm[k] || 0) + s.secs; }); Object.keys(dm).forEach(function (k) { if (dm[k] > best) { best = dm[k]; bestDay = k; } });
    var rated = list.filter(function (s) { return s.focus; }), avgF = rated.length ? (rated.reduce(function (n, s) { return n + s.focus; }, 0) / rated.length) : 0;
    var longest = list.reduce(function (n, s) { return Math.max(n, s.secs); }, 0);
    var head = '<div class="sr-range" role="tablist">' + RANGES.map(function (r) { return '<button type="button" role="tab" aria-selected="' + (range === r[0]) + '" class="' + (range === r[0] ? 'on' : '') + '" data-a="range" data-v="' + r[0] + '">' + r[1] + '</button>'; }).join('') + '</div>';
    if (!D.sessions.length) return head + '<div class="sr-card sr-blank"><span aria-hidden="true">📊</span><h3>এখনও কোনো তথ্য নেই</h3><p>টাইমার চালিয়ে প্রথম সেশনটি সেভ করুন—এখানে সাবজেক্ট ধরে পরিসংখ্যান দেখা যাবে।</p><button type="button" class="sr-btn sr-go" data-a="tab" data-v="timer">টাইমারে যান</button></div>';
    var kpi = [['⏳', 'মোট সময়', u.dur(tot)], ['📅', 'দৈনিক গড়', u.dur(tot / nd)], ['🗓', 'সক্রিয় দিন', bd(Object.keys(days).length) + ' দিন'], ['🔥', 'টানা দিন', bd(streak()) + ' দিন'], ['🏆', 'সেরা দিন', best ? u.dur(best) : '—'], ['🎯', 'সবচেয়ে লম্বা সেশন', longest ? u.dur(longest) : '—'], ['🧘', 'গড় ফোকাস', avgF ? bd(avgF.toFixed(1)) + ' / ৫' : '—'], ['🧾', 'সেশন', bd(list.length) + 'টি']];
    var rows = subs.map(function (r) {
      var s = subj(r.id), pct = tot ? r.secs / tot * 100 : 0, goalTxt = '';
      if (s && s.goal) { var daysN = range === 'today' ? 1 : range === 'all' ? nd : +range, gs = s.goal * 60 * daysN; goalTxt = '<small class="sr-g">লক্ষ্য ' + u.dur(gs) + ' · ' + bd(Math.min(999, Math.round(r.secs / gs * 100))) + '%</small>'; }
      return '<div class="sr-row"><span class="sr-ci no-mono" style="--c:' + subjColor(r.id) + '">' + E(subjIcon(r.id)) + '</span><div class="sr-row-m"><div class="sr-row-t"><b>' + E(subjName(r.id)) + '</b><span>' + u.dur(r.secs) + ' · ' + bd(pct.toFixed(0)) + '%</span></div><div class="sr-bar sm"><i style="width:' + pct.toFixed(1) + '%;background:' + subjColor(r.id) + '"></i></div>' + goalTxt + '</div></div>';
    }).join('');
    var untouched = D.subjects.filter(function (s) { return !subs.some(function (r) { return r.id === s.id; }); });
    var insights = [];
    if (subs[0]) insights.push('সবচেয়ে বেশি সময় দিয়েছেন <b>' + E(subjName(subs[0].id)) + '</b> (' + u.dur(subs[0].secs) + ')।');
    if (untouched.length && range !== 'all') insights.push('এই সময়ে পড়া হয়নি: <b>' + untouched.slice(0, 4).map(function (s) { return E(s.name); }).join(', ') + '</b>—এগুলোর জন্য সময় রাখুন।');
    if (subs.length > 1) { var lo = subs[subs.length - 1]; insights.push('সবচেয়ে কম সময় গেছে <b>' + E(subjName(lo.id)) + '</b>-এ (' + u.dur(lo.secs) + ')।'); }
    if (bestDay) insights.push('সেরা দিন ছিল <b>' + bd(bestDay.split('-').reverse().join('/')) + '</b>—' + u.dur(best) + '।');
    return head + '<div class="sr-kpis">' + kpi.map(function (k) { return '<div class="sr-kpi"><span aria-hidden="true">' + k[0] + '</span><small>' + k[1] + '</small><b>' + k[2] + '</b></div>'; }).join('') + '</div>' +
      '<div class="sr-two"><div class="sr-card"><div class="sr-card-h"><h3>সাবজেক্ট অনুযায়ী ভাগ</h3></div>' + (tot ? '<div class="sr-split">' + donut(subs, tot) + '<div class="sr-rows">' + rows + '</div></div>' : '<p class="sr-empty">এই সময়ে কোনো সেশন নেই।</p>') + '</div>' +
      '<div class="sr-card"><div class="sr-card-h"><h3>' + (range === '30' || range === 'all' ? 'গত ৩০ দিন' : 'গত ৭ দিন') + '</h3><small>ড্যাশ লাইন = দৈনিক লক্ষ্য</small></div>' + dayBars(range === '30' || range === 'all' ? 30 : 7) + '<div class="sr-keys">' + D.subjects.filter(function (s) { return D.sessions.some(function (x) { return x.sid === s.id; }); }).map(function (s) { return '<span><i style="background:' + s.color + '"></i>' + E(s.name) + '</span>'; }).join('') + '</div></div></div>' +
      '<div class="sr-two"><div class="sr-card"><div class="sr-card-h"><h3>গত ১৪ সপ্তাহ</h3></div>' + heatmap() + '</div><div class="sr-card"><div class="sr-card-h"><h3>কোন সময়ে বেশি পড়েন?</h3></div>' + hourBuckets() + '</div></div>' +
      '<div class="sr-card sr-ins"><div class="sr-card-h"><h3>💡 আপনার জন্য ইনসাইট</h3></div><ul>' + insights.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul></div>';
  }

  /* ----- history ----- */
  function historyTab() {
    var list = D.sessions.slice().sort(function (a, b) { return b.start - a.start; }).filter(function (s) { return histSub === 'all' || s.sid === histSub; });
    var head = '<div class="sr-hist-bar"><label class="sr-field"><span>ফিল্টার</span><select id="srHSub"><option value="all">সব সাবজেক্ট</option>' + D.subjects.map(function (s) { return '<option value="' + s.id + '"' + (histSub === s.id ? ' selected' : '') + '>' + E(s.icon + ' ' + s.name) + '</option>'; }).join('') + '</select></label>' +
      '<div class="sr-row-btns"><button type="button" class="sr-btn sr-ghost" data-a="csv">⬇ CSV</button><button type="button" class="sr-btn sr-ghost" data-a="share">📋 সারাংশ কপি</button></div></div>';
    if (!list.length) return head + '<div class="sr-card sr-blank"><span aria-hidden="true">🗂</span><h3>কোনো সেশন পাওয়া যায়নি</h3><p>টাইমার চালিয়ে সেশন সেভ করুন।</p></div>';
    var out = '', last = '';
    list.slice(0, 200).forEach(function (s) {
      var dk = u.dayKey(s.start);
      if (dk !== last) {
        last = dk; var dayTot = D.sessions.filter(function (x) { return u.dayKey(x.start) === dk; }).reduce(function (n, x) { return n + x.secs; }, 0);
        var dt = new Date(s.start), nm = dk === u.dayKey(new Date()) ? 'আজ' : dk === u.dayKey(new Date(now() - 86400000)) ? 'গতকাল' : bd(dt.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', weekday: 'long' }));
        out += '<div class="sr-day"><b>' + nm + '</b><span>' + u.dur(dayTot) + '</span></div>';
      }
      var st = new Date(s.start), en = new Date(s.end), tm = function (d) { return u.pad(d.getHours() % 12 || 12) + ':' + u.pad(d.getMinutes()) + (d.getHours() < 12 ? ' AM' : ' PM'); };
      out += '<article class="sr-sess" style="--c:' + subjColor(s.sid) + '"><span class="sr-ci no-mono" aria-hidden="true">' + E(subjIcon(s.sid)) + '</span><div class="sr-sess-m"><div class="sr-sess-t"><b>' + E(subjName(s.sid)) + '</b><strong>' + u.dur(s.secs) + '</strong></div><small>' + tm(st) + ' – ' + tm(en) + (s.mode === 'pomodoro' ? ' · 🍅' : s.mode === 'countdown' ? ' · ⏳' : s.mode === 'manual' ? ' · ✍️ হাতে যোগ' : '') + (s.focus ? ' · ' + '★'.repeat(s.focus) : '') + (s.dist ? ' · 🔔' + bd(s.dist) : '') + '</small>' + (s.note ? '<p>' + E(s.note) + '</p>' : '') + '</div><button type="button" class="sr-x" data-a="delsess" data-v="' + s.id + '" aria-label="সেশন মুছুন">✕</button></article>';
    });
    return head + '<div class="sr-hist">' + out + '</div>' + (list.length > 200 ? '<p class="sr-note">সর্বশেষ ২০০টি সেশন দেখানো হচ্ছে। সব পেতে CSV নিন।</p>' : '');
  }

  /* ----- subjects & settings ----- */
  function subjectsTab() {
    var s = D.settings;
    var list = D.subjects.map(function (x) {
      if (editId === x.id) {
        return '<div class="sr-edit" style="--c:' + x.color + '"><div class="sr-edit-grid"><label class="sr-field"><span>নাম</span><input id="srEName" value="' + E(x.name) + '" maxlength="30"></label><label class="sr-field"><span>দৈনিক লক্ষ্য (মিনিট, ০ = নেই)</span><input id="srEGoal" type="number" min="0" max="900" inputmode="numeric" value="' + (x.goal || 0) + '"></label></div>' +
          '<div class="sr-field"><span>আইকন</span><div class="sr-pal no-mono">' + ICONS.map(function (i) { return '<button type="button" class="' + (i === x.icon ? 'on' : '') + '" data-a="eicon" data-v="' + i + '">' + i + '</button>'; }).join('') + '</div></div>' +
          '<div class="sr-field"><span>রং</span><div class="sr-pal no-mono">' + COLORS.map(function (c) { return '<button type="button" class="sw' + (c === x.color ? ' on' : '') + '" style="background:' + c + '" data-a="ecolor" data-v="' + c + '" aria-label="রং ' + c + '"></button>'; }).join('') + '</div></div>' +
          '<div class="sr-row-btns"><button type="button" class="sr-btn sr-go" data-a="esave">সেভ</button><button type="button" class="sr-btn sr-ghost" data-a="ecancel">বাতিল</button><button type="button" class="sr-btn sr-danger" data-a="edel" data-v="' + x.id + '">মুছুন</button></div></div>';
      }
      return '<div class="sr-srow"><span class="sr-ci no-mono" style="--c:' + x.color + '">' + E(x.icon) + '</span><div class="sr-srow-m"><b>' + E(x.name) + '</b><small>' + (x.goal ? 'দৈনিক লক্ষ্য ' + u.dur(x.goal * 60) : 'লক্ষ্য সেট নেই') + ' · মোট ' + u.dur(total(D.sessions.filter(function (z) { return z.sid === x.id; }))) + '</small></div><button type="button" class="sr-mini" data-a="edit" data-v="' + x.id + '">✎ এডিট</button></div>';
    }).join('');
    function num(id, label, val, min, max) { return '<label class="sr-field"><span>' + label + '</span><input id="' + id + '" type="number" min="' + min + '" max="' + max + '" inputmode="numeric" value="' + val + '"></label>'; }
    function sw(id, label, on, desc) { return '<label class="sr-switch"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '><span class="sr-sw-t"><b>' + label + '</b><small>' + desc + '</small></span><i aria-hidden="true"></i></label>'; }
    return '<div class="sr-two"><div class="sr-card"><div class="sr-card-h"><h3>আমার সাবজেক্ট</h3><button type="button" class="sr-mini" data-a="addsub">+ নতুন সাবজেক্ট</button></div><div class="sr-slist">' + list + '</div></div>' +
      '<div class="sr-card"><div class="sr-card-h"><h3>টাইমার সেটিংস</h3></div><div class="sr-set-grid">' + num('srSDaily', 'দৈনিক পড়ার লক্ষ্য (মিনিট)', s.daily, 0, 1440) + num('srSFocus', 'পোমোডোরো ফোকাস (মি)', s.focus, 1, 180) + num('srSBrk', 'ছোট বিরতি (মি)', s.brk, 1, 60) + num('srSLong', 'লম্বা বিরতি (মি)', s.long, 1, 120) + num('srSEvery', 'কয় চক্র পর লম্বা বিরতি', s.every, 2, 10) + '</div>' +
      sw('srSSound', 'শেষ হলে শব্দ ও ভাইব্রেশন', s.sound, 'টাইমার/পোমোডোরো শেষে সংকেত দেবে') + sw('srSAuto', 'বিরতির পর নিজে থেকে শুরু', s.auto, 'বন্ধ থাকলে বিরতির পর আপনি ▶ চাপবেন') + sw('srSWake', 'পড়ার সময় স্ক্রিন জাগিয়ে রাখুন', s.wake, 'সমর্থিত ব্রাউজারে স্ক্রিন বন্ধ হবে না') +
      '<div class="sr-row-btns"><button type="button" class="sr-btn sr-go" data-a="savesettings">সেটিংস সেভ করুন</button></div>' +
      '<div class="sr-danger-zone"><b>ডেটা</b><p>সব তথ্য শুধু এই ডিভাইসের ব্রাউজারে থাকে।</p><div class="sr-row-btns"><button type="button" class="sr-btn sr-ghost" data-a="csv">⬇ CSV এক্সপোর্ট</button><button type="button" class="sr-btn sr-danger" data-a="reset">সব সেশন মুছুন</button></div></div></div></div>';
  }

  function render() {
    var body = tab === 'stats' ? statsTab() : tab === 'history' ? historyTab() : tab === 'subjects' ? subjectsTab() : timerTab();
    return '<div class="sr' + (focusMode ? ' sr-focus-on' : '') + '">' + tabsView() + '<div class="sr-pane">' + body + '</div></div>';
  }

  /* ---------- actions ---------- */
  function csv() {
    var rows = [['তারিখ', 'শুরু', 'শেষ', 'সাবজেক্ট', 'মিনিট', 'মোড', 'ফোকাস', 'মনোযোগ ভঙ্গ', 'নোট']];
    D.sessions.slice().sort(function (a, b) { return a.start - b.start; }).forEach(function (s) {
      rows.push([u.dayKey(s.start), new Date(s.start).toTimeString().slice(0, 5), new Date(s.end).toTimeString().slice(0, 5), subjName(s.sid), (s.secs / 60).toFixed(1), s.mode, s.focus || '', s.dist || 0, (s.note || '').replace(/\n/g, ' ')]);
    });
    u.download('study-room-' + u.dayKey(new Date()) + '.csv', '﻿' + rows.map(function (r) { return r.map(function (c) { c = String(c); return /[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c; }).join(','); }).join('\n'), 'text/csv;charset=utf-8');
  }
  function summaryText() {
    var w = sessionsIn('7'), subs = bySubject(w);
    return 'ConceptLab Study Room — গত ৭ দিন\nমোট: ' + u.dur(total(w)) + '\n' + subs.map(function (s) { return '• ' + subjName(s.id) + ': ' + u.dur(s.secs); }).join('\n') + '\n🔥 টানা ' + bd(streak()) + ' দিন';
  }
  function readSettings() {
    function n(id, d, lo, hi) { var el = document.getElementById(id), v = el ? parseInt(el.value, 10) : NaN; return isNaN(v) ? d : Math.min(hi, Math.max(lo, v)); }
    var s = D.settings;
    s.daily = n('srSDaily', s.daily, 0, 1440); s.focus = n('srSFocus', s.focus, 1, 180); s.brk = n('srSBrk', s.brk, 1, 60); s.long = n('srSLong', s.long, 1, 120); s.every = n('srSEvery', s.every, 2, 10);
    s.sound = !!document.getElementById('srSSound').checked; s.auto = !!document.getElementById('srSAuto').checked; s.wake = !!document.getElementById('srSWake').checked;
  }
  var draftEdit = null;
  function click(el) {
    var a = el.dataset.a, v = el.dataset.v;
    switch (a) {
      case 'tab': tab = v; focusMode = false; editId = null; HP.paint(); window.scrollTo({ top: 0 }); break;
      case 'pick': if (D.active) { if (D.active.sid !== v) switchSubject(v); } else { D.sel = v; save(); HP.paint(); } break;
      case 'mode': if (!D.active) { D.mode = v; save(); HP.paint(); } break;
      case 'cd': D.cd = +v; save(); HP.paint(); break;
      case 'start': var c = document.getElementById('srCdCustom'); if (c && D.mode === 'countdown') { var cv = parseInt(c.value, 10); if (cv > 0 && cv <= 600) D.cd = cv; } startTimer(); break;
      case 'pause': pauseTimer(); break;
      case 'resume': resumeTimer(); break;
      case 'finish': finishTimer(false); break;
      case 'discard': discardTimer(); break;
      case 'dist': if (D.active) { D.active.dist = (D.active.dist || 0) + 1; save(); HP.paint(); } break;
      case 'skip': skipPhase(); break;
      case 'fs': focusMode = !focusMode; HP.paint(); break;
      case 'star': if (D.pending) { D.pending._f = +v; var note = (document.getElementById('srNote') || {}).value || ''; HP.paint(); var nn = document.getElementById('srNote'); if (nn) nn.value = note; } break;
      case 'savepending': savePending((document.getElementById('srNote') || {}).value, D.pending && D.pending._f); break;
      case 'droppending': dropPending(); break;
      case 'manual':
        var sid = document.getElementById('srMSub').value, ds = document.getElementById('srMDate').value, h = parseInt(document.getElementById('srMH').value, 10) || 0, m = parseInt(document.getElementById('srMM').value, 10) || 0, secs = (h * 60 + m) * 60;
        if (secs < 60) { u.toast('অন্তত ১ মিনিট দিন'); break; }
        var p = (ds || u.dayKey(new Date())).split('-'), st = new Date(+p[0], +p[1] - 1, +p[2], 12, 0, 0).getTime();
        if (st > now()) st = now() - secs * 1000;
        D.sessions.push({ id: u.uid(), sid: sid, start: st, end: st + secs * 1000, secs: secs, mode: 'manual', dist: 0, note: (document.getElementById('srMNote').value || '').slice(0, 120), focus: 0 });
        save(); showAdd = true; HP.paint(); u.toast('সময় যোগ হয়েছে ✓'); break;
      case 'range': range = v; HP.paint(); break;
      case 'delsess': if (confirm('এই সেশনটি মুছে ফেলবেন?')) { D.sessions = D.sessions.filter(function (s) { return s.id !== v; }); save(); HP.paint(); } break;
      case 'csv': csv(); break;
      case 'share': u.copy(summaryText()); break;
      case 'addsub':
        var id = 's' + u.uid(); D.subjects.push({ id: id, name: 'নতুন সাবজেক্ট', icon: '📚', color: COLORS[D.subjects.length % COLORS.length], goal: 0 }); editId = id; draftEdit = Object.assign({}, subj(id)); save(); HP.paint(); break;
      case 'edit': editId = v; draftEdit = Object.assign({}, subj(v)); HP.paint(); break;
      case 'eicon': draftEdit.icon = v; keepEditing(); break;
      case 'ecolor': draftEdit.color = v; keepEditing(); break;
      case 'esave':
        var sb = subj(editId); if (!sb) break; var nm = (document.getElementById('srEName').value || '').trim();
        if (!nm) { u.toast('নাম লিখুন'); break; }
        sb.name = nm.slice(0, 30); sb.goal = Math.max(0, Math.min(900, parseInt(document.getElementById('srEGoal').value, 10) || 0)); sb.icon = draftEdit.icon; sb.color = draftEdit.color; editId = null; save(); HP.paint(); u.toast('সাবজেক্ট আপডেট হয়েছে'); break;
      case 'ecancel': editId = null; HP.paint(); break;
      case 'edel':
        if (D.subjects.length <= 1) { u.toast('অন্তত একটি সাবজেক্ট রাখতে হবে'); break; }
        if (D.active && D.active.sid === v) { u.toast('টাইমার চলছে—আগে শেষ করুন'); break; }
        if (confirm('সাবজেক্টটি মুছবেন? আগের সেশনগুলো ইতিহাসে থাকবে।')) { D.subjects = D.subjects.filter(function (s) { return s.id !== v; }); if (D.sel === v) D.sel = D.subjects[0].id; editId = null; save(); HP.paint(); } break;
      case 'savesettings': readSettings(); save(); u.toast('সেটিংস সেভ হয়েছে ✓'); HP.paint(); break;
      case 'reset': if (confirm('সব সেশন মুছে ফেলবেন? এটি ফেরানো যাবে না।')) { D.sessions = []; D.pending = null; save(); HP.paint(); u.toast('সব সেশন মুছে ফেলা হয়েছে'); } break;
    }
  }
  function keepEditing() {
    var nm = (document.getElementById('srEName') || {}).value, g = (document.getElementById('srEGoal') || {}).value;
    var sb = subj(editId); if (sb) { sb._tmp = 1; }
    HP.paint(); var n = document.getElementById('srEName'), gg = document.getElementById('srEGoal'); if (n && nm != null) n.value = nm; if (gg && g != null) gg.value = g;
    var box = document.querySelector('.sr-edit'); if (box) box.style.setProperty('--c', draftEdit.color);
    document.querySelectorAll('.sr-pal button').forEach(function (b) { if (b.dataset.a === 'eicon') b.classList.toggle('on', b.dataset.v === draftEdit.icon); if (b.dataset.a === 'ecolor') b.classList.toggle('on', b.dataset.v === draftEdit.color); });
  }
  function change(el) {
    if (el.id === 'srHSub') { histSub = el.value; HP.paint(); }
    if (el.id === 'srCdCustom') { var v = parseInt(el.value, 10); if (v > 0 && v <= 600) { D.cd = v; save(); } }
  }

  /* ---------- registration ---------- */
  HP.add({
    id: 'study-room', icon: '📚', label: 'Study Room', group: 'focus', priority: 100, highlight: true,
    desc: 'প্রতিটি সাবজেক্টে টাইমার চালান—কোন সাবজেক্টে কতক্ষণ পড়লেন তার নিখুঁত হিসাব, লক্ষ্য, স্ট্রিক ও চার্টসহ।',
    render: render,
    mount: function () { load(); try { if (!localStorage.getItem(K)) save(); } catch (e) { } ensureChip(); updateChip(); tickAll(); },
    unmount: function () { focusMode = false; editId = null; updateChip(); },
    click: click, change: change,
    key: function (e, el) { if (e.key === ' ' && el.tagName === 'BUTTON') return; if (e.key === 'Enter' && el.id === 'srCdCustom') { e.preventDefault(); } }
  });

  /* Hub dashboard spotlight (above the tool list) */
  HP.hooks.spotlight.push(function () {
    var a = D.active, week = sessionsIn('7'), t = todaySecs(), subs = bySubject(week).slice(0, 3);
    var days = [], t0 = startOfDay(now()), dm = dayTotals(), mx = 1, i;
    for (i = 6; i >= 0; i--) { var v = dm[u.dayKey(t0 - i * 86400000)] || 0; days.push(v); mx = Math.max(mx, v); }
    return '<section class="sr-spot" aria-label="Study Room"><div class="sr-spot-copy"><span class="sr-spot-k">NEW · STUDY ROOM</span><h2>কোন সাবজেক্টে কতক্ষণ পড়লেন—এখন সব হিসাব আপনার হাতে</h2>' +
      '<p>সাবজেক্ট বেছে টাইমার চালান। স্টপওয়াচ, কাউন্টডাউন ও পোমোডোরো—সঙ্গে দৈনিক লক্ষ্য, স্ট্রিক, চার্ট আর ইতিহাস।</p>' +
      '<div class="sr-spot-stats"><span><b>' + u.dur(t) + '</b>আজ</span><span><b>' + bd(streak()) + '</b>দিনের স্ট্রিক</span><span><b>' + u.dur(total(week)) + '</b>এই সপ্তাহ</span></div>' +
      '<a class="sr-btn sr-go" href="#/hub/study-room">' + (a ? '▶ চলমান টাইমারে যান' : 'Study Room খুলুন') + ' <b aria-hidden="true">↗</b></a></div>' +
      '<div class="sr-spot-art" aria-hidden="true"><div class="sr-spot-bars">' + days.map(function (v) { return '<i style="height:' + Math.max(8, v / mx * 100).toFixed(0) + '%"></i>'; }).join('') + '</div>' +
      (subs.length ? '<div class="sr-spot-subs">' + subs.map(function (s) { return '<span><i style="background:' + subjColor(s.id) + '"></i>' + E(subjName(s.id)) + '</span>'; }).join('') + '</div>' : '<div class="sr-spot-subs"><span>প্রথম সেশন শুরু করুন</span></div>') + '</div></section>';
  });
})();
