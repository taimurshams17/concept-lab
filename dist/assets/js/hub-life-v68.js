/* ConceptLab Student Hub — Life & Planner tools v68
   Assignment Board (kanban), Class Routine, Study Streak & Heatmap, Doubt Tracker, Weekly Review, Reading & Resource Tracker.
   All data stays in the browser (localStorage). Every tool can export / import its data as JSON. */
(function () {
  'use strict';
  var HP = window.CL_HUBPLUS; if (!HP) return;
  var U = HP.u, E = U.E, bd = U.bd || function (s) { return String(s); };
  var MON = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];
  var DAYS = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
  var SUBJ = ['বাংলা', 'English', 'গণিত', 'পদার্থবিজ্ঞান', 'রসায়ন', 'জীববিজ্ঞান', 'উচ্চতর গণিত', 'ICT', 'অন্যান্য'];
  var PAL = ['#6d83ff', '#35c4d8', '#ee6c9c', '#f5a742', '#4cc38a', '#a67cff', '#ff7a59', '#5fb7ff', '#c3c84a'];
  function colorOf(s) { var h = 0; s = String(s || ''); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return PAL[h % PAL.length]; }
  function chip(s) { return '<span class="lf-chip" style="--c:' + colorOf(s) + '">' + E(s) + '</span>'; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function val(id) { var el = document.getElementById(id); return el ? String(el.value).trim() : ''; }
  function todayK() { return U.dayKey(new Date()); }
  function dayDiff(a, b) { return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5); }
  function addDays(k, n) { var d = new Date(k + 'T00:00:00'); d.setDate(d.getDate() + n); return U.dayKey(d); }
  function fmtDate(k) { var d = new Date(k + 'T00:00:00'); return bd(d.getDate()) + ' ' + MON[d.getMonth()]; }
  function keep(id, def) { return { get: function () { var v = U.load('clpro_d_' + id, null); if (!v || typeof v !== 'object') return JSON.parse(JSON.stringify(def)); for (var k in def) if (!(k in v)) v[k] = JSON.parse(JSON.stringify(def[k])); return v; }, set: function (v) { U.save('clpro_d_' + id, v); } }; }
  function subjSelect(id, cur) { return '<select id="' + id + '">' + SUBJ.map(function (s) { return '<option' + (s === cur ? ' selected' : '') + '>' + E(s) + '</option>'; }).join('') + '</select>'; }
  function ring(pct, big, small, color) {
    pct = Math.max(0, Math.min(100, pct)); var r = 26, c = 2 * Math.PI * r;
    return '<div class="lf-ring"><svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="' + r + '" fill="none" stroke="rgba(128,140,200,.22)" stroke-width="6"/><circle cx="32" cy="32" r="' + r + '" fill="none" stroke="' + (color || '#6d83ff') + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + (c * pct / 100).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 32 32)"/></svg><div><b>' + big + '</b><span>' + small + '</span></div></div>';
  }
  function stat(icon, n, label, tone) { return '<div class="lf-stat' + (tone ? ' ' + tone : '') + '"><i aria-hidden="true">' + icon + '</i><b>' + n + '</b><span>' + label + '</span></div>'; }
  function dataBar() { return '<div class="lf-data"><button type="button" class="pro-btn" data-a="exp">⬇ Export (JSON)</button><button type="button" class="pro-btn" data-a="imp">⬆ Import</button><input type="file" accept="application/json,.json" data-imp hidden><button type="button" class="pro-btn" data-a="rst">🗑 সব মুছুন</button></div>'; }
  function common(el, S, def, name) {
    var a = el.dataset.a;
    if (a === 'exp') { U.download('conceptlab-' + name + '-' + todayK() + '.json', JSON.stringify(S.get(), null, 2), 'application/json'); return true; }
    if (a === 'imp') { var f = el.parentNode.querySelector('[data-imp]'); if (f) f.click(); return true; }
    if (a === 'rst') { if (confirm('এই টুলের সব ডেটা মুছে যাবে। নিশ্চিত?')) { S.set(JSON.parse(JSON.stringify(def))); HP.paint(); } return true; }
    return false;
  }
  function importFile(el, S, def) {
    if (!el.hasAttribute || !el.hasAttribute('data-imp')) return false;
    var f = el.files && el.files[0]; if (!f) return true;
    var r = new FileReader();
    r.onload = function () {
      try {
        var d = JSON.parse(r.result); for (var k in def) if (typeof d[k] !== typeof def[k]) throw new Error('bad');
        S.set(d); HP.paint(); U.toast('ডেটা ইমপোর্ট হয়েছে');
      } catch (e) { U.toast('ফাইলটি এই টুলের ডেটা নয়'); }
    };
    r.readAsText(f); el.value = ''; return true;
  }
  function empty(icon, msg) { return '<div class="lf-empty"><i>' + icon + '</i><p>' + msg + '</p></div>'; }

  /* ═════════ 1 · Assignment Board ═════════ */
  (function () {
    var def = { items: [], filter: 'all' }, S = keep('board', def), q = '';
    var COLS = [['todo', 'করণীয়', '#6d83ff'], ['doing', 'চলমান', '#f5a742'], ['done', 'সম্পন্ন', '#4cc38a']];
    var PR = { h: ['উচ্চ', '#ff6b6b'], m: ['মাঝারি', '#f5a742'], l: ['কম', '#4cc38a'] };
    function due(it) {
      if (!it.due) return { t: 'সময়সীমা নেই', c: '' }; if (it.status === 'done') return { t: fmtDate(it.due), c: '' };
      var d = dayDiff(todayK(), it.due); if (d < 0) return { t: bd(-d) + ' দিন দেরি', c: 'late' }; if (d === 0) return { t: 'আজই শেষ', c: 'soon' }; if (d === 1) return { t: 'কাল', c: 'soon' }; return { t: bd(d) + ' দিন বাকি', c: d <= 3 ? 'soon' : '' };
    }
    function sortFn(a, b) { var pa = { h: 0, m: 1, l: 2 }; if (a.due && b.due && a.due !== b.due) return a.due < b.due ? -1 : 1; if (!!a.due !== !!b.due) return a.due ? -1 : 1; return pa[a.prio] - pa[b.prio]; }
    function pass(it, f) {
      if (f === 'high') return it.prio === 'h'; var d = it.due ? dayDiff(todayK(), it.due) : null;
      if (f === 'late') return it.status !== 'done' && d !== null && d < 0; if (f === 'soon') return it.status !== 'done' && d !== null && d >= 0 && d <= 3; return true;
    }
    function card(it, ci) {
      var d = due(it), p = PR[it.prio] || PR.m;
      return '<div class="bd-card" draggable="true" data-id="' + it.id + '" data-text="' + E((it.title + ' ' + it.subject + ' ' + (it.note || '')).toLowerCase()) + '" style="--c:' + colorOf(it.subject) + '">' +
        '<div class="bd-top">' + chip(it.subject) + '<span class="bd-pr" title="অগ্রাধিকার: ' + p[0] + '" style="background:' + p[1] + '"></span></div><b class="bd-t">' + E(it.title) + '</b>' + (it.note ? '<p class="bd-n">' + E(it.note) + '</p>' : '') +
        '<div class="bd-foot"><span class="bd-due ' + d.c + '">⏰ ' + d.t + '</span><span class="bd-act">' + (ci > 0 ? '<button type="button" data-a="mv" data-id="' + it.id + '" data-d="-1" aria-label="পিছনে">◀</button>' : '') + (ci < 2 ? '<button type="button" data-a="mv" data-id="' + it.id + '" data-d="1" aria-label="সামনে">▶</button>' : '') + '<button type="button" data-a="ed" data-id="' + it.id + '" aria-label="সম্পাদনা">✎</button><button type="button" data-a="del" data-id="' + it.id + '" aria-label="মুছুন">🗑</button></span></div></div>';
    }
    function render() {
      var st = S.get(), all = st.items, act = all.filter(function (i) { return i.status !== 'done'; }), late = act.filter(function (i) { return pass(i, 'late'); }).length, soon = act.filter(function (i) { return pass(i, 'soon'); }).length;
      var wk = all.filter(function (i) { return i.status === 'done' && i.doneAt && dayDiff(i.doneAt, todayK()) <= 7; }).length, pct = all.length ? Math.round((all.length - act.length) / all.length * 100) : 0;
      var h = '<div class="lf-stats">' + stat('📌', bd(act.length), 'সক্রিয় কাজ') + stat('⚠️', bd(late), 'দেরি হয়েছে', late ? 'bad' : '') + stat('⏳', bd(soon), '৩ দিনের মধ্যে', soon ? 'warn' : '') + stat('✅', bd(wk), 'এই সপ্তাহে শেষ') + '<div class="lf-stat ring">' + ring(pct, bd(pct) + '%', 'সম্পন্ন', '#4cc38a') + '</div></div>';
      h += '<div class="lf-card"><h3>➕ নতুন কাজ / অ্যাসাইনমেন্ট</h3><div class="lf-form"><label class="lf-w2"><span>কাজের নাম</span><input id="bdT" placeholder="যেমন: পদার্থবিজ্ঞান অধ্যায় ৩ এর সৃজনশীল প্রশ্ন"></label><label><span>বিষয়</span>' + subjSelect('bdS', 'গণিত') + '</label><label><span>শেষ তারিখ</span><input id="bdD" type="date" value="' + addDays(todayK(), 2) + '"></label><label><span>অগ্রাধিকার</span><select id="bdP"><option value="h">উচ্চ</option><option value="m" selected>মাঝারি</option><option value="l">কম</option></select></label><label class="lf-w2"><span>নোট (ঐচ্ছিক)</span><input id="bdN" placeholder="পৃষ্ঠা নম্বর, শিক্ষকের নির্দেশনা…"></label><button type="button" class="pro-btn pri" data-a="add">যোগ করুন</button></div></div>';
      h += '<div class="lf-bar"><label class="hpro-search" style="flex:1;min-width:200px"><b>⌕</b><input id="bdQ" type="search" placeholder="কাজ খুঁজুন…" value="' + E(q) + '"></label><div class="pro-seg" style="margin:0">' + [['all', 'সব'], ['high', '🔴 উচ্চ'], ['soon', '⏳ শিগগির'], ['late', '⚠️ দেরি']].map(function (f) { return '<button type="button" data-a="flt" data-v="' + f[0] + '" aria-pressed="' + (st.filter === f[0]) + '">' + f[1] + '</button>'; }).join('') + '</div></div>';
      h += '<div class="bd-board">' + COLS.map(function (c, ci) {
        var list = all.filter(function (i) { return i.status === c[0] && pass(i, st.filter); }).sort(sortFn); if (c[0] === 'done') list.sort(function (a, b) { return (b.doneAt || '') < (a.doneAt || '') ? -1 : 1; });
        return '<div class="bd-col" data-st="' + c[0] + '" style="--c:' + c[2] + '"><div class="bd-ch"><b>' + c[1] + '</b><span>' + bd(list.length) + '</span>' + (c[0] === 'done' && list.length ? '<button type="button" data-a="clr" title="সম্পন্ন তালিকা পরিষ্কার">🧹</button>' : '') + '</div>' + (list.length ? list.map(function (i) { return card(i, ci); }).join('') : '<div class="bd-empty">' + (c[0] === 'done' ? 'শেষ করা কাজ এখানে জমবে' : 'কার্ড টেনে আনুন বা নতুন কাজ যোগ করুন') + '</div>') + '</div>';
      }).join('') + '</div>' + dataBar();
      return h;
    }
    function move(id, status) {
      var st = S.get(), it = st.items.filter(function (i) { return i.id === id; })[0]; if (!it || it.status === status) return;
      it.status = status; it.doneAt = status === 'done' ? todayK() : null; S.set(st); if (status === 'done') U.toast('দারুণ! একটি কাজ শেষ 🎉'); HP.paint();
    }
    window.__clBoardMove = move;
    function filterDom() { var t = q.toLowerCase(); $$('.bd-card').forEach(function (c) { c.hidden = t && c.dataset.text.indexOf(t) < 0; }); }
    HP.add({
      id: 'board', icon: '🗂️', label: 'অ্যাসাইনমেন্ট তালিকা', desc: 'হোমওয়ার্ক ও অ্যাসাইনমেন্ট কানবান বোর্ডে সাজান — টেনে আনুন, ডেডলাইন ট্র্যাক করুন', group: 'organize', priority: 10, highlight: true,
      render: render, afterPaint: filterDom, mount: filterDom,
      input: function (el) { if (el.id === 'bdQ') { q = el.value.trim(); filterDom(); } },
      change: function (el) { importFile(el, S, def); },
      click: function (el) {
        if (common(el, S, def, 'board')) return;
        var st = S.get(), a = el.dataset.a, id = el.dataset.id;
        if (a === 'add') {
          var t = val('bdT'); if (!t) { U.toast('কাজের নাম লিখুন'); return; }
          st.items.push({ id: U.uid(), title: t, subject: val('bdS'), due: val('bdD'), prio: val('bdP'), note: val('bdN'), status: 'todo', created: todayK(), doneAt: null }); S.set(st); HP.paint(); U.toast('কাজ যোগ হয়েছে');
        }
        else if (a === 'mv') { var it = st.items.filter(function (i) { return i.id === id; })[0]; if (it) { var idx = COLS.map(function (c) { return c[0]; }).indexOf(it.status) + (+el.dataset.d); idx = Math.max(0, Math.min(2, idx)); move(id, COLS[idx][0]); } }
        else if (a === 'del') { if (confirm('কাজটি মুছে ফেলবেন?')) { st.items = st.items.filter(function (i) { return i.id !== id; }); S.set(st); HP.paint(); } }
        else if (a === 'ed') { var e = st.items.filter(function (i) { return i.id === id; })[0]; if (e) { var n = prompt('কাজের নাম পরিবর্তন করুন', e.title); if (n && n.trim()) { e.title = n.trim(); var d2 = prompt('নতুন শেষ তারিখ (YYYY-MM-DD) — অপরিবর্তিত রাখতে ঠিক আছে চাপুন', e.due || ''); if (d2 && /^\d{4}-\d{2}-\d{2}$/.test(d2.trim())) e.due = d2.trim(); S.set(st); HP.paint(); } } }
        else if (a === 'flt') { st.filter = el.dataset.v; S.set(st); HP.paint(); }
        else if (a === 'clr') { if (confirm('সব সম্পন্ন কাজ মুছে ফেলবেন?')) { st.items = st.items.filter(function (i) { return i.status !== 'done'; }); S.set(st); HP.paint(); } }
      }
    });
    function colOf(e) { return e.target && e.target.closest ? e.target.closest('.bd-col') : null; }
    document.addEventListener('dragstart', function (e) { var c = e.target.closest && e.target.closest('.bd-card'); if (!c) return; e.dataTransfer.setData('text/plain', c.dataset.id); e.dataTransfer.effectAllowed = 'move'; c.classList.add('drag'); });
    document.addEventListener('dragend', function () { $$('.bd-card.drag').forEach(function (c) { c.classList.remove('drag'); }); $$('.bd-col.over').forEach(function (c) { c.classList.remove('over'); }); });
    document.addEventListener('dragover', function (e) { var c = colOf(e); if (c) { e.preventDefault(); $$('.bd-col.over').forEach(function (x) { if (x !== c) x.classList.remove('over'); }); c.classList.add('over'); } });
    document.addEventListener('drop', function (e) { var c = colOf(e); if (!c) return; e.preventDefault(); var id = e.dataTransfer.getData('text/plain'); if (id) move(id, c.dataset.st); });
  })();

  /* ═════════ 2 · Class Routine ═════════ */
  (function () {
    var def = { days: [0, 1, 2, 3, 4], periods: [], cells: {} };
    [['08:00', '08:45'], ['08:45', '09:30'], ['09:30', '10:15'], ['10:30', '11:15'], ['11:15', '12:00'], ['12:00', '12:45']].forEach(function (p, i) { def.periods.push({ id: 'p' + (i + 1), s: p[0], e: p[1] }); });
    var S = keep('routine', def), sel = null;
    function mins(t) { var p = String(t).split(':'); return (+p[0]) * 60 + (+p[1] || 0); }
    function t12(t) { var m = mins(t), h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + (mm < 10 ? '0' : '') + mm + ' ' + ap; }
    function render() {
      var st = S.get(), now = new Date(), nm = now.getHours() * 60 + now.getMinutes(), td = now.getDay(), days = st.days.slice().sort(function (a, b) { return a - b; });
      var h = '<div class="lf-card"><h3>📅 আজকের ক্লাস — ' + DAYS[td] + 'বার</h3>';
      var todays = days.indexOf(td) >= 0 ? st.periods.map(function (p) { return { p: p, c: st.cells[td + '_' + p.id] }; }).filter(function (x) { return x.c && x.c.s; }) : [];
      if (!todays.length) h += '<p class="lf-muted">' + (days.indexOf(td) < 0 ? 'আজ রুটিনে ক্লাস নেই।' : 'আজকের জন্য কোনো ক্লাস যোগ করা হয়নি।') + '</p>';
      else h += '<div class="rt-today">' + todays.map(function (x) {
        var on = nm >= mins(x.p.s) && nm < mins(x.p.e), nx = nm < mins(x.p.s), cls = on ? ' now' : (nx ? '' : ' past');
        return '<div class="rt-t' + cls + '" style="--c:' + colorOf(x.c.s) + '"><small>' + t12(x.p.s) + ' – ' + t12(x.p.e) + '</small><b>' + E(x.c.s) + '</b><span>' + E(x.c.t || '') + '</span>' + (on ? '<em>এখন চলছে</em>' : '') + '</div>';
      }).join('') + '</div>';
      h += '</div><div class="lf-bar"><div class="pro-seg" style="margin:0">' + DAYS.map(function (d, i) { return '<button type="button" data-a="day" data-d="' + i + '" aria-pressed="' + (st.days.indexOf(i) >= 0) + '">' + d + '</button>'; }).join('') + '</div><span class="hpro-sp"></span><button type="button" class="pro-btn" data-a="padd">＋ পিরিয়ড</button><button type="button" class="pro-btn" data-a="pdel">− পিরিয়ড</button></div>';
      if (sel) {
        var cur = st.cells[sel.d + '_' + sel.p] || {};
        h += '<div class="lf-card" id="rtEd"><h3>✎ ' + DAYS[sel.d] + 'বার · ' + (st.periods.map(function (p) { return p.id; }).indexOf(sel.p) + 1) + 'ম পিরিয়ড</h3><div class="lf-form"><label class="lf-w2"><span>বিষয়</span><input id="rtS" list="rtL" value="' + E(cur.s || '') + '" placeholder="যেমন: পদার্থবিজ্ঞান"><datalist id="rtL">' + SUBJ.map(function (s) { return '<option>' + E(s) + '</option>'; }).join('') + '</datalist></label><label class="lf-w2"><span>শিক্ষক / রুম</span><input id="rtT" value="' + E(cur.t || '') + '" placeholder="যেমন: রহমান স্যার · রুম ২০৪"></label><button type="button" class="pro-btn pri" data-a="csave">সংরক্ষণ</button><button type="button" class="pro-btn" data-a="cclr">খালি করুন</button><button type="button" class="pro-btn" data-a="cx">বন্ধ</button></div></div>';
      }
      h += '<div class="pro-scroll"><table class="rt-grid"><thead><tr><th>সময়</th>' + days.map(function (d) { return '<th class="' + (d === td ? 'td' : '') + '">' + DAYS[d] + '</th>'; }).join('') + '</tr></thead><tbody>' + st.periods.map(function (p, i) {
        var live = nm >= mins(p.s) && nm < mins(p.e);
        return '<tr class="' + (live ? 'live' : '') + '"><th><b>' + bd(i + 1) + 'ম</b><input type="time" id="ps_' + p.id + '" value="' + p.s + '"><input type="time" id="pe_' + p.id + '" value="' + p.e + '"></th>' + days.map(function (d) {
          var c = st.cells[d + '_' + p.id], on = sel && sel.d === d && sel.p === p.id;
          return '<td class="' + (d === td ? 'td' : '') + '"><button type="button" data-a="cell" data-d="' + d + '" data-p="' + p.id + '" class="rt-c' + (on ? ' on' : '') + (c && c.s ? ' has' : '') + '"' + (c && c.s ? ' style="--c:' + colorOf(c.s) + '"' : '') + '>' + (c && c.s ? '<b>' + E(c.s) + '</b><small>' + E(c.t || '') + '</small>' : '＋') + '</button></td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div><div class="lf-data"><button type="button" class="pro-btn" onclick="window.print()">🖨 রুটিন প্রিন্ট</button><button type="button" class="pro-btn" data-a="exp">⬇ Export</button><button type="button" class="pro-btn" data-a="imp">⬆ Import</button><input type="file" accept=".json" data-imp hidden><button type="button" class="pro-btn" data-a="rst">🗑 রিসেট</button></div>';
      return h;
    }
    HP.add({
      id: 'routine', icon: '🕘', label: 'ক্লাস রুটিন', desc: 'সাপ্তাহিক ক্লাস রুটিন বানান — এখন কোন ক্লাস চলছে ও আজকের ক্লাস এক নজরে', group: 'plan', priority: 9,
      render: render,
      change: function (el) {
        if (importFile(el, S, def)) return; var st = S.get(), m = /^p([se])_(.+)$/.exec(el.id || '');
        if (m) { var p = st.periods.filter(function (x) { return x.id === m[2]; })[0]; if (p && el.value) { p[m[1]] = el.value; S.set(st); HP.paint(); } }
      },
      click: function (el) {
        if (common(el, S, def, 'routine')) return;
        var st = S.get(), a = el.dataset.a;
        if (a === 'day') { var d = +el.dataset.d, i = st.days.indexOf(d); if (i >= 0) { if (st.days.length > 1) st.days.splice(i, 1); } else st.days.push(d); S.set(st); HP.paint(); }
        else if (a === 'padd') { var last = st.periods[st.periods.length - 1], s = last ? last.e : '08:00', e = (function (t) { var m = mins(t) + 45; return ('0' + Math.floor(m / 60) % 24).slice(-2) + ':' + ('0' + m % 60).slice(-2); })(s); st.periods.push({ id: 'p' + U.uid(), s: s, e: e }); S.set(st); HP.paint(); }
        else if (a === 'pdel') { if (st.periods.length > 1) { var rm = st.periods.pop(); for (var k in st.cells) if (k.split('_')[1] === rm.id) delete st.cells[k]; S.set(st); sel = null; HP.paint(); } }
        else if (a === 'cell') { sel = { d: +el.dataset.d, p: el.dataset.p }; HP.paint(); var ed = document.getElementById('rtEd'); if (ed) ed.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        else if (a === 'csave') { if (!sel) return; var s2 = val('rtS'); if (s2) st.cells[sel.d + '_' + sel.p] = { s: s2, t: val('rtT') }; else delete st.cells[sel.d + '_' + sel.p]; S.set(st); sel = null; HP.paint(); }
        else if (a === 'cclr') { if (sel) { delete st.cells[sel.d + '_' + sel.p]; S.set(st); sel = null; HP.paint(); } }
        else if (a === 'cx') { sel = null; HP.paint(); }
      },
      key: function (e) { if (e.key === 'Enter' && e.target.id && /^rt[ST]$/.test(e.target.id)) { e.preventDefault(); var b = $('[data-a="csave"]'); if (b) b.click(); } }
    });
  })();

  /* ═════════ 3 · Study Streak & Heatmap ═════════ */
  (function () {
    var def = { entries: [], goal: 120 }, S = keep('streak', def);
    function agg(st) {
      var by = {}; st.entries.forEach(function (e) { var d = by[e.date] || (by[e.date] = { t: 0, s: {} }); d.t += e.min; d.s[e.subject] = (d.s[e.subject] || 0) + e.min; }); return by;
    }
    function streaks(by) {
      var t = todayK(), cur = 0, d = by[t] ? t : addDays(t, -1); while (by[d]) { cur++; d = addDays(d, -1); }
      var keys = Object.keys(by).sort(), best = 0, run = 0, prev = null; keys.forEach(function (k) { run = prev && dayDiff(prev, k) === 1 ? run + 1 : 1; if (run > best) best = run; prev = k; }); return { cur: cur, best: best };
    }
    function hm(m) { return m >= 60 ? bd(Math.floor(m / 60)) + ' ঘ ' + (m % 60 ? bd(m % 60) + ' মি' : '') : bd(m) + ' মি'; }
    function render() {
      var st = S.get(), by = agg(st), t = todayK(), sk = streaks(by), goal = st.goal || 120, today = by[t] ? by[t].t : 0;
      var total = st.entries.reduce(function (a, e) { return a + e.min; }, 0), wk = 0, i, d;
      for (i = 0; i < 7; i++) { d = addDays(t, -i); if (by[d]) wk += by[d].t; }
      var days30 = 0, sum30 = 0; for (i = 0; i < 30; i++) { d = addDays(t, -i); if (by[d]) { days30++; sum30 += by[d].t; } }
      var hrs = total / 60, lvl = hrs >= 150 ? ['🏆', 'মাস্টার'] : hrs >= 50 ? ['🎓', 'স্কলার'] : hrs >= 10 ? ['📘', 'লার্নার'] : ['🌱', 'স্টার্টার'];
      var best = 0, bestD = ''; for (var k in by) if (by[k].t > best) { best = by[k].t; bestD = k; }
      var h = '<div class="lf-stats">' + stat('🔥', bd(sk.cur) + ' দিন', 'বর্তমান স্ট্রিক', sk.cur >= 3 ? 'good' : '') + stat('🏅', bd(sk.best) + ' দিন', 'সেরা স্ট্রিক') + stat('📚', hm(wk) || '০', 'শেষ ৭ দিনে') + stat(lvl[0], lvl[1], 'মোট ' + hm(Math.round(total)) + '') + '<div class="lf-stat ring">' + ring(today / goal * 100, hm(today), 'আজ / লক্ষ্য ' + hm(goal), today >= goal ? '#4cc38a' : '#6d83ff') + '</div></div>';
      h += '<div class="lf-card"><h3>⏱ স্টাডি সেশন লগ করুন</h3><div class="lf-form"><label><span>তারিখ</span><input id="stD" type="date" value="' + t + '" max="' + t + '"></label><label><span>বিষয়</span>' + subjSelect('stS', 'গণিত') + '</label><label><span>সময় (মিনিট)</span><input id="stM" type="number" min="1" max="720" value="45"></label><label class="lf-w2"><span>কী পড়লেন? (ঐচ্ছিক)</span><input id="stN" placeholder="যেমন: দ্বিঘাত সমীকরণের অনুশীলনী"></label><button type="button" class="pro-btn pri" data-a="add">লগ করুন</button></div><div class="pro-chips">' + [15, 30, 45, 60, 90, 120].map(function (m) { return '<button type="button" data-a="qm" data-v="' + m + '">' + bd(m) + ' মি</button>'; }).join('') + '<span class="hpro-sp"></span><label class="lf-inline">দৈনিক লক্ষ্য <input id="stG" type="number" min="10" max="1000" value="' + goal + '"> মি</label></div></div>';
      var start = addDays(t, -(new Date(t + 'T00:00:00').getDay() + 7 * 19)), cells = '';
      for (i = 0; i < 140; i++) { d = addDays(start, i); if (d > t) { cells += '<i class="hm-c off"></i>'; continue; } var m = by[d] ? by[d].t : 0, lv = !m ? 0 : m < goal * .25 ? 1 : m < goal * .5 ? 2 : m < goal ? 3 : 4; cells += '<i class="hm-c l' + lv + (d === t ? ' today' : '') + '" title="' + fmtDate(d) + ' — ' + (m ? hm(m) : 'পড়া হয়নি') + '"></i>'; }
      h += '<div class="lf-card"><h3>🗓 ২০ সপ্তাহের হিটম্যাপ</h3><div class="pro-scroll"><div class="hm-grid">' + cells + '</div></div><div class="hm-leg">কম <i class="hm-c l0" style="width:14px;height:14px"></i><i class="hm-c l1" style="width:14px;height:14px"></i><i class="hm-c l2" style="width:14px;height:14px"></i><i class="hm-c l3" style="width:14px;height:14px"></i><i class="hm-c l4" style="width:14px;height:14px"></i> বেশি<span class="hpro-sp"></span>' + (best ? 'সেরা দিন: ' + fmtDate(bestD) + ' (' + hm(best) + ')' : '') + '</div></div>';
      var bars = '', mx = goal; for (i = 6; i >= 0; i--) { d = addDays(t, -i); mx = Math.max(mx, by[d] ? by[d].t : 0); }
      for (i = 6; i >= 0; i--) { d = addDays(t, -i); var v = by[d] ? by[d].t : 0, dn = DAYS[new Date(d + 'T00:00:00').getDay()]; bars += '<div class="wb"><span class="wb-v">' + (v ? bd(v) : '') + '</span><div class="wb-b"><i style="height:' + Math.round(v / mx * 100) + '%" class="' + (v >= goal ? 'ok' : '') + '"></i><u style="bottom:' + Math.round(goal / mx * 100) + '%"></u></div><small>' + dn.slice(0, 3) + '</small></div>'; }
      var sub = {}; for (i = 0; i < 30; i++) { d = addDays(t, -i); if (by[d]) for (var s in by[d].s) sub[s] = (sub[s] || 0) + by[d].s[s]; }
      var sk2 = Object.keys(sub).sort(function (a, b) { return sub[b] - sub[a]; }), smax = sub[sk2[0]] || 1;
      h += '<div class="lf-two"><div class="lf-card"><h3>📊 শেষ ৭ দিন (মিনিট)</h3><div class="wb-wrap">' + bars + '</div><p class="lf-muted">ডটেড রেখা = দৈনিক লক্ষ্য · ৩০ দিনে গড় ' + (days30 ? hm(Math.round(sum30 / 30)) : '০') + '/দিন</p></div><div class="lf-card"><h3>🎯 বিষয়ভিত্তিক সময় (৩০ দিন)</h3>' + (sk2.length ? sk2.map(function (s) { return '<div class="sb"><span>' + E(s) + '</span><div><i style="width:' + Math.round(sub[s] / smax * 100) + '%;background:' + colorOf(s) + '"></i></div><b>' + hm(sub[s]) + '</b></div>'; }).join('') : empty('📈', 'লগ করলে এখানে বিষয়ভিত্তিক সময় দেখা যাবে')) + '</div></div>';
      var rec = st.entries.slice().sort(function (a, b) { return b.date < a.date ? -1 : (b.date > a.date ? 1 : 0); }).slice(0, 8);
      h += '<div class="lf-card"><h3>🕘 সাম্প্রতিক সেশন</h3>' + (rec.length ? rec.map(function (e) { return '<div class="lf-row"><span>' + fmtDate(e.date) + '</span>' + chip(e.subject) + '<b>' + hm(e.min) + '</b><em>' + E(e.note || '') + '</em><button type="button" data-a="del" data-id="' + e.id + '" aria-label="মুছুন">✕</button></div>'; }).join('') : empty('⏱', 'এখনো কোনো সেশন লগ করা হয়নি — প্রথমটি শুরু করুন!')) + '</div>' + dataBar();
      return h;
    }
    HP.add({
      id: 'streak', icon: '🔥', label: 'পড়ার ধারাবাহিকতা', desc: 'প্রতিদিনের পড়ার সময় লগ করুন — স্ট্রিক, হিটম্যাপ, বিষয়ভিত্তিক বিশ্লেষণ ও লেভেল', group: 'track', priority: 10, highlight: true,
      render: render,
      change: function (el) { if (importFile(el, S, def)) return; if (el.id === 'stG') { var st = S.get(), g = parseInt(el.value, 10); if (g >= 10) { st.goal = g; S.set(st); HP.paint(); } } },
      click: function (el) {
        if (common(el, S, def, 'streak')) return;
        var st = S.get(), a = el.dataset.a;
        if (a === 'qm') { var m = document.getElementById('stM'); if (m) m.value = el.dataset.v; }
        else if (a === 'add') {
          var min = parseInt(val('stM'), 10), dt = val('stD') || todayK(); if (!(min > 0)) { U.toast('সময় (মিনিট) দিন'); return; }
          st.entries.push({ id: U.uid(), date: dt, subject: val('stS'), min: min, note: val('stN') }); if (st.entries.length > 1500) st.entries.splice(0, st.entries.length - 1500); S.set(st); HP.paint(); U.toast('সেশন লগ হয়েছে — চালিয়ে যান! 🔥');
        }
        else if (a === 'del') { st.entries = st.entries.filter(function (e) { return e.id !== el.dataset.id; }); S.set(st); HP.paint(); }
      }
    });
  })();

  /* ═════════ 4 · Doubt Tracker ═════════ */
  (function () {
    var def = { items: [], filter: 'open' }, S = keep('doubts', def), q = '', openId = null;
    var ST = { open: ['❓ অমীমাংসিত', '#ff7a59'], asked: ['🙋 জিজ্ঞেস করেছি', '#f5a742'], solved: ['✅ সমাধান', '#4cc38a'] }, NEXT = { open: 'asked', asked: 'solved', solved: 'open' };
    function render() {
      var st = S.get(), all = st.items, c = { open: 0, asked: 0, solved: 0 }; all.forEach(function (i) { c[i.status]++; });
      var pct = all.length ? Math.round(c.solved / all.length * 100) : 0;
      var h = '<div class="lf-stats">' + stat('❓', bd(c.open), 'অমীমাংসিত', c.open ? 'warn' : '') + stat('🙋', bd(c.asked), 'শিক্ষককে জিজ্ঞেস') + stat('✅', bd(c.solved), 'সমাধান হয়েছে', 'good') + '<div class="lf-stat ring">' + ring(pct, bd(pct) + '%', 'সমাধানের হার', '#4cc38a') + '</div></div>';
      h += '<div class="lf-card"><h3>➕ নতুন প্রশ্ন / সংশয়</h3><div class="lf-form"><label class="lf-w3"><span>আপনার প্রশ্ন বা কনফিউশন</span><textarea id="dbQ" rows="2" placeholder="যা বুঝতে পারছেন না তা লিখে রাখুন…"></textarea></label><label><span>বিষয়</span>' + subjSelect('dbS', 'পদার্থবিজ্ঞান') + '</label><label><span>অধ্যায় / টপিক</span><input id="dbC" placeholder="যেমন: গতিবিদ্যা"></label><label><span>গুরুত্ব</span><select id="dbP"><option value="h">জরুরি</option><option value="m" selected>সাধারণ</option><option value="l">পরে হলেও চলবে</option></select></label><button type="button" class="pro-btn pri" data-a="add">যোগ করুন</button></div></div>';
      h += '<div class="lf-bar"><label class="hpro-search" style="flex:1;min-width:200px"><b>⌕</b><input id="dbF" type="search" placeholder="প্রশ্ন, বিষয় বা অধ্যায় খুঁজুন…" value="' + E(q) + '"></label><div class="pro-seg" style="margin:0">' + [['all', 'সব'], ['open', 'অমীমাংসিত'], ['asked', 'জিজ্ঞেস'], ['solved', 'সমাধান']].map(function (f) { return '<button type="button" data-a="flt" data-v="' + f[0] + '" aria-pressed="' + (st.filter === f[0]) + '">' + f[1] + '</button>'; }).join('') + '</div><button type="button" class="pro-btn" data-a="pick">🎲 আজ কোনটি সমাধান করব?</button></div>';
      var pr = { h: 0, m: 1, l: 2 }, list = all.filter(function (i) { return st.filter === 'all' || i.status === st.filter; }).sort(function (a, b) { return pr[a.prio] - pr[b.prio] || (a.created < b.created ? 1 : -1); });
      h += '<div id="dbList">' + (list.length ? list.map(function (i) {
        var s = ST[i.status], on = openId === i.id;
        return '<div class="db-i" data-text="' + E((i.q + ' ' + i.subject + ' ' + (i.chapter || '') + ' ' + (i.answer || '')).toLowerCase()) + '" style="--c:' + s[1] + '"><div class="db-h"><button type="button" class="db-st" data-a="cyc" data-id="' + i.id + '" title="অবস্থা পাল্টান">' + s[0] + '</button>' + chip(i.subject) + (i.chapter ? '<small>' + E(i.chapter) + '</small>' : '') + (i.prio === 'h' ? '<em>🔴 জরুরি</em>' : '') + '<span class="hpro-sp"></span><small>' + fmtDate(i.created) + '</small></div><p class="db-q">' + E(i.q) + '</p>' + (i.answer && !on ? '<div class="db-a"><b>সমাধান:</b> ' + E(i.answer) + '</div>' : '') +
          (on ? '<textarea id="dbA" rows="3" placeholder="সমাধান / ব্যাখ্যা লিখুন…">' + E(i.answer || '') + '</textarea><div class="db-b"><button type="button" class="pro-btn pri" data-a="asv" data-id="' + i.id + '">সমাধান সংরক্ষণ</button><button type="button" class="pro-btn" data-a="aop" data-id="">বন্ধ</button></div>' : '<div class="db-b"><button type="button" class="pro-btn" data-a="aop" data-id="' + i.id + '">' + (i.answer ? '✎ সমাধান সম্পাদনা' : '＋ সমাধান লিখুন') + '</button><button type="button" class="pro-btn" data-a="del" data-id="' + i.id + '">🗑</button></div>') + '</div>';
      }).join('') : empty('🧩', st.filter === 'open' ? 'কোনো অমীমাংসিত প্রশ্ন নেই — দারুণ! নতুন কিছু বুঝতে না পারলে এখানে লিখে রাখুন।' : 'এই তালিকায় কিছু নেই।')) + '</div>' + dataBar();
      return h;
    }
    function filterDom() { var t = q.toLowerCase(); $$('.db-i').forEach(function (c) { c.hidden = t && c.dataset.text.indexOf(t) < 0; }); }
    HP.add({
      id: 'doubts', icon: '🧩', label: 'প্রশ্নের তালিকা', desc: 'যা বুঝতে পারছেন না তা লিখে রাখুন, শিক্ষককে জিজ্ঞেস করুন এবং সমাধান সংরক্ষণ করুন', group: 'organize', priority: 8,
      render: render, afterPaint: filterDom, mount: filterDom,
      input: function (el) { if (el.id === 'dbF') { q = el.value.trim(); filterDom(); } },
      change: function (el) { importFile(el, S, def); },
      click: function (el) {
        if (common(el, S, def, 'doubts')) return;
        var st = S.get(), a = el.dataset.a, id = el.dataset.id, it = st.items.filter(function (i) { return i.id === id; })[0];
        if (a === 'add') { var t = val('dbQ'); if (!t) { U.toast('প্রশ্নটি লিখুন'); return; } st.items.push({ id: U.uid(), q: t, subject: val('dbS'), chapter: val('dbC'), prio: val('dbP'), status: 'open', answer: '', created: todayK() }); S.set(st); HP.paint(); U.toast('প্রশ্ন সংরক্ষিত হয়েছে'); }
        else if (a === 'flt') { st.filter = el.dataset.v; S.set(st); HP.paint(); }
        else if (a === 'cyc' && it) { it.status = NEXT[it.status]; S.set(st); HP.paint(); }
        else if (a === 'aop') { openId = id || null; HP.paint(); }
        else if (a === 'asv' && it) { it.answer = val('dbA'); if (it.answer && it.status !== 'solved') it.status = 'solved'; S.set(st); openId = null; HP.paint(); U.toast('সমাধান সংরক্ষিত'); }
        else if (a === 'del') { if (confirm('মুছে ফেলবেন?')) { st.items = st.items.filter(function (i) { return i.id !== id; }); S.set(st); HP.paint(); } }
        else if (a === 'pick') { var op = st.items.filter(function (i) { return i.status !== 'solved'; }); if (!op.length) { U.toast('কোনো অমীমাংসিত প্রশ্ন নেই 🎉'); return; } var pr = { h: 3, m: 2, l: 1 }, pool = []; op.forEach(function (i) { for (var k = 0; k < pr[i.prio]; k++) pool.push(i); }); var x = pool[Math.floor(Math.random() * pool.length)]; st.filter = 'all'; S.set(st); openId = x.id; HP.paint(); var card = $('.db-i textarea'); if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' }); U.toast('আজকের চ্যালেঞ্জ: ' + x.q.slice(0, 40)); }
      }
    });
  })();

  /* ═════════ 5 · Weekly Review ═════════ */
  (function () {
    var def = { reviews: {} }, S = keep('wreview', def), off = 0;
    var RATE = [['focus', 'মনোযোগ', '🎯'], ['cons', 'ধারাবাহিকতা', '🔁'], ['und', 'বোঝাপড়া', '🧠'], ['well', 'শরীর ও মন', '💚']];
    function weekStart(date) { var d = new Date(date); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 1) % 7)); return U.dayKey(d); }
    function curKey() { return addDays(weekStart(new Date()), off * 7); }
    function score(r) { if (!r) return 0; var v = RATE.map(function (x) { return (r.r || {})[x[0]] || 0; }).filter(Boolean); return v.length ? Math.round(v.reduce(function (a, b) { return a + b; }, 0) / v.length * 20) : 0; }
    function range(k) { return fmtDate(k) + ' – ' + fmtDate(addDays(k, 6)); }
    function render() {
      var st = S.get(), k = curKey(), r = st.reviews[k] || { r: {}, hours: '', wins: '', hard: '', lesson: '', next: '' }, sc = score(r), isNow = off === 0;
      var keys = []; for (var i = 7; i >= 0; i--) keys.push(addDays(weekStart(new Date()), -i * 7));
      var pts = keys.map(function (x, i) { return { x: 20 + i * 54, y: 96 - score(st.reviews[x]) * .8, v: score(st.reviews[x]), k: x }; });
      var done = Object.keys(st.reviews).filter(function (x) { return score(st.reviews[x]); }), avg = done.length ? Math.round(done.reduce(function (a, x) { return a + score(st.reviews[x]); }, 0) / done.length) : 0, bestK = done.sort(function (a, b) { return score(st.reviews[b]) - score(st.reviews[a]); })[0];
      var h = '<div class="lf-stats">' + stat('📆', bd(done.length), 'রিভিউ করা সপ্তাহ') + stat('⭐', bd(avg) + '%', 'গড় স্কোর') + stat('🏆', bestK ? range(bestK).split(' – ')[0] : '—', 'সেরা সপ্তাহ') + '<div class="lf-stat ring">' + ring(sc, bd(sc) + '%', 'এই সপ্তাহের স্কোর', sc >= 70 ? '#4cc38a' : '#6d83ff') + '</div></div>';
      h += '<div class="lf-bar"><button type="button" class="pro-btn" data-a="wk" data-d="-1">◀ আগের সপ্তাহ</button><b class="wr-range">' + range(k) + (isNow ? ' <em>(এই সপ্তাহ)</em>' : '') + '</b><button type="button" class="pro-btn" data-a="wk" data-d="1"' + (isNow ? ' disabled' : '') + '>পরের সপ্তাহ ▶</button>' + (isNow ? '' : '<button type="button" class="pro-btn" data-a="wk" data-d="0">আজকের সপ্তাহে ফিরুন</button>') + '</div>';
      h += '<div class="lf-two"><div class="lf-card"><h3>⭐ সপ্তাহটি কেমন গেল?</h3>' + RATE.map(function (x) {
        var cur = (r.r || {})[x[0]] || 0; return '<div class="wr-rate"><span>' + x[2] + ' ' + x[1] + '</span><div>' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" data-a="rate" data-k="' + x[0] + '" data-n="' + n + '" aria-pressed="' + (cur === n) + '" class="' + (cur >= n ? 'on' : '') + '">' + n + '</button>'; }).join('') + '</div></div>';
      }).join('') + '<label class="pro-f" style="margin-top:12px"><span>এই সপ্তাহে মোট পড়ার সময় (ঘণ্টা)</span><input id="wrH" type="number" min="0" step="0.5" value="' + E(r.hours) + '" data-wr="hours"></label></div>' +
        '<div class="lf-card"><h3>📈 শেষ ৮ সপ্তাহের ট্রেন্ড</h3><svg viewBox="0 0 400 120" class="wr-svg" role="img" aria-label="Weekly score trend"><line x1="0" y1="96" x2="400" y2="96" stroke="rgba(128,140,200,.3)"/><polyline fill="none" stroke="#6d83ff" stroke-width="3" stroke-linejoin="round" points="' + pts.filter(function (p) { return p.v; }).map(function (p) { return p.x + ',' + p.y; }).join(' ') + '"/>' + pts.map(function (p) { return (p.v ? '<circle cx="' + p.x + '" cy="' + p.y + '" r="4.5" fill="#6d83ff"/><text x="' + p.x + '" y="' + (p.y - 9) + '" text-anchor="middle" font-size="10" fill="currentColor">' + p.v + '</text>' : '') + '<text x="' + p.x + '" y="113" text-anchor="middle" font-size="9" fill="currentColor" opacity=".6">' + fmtDate(p.k).split(' ')[0] + '</text>'; }).join('') + '</svg></div></div>';
      h += '<div class="lf-card"><h3>📝 রিফ্লেকশন</h3><div class="wr-ta"><label class="pro-f"><span>🏅 এই সপ্তাহের সেরা অর্জন</span><textarea data-wr="wins" rows="3" placeholder="কী ভালো হয়েছে?">' + E(r.wins) + '</textarea></label><label class="pro-f"><span>🧗 কোথায় আটকে গেলাম?</span><textarea data-wr="hard" rows="3" placeholder="কোন বিষয়/অভ্যাস কঠিন লেগেছে?">' + E(r.hard) + '</textarea></label><label class="pro-f"><span>💡 শিক্ষা</span><textarea data-wr="lesson" rows="3" placeholder="নিজের সম্পর্কে বা পড়াশোনার কৌশল নিয়ে কী শিখলাম?">' + E(r.lesson) + '</textarea></label><label class="pro-f"><span>🎯 আগামী সপ্তাহের ৩টি ফোকাস</span><textarea data-wr="next" rows="3" placeholder="১. … ২. … ৩. …">' + E(r.next) + '</textarea></label></div><p class="lf-muted">লেখা স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়।</p></div>' + dataBar();
      return h;
    }
    function setField(f, v) { var st = S.get(), k = curKey(), r = st.reviews[k] || (st.reviews[k] = { r: {}, hours: '', wins: '', hard: '', lesson: '', next: '' }); r[f] = v; S.set(st); }
    HP.add({
      id: 'wreview', icon: '🔁', label: 'সাপ্তাহিক রিভিউ', desc: 'প্রতি সপ্তাহের শেষে নিজের অগ্রগতি মূল্যায়ন করুন — রেটিং, রিফ্লেকশন ও ট্রেন্ড চার্ট', group: 'track', priority: 8,
      render: render,
      input: function (el) { if (el.dataset.wr) setField(el.dataset.wr, el.value); },
      change: function (el) { importFile(el, S, def); },
      click: function (el) {
        if (common(el, S, def, 'weekly-review')) return;
        var a = el.dataset.a;
        if (a === 'wk') { off = el.dataset.d === '0' ? 0 : Math.min(0, off + (+el.dataset.d)); HP.paint(); }
        else if (a === 'rate') { var st = S.get(), k = curKey(), r = st.reviews[k] || (st.reviews[k] = { r: {}, hours: '', wins: '', hard: '', lesson: '', next: '' }); r.r = r.r || {}; r.r[el.dataset.k] = (r.r[el.dataset.k] === +el.dataset.n) ? 0 : +el.dataset.n; S.set(st); HP.paint(); }
      }
    });
  })();

  /* ═════════ 6 · Reading & Resource Tracker ═════════ */
  (function () {
    var def = { items: [] }, S = keep('reading', def);
    var TYPE = { book: '📘 বই', course: '🎓 কোর্স', video: '🎬 ভিডিও', pdf: '📄 নোট/PDF', other: '📎 অন্যান্য' };
    function render() {
      var st = S.get(), all = st.items, fin = all.filter(function (i) { return i.done >= i.total; }).length;
      var avg = all.length ? Math.round(all.reduce(function (a, i) { return a + Math.min(100, i.done / i.total * 100); }, 0) / all.length) : 0, late = 0;
      all.forEach(function (i) { if (i.done < i.total && i.target && dayDiff(todayK(), i.target) < 0) late++; });
      var h = '<div class="lf-stats">' + stat('📚', bd(all.length), 'মোট রিসোর্স') + stat('🏁', bd(fin), 'শেষ হয়েছে', 'good') + stat('⚠️', bd(late), 'টার্গেট পেরিয়েছে', late ? 'bad' : '') + '<div class="lf-stat ring">' + ring(avg, bd(avg) + '%', 'গড় অগ্রগতি', '#6d83ff') + '</div></div>';
      h += '<div class="lf-card"><h3>➕ নতুন রিসোর্স</h3><div class="lf-form"><label class="lf-w2"><span>নাম</span><input id="rdT" placeholder="যেমন: HSC পদার্থবিজ্ঞান ১ম পত্র"></label><label><span>ধরন</span><select id="rdY">' + Object.keys(TYPE).map(function (k) { return '<option value="' + k + '">' + TYPE[k] + '</option>'; }).join('') + '</select></label><label><span>বিষয়</span>' + subjSelect('rdS', 'পদার্থবিজ্ঞান') + '</label><label><span>মোট পরিমাণ</span><input id="rdN" type="number" min="1" value="300"></label><label><span>একক</span><select id="rdU"><option>পৃষ্ঠা</option><option>অধ্যায়</option><option>ভিডিও</option><option>ঘণ্টা</option><option>টপিক</option></select></label><label><span>শেষ করার তারিখ</span><input id="rdD" type="date" value="' + addDays(todayK(), 30) + '"></label><button type="button" class="pro-btn pri" data-a="add">যোগ করুন</button></div></div>';
      var list = all.slice().sort(function (a, b) { var fa = a.done >= a.total, fb = b.done >= b.total; return fa !== fb ? (fa ? 1 : -1) : (a.target || '9') < (b.target || '9') ? -1 : 1; });
      h += '<div class="rd-grid">' + (list.length ? list.map(function (i) {
        var p = Math.min(100, Math.round(i.done / i.total * 100)), isD = i.done >= i.total, left = i.target ? dayDiff(todayK(), i.target) : null, rem = i.total - i.done, pace = '';
        if (!isD && left !== null) pace = left > 0 ? 'প্রতিদিন ≈ ' + bd(Math.ceil(rem / left * 10) / 10) + ' ' + i.unit + ' পড়লে সময়মতো শেষ' : '<b class="late">টার্গেট পেরিয়ে গেছে</b>';
        return '<div class="rd-c' + (isD ? ' fin' : '') + '" style="--c:' + colorOf(i.subject) + '"><div class="rd-h"><span>' + (TYPE[i.type] || TYPE.other) + '</span>' + chip(i.subject) + '<button type="button" data-a="del" data-id="' + i.id + '" aria-label="মুছুন">✕</button></div><b class="rd-t">' + E(i.title) + '</b><div class="rd-bar"><i style="width:' + p + '%"></i></div><div class="rd-m"><span>' + bd(i.done) + ' / ' + bd(i.total) + ' ' + E(i.unit) + '</span><b>' + bd(p) + '%</b></div>' + (isD ? '<p class="rd-p">🎉 শেষ হয়েছে!</p>' : '<p class="rd-p">' + (left !== null && left > 0 ? '⏰ ' + bd(left) + ' দিন বাকি · ' : '') + pace + '</p>') +
          (isD ? '' : '<div class="rd-b"><button type="button" data-a="inc" data-id="' + i.id + '" data-n="1">+১</button><button type="button" data-a="inc" data-id="' + i.id + '" data-n="5">+৫</button><button type="button" data-a="inc" data-id="' + i.id + '" data-n="10">+১০</button><button type="button" data-a="set" data-id="' + i.id + '">✎ সেট</button></div>') + '</div>';
      }).join('') : empty('📚', 'বই, কোর্স বা ভিডিও সিরিজ যোগ করুন — অগ্রগতি ও দৈনিক গতি ট্র্যাক হবে।')) + '</div>' + dataBar();
      return h;
    }
    HP.add({
      id: 'reading', icon: '📚', label: 'বই পড়ার অগ্রগতি', desc: 'বই, কোর্স, ভিডিও ও নোটের অগ্রগতি ট্র্যাক করুন — টার্গেট অনুযায়ী দৈনিক গতি জানুন', group: 'organize', priority: 7,
      render: render,
      change: function (el) { importFile(el, S, def); },
      click: function (el) {
        if (common(el, S, def, 'reading')) return;
        var st = S.get(), a = el.dataset.a, it = st.items.filter(function (i) { return i.id === el.dataset.id; })[0];
        if (a === 'add') { var t = val('rdT'), n = parseInt(val('rdN'), 10); if (!t || !(n > 0)) { U.toast('নাম ও মোট পরিমাণ দিন'); return; } st.items.push({ id: U.uid(), title: t, type: val('rdY'), subject: val('rdS'), total: n, done: 0, unit: val('rdU'), target: val('rdD') }); S.set(st); HP.paint(); U.toast('রিসোর্স যোগ হয়েছে'); }
        else if (a === 'inc' && it) { it.done = Math.min(it.total, it.done + (+el.dataset.n)); S.set(st); if (it.done >= it.total) U.toast('অভিনন্দন! শেষ করলেন 🎉'); HP.paint(); }
        else if (a === 'set' && it) { var v = prompt('কতটুকু শেষ হয়েছে? (সর্বোচ্চ ' + it.total + ')', it.done); if (v !== null && !isNaN(parseInt(v, 10))) { it.done = Math.max(0, Math.min(it.total, parseInt(v, 10))); S.set(st); HP.paint(); } }
        else if (a === 'del') { if (confirm('মুছে ফেলবেন?')) { st.items = st.items.filter(function (i) { return i.id !== el.dataset.id; }); S.set(st); HP.paint(); } }
      }
    });
  })();
})();
