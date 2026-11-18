/* ConceptLab Student Hub Pro v68
   A) Every tool page gets a premium toolbar: Pin, personal notes, copy result, print / save as PDF, focus mode,
      usage counter and "related tools". The hub home gets search, group filters, favourites and recently used.
   B) New science & maths tools (registered through CL_HUBPLUS): Equation Balancer, Element Explorer, pH & Solution Lab,
      Circuit Lab, Complex Numbers, Counting & Probability, Sequence & Series, Exam Pace Planner. */
(function () {
  'use strict';
  var HP = window.CL_HUBPLUS;
  var U = (HP && HP.u) || {
    E: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    load: function (k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
    save: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } },
    toast: function () { }, copy: function (t) { try { navigator.clipboard.writeText(t); } catch (e) { } }
  };
  var E = U.E;
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ═════════════ A · generic enhancer ═════════════ */
  var FAV = 'clpro_fav', REC = 'clpro_recent', USE = 'clpro_use';
  var CORE = [
    ['plan', '✅', 'পড়ার পরিকল্পনা', 'plan'], ['week', '🗓', 'সাপ্তাহিক রুটিন', 'plan'], ['monthly', '🗓', 'মাসিক পরিকল্পনা', 'plan'],
    ['focus', '⏱', 'ফোকাস টাইমার', 'plan'], ['exam', '📅', 'পরীক্ষার কাউন্টডাউন', 'plan'], ['cards', '🃏', 'ফ্ল্যাশকার্ড', 'revise'],
    ['review', '🔁', 'স্মার্ট রিভিশন', 'revise'], ['revision', '📚', 'রিভিশন প্ল্যান', 'revise'], ['form', '📐', 'সূত্রের খাতা', 'revise'],
    ['syllabus', '📖', 'সিলেবাসের অগ্রগতি', 'track'], ['goals', '🎯', 'পড়ার লক্ষ্য', 'track'], ['scores', '📈', 'নম্বরের হিসাব', 'track'],
    ['hab', '🌱', 'পড়ার অভ্যাস', 'track'], ['backup', '💾', 'ডেটা ব্যাকআপ', 'track'], ['notes', '📝', 'দ্রুত নোট', 'tools'], ['gpa', '🎓', 'GPA ক্যালকুলেটর', 'tools']
  ];
  function route() { var p = location.hash.replace(/^#\/?/, '').split('/'); return { page: p[0] || '', tool: (p[1] || '').split('?')[0] }; }
  function favs() { var a = U.load(FAV, []); return Array.isArray(a) ? a : []; }
  function isFav(k) { return favs().indexOf(k) >= 0; }
  function toggleFav(k) { var a = favs(), i = a.indexOf(k); if (i >= 0) a.splice(i, 1); else a.unshift(k); U.save(FAV, a); return i < 0; }
  function catalogue() {
    var out = CORE.map(function (c) { return { id: c[0], icon: c[1], label: c[2], group: c[3] }; });
    var st = (window.CL_STUDIO && window.CL_STUDIO.tiles) || [];
    st.forEach(function (t) { var id = String(t.href || '').replace(/^#\/hub\//, ''); if (id) out.push({ id: id, icon: t.icon, label: t.label, group: t.group || 'tools' }); });
    return out;
  }
  function bump(id) {
    var rec = U.load(REC, []); rec = rec.filter(function (x) { return x !== id; }); rec.unshift(id); U.save(REC, rec.slice(0, 8));
    var use = U.load(USE, {}); use[id] = (use[id] || 0) + 1; U.save(USE, use); return use[id];
  }

  var lastTool = '';
  function decorateTool(id) {
    var page = $('.hub-tool-page'); if (!page) return;
    if (page.getAttribute('data-hpro') === id) return;
    page.setAttribute('data-hpro', id);
    var n = bump(id);
    var anchor = $('.lead', page) || $('h1', page); if (!anchor) return;
    var bar = document.createElement('div'); bar.className = 'hpro-bar'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Tool actions');
    bar.innerHTML = '<button type="button" data-pro="fav" aria-pressed="' + isFav('#/hub/' + id) + '">' + (isFav('#/hub/' + id) ? '★ Pinned' : '☆ Pin') + '</button>' +
      '<button type="button" data-pro="notes">📝 নোট</button><button type="button" data-pro="copy">⧉ ফলাফল কপি</button>' +
      '<button type="button" data-pro="print">🖨 Print / PDF</button><button type="button" data-pro="focus">⛶ ফোকাস মোড</button>' +
      '<span class="hpro-sp"></span><small>' + E(String(n)) + ' বার ব্যবহার</small>';
    anchor.insertAdjacentElement('afterend', bar);
    var notes = document.createElement('details'); notes.className = 'hpro-notes';
    var saved = U.load('clpro_note_' + id, '');
    notes.innerHTML = '<summary>📝 এই টুলের ব্যক্তিগত নোট</summary><textarea placeholder="এই টুল নিয়ে নিজের নোট, সূত্র বা মনে রাখার বিষয় লিখে রাখুন — স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়…" data-pro-note="' + E(id) + '"></textarea>';
    $('textarea', notes).value = saved; if (saved) notes.open = true;
    page.appendChild(notes);
    // Related-tool suggestions are intentionally omitted from individual tool pages.
  }

  function decorateHome() {
    var groups = $$('.hub-tool-group'); if (!groups.length || $('.hpro-find')) return;
    var first = groups[0];
    var tiles = $$('.hub-launch-tile');
    tiles.forEach(function (t) {
      if (t.querySelector('.hpro-star')) return;
      var k = t.getAttribute('href'), b = document.createElement('button');
      b.type = 'button'; b.className = 'hpro-star'; b.setAttribute('data-star', k); b.setAttribute('aria-label', 'Pin tool');
      b.setAttribute('aria-pressed', isFav(k) ? 'true' : 'false'); b.textContent = isFav(k) ? '★' : '☆'; t.appendChild(b);
    });
    var find = document.createElement('div'); find.className = 'hpro-find';
    find.innerHTML = '<label class="hpro-search"><b aria-hidden="true">⌕</b><input type="search" id="hproQ" placeholder="টুল খুঁজুন — যেমন: balance, pH, complex, timer…" autocomplete="off" aria-label="Search tools"></label>' +
      '<div class="hpro-quick" id="hproQuick"></div><div class="hpro-count" id="hproCount"></div>';
    first.parentNode.insertBefore(find, first);
    var none = document.createElement('div'); none.className = 'hpro-none'; none.id = 'hproNone'; none.hidden = true; none.textContent = 'কোনো টুল মেলেনি — অন্য শব্দ দিয়ে চেষ্টা করুন।';
    groups[groups.length - 1].insertAdjacentElement('afterend', none);
    quick(); applyFilter();
  }
  function tileByHref(h) { return $$('.hub-launch-tile').filter(function (t) { return t.getAttribute('href') === h; })[0]; }
  function quick() {
    var box = $('#hproQuick'); if (!box) return; var out = '';
    var f = favs().map(tileByHref).filter(Boolean);
    if (f.length) out += '<h5>★ পিন করা টুল</h5>' + f.map(function (t) { return '<a href="' + E(t.getAttribute('href')) + '">' + E($('b', t).textContent) + '</a>'; }).join('');
    // Recently-used shortcuts are intentionally not displayed beneath the search field.
    box.innerHTML = out;
  }
  var chipSel = 'all';
  function applyFilter() {
    var qEl = $('#hproQ'); if (!qEl) return;
    var q = qEl.value.trim().toLowerCase(), shown = 0, groups = $$('.hub-tool-group');
    groups.forEach(function (g, i) {
      var ok = chipSel === 'all' || String(i) === chipSel, vis = 0;
      $$('.hub-launch-tile', g).forEach(function (t) {
        var hit = ok && (!q || t.textContent.toLowerCase().indexOf(q) >= 0); t.hidden = !hit; if (hit) vis++;
      });
      g.hidden = vis === 0; shown += vis;
    });
    var c = $('#hproCount'); if (c) c.textContent = shown + 'টি টুল দেখানো হচ্ছে';
    var n = $('#hproNone'); if (n) n.hidden = shown > 0;
  }

  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var star = t.closest('.hpro-star');
    if (star) {
      e.preventDefault(); e.stopPropagation();
      var on = toggleFav(star.getAttribute('data-star')); star.setAttribute('aria-pressed', on ? 'true' : 'false'); star.textContent = on ? '★' : '☆'; quick(); return;
    }
    var chip = t.closest('[data-chip]');
    if (chip) { chipSel = chip.getAttribute('data-chip'); $$('[data-chip]').forEach(function (b) { b.setAttribute('aria-pressed', b === chip ? 'true' : 'false'); }); applyFilter(); return; }
    var b = t.closest('[data-pro]'); if (!b) return;
    var id = route().tool, a = b.getAttribute('data-pro'), page = $('.hub-tool-page');
    if (a === 'fav') { var on2 = toggleFav('#/hub/' + id); b.setAttribute('aria-pressed', on2 ? 'true' : 'false'); b.textContent = on2 ? '★ Pinned' : '☆ Pin'; U.toast(on2 ? 'টুল পিন করা হয়েছে' : 'পিন সরানো হয়েছে'); }
    else if (a === 'notes') { var d = $('.hpro-notes', page); if (d) { d.open = !d.open; if (d.open) { d.scrollIntoView({ behavior: 'smooth', block: 'center' }); var ta = $('textarea', d); if (ta) ta.focus(); } } }
    else if (a === 'copy') {
      var src = $('.tk-out', page) || $('.hp-body', page) || $('.tk-card', page) || page;
      var txt = (src.innerText || '').replace(/\n{3,}/g, '\n\n').trim(); if (txt) U.copy(txt); else U.toast('কপি করার মতো ফলাফল নেই');
    }
    else if (a === 'print') { window.print(); }
    else if (a === 'focus') { var on3 = document.documentElement.classList.toggle('hpro-focus'); b.textContent = on3 ? '⛶ বের হন (Esc)' : '⛶ ফোকাস মোড'; }
  }, true);
  document.addEventListener('input', function (e) {
    var t = e.target; if (!t || !t.getAttribute) return;
    if (t.id === 'hproQ') applyFilter();
    var nid = t.getAttribute('data-pro-note'); if (nid) U.save('clpro_note_' + nid, t.value);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.documentElement.classList.contains('hpro-focus')) { document.documentElement.classList.remove('hpro-focus'); var b = $('[data-pro="focus"]'); if (b) b.textContent = '⛶ ফোকাস মোড'; }
  });

  function enhance() {
    var r = route();
    if (r.page !== 'hub') { document.documentElement.classList.remove('hpro-focus'); lastTool = ''; return; }
    if (r.tool) decorateTool(r.tool); else { document.documentElement.classList.remove('hpro-focus'); decorateHome(); }
  }
  var pend = false;
  function schedule() { if (pend) return; pend = true; requestAnimationFrame(function () { pend = false; try { enhance(); } catch (e) { } }); }
  window.addEventListener('hashchange', function () { setTimeout(schedule, 60); setTimeout(schedule, 400); });
  function boot() {
    var app = document.getElementById('app');
    if (app && 'MutationObserver' in window) new MutationObserver(schedule).observe(app, { childList: true });
    schedule();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  /* ═════════════ B · new tools ═════════════ */
  if (!HP) return;
  var SCI = 'science';
  function nf(x, d) {
    if (typeof x !== 'number' || !isFinite(x)) return '—';
    if (x === 0) return '0';
    var a = Math.abs(x); d = d || 6;
    if (a >= 1e9 || a < 1e-4) return Number(x.toPrecision(d)).toExponential().replace('e+', ' × 10^').replace('e-', ' × 10^-');
    return String(Number(x.toPrecision(d)));
  }
  function num(id) { var el = document.getElementById(id); if (!el) return NaN; var v = String(el.value).trim().replace(/,/g, '.'); return v === '' ? NaN : Number(v); }
  function raw(id) { var el = document.getElementById(id); return el ? String(el.value).trim() : ''; }
  function stat(k, v, hi) { return '<div class="pro-stat' + (hi ? ' hi' : '') + '"><span>' + k + '</span><b>' + v + '</b></div>'; }
  function fld(id, label, val, ph, type) { return '<label class="pro-f"><span>' + label + '</span><input id="' + id + '" type="' + (type || 'text') + '" inputmode="' + (type === 'text' || !type ? 'decimal' : 'decimal') + '" value="' + E(val == null ? '' : val) + '"' + (ph ? ' placeholder="' + E(ph) + '"' : '') + ' autocomplete="off" spellcheck="false"></label>'; }
  function sel(id, label, opts, cur) { return '<label class="pro-f"><span>' + label + '</span><select id="' + id + '">' + opts.map(function (o) { return '<option value="' + E(o[0]) + '"' + (String(o[0]) === String(cur) ? ' selected' : '') + '>' + E(o[1]) + '</option>'; }).join('') + '</select></label>'; }
  function seg(items, cur) { return '<div class="pro-seg">' + items.map(function (i) { return '<button type="button" data-a="mode" data-v="' + i[0] + '" aria-pressed="' + (i[0] === cur) + '">' + E(i[1]) + '</button>'; }).join('') + '</div>'; }
  function keep(id, def) { return { get: function () { var v = U.load('clpro_s_' + id, null); if (!v) return JSON.parse(JSON.stringify(def)); for (var k in def) if (!(k in v)) v[k] = def[k]; return v; }, set: function (v) { U.save('clpro_s_' + id, v); } }; }
  function guideBox(title, steps) { return '<details class="hp-guide"><summary>💡 ' + title + '</summary><ol>' + steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol></details>'; }
  function out(html) { var o = document.getElementById('proOut'); if (o) o.innerHTML = html; }
  function bad(msg) { return '<div class="pro-note pro-bad">' + E(msg) + '</div>'; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }

  /* ---------- 1 · Equation Balancer ---------- */
  (function () {
    var S = keep('balancer', { eq: 'KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2' });
    function sub(f) { return E(f).replace(/(?<=[A-Za-z)\]])(\d+)/g, '<sub>$1</sub>'); }
    function addTo(o, k, v) { o[k] = (o[k] || 0) + v; }
    function parseGroup(s) {
      var i = 0;
      function number() { var st = i; while (i < s.length && /\d/.test(s[i])) i++; return st === i ? 1 : parseInt(s.slice(st, i), 10); }
      function grp(close) {
        var res = {};
        while (i < s.length) {
          var c = s[i];
          if (c === '(' || c === '[') { i++; var inner = grp(c === '(' ? ')' : ']'), n = number(); for (var k in inner) addTo(res, k, inner[k] * n); }
          else if (c === ')' || c === ']') { if (close) { i++; return res; } throw new Error('বন্ধনী মেলেনি'); }
          else if (/[A-Z]/.test(c)) { var el = c; i++; while (i < s.length && /[a-z]/.test(s[i])) { el += s[i]; i++; } addTo(res, el, number()); }
          else throw new Error('অচেনা চিহ্ন "' + c + '" (শুধু মৌলের প্রতীক, সংখ্যা ও বন্ধনী ব্যবহার করুন)');
        }
        if (close) throw new Error('বন্ধনী মেলেনি');
        return res;
      }
      return grp(null);
    }
    function parseCompound(c) {
      var parts = c.split(/[.·*•]/), tot = {};
      parts.forEach(function (p, idx) {
        p = p.trim(); var m = idx > 0 ? p.match(/^(\d+)\s*(.*)$/) : null, mult = 1;
        if (m) { mult = parseInt(m[1], 10); p = m[2]; }
        if (!p) throw new Error('ফাঁকা যৌগ');
        var o = parseGroup(p); for (var k in o) addTo(tot, k, o[k] * mult);
      });
      return tot;
    }
    /* rational arithmetic with small integers */
    function F(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d) || 1; return [n / g, d / g]; }
    function fadd(a, b) { return F(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
    function fmul(a, b) { return F(a[0] * b[0], a[1] * b[1]); }
    function fdiv(a, b) { return F(a[0] * b[1], a[1] * b[0]); }
    function nullspace(M, cols) {
      var rows = M.length, piv = [], r = 0, c;
      for (c = 0; c < cols && r < rows; c++) {
        var p = -1; for (var i = r; i < rows; i++) if (M[i][c][0] !== 0) { p = i; break; }
        if (p < 0) continue;
        var t = M[p]; M[p] = M[r]; M[r] = t;
        var pv = M[r][c]; for (var j = 0; j < cols; j++) M[r][j] = fdiv(M[r][j], pv);
        for (i = 0; i < rows; i++) if (i !== r && M[i][c][0] !== 0) { var f = M[i][c]; for (j = 0; j < cols; j++) M[i][j] = fadd(M[i][j], fmul([-f[0], f[1]], M[r][j])); }
        piv.push(c); r++;
      }
      var free = []; for (c = 0; c < cols; c++) if (piv.indexOf(c) < 0) free.push(c);
      return { piv: piv, free: free, M: M };
    }
    function balance(eq) {
      var sides = eq.split(/\s*(?:->|→|=>|⟶|⇒|=)\s*/);
      if (sides.length !== 2 || !sides[0].trim() || !sides[1].trim()) throw new Error('সমীকরণে একটি তীর (→ বা ->) থাকতে হবে, যেমন: H2 + O2 -> H2O');
      var comps = [], sign = [];
      sides.forEach(function (s, si) { s.split('+').forEach(function (c) { c = c.trim().replace(/^\d+\s*(?=[A-Z(\[])/, ''); if (!c) throw new Error('একটি যৌগ ফাঁকা রয়েছে'); comps.push(c); sign.push(si === 0 ? 1 : -1); }); });
      var parsed = comps.map(parseCompound), els = [];
      parsed.forEach(function (p) { for (var k in p) if (els.indexOf(k) < 0) els.push(k); });
      var left = parsed.filter(function (_, i) { return sign[i] === 1; }), right = parsed.filter(function (_, i) { return sign[i] === -1; });
      var missing = els.filter(function (e) { return !left.some(function (p) { return p[e]; }) || !right.some(function (p) { return p[e]; }); });
      if (missing.length) throw new Error('"' + missing[0] + '" মৌলটি সমীকরণের দুই পাশে নেই — সমীকরণ ঠিক আছে কি দেখুন');
      var M = els.map(function (e) { return parsed.map(function (p, i) { return F((p[e] || 0) * sign[i], 1); }); });
      var ns = nullspace(M, comps.length);
      if (ns.free.length === 0) throw new Error('এই সমীকরণ ভারসাম্যে আনা সম্ভব হচ্ছে না — সূত্রগুলো আবার মিলিয়ে দেখুন');
      if (ns.free.length > 1) throw new Error('একাধিক ভিন্ন বিক্রিয়া মিশে আছে (সমাধান অনন্য নয়) — আলাদা আলাদা বিক্রিয়া হিসেবে লিখুন');
      var fc = ns.free[0], vec = new Array(comps.length).fill(null).map(function () { return [0, 1]; });
      vec[fc] = [1, 1];
      ns.piv.forEach(function (pc, ri) { vec[pc] = F(-ns.M[ri][fc][0], ns.M[ri][fc][1]); });
      var l = 1; vec.forEach(function (v) { l = l * v[1] / gcd(l, v[1]); });
      var ints = vec.map(function (v) { return v[0] * (l / v[1]); });
      if (ints.some(function (x) { return x <= 0; })) throw new Error('ধনাত্মক পূর্ণসংখ্যা সহগ পাওয়া গেল না — সূত্র/বিক্রিয়কের তালিকা মিলিয়ে দেখুন');
      var g = ints.reduce(function (a, b) { return gcd(a, b); }, 0); ints = ints.map(function (x) { return x / g; });
      return { comps: comps, sign: sign, co: ints, parsed: parsed, els: els };
    }
    function render() {
      var st = S.get();
      return '<div class="pro-grid two"><div class="pro-card"><h3>সমীকরণ লিখুন</h3>' +
        '<label class="pro-f"><span>অসম্পূর্ণ সমীকরণ (→ বা -> ব্যবহার করুন)</span><textarea id="proEq" rows="3" spellcheck="false">' + E(st.eq) + '</textarea></label>' +
        '<div class="pro-chips">' + [
          'H2 + O2 -> H2O', 'C3H8 + O2 -> CO2 + H2O', 'Fe + O2 -> Fe2O3', 'Al + H2SO4 -> Al2(SO4)3 + H2',
          'KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2', 'C6H12O6 + O2 -> CO2 + H2O', 'CuSO4.5H2O -> CuSO4 + H2O', 'Ca(OH)2 + H3PO4 -> Ca3(PO4)2 + H2O'
        ].map(function (x) { return '<button type="button" data-a="ex" data-v="' + E(x) + '">' + sub(x.replace('->', '→')) + '</button>'; }).join('') + '</div>' +
        guideBox('কীভাবে ব্যবহার করবেন?', ['বিক্রিয়ক ও উৎপাদের সঠিক সংকেত লিখুন (বড়/ছোট হাতের অক্ষর গুরুত্বপূর্ণ: Co ≠ CO)।', 'সহগ (যেমন 2H2O) না লিখলেও চলবে — টুল নিজে বের করবে।', 'বন্ধনী ( ) [ ] এবং কেলাস-জল (CuSO4.5H2O) সমর্থিত।', 'আয়নিক চার্জ (Fe³⁺ ইত্যাদি) সমর্থিত নয়।']) +
        '</div><div class="pro-card"><h3>ফলাফল</h3><div id="proOut"></div></div></div>';
    }
    function compute() {
      var el = document.getElementById('proEq'); if (!el) return; var eq = el.value; var st = S.get(); st.eq = eq; S.set(st);
      if (!eq.trim()) { out('<div class="pro-note">উপরে একটি সমীকরণ লিখুন।</div>'); return; }
      try {
        var r = balance(eq), L = [], R = [];
        r.comps.forEach(function (c, i) { var t = (r.co[i] > 1 ? r.co[i] + ' ' : '') + sub(c); (r.sign[i] === 1 ? L : R).push(t); });
        var rows = r.els.map(function (e) {
          var l = 0, rr = 0; r.parsed.forEach(function (p, i) { var n = (p[e] || 0) * r.co[i]; if (r.sign[i] === 1) l += n; else rr += n; });
          return '<tr><td>' + E(e) + '</td><td>' + l + '</td><td>' + rr + '</td><td>' + (l === rr ? '✓' : '✗') + '</td></tr>';
        }).join('');
        out('<div class="pro-eq">' + L.join(' + ') + ' → ' + R.join(' + ') + '</div>' +
          '<div class="pro-res" style="margin-top:12px">' + stat('বিক্রিয়ক সহগ', r.co.filter(function (_, i) { return r.sign[i] === 1; }).join(', ')) + stat('উৎপাদ সহগ', r.co.filter(function (_, i) { return r.sign[i] === -1; }).join(', ')) + stat('মোট মৌল', String(r.els.length)) + '</div>' +
          '<div class="pro-scroll" style="margin-top:12px"><table class="pro-table"><thead><tr><th>মৌল</th><th>বাম পাশ</th><th>ডান পাশ</th><th>মিল</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
          '<div class="pro-note">নিয়ম: প্রতিটি মৌলের পরমাণুর সংখ্যা সমীকরণের দুই পাশে সমান হতে হবে (ভরের নিত্যতা সূত্র)।</div>');
      } catch (e) { out(bad(e.message || 'সমীকরণটি পড়া যায়নি')); }
    }
    HP.add({
      id: 'balancer', icon: '⚖️', label: 'রাসায়নিক সমীকরণ ব্যালেন্স', desc: 'রাসায়নিক সমীকরণ নিজে নিজে ভারসাম্যে আনুন — পরমাণু-গণনাসহ', group: SCI, priority: 9, highlight: true,
      render: render, mount: compute, afterPaint: compute,
      input: function (el) { if (el.id === 'proEq') compute(); },
      click: function (el) { if (el.dataset.a === 'ex') { var st = S.get(); st.eq = el.dataset.v; S.set(st); HP.paint(); } }
    });
  })();

  /* ---------- 2 · Element Explorer ---------- */
  (function () {
    var RAW = 'H Hydrogen 1.008;He Helium 4.0026;Li Lithium 6.94;Be Beryllium 9.0122;B Boron 10.81;C Carbon 12.011;N Nitrogen 14.007;O Oxygen 15.999;F Fluorine 18.998;Ne Neon 20.180;Na Sodium 22.990;Mg Magnesium 24.305;Al Aluminium 26.982;Si Silicon 28.085;P Phosphorus 30.974;S Sulfur 32.06;Cl Chlorine 35.45;Ar Argon 39.948;K Potassium 39.098;Ca Calcium 40.078;Sc Scandium 44.956;Ti Titanium 47.867;V Vanadium 50.942;Cr Chromium 51.996;Mn Manganese 54.938;Fe Iron 55.845;Co Cobalt 58.933;Ni Nickel 58.693;Cu Copper 63.546;Zn Zinc 65.38;Ga Gallium 69.723;Ge Germanium 72.630;As Arsenic 74.922;Se Selenium 78.971;Br Bromine 79.904;Kr Krypton 83.798;Rb Rubidium 85.468;Sr Strontium 87.62;Y Yttrium 88.906;Zr Zirconium 91.224;Nb Niobium 92.906;Mo Molybdenum 95.95;Tc Technetium 98;Ru Ruthenium 101.07;Rh Rhodium 102.91;Pd Palladium 106.42;Ag Silver 107.87;Cd Cadmium 112.41;In Indium 114.82;Sn Tin 118.71;Sb Antimony 121.76;Te Tellurium 127.60;I Iodine 126.90;Xe Xenon 131.29;Cs Caesium 132.91;Ba Barium 137.33;La Lanthanum 138.91;Ce Cerium 140.12;Pr Praseodymium 140.91;Nd Neodymium 144.24;Pm Promethium 145;Sm Samarium 150.36;Eu Europium 151.96;Gd Gadolinium 157.25;Tb Terbium 158.93;Dy Dysprosium 162.50;Ho Holmium 164.93;Er Erbium 167.26;Tm Thulium 168.93;Yb Ytterbium 173.05;Lu Lutetium 174.97;Hf Hafnium 178.49;Ta Tantalum 180.95;W Tungsten 183.84;Re Rhenium 186.21;Os Osmium 190.23;Ir Iridium 192.22;Pt Platinum 195.08;Au Gold 196.97;Hg Mercury 200.59;Tl Thallium 204.38;Pb Lead 207.2;Bi Bismuth 208.98;Po Polonium 209;At Astatine 210;Rn Radon 222;Fr Francium 223;Ra Radium 226;Ac Actinium 227;Th Thorium 232.04;Pa Protactinium 231.04;U Uranium 238.03;Np Neptunium 237;Pu Plutonium 244;Am Americium 243;Cm Curium 247;Bk Berkelium 247;Cf Californium 251;Es Einsteinium 252;Fm Fermium 257;Md Mendelevium 258;No Nobelium 259;Lr Lawrencium 266;Rf Rutherfordium 267;Db Dubnium 268;Sg Seaborgium 269;Bh Bohrium 270;Hs Hassium 277;Mt Meitnerium 278;Ds Darmstadtium 281;Rg Roentgenium 282;Cn Copernicium 285;Nh Nihonium 286;Fl Flerovium 289;Mc Moscovium 290;Lv Livermorium 293;Ts Tennessine 294;Og Oganesson 294';
    var EL = RAW.split(';').map(function (r, i) { var p = r.split(' '); return { z: i + 1, s: p[0], n: p[1], m: parseFloat(p[2]) }; });
    var CAT = {
      alk: ['ক্ষার ধাতু (Alkali metal)', '#e0577d'], alke: ['ক্ষারমৃত্তিকা ধাতু', '#e58a3a'], tm: ['অবস্থান্তর ধাতু', '#4f7cdd'], pt: ['পোস্ট-ট্রানজিশন ধাতু', '#43a6a0'],
      meta: ['ধাতুকল্প (Metalloid)', '#8b73d6'], nm: ['অধাতু', '#4aae6a'], hal: ['হ্যালোজেন', '#c6b43a'], ng: ['নিস্ক্রিয় গ্যাস', '#6e7fb8'], lan: ['ল্যান্থানাইড', '#c46bb0'], act: ['অ্যাক্টিনাইড', '#a35a86']
    };
    function pos(z) {
      if (z === 1) return [1, 1]; if (z === 2) return [1, 18];
      if (z <= 4) return [2, z - 2]; if (z <= 10) return [2, z + 8];
      if (z <= 12) return [3, z - 10]; if (z <= 18) return [3, z];
      if (z <= 36) return [4, z - 18]; if (z <= 54) return [5, z - 36];
      if (z <= 56) return [6, z - 54]; if (z >= 57 && z <= 70) return [9, z - 57 + 4]; if (z === 71) return [6, 3]; if (z <= 86) return [6, z - 68];
      if (z <= 88) return [7, z - 86]; if (z >= 89 && z <= 102) return [10, z - 89 + 4]; if (z === 103) return [7, 3]; return [7, z - 100];
    }
    function cat(z) {
      if ([3, 11, 19, 37, 55, 87].indexOf(z) >= 0) return 'alk'; if ([4, 12, 20, 38, 56, 88].indexOf(z) >= 0) return 'alke';
      if ([2, 10, 18, 36, 54, 86, 118].indexOf(z) >= 0) return 'ng'; if ([9, 17, 35, 53, 85, 117].indexOf(z) >= 0) return 'hal';
      if ([5, 14, 32, 33, 51, 52].indexOf(z) >= 0) return 'meta'; if ([1, 6, 7, 8, 15, 16, 34].indexOf(z) >= 0) return 'nm';
      if (z >= 57 && z <= 71) return 'lan'; if (z >= 89 && z <= 103) return 'act';
      if ((z >= 21 && z <= 30) || (z >= 39 && z <= 48) || (z >= 72 && z <= 80) || (z >= 104 && z <= 112)) return 'tm';
      return 'pt';
    }
    var ORDER = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'], CAP = { s: 2, p: 6, d: 10, f: 14 };
    var OVR = { 24: { '4s': 1, '3d': 5 }, 29: { '4s': 1, '3d': 10 }, 41: { '5s': 1, '4d': 4 }, 42: { '5s': 1, '4d': 5 }, 44: { '5s': 1, '4d': 7 }, 45: { '5s': 1, '4d': 8 }, 46: { '5s': 0, '4d': 10 }, 47: { '5s': 1, '4d': 10 }, 57: { '4f': 0, '5d': 1 }, 58: { '4f': 1, '5d': 1 }, 64: { '4f': 7, '5d': 1 }, 78: { '6s': 1, '5d': 9 }, 79: { '6s': 1, '5d': 10 }, 89: { '5f': 0, '6d': 1 }, 90: { '5f': 0, '6d': 2 }, 91: { '5f': 2, '6d': 1 }, 92: { '5f': 3, '6d': 1 }, 93: { '5f': 4, '6d': 1 }, 96: { '5f': 7, '6d': 1 }, 103: { '6d': 0, '7p': 1 } };
    function counts(z) {
      var left = z, c = {}; ORDER.forEach(function (s) { var n = Math.min(CAP[s[1]], left); c[s] = n; left -= n; });
      var o = OVR[z]; if (o) for (var k in o) c[k] = o[k]; return c;
    }
    var SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    function sup(n) { return String(n).replace(/\d/g, function (d) { return SUP[+d]; }); }
    function cfg(z) {
      var c = counts(z), noble = [2, 10, 18, 36, 54, 86], core = 0; noble.forEach(function (n) { if (n < z) core = n; });
      var full = ORDER.filter(function (s) { return c[s] > 0; }).map(function (s) { return s + sup(c[s]); }).join(' ');
      var short = full;
      if (core) { var cc = counts(core); short = '[' + EL[core - 1].s + '] ' + ORDER.filter(function (s) { return c[s] - cc[s] > 0; }).map(function (s) { return s + sup(c[s] - cc[s]); }).join(' '); }
      return { full: full, short: short };
    }
    function group(z) { var p = pos(z); if (p[0] >= 9) return null; return p[1]; }
    function block(z) { if ((z >= 57 && z <= 70) || (z >= 89 && z <= 102)) return 'f'; var g = group(z); if (z === 2) return 's'; if (g <= 2) return 's'; if (g <= 12) return 'd'; return 'p'; }
    function valence(z) { var g = group(z); if (!g) return 'f-ব্লক — পরিবর্তনশীল'; if (g <= 2) return String(g); if (g >= 13) return String(z === 2 ? 2 : g - 10); return 'd-ব্লক — পরিবর্তনশীল (ns + (n−1)d)'; }
    var sel = 8, query = '';
    function match(e, q) { q = q.toLowerCase(); return !q || e.s.toLowerCase() === q || e.n.toLowerCase().indexOf(q) === 0 || String(e.z) === q || e.n.toLowerCase().indexOf(q) >= 0; }
    function gridHtml() {
      var cells = [];
      EL.forEach(function (e) {
        var p = pos(e.z), c = cat(e.z);
        cells.push('<button type="button" class="pt-c' + (e.z === sel ? ' on' : '') + (match(e, query) ? '' : ' dim') + '" data-a="pick" data-z="' + e.z + '" style="grid-row:' + (p[0] > 7 ? p[0] + 1 : p[0]) + ';grid-column:' + p[1] + ';--c:' + CAT[c][1] + '" title="' + E(e.n) + '"><small>' + e.z + '</small>' + E(e.s) + '</button>');
      });
      return '<div class="pt-wrap"><div class="pt-grid" id="ptGrid">' + cells.join('') + '</div></div><div class="pt-legend">' + Object.keys(CAT).map(function (k) { return '<span><i style="--c:' + CAT[k][1] + '"></i>' + CAT[k][0] + '</span>'; }).join('') + '</div>';
    }
    function detail() {
      var e = EL[sel - 1], c = cat(e.z), cf = cfg(e.z), p = pos(e.z), g = group(e.z), mass = Math.round(e.m);
      return '<div class="pt-hero"><div class="pt-big" style="--c:' + CAT[c][1] + '"><small>' + e.z + '</small><b>' + E(e.s) + '</b></div><div><h3 style="margin:0 0 4px;font-size:22px;opacity:1;text-transform:none;letter-spacing:0">' + E(e.n) + '</h3><div style="opacity:.75;font-weight:600">' + CAT[c][0] + '</div></div></div>' +
        '<div class="pro-res" style="margin-top:14px">' + stat('পারমাণবিক সংখ্যা (Z)', String(e.z), true) + stat('পারমাণবিক ভর', nf(e.m, 6) + ' u', true) + stat('পর্যায় (Period)', p[0] > 7 ? (p[0] === 9 ? '6' : '7') : String(p[0])) + stat('শ্রেণি (Group)', g ? String(g) : 'f-ব্লক') + stat('ব্লক', block(e.z) + '-block') + stat('প্রোটন / ইলেকট্রন', e.z + ' / ' + e.z) + stat('নিউট্রন (প্রায়)', String(Math.max(0, mass - e.z))) + stat('ভর সংখ্যা (প্রায়)', String(mass)) + stat('যোজ্যতা ইলেকট্রন', valence(e.z)) + '</div>' +
        '<div class="pro-note"><b>ইলেকট্রন বিন্যাস:</b><br><span style="font:600 16px/1.9 \'STIX Two Text\',Georgia,serif">' + cf.full + '</span><br><b>সংক্ষিপ্ত:</b> <span style="font:600 16px/1.9 \'STIX Two Text\',Georgia,serif">' + cf.short + '</span>' + (OVR[e.z] ? '<br><small>★ এটি আউফবাউ নিয়মের ব্যতিক্রম (স্থিতিশীল অর্ধ-পূর্ণ/পূর্ণ উপস্তর)।</small>' : '') + '</div>';
    }
    function render() {
      return '<div class="pro-grid"><div class="pro-card"><div class="pro-fields one">' + fld('ptQ', 'নাম, প্রতীক বা পারমাণবিক সংখ্যা দিয়ে খুঁজুন', query, 'যেমন: Fe, Sodium, 26') + '</div></div>' +
        '<div class="pro-card"><h3>আবর্তসারণি — যেকোনো মৌলে ট্যাপ করুন</h3>' + gridHtml() + '</div><div class="pro-card" id="ptDetail">' + detail() + '</div></div>';
    }
    function refresh() {
      var d = document.getElementById('ptDetail'); if (d) d.innerHTML = detail();
      $$('#ptGrid .pt-c').forEach(function (b) { var z = +b.dataset.z; b.classList.toggle('on', z === sel); b.classList.toggle('dim', !match(EL[z - 1], query)); });
    }
    HP.add({
      id: 'elements', icon: '⚛️', label: 'মৌল পরিচিতি', desc: '১১৮টি মৌল — ভর, শ্রেণি-পর্যায়, ইলেকট্রন বিন্যাস ও যোজ্যতা ইলেকট্রন', group: SCI, priority: 8,
      render: render,
      input: function (el) {
        if (el.id !== 'ptQ') return; query = el.value.trim();
        if (query) { var m = EL.filter(function (e) { return match(e, query); }); var ex = m.filter(function (e) { return e.s.toLowerCase() === query.toLowerCase() || String(e.z) === query; })[0] || m[0]; if (ex) sel = ex.z; }
        refresh();
      },
      click: function (el) { if (el.dataset.a === 'pick') { sel = +el.dataset.z; refresh(); var d = document.getElementById('ptDetail'); if (d && window.innerWidth < 900) d.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } }
    });
  })();

  /* ---------- shared factory for form → live result tools ---------- */
  function nv(st, id) { var s = String(st.f[id] == null ? '' : st.f[id]).trim().replace(/,/g, '.'); return s === '' ? NaN : Number(s); }
  function makeTool(cfg) {
    var S = keep(cfg.id, cfg.def);
    function render() {
      var st = S.get();
      return '<div class="pro-grid two"><div class="pro-card">' + (cfg.modes ? seg(cfg.modes, st.mode) : '') + '<div class="pro-fields">' + cfg.form(st) + '</div>' + (cfg.extra ? cfg.extra(st) : '') + (cfg.guide ? guideBox('কীভাবে ব্যবহার করবেন?', cfg.guide) : '') + '</div>' +
        '<div class="pro-card"><h3>ফলাফল ও ধাপ</h3><div id="proOut"></div></div></div>';
    }
    function compute() { var st = S.get(); try { out(cfg.calc(st)); } catch (e) { out(bad(e && e.message ? e.message : 'হিসাব করা যায়নি')); } }
    function store(el) { if (!el.id) return false; var st = S.get(); st.f[el.id] = el.value; S.set(st); return true; }
    HP.add({
      id: cfg.id, icon: cfg.icon, label: cfg.label, desc: cfg.desc, group: cfg.group || SCI, priority: cfg.priority || 0, highlight: !!cfg.highlight,
      render: render, mount: compute, afterPaint: compute,
      input: function (el) { if (el.tagName !== 'SELECT' && store(el)) compute(); },
      change: function (el) { if (el.tagName === 'SELECT' && store(el)) { if (cfg.repaintOn && cfg.repaintOn.indexOf(el.id) >= 0) HP.paint(); else compute(); } },
      click: function (el) {
        var st = S.get();
        if (el.dataset.a === 'mode') { st.mode = el.dataset.v; S.set(st); HP.paint(); }
        else if (el.dataset.a === 'ex' && cfg.examples) { var ex = cfg.examples[+el.dataset.v]; if (ex) { st.mode = ex.mode || st.mode; for (var k in ex.f) st.f[k] = ex.f[k]; S.set(st); HP.paint(); } }
      }
    });
    return S;
  }
  function exChips(list) { return '<div class="pro-chips" style="grid-column:1/-1">' + list.map(function (x, i) { return '<button type="button" data-a="ex" data-v="' + i + '">' + E(x.label) + '</button>'; }).join('') + '</div>'; }
  function steps(list) { return '<ol class="pro-steps">' + list.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>'; }
  function needNum(vals, names) { for (var i = 0; i < vals.length; i++) if (isNaN(vals[i])) throw new Error('"' + names[i] + '" ঘরে সঠিক সংখ্যা দিন'); }

  /* ---------- 3 · pH & Solution Lab ---------- */
  (function () {
    var KW = 1e-14, lg = Math.log10;
    function phBlock(H) {
      var OH = KW / H, pH = -lg(H), pOH = -lg(OH);
      var nature = pH < 6.95 ? 'অম্লীয় (Acidic)' : (pH > 7.05 ? 'ক্ষারীয় (Basic)' : 'প্রশম (Neutral)');
      return '<div class="pro-res">' + stat('pH', nf(pH, 5), true) + stat('pOH', nf(pOH, 5)) + stat('[H⁺] mol/L', nf(H, 5)) + stat('[OH⁻] mol/L', nf(OH, 5)) + stat('প্রকৃতি (25°C)', nature) + '</div>';
    }
    var cfg = {
      id: 'solution', icon: '💧', label: 'pH ও দ্রবণ', desc: 'pH, দুর্বল অম্ল/ক্ষার, মোলারিটি, মিশ্রণ-লঘুকরণ ও বাফার — ধাপে ধাপে', priority: 8,
      def: { mode: 'ph', f: { known: 'pH', val: '3.5', stype: 'acid', sC: '0.01', sN: '1', wtype: 'acid', wK: '1.8e-5', wC: '0.1', M1: '2', V1: '50', M2: '', V2: '250', mass: '5.85', Mw: '58.44', vol: '500', Mol: '', pKa: '4.76', A: '0.2', HA: '0.1', tpH: '' } },
      modes: [['ph', 'pH রূপান্তর'], ['strong', 'তীব্র অম্ল/ক্ষার'], ['weak', 'দুর্বল অম্ল/ক্ষার'], ['dilute', 'লঘুকরণ M₁V₁=M₂V₂'], ['molar', 'মোলারিটি'], ['buffer', 'বাফার']],
      repaintOn: [],
      form: function (st) {
        var f = st.f;
        if (st.mode === 'ph') return sel('known', 'কোনটি জানা আছে?', [['pH', 'pH'], ['pOH', 'pOH'], ['H', '[H⁺] (mol/L)'], ['OH', '[OH⁻] (mol/L)']], f.known) + fld('val', 'মান', f.val, 'যেমন 3.5 বা 1e-4');
        if (st.mode === 'strong') return sel('stype', 'ধরন', [['acid', 'তীব্র অম্ল (HCl, H₂SO₄…)'], ['base', 'তীব্র ক্ষার (NaOH, Ca(OH)₂…)']], f.stype) + fld('sC', 'ঘনমাত্রা C (mol/L)', f.sC) + fld('sN', 'প্রতি অণুতে H⁺/OH⁻ সংখ্যা', f.sN);
        if (st.mode === 'weak') return sel('wtype', 'ধরন', [['acid', 'দুর্বল অম্ল (Kₐ)'], ['base', 'দুর্বল ক্ষার (K_b)']], f.wtype) + fld('wK', 'Kₐ / K_b', f.wK, 'যেমন 1.8e-5') + fld('wC', 'ঘনমাত্রা C (mol/L)', f.wC);
        if (st.mode === 'dilute') return fld('M1', 'M₁ (প্রাথমিক)', f.M1) + fld('V1', 'V₁', f.V1) + fld('M2', 'M₂ (চূড়ান্ত)', f.M2) + fld('V2', 'V₂', f.V2) + '<p class="pro-note" style="grid-column:1/-1;margin:0">যেকোনো একটি ঘর ফাঁকা রাখুন — সেটিই বের হবে। (V₁, V₂-এর একক একই হতে হবে)</p>';
        if (st.mode === 'molar') return fld('mass', 'দ্রব্যের ভর (g)', f.mass) + fld('Mw', 'মোলার ভর (g/mol)', f.Mw) + fld('vol', 'দ্রবণের আয়তন (mL)', f.vol) + fld('Mol', 'মোলারিটি M (mol/L)', f.Mol) + '<p class="pro-note" style="grid-column:1/-1;margin:0">ভর, আয়তন ও মোলারিটির মধ্যে যেকোনো একটি ফাঁকা রাখুন — মোলার ভর অবশ্যই দিন।</p>';
        return fld('pKa', 'pKₐ', f.pKa) + fld('A', '[A⁻] — লবণ/ক্ষারক', f.A) + fld('HA', '[HA] — দুর্বল অম্ল', f.HA) + fld('tpH', 'লক্ষ্য pH (ঐচ্ছিক)', f.tpH);
      },
      guide: ['উপরের ট্যাব থেকে হিসাবের ধরন বেছে নিন।', 'ঘরগুলোতে মান লিখলেই ফলাফল সঙ্গে সঙ্গে ও ধাপসহ নিচে দেখা যাবে।', 'সব হিসাব ২৫°C তাপমাত্রা ধরে (K_w = 1×10⁻¹⁴)।'],
      calc: function (st) {
        var f = st.f, m = st.mode;
        if (m === 'ph') {
          var v = nv(st, 'val'); needNum([v], ['মান']); var H;
          if (f.known === 'pH') H = Math.pow(10, -v); else if (f.known === 'pOH') H = KW / Math.pow(10, -v); else if (f.known === 'H') { if (v <= 0) throw new Error('ঘনমাত্রা শূন্যের বেশি হতে হবে'); H = v; } else { if (v <= 0) throw new Error('ঘনমাত্রা শূন্যের বেশি হতে হবে'); H = KW / v; }
          return phBlock(H) + steps(['pH = −log₁₀[H⁺], pOH = −log₁₀[OH⁻]', 'pH + pOH = 14 এবং [H⁺][OH⁻] = 10⁻¹⁴']);
        }
        if (m === 'strong') {
          var C = nv(st, 'sC'), n = nv(st, 'sN'); needNum([C, n], ['ঘনমাত্রা', 'H⁺/OH⁻ সংখ্যা']); if (C <= 0) throw new Error('ঘনমাত্রা শূন্যের বেশি হতে হবে');
          var a = C * n, x = (a + Math.sqrt(a * a + 4 * KW)) / 2, H2 = f.stype === 'acid' ? x : KW / x;
          return phBlock(H2) + steps([(f.stype === 'acid' ? '[H⁺] = C × n = ' : '[OH⁻] = C × n = ') + nf(a, 5) + ' mol/L', 'অত্যন্ত লঘু দ্রবণে পানির আয়নীকরণ ধরে নির্ভুল সূত্র ব্যবহার হয়েছে: x = (a + √(a² + 4K_w)) / 2']);
        }
        if (m === 'weak') {
          var K = nv(st, 'wK'), C2 = nv(st, 'wC'); needNum([K, C2], ['Kₐ/K_b', 'ঘনমাত্রা']); if (K <= 0 || C2 <= 0) throw new Error('মান শূন্যের বেশি হতে হবে');
          var xx = (-K + Math.sqrt(K * K + 4 * K * C2)) / 2, alpha = xx / C2 * 100, H3 = f.wtype === 'acid' ? xx : KW / xx, approx = Math.sqrt(K * C2);
          return phBlock(H3) + '<div class="pro-res" style="margin-top:10px">' + stat('বিয়োজন মাত্রা α', nf(alpha, 4) + ' %') + stat(f.wtype === 'acid' ? 'pKₐ' : 'pK_b', nf(-lg(K), 4)) + stat('আসন্ন x ≈ √(K·C)', nf(approx, 4)) + '</div>' +
            steps(['বিক্রিয়া: HA ⇌ H⁺ + A⁻ ⇒ K = x² / (C − x)', 'দ্বিঘাত সমীকরণ x² + Kx − KC = 0 সমাধান করে x = ' + nf(xx, 5) + ' mol/L (' + (f.wtype === 'acid' ? '[H⁺]' : '[OH⁻]') + ')', 'α = x / C × 100 = ' + nf(alpha, 4) + ' %']);
        }
        if (m === 'dilute') {
          var vals = ['M1', 'V1', 'M2', 'V2'].map(function (k) { return nv(st, k); }), blanks = vals.filter(isNaN).length;
          if (blanks !== 1) throw new Error('ঠিক একটি ঘর ফাঁকা রাখুন, বাকি তিনটিতে মান দিন');
          var M1 = vals[0], V1 = vals[1], M2 = vals[2], V2 = vals[3], name, res;
          if (isNaN(M1)) { res = M2 * V2 / V1; name = 'M₁'; } else if (isNaN(V1)) { res = M2 * V2 / M1; name = 'V₁'; } else if (isNaN(M2)) { res = M1 * V1 / V2; name = 'M₂'; } else { res = M1 * V1 / M2; name = 'V₂'; }
          var water = (isNaN(V1) ? res : V1) && (isNaN(V2) ? res : V2) ? (isNaN(V2) ? res : V2) - (isNaN(V1) ? res : V1) : NaN;
          return '<div class="pro-res">' + stat(name, nf(res, 6), true) + (isFinite(water) ? stat('যোগ করার পানি (V₂ − V₁)', nf(water, 6)) : '') + '</div>' + steps(['মোল সংখ্যা অপরিবর্তিত থাকে: M₁V₁ = M₂V₂', name + ' = ' + nf(res, 6)]);
        }
        if (m === 'molar') {
          var mass = nv(st, 'mass'), Mw = nv(st, 'Mw'), vol = nv(st, 'vol'), M = nv(st, 'Mol'); needNum([Mw], ['মোলার ভর']);
          var bl = [mass, vol, M].filter(isNaN).length; if (bl !== 1) throw new Error('ভর, আয়তন ও মোলারিটির মধ্যে ঠিক একটি ঘর ফাঁকা রাখুন');
          var r2, nm;
          if (isNaN(M)) { r2 = (mass / Mw) / (vol / 1000); nm = 'মোলারিটি (mol/L)'; } else if (isNaN(mass)) { r2 = M * (vol / 1000) * Mw; nm = 'প্রয়োজনীয় ভর (g)'; } else { r2 = (mass / Mw) / M * 1000; nm = 'আয়তন (mL)'; }
          var mol = isNaN(mass) ? r2 / Mw : mass / Mw;
          return '<div class="pro-res">' + stat(nm, nf(r2, 6), true) + stat('মোল সংখ্যা', nf(mol, 6)) + '</div>' + steps(['মোল = ভর ÷ মোলার ভর', 'M = মোল ÷ আয়তন (L)']);
        }
        var pKa = nv(st, 'pKa'), A = nv(st, 'A'), HA = nv(st, 'HA'), t = nv(st, 'tpH'); needNum([pKa, A, HA], ['pKₐ', '[A⁻]', '[HA]']); if (A <= 0 || HA <= 0) throw new Error('ঘনমাত্রা শূন্যের বেশি হতে হবে');
        var pH = pKa + lg(A / HA);
        return '<div class="pro-res">' + stat('বাফার pH', nf(pH, 5), true) + stat('[A⁻]/[HA]', nf(A / HA, 5)) + (isNaN(t) ? '' : stat('pH = ' + t + ' পেতে [A⁻]/[HA]', nf(Math.pow(10, t - pKa), 5))) + '</div>' + steps(['হেন্ডারসন–হাসেলবাখ সমীকরণ: pH = pKₐ + log([A⁻]/[HA])', 'pH = ' + nf(pKa, 4) + ' + log(' + nf(A, 4) + '/' + nf(HA, 4) + ') = ' + nf(pH, 5)]);
      },
      examples: null
    };
    makeTool(cfg);
  })();

  /* ---------- 4 · Circuit Lab ---------- */
  (function () {
    var COL = [['কালো', '#111', 0], ['বাদামি', '#7b4a1e', 1], ['লাল', '#d62d2d', 2], ['কমলা', '#f08a1c', 3], ['হলুদ', '#f2d21b', 4], ['সবুজ', '#2f9e44', 5], ['নীল', '#2563eb', 6], ['বেগুনি', '#8b3fd1', 7], ['ধূসর', '#8a8f98', 8], ['সাদা', '#f4f4f4', 9]];
    var MUL = COL.map(function (c, i) { return [c[0], c[1], Math.pow(10, i)]; }).concat([['সোনালি', '#c9a227', .1], ['রুপালি', '#b8bcc4', .01]]);
    var TOL = [['বাদামি', '#7b4a1e', 1], ['লাল', '#d62d2d', 2], ['সবুজ', '#2f9e44', .5], ['নীল', '#2563eb', .25], ['বেগুনি', '#8b3fd1', .1], ['সোনালি', '#c9a227', 5], ['রুপালি', '#b8bcc4', 10]];
    function ohmUnit(r) { if (r >= 1e6) return nf(r / 1e6, 4) + ' MΩ'; if (r >= 1e3) return nf(r / 1e3, 4) + ' kΩ'; return nf(r, 4) + ' Ω'; }
    function bands(b) { return '<div class="rc-body">' + b.map(function (c) { return '<span class="rc-band" style="background:' + c + '"></span>'; }).join('') + '</div>'; }
    function parseR(s) { s = String(s).trim().replace(/Ω|ohm/gi, '').replace(/,/g, '.'); var m = s.match(/^([\d.]+(?:e[+-]?\d+)?)\s*([kKMrR]?)$/); if (!m) return NaN; var v = parseFloat(m[1]), u = m[2]; return u === 'k' || u === 'K' ? v * 1e3 : (u === 'M' ? v * 1e6 : v); }
    var cfg = {
      id: 'circuit', icon: '🔌', label: 'সার্কিট শেখা', desc: 'ওহমের সূত্র, শ্রেণি–সমান্তরাল রোধ, রোধের রঙিন কোড ও ভোল্টেজ ডিভাইডার', priority: 8,
      def: { mode: 'ohm', f: { V: '12', I: '', R: '470', P: '', list: '100, 220, 330', Vs: '9', b1: '4', b2: '7', bm: '2', bt: '5', rv: '4.7k', Vin: '12', R1: '1000', R2: '2200' } },
      modes: [['ohm', 'ওহমের সূত্র'], ['net', 'শ্রেণি / সমান্তরাল'], ['color', 'রঙিন কোড → মান'], ['rev', 'মান → রঙিন কোড'], ['div', 'ভোল্টেজ ডিভাইডার']],
      form: function (st) {
        var f = st.f;
        if (st.mode === 'ohm') return fld('V', 'ভোল্টেজ V (volt)', f.V) + fld('I', 'কারেন্ট I (ampere)', f.I) + fld('R', 'রোধ R (ohm)', f.R) + fld('P', 'ক্ষমতা P (watt)', f.P) + '<p class="pro-note" style="grid-column:1/-1;margin:0">যেকোনো দুটি ঘরে মান দিন, বাকি দুটি ফাঁকা রাখুন।</p>';
        if (st.mode === 'net') return '<label class="pro-f" style="grid-column:1/-1"><span>রোধসমূহ (ohm) — কমা দিয়ে আলাদা করুন</span><input id="list" value="' + E(f.list) + '" autocomplete="off"></label>' + fld('Vs', 'সরবরাহ ভোল্টেজ (ঐচ্ছিক)', f.Vs);
        if (st.mode === 'color') return sel('b1', '১ম ব্যান্ড', COL.map(function (c, i) { return [i, c[0] + ' (' + c[2] + ')']; }), f.b1) + sel('b2', '২য় ব্যান্ড', COL.map(function (c, i) { return [i, c[0] + ' (' + c[2] + ')']; }), f.b2) + sel('bm', 'গুণক', MUL.map(function (c, i) { return [i, c[0] + ' (×' + c[2] + ')']; }), f.bm) + sel('bt', 'সহনসীমা', TOL.map(function (c, i) { return [i, c[0] + ' (±' + c[2] + '%)']; }), f.bt);
        if (st.mode === 'rev') return fld('rv', 'রোধের মান (যেমন 4.7k, 330, 2.2M)', f.rv);
        return fld('Vin', 'Vᵢₙ (volt)', f.Vin) + fld('R1', 'R₁ (ohm)', f.R1) + fld('R2', 'R₂ (ohm)', f.R2);
      },
      guide: ['ট্যাব বেছে নিন, তারপর ঘরগুলো পূরণ করুন — ফলাফল নিজে নিজে হিসাব হবে।', 'রঙিন কোড ৪-ব্যান্ড রোধের জন্য (দুটি অঙ্ক + গুণক + সহনসীমা)।'],
      calc: function (st) {
        var m = st.mode, f = st.f;
        if (m === 'ohm') {
          var V = nv(st, 'V'), I = nv(st, 'I'), R = nv(st, 'R'), P = nv(st, 'P'), have = ['V', 'I', 'R', 'P'].filter(function (k) { return !isNaN({ V: V, I: I, R: R, P: P }[k]); });
          if (have.length < 2) throw new Error('কমপক্ষে দুটি ঘরে মান দিন');
          var a = have[0], b = have[1];
          if (a === 'V' && b === 'I') { R = V / I; P = V * I; } else if (a === 'V' && b === 'R') { I = V / R; P = V * V / R; } else if (a === 'V' && b === 'P') { I = P / V; R = V * V / P; }
          else if (a === 'I' && b === 'R') { V = I * R; P = I * I * R; } else if (a === 'I' && b === 'P') { V = P / I; R = P / (I * I); } else { V = Math.sqrt(P * R); I = Math.sqrt(P / R); }
          return '<div class="pro-res">' + stat('ভোল্টেজ V', nf(V, 5) + ' V', true) + stat('কারেন্ট I', nf(I, 5) + ' A', true) + stat('রোধ R', ohmUnit(R)) + stat('ক্ষমতা P', nf(P, 5) + ' W') + stat('শক্তি / ঘণ্টা', nf(P / 1000, 5) + ' kWh') + '</div>' + steps(['V = I·R,  P = V·I = I²R = V²/R', 'দেওয়া ঘর: ' + have.slice(0, 2).join(' ও ')]);
        }
        if (m === 'net') {
          var rs = String(f.list).split(/[\s,;]+/).filter(Boolean).map(parseR); if (!rs.length || rs.some(function (x) { return !(x > 0); })) throw new Error('রোধগুলো ধনাত্মক সংখ্যা হতে হবে, যেমন: 100, 220, 330 বা 4.7k');
          var ser = rs.reduce(function (a, b) { return a + b; }, 0), par = 1 / rs.reduce(function (a, b) { return a + 1 / b; }, 0), Vs = nv(st, 'Vs'), tb = '';
          if (!isNaN(Vs)) {
            tb = '<div class="pro-scroll" style="margin-top:12px"><table class="pro-table"><thead><tr><th>রোধ</th><th>শ্রেণি: V</th><th>শ্রেণি: P</th><th>সমান্তরাল: I</th></tr></thead><tbody>' + rs.map(function (r) { var i = Vs / ser; return '<tr><td>' + ohmUnit(r) + '</td><td>' + nf(i * r, 4) + ' V</td><td>' + nf(i * i * r, 4) + ' W</td><td>' + nf(Vs / r, 4) + ' A</td></tr>'; }).join('') + '</tbody></table></div>';
          }
          return '<div class="pro-res">' + stat('শ্রেণি সমতুল্য রোধ', ohmUnit(ser), true) + stat('সমান্তরাল সমতুল্য রোধ', ohmUnit(par), true) + (isNaN(Vs) ? '' : stat('শ্রেণি কারেন্ট', nf(Vs / ser, 4) + ' A') + stat('সমান্তরাল মোট কারেন্ট', nf(Vs / par, 4) + ' A')) + '</div>' + tb + steps(['শ্রেণি: R = R₁ + R₂ + …', 'সমান্তরাল: 1/R = 1/R₁ + 1/R₂ + …']);
        }
        if (m === 'color') {
          var d1 = +f.b1, d2 = +f.b2, mi = +f.bm, ti = +f.bt, val = (d1 * 10 + d2) * MUL[mi][2];
          return bands([COL[d1][1], COL[d2][1], MUL[mi][1], TOL[ti][1]]) + '<div class="pro-res">' + stat('রোধের মান', ohmUnit(val), true) + stat('সহনসীমা', '± ' + TOL[ti][2] + ' %') + stat('সম্ভাব্য পরিসর', ohmUnit(val * (1 - TOL[ti][2] / 100)) + ' – ' + ohmUnit(val * (1 + TOL[ti][2] / 100))) + '</div>' + steps(['প্রথম দুই ব্যান্ড = অঙ্ক: ' + d1 + d2, 'তৃতীয় ব্যান্ড = গুণক ×' + MUL[mi][2], 'মান = ' + (d1 * 10 + d2) + ' × ' + MUL[mi][2] + ' = ' + ohmUnit(val)]);
        }
        if (m === 'rev') {
          var rv = parseR(f.rv); if (!(rv > 0)) throw new Error('সঠিক মান লিখুন, যেমন 4.7k বা 330');
          var e = Math.floor(Math.log10(rv)), sig = Math.round(rv / Math.pow(10, e - 1)); if (sig >= 100) { sig = Math.round(sig / 10); e += 1; }
          var mult = e - 1, mIdx = mult >= 0 ? mult : (mult === -1 ? 10 : 11);
          if (mult < -2 || mult > 9) throw new Error('এই মান ৪-ব্যান্ড কোডে প্রকাশ করা যায় না');
          var dd1 = Math.floor(sig / 10), dd2 = sig % 10;
          return bands([COL[dd1][1], COL[dd2][1], MUL[mIdx][1], '#c9a227']) + '<div class="pro-res">' + stat('১ম ব্যান্ড', COL[dd1][0], true) + stat('২য় ব্যান্ড', COL[dd2][0], true) + stat('গুণক', MUL[mIdx][0]) + stat('সহনসীমা (সাধারণ)', 'সোনালি ±৫%') + '</div>' + steps(['মান = ' + sig + ' × ' + MUL[mIdx][2] + ' Ω = ' + ohmUnit(rv)]);
        }
        var Vi = nv(st, 'Vin'), r1 = nv(st, 'R1'), r2 = nv(st, 'R2'); needNum([Vi, r1, r2], ['Vᵢₙ', 'R₁', 'R₂']); if (r1 + r2 <= 0) throw new Error('রোধ ধনাত্মক হতে হবে');
        var Vo = Vi * r2 / (r1 + r2), Ic = Vi / (r1 + r2);
        return '<div class="pro-res">' + stat('Vₒᵤₜ', nf(Vo, 5) + ' V', true) + stat('কারেন্ট', nf(Ic * 1000, 5) + ' mA') + stat('R₁-এ ভোল্টেজ', nf(Vi - Vo, 5) + ' V') + stat('মোট ক্ষমতা', nf(Vi * Ic, 5) + ' W') + '</div>' + steps(['Vₒᵤₜ = Vᵢₙ × R₂ / (R₁ + R₂)', '= ' + nf(Vi, 4) + ' × ' + nf(r2, 4) + ' / ' + nf(r1 + r2, 4) + ' = ' + nf(Vo, 5) + ' V']);
      }
    };
    makeTool(cfg);
  })();

  /* ---------- 5 · Complex Numbers ---------- */
  (function () {
    function parseC(s) {
      s = String(s).replace(/\s+/g, '').replace(/−/g, '-').replace(/j/gi, 'i'); if (!s) throw new Error('সংখ্যাটি ফাঁকা');
      var terms = s.match(/[+-]?[^+-]+/g); if (!terms || terms.join('') !== s) throw new Error('"' + s + '" পড়া যায়নি — যেমন লিখুন 3+4i');
      var re = 0, im = 0;
      terms.forEach(function (t) {
        if (/i$/i.test(t)) { var b = t.slice(0, -1); if (b === '' || b === '+') b = '1'; else if (b === '-') b = '-1'; var v = Number(b); if (isNaN(v)) throw new Error('"' + t + '" পড়া যায়নি'); im += v; }
        else { var w = Number(t); if (isNaN(w)) throw new Error('"' + t + '" পড়া যায়নি'); re += w; }
      });
      return [re, im];
    }
    function cs(z, d) {
      d = d || 5; var a = +z[0].toPrecision(d), b = +z[1].toPrecision(d);
      if (Math.abs(a) < 1e-12) a = 0; if (Math.abs(b) < 1e-12) b = 0;
      if (b === 0) return String(a); var bs = (Math.abs(b) === 1 ? '' : String(Math.abs(b))) + 'i';
      return (a === 0 ? (b < 0 ? '−' : '') : a + (b < 0 ? ' − ' : ' + ')) + bs;
    }
    function mul(a, b) { return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]; }
    function div(a, b) { var d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; }
    var cfg = {
      id: 'complex', icon: '🧮', label: 'জটিল সংখ্যা', desc: 'যোগ-গুণ-ভাগ, মডুলাস, আর্গুমেন্ট, পোলার রূপ, De Moivre ও n-তম মূল', priority: 7,
      def: { mode: 'all', f: { z1: '3+4i', z2: '1-2i', n: '3' } },
      form: function (st) { var f = st.f; return fld('z1', 'z₁', f.z1, 'যেমন 3+4i') + fld('z2', 'z₂', f.z2, 'যেমন 1-2i') + fld('n', 'ঘাত / মূলের n', f.n); },
      guide: ['সংখ্যা লিখুন a+bi আকারে (যেমন 2-5i, 4i, -3)।', 'z₁ ও z₂ দিয়ে চার প্রক্রিয়া; z₁-এর জন্য মডুলাস, আর্গুমেন্ট, পোলার রূপ, ঘাত ও n-তম মূল দেখা যাবে।'],
      calc: function (st) {
        var z1 = parseC(st.f.z1), z2 = parseC(st.f.z2), n = nv(st, 'n');
        var r = Math.hypot(z1[0], z1[1]), th = Math.atan2(z1[1], z1[0]), deg = th * 180 / Math.PI, h = '';
        h += '<div class="pro-res">' + stat('z₁ + z₂', cs([z1[0] + z2[0], z1[1] + z2[1]]), true) + stat('z₁ − z₂', cs([z1[0] - z2[0], z1[1] - z2[1]]), true) + stat('z₁ × z₂', cs(mul(z1, z2)), true) +
          stat('z₁ ÷ z₂', z2[0] === 0 && z2[1] === 0 ? 'অসংজ্ঞায়িত' : cs(div(z1, z2)), true) + stat('অনুবন্ধী z̄₁', cs([z1[0], -z1[1]])) + stat('|z₁| মডুলাস', nf(r, 6)) + stat('arg z₁ (রেডিয়ান)', nf(th, 6)) + stat('arg z₁ (ডিগ্রি)', nf(deg, 6) + '°') + '</div>';
        h += '<div class="pro-eq" style="margin-top:12px;font-size:18px">পোলার রূপ: z₁ = ' + nf(r, 5) + '(cos ' + nf(deg, 5) + '° + i sin ' + nf(deg, 5) + '°)</div>';
        if (Number.isInteger(n) && n >= 1 && n <= 24) {
          var rn = Math.pow(r, n), an = th * n, pw = [rn * Math.cos(an), rn * Math.sin(an)];
          h += '<div class="pro-res" style="margin-top:12px">' + stat('z₁^' + n + ' (De Moivre)', cs(pw), true) + stat('|z₁^' + n + '|', nf(rn, 6)) + '</div>';
          if (r > 0 && n <= 12) {
            var rt = Math.pow(r, 1 / n), rows = '';
            for (var k = 0; k < n; k++) { var a = (th + 2 * Math.PI * k) / n; rows += '<tr><td>k = ' + k + '</td><td>' + cs([rt * Math.cos(a), rt * Math.sin(a)]) + '</td><td>' + nf(a * 180 / Math.PI, 5) + '°</td></tr>'; }
            h += '<div class="pro-scroll" style="margin-top:12px"><table class="pro-table"><thead><tr><th>z₁-এর ' + n + '-তম মূল</th><th>মান</th><th>আর্গুমেন্ট</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
          }
        } else h += '<p class="pro-note">ঘাত/মূলের জন্য n = ১ থেকে ২৪ এর মধ্যে একটি পূর্ণসংখ্যা দিন।</p>';
        return h + steps(['গুণ: (a+bi)(c+di) = (ac−bd) + (ad+bc)i', 'ভাগ: z₁/z₂ = z₁·z̄₂ / |z₂|²', 'De Moivre: [r(cosθ + i sinθ)]ⁿ = rⁿ(cos nθ + i sin nθ)', 'n-তম মূল: r^(1/n)[cos((θ+2πk)/n) + i sin((θ+2πk)/n)], k = 0…n−1']);
      }
    };
    makeTool(cfg);
  })();

  /* ---------- 6 · Counting & Probability ---------- */
  (function () {
    function fact(n) { var r = 1n; for (var i = 2n; i <= BigInt(n); i++) r *= i; return r; }
    function ncr(n, r) { if (r < 0 || r > n) return 0n; r = Math.min(r, n - r); var num = 1n, den = 1n; for (var i = 0; i < r; i++) { num *= BigInt(n - i); den *= BigInt(i + 1); } return num / den; }
    function npr(n, r) { if (r < 0 || r > n) return 0n; var x = 1n; for (var i = 0; i < r; i++) x *= BigInt(n - i); return x; }
    function big(b) {
      var s = b.toString(), g = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (s.length > 21) return s[0] + '.' + s.slice(1, 6) + ' × 10^' + (s.length - 1) + ' <small style="opacity:.6;font-weight:500">(' + s.length + ' অঙ্ক)</small>';
      return g;
    }
    function lnC(n, k) { var s = 0; k = Math.min(k, n - k); for (var i = 1; i <= k; i++) s += Math.log(n - k + i) - Math.log(i); return s; }
    function pmf(n, p, k) { if (k < 0 || k > n) return 0; if (p === 0) return k === 0 ? 1 : 0; if (p === 1) return k === n ? 1 : 0; return Math.exp(lnC(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p)); }
    var cfg = {
      id: 'counting', icon: '🎲', label: 'বিন্যাস, সমাবেশ ও সম্ভাবনা', desc: 'ক্রমযোগ ও সমাবেশ (nPr, nCr), শব্দের বিন্যাস ও দ্বিপদী সম্ভাবনা — ধাপসহ', priority: 7,
      def: { mode: 'perm', f: { n: '10', r: '3', word: 'MATHEMATICS', bn: '10', bp: '0.5', bk: '4' } },
      modes: [['perm', 'বিন্যাস ও সমাবেশ'], ['word', 'শব্দের বিন্যাস'], ['binom', 'দ্বিপদী সম্ভাবনা']],
      form: function (st) {
        var f = st.f;
        if (st.mode === 'perm') return fld('n', 'মোট বস্তু n', f.n) + fld('r', 'নির্বাচন r', f.r);
        if (st.mode === 'word') return '<label class="pro-f" style="grid-column:1/-1"><span>শব্দ / অক্ষরমালা (ইংরেজি অক্ষর)</span><input id="word" value="' + E(f.word) + '" autocomplete="off" spellcheck="false"></label>';
        return fld('bn', 'পরীক্ষার সংখ্যা n', f.bn) + fld('bp', 'সফলতার সম্ভাবনা p', f.bp) + fld('bk', 'সফলতা k', f.bk);
      },
      guide: ['n ও r পূর্ণসংখ্যা দিন (n ≤ ২০০)।', 'শব্দের বিন্যাসে পুনরাবৃত্ত অক্ষর নিজে নিজে ধরা হবে।', 'দ্বিপদী: P(X = k) = ⁿCₖ pᵏ (1−p)ⁿ⁻ᵏ'],
      calc: function (st) {
        var f = st.f;
        if (st.mode === 'perm') {
          var n = nv(st, 'n'), r = nv(st, 'r'); needNum([n, r], ['n', 'r']);
          if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) throw new Error('n ও r অঋণাত্মক পূর্ণসংখ্যা হতে হবে');
          if (n > 200) throw new Error('n সর্বোচ্চ ২০০ পর্যন্ত দিন');
          if (r > n) return bad('r, n-এর চেয়ে বড় হতে পারে না (বাছাই করা যাবে না)।') + '<div class="pro-res">' + stat('n!', big(fact(n)), true) + stat('nʳ (পুনরাবৃত্তিসহ বিন্যাস)', big(BigInt(n) ** BigInt(r))) + stat('ⁿ⁺ʳ⁻¹Cᵣ (পুনরাবৃত্তিসহ সমাবেশ)', big(ncr(n + r - 1, r))) + '</div>';
          return '<div class="pro-res">' + stat('ⁿPᵣ (বিন্যাস)', big(npr(n, r)), true) + stat('ⁿCᵣ (সমাবেশ)', big(ncr(n, r)), true) + stat('n!', big(fact(n))) + stat('nʳ (পুনরাবৃত্তিসহ)', big(BigInt(n) ** BigInt(r))) + stat('ⁿ⁺ʳ⁻¹Cᵣ (পুনরাবৃত্তিসহ সমাবেশ)', big(ncr(n + r - 1, r))) + stat('বৃত্তাকার বিন্যাস (n−1)!', n >= 1 ? big(fact(n - 1)) : '—') + '</div>' +
            steps(['ⁿPᵣ = n! / (n−r)!  — ক্রম গুরুত্বপূর্ণ', 'ⁿCᵣ = n! / (r!(n−r)!)  — ক্রম গুরুত্বহীন', 'ⁿCᵣ = ⁿPᵣ / r!']);
        }
        if (st.mode === 'word') {
          var w = String(f.word).replace(/[^A-Za-z\u0980-\u09FF]/g, '').toUpperCase(); if (!w) throw new Error('একটি শব্দ লিখুন'); if (w.length > 60) throw new Error('শব্দ ৬০ অক্ষরের মধ্যে রাখুন');
          var cnt = {}; w.split('').forEach(function (c) { cnt[c] = (cnt[c] || 0) + 1; });
          var den = 1n, rows = Object.keys(cnt).sort().map(function (k) { den *= fact(cnt[k]); return '<tr><td>' + E(k) + '</td><td>' + cnt[k] + '</td></tr>'; }).join('');
          var total = fact(w.length) / den, vow = w.split('').filter(function (c) { return 'AEIOU'.indexOf(c) >= 0; });
          var extra = '';
          if (vow.length && vow.length < w.length) {
            var vc = {}, cc = {}; vow.forEach(function (c) { vc[c] = (vc[c] || 0) + 1; }); w.split('').filter(function (c) { return 'AEIOU'.indexOf(c) < 0; }).forEach(function (c) { cc[c] = (cc[c] || 0) + 1; });
            var vd = 1n, cd = 1n; for (var k in vc) vd *= fact(vc[k]); for (var k2 in cc) cd *= fact(cc[k2]);
            var consN = w.length - vow.length, together = (fact(consN + 1) / cd) * (fact(vow.length) / vd);
            extra = stat('স্বরবর্ণ একসাথে থাকলে', big(together));
          }
          return '<div class="pro-res">' + stat('মোট অক্ষর', String(w.length)) + stat('ভিন্ন অক্ষর', String(Object.keys(cnt).length)) + stat('মোট বিন্যাস', big(total), true) + extra + '</div>' +
            '<div class="pro-scroll" style="margin-top:12px"><table class="pro-table"><thead><tr><th>অক্ষর</th><th>সংখ্যা</th></tr></thead><tbody>' + rows + '</tbody></table></div>' + steps(['বিন্যাস = n! ÷ (p! × q! × r! …) যেখানে p, q, r পুনরাবৃত্ত অক্ষরের সংখ্যা', 'এখানে ' + w.length + '! ÷ (' + Object.keys(cnt).filter(function (k) { return cnt[k] > 1; }).map(function (k) { return cnt[k] + '!'; }).join(' × ') + (Object.keys(cnt).some(function (k) { return cnt[k] > 1; }) ? ')' : '1)') + ' = ' + big(total)]);
        }
        var bn = nv(st, 'bn'), bp = nv(st, 'bp'), bk = nv(st, 'bk'); needNum([bn, bp, bk], ['n', 'p', 'k']);
        if (!Number.isInteger(bn) || !Number.isInteger(bk) || bn < 1 || bn > 1000 || bk < 0 || bk > bn) throw new Error('n (১–১০০০) ও k (0–n) পূর্ণসংখ্যা দিন');
        if (bp < 0 || bp > 1) throw new Error('p-এর মান ০ থেকে ১-এর মধ্যে হতে হবে');
        var eq = pmf(bn, bp, bk), le = 0; for (var i = 0; i <= bk; i++) le += pmf(bn, bp, i); le = Math.min(1, le); var ge = Math.min(1, 1 - le + eq), q = 1 - bp;
        return '<div class="pro-res">' + stat('P(X = ' + bk + ')', nf(eq, 6), true) + stat('P(X ≤ ' + bk + ')', nf(le, 6), true) + stat('P(X ≥ ' + bk + ')', nf(ge, 6)) + stat('গড় np', nf(bn * bp, 6)) + stat('ভেদাঙ্ক npq', nf(bn * bp * q, 6)) + stat('প্রমাণ বিচ্যুতি', nf(Math.sqrt(bn * bp * q), 6)) + '</div>' + steps(['P(X = k) = ⁿCₖ · pᵏ · qⁿ⁻ᵏ, q = 1 − p = ' + nf(q, 4), 'P(X ≤ k) = P(0) + P(1) + … + P(k)']);
      }
    };
    makeTool(cfg);
  })();

  /* ---------- 7 · Sequence & Series ---------- */
  (function () {
    function binC(n, k) { var r = 1; k = Math.min(k, n - k); for (var i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); }
    function term(c, p) { var s = c === 1 && p > 0 ? '' : nf(c, 6); if (p === 0) return nf(c, 6); return s + 'x' + (p === 1 ? '' : '^' + p); }
    var cfg = {
      id: 'series', icon: '🧮', label: 'ধারা ও শ্রেণি', desc: 'সমান্তর ও গুণোত্তর ধারা, অসীম ধারার সমষ্টি এবং দ্বিপদী বিস্তৃতি', priority: 6,
      def: { mode: 'ap', f: { a: '2', d: '3', n: '10', ga: '3', gr: '2', gn: '8', ba: '2', bb: '3', bn: '5' } },
      modes: [['ap', 'সমান্তর ধারা'], ['gp', 'গুণোত্তর ধারা'], ['bin', 'দ্বিপদী বিস্তৃতি']],
      form: function (st) {
        var f = st.f;
        if (st.mode === 'ap') return fld('a', 'প্রথম পদ a', f.a) + fld('d', 'সাধারণ অন্তর d', f.d) + fld('n', 'পদসংখ্যা n', f.n);
        if (st.mode === 'gp') return fld('ga', 'প্রথম পদ a', f.ga) + fld('gr', 'সাধারণ অনুপাত r', f.gr) + fld('gn', 'পদসংখ্যা n', f.gn);
        return fld('ba', '(ax + b)ⁿ এ a', f.ba) + fld('bb', 'b', f.bb) + fld('bn', 'n (১–২০)', f.bn);
      },
      guide: ['ধারার ধরন বেছে নিন, মান লিখুন — n-তম পদ, প্রথম n পদের সমষ্টি ও তালিকা পাবেন।', 'গুণোত্তর ধারায় |r| < 1 হলে অসীম পদের সমষ্টিও দেখানো হয়।'],
      calc: function (st) {
        if (st.mode === 'ap') {
          var a = nv(st, 'a'), d = nv(st, 'd'), n = nv(st, 'n'); needNum([a, d, n], ['a', 'd', 'n']); if (!Number.isInteger(n) || n < 1 || n > 10000) throw new Error('n ১ থেকে ১০০০০ এর মধ্যে পূর্ণসংখ্যা হতে হবে');
          var an = a + (n - 1) * d, S = n / 2 * (2 * a + (n - 1) * d), list = []; for (var i = 0; i < Math.min(n, 12); i++) list.push(nf(a + i * d, 6));
          return '<div class="pro-res">' + stat('n-তম পদ aₙ', nf(an, 8), true) + stat('প্রথম n পদের সমষ্টি Sₙ', nf(S, 8), true) + stat('গড় পদ', nf(S / n, 8)) + '</div><div class="pro-note"><b>প্রথম কয়েকটি পদ:</b> ' + list.join(', ') + (n > 12 ? ', …' : '') + '</div>' + steps(['aₙ = a + (n−1)d = ' + nf(a, 4) + ' + ' + (n - 1) + ' × ' + nf(d, 4) + ' = ' + nf(an, 8), 'Sₙ = n/2 × (2a + (n−1)d) = ' + nf(S, 8), 'অথবা Sₙ = n/2 × (a + aₙ)']);
        }
        if (st.mode === 'gp') {
          var ga = nv(st, 'ga'), r = nv(st, 'gr'), gn = nv(st, 'gn'); needNum([ga, r, gn], ['a', 'r', 'n']); if (!Number.isInteger(gn) || gn < 1 || gn > 2000) throw new Error('n ১ থেকে ২০০০ এর মধ্যে পূর্ণসংখ্যা হতে হবে');
          var tn = ga * Math.pow(r, gn - 1), Sn = r === 1 ? ga * gn : ga * (Math.pow(r, gn) - 1) / (r - 1), l2 = []; for (var j = 0; j < Math.min(gn, 10); j++) l2.push(nf(ga * Math.pow(r, j), 6));
          var inf = Math.abs(r) < 1 ? '<div class="pro-res" style="margin-top:10px">' + stat('অসীম ধারার সমষ্টি S∞ = a/(1−r)', nf(ga / (1 - r), 8), true) + '</div>' : '<p class="pro-note">|r| ≥ ১ হওয়ায় অসীম ধারার সমষ্টি সসীম নয় (অপসারী)।</p>';
          return '<div class="pro-res">' + stat('n-তম পদ', nf(tn, 8), true) + stat('প্রথম n পদের সমষ্টি Sₙ', nf(Sn, 8), true) + '</div>' + inf + '<div class="pro-note"><b>প্রথম কয়েকটি পদ:</b> ' + l2.join(', ') + (gn > 10 ? ', …' : '') + '</div>' + steps(['aₙ = a·rⁿ⁻¹', 'Sₙ = a(rⁿ − 1)/(r − 1)   (r ≠ 1)', 'S∞ = a/(1 − r)   (|r| < 1)']);
        }
        var ba = nv(st, 'ba'), bb = nv(st, 'bb'), bn = nv(st, 'bn'); needNum([ba, bb, bn], ['a', 'b', 'n']); if (!Number.isInteger(bn) || bn < 1 || bn > 20) throw new Error('n ১ থেকে ২০ এর মধ্যে পূর্ণসংখ্যা হতে হবে');
        var coefs = [], k; for (k = 0; k <= bn; k++) coefs.push(binC(bn, k) * Math.pow(ba, bn - k) * Math.pow(bb, k));
        var poly = coefs.map(function (c, idx) { return { c: c, p: bn - idx }; }).filter(function (t) { return t.c !== 0; }).map(function (t, i) { var s = term(Math.abs(t.c), t.p); return (i === 0 ? (t.c < 0 ? '−' : '') : (t.c < 0 ? ' − ' : ' + ')) + s; }).join('');
        var pas = []; for (k = 0; k <= bn; k++) pas.push(binC(bn, k));
        var rows = coefs.map(function (c, idx) { return '<tr><td>T' + (idx + 1) + '</td><td>' + binC(bn, idx) + '</td><td>' + nf(c, 8) + '</td><td>x^' + (bn - idx) + '</td></tr>'; }).join('');
        return '<div class="pro-eq" style="font-size:17px">(' + nf(ba, 4) + 'x + ' + nf(bb, 4) + ')<sup>' + bn + '</sup> = ' + poly + '</div><div class="pro-res" style="margin-top:12px">' + stat('পদসংখ্যা', String(bn + 1), true) + stat('সহগের সমষ্টি', nf(Math.pow(ba + bb, bn), 8)) + stat('পাসকালের সারি', pas.join(' ')) + '</div>' +
          '<div class="pro-scroll" style="margin-top:12px"><table class="pro-table"><thead><tr><th>পদ</th><th>ⁿCᵣ</th><th>সহগ</th><th>ঘাত</th></tr></thead><tbody>' + rows + '</tbody></table></div>' + steps(['সাধারণ পদ: T(r+1) = ⁿCᵣ · (ax)ⁿ⁻ʳ · bʳ', 'সহগের সমষ্টি পেতে x = 1 বসান: (a + b)ⁿ']);
      }
    };
    makeTool(cfg);
  })();

  /* ---------- 8 · Exam Pace Planner ---------- */
  (function () {
    var S = keep('pace', { total: '180', read: '5', review: '10', rows: 'MCQ, 30\nসৃজনশীল প্রশ্ন (CQ), 70', running: false, startAt: 0, base: 0 });
    var tick = null;
    function plan(st) {
      var total = parseFloat(st.total), read = parseFloat(st.read) || 0, rv = parseFloat(st.review) || 0;
      if (!(total > 0)) return { err: 'মোট সময় (মিনিট) লিখুন' };
      var items = String(st.rows).split('\n').map(function (l) { l = l.trim(); if (!l) return null; var p = l.split(','); var marks = parseFloat(p[p.length - 1]); var name = p.slice(0, -1).join(',').trim() || ('অংশ'); return isNaN(marks) || marks <= 0 ? null : { name: name, marks: marks }; }).filter(Boolean);
      if (!items.length) return { err: 'প্রতি লাইনে লিখুন: অংশের নাম, নম্বর (যেমন: MCQ, 30)' };
      var reviewMin = total * rv / 100, work = total - read - reviewMin; if (work <= 0) return { err: 'পড়া ও রিভিশনের সময় মোট সময়ের চেয়ে কম রাখুন' };
      var sum = items.reduce(function (a, b) { return a + b.marks; }, 0), t = read, rows = [];
      items.forEach(function (it) { var m = work * it.marks / sum; rows.push({ name: it.name, marks: it.marks, min: m, start: t, end: t + m, perMark: m / it.marks }); t += m; });
      return { total: total, read: read, reviewMin: reviewMin, rows: rows, reviewStart: t };
    }
    function mmss(sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return (h ? h + ':' : '') + (h ? ('0' + m).slice(-2) : m) + ':' + ('0' + s).slice(-2); }
    function elapsed(st) { return (st.base || 0) + (st.running ? (Date.now() - st.startAt) / 1000 : 0); }
    function planHtml(p, el) {
      if (p.err) return bad(p.err);
      var rows = p.rows.map(function (r, i) {
        var cls = el >= r.end * 60 ? ' done' : (el >= r.start * 60 ? ' now' : '');
        return '<div class="pace-row' + cls + '"><div><b>' + E(r.name) + '</b><div style="opacity:.65;font-size:12px">' + r.marks + ' নম্বর · প্রতি নম্বরে ≈ ' + nf(r.perMark, 3) + ' মিনিট</div></div><div style="font-weight:800">' + nf(r.min, 4) + ' মি</div><div style="opacity:.7;font-size:12px">' + mmss(r.start * 60) + ' → ' + mmss(r.end * 60) + '</div></div>';
      }).join('');
      return '<div class="pro-res">' + stat('প্রশ্ন পড়ার সময়', nf(p.read, 4) + ' মি') + stat('রিভিশন সংরক্ষিত', nf(p.reviewMin, 4) + ' মি') + stat('রিভিশন শুরু', mmss(p.reviewStart * 60)) + '</div><div style="margin-top:12px">' + rows + '</div>';
    }
    function render() {
      var st = S.get(), el = elapsed(st), tot = (parseFloat(st.total) || 0) * 60;
      return '<div class="pro-grid two"><div class="pro-card"><h3>পরীক্ষার তথ্য</h3><div class="pro-fields">' + fld('total', 'মোট সময় (মিনিট)', st.total) + fld('read', 'প্রশ্ন পড়ার সময় (মিনিট)', st.read) + fld('review', 'রিভিশন (% সময়)', st.review) + '</div>' +
        '<label class="pro-f" style="margin-top:11px"><span>অংশ ও নম্বর — প্রতি লাইনে একটি (নাম, নম্বর)</span><textarea id="rows" rows="5" spellcheck="false">' + E(st.rows) + '</textarea></label>' +
        '<div class="pro-chips"><button type="button" data-a="pre" data-v="180">৩ ঘণ্টার পরীক্ষা</button><button type="button" data-a="pre" data-v="60">১ ঘণ্টার ক্লাস টেস্ট</button><button type="button" data-a="pre" data-v="30">৩০ মিনিটের কুইজ</button></div>' +
        guideBox('কীভাবে ব্যবহার করবেন?', ['মোট সময় ও প্রতিটি অংশের নম্বর দিন — টুল নম্বর অনুপাতে সময় ভাগ করে দেবে।', 'মক টেস্টে “শুরু” চাপুন; কোন অংশে কত সময় থাকা উচিত তা লাইভ হাইলাইট হবে।', 'রিভিশনের জন্য শেষে নির্দিষ্ট সময় আলাদা রাখা হয়।']) + '</div>' +
        '<div class="pro-card"><h3>মক টেস্ট টাইমার</h3><div class="pace-clock" id="paceClock">' + mmss(Math.max(0, tot - el)) + '</div><div class="pace-bar"><i id="paceBar" style="width:' + (tot ? Math.min(100, el / tot * 100) : 0) + '%"></i></div>' +
        '<div class="pro-chips" style="margin:0 0 14px;justify-content:center"><button type="button" class="pro-btn pri" data-a="' + (st.running ? 'pause' : 'start') + '">' + (st.running ? '⏸ থামান' : '▶ শুরু') + '</button><button type="button" class="pro-btn" data-a="reset">↺ রিসেট</button></div><div id="proOut">' + planHtml(plan(st), el) + '</div></div></div>';
    }
    function live() {
      var st = S.get(), el = elapsed(st), tot = (parseFloat(st.total) || 0) * 60, c = document.getElementById('paceClock'), b = document.getElementById('paceBar'); if (!c) return;
      c.textContent = mmss(Math.max(0, tot - el)); if (b) b.style.width = (tot ? Math.min(100, el / tot * 100) : 0) + '%';
      var p = plan(st); out(planHtml(p, el));
      if (st.running && tot && el >= tot) { st.running = false; st.base = tot; S.set(st); if (U.beep) U.beep(); U.toast('সময় শেষ!'); stopTick(); HP.paint(); }
    }
    function stopTick() { if (tick) { clearInterval(tick); tick = null; } }
    function startTick() { stopTick(); tick = setInterval(live, 1000); }
    HP.add({
      id: 'pace', icon: '⏱️', label: 'পরীক্ষার সময় পরিকল্পনা', desc: 'নম্বর অনুযায়ী পরীক্ষার সময় ভাগ করুন এবং লাইভ মক-টেস্ট টাইমার চালান', group: 'focus', priority: 7,
      render: render, mount: function () { if (S.get().running) startTick(); }, unmount: stopTick,
      input: function (el) {
        var st = S.get(); if (['total', 'read', 'review', 'rows'].indexOf(el.id) < 0) return; st[el.id] = el.value; S.set(st);
        var c = document.getElementById('paceClock'); if (c && !st.running) c.textContent = mmss(Math.max(0, (parseFloat(st.total) || 0) * 60 - elapsed(st))); live();
      },
      click: function (el) {
        var st = S.get(), a = el.dataset.a;
        if (a === 'start') { st.running = true; st.startAt = Date.now(); S.set(st); startTick(); HP.paint(); }
        else if (a === 'pause') { st.base = elapsed(st); st.running = false; S.set(st); stopTick(); HP.paint(); }
        else if (a === 'reset') { st.running = false; st.base = 0; S.set(st); stopTick(); HP.paint(); }
        else if (a === 'pre') {
          var v = el.dataset.v; st.running = false; st.base = 0; stopTick();
          if (v === '180') { st.total = '180'; st.read = '5'; st.review = '10'; st.rows = 'MCQ, 30\nসৃজনশীল প্রশ্ন (CQ), 70'; }
          else if (v === '60') { st.total = '60'; st.read = '3'; st.review = '10'; st.rows = 'অংশ ক, 20\nঅংশ খ, 30'; }
          else { st.total = '30'; st.read = '2'; st.review = '10'; st.rows = 'প্রশ্ন, 20'; }
          S.set(st); HP.paint();
        }
      }
    });
  })();
})();
