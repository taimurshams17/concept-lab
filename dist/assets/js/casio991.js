/* ConceptLab · Casio fx-991ES PLUS style scientific calculator (Student Hub).
   Self-contained: its own tokenizer/parser, 45-key keypad, SHIFT / ALPHA layers, MODE setup, memory and history. */
(function () {
  'use strict';

  var NAMES = ['asinh', 'acosh', 'atanh', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'sin', 'cos', 'tan', 'sqrt', 'cbrt', 'ln', 'log', 'root', 'Ans', 'Ran#', 'pi'];
  var FUNCS = ['asinh', 'acosh', 'atanh', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'sin', 'cos', 'tan', 'sqrt', 'cbrt', 'ln', 'log', 'root'];

  // 45-key fx-991ES PLUS-inspired keypad: scientific functions first, numeric block below.
  // p = primary label/action, s/sa = SHIFT label/action, a = ALPHA variable, c = key style.
  var KEYS = [
    { p: 'SHIFT', pa: 'a:shift', c: 'mod' }, { p: 'ALPHA', pa: 'a:alpha', c: 'alpk' },
    { p: '◀', pa: 'a:left', c: 'nav' }, { p: '▶', pa: 'a:right', c: 'nav' }, { p: 'MODE', pa: 'a:mode', c: 'nav' },

    { p: 'x⁻¹', pa: 'i:^(-1)', s: 'x!', sa: 'i:!', c: 'fn' }, { p: 'x²', pa: 'i:^2', s: 'x³', sa: 'i:^3', c: 'fn' },
    { p: 'xʸ', pa: 'i:^(', s: 'ʸ√', sa: 'i:root(', c: 'fn' }, { p: '√', pa: 'i:sqrt(', s: '∛', sa: 'i:cbrt(', c: 'fn' },
    { p: 'log', pa: 'i:log(', s: '10ˣ', sa: 'i:10^(', c: 'fn' },

    { p: 'ln', pa: 'i:ln(', s: 'eˣ', sa: 'i:e^(', a: 'e', c: 'fn' }, { p: '(−)', pa: 'i:−', a: 'A', c: 'fn' },
    { p: 'hyp', pa: 'a:hyp', c: 'hyp' }, { p: 'sin', pa: 'i:sin(', s: 'sin⁻¹', sa: 'i:asin(', c: 'fn' },
    { p: 'cos', pa: 'i:cos(', s: 'cos⁻¹', sa: 'i:acos(', c: 'fn' },

    { p: 'tan', pa: 'i:tan(', s: 'tan⁻¹', sa: 'i:atan(', c: 'fn' }, { p: 'a b/c', pa: 'i:/', s: 'S⇔D', sa: 'a:sd', c: 'fn' },
    { p: ',', pa: 'i:,', a: 'F', c: 'fn' }, { p: 'π', pa: 'i:π', c: 'fn' }, { p: '%', pa: 'i:%', c: 'fn' },

    { p: 'RCL', pa: 'a:rcl', s: 'STO', sa: 'a:sto', c: 'fn' }, { p: 'ENG', pa: 'a:eng', c: 'fn' },
    { p: '(', pa: 'i:(', a: 'X', c: 'fn' }, { p: ')', pa: 'i:)', a: 'Y', c: 'fn' },
    { p: 'M+', pa: 'a:mplus', s: 'M−', sa: 'a:mminus', a: 'M', c: 'fn' },

    { p: '7', pa: 'i:7', c: 'num' }, { p: '8', pa: 'i:8', c: 'num' }, { p: '9', pa: 'i:9', c: 'num' },
    { p: 'DEL', pa: 'a:del', c: 'del' }, { p: 'AC', pa: 'a:ac', c: 'del' },

    { p: '4', pa: 'i:4', c: 'num' }, { p: '5', pa: 'i:5', c: 'num' }, { p: '6', pa: 'i:6', c: 'num' },
    { p: '×', pa: 'i:×', s: 'nPr', sa: 'i:P', a: 'B', c: 'op' }, { p: '÷', pa: 'i:÷', s: 'nCr', sa: 'i:C', c: 'op' },

    { p: '1', pa: 'i:1', c: 'num' }, { p: '2', pa: 'i:2', c: 'num' }, { p: '3', pa: 'i:3', c: 'num' },
    { p: '+', pa: 'i:+', a: 'D', c: 'op' }, { p: '−', pa: 'i:−', a: 'E', c: 'op' },

    { p: '0', pa: 'i:0', s: 'Rnd', sa: 'i:Ran#', c: 'num' }, { p: '.', pa: 'i:.', s: 'π', sa: 'i:π', c: 'num' },
    { p: 'EXP', pa: 'i:×10^', s: 'Ran#', sa: 'i:Ran#', c: 'num' }, { p: 'Ans', pa: 'i:Ans', s: 'DRG▶', sa: 'a:drg', c: 'fn' },
    { p: '=', pa: 'a:eq', c: 'eq' }
  ];

  var st = {
    expr: '', pos: 0, res: null, err: '', done: false,
    shift: false, alpha: false, setup: false, sto: false, msg: '',
    ang: 'DEG', fmt: 'NORM', dig: 2, frac: false, hyp: false, ans: 0,
    hist: [], vars: { A: 0, B: 0, D: 0, E: 0, F: 0, X: 0, Y: 0, M: 0 }
  };

  /* ---------- tokenizer and parser ---------- */
  function tokenize(src) {
    var s = String(src), out = [], i = 0;
    while (i < s.length) {
      var c = s.charAt(i);
      if (c === ' ') { i++; continue; }
      var m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
      if (m) { out.push({ t: 'n', v: parseFloat(m[1]) }); i += m[1].length; continue; }
      var hit = null;
      for (var k = 0; k < NAMES.length; k++) {
        if (s.substr(i, NAMES[k].length) === NAMES[k]) { hit = NAMES[k]; break; }
      }
      if (hit) { out.push({ t: 'id', v: hit }); i += hit.length; continue; }
      if (/[A-Za-z]/.test(c)) { out.push({ t: 'id', v: c }); i++; continue; }
      if (c === '×' || c === '*') { out.push({ t: '*' }); i++; continue; }
      if (c === '÷' || c === '/') { out.push({ t: '/' }); i++; continue; }
      if (c === '−' || c === '-') { out.push({ t: '-' }); i++; continue; }
      if ('+^(),!%'.indexOf(c) >= 0) { out.push({ t: c }); i++; continue; }
      if (c === 'π') { out.push({ t: 'id', v: 'pi' }); i++; continue; }
      throw new Error('Syntax ERROR');
    }
    return out;
  }

  function snap(x) { return Math.abs(x) < 1e-12 ? 0 : x; }
  function toRad(x) { return st.ang === 'DEG' ? x * Math.PI / 180 : st.ang === 'GRA' ? x * Math.PI / 200 : x; }
  function fromRad(x) { return st.ang === 'DEG' ? x * 180 / Math.PI : st.ang === 'GRA' ? x * 200 / Math.PI : x; }
  function mathErr() { return new Error('Math ERROR'); }

  function fact(n) {
    if (n < 0 || n > 170 || Math.floor(n) !== n) throw mathErr();
    var r = 1;
    for (var i = 2; i <= n; i++) r *= i;
    return r;
  }
  function perm(n, r) { if (n < 0 || r < 0 || n < r || n % 1 || r % 1) throw mathErr(); return fact(n) / fact(n - r); }
  function comb(n, r) { if (n < 0 || r < 0 || n < r || n % 1 || r % 1) throw mathErr(); return fact(n) / (fact(r) * fact(n - r)); }

  function callFn(nm, a) {
    var x = a[0];
    switch (nm) {
      case 'sin': return snap(Math.sin(toRad(x)));
      case 'cos': return snap(Math.cos(toRad(x)));
      case 'tan':
        if (Math.abs(Math.cos(toRad(x))) < 1e-12) throw mathErr();
        return snap(Math.tan(toRad(x)));
      case 'asin': if (Math.abs(x) > 1) throw mathErr(); return fromRad(Math.asin(x));
      case 'acos': if (Math.abs(x) > 1) throw mathErr(); return fromRad(Math.acos(x));
      case 'atan': return fromRad(Math.atan(x));
      case 'sinh': return Math.sinh(x);
      case 'cosh': return Math.cosh(x);
      case 'tanh': return Math.tanh(x);
      case 'asinh': return Math.asinh(x);
      case 'acosh': if (x < 1) throw mathErr(); return Math.acosh(x);
      case 'atanh': if (Math.abs(x) >= 1) throw mathErr(); return Math.atanh(x);
      case 'sqrt': if (x < 0) throw mathErr(); return Math.sqrt(x);
      case 'cbrt': return Math.cbrt(x);
      case 'ln': if (x <= 0) throw mathErr(); return Math.log(x);
      case 'log': if (x <= 0) throw mathErr(); return Math.log10(x);
      case 'root': {
        var n = a[0], v = a[1];
        if (v === undefined || n === 0) throw mathErr();
        if (v < 0) { if (n % 2 === 0) throw mathErr(); return -Math.pow(-v, 1 / n); }
        return Math.pow(v, 1 / n);
      }
    }
    throw new Error('Syntax ERROR');
  }

  function evaluate(src) {
    var tk = tokenize(src), p = 0, depth = 0, i;
    for (i = 0; i < tk.length; i++) {
      if (tk[i].t === '(') depth++;
      else if (tk[i].t === ')') depth--;
    }
    while (depth-- > 0) tk.push({ t: ')' });           // auto-close open brackets
    if (!tk.length) throw new Error('Syntax ERROR');

    function peek() { return tk[p] || { t: 'end' }; }
    function fail(m) { throw new Error(m || 'Syntax ERROR'); }
    function need(t) { if (peek().t !== t) fail(); p++; }
    function startsFactor(q) { return q.t === 'n' || q.t === '(' || (q.t === 'id' && q.v !== 'P' && q.v !== 'C'); }

    function expr() {
      var a = term();
      for (;;) {
        var q = peek();
        if (q.t === '+') { p++; a += term(); }
        else if (q.t === '-') { p++; a -= term(); }
        else return a;
      }
    }
    function term() {
      var a = unary();
      for (;;) {
        var q = peek();
        if (q.t === '*') { p++; a *= unary(); }
        else if (q.t === '/') { p++; var b = unary(); if (b === 0) fail('Math ERROR'); a /= b; }
        else if (startsFactor(q)) { a *= unary(); }     // implicit multiplication: 2π, 3(4+1), 2sin30
        else return a;
      }
    }
    function unary() {
      var q = peek();
      if (q.t === '-') { p++; return -unary(); }
      if (q.t === '+') { p++; return unary(); }
      return power();
    }
    function power() {
      var a = postfix();
      if (peek().t === '^') { p++; a = Math.pow(a, unary()); }
      return a;
    }
    function postfix() {
      var a = primary();
      for (;;) {
        var q = peek();
        if (q.t === '!') { p++; a = fact(a); }
        else if (q.t === '%') { p++; a = a / 100; }
        else if (q.t === 'id' && (q.v === 'P' || q.v === 'C')) {
          p++;
          var b = postfix();
          a = q.v === 'P' ? perm(a, b) : comb(a, b);
        }
        else return a;
      }
    }
    function primary() {
      var q = peek();
      if (q.t === 'n') { p++; return q.v; }
      if (q.t === '(') { p++; var v = expr(); need(')'); return v; }
      if (q.t === 'id') {
        p++;
        var nm = q.v;
        if (peek().t === '(') {
          if (FUNCS.indexOf(nm) < 0) fail();
          p++;
          var args = [expr()];
          while (peek().t === ',') { p++; args.push(expr()); }
          need(')');
          return callFn(nm, args);
        }
        if (nm === 'pi') return Math.PI;
        if (nm === 'e') return Math.E;
        if (nm === 'Ans') return st.ans;
        if (nm === 'Ran#') return Math.random();
        if (nm === 'P' || nm === 'C') fail();
        if (/^[A-Z]$/.test(nm)) return st.vars[nm] || 0;
        fail();
      }
      fail();
    }

    var result = expr();
    if (p < tk.length) fail();
    if (!isFinite(result)) throw mathErr();
    return result;
  }

  /* ---------- formatting ---------- */
  function sciStr(x, d) {
    var parts = Number(x).toExponential(d).split('e');
    var m = parts[0];
    if (m.indexOf('.') >= 0) m = m.replace(/0+$/, '').replace(/\.$/, '');
    return m + '×10^' + parseInt(parts[1], 10);
  }
  function fmtNum(x) {
    if (!isFinite(x)) return 'Math ERROR';
    if (x === 0) return '0';
    if (st.fmt === 'FIX') return Number(x).toFixed(st.dig);
    if (st.fmt === 'SCI') return sciStr(x, st.dig);
    var a = Math.abs(x);
    if (a >= 1e10 || a < 1e-2) return sciStr(x, 9);     // Norm 1 thresholds
    return String(parseFloat(x.toPrecision(10)));
  }
  function toFrac(x) {
    if (!isFinite(x)) return null;
    var neg = x < 0; x = Math.abs(x);
    var whole = Math.floor(x), f = x - whole;
    if (f < 1e-12) return (neg ? '-' : '') + whole;
    var h0 = 0, h1 = 1, k0 = 1, k1 = 0, z = f;
    for (var i = 0; i < 40; i++) {
      var a = Math.floor(z);
      var h = a * h1 + h0, k = a * k1 + k0;
      h0 = h1; h1 = h; k0 = k1; k1 = k;
      if (k1 > 1e6) return null;
      if (Math.abs(h1 / k1 - f) < 1e-10) break;
      var r = z - a;
      if (r < 1e-12) break;
      z = 1 / r;
    }
    if (!k1 || Math.abs(h1 / k1 - f) > 1e-9) return null;
    var s = whole ? whole + ' ' + h1 + '/' + k1 : h1 + '/' + k1;
    return (neg ? '-' : '') + s;
  }
  function fmtAny(x) {
    if (st.frac) { var f = toFrac(x); if (f !== null) return f; }
    return fmtNum(x);
  }
  function disp(s) {
    return s.replace(/sqrt\(/g, '√(').replace(/cbrt\(/g, '∛(').replace(/asin\(/g, 'sin⁻¹(')
      .replace(/acos\(/g, 'cos⁻¹(').replace(/atan\(/g, 'tan⁻¹(')
      .replace(/\^\(-1\)/g, '⁻¹').replace(/\^2/g, '²').replace(/\^3/g, '³')
      .replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ---------- state changes ---------- */
  function run() {
    if (!st.expr) return;
    try {
      var v = evaluate(st.expr);
      st.ans = v; st.res = v; st.err = ''; st.done = true;
      st.hist.unshift({ e: st.expr, r: fmtAny(v) });
      st.hist = st.hist.slice(0, 8);
    } catch (e) {
      st.res = null; st.err = e.message || 'Syntax ERROR'; st.done = false;
    }
  }
  function insertText(t) {
    if (st.done) {
      if (/^[+\-−×÷*\/^%!PC),]/.test(t)) { st.expr = 'Ans'; st.pos = 3; }   // continue from last result
      else { st.expr = ''; st.pos = 0; }
      st.done = false; st.res = null;
    }
    st.err = ''; st.msg = '';
    st.expr = st.expr.slice(0, st.pos) + t + st.expr.slice(st.pos);
    st.pos += t.length;
  }
  function del() {
    if (st.done) { ac(); return; }
    st.err = '';
    if (st.pos > 0) { st.expr = st.expr.slice(0, st.pos - 1) + st.expr.slice(st.pos); st.pos--; }
  }
  function move(d) {
    if (st.done) return;
    st.pos = Math.max(0, Math.min(st.expr.length, st.pos + d));
  }
  function ac() {
    st.expr = ''; st.pos = 0; st.res = null; st.err = ''; st.done = false; st.msg = ''; st.sto = false;
  }
  function memAdd(sg) {
    var v = st.ans;
    if (st.expr && !st.done) {
      try { v = evaluate(st.expr); } catch (e) { st.err = e.message || 'Syntax ERROR'; return; }
    }
    st.vars.M += sg * v;
    st.msg = 'M ' + (sg > 0 ? '+' : '−') + ' ' + fmtNum(v);
  }
  function storeOrInsertLetter(L) {
    if (st.sto) { st.vars[L] = st.ans; st.msg = L + ' ← ' + fmtNum(st.ans); st.sto = false; return; }
    insertText(L);
  }
  function runCode(c) {
    if (!c) return;
    if (c.indexOf('i:') === 0) { st.sto = false; insertText(c.slice(2)); return; }
    var a = c.slice(2);
    if (a !== 'sto') { st.sto = false; st.msg = ''; }
    switch (a) {
      case 'left': move(-1); break;
      case 'right': move(1); break;
      case 'hyp': st.hyp = !st.hyp; st.msg = st.hyp ? 'HYP: sin/cos/tan = sinh/cosh/tanh' : 'HYP বন্ধ'; break;
      case 'eng': { if (st.expr) { var m = /(-?\d+(?:\.\d+)?)(?:×10\^)(-?\d+)$/.exec(st.expr); if (m) { var n = +m[1], e = +m[2], eng = Math.floor(e / 3) * 3; st.expr = st.expr.slice(0, m.index) + (n * Math.pow(10, e - eng)) + '×10^' + eng; st.pos = st.expr.length; } else st.msg = 'ENG: আগে scientific notation দিন'; } else st.msg = 'ENG: একটি সংখ্যা লিখুন'; break; }
      case 'drg': st.ang = st.ang === 'DEG' ? 'RAD' : st.ang === 'RAD' ? 'GRA' : 'DEG'; st.msg = 'Angle: ' + st.ang; break;
      case 'del': del(); break;
      case 'ac': ac(); break;
      case 'eq': run(); break;
      case 'sd': st.frac = !st.frac; break;
      case 'mplus': memAdd(1); break;
      case 'mminus': memAdd(-1); break;
      case 'rcl': insertText('M'); break;
      case 'sto': st.sto = true; st.msg = 'STO: ALPHA চেপে ভেরিয়েবল বেছে নিন (A B D E F X Y M)'; break;
    }
  }
  function press(i) {
    var k = KEYS[i];
    if (!k) return;
    var wasSetup = st.setup, sh = st.shift, al = st.alpha;
    st.setup = false;
    if (k.pa === 'a:shift') { st.shift = !sh; st.alpha = false; return; }
    if (k.pa === 'a:alpha') { st.alpha = !al; st.shift = false; return; }
    if (k.pa === 'a:mode') { st.setup = !wasSetup; st.shift = false; st.alpha = false; return; }
    if (k.pa === 'a:hyp') { st.hyp = !st.hyp; st.shift = false; st.alpha = false; st.msg = st.hyp ? 'HYP: sin/cos/tan = sinh/cosh/tanh' : 'HYP বন্ধ'; return; }
    st.shift = false; st.alpha = false;
    if (sh && st.hyp && ['sin','cos','tan'].indexOf(k.p) >= 0) { runCode('i:a' + k.p + 'h('); st.hyp = false; return; }
    if (sh) { runCode(k.sa); return; }
    if (al) { if (k.a) storeOrInsertLetter(k.a); return; }
    if (st.hyp && ['sin','cos','tan'].indexOf(k.p) >= 0) { runCode('i:' + k.p + 'h('); st.hyp = false; return; }
    if (k.p === 'a b/c' && st.expr.lastIndexOf('root(') > st.expr.lastIndexOf(')')) { insertText(','); return; }
    runCode(k.pa);
  }
  function setSetting(v) {
    if (v === 'DEG' || v === 'RAD' || v === 'GRA') st.ang = v;
    else st.fmt = v;
  }

  /* ---------- rendering ---------- */
  function setupHTML() {
    function b(code, label, on) {
      return '<button type="button" class="cz9-set' + (on ? ' on' : '') + '" data-cs="' + code + '">' + label + '</button>';
    }
    var digits = '';
    if (st.fmt !== 'NORM') {
      var ds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], html = '';
      for (var d = 0; d < ds.length; d++) html += b('dig:' + d, String(d), st.dig === d);
      digits = '<div class="cz9-setup-row"><span>Digits</span>' + html + '</div>';
    }
    return '<div class="cz9-setup">' +
      '<div class="cz9-setup-row"><span>Angle</span>' + b('set:DEG', 'Deg', st.ang === 'DEG') + b('set:RAD', 'Rad', st.ang === 'RAD') + b('set:GRA', 'Gra', st.ang === 'GRA') + '</div>' +
      '<div class="cz9-setup-row"><span>Display</span>' + b('set:NORM', 'Norm', st.fmt === 'NORM') + b('set:FIX', 'Fix', st.fmt === 'FIX') + b('set:SCI', 'Sci', st.fmt === 'SCI') + '</div>' +
      digits +
      '<div class="cz9-setup-row"><button type="button" class="cz9-set" data-cs="close">বন্ধ করুন ✕</button></div></div>';
  }

  function inner() {
    var raw = st.expr;
    var caretHtml = '<span class="cz9-caret"></span>';
    var exprHtml = raw ? esc(disp(raw.slice(0, st.pos))) + caretHtml + esc(disp(raw.slice(st.pos))) : caretHtml;

    var status = '';
    if (st.shift) status += '<b class="sh">SHIFT</b>';
    if (st.alpha) status += '<b class="al">ALPHA</b>';
    if (st.hyp) status += '<b class="hy">HYP</b>';
    status += '<span>' + st.ang + '</span>';
    if (st.fmt !== 'NORM') status += '<span>' + st.fmt + ' ' + st.dig + '</span>';
    if (st.frac) status += '<span>a b/c</span>';
    if (st.vars.M) status += '<span>M</span>';
    if (st.sto) status += '<span>STO</span>';

    var resHtml;
    if (st.err) resHtml = '<span class="cz9-err">' + esc(st.err) + '</span>';
    else if (st.done && st.res !== null) resHtml = esc(fmtAny(st.res));
    else resHtml = '';

    var keys = KEYS.map(function (k, i) {
      var tags = '<span class="cz9-tag sec">' + (k.s ? esc(k.s) : '') + '</span>' +
                 '<span class="cz9-tag alp">' + (k.a ? esc(k.a) : '') + '</span>';
      return '<div class="cz9-cell"><div class="cz9-tags">' + tags + '</div>' +
        '<button type="button" class="cz9-k ' + k.c + '" data-cs="k:' + i + '" aria-label="' + esc(k.p) + '">' + esc(k.p) + '</button></div>';
    }).join('');

    return '<div class="cz9-device">' +
      '<div class="cz9-brand"><b>fx-991ES PLUS</b><span>ConceptLab Scientific</span></div>' +
      '<div class="cz9-screen">' +
        '<div class="cz9-status">' + status + '</div>' +
        '<div class="cz9-expr">' + exprHtml + '</div>' +
        '<div class="cz9-res" aria-live="polite">' + resHtml + '</div>' +
        '<div class="cz9-msg">' + esc(st.msg) + '</div>' +
      '</div>' +
      (st.setup ? setupHTML() : '') +
      '<div class="cz9-pad">' + keys + '</div>' +
    '</div>';
  }

  function render() {
    var r = document.getElementById('czRoot');
    if (r) r.innerHTML = inner();
  }

  function view(tabsHtml) {
    return '<div class="card hubc cz9-card">' + (tabsHtml || '') +
      '<div class="cz9-wrap" id="czRoot">' + inner() + '</div>' +
      '<p class="mutt cz9-note">কিবোর্ডেও টাইপ করা যায় (Enter = সমান, Backspace = DEL, Esc = AC)। SHIFT ও ALPHA লেবেল কী-এর উপরে দেখানো আছে।</p></div>';
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-cs]') : null;
    if (!b) return;
    var v = b.getAttribute('data-cs');
    if (v.indexOf('k:') === 0) press(+v.slice(2));
    else if (v.indexOf('set:') === 0) setSetting(v.slice(4));
    else if (v.indexOf('dig:') === 0) st.dig = +v.slice(4);
    else if (v.indexOf('hist:') === 0) {
      var h = st.hist[+v.slice(5)];
      if (h) { st.expr = h.e; st.pos = h.e.length; st.done = false; st.res = null; st.err = ''; }
    }
    else if (v === 'close') st.setup = false;
    render();
  });

  document.addEventListener('keydown', function (e) {
    if (!document.getElementById('czRoot')) return;
    var ae = document.activeElement;
    if (ae && (/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) || ae.isContentEditable)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key, handled = true;
    if (/^[0-9]$/.test(k)) insertText(k);
    else if ('+-*/^(),.!%'.indexOf(k) >= 0 && k.length === 1) insertText({ '*': '×', '/': '÷', '-': '−' }[k] || k);
    else if (k === 'Enter' || k === '=') {
      if (ae && ae.tagName === 'BUTTON') return;
      run();
    }
    else if (k === 'Backspace') del();
    else if (k === 'Escape') ac();
    else if (k === 'ArrowLeft') move(-1);
    else if (k === 'ArrowRight') move(1);
    else handled = false;
    if (handled) { e.preventDefault(); render(); }
  });

  window.CZ991 = { view: view, evaluate: evaluate, _state: st };
})();
