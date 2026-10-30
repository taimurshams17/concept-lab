/* ConceptLab Student Hub extra tools v11.1 — nine study tools (routes: #/hub/<tool>; old #/toolkit redirects).
   Pure client-side. Registers through CL_HUB like the other student pages. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(id) { var el = document.getElementById(id); if (!el) return NaN; var v = String(el.value).trim().replace(/,/g, '.'); return v === '' ? NaN : Number(v); }
  function val(id) { var el = document.getElementById(id); return el ? String(el.value) : ''; }
  function chk(id) { var el = document.getElementById(id); return !!(el && el.checked); }
  function fmt(n, d) {
    if (typeof n !== 'number' || !isFinite(n)) return '—';
    if (n === 0) return '0';
    var a = Math.abs(n);
    if (a >= 1e9 || a < 1e-4) return Number(n.toPrecision(d || 6)).toExponential().replace('e+', ' × 10^').replace('e-', ' × 10^-');
    return String(Number(n.toPrecision(d || 8)));
  }
  function row(k, v, hint) { return '<div class="tk-row"><span>' + k + '</span><b>' + v + '</b>' + (hint ? '<small>' + hint + '</small>' : '') + '</div>'; }
  function warn(t) { return '<p class="tk-warn">' + E(t) + '</p>'; }
  function guide(steps, example) { return '<section class="tk-guide"><div class="tk-guide-title">কীভাবে ব্যবহার করবেন?</div><ol>' + steps.map(function (step) { return '<li>' + E(step) + '</li>'; }).join('') + '</ol>' + (example ? '<p class="tk-guide-example"><b>উদাহরণ:</b> ' + E(example) + '</p>' : '') + '</section>'; }
  function field(id, label, value, opts) {
    opts = opts || {};
    return '<label class="tk-field"><span>' + label + '</span><input id="' + id + '" type="' + (opts.type || 'text') + '" inputmode="' + (opts.mode || 'decimal') + '" value="' + E(value) + '" autocomplete="off" autocapitalize="off" spellcheck="false"' + (opts.ph ? ' placeholder="' + E(opts.ph) + '"' : '') + '></label>';
  }

  /* ---------- 1. Molar mass ---------- */
  var AW = { H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007, O: 15.999, F: 18.998, Ne: 20.18, Na: 22.99, Mg: 24.305, Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.948, K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38, Ga: 69.723, Ge: 72.63, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798, Rb: 85.468, Sr: 87.62, Mo: 95.95, Ag: 107.87, Cd: 112.41, Sn: 118.71, Sb: 121.76, I: 126.9, Xe: 131.29, Cs: 132.91, Ba: 137.33, W: 183.84, Pt: 195.08, Au: 196.97, Hg: 200.59, Pb: 207.2, U: 238.03 };
  var HSC = { H: 1, C: 12, N: 14, O: 16, F: 19, Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35.5, K: 39, Ca: 40, Mn: 55, Fe: 56, Cu: 63.5, Zn: 65, Br: 80, Ag: 108, I: 127, Ba: 137, Pb: 207 };
  function parseFormula(str) {
    var s = String(str).replace(/\s+/g, '').replace(/[₀-₉]/g, function (c) { return String(c.charCodeAt(0) - 8320); });
    if (!s) throw new Error('সূত্র লিখুন, যেমন H2SO4 বা CuSO4·5H2O');
    var parts = s.split(/[·.*•]/), total = {};
    parts.forEach(function (p) {
      var m = p.match(/^(\d+)(.*)$/), mult = 1;
      if (m && m[2]) { mult = parseInt(m[1], 10); p = m[2]; }
      var cnt = parseGroup(p);
      Object.keys(cnt).forEach(function (k) { total[k] = (total[k] || 0) + cnt[k] * mult; });
    });
    return total;
  }
  function parseGroup(s) {
    var i = 0, stack = [{}];
    function readNum() { var st = i; while (i < s.length && /\d/.test(s[i])) i++; return st === i ? 1 : parseInt(s.slice(st, i), 10); }
    while (i < s.length) {
      var ch = s[i];
      if (ch === '(' || ch === '[' || ch === '{') { stack.push({}); i++; }
      else if (ch === ')' || ch === ']' || ch === '}') {
        i++; var n = readNum(), top = stack.pop();
        if (!stack.length) throw new Error('বন্ধনী মিলছে না');
        Object.keys(top).forEach(function (k) { stack[stack.length - 1][k] = (stack[stack.length - 1][k] || 0) + top[k] * n; });
      } else if (/[A-Z]/.test(ch)) {
        var el = ch; i++;
        if (i < s.length && /[a-z]/.test(s[i])) { el += s[i]; i++; }
        var c = readNum();
        if (!AW[el]) throw new Error('অজানা মৌল: ' + el);
        stack[stack.length - 1][el] = (stack[stack.length - 1][el] || 0) + c;
      } else throw new Error('অচেনা অক্ষর: ' + ch);
    }
    if (stack.length !== 1) throw new Error('বন্ধনী মিলছে না');
    return stack[0];
  }
  function molarRun() {
    try {
      var cnt = parseFormula(val('tk-formula')), hsc = chk('tk-hsc'), M = 0, lines = [];
      Object.keys(cnt).forEach(function (k) { var w = (hsc && HSC[k]) ? HSC[k] : AW[k]; cnt[k] = { n: cnt[k], w: w }; M += cnt[k].n * w; });
      Object.keys(cnt).forEach(function (k) { var part = cnt[k].n * cnt[k].w; lines.push(row(k + ' × ' + cnt[k].n, fmt(part, 6) + ' g', fmt(part / M * 100, 4) + '%')); });
      var out = row('মোলার ভর', '<em>' + fmt(M, 7) + '</em> g/mol') + lines.join('');
      var g = num('tk-grams'), mol = num('tk-moles');
      if (isFinite(g)) out += row(fmt(g) + ' g → মোল', fmt(g / M, 6) + ' mol', 'কণা: ' + fmt(g / M * 6.02214076e23, 5));
      if (isFinite(mol)) out += row(fmt(mol) + ' mol → ভর', fmt(mol * M, 6) + ' g', 'কণা: ' + fmt(mol * 6.02214076e23, 5));
      return out;
    } catch (e) { return warn(e.message); }
  }

  /* ---------- 2. Vector ---------- */
  function vecRun() {
    var a = [num('tk-ax'), num('tk-ay'), num('tk-az')], b = [num('tk-bx'), num('tk-by'), num('tk-bz')];
    a = a.map(function (x) { return isFinite(x) ? x : 0; }); b = b.map(function (x) { return isFinite(x) ? x : 0; });
    var dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2], ma = Math.hypot(a[0], a[1], a[2]), mb = Math.hypot(b[0], b[1], b[2]);
    var cr = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    var ang = (ma && mb) ? Math.acos(Math.max(-1, Math.min(1, dot / (ma * mb)))) * 180 / Math.PI : NaN;
    var t = function (v) { return '(' + v.map(function (x) { return fmt(x, 6); }).join(', ') + ')'; };
    var proj = mb ? dot / mb : NaN;
    return row('|A|', fmt(ma, 6)) + row('|B|', fmt(mb, 6)) + row('A + B', t([a[0] + b[0], a[1] + b[1], a[2] + b[2]])) + row('A − B', t([a[0] - b[0], a[1] - b[1], a[2] - b[2]])) +
      row('A · B (ডট)', fmt(dot, 6)) + row('A × B (ক্রস)', t(cr), '|A × B| = ' + fmt(Math.hypot(cr[0], cr[1], cr[2]), 6)) +
      row('মধ্যবর্তী কোণ θ', isFinite(ang) ? fmt(ang, 6) + '°' : '—') + row('A-এর B-দিকে উপাংশ', fmt(proj, 6)) +
      (ma ? row('Â (একক ভেক্টর)', t(a.map(function (x) { return x / ma; }))) : '');
  }

  /* ---------- 3. Matrix ---------- */
  function matInputs(prefix, n) {
    var h = '<div class="tk-mat" style="--n:' + n + '">';
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) h += '<input id="tk-' + prefix + i + j + '" inputmode="decimal" value="' + (i === j ? 1 : 0) + '" aria-label="' + prefix.toUpperCase() + ' ' + (i + 1) + ',' + (j + 1) + '">';
    return h + '</div>';
  }
  function readMat(prefix, n) { var M = []; for (var i = 0; i < n; i++) { M[i] = []; for (var j = 0; j < n; j++) { var v = num('tk-' + prefix + i + j); M[i][j] = isFinite(v) ? v : 0; } } return M; }
  function det(M) {
    var n = M.length; if (n === 1) return M[0][0]; if (n === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];
    var d = 0; for (var j = 0; j < n; j++) d += (j % 2 ? -1 : 1) * M[0][j] * det(M.slice(1).map(function (r) { return r.filter(function (_, c) { return c !== j; }); })); return d;
  }
  function inv(M) {
    var n = M.length, d = det(M); if (Math.abs(d) < 1e-12) return null;
    var C = M.map(function (r, i) { return r.map(function (_, j) { var minor = M.filter(function (_, a) { return a !== i; }).map(function (rr) { return rr.filter(function (_, c) { return c !== j; }); }); return ((i + j) % 2 ? -1 : 1) * (n === 2 ? minor[0][0] : det(minor)); }); });
    return C[0].map(function (_, j) { return C.map(function (r) { return r[j] / d; }); });
  }
  function mtable(M) { return '<div class="tk-mat out" style="--n:' + M.length + '">' + M.map(function (r) { return r.map(function (x) { return '<span>' + fmt(x, 5) + '</span>'; }).join(''); }).join('') + '</div>'; }
  function matRun() {
    var n = parseInt(val('tk-n'), 10) || 2, A = readMat('a', n), B = readMat('b', n), op = val('tk-op'), r = '';
    if (op === 'det') r = row('det(A)', fmt(det(A), 8));
    else if (op === 'inv') { var I = inv(A); r = I ? '<p class="tk-cap">A⁻¹</p>' + mtable(I) : warn('det(A) = 0, তাই বিপরীত ম্যাট্রিক্স নেই'); }
    else if (op === 'tr') r = '<p class="tk-cap">Aᵀ</p>' + mtable(A[0].map(function (_, j) { return A.map(function (x) { return x[j]; }); }));
    else if (op === 'add') r = '<p class="tk-cap">A + B</p>' + mtable(A.map(function (x, i) { return x.map(function (v, j) { return v + B[i][j]; }); }));
    else if (op === 'mul') r = '<p class="tk-cap">A × B</p>' + mtable(A.map(function (x, i) { return x.map(function (_, j) { var s = 0; for (var k = 0; k < n; k++) s += A[i][k] * B[k][j]; return s; }); }));
    return r;
  }
  function matForm() {
    var n = parseInt(val('tk-n'), 10) || 2;
    return '<div class="tk-grid2"><label class="tk-field"><span>আকার</span><select id="tk-n"><option value="2"' + (n === 2 ? ' selected' : '') + '>2 × 2</option><option value="3"' + (n === 3 ? ' selected' : '') + '>3 × 3</option></select></label>' +
      '<label class="tk-field"><span>অপারেশন</span><select id="tk-op"><option value="det">det(A)</option><option value="inv">A⁻¹</option><option value="tr">Aᵀ</option><option value="add">A + B</option><option value="mul">A × B</option></select></label></div>' +
      '<div class="tk-grid2"><div><p class="tk-cap">ম্যাট্রিক্স A</p>' + matInputs('a', n) + '</div><div><p class="tk-cap">ম্যাট্রিক্স B</p>' + matInputs('b', n) + '</div></div>';
  }

  /* ---------- 4. Statistics ---------- */
  function statsRun() {
    var xs = val('tk-data').split(/[\s,;]+/).filter(Boolean).map(Number);
    if (!xs.length) return warn('সংখ্যাগুলো কমা বা স্পেস দিয়ে লিখুন');
    if (xs.some(function (x) { return !isFinite(x); })) return warn('শুধু সংখ্যা দিন');
    var n = xs.length, s = xs.slice().sort(function (a, b) { return a - b; }), sum = xs.reduce(function (a, b) { return a + b; }, 0), mean = sum / n;
    var q = function (p) { var pos = (n - 1) * p, lo = Math.floor(pos), hi = Math.ceil(pos); return s[lo] + (s[hi] - s[lo]) * (pos - lo); };
    var freq = {}, mx = 0; xs.forEach(function (x) { freq[x] = (freq[x] || 0) + 1; mx = Math.max(mx, freq[x]); });
    var modes = mx > 1 ? Object.keys(freq).filter(function (k) { return freq[k] === mx; }).join(', ') : 'নেই';
    var ss = xs.reduce(function (a, x) { return a + (x - mean) * (x - mean); }, 0), vp = ss / n, vs = n > 1 ? ss / (n - 1) : NaN;
    return row('সংখ্যা (n)', n) + row('যোগফল', fmt(sum)) + row('গড় (Mean)', fmt(mean)) + row('মধ্যক (Median)', fmt(q(.5))) + row('প্রচুরক (Mode)', modes) +
      row('ন্যূনতম / সর্বোচ্চ', fmt(s[0]) + ' / ' + fmt(s[n - 1])) + row('পরিসর (Range)', fmt(s[n - 1] - s[0])) + row('Q1 / Q3', fmt(q(.25)) + ' / ' + fmt(q(.75))) +
      row('ভেদাঙ্ক σ² (জনসংখ্যা)', fmt(vp)) + row('পরিমিত ব্যবধান σ', fmt(Math.sqrt(vp))) + row('নমুনা ভেদাঙ্ক s²', fmt(vs)) + row('নমুনা ব্যবধান s', fmt(Math.sqrt(vs)));
  }

  /* ---------- 5. Quadratic ---------- */
  function quadRun() {
    var a = num('tk-qa'), b = num('tk-qb'), c = num('tk-qc');
    if (![a, b, c].every(isFinite)) return warn('a, b, c তিনটি মানই দিন');
    if (a === 0) return b === 0 ? warn('a ও b দুটিই 0 হলে সমীকরণ নয়') : row('রৈখিক সমীকরণ', 'x = ' + fmt(-c / b, 8));
    var D = b * b - 4 * a * c, out = row('নিশ্চায়ক D = b² − 4ac', fmt(D, 8), D > 0 ? 'দুটি ভিন্ন বাস্তব মূল' : D === 0 ? 'দুটি সমান বাস্তব মূল' : 'কাল্পনিক (জটিল) মূল');
    if (D >= 0) { var r = Math.sqrt(D); out += row('x₁', fmt((-b + r) / (2 * a), 8)) + row('x₂', fmt((-b - r) / (2 * a), 8)); }
    else { var re = -b / (2 * a), im = Math.sqrt(-D) / (2 * a); out += row('x₁', fmt(re, 6) + ' + ' + fmt(Math.abs(im), 6) + 'i') + row('x₂', fmt(re, 6) + ' − ' + fmt(Math.abs(im), 6) + 'i'); }
    return out + row('মূলের যোগফল', fmt(-b / a, 8), '−b/a') + row('মূলের গুণফল', fmt(c / a, 8), 'c/a') + row('শীর্ষবিন্দু', '(' + fmt(-b / (2 * a), 6) + ', ' + fmt(c - b * b / (4 * a), 6) + ')', a > 0 ? 'পরাবৃত্ত উপরমুখী: এটি সর্বনিম্ন মান' : 'পরাবৃত্ত নিম্নমুখী: এটি সর্বোচ্চ মান');
  }

  /* ---------- 6. Base converter ---------- */
  var DIG = '0123456789abcdefghijklmnopqrstuvwxyz';
  function toBig(str, base) { var neg = false, v = 0n, B = BigInt(base); str = str.trim().toLowerCase(); if (str[0] === '-') { neg = true; str = str.slice(1); } if (!str) throw new Error('সংখ্যা লিখুন'); for (var i = 0; i < str.length; i++) { var d = DIG.indexOf(str[i]); if (d < 0 || d >= base) throw new Error('"' + str[i] + '" এই বেসে বৈধ নয়'); v = v * B + BigInt(d); } return neg ? -v : v; }
  function fromBig(v, base) { if (v === 0n) return '0'; var neg = v < 0n, B = BigInt(base), s = ''; if (neg) v = -v; while (v > 0n) { s = DIG[Number(v % B)] + s; v /= B; } return (neg ? '-' : '') + s.toUpperCase(); }
  function baseRun() {
    if (typeof BigInt === 'undefined') return warn('এই ব্রাউজারে BigInt সমর্থিত নয়');
    try {
      var from = parseInt(val('tk-from'), 10), to = parseInt(val('tk-to'), 10), v = toBig(val('tk-num'), from);
      return row('বেস ' + to, '<em>' + fromBig(v, to) + '</em>') + row('বাইনারি (2)', fromBig(v, 2)) + row('অক্টাল (8)', fromBig(v, 8)) + row('দশমিক (10)', fromBig(v, 10)) + row('হেক্স (16)', fromBig(v, 16));
    } catch (e) { return warn(e.message); }
  }
  function baseOpts(sel) { var o = ''; for (var b = 2; b <= 36; b++) o += '<option value="' + b + '"' + (b === sel ? ' selected' : '') + '>' + b + (b === 2 ? ' (বাইনারি)' : b === 8 ? ' (অক্টাল)' : b === 10 ? ' (দশমিক)' : b === 16 ? ' (হেক্স)' : '') + '</option>'; return o; }

  /* ---------- 7. Sig figs & scientific notation ---------- */
  function sigCount(str) {
    var s = str.trim().replace(/^[+-]/, '').toLowerCase(), m = s.split('e')[0];
    if (!/^(\d+\.?\d*|\.\d+)$/.test(m)) return NaN;
    if (m.indexOf('.') >= 0) return m.replace('.', '').replace(/^0+/, '').length || 1;
    return m.replace(/^0+/, '').replace(/0+$/, '').length || 1;
  }
  function sciRun() {
    var raw = val('tk-sig'), x = Number(raw.replace(/,/g, '.')), n = parseInt(val('tk-sn'), 10);
    if (!raw.trim() || !isFinite(x)) return warn('একটি সংখ্যা দিন, যেমন 0.004560 বা 1.20e5');
    var sc = sigCount(raw.replace(/,/g, '.')), pretty = function (e) { return e.replace(/e\+?(-?\d+)/, ' × 10^$1'); };
    var out = row('সার্থক অঙ্ক', isFinite(sc) ? sc : '—') + row('বৈজ্ঞানিক আকার', pretty(x.toExponential(isFinite(sc) ? Math.max(0, sc - 1) : undefined)));
    if (n >= 1 && n <= 15) out += row(n + ' সার্থক অঙ্কে', x.toPrecision(n).replace(/e\+?(-?\d+)/, ' × 10^$1'), pretty(x.toExponential(n - 1)));
    return out + row('SI উপসর্গ', prefixFor(x));
  }
  function prefixFor(x) {
    if (!x) return '—'; var P = [[1e12, 'T (টেরা)'], [1e9, 'G (গিগা)'], [1e6, 'M (মেগা)'], [1e3, 'k (কিলো)'], [1, '—'], [1e-3, 'm (মিলি)'], [1e-6, 'µ (মাইক্রো)'], [1e-9, 'n (ন্যানো)'], [1e-12, 'p (পিকো)']], a = Math.abs(x);
    for (var i = 0; i < P.length; i++) if (a >= P[i][0]) return fmt(x / P[i][0], 6) + ' ' + P[i][1].split(' ')[0];
    return fmt(x / 1e-12, 6) + ' p';
  }

  /* ---------- 8. Percent & ratio ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; }
  function pctRun() {
    var mode = val('tk-pm'), x = num('tk-px'), y = num('tk-py');
    if (!isFinite(x) || !isFinite(y)) return warn('দুটি সংখ্যাই দিন');
    if (mode === 'of') return row(fmt(x) + '% of ' + fmt(y), '<em>' + fmt(x / 100 * y, 8) + '</em>');
    if (mode === 'is') return y === 0 ? warn('দ্বিতীয় সংখ্যা 0 হতে পারে না') : row(fmt(x) + ' হলো ' + fmt(y) + '-এর', '<em>' + fmt(x / y * 100, 8) + '%</em>');
    if (mode === 'chg') return x === 0 ? warn('পুরনো মান 0 হতে পারে না') : row('শতকরা পরিবর্তন', '<em>' + fmt((y - x) / Math.abs(x) * 100, 8) + '%</em>', y >= x ? 'বৃদ্ধি' : 'হ্রাস');
    if (Number.isInteger(x) && Number.isInteger(y) && x && y) { var g = gcd(x, y); return row('সরল অনুপাত', '<em>' + (x / g) + ' : ' + (y / g) + '</em>', 'গ.সা.গু. = ' + g); }
    return x && y ? row('অনুপাত x : y', '<em>1 : ' + fmt(y / x, 6) + '</em>') : warn('অনুপাতে 0 নয় এমন সংখ্যা দিন');
  }

  /* ---------- 9. Focus sounds ---------- */
  var ac = null, node = null, gainNode = null, playing = '';
  function stopSound() { try { if (node) { node.stop(); node.disconnect(); } if (ac) ac.close(); } catch (e) { } ac = node = gainNode = null; playing = ''; var b = document.querySelectorAll('[data-snd]'); Array.prototype.forEach.call(b, function (x) { x.classList.remove('on'); x.setAttribute('aria-pressed', 'false'); }); }
  function makeRainBuffer(context) {
    /* A soft pink-noise rain bed with many tiny, irregular water-drop transients. */
    var seconds = 10, rate = context.sampleRate, len = rate * seconds, buffer = context.createBuffer(2, len, rate);
    for (var channel = 0; channel < 2; channel++) {
      var data = buffer.getChannelData(channel), b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (var i = 0; i < len; i++) {
        var white = Math.random() * 2 - 1;
        b0 = .99886 * b0 + white * .0555179; b1 = .99332 * b1 + white * .0750759; b2 = .969 * b2 + white * .153852;
        b3 = .8665 * b3 + white * .3104856; b4 = .55 * b4 + white * .5329522; b5 = -.7616 * b5 - white * .016898;
        var pink = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * .5362) * .11; b6 = white * .115926;
        data[i] = pink + white * .012;
      }
      /* Frequent light droplets create a natural, soft patter rather than a harsh hiss. */
      var drops = 520;
      for (var drop = 0; drop < drops; drop++) {
        var start = Math.floor(Math.random() * (len - rate * .09)), duration = .018 + Math.random() * .065;
        var count = Math.min(Math.floor(duration * rate), len - start), frequency = 850 + Math.random() * 3300;
        var amplitude = .018 + Math.random() * .045, phase = Math.random() * Math.PI * 2, panBias = channel === 0 ? .93 : 1.07;
        for (var j = 0; j < count; j++) {
          var t = j / count, envelope = Math.pow(1 - t, 2.8) * Math.sin(Math.PI * Math.min(1, t * 1.7));
          var shimmer = Math.sin(2 * Math.PI * frequency * j / rate + phase + Math.sin(t * 8) * .35);
          data[start + j] += shimmer * amplitude * envelope * panBias;
        }
      }
      /* A few deeper, softer splashes add distance and variation. */
      for (var splash = 0; splash < 24; splash++) {
        var at = Math.floor(Math.random() * (len - rate * .16)), span = Math.floor((.055 + Math.random() * .09) * rate), hz = 420 + Math.random() * 1050, level = .025 + Math.random() * .035, ph = Math.random() * 6.28;
        for (var k = 0; k < span && at + k < len; k++) {
          var u = k / span, env = Math.pow(1 - u, 2) * Math.sin(Math.PI * u);
          data[at + k] += Math.sin(2 * Math.PI * hz * k / rate + ph) * level * env;
        }
      }
    }
    return buffer;
  }
  function startSound(kind) {
    stopSound();
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    ac = new AC();
    var len = ac.sampleRate * 5, buf, d, b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
    if (kind === 'rain') buf = makeRainBuffer(ac);
    else {
      buf = ac.createBuffer(1, len, ac.sampleRate); d = buf.getChannelData(0);
      for (var i = 0; i < len; i++) {
        var w = Math.random() * 2 - 1;
        if (kind === 'brown' || kind === 'ocean') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
        else if (kind === 'pink') { b0 = .99886 * b0 + w * .0555179; b1 = .99332 * b1 + w * .0750759; b2 = .969 * b2 + w * .153852; b3 = .8665 * b3 + w * .3104856; b4 = .55 * b4 + w * .5329522; b5 = -.7616 * b5 - w * .016898; d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * .5362) * .11; b6 = w * .115926; }
        else d[i] = w * .6;
      }
    }
    node = ac.createBufferSource(); node.buffer = buf; node.loop = true;
    var last2 = node;
    if (kind === 'rain') { var hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 330; hp.Q.value = .55; var lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6100; lp.Q.value = .55; last2.connect(hp); hp.connect(lp); last2 = lp; }
    gainNode = ac.createGain(); gainNode.gain.value = (parseFloat((document.getElementById('tk-vol') || {}).value) || 32) / 100 * .6;
    last2.connect(gainNode); gainNode.connect(ac.destination);
    if (kind === 'ocean') { var lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = .09; lg.gain.value = .25; lfo.connect(lg); lg.connect(gainNode.gain); lfo.start(); }
    node.start(); if (ac.state === 'suspended') ac.resume(); playing = kind; return true;
  }
  function soundForm() {
    var K = [['rain', '🌧 নরম বৃষ্টি'], ['brown', '🌊 ব্রাউন নয়েজ'], ['pink', '🍃 পিঙ্ক নয়েজ'], ['white', '📻 হোয়াইট নয়েজ'], ['ocean', '🏖 সমুদ্রের ঢেউ']];
    return '<p class="tk-note">শান্ত ব্যাকগ্রাউন্ড সাউন্ড বেছে নিন। যেকোনো সাউন্ডে আবার চাপলে বন্ধ হবে; ভলিউম কম থেকে শুরু করুন।</p><div class="tk-chips">' + K.map(function (k) { return '<button type="button" class="tk-chip" data-snd="' + k[0] + '" aria-pressed="false">' + k[1] + '</button>'; }).join('') + '</div>' +
      '<label class="tk-field"><span>ভলিউম</span><input id="tk-vol" type="range" min="5" max="100" value="32"></label><button type="button" class="btn ghost" data-snd-stop="1">■ বন্ধ করুন</button>';
  }

  /* ---------- registry ---------- */
  var TOOLS = [
    { id: 'molar', icon: '⚗️', label: 'মোলার ভর নির্ণয়', desc: 'রাসায়নিক সূত্র লিখে Molar Mass, শতকরা সংযুতি ও মোল বের করুন', form: function () { return guide(['রাসায়নিক সূত্রের ঘরে মৌলের ইংরেজি প্রতীক ও সংখ্যা লিখুন।','প্রথম অক্ষর বড় হাতের, দ্বিতীয় অক্ষর থাকলে ছোট হাতের লিখুন: H, O, Na, Cl।','ভর (g) অথবা মোলের ঘরে মান দিলে অতিরিক্ত হিসাবও পাবেন; না চাইলে ফাঁকা রাখুন।'], 'পানি H2O, সালফিউরিক অ্যাসিড H2SO4, ক্যালসিয়াম হাইড্রোক্সাইড Ca(OH)2। সাবস্ক্রিপ্টের জন্য সাধারণ সংখ্যা ব্যবহার করুন।') + field('tk-formula', 'ধাপ ১: রাসায়নিক সূত্র লিখুন', 'H2O', { mode: 'text', ph: 'যেমন H2O বা Ca(OH)2' }) + '<div class="tk-grid2">' + field('tk-grams', 'ধাপ ২: নমুনার ভর (g) — ঐচ্ছিক', '') + field('tk-moles', 'ধাপ ২: মোলের পরিমাণ — ঐচ্ছিক', '') + '</div><label class="tk-check"><input id="tk-hsc" type="checkbox"> HSC-এর পূর্ণসংখ্যা পারমাণবিক ভর ব্যবহার করুন</label><p class="tk-note">আপনি লিখলেই নিচে ফলাফল আপডেট হবে।</p>'; }, run: molarRun },
    { id: 'vector', icon: '➚', label: 'Vector Calculator', desc: 'যোগ-বিয়োগ, ডট, ক্রস, কোণ ও একক ভেক্টর', form: function () { return '<p class="tk-cap">ভেক্টর A</p><div class="tk-grid3">' + field('tk-ax', 'x', '3') + field('tk-ay', 'y', '4') + field('tk-az', 'z', '0') + '</div><p class="tk-cap">ভেক্টর B</p><div class="tk-grid3">' + field('tk-bx', 'x', '1') + field('tk-by', 'y', '2') + field('tk-bz', 'z', '2') + '</div>'; }, run: vecRun },
    { id: 'matrix', icon: '▦', label: 'Matrix Calculator', desc: '2×2 ও 3×3 নির্ণায়ক, বিপরীত, গুণ ও যোগ', form: matForm, run: matRun },
    { id: 'stats', icon: '📊', label: 'Statistics', desc: 'গড়, মধ্যক, প্রচুরক, চতুর্থক ও পরিমিত ব্যবধান', form: function () { return '<label class="tk-field"><span>ডেটা (কমা বা স্পেস দিয়ে)</span><textarea id="tk-data" rows="3" inputmode="decimal">12, 15, 11, 18, 15, 20, 9</textarea></label>'; }, run: statsRun },
    { id: 'quad', icon: '𝑥²', label: 'দ্বিঘাত সমীকরণ সমাধান', desc: 'Quadratic Solver: ax² + bx + c = 0 সমীকরণের মূল ও শীর্ষবিন্দু বের করুন', form: function () { return guide(['সমীকরণটি ax² + bx + c = 0 আকারে লিখুন।','a ঘরে x²-এর সহগ, b ঘরে x-এর সহগ এবং c ঘরে ধ্রুবক সংখ্যা দিন।','তিনটি মান দিলেই মূল, মূলের যোগফল-গুণফল ও শীর্ষবিন্দু নিচে দেখা যাবে।'], 'x² − 5x + 6 = 0 হলে a = 1, b = −5, c = 6।') + '<div class="tk-grid3">' + field('tk-qa', 'a (x²-এর সহগ)', '1') + field('tk-qb', 'b (x-এর সহগ)', '-5') + field('tk-qc', 'c (ধ্রুবক)', '6') + '</div><p class="tk-note">মনে রাখুন: a = 0 হলে এটি দ্বিঘাত সমীকরণ থাকে না।</p>'; }, run: quadRun },
    { id: 'base', icon: '⌗', label: 'Base Converter', desc: 'বাইনারি, অক্টাল, দশমিক, হেক্স ও যেকোনো বেস', form: function () { return field('tk-num', 'সংখ্যা', '255', { mode: 'text' }) + '<div class="tk-grid2"><label class="tk-field"><span>যে বেস থেকে</span><select id="tk-from">' + baseOpts(10) + '</select></label><label class="tk-field"><span>যে বেসে</span><select id="tk-to">' + baseOpts(2) + '</select></label></div>'; }, run: baseRun },
    { id: 'sigfig', icon: '10ⁿ', label: 'সার্থক অঙ্ক ও বৈজ্ঞানিক রূপ', desc: 'Significant Figures: সার্থক অঙ্ক গণনা, বৈজ্ঞানিক রূপ ও রাউন্ডিং শিখুন', form: function () { return guide(['যে সংখ্যাটির সার্থক অঙ্ক জানতে চান সেটি লিখুন।','কতটি সার্থক অঙ্কে রাউন্ড করতে চান, ১ থেকে ১৫-এর মধ্যে লিখুন।','নিচে সার্থক অঙ্কের সংখ্যা, বৈজ্ঞানিক রূপ এবং রাউন্ড করা মান স্বয়ংক্রিয়ভাবে পাবেন।'], '0.004560 সংখ্যাটিতে ৪টি সার্থক অঙ্ক আছে; শুরুতে থাকা শূন্যগুলো গণনা হয় না, দশমিকের পর শেষের শূন্যটি গণনা হয়।') + field('tk-sig', 'ধাপ ১: সংখ্যাটি লিখুন', '0.004560', { mode: 'text', ph: 'যেমন 0.004560 বা 1.20e5' }) + field('tk-sn', 'ধাপ ২: কতটি সার্থক অঙ্কে রাউন্ড করবেন?', '2', { mode: 'numeric' }) + '<p class="tk-note">দশমিক ও বৈজ্ঞানিক নোটেশন—দুই ধরনের সংখ্যাই লিখতে পারবেন।</p>'; }, run: sciRun },
    { id: 'percent', icon: '％', label: 'Percent & Ratio', desc: 'শতকরা, পরিবর্তনের হার ও সরল অনুপাত', form: function () { return '<label class="tk-field"><span>কী বের করবেন</span><select id="tk-pm"><option value="of">x% of y</option><option value="is">x হলো y-এর কত %</option><option value="chg">x থেকে y-তে % পরিবর্তন</option><option value="ratio">x : y সরল অনুপাত</option></select></label><div class="tk-grid2">' + field('tk-px', 'x', '25') + field('tk-py', 'y', '240') + '</div>'; }, run: pctRun },
    { id: 'sound', icon: '🎧', label: 'Focus Sounds', desc: 'বৃষ্টি, ব্রাউন ও পিঙ্ক নয়েজ — পড়ায় মনোযোগের জন্য', form: soundForm, run: null }
  ];
  function byId(id) { return TOOLS.filter(function (t) { return t.id === id; })[0]; }
  var tiles = TOOLS.map(function (t) { return { href: '#/hub/' + t.id, icon: t.icon, label: t.label, desc: t.desc }; });

  function routeId() { return (location.hash.replace(/^#\/?/, '').split('/')[1] || '').split('?')[0]; }
  function toolPage(t) {
    return '<section class="w pgw hub hub-tool-page tk"><div class="hub-tool-page-nav"><a class="btn ghost" href="#/hub">← সব টুল</a></div><h1>' + E(t.label) + '</h1><p class="lead tk-lead">' + E(t.desc) + '</p>' +
      '<div class="tk-card card" data-tk="' + t.id + '"><div class="tk-form">' + t.form() + '</div>' + (t.run ? '<div class="tk-out" id="tk-out" aria-live="polite"></div>' : '') + '</div></section>';
  }
  function run(id) { var t = byId(id), out = document.getElementById('tk-out'); if (t && t.run && out) out.innerHTML = t.run(); }
  var bound = false;
  function mount(app) {
    var card = $('.tk-card', app); if (card) run(card.dataset.tk);
    if (bound) return; bound = true;
    app.addEventListener('input', function (e) { var c = e.target.closest && e.target.closest('.tk-card'); if (!c) return; if (e.target.id === 'tk-vol' && gainNode) { gainNode.gain.value = e.target.value / 100 * .6; return; } if (c.dataset.tk !== 'sound') run(c.dataset.tk); });
    app.addEventListener('change', function (e) {
      var c = e.target.closest && e.target.closest('.tk-card'); if (!c) return;
      if (c.dataset.tk === 'matrix' && e.target.id === 'tk-n') { var n = e.target.value, keepOp = val('tk-op'); c.querySelector('.tk-form').innerHTML = matForm(); var sel = document.getElementById('tk-n'); if (sel) sel.value = n; var op = document.getElementById('tk-op'); if (op) op.value = keepOp; }
      run(c.dataset.tk);
    });
    app.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-snd]');
      if (b) { var k = b.dataset.snd, was = playing === k; stopSound(); if (!was && startSound(k)) { b.classList.add('on'); b.setAttribute('aria-pressed', 'true'); } return; }
      if (e.target.closest && e.target.closest('[data-snd-stop]')) stopSound();
    });
  }

  var hub = window.CL_HUB = window.CL_HUB || { pages: {}, mount: function () { } };
  var origHub = hub.pages.hub;
  /* New tools live inside Student Hub: #/hub/<tool>. */
  hub.pages.hub = function () { var t = byId(routeId()); return t ? toolPage(t) : (origHub ? origHub.apply(this, arguments) : ''); };
  /* Old #/toolkit links keep working and forward into Student Hub. */
  hub.pages.toolkit = function () { var id = routeId(); setTimeout(function () { location.replace(byId(id) ? '#/hub/' + id : '#/hub'); }, 0); return '<section class="w pgw"></section>'; };
  var prevMount = hub.mount;
  hub.mount = function (pg, app) {
    var onTool = pg === 'hub' && byId(routeId());
    if (!onTool) stopSound();
    if (onTool) { mount(app); return; }
    if (prevMount) prevMount(pg, app);
  };
  window.CL_STUDIO = { tiles: tiles, tools: TOOLS, parseFormula: parseFormula, det: det, inv: inv, sigCount: sigCount, toBig: toBig, fromBig: fromBig };
})();
