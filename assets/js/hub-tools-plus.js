/* ConceptLab Student Hub — extra study tools v12 (registered through CL_HUBPLUS).
   Mistake Notebook, Eisenhower Matrix, Exam Plan Builder, Marks Needed, Time Blocks, "What next?" picker,
   Feynman Notebook, Cornell Notes, Study Checklists, Sleep Planner, Eye-Rest 20-20-20, Study Journal. */
(function () {
  'use strict';
  var HP = window.CL_HUBPLUS; if (!HP) return;
  var u = HP.u, E = u.E, bd = u.bd;
  function $(id) { return document.getElementById(id); }
  function val(id) { var e = $(id); return e ? String(e.value).trim() : ''; }
  function store(key, def) {
    return { get: function () { var v = u.load('clhp_' + key, null); return v == null ? (typeof def === 'function' ? def() : JSON.parse(JSON.stringify(def))) : v; }, set: function (v) { u.save('clhp_' + key, v); } };
  }
  var SUBJECTS = ['পদার্থবিজ্ঞান', 'রসায়ন', 'উচ্চতর গণিত', 'জীববিজ্ঞান', 'ইংরেজি', 'বাংলা', 'ICT', 'অন্যান্য'];
  function subjectSelect(id, sel) { return '<select id="' + id + '">' + SUBJECTS.map(function (s) { return '<option' + (s === sel ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select>'; }
  function field(label, inner, cls) { return '<label class="sr-field' + (cls ? ' ' + cls : '') + '"><span>' + label + '</span>' + inner + '</label>'; }
  function empty(icon, title, text) { return '<div class="sr-card sr-blank hp-blank"><span aria-hidden="true">' + icon + '</span><h3>' + title + '</h3><p>' + text + '</p></div>'; }
  function guide(title, steps) { return '<details class="hp-guide"><summary>💡 ' + title + '</summary><ol>' + steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></details>'; }
  function tm12(hhmm) { var p = hhmm.split(':'), h = +p[0], m = +p[1]; return u.pad(h % 12 || 12) + ':' + u.pad(m) + (h < 12 ? ' AM' : ' PM'); }
  function mins(hhmm) { var p = String(hhmm).split(':'); return (+p[0]) * 60 + (+p[1] || 0); }
  function hhmm(m) { m = ((m % 1440) + 1440) % 1440; return u.pad(Math.floor(m / 60)) + ':' + u.pad(m % 60); }

  /* =============== 1. Mistake Notebook =============== */
  (function () {
    var S = store('mistakes', []), REASONS = ['ধারণা ভুল', 'হিসাব ভুল', 'প্রশ্ন ভালো করে পড়িনি', 'সূত্র ভুলে গেছি', 'সময় শেষ', 'অসাবধানতা'];
    var fSub = 'all', fState = 'open', review = null, showAnswer = false;
    function render() {
      var all = S.get(), open = all.filter(function (x) { return !x.fixed; }), fixed = all.length - open.length;
      var list = all.filter(function (x) { return (fSub === 'all' || x.sub === fSub) && (fState === 'all' || (fState === 'open' ? !x.fixed : x.fixed)); }).sort(function (a, b) { return b.ts - a.ts; });
      var rc = {}; all.forEach(function (x) { rc[x.reason] = (rc[x.reason] || 0) + 1; });
      var top = Object.keys(rc).sort(function (a, b) { return rc[b] - rc[a]; });
      var stats = '<div class="hp-stats"><div><small>মোট ভুল</small><b>' + bd(all.length) + '</b></div><div><small>এখনও বাকি</small><b>' + bd(open.length) + '</b></div><div><small>শুধরে নিয়েছি</small><b>' + bd(fixed) + '</b></div><div><small>সবচেয়ে বেশি কারণ</small><b class="hp-sm">' + (top[0] ? E(top[0]) : '—') + '</b></div></div>';
      var form = '<section class="hp-card"><h3 class="hp-h">+ নতুন ভুল লিখুন</h3><div class="hp-grid2">' + field('সাবজেক্ট', subjectSelect('mkSub', SUBJECTS[0])) + field('ভুলের কারণ', '<select id="mkReason">' + REASONS.map(function (r) { return '<option>' + r + '</option>'; }).join('') + '</select>') + '</div>' +
        field('প্রশ্ন / টপিক', '<textarea id="mkQ" rows="2" maxlength="400" placeholder="কোন প্রশ্নে ভুল হয়েছিল?"></textarea>') + field('সঠিক সমাধান / শেখার কথা', '<textarea id="mkFix" rows="3" maxlength="600" placeholder="এবার যা মনে রাখবেন"></textarea>') +
        '<button type="button" class="sr-btn sr-go sr-wide" data-a="add">খাতায় যোগ করুন</button></section>';
      var rv = '';
      if (review) {
        var it = all.filter(function (x) { return x.id === review; })[0];
        if (it) rv = '<section class="hp-card hp-review"><div class="hp-row-h"><b>🎲 র‍্যান্ডম রিভিশন</b><button type="button" class="sr-mini" data-a="rvclose">✕ বন্ধ</button></div><p class="hp-meta">' + E(it.sub) + ' · ' + E(it.reason) + '</p><p class="hp-q">' + E(it.q) + '</p>' +
          (showAnswer ? '<div class="hp-ans">' + (E(it.fix) || 'সমাধান লেখা নেই') + '</div><div class="sr-row-btns"><button type="button" class="sr-btn sr-go" data-a="rvok" data-v="' + it.id + '">✓ এবার পারলাম</button><button type="button" class="sr-btn sr-ghost" data-a="rvnext">আবার ভুল → পরেরটি</button></div>' : '<button type="button" class="sr-btn sr-go sr-wide" data-a="rvshow">আগে নিজে ভাবুন → উত্তর দেখুন</button>') + '</section>';
      }
      var filters = '<div class="hp-filters">' + field('সাবজেক্ট', '<select id="mkFSub"><option value="all">সব</option>' + SUBJECTS.map(function (s) { return '<option' + (fSub === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select>') +
        '<div class="sr-range" role="tablist">' + [['open', 'বাকি'], ['fixed', 'শুধরানো'], ['all', 'সব']].map(function (r) { return '<button type="button" class="' + (fState === r[0] ? 'on' : '') + '" data-a="fstate" data-v="' + r[0] + '">' + r[1] + '</button>'; }).join('') + '</div>' +
        '<button type="button" class="sr-btn sr-ghost" data-a="rvstart"' + (open.length ? '' : ' disabled') + '>🎲 র‍্যান্ডম রিভিশন</button></div>';
      var items = list.length ? list.map(function (x) {
        return '<article class="hp-item' + (x.fixed ? ' done' : '') + '"><div class="hp-item-h"><span class="hp-tag">' + E(x.sub) + '</span><span class="hp-tag warn">' + E(x.reason) + '</span><small>' + bd(new Date(x.ts).toLocaleDateString('bn-BD')) + '</small></div><p class="hp-q">' + E(x.q) + '</p>' + (x.fix ? '<div class="hp-ans">' + E(x.fix) + '</div>' : '') +
          '<div class="hp-item-f"><small>সঠিকভাবে পেরেছি: ' + bd(x.ok || 0) + ' বার</small><span><button type="button" class="sr-mini" data-a="toggle" data-v="' + x.id + '">' + (x.fixed ? '↩ আবার খুলুন' : '✓ শুধরে নিয়েছি') + '</button><button type="button" class="sr-x" data-a="del" data-v="' + x.id + '" aria-label="মুছুন">✕</button></span></div></article>';
      }).join('') : empty('📓', 'কিছু নেই', 'ভুল লিখে রাখলে পরীক্ষার আগে সেটাই সবচেয়ে কাজের রিভিশন হয়ে ওঠে।');
      return guide('ভুলের খাতা কীভাবে কাজ করে?', ['প্রতিবার ভুল হলে প্রশ্ন, কারণ ও সঠিক সমাধান লিখুন।', '"র‍্যান্ডম রিভিশন" থেকে নিজেকে পরীক্ষা করুন।', 'দুইবার সঠিক উত্তর দিলে ভুলটি নিজে থেকে "শুধরানো" হয়ে যাবে।']) + stats + '<div class="hp-split">' + '<div>' + form + '</div><div>' + rv + filters + '<div class="hp-list">' + items + '</div></div></div>';
    }
    HP.add({
      id: 'mistakes', icon: '📓', label: 'Mistake Notebook (ভুলের খাতা)', group: 'revise', priority: 50, desc: 'যে ভুলগুলো বারবার হয়—কারণসহ লিখে রাখুন, র‍্যান্ডম রিভিশনে শুধরে নিন।', render: render,
      unmount: function () { review = null; showAnswer = false; },
      click: function (el) {
        var a = el.dataset.a, v = el.dataset.v, all = S.get();
        if (a === 'add') { var q = val('mkQ'); if (!q) { u.toast('প্রশ্ন বা টপিক লিখুন'); return; } all.push({ id: u.uid(), sub: val('mkSub'), reason: val('mkReason'), q: q, fix: val('mkFix'), ts: Date.now(), fixed: false, ok: 0 }); S.set(all); u.toast('খাতায় যোগ হয়েছে ✓'); }
        if (a === 'fstate') fState = v;
        if (a === 'toggle') all.forEach(function (x) { if (x.id === v) { x.fixed = !x.fixed; if (!x.fixed) x.ok = 0; } }), S.set(all);
        if (a === 'del') { if (!confirm('এটি মুছে ফেলবেন?')) return; S.set(all.filter(function (x) { return x.id !== v; })); }
        if (a === 'rvstart' || a === 'rvnext') { var op = all.filter(function (x) { return !x.fixed && x.id !== review; }); if (!op.length) op = all.filter(function (x) { return !x.fixed; }); review = op.length ? op[Math.floor(Math.random() * op.length)].id : null; showAnswer = false; }
        if (a === 'rvshow') showAnswer = true;
        if (a === 'rvclose') review = null;
        if (a === 'rvok') { all.forEach(function (x) { if (x.id === v) { x.ok = (x.ok || 0) + 1; if (x.ok >= 2) { x.fixed = true; u.toast('দারুণ! ভুলটি শুধরে গেছে 🎉'); } } }); S.set(all); review = null; }
        HP.paint();
      },
      change: function (el) { if (el.id === 'mkFSub') { fSub = el.value; HP.paint(); } }
    });
  })();

  /* =============== 2. Eisenhower Matrix =============== */
  (function () {
    var S = store('matrix', []);
    var Q = [{ n: 1, t: 'এখনই করুন', s: 'জরুরি + গুরুত্বপূর্ণ', c: '#fb7185' }, { n: 2, t: 'সময় ঠিক করুন', s: 'গুরুত্বপূর্ণ, জরুরি নয়', c: '#38bdf8' }, { n: 3, t: 'ছোট করে সারুন', s: 'জরুরি, গুরুত্বপূর্ণ নয়', c: '#fbbf24' }, { n: 4, t: 'বাদ দিন', s: 'জরুরিও না, গুরুত্বপূর্ণও না', c: '#94a3b8' }];
    function render() {
      var all = S.get();
      var grid = Q.map(function (q) {
        var items = all.filter(function (x) { return x.q === q.n; });
        return '<section class="hp-quad" style="--c:' + q.c + '"><div class="hp-qh"><b>' + q.t + '</b><small>' + q.s + '</small></div><div class="hp-qlist">' + (items.length ? items.map(function (x) {
          return '<div class="hp-task' + (x.done ? ' done' : '') + '"><button type="button" class="hp-chk' + (x.done ? ' on' : '') + '" data-a="done" data-v="' + x.id + '" aria-label="সম্পন্ন">' + (x.done ? '✓' : '') + '</button><span>' + E(x.t) + '</span><select data-mv="' + x.id + '" aria-label="সরান">' + Q.map(function (z) { return '<option value="' + z.n + '"' + (z.n === x.q ? ' selected' : '') + '>' + z.n + '</option>'; }).join('') + '</select><button type="button" class="sr-x" data-a="del" data-v="' + x.id + '" aria-label="মুছুন">✕</button></div>';
        }).join('') : '<p class="sr-empty">খালি</p>') + '</div></section>';
      }).join('');
      return guide('কীভাবে ব্যবহার করবেন?', ['সব কাজ লিখে ফেলুন, তারপর কোনটি জরুরি ও গুরুত্বপূর্ণ ভাবুন।', 'আগে ১ নম্বর ঘরের কাজ শেষ করুন, ২ নম্বরের জন্য সময় ঠিক করুন।', '৪ নম্বর ঘরের কাজ বাদ দিলে পড়ার সময় বাঁচবে।']) +
        '<section class="hp-card hp-addrow"><input id="mxText" type="text" maxlength="120" placeholder="কাজটি লিখুন, যেমন: Vector অংক শেষ করা" aria-label="কাজ"><select id="mxQ" aria-label="ঘর">' + Q.map(function (q) { return '<option value="' + q.n + '">' + q.n + ' · ' + q.t + '</option>'; }).join('') + '</select><button type="button" class="sr-btn sr-go" data-a="add">+ যোগ</button></section><div class="hp-matrix">' + grid + '</div>' +
        (all.some(function (x) { return x.done; }) ? '<div class="sr-row-btns"><button type="button" class="sr-btn sr-ghost" data-a="clear">সম্পন্নগুলো মুছুন</button></div>' : '');
    }
    HP.add({
      id: 'matrix', icon: '🧭', label: 'Eisenhower Matrix', group: 'organize', priority: 40, desc: 'কোন কাজ আগে? জরুরি ও গুরুত্বপূর্ণ ভেদে চারটি ঘরে সাজিয়ে অগ্রাধিকার ঠিক করুন।', render: render,
      click: function (el) {
        var a = el.dataset.a, v = el.dataset.v, all = S.get();
        if (a === 'add') { var t = val('mxText'); if (!t) { u.toast('কাজের নাম লিখুন'); return; } all.push({ id: u.uid(), t: t, q: +val('mxQ'), done: false }); S.set(all); }
        if (a === 'done') all.forEach(function (x) { if (x.id === v) x.done = !x.done; }), S.set(all);
        if (a === 'del') S.set(all.filter(function (x) { return x.id !== v; }));
        if (a === 'clear') S.set(all.filter(function (x) { return !x.done; }));
        HP.paint();
      },
      change: function (el) { if (el.dataset.mv) { var all = S.get(); all.forEach(function (x) { if (x.id === el.dataset.mv) x.q = +el.value; }); S.set(all); HP.paint(); } },
      key: function (e, el) { if (e.key === 'Enter' && el.id === 'mxText') { e.preventDefault(); this.click({ dataset: { a: 'add' } }); } }
    });
  })();

  /* =============== 3. Exam Plan Builder =============== */
  (function () {
    var S = store('examplan', function () { var d = new Date(); d.setDate(d.getDate() + 30); return { date: u.dayKey(d), hours: 4, buffer: 2, subs: [{ n: 'পদার্থবিজ্ঞান', ch: 10, d: 3 }, { n: 'রসায়ন', ch: 8, d: 2 }, { n: 'উচ্চতর গণিত', ch: 10, d: 3 }] }; });
    var showAll = false;
    function plan(c) {
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var ex = new Date(c.date + 'T00:00:00'), left = Math.round((ex - today) / 86400000);
      if (!c.date || isNaN(left) || left < 1) return { err: 'পরীক্ষার তারিখ আজকের পরে হতে হবে।' };
      var study = Math.max(1, left - Math.min(c.buffer, left - 1)), subs = c.subs.filter(function (s) { return s.n && s.ch > 0; });
      if (!subs.length) return { err: 'অন্তত একটি সাবজেক্ট ও অধ্যায় সংখ্যা দিন।' };
      var wsum = subs.reduce(function (n, s) { return n + s.ch * s.d; }, 0), totalH = study * c.hours;
      var rows = subs.map(function (s) { var h = totalH * (s.ch * s.d) / wsum; return { n: s.n, ch: s.ch, h: h, perCh: h / s.ch, rem: Math.round(h * 2) / 2 }; });
      var days = [], rem = {}; rows.forEach(function (r) { rem[r.n] = r.h; });
      for (var i = 0; i < study; i++) {
        var dt = new Date(today), slots = [], left2 = c.hours; dt.setDate(dt.getDate() + i);
        while (left2 > 0) { var step = Math.min(1, left2), best = null; rows.forEach(function (r) { if (!best || rem[r.n] > rem[best.n]) best = r; }); if (!best || rem[best.n] <= 0) break; slots.push(best.n); rem[best.n] -= step; left2 -= step; }
        var agg = {}; slots.forEach(function (n) { agg[n] = (agg[n] || 0) + 1; });
        days.push({ d: dt, agg: agg });
      }
      return { left: left, study: study, rows: rows, days: days, totalH: totalH };
    }
    function render() {
      var c = S.get(), p = plan(c);
      var form = '<section class="hp-card"><h3 class="hp-h">১. পরীক্ষার তথ্য</h3><div class="hp-grid3">' + field('পরীক্ষার তারিখ', '<input id="epDate" type="date" value="' + E(c.date) + '">') + field('প্রতিদিন পড়ার ঘণ্টা', '<input id="epHours" type="number" min="1" max="16" step="0.5" inputmode="decimal" value="' + c.hours + '">') + field('শেষ রিভিশনের দিন', '<input id="epBuf" type="number" min="0" max="14" inputmode="numeric" value="' + c.buffer + '">') + '</div>' +
        '<h3 class="hp-h">২. সাবজেক্ট</h3><div class="hp-subs">' + c.subs.map(function (s, i) { return '<div class="hp-subrow"><input type="text" data-ep="n" data-i="' + i + '" value="' + E(s.n) + '" placeholder="সাবজেক্ট" aria-label="সাবজেক্ট"><input type="number" data-ep="ch" data-i="' + i + '" min="1" max="99" inputmode="numeric" value="' + s.ch + '" aria-label="অধ্যায়"><select data-ep="d" data-i="' + i + '" aria-label="কঠিনতা">' + [[1, 'সহজ'], [2, 'মাঝারি'], [3, 'কঠিন']].map(function (z) { return '<option value="' + z[0] + '"' + (s.d === z[0] ? ' selected' : '') + '>' + z[1] + '</option>'; }).join('') + '</select><button type="button" class="sr-x" data-a="rmsub" data-v="' + i + '" aria-label="মুছুন">✕</button></div>'; }).join('') + '</div><small class="hp-hint">কলাম: সাবজেক্ট · অধ্যায় সংখ্যা · কঠিনতা</small>' +
        '<div class="sr-row-btns"><button type="button" class="sr-btn sr-ghost" data-a="addsub">+ সাবজেক্ট</button><button type="button" class="sr-btn sr-go" data-a="calc">প্ল্যান তৈরি করুন</button></div></section>';
      var out = '';
      if (p.err) out = '<p class="tk-warn hp-warn">' + E(p.err) + '</p>';
      else {
        out = '<section class="hp-card"><h3 class="hp-h">আপনার প্ল্যান</h3><div class="hp-stats"><div><small>বাকি দিন</small><b>' + bd(p.left) + '</b></div><div><small>পড়ার দিন</small><b>' + bd(p.study) + '</b></div><div><small>মোট ঘণ্টা</small><b>' + bd(Math.round(p.totalH)) + '</b></div><div><small>রিভিশন দিন</small><b>' + bd(p.left - p.study) + '</b></div></div>' +
          '<div class="hp-table">' + p.rows.map(function (r) { return '<div class="hp-trow"><b>' + E(r.n) + '</b><span>' + bd(Math.round(r.h * 10) / 10) + ' ঘণ্টা</span><span>অধ্যায়প্রতি ≈ ' + bd(Math.round(r.perCh * 60)) + ' মি</span></div>'; }).join('') + '</div>' +
          '<h4 class="hp-h2">দিনভিত্তিক রুটিন</h4><div class="hp-days">' + p.days.slice(0, showAll ? 999 : 10).map(function (x) { return '<div class="hp-day"><b>' + bd(x.d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', weekday: 'short' })) + '</b><span>' + Object.keys(x.agg).map(function (n) { return '<i>' + E(n) + ' · ' + bd(x.agg[n]) + 'ঘ</i>'; }).join('') + '</span></div>'; }).join('') + '</div>' +
          (p.days.length > 10 ? '<button type="button" class="sr-btn sr-ghost sr-wide" data-a="all">' + (showAll ? 'কম দেখান' : 'সব ' + bd(p.days.length) + ' দিন দেখুন') + '</button>' : '') + (p.left - p.study ? '<p class="sr-note">শেষ ' + bd(p.left - p.study) + ' দিন শুধু রিভিশন ও মডেল টেস্টের জন্য রাখা হয়েছে।</p>' : '') + '<div class="sr-row-btns"><button type="button" class="sr-btn sr-ghost" data-a="copy">📋 প্ল্যান কপি করুন</button></div></section>';
      }
      return guide('কীভাবে কাজ করে?', ['পরীক্ষার তারিখ ও প্রতিদিন কত ঘণ্টা পড়তে পারবেন দিন।', 'সাবজেক্ট, অধ্যায় সংখ্যা ও কঠিনতা দিন—কঠিন ও বড় সাবজেক্ট বেশি সময় পাবে।', 'শেষ কয়েকদিন রিভিশনের জন্য আলাদা রাখা হয়।']) + '<div class="hp-split">' + form + '<div>' + out + '</div></div>';
    }
    function readForm() {
      var c = S.get(); c.date = val('epDate') || c.date; c.hours = Math.max(1, Math.min(16, parseFloat(val('epHours')) || c.hours)); c.buffer = Math.max(0, Math.min(14, parseInt(val('epBuf'), 10) || 0));
      document.querySelectorAll('[data-ep]').forEach(function (e) { var i = +e.dataset.i, k = e.dataset.ep; if (!c.subs[i]) return; c.subs[i][k] = k === 'n' ? e.value.trim() : Math.max(1, parseInt(e.value, 10) || 1); });
      S.set(c); return c;
    }
    HP.add({
      id: 'exam-plan', icon: '🗓️', label: 'Exam Plan Builder', group: 'organize', priority: 45, desc: 'পরীক্ষার তারিখ, সাবজেক্ট ও অধ্যায় দিন—দিনভিত্তিক রিভিশন রুটিন নিজে থেকে তৈরি হবে।', render: render,
      click: function (el) {
        var a = el.dataset.a, c = readForm();
        if (a === 'addsub') { c.subs.push({ n: '', ch: 5, d: 2 }); S.set(c); }
        if (a === 'rmsub') { c.subs.splice(+el.dataset.v, 1); S.set(c); }
        if (a === 'all') showAll = !showAll;
        if (a === 'copy') { var p = plan(c); if (p.err) return u.toast(p.err); u.copy('পরীক্ষা পর্যন্ত ' + p.left + ' দিন\n' + p.rows.map(function (r) { return '• ' + r.n + ': ' + (Math.round(r.h * 10) / 10) + ' ঘণ্টা'; }).join('\n') + '\n\n' + p.days.map(function (x) { return u.dayKey(x.d) + ': ' + Object.keys(x.agg).map(function (n) { return n + ' ' + x.agg[n] + 'ঘ'; }).join(', '); }).join('\n')); return; }
        HP.paint();
      },
      change: function (el) { if (el.id === 'epDate' || el.id === 'epHours' || el.id === 'epBuf' || el.dataset.ep) { readForm(); } }
    });
  })();

  /* =============== 4. Marks Needed =============== */
  (function () {
    var S = store('marks', { target: 80, rows: [{ n: 'ক্লাস টেস্ট', w: 20, s: 75 }, { n: 'মডেল টেস্ট', w: 30, s: 70 }] });
    function grade(p) { return p >= 80 ? ['A+', '5.00'] : p >= 70 ? ['A', '4.00'] : p >= 60 ? ['A-', '3.50'] : p >= 50 ? ['B', '3.00'] : p >= 40 ? ['C', '2.00'] : p >= 33 ? ['D', '1.00'] : ['F', '0.00']; }
    function calc(c) {
      var done = c.rows.reduce(function (n, r) { return n + r.w; }, 0), got = c.rows.reduce(function (n, r) { return n + r.w * r.s / 100; }, 0), rem = 100 - done;
      if (done > 100) return { err: 'ওজনের যোগফল ১০০%-এর বেশি হতে পারে না।' };
      if (rem <= 0) return { err: 'বাকি কোনো অংশ নেই। চূড়ান্ত ফল: ' + (Math.round(got * 10) / 10) + '%', final: got };
      var need = (c.target - got) / rem * 100; return { done: done, got: got, rem: rem, need: need };
    }
    function render() {
      var c = S.get(), r = calc(c), rows = c.rows.map(function (x, i) { return '<div class="hp-subrow"><input type="text" data-mk="n" data-i="' + i + '" value="' + E(x.n) + '" aria-label="অংশ"><input type="number" data-mk="w" data-i="' + i + '" min="0" max="100" inputmode="decimal" value="' + x.w + '" aria-label="ওজন %"><input type="number" data-mk="s" data-i="' + i + '" min="0" max="100" inputmode="decimal" value="' + x.s + '" aria-label="প্রাপ্ত %"><button type="button" class="sr-x" data-a="rm" data-v="' + i + '" aria-label="মুছুন">✕</button></div>'; }).join('');
      var res;
      if (r.err) res = '<p class="tk-warn hp-warn">' + E(r.err) + '</p>';
      else {
        var need = r.need, ok = need <= 100, g = grade(c.target);
        res = '<div class="hp-result ' + (need <= 0 ? 'good' : ok ? '' : 'bad') + '"><small>বাকি ' + bd(r.rem) + '% অংশে দরকার</small><b>' + (need <= 0 ? 'আর কিছু লাগবে না 🎉' : bd(Math.round(need * 10) / 10) + '%') + '</b><p>' + (need <= 0 ? 'এখনই লক্ষ্য ছুঁয়ে ফেলেছেন।' : ok ? 'লক্ষ্য ' + bd(c.target) + '% = গ্রেড ' + g[0] + ' (GPA ' + bd(g[1]) + ')। এই নম্বর তুললেই হবে।' : 'লক্ষ্য ছোঁয়া সম্ভব নয় (১০০%-এর বেশি লাগছে)। লক্ষ্য কমিয়ে দেখুন।') + '</p></div><div class="hp-stats"><div><small>এখন পর্যন্ত অর্জিত</small><b>' + bd(Math.round(r.got * 10) / 10) + '%</b></div><div><small>শেষ হয়েছে</small><b>' + bd(r.done) + '%</b></div></div>';
      }
      return guide('কীভাবে ব্যবহার করবেন?', ['লক্ষ্য শতকরা নম্বর দিন (যেমন A+ এর জন্য ৮০)।', 'যে অংশগুলো শেষ—তার ওজন (মোট নম্বরের কত %) ও প্রাপ্ত % দিন।', 'বাকি অংশে কত % তুলতে হবে তা দেখুন।']) + '<div class="hp-split"><section class="hp-card">' + field('লক্ষ্য (মোট %)', '<input id="mnTarget" type="number" min="0" max="100" inputmode="decimal" value="' + c.target + '">') + '<h3 class="hp-h">শেষ হওয়া অংশ</h3><div class="hp-subs">' + rows + '</div><small class="hp-hint">কলাম: নাম · ওজন % · প্রাপ্ত %</small><div class="sr-row-btns"><button type="button" class="sr-btn sr-ghost" data-a="add">+ অংশ যোগ</button></div></section><section class="hp-card">' + res + '<div class="hp-grade"><b>HSC গ্রেড স্কেল</b>' + [['80+', 'A+', '5.00'], ['70+', 'A', '4.00'], ['60+', 'A-', '3.50'], ['50+', 'B', '3.00'], ['40+', 'C', '2.00'], ['33+', 'D', '1.00']].map(function (g) { return '<span>' + bd(g[0]) + ' → ' + g[1] + ' (' + bd(g[2]) + ')</span>'; }).join('') + '</div></section></div>';
    }
    function read() { var c = S.get(); c.target = Math.max(0, Math.min(100, parseFloat(val('mnTarget')))) || 0; document.querySelectorAll('[data-mk]').forEach(function (e) { var i = +e.dataset.i, k = e.dataset.mk; if (!c.rows[i]) return; c.rows[i][k] = k === 'n' ? e.value : Math.max(0, Math.min(100, parseFloat(e.value) || 0)); }); S.set(c); return c; }
    HP.add({
      id: 'marks-needed', icon: '🎯', label: 'Marks Needed Calculator', group: 'tools', priority: 30, desc: 'লক্ষ্য গ্রেডের জন্য বাকি পরীক্ষায় কত শতাংশ নম্বর তুলতে হবে—হিসাব করে দেয়।', render: render,
      click: function (el) { var c = read(); if (el.dataset.a === 'add') { c.rows.push({ n: 'নতুন অংশ', w: 10, s: 70 }); S.set(c); } if (el.dataset.a === 'rm') { c.rows.splice(+el.dataset.v, 1); S.set(c); } HP.paint(); },
      change: function () { read(); HP.paint(); }
    });
  })();

  /* =============== 5. Time Blocks =============== */
  (function () {
    var S = store('blocks', { items: [], done: {} }), TPL = [['প্রাতঃকালীন পড়া', '06:00', '07:30'], ['স্কুল / কোচিং', '08:00', '13:00'], ['বিকেলের পড়া', '16:00', '18:00'], ['সন্ধ্যার রিভিশন', '19:30', '21:30']];
    var COL = ['#38bdf8', '#a78bfa', '#34d399', '#fbbf24', '#fb7185', '#22d3ee'];
    function render() {
      var c = S.get(), tk = u.dayKey(new Date()), dn = c.done[tk] || [], items = c.items.slice().sort(function (a, b) { return mins(a.s) - mins(b.s); });
      var total = items.reduce(function (n, x) { return n + Math.max(0, mins(x.e) - mins(x.s)); }, 0), overlap = items.some(function (x, i) { return i && mins(x.s) < mins(items[i - 1].e); });
      var tl = items.length ? items.map(function (x, i) {
        var col = COL[i % COL.length], isDone = dn.indexOf(x.id) >= 0, nowM = new Date().getHours() * 60 + new Date().getMinutes(), live = mins(x.s) <= nowM && nowM < mins(x.e);
        return '<article class="hp-block' + (isDone ? ' done' : '') + (live ? ' live' : '') + '" style="--c:' + col + '"><button type="button" class="hp-chk' + (isDone ? ' on' : '') + '" data-a="done" data-v="' + x.id + '" aria-label="সম্পন্ন">' + (isDone ? '✓' : '') + '</button><div class="hp-block-m"><b>' + E(x.l) + '</b><small>' + tm12(x.s) + ' – ' + tm12(x.e) + ' · ' + u.dur((mins(x.e) - mins(x.s)) * 60) + (live ? ' · <em>এখন চলছে</em>' : '') + '</small></div><button type="button" class="sr-x" data-a="del" data-v="' + x.id + '" aria-label="মুছুন">✕</button></article>';
      }).join('') : empty('⏰', 'আজকের ব্লক খালি', 'নিচের ফর্ম বা টেমপ্লেট দিয়ে দিনের সময় ভাগ করুন।');
      return '<div class="hp-split"><section class="hp-card"><h3 class="hp-h">+ নতুন ব্লক</h3>' + field('কাজের নাম', '<input id="tbLabel" type="text" maxlength="60" placeholder="যেমন: পদার্থবিজ্ঞান — Vector">') + '<div class="hp-grid2">' + field('শুরু', '<input id="tbS" type="time" value="17:00">') + field('শেষ', '<input id="tbE" type="time" value="18:30">') + '</div><button type="button" class="sr-btn sr-go sr-wide" data-a="add">ব্লক যোগ করুন</button>' +
        '<h4 class="hp-h2">দ্রুত টেমপ্লেট</h4><div class="hp-tpl">' + TPL.map(function (t, i) { return '<button type="button" class="sr-mini" data-a="tpl" data-v="' + i + '">' + t[0] + '</button>'; }).join('') + '</div></section>' +
        '<div><div class="hp-stats"><div><small>মোট ব্লক সময়</small><b>' + u.dur(total * 60) + '</b></div><div><small>ব্লক</small><b>' + bd(items.length) + 'টি</b></div><div><small>আজ সম্পন্ন</small><b>' + bd(dn.filter(function (id) { return items.some(function (x) { return x.id === id; }); }).length) + '/' + bd(items.length) + '</b></div></div>' + (overlap ? '<p class="tk-warn hp-warn">কিছু ব্লকের সময় একে অপরের সাথে মিলে যাচ্ছে।</p>' : '') + '<div class="hp-list">' + tl + '</div>' + (items.length ? '<div class="sr-row-btns"><button type="button" class="sr-btn sr-ghost" data-a="clear">সব ব্লক মুছুন</button></div>' : '') + '</div></div>';
    }
    HP.add({
      id: 'time-blocks', icon: '⏰', label: 'Time Blocks (দিনের সময়সূচি)', group: 'plan', priority: 35, desc: 'দিনের সময় ব্লকে ভাগ করুন, প্রতিদিন সম্পন্ন ব্লক টিক দিন।', render: render,
      click: function (el) {
        var a = el.dataset.a, v = el.dataset.v, c = S.get(), tk = u.dayKey(new Date());
        if (a === 'add') { var l = val('tbLabel'), s = val('tbS'), e = val('tbE'); if (!l || !s || !e) return u.toast('নাম ও সময় দিন'); if (mins(e) <= mins(s)) return u.toast('শেষের সময় শুরুর পরে হতে হবে'); c.items.push({ id: u.uid(), l: l, s: s, e: e }); }
        if (a === 'tpl') { var t = TPL[+v]; c.items.push({ id: u.uid(), l: t[0], s: t[1], e: t[2] }); }
        if (a === 'del') c.items = c.items.filter(function (x) { return x.id !== v; });
        if (a === 'done') { var d = c.done[tk] || []; var i = d.indexOf(v); if (i >= 0) d.splice(i, 1); else d.push(v); c.done = {}; c.done[tk] = d; }
        if (a === 'clear') { if (!confirm('সব ব্লক মুছে ফেলবেন?')) return; c.items = []; }
        S.set(c); HP.paint();
      }
    });
  })();

  /* =============== 6. What to study next =============== */
  (function () {
    var spin = null;
    function data() {
      var D = u.load('clroom_v1', null), subs = (D && D.subjects) || [{ id: 'x1', name: 'পদার্থবিজ্ঞান', icon: '⚛️', color: '#38bdf8', goal: 0 }, { id: 'x2', name: 'রসায়ন', icon: '🧪', color: '#34d399', goal: 0 }, { id: 'x3', name: 'উচ্চতর গণিত', icon: '📐', color: '#a78bfa', goal: 0 }];
      var from = Date.now() - 7 * 86400000, m = {}; ((D && D.sessions) || []).forEach(function (s) { if (s.start >= from) m[s.sid] = (m[s.sid] || 0) + s.secs; });
      return subs.map(function (s) { var secs = m[s.id] || 0; return { id: s.id, name: s.name, icon: s.icon, color: s.color, secs: secs, w: 1 / (1 + secs / 3600) }; }).sort(function (a, b) { return a.secs - b.secs; });
    }
    function render() {
      var rows = data(), mx = Math.max.apply(null, rows.map(function (r) { return r.secs; }).concat([1])), pick = spin ? rows.filter(function (r) { return r.id === spin; })[0] : rows[0];
      return '<section class="hp-card hp-pick" style="--c:' + (pick ? pick.color : '#38bdf8') + '"><small>' + (spin ? 'র‍্যান্ডম পছন্দ' : 'আপনার জন্য সুপারিশ') + '</small><div class="hp-pick-n no-mono"><span>' + E(pick ? pick.icon : '📚') + '</span><b id="nxName">' + E(pick ? pick.name : '—') + '</b></div><p>' + (spin ? 'ভাগ্য যা বলল!' : 'গত ৭ দিনে এটিতে সবচেয়ে কম সময় গেছে।') + ' এখন ২৫ মিনিট দিয়ে শুরু করুন।</p><div class="sr-row-btns"><button type="button" class="sr-btn sr-go" data-a="go" data-v="' + (pick ? pick.id : '') + '">▶ Study Room-এ শুরু করুন</button><button type="button" class="sr-btn sr-ghost" data-a="spin">🎲 ঘুরিয়ে দেখুন</button>' + (spin ? '<button type="button" class="sr-btn sr-ghost" data-a="reset">সুপারিশে ফিরুন</button>' : '') + '</div></section>' +
        '<section class="hp-card"><h3 class="hp-h">গত ৭ দিনে কোন সাবজেক্টে কত সময়</h3><div class="hp-bars">' + rows.map(function (r) { return '<div class="hp-barrow"><span class="no-mono">' + E(r.icon) + ' ' + E(r.name) + '</span><div class="sr-bar sm"><i style="width:' + Math.max(2, r.secs / mx * 100).toFixed(0) + '%;background:' + r.color + '"></i></div><b>' + u.dur(r.secs) + '</b></div>'; }).join('') + '</div><p class="sr-note">Study Room-এ টাইমার চালালে এই সুপারিশ আরও নিখুঁত হবে।</p></section>';
    }
    HP.add({
      id: 'next-up', icon: '🎲', label: 'এখন কী পড়ব?', group: 'focus', priority: 90, desc: 'কোন সাবজেক্ট পড়বেন ঠিক করতে পারছেন না? Study Room-এর হিসাব দেখে সবচেয়ে অবহেলিত সাবজেক্ট বেছে দেয়।', render: render,
      click: function (el) {
        var a = el.dataset.a, rows = data();
        if (a === 'reset') spin = null;
        if (a === 'spin') { var t = rows.reduce(function (n, r) { return n + r.w; }, 0), x = Math.random() * t, ch = rows[0]; for (var i = 0; i < rows.length; i++) { x -= rows[i].w; if (x <= 0) { ch = rows[i]; break; } } spin = ch.id; }
        if (a === 'go') { var D = u.load('clroom_v1', null); if (D && el.dataset.v) { D.sel = el.dataset.v; u.save('clroom_v1', D); } location.hash = '#/hub/study-room'; return; }
        HP.paint();
      }
    });
  })();

  /* =============== 7. Feynman Notebook =============== */
  (function () {
    var S = store('feynman', []);
    function render() {
      var all = S.get().sort(function (a, b) { return b.ts - a.ts; });
      return guide('ফাইনম্যান পদ্ধতি', ['টপিকের নাম লিখুন।', 'এমনভাবে ব্যাখ্যা করুন যেন ক্লাস ফাইভের কাউকে বোঝাচ্ছেন।', 'যেখানে আটকে গেলেন—সেটাই আপনার ফাঁক। বই দেখে ফাঁক পূরণ করুন।', 'আরও সহজ ভাষায় আবার লিখুন।']) + '<div class="hp-split"><section class="hp-card">' + field('১. টপিক', '<input id="fyT" type="text" maxlength="100" placeholder="যেমন: নিউটনের দ্বিতীয় সূত্র">') + field('২. নিজের ভাষায় ব্যাখ্যা', '<textarea id="fyE" rows="4" maxlength="1200"></textarea>') + field('৩. কোথায় আটকে গেলাম?', '<textarea id="fyG" rows="2" maxlength="600"></textarea>') + field('৪. আরও সহজ করে লিখলাম', '<textarea id="fyS" rows="3" maxlength="1200"></textarea>') + '<button type="button" class="sr-btn sr-go sr-wide" data-a="add">সংরক্ষণ করুন</button></section><div class="hp-list">' +
        (all.length ? all.map(function (x) { return '<details class="hp-card hp-fold"><summary><b>' + E(x.t) + '</b><small>' + bd(new Date(x.ts).toLocaleDateString('bn-BD')) + '</small></summary>' + (x.e ? '<h5>নিজের ব্যাখ্যা</h5><p>' + E(x.e) + '</p>' : '') + (x.g ? '<h5>ফাঁক</h5><p>' + E(x.g) + '</p>' : '') + (x.s ? '<h5>সহজ ব্যাখ্যা</h5><p>' + E(x.s) + '</p>' : '') + '<button type="button" class="sr-mini" data-a="del" data-v="' + x.id + '">🗑 মুছুন</button></details>'; }).join('') : empty('🧠', 'এখনও কিছু নেই', 'কোনো টপিক সহজ ভাষায় বোঝাতে পারলে তবেই আসল শেখা।')) + '</div></div>';
    }
    HP.add({
      id: 'feynman', icon: '🧠', label: 'Feynman Notebook', group: 'revise', priority: 40, desc: 'টপিক সহজ ভাষায় ব্যাখ্যা করে নিজের ফাঁকগুলো ধরুন—সবচেয়ে কার্যকর শেখার কৌশল।', render: render,
      click: function (el) {
        var all = S.get();
        if (el.dataset.a === 'add') { var t = val('fyT'); if (!t) return u.toast('টপিকের নাম লিখুন'); all.push({ id: u.uid(), t: t, e: val('fyE'), g: val('fyG'), s: val('fyS'), ts: Date.now() }); S.set(all); u.toast('সংরক্ষিত ✓'); }
        if (el.dataset.a === 'del' && confirm('মুছে ফেলবেন?')) S.set(all.filter(function (x) { return x.id !== el.dataset.v; }));
        HP.paint();
      }
    });
  })();

  /* =============== 8. Cornell Notes =============== */
  (function () {
    var S = store('cornell', []), open = null;
    function render() {
      var all = S.get().sort(function (a, b) { return b.ts - a.ts; }), cur = open ? all.filter(function (x) { return x.id === open; })[0] : null, n = cur || { t: '', sub: SUBJECTS[0], cue: '', note: '', sum: '' };
      var form = '<section class="hp-card hp-cornell"><div class="hp-grid2">' + field('শিরোনাম', '<input id="cnT" type="text" maxlength="100" value="' + E(n.t) + '">') + field('সাবজেক্ট', subjectSelect('cnSub', n.sub)) + '</div><div class="hp-cn-grid">' + field('🔑 কিওয়ার্ড / প্রশ্ন', '<textarea id="cnC" rows="8" maxlength="800">' + E(n.cue) + '</textarea>', 'hp-cn-cue') + field('📝 নোট', '<textarea id="cnN" rows="8" maxlength="3000">' + E(n.note) + '</textarea>', 'hp-cn-note') + '</div>' + field('📌 সারাংশ (২-৩ লাইনে)', '<textarea id="cnS" rows="2" maxlength="500">' + E(n.sum) + '</textarea>') + '<div class="sr-row-btns"><button type="button" class="sr-btn sr-go" data-a="save">' + (cur ? 'আপডেট করুন' : 'সংরক্ষণ করুন') + '</button>' + (cur ? '<button type="button" class="sr-btn sr-ghost" data-a="new">+ নতুন নোট</button>' : '') + '</div></section>';
      return guide('কর্নেল নোট কী?', ['ডান পাশে ক্লাসের মূল নোট লিখুন।', 'বাম পাশে কিওয়ার্ড বা সম্ভাব্য প্রশ্ন লিখুন।', 'নিচে নিজের ভাষায় সারাংশ লিখুন—পরীক্ষার আগে শুধু বাম দিক ও সারাংশ দেখুন।']) + '<div class="hp-split hp-wide-first">' + form + '<div class="hp-list">' + (all.length ? all.map(function (x) { return '<article class="hp-item' + (open === x.id ? ' sel' : '') + '"><div class="hp-item-h"><span class="hp-tag">' + E(x.sub) + '</span><small>' + bd(new Date(x.ts).toLocaleDateString('bn-BD')) + '</small></div><p class="hp-q"><b>' + E(x.t || 'শিরোনামহীন') + '</b></p>' + (x.sum ? '<p class="hp-meta">' + E(x.sum) + '</p>' : '') + '<div class="hp-item-f"><span><button type="button" class="sr-mini" data-a="open" data-v="' + x.id + '">✎ খুলুন</button><button type="button" class="sr-mini" data-a="cp" data-v="' + x.id + '">📋 কপি</button></span><button type="button" class="sr-x" data-a="del" data-v="' + x.id + '" aria-label="মুছুন">✕</button></div></article>'; }).join('') : empty('🗒️', 'কোনো নোট নেই', 'প্রথম কর্নেল নোটটি লিখে ফেলুন।')) + '</div></div>';
    }
    HP.add({
      id: 'cornell', icon: '🗒️', label: 'Cornell Notes', group: 'revise', priority: 38, desc: 'কিওয়ার্ড, নোট ও সারাংশ—তিন ভাগে গোছানো নোট; রিভিশনের সময় অর্ধেক সময় বাঁচে।', render: render,
      click: function (el) {
        var a = el.dataset.a, v = el.dataset.v, all = S.get();
        if (a === 'save') { var t = val('cnT'), note = val('cnN'); if (!t && !note) return u.toast('শিরোনাম বা নোট লিখুন'); var o = { t: t, sub: val('cnSub'), cue: val('cnC'), note: note, sum: val('cnS'), ts: Date.now() }; if (open) all.forEach(function (x) { if (x.id === open) Object.assign(x, o); }); else { o.id = u.uid(); all.push(o); open = o.id; } S.set(all); u.toast('সংরক্ষিত ✓'); }
        if (a === 'new') open = null;
        if (a === 'open') { open = v; window.scrollTo({ top: 0, behavior: 'smooth' }); }
        if (a === 'del' && confirm('নোটটি মুছবেন?')) { S.set(all.filter(function (x) { return x.id !== v; })); if (open === v) open = null; }
        if (a === 'cp') { var x = all.filter(function (z) { return z.id === v; })[0]; if (x) return u.copy(x.t + ' [' + x.sub + ']\n\nকিওয়ার্ড:\n' + x.cue + '\n\nনোট:\n' + x.note + '\n\nসারাংশ:\n' + x.sum); }
        HP.paint();
      },
      unmount: function () { open = null; }
    });
  })();

  /* =============== 9. Checklists =============== */
  (function () {
    var LISTS = {
      exam: ['প্রবেশপত্র (Admit Card)', 'পরিচয়পত্র / রেজিস্ট্রেশন কার্ড', 'কমপক্ষে ৩টি কালো/নীল কলম', 'পেন্সিল, কাটার ও ইরেজার', 'স্কেল ও জ্যামিতি বক্স', 'অনুমোদিত ক্যালকুলেটর (ব্যাটারি ঠিক আছে?)', 'হাতঘড়ি', 'পানির বোতল', 'কেন্দ্রের ঠিকানা ও যাওয়ার পথ দেখা', 'পরীক্ষার ১ ঘণ্টা আগে পৌঁছানোর পরিকল্পনা'],
      ritual: ['ফোন সাইলেন্ট / অন্য ঘরে রাখলাম', 'পানি ও হালকা নাশতা এনেছি', 'টেবিল গুছিয়েছি', 'আজকের লক্ষ্য একটি লাইনে লিখেছি', 'টাইমার সেট করেছি', 'দরকারি বই ও খাতা হাতের কাছে'],
      night: ['কাল কোন কোন পরীক্ষা—আবার দেখেছি', 'ব্যাগ গুছিয়েছি', 'শুধু সারসংক্ষেপ ও সূত্র রিভিশন করেছি', 'নতুন কিছু পড়া শুরু করছি না', 'ঘুমানোর সময় ঠিক করেছি (৭–৮ ঘণ্টা)', 'অ্যালার্ম দিয়েছি']
    }, NAMES = { exam: '🎒 পরীক্ষার ব্যাগ', ritual: '🧘 পড়া শুরুর আগে', night: '🌙 পরীক্ষার আগের রাত' };
    var S = store('checklists', { cur: 'exam', checked: {}, extra: {} });
    function items(c, k) { return LISTS[k].concat(c.extra[k] || []); }
    function render() {
      var c = S.get(), k = c.cur, list = items(c, k), ch = c.checked[k] || [], n = list.filter(function (x) { return ch.indexOf(x) >= 0; }).length;
      return '<div class="sr-tabs hp-tabs3" role="tablist">' + Object.keys(NAMES).map(function (id) { return '<button type="button" role="tab" aria-selected="' + (k === id) + '" class="sr-tab' + (k === id ? ' on' : '') + '" data-a="list" data-v="' + id + '"><b>' + NAMES[id] + '</b></button>'; }).join('') + '</div>' +
        '<section class="hp-card"><div class="hp-row-h"><b>' + bd(n) + ' / ' + bd(list.length) + ' সম্পন্ন</b><button type="button" class="sr-mini" data-a="reset">↺ রিসেট</button></div><div class="sr-bar"><i style="width:' + (list.length ? n / list.length * 100 : 0).toFixed(0) + '%"></i></div><div class="hp-checks">' + list.map(function (x, i) { var on = ch.indexOf(x) >= 0; return '<label class="hp-check' + (on ? ' on' : '') + '"><input type="checkbox" data-i="' + i + '"' + (on ? ' checked' : '') + '><span class="hp-box" aria-hidden="true">' + (on ? '✓' : '') + '</span><span>' + E(x) + '</span></label>'; }).join('') + '</div><div class="hp-addrow"><input id="clNew" type="text" maxlength="80" placeholder="নিজের আইটেম যোগ করুন" aria-label="নতুন আইটেম"><button type="button" class="sr-btn sr-ghost" data-a="add">+ যোগ</button></div>' + (n === list.length && list.length ? '<p class="hp-done">সব প্রস্তুত! শুভকামনা 🎉</p>' : '') + '</section>';
    }
    HP.add({
      id: 'checklists', icon: '✅', label: 'Study Checklists', group: 'organize', priority: 30, desc: 'পরীক্ষার ব্যাগ, পড়া শুরুর আগে ও পরীক্ষার আগের রাতের চেকলিস্ট—কিছু ভুলবেন না।', render: render,
      click: function (el) {
        var c = S.get(), a = el.dataset.a;
        if (a === 'list') c.cur = el.dataset.v;
        if (a === 'reset') c.checked[c.cur] = [];
        if (a === 'add') { var t = val('clNew'); if (!t) return; (c.extra[c.cur] = c.extra[c.cur] || []).push(t); }
        S.set(c); HP.paint();
      },
      change: function (el) { if (el.type === 'checkbox') { var c = S.get(), list = items(c, c.cur), it = list[+el.dataset.i], ch = c.checked[c.cur] = c.checked[c.cur] || [], i = ch.indexOf(it); if (el.checked && i < 0) ch.push(it); if (!el.checked && i >= 0) ch.splice(i, 1); S.set(c); HP.paint(); } },
      key: function (e, el) { if (e.key === 'Enter' && el.id === 'clNew') { e.preventDefault(); this.click({ dataset: { a: 'add' } }); } }
    });
  })();

  /* =============== 10. Sleep Planner =============== */
  (function () {
    var st = { mode: 'wake', t: '06:00' };
    function render() {
      var base = mins(st.t), out = [];
      if (st.mode === 'wake') [6, 5, 4].forEach(function (cy) { out.push({ cy: cy, time: hhmm(base - cy * 90 - 15), len: cy * 1.5 }); });
      else [4, 5, 6].forEach(function (cy) { out.push({ cy: cy, time: hhmm(base + 15 + cy * 90), len: cy * 1.5 }); });
      return '<section class="hp-card"><div class="sr-seg hp-seg2"><button type="button" class="' + (st.mode === 'wake' ? 'on' : '') + '" data-a="mode" data-v="wake"><b>কখন উঠব?</b><small>ঘুমানোর সময় জানুন</small></button><button type="button" class="' + (st.mode === 'sleep' ? 'on' : '') + '" data-a="mode" data-v="sleep"><b>এখন ঘুমালে?</b><small>ওঠার সময় জানুন</small></button></div>' +
        field(st.mode === 'wake' ? 'ঘুম থেকে উঠতে চাই' : 'ঘুমাতে যাব', '<input id="slT" type="time" value="' + st.t + '">') + '<button type="button" class="sr-mini hp-now" data-a="now">এখনকার সময় দিন</button></section>' +
        '<div class="hp-sleep">' + out.map(function (o) { return '<div class="hp-sl' + (o.cy === 5 || (st.mode === 'sleep' && o.cy === 5) ? ' best' : '') + '"><small>' + bd(o.cy) + 'টি চক্র · ' + bd(o.len) + ' ঘণ্টা</small><b>' + tm12(o.time) + '</b><span>' + (o.cy === 5 ? 'সেরা পছন্দ' : o.cy === 6 ? 'পূর্ণ বিশ্রাম' : 'কম ঘুম') + '</span></div>'; }).join('') + '</div>' +
        '<p class="sr-note">ঘুমের একটি চক্র প্রায় ৯০ মিনিট; ঘুমিয়ে পড়তে গড়ে ১৫ মিনিট ধরা হয়েছে। চক্রের মাঝখানে উঠলে ক্লান্ত লাগে। পরীক্ষার সময় ৭–৮ ঘণ্টা ঘুম মনে রাখতে সাহায্য করে।</p>';
    }
    HP.add({
      id: 'sleep', icon: '😴', label: 'Sleep Planner', group: 'wellbeing', priority: 20, desc: '৯০ মিনিটের ঘুমের চক্র হিসাব করে ঘুমানো ও ওঠার সেরা সময় জানুন।', render: render,
      click: function (el) { if (el.dataset.a === 'mode') st.mode = el.dataset.v; if (el.dataset.a === 'now') { var d = new Date(); st.t = u.pad(d.getHours()) + ':' + u.pad(d.getMinutes()); st.mode = 'sleep'; } HP.paint(); },
      change: function (el) { if (el.id === 'slT' && el.value) { st.t = el.value; HP.paint(); } }
    });
  })();

  /* =============== 11. Eye-rest 20-20-20 =============== */
  (function () {
    var st = { run: false, phase: 'work', end: 0, count: 0 }, timer = null, W = 20 * 60, R = 20;
    function left() { return Math.max(0, Math.ceil((st.end - Date.now()) / 1000)); }
    function tick() {
      if (!st.run) return;
      var l = left();
      if (l <= 0) {
        if (st.phase === 'work') { st.phase = 'rest'; st.end = Date.now() + R * 1000; u.beep([[660, 0, .2], [880, .25, .25]]); }
        else { st.phase = 'work'; st.end = Date.now() + W * 1000; st.count++; u.beep([[880, 0, .15]]); }
        HP.paint(); return;
      }
      var t = $('eyT'); if (t) t.textContent = u.hms(l);
      var f = $('eyF'); if (f) f.style.width = ((st.phase === 'work' ? W : R) - l) / (st.phase === 'work' ? W : R) * 100 + '%';
    }
    function render() {
      var rest = st.run && st.phase === 'rest';
      return '<section class="hp-card hp-eye ' + (rest ? 'rest' : '') + '"><div class="hp-eye-ico no-mono" aria-hidden="true">' + (rest ? '🌿' : '👀') + '</div><h3>' + (!st.run ? 'প্রস্তুত' : rest ? '২০ ফুট (৬ মি) দূরে তাকিয়ে থাকুন' : 'মনোযোগ দিয়ে পড়ুন') + '</h3><div class="hp-eye-t" id="eyT" role="timer">' + (st.run ? u.hms(left()) : '20:00') + '</div><div class="sr-bar"><i id="eyF" style="width:0%"></i></div><div class="sr-row-btns hp-center">' + (!st.run ? '<button type="button" class="sr-btn sr-go" data-a="start">▶ শুরু করুন</button>' : '<button type="button" class="sr-btn sr-stop" data-a="stop">■ বন্ধ করুন</button>') + '</div><p class="sr-note">এই সেশনে ' + bd(st.count) + ' বার বিরতি নেওয়া হয়েছে।</p></section>' +
        guide('২০-২০-২০ নিয়ম', ['প্রতি ২০ মিনিট পড়ার পর।', '২০ ফুট (প্রায় ৬ মিটার) দূরে কিছুর দিকে তাকান।', '২০ সেকেন্ড ধরে থাকুন ও ধীরে চোখের পাতা ফেলুন।']) + '<p class="sr-note">পেজ খোলা রেখে অন্য ট্যাবে পড়তে পারেন—সময় হলে শব্দ হবে।</p>';
    }
    HP.add({
      id: 'eye-rest', icon: '👀', label: 'Eye Rest (২০-২০-২০)', group: 'wellbeing', priority: 25, desc: 'প্রতি ২০ মিনিট পর চোখের বিশ্রামের রিমাইন্ডার—দীর্ঘক্ষণ পড়লেও চোখ ভালো থাকবে।', render: render,
      mount: function () { if (timer) clearInterval(timer); timer = setInterval(tick, 500); },
      unmount: function () { if (timer) clearInterval(timer); timer = null; },
      click: function (el) { if (el.dataset.a === 'start') { st.run = true; st.phase = 'work'; st.end = Date.now() + W * 1000; u.beep([[784, 0, .12]]); } if (el.dataset.a === 'stop') { st.run = false; } HP.paint(); }
    });
  })();

  /* =============== 12. Study Journal =============== */
  (function () {
    var S = store('journal', {}), sel = u.dayKey(new Date()), MOOD = ['😞', '😕', '😐', '🙂', '😄'];
    function render() {
      var all = S.get(), e = all[sel] || { mood: 0, learned: '', hard: '', next: '' }, keys = Object.keys(all).sort().reverse();
      var days = []; for (var i = 13; i >= 0; i--) { var d = new Date(); d.setDate(d.getDate() - i); var k = u.dayKey(d); days.push({ k: k, m: (all[k] || {}).mood || 0 }); }
      return '<div class="hp-split"><section class="hp-card"><div class="hp-row-h"><b>' + (sel === u.dayKey(new Date()) ? 'আজকের জার্নাল' : bd(sel)) + '</b><input id="jrDate" type="date" value="' + sel + '" max="' + u.dayKey(new Date()) + '" aria-label="তারিখ" class="hp-date"></div>' +
        '<div class="hp-mood no-mono" role="radiogroup" aria-label="আজকের মেজাজ">' + MOOD.map(function (m, i) { return '<button type="button" role="radio" aria-checked="' + (e.mood === i + 1) + '" class="' + (e.mood === i + 1 ? 'on' : '') + '" data-a="mood" data-v="' + (i + 1) + '">' + m + '</button>'; }).join('') + '</div>' +
        field('📚 আজ কী শিখলাম?', '<textarea id="jrL" rows="3" maxlength="800">' + E(e.learned) + '</textarea>') + field('🧗 কোথায় কষ্ট হলো?', '<textarea id="jrH" rows="2" maxlength="500">' + E(e.hard) + '</textarea>') + field('🎯 কালকের প্রথম কাজ', '<textarea id="jrN" rows="2" maxlength="400">' + E(e.next) + '</textarea>') + '<button type="button" class="sr-btn sr-go sr-wide" data-a="save">সংরক্ষণ করুন</button></section>' +
        '<div><section class="hp-card"><h3 class="hp-h">গত ১৪ দিনের মেজাজ</h3><div class="hp-moodbars no-mono">' + days.map(function (d) { return '<i title="' + d.k + '" style="height:' + (d.m ? d.m * 20 : 6) + '%;opacity:' + (d.m ? 1 : .35) + '"></i>'; }).join('') + '</div></section><div class="hp-list">' + keys.slice(0, 12).map(function (k) { var x = all[k]; return '<article class="hp-item"><div class="hp-item-h"><span class="hp-tag no-mono">' + (MOOD[(x.mood || 3) - 1] || '😐') + '</span><small>' + bd(k) + '</small></div>' + (x.learned ? '<p class="hp-q">' + E(x.learned) + '</p>' : '') + (x.next ? '<p class="hp-meta">কালকের কাজ: ' + E(x.next) + '</p>' : '') + '<div class="hp-item-f"><button type="button" class="sr-mini" data-a="open" data-v="' + k + '">✎ খুলুন</button></div></article>'; }).join('') + '</div></div></div>';
    }
    HP.add({
      id: 'journal', icon: '📔', label: 'Study Journal', group: 'wellbeing', priority: 22, desc: 'দিনশেষে ৫ মিনিটে লিখুন—কী শিখলেন, কোথায় কষ্ট হলো, কাল কী করবেন।', render: render,
      click: function (el) {
        var a = el.dataset.a, all = S.get(), e = all[sel] || (all[sel] = { mood: 0, learned: '', hard: '', next: '' });
        if (a === 'mood') { e.mood = +el.dataset.v; e.learned = val('jrL'); e.hard = val('jrH'); e.next = val('jrN'); S.set(all); }
        if (a === 'save') { e.learned = val('jrL'); e.hard = val('jrH'); e.next = val('jrN'); if (!e.mood) e.mood = 3; S.set(all); u.toast('জার্নাল সংরক্ষিত ✓'); }
        if (a === 'open') sel = el.dataset.v;
        HP.paint();
      },
      change: function (el) { if (el.id === 'jrDate' && el.value) { sel = el.value; HP.paint(); } },
      unmount: function () { sel = u.dayKey(new Date()); }
    });
  })();
})();
