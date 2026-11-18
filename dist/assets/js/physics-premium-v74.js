/* ConceptLab v74 — Premium physics simulations:
   Road Banking, Cycle Banking, Motorcycle Banking and Newtonian Mechanics Lab.
   Every model lists its assumptions; all drawings are explanatory. */
(function () {
'use strict';
var S = window.CL_SIMS || (window.CL_SIMS = {});
var TAU = Math.PI * 2, D2R = Math.PI / 180, FONT = '"Hind Siliguri","Noto Sans Bengali",system-ui,-apple-system,"Segoe UI",sans-serif';
var PLANETS = [['9.81', 'পৃথিবী (9.81)'], ['1.62', 'চাঁদ (1.62)'], ['3.71', 'মঙ্গল (3.71)'], ['24.79', 'বৃহস্পতি (24.79)']];

function fmt(n, d) { if (!isFinite(n)) return '∞'; d = d == null ? 2 : d; var s = Number(n).toFixed(d); if (s.indexOf('.') > -1) s = s.replace(/0+$/, '').replace(/\.$/, ''); return s === '-0' ? '0' : s; }
function ne(s) { return String(s).replace(/^[^\u0980-\u09FFA-Za-z0-9(]+/, ''); }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function kmh(ms) { return ms * 3.6; }

/* ---------- DOM builders ---------- */
function shell(root, o) {
  root.innerHTML = '';
  var el = document.createElement('div');
  el.className = 'pl74' + (o.cls ? ' ' + o.cls : '');
  el.innerHTML =
    '<div class="pl74-main">' +
    '<div class="pl74-status" role="status"></div>' +
    '<div class="pl74-viz"></div>' +
    '<div class="pl74-side"><div class="pl74-presets" role="group" aria-label="দ্রুত পরিস্থিতি"></div><div class="pl74-form"></div></div>' +
    '<div class="pl74-res"><h4>লাইভ ফলাফল</h4><div class="pl74-stats"></div></div>' +
    '<div class="pl74-steps"></div>' +
    '</div>';
  root.appendChild(el);
  var q = function (s) { return el.querySelector(s); };
  return { el: el, viz: q('.pl74-viz'), side: q('.pl74-side'), presets: q('.pl74-presets'), form: q('.pl74-form'), status: q('.pl74-status'), stats: q('.pl74-stats'), steps: q('.pl74-steps') };
}

function canvas(parent, w, h, cls, title) {
  if (window.innerWidth <= 700 && w > 420) w = 420;
  var wrap = document.createElement('figure');
  wrap.className = 'pl74-fig ' + (cls || '');
  if (title) { var cap = document.createElement('figcaption'); cap.textContent = title; wrap.appendChild(cap); }
  var c = document.createElement('canvas'), d = Math.min(2, Math.max(1.5, window.devicePixelRatio || 1));
  c.width = Math.round(w * d); c.height = Math.round(h * d); c.className = 'pl74-cv'; c.style.aspectRatio = w + '/' + h;
  c.setAttribute('role', 'img'); c.setAttribute('aria-label', title || 'সিমুলেশনের চিত্র');
  var x = c.getContext('2d'); x.setTransform(d, 0, 0, d, 0, 0);
  wrap.appendChild(c); parent.appendChild(wrap);
  return { c: c, x: x, w: w, h: h, fig: wrap };
}

/* Grouped slider form. Each slider uses the label/range structure that the site's number-box enhancer expects. */
function Form(host, onChange) {
  var els = {}, nums = {}, defs = {}, self = {};
  self.group = function (title, list, open) {
    var sec = document.createElement('section'); sec.className = 'pl74-grp';
    sec.innerHTML = '<h5>' + ne(title) + '</h5><div class="pl74-fields">' + list.map(function (d) {
      defs[d.key] = d;
      return '<div class="pl74-field"><label><span>' + d.label + '</span><output></output></label><input type="range" min="' + d.min + '" max="' + d.max + '" step="' + (d.step || 1) + '" value="' + d.value + '" data-k="' + d.key + '" aria-label="' + d.label + '"><label class="sim-value-editor"><span>নিজে মান লিখুন</span><input type="number" class="sim-value-input" inputmode="decimal" min="' + d.min + '" max="' + d.max + '" step="' + (d.step || 'any') + '" value="' + d.value + '" data-n="' + d.key + '" aria-label="' + d.label + ' — নিজে মান লিখুন"></label></div>';
    }).join('') + '</div>';
    host.appendChild(sec);
    list.forEach(function (d) { els[d.key] = sec.querySelector('[data-k="' + d.key + '"]'); nums[d.key] = sec.querySelector('[data-n="' + d.key + '"]'); });
    return sec;
  };
  self.select = function (parentSec, label, opts, change, val) {
    var l = document.createElement('label'); l.className = 'pl74-select'; l.innerHTML = '<span>' + label + '</span><select></select>';
    var s = l.querySelector('select'); s.innerHTML = opts.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('');
    if (val != null) s.value = val;
    s.addEventListener('change', function () { change(s.value, s); });
    (parentSec.querySelector('.pl74-fields') || parentSec).insertBefore(l, (parentSec.querySelector('.pl74-fields') || parentSec).firstChild);
    return s;
  };
  function show(k) { var e = els[k], d = defs[k]; if (!e) return; var o = e.parentNode.querySelector('output'); var v = +e.value; if (nums[k] && document.activeElement !== nums[k]) nums[k].value = e.value; o.textContent = (d.fmt ? d.fmt(v) : fmt(v, d.dec != null ? d.dec : 2)) + (d.unit ? ' ' + d.unit : ''); }
  self.get = function () { var o = {}; Object.keys(els).forEach(function (k) { o[k] = +els[k].value; show(k); }); return o; };
  self.set = function (k, v) { var e = els[k]; if (!e) return; v = clamp(+v, +e.min, +e.max); e.value = v; if (nums[k]) nums[k].value = e.value; show(k); };
  host.addEventListener('input', function (ev) { var t = ev.target, k = t && t.getAttribute && t.getAttribute('data-k'); if (!k || t.type !== 'range') return; show(k); onChange && onChange(k); });
  host.addEventListener('change', function (ev) {
    var t = ev.target, k = t && t.getAttribute && t.getAttribute('data-n'); if (!k || !els[k]) return;
    if (t.value === '' || !isFinite(+t.value)) { t.value = els[k].value; return; }
    var v = clamp(+t.value, +els[k].min, +els[k].max); els[k].value = v; t.value = els[k].value; show(k); onChange && onChange(k);
  });
  host.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' && ev.target && ev.target.getAttribute && ev.target.getAttribute('data-n')) { ev.preventDefault(); ev.target.blur(); } });
  self.refresh = function () { Object.keys(els).forEach(show); };
  return self;
}

function presetButtons(host, list) {
  host.innerHTML = '<span class="pl74-presets-t">দ্রুত পরিস্থিতি</span>';
  list.forEach(function (p) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'pl74-chip'; b.textContent = ne(p[0]);
    b.addEventListener('click', function () { p[1](); }); host.appendChild(b);
  });
}

function setStatus(box, tone, title, text) { box.className = 'pl74-status ' + tone; box.innerHTML = '<b>' + ne(title) + '</b><span>' + text + '</span>'; }
function setStats(box, items) {
  box.innerHTML = items.map(function (i) { return '<div class="pl74-stat ' + (i[2] || '') + '"><span>' + i[0] + '</span><b>' + i[1] + '</b>' + (i[3] ? '<small>' + i[3] + '</small>' : '') + '</div>'; }).join('');
}
function setSteps(box, title, rows) {
  box.innerHTML = '<h4>' + ne(title) + '</h4><ol>' + rows.map(function (r) { return '<li>' + r + '</li>'; }).join('') + '</ol>';
}

/* animation loop that stops itself when the page leaves the screen */
function loop(root, fn) {
  var run = true, last = 0, stop = false;
  function tick(ts) {
    if (stop || !root.isConnected) return;
    var dt = Math.min(.05, (ts - last) / 1000 || 0); last = ts;
    if (run && !document.hidden) fn(dt);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return { toggle: function () { run = !run; return run; }, run: function (v) { run = v; }, isRun: function () { return run; }, stop: function () { stop = true; } };
}

/* ---------- canvas drawing helpers ---------- */
function bg(x, w, h, a, b) { var g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, a || '#06111c'); g.addColorStop(1, b || '#10304a'); x.fillStyle = g; x.fillRect(0, 0, w, h); }
function grid(x, w, h, step) { x.strokeStyle = 'rgba(125,170,205,.07)'; x.lineWidth = 1; x.beginPath(); for (var i = step; i < w; i += step) { x.moveTo(i, 0); x.lineTo(i, h); } for (var j = step; j < h; j += step) { x.moveTo(0, j); x.lineTo(w, j); } x.stroke(); }
function rr(x, a, b, w, h, r) { r = Math.min(r, w / 2, h / 2); x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
function txt(x, s, px, py, size, col, align, weight) { x.font = (weight || '600') + ' ' + size + 'px ' + FONT; x.fillStyle = col || '#dbeafe'; x.textAlign = align || 'left'; x.textBaseline = 'alphabetic'; x.fillText(s, px, py); }
function pill(x, s, px, py, col, size) {
  size = size || 12; x.font = '700 ' + size + 'px ' + FONT; var w = x.measureText(s).width + 14;
  x.fillStyle = 'rgba(4,12,22,.78)'; rr(x, px - w / 2, py - size - 2, w, size + 9, 8); x.fill();
  x.strokeStyle = col; x.lineWidth = 1; x.stroke(); x.fillStyle = col; x.textAlign = 'center'; x.fillText(s, px, py + 1);
}
function arrow(x, x1, y1, x2, y2, col, label, lw) {
  var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); if (L < 3) return;
  var ux = dx / L, uy = dy / L, hd = Math.min(11, L * .45);
  x.save(); x.strokeStyle = col; x.fillStyle = col; x.lineWidth = lw || 3; x.lineCap = 'round';
  x.beginPath(); x.moveTo(x1, y1); x.lineTo(x2 - ux * hd * .7, y2 - uy * hd * .7); x.stroke();
  x.beginPath(); x.moveTo(x2, y2); x.lineTo(x2 - ux * hd - uy * hd * .5, y2 - uy * hd + ux * hd * .5); x.lineTo(x2 - ux * hd + uy * hd * .5, y2 - uy * hd - ux * hd * .5); x.closePath(); x.fill();
  x.restore();
  if (label) pill(x, label, x2 + ux * 16, y2 + uy * 16 + 4, col, 11);
}
function spark(x, px, py, t) { x.save(); for (var i = 0; i < 9; i++) { var a = (i / 9) * TAU + t * 9, r = 5 + 9 * ((Math.sin(t * 20 + i * 2.1) + 1) / 2); x.strokeStyle = i % 2 ? '#fbbf24' : '#fb923c'; x.lineWidth = 2; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * r, py + Math.sin(a) * r); x.stroke(); } x.restore(); }
/* local→canvas transform used to draw tilted road and vehicles around a contact point */
function tf(px, py, ang, lx, ly) { var c = Math.cos(ang), s = Math.sin(ang); return [px + lx * c - ly * s, py + lx * s + ly * c]; }

/* ---------- shared physics ---------- */
/* per unit mass, steady circular motion on a plane inclined at bank angle φ (rad) toward the centre */
function bankPhys(v, r, phiDeg, mu, g) {
  var t = phiDeg * D2R, tn = Math.tan(t), a = v * v / r;
  var N = g * Math.cos(t) + a * Math.sin(t), fr = a * Math.cos(t) - g * Math.sin(t);
  var v0 = Math.sqrt(Math.max(0, r * g * tn));
  var vmax = (mu * tn < 1) ? Math.sqrt(r * g * (tn + mu) / (1 - mu * tn)) : Infinity;
  var vmin = Math.sqrt(Math.max(0, r * g * (tn - mu) / (1 + mu * tn)));
  var util = mu > 0 ? Math.abs(fr) / (mu * N + 1e-9) : (Math.abs(fr) < 1e-6 ? 0 : 9);
  return { a: a, N: N, f: fr, v0: v0, vmax: vmax, vmin: vmin, util: util, lean: Math.atan(a / g) / D2R, thetaReq: Math.atan(a / g) / D2R };
}

/* standard top-view of the circular path with a moving vehicle */
function drawTop(cv, ph, o) {
  var x = cv.x, w = cv.w, h = cv.h, cx = w / 2, cy = h / 2 + 4, R = Math.min(w, h) * .33;
  bg(x, w, h, '#071522', '#0c2234'); grid(x, w, h, 30);
  var wide = R * .36;
  x.lineWidth = wide * 2; x.strokeStyle = '#1d3347'; x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.stroke();
  x.lineWidth = 2; x.setLineDash([9, 9]); x.strokeStyle = 'rgba(250,204,21,.65)'; x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.stroke(); x.setLineDash([]);
  x.strokeStyle = 'rgba(148,184,214,.5)'; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, R - wide, 0, TAU); x.stroke(); x.beginPath(); x.arc(cx, cy, R + wide, 0, TAU); x.stroke();
  x.fillStyle = 'rgba(56,189,248,.9)'; x.beginPath(); x.arc(cx, cy, 4, 0, TAU); x.fill();
  txt(x, 'কেন্দ্র', cx, cy + 20, 11, '#93c5fd', 'center');
  x.strokeStyle = 'rgba(56,189,248,.5)'; x.setLineDash([4, 5]); x.lineWidth = 1.2; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(ph) * R, cy + Math.sin(ph) * R); x.stroke(); x.setLineDash([]);
  txt(x, 'r', cx + Math.cos(ph) * R * .5 - 9, cy + Math.sin(ph) * R * .5 - 5, 12, '#7dd3fc', 'center', '700');
  var drift = o.drift || 0, Rv = R + drift * wide * 1.7;
  /* trail */
  for (var i = 1; i <= 26; i++) { var pa = ph - i * .055 * (o.dir || 1), pr = R + drift * wide * 1.7 * Math.max(0, 1 - i / 18); x.fillStyle = 'rgba(' + o.rgb + ',' + (.38 * (1 - i / 26)) + ')'; x.beginPath(); x.arc(cx + Math.cos(pa) * pr, cy + Math.sin(pa) * pr, 3.2 * (1 - i / 40), 0, TAU); x.fill(); }
  var vx = cx + Math.cos(ph) * Rv, vy = cy + Math.sin(ph) * Rv;
  x.save(); x.translate(vx, vy); x.rotate(ph + Math.PI / 2);
  var col = o.color || '#38bdf8';
  if (o.kind === 'car') { x.fillStyle = col; rr(x, -9, -17, 18, 34, 6); x.fill(); x.fillStyle = 'rgba(8,20,34,.75)'; rr(x, -6, -9, 12, 8, 3); x.fill(); rr(x, -6, 4, 12, 6, 3); x.fill(); x.fillStyle = '#0b1623'; [[-11, -12], [9, -12], [-11, 8], [9, 8]].forEach(function (p) { x.fillRect(p[0], p[1], 3, 8); }); }
  else if (o.kind === 'bike') { x.fillStyle = '#0b1623'; rr(x, -3, -19, 6, 38, 3); x.fill(); x.fillStyle = col; rr(x, -6, -8, 12, 16, 5); x.fill(); x.fillStyle = '#fde68a'; x.beginPath(); x.arc(0, -2, 4, 0, TAU); x.fill(); }
  else { x.fillStyle = '#0b1623'; rr(x, -2.5, -16, 5, 32, 2.5); x.fill(); x.strokeStyle = col; x.lineWidth = 3; x.beginPath(); x.moveTo(-7, -9); x.lineTo(7, -9); x.stroke(); x.fillStyle = '#fde68a'; x.beginPath(); x.arc(0, -1, 4.5, 0, TAU); x.fill(); }
  x.restore();
  var dir = o.dir || 1, tx = -Math.sin(ph) * dir, ty = Math.cos(ph) * dir;
  var L = clamp((o.speedPx || 40), 18, 72);
  arrow(x, vx, vy, vx + tx * L, vy + ty * L, '#34d399', 'v', 2.6);
  var inx = -Math.cos(ph), iny = -Math.sin(ph), L2 = clamp(o.cpPx || 30, 14, 62);
  arrow(x, vx, vy, vx + inx * L2, vy + iny * L2, '#fb7185', o.cpLabel || 'Fc', 2.6);
  if (o.badge) pill(x, o.badge, cx, 20, o.badgeCol || '#34d399', 12);
}

/* ---------- rear-view lean drawing shared by cycle & motorcycle ---------- */
function leanView(cv, o) {
  var x = cv.x, w = cv.w, h = cv.h, px = w * .58, py = h - 56, bank = o.bank * D2R, lean = o.lean * D2R, sc = 100, Z = 1.3;
  bg(x, w, h, '#06121e', '#123550'); grid(x, w, h, 32);
  /* ground */
  x.save(); x.translate(px, py); x.rotate(-bank);
  x.fillStyle = '#20374b'; x.fillRect(-900, 0, 1800, 90);
  x.strokeStyle = '#6b8dab'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(-900, 0); x.lineTo(900, 0); x.stroke();
  x.setLineDash([18, 16]); x.strokeStyle = 'rgba(250,204,21,.45)'; x.lineWidth = 2; x.beginPath(); x.moveTo(-900, 18); x.lineTo(900, 18); x.stroke(); x.setLineDash([]);
  x.restore();
  /* vertical reference + centre hint */
  x.setLineDash([5, 6]); x.strokeStyle = 'rgba(148,184,214,.55)'; x.lineWidth = 1.3; x.beginPath(); x.moveTo(px, py); x.lineTo(px, py - 250); x.stroke(); x.setLineDash([]);
  txt(x, '← বাঁকের কেন্দ্র', 14, 26, 12, '#7dd3fc', 'left', '700');
  txt(x, 'বাইরের দিক →', w - 14, 26, 12, '#94a3b8', 'right', '700');
  /* vehicle */
  var hang = (o.hangPx || 0);
  x.save(); x.translate(px, py); x.rotate(-lean); x.scale(Z, Z);
  if (o.kind === 'cycle') {
    x.lineCap = 'round'; x.lineJoin = 'round';
    x.strokeStyle = '#0b1623'; x.lineWidth = 8; x.beginPath(); x.ellipse(0, -34, 5, 34, 0, 0, TAU); x.stroke();
    x.strokeStyle = '#94a3b8'; x.lineWidth = 2; x.beginPath(); x.ellipse(0, -34, 3, 28, 0, 0, TAU); x.stroke();
    x.strokeStyle = '#38bdf8'; x.lineWidth = 5; x.beginPath(); x.moveTo(0, -34); x.lineTo(0, -98); x.stroke();
    x.strokeStyle = '#e2e8f0'; x.lineWidth = 4; x.beginPath(); x.moveTo(-11, -100); x.lineTo(11, -100); x.stroke();
    x.lineWidth = 3; x.strokeStyle = '#475569'; x.beginPath(); x.moveTo(-18, -104); x.lineTo(18, -104); x.stroke();
    x.strokeStyle = '#1e293b'; x.lineWidth = 8; x.beginPath(); x.moveTo(-3, -100); x.lineTo(-9, -58); x.moveTo(3, -100); x.lineTo(9, -50); x.stroke();
    x.strokeStyle = '#f59e0b'; x.lineWidth = 11; x.beginPath(); x.moveTo(0, -104); x.lineTo(-6, -150); x.stroke();
    x.strokeStyle = '#f59e0b'; x.lineWidth = 5; x.beginPath(); x.moveTo(-6, -145); x.lineTo(-17, -106); x.moveTo(-6, -145); x.lineTo(15, -106); x.stroke();
    x.fillStyle = '#fde68a'; x.beginPath(); x.arc(-7, -164, 11, 0, TAU); x.fill();
    x.fillStyle = '#ef4444'; x.beginPath(); x.arc(-7, -167, 11, Math.PI, TAU); x.fill();
  } else {
    x.lineCap = 'round'; x.lineJoin = 'round';
    x.strokeStyle = '#05090f'; x.lineWidth = 16; x.beginPath(); x.ellipse(0, -31, 7, 31, 0, 0, TAU); x.stroke();
    x.strokeStyle = '#64748b'; x.lineWidth = 3; x.beginPath(); x.ellipse(0, -31, 3.5, 21, 0, 0, TAU); x.stroke();
    x.strokeStyle = '#94a3b8'; x.lineWidth = 6; x.beginPath(); x.moveTo(-9, -40); x.lineTo(-9, -86); x.moveTo(9, -40); x.lineTo(9, -86); x.stroke();
    x.fillStyle = '#ef4444'; rr(x, -19, -102, 38, 40, 12); x.fill();
    x.fillStyle = '#111827'; rr(x, -14, -112, 28, 14, 6); x.fill();
    x.fillStyle = 'rgba(255,255,255,.3)'; rr(x, -11, -98, 12, 8, 4); x.fill();
    x.strokeStyle = '#cbd5e1'; x.lineWidth = 4; x.beginPath(); x.moveTo(-30, -108); x.lineTo(30, -108); x.stroke();
    x.fillStyle = '#334155'; rr(x, -26, -58, 10, 24, 4); x.fill(); rr(x, 16, -58, 10, 24, 4); x.fill();
    var hg = hang;
    x.strokeStyle = '#1d4ed8'; x.lineWidth = 12; x.beginPath(); x.moveTo(-hg, -112); x.lineTo(-hg - 8, -152); x.stroke();
    x.lineWidth = 6; x.beginPath(); x.moveTo(-hg - 7, -146); x.lineTo(-22, -110); x.moveTo(-hg - 7, -146); x.lineTo(22, -110); x.stroke();
    x.strokeStyle = '#1e3a8a'; x.lineWidth = 9; x.beginPath(); x.moveTo(-hg, -112); x.lineTo(-hg - 30, -74); x.moveTo(-hg + 6, -112); x.lineTo(14, -70); x.stroke();
    x.fillStyle = '#facc15'; x.beginPath(); x.arc(-hg - 11, -166, 13, 0, TAU); x.fill();
    x.fillStyle = '#111827'; x.beginPath(); x.arc(-hg - 9, -164, 6.5, -.4, 2.2); x.fill();
    if (o.knee) { var kp = tf(0, 0, 0, -hg - 31, -74); x.fillStyle = '#fbbf24'; x.beginPath(); x.arc(kp[0], kp[1], 5, 0, TAU); x.fill(); }
  }
  x.restore();
  /* knee/pedal/peg sparks at the ground */
  if (o.spark) { var sp = tf(px, py, -lean, -(o.sparkX || 36) * Z, -4 * Z); spark(x, sp[0], sp[1], o.t || 0); }
  /* contact patch glow */
  var g = x.createRadialGradient(px, py, 1, px, py, 22); g.addColorStop(0, 'rgba(52,211,153,.9)'); g.addColorStop(1, 'rgba(52,211,153,0)');
  x.fillStyle = g; x.beginPath(); x.ellipse(px, py, 24, 7, -bank, 0, TAU); x.fill();
  /* lean angle arc */
  x.strokeStyle = '#fbbf24'; x.lineWidth = 2; x.beginPath(); x.arc(px, py, 76, -Math.PI / 2 - lean, -Math.PI / 2, false); x.stroke();
  pill(x, 'ঝোঁক θ = ' + fmt(o.lean, 1) + '°', px + 70, py - 150, '#fbbf24', 12);
  /* force arrows */
  var com = tf(px, py, -lean, -(o.comOff || 0) * Z, -o.hCoM * sc * Z), k = 64 / o.G;
  x.fillStyle = '#f97316'; x.beginPath(); x.arc(com[0], com[1], 5.5, 0, TAU); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 1.5; x.stroke();
  arrow(x, com[0], com[1], com[0], com[1] + 64, '#fbbf24', 'mg', 3);
  var cpLen = clamp(k * o.a, 6, 150); arrow(x, com[0], com[1], com[0] - cpLen, com[1], '#fb7185', 'Fc', 3);
  var ux = com[0] - px, uy = com[1] - py, ul = Math.hypot(ux, uy) || 1, rl = clamp(k * Math.hypot(o.G, o.a), 20, 190);
  arrow(x, px, py, px + ux / ul * rl, py + uy / ul * rl, '#34d399', 'R', 3.4);
  var nx = -Math.sin(bank), ny = -Math.cos(bank), Nl = clamp(k * o.N, 8, 190);
  arrow(x, px, py, px + nx * Nl, py + ny * Nl, '#38bdf8', 'N', 2.4);
  var dx = -Math.cos(bank) * Math.sign(o.f || 1), dy = Math.sin(bank) * Math.sign(o.f || 1), fl = clamp(k * Math.abs(o.f), 0, 160);
  if (fl > 4) arrow(x, px, py, px + dx * fl, py + dy * fl, '#a78bfa', 'f', 2.4);
  if (o.bank > 0.4) txt(x, 'ঢাল φ = ' + fmt(o.bank, 1) + '°', px + 120, py + 36, 12, '#cbd5e1', 'left', '700');
  txt(x, 'R-রেখা CoM-এর ভেতর দিয়ে যায়: tanθ = v²/(rg)', 14, h - 12, 11, '#93c5fd', 'left', '600');
  return com;
}

/* lean angle vs speed with limit zones */
function leanPlot(cv, o) {
  var x = cv.x, w = cv.w, h = cv.h, L = 50, R = w - 16, T = 30, B = h - 34;
  bg(x, w, h, '#071522', '#0d2335');
  var lim = Math.min.apply(null, o.limits.map(function (l) { return l.deg; })), yMax = Math.max(60, Math.ceil((Math.max(lim, o.cur.deg) + 8) / 10) * 10);
  var X = function (v) { return L + (v / o.xMax) * (R - L); }, Y = function (d) { return B - (clamp(d, 0, yMax) / yMax) * (B - T); };
  x.strokeStyle = 'rgba(125,170,205,.14)'; x.lineWidth = 1; x.beginPath(); for (var i = 0; i <= 5; i++) { var yy = T + i * (B - T) / 5; x.moveTo(L, yy); x.lineTo(R, yy); } x.stroke();
  for (var j = 0; j <= 5; j++) { var vv = o.xMax * j / 5; txt(x, fmt(vv, 0), X(vv), B + 16, 11, '#94a3b8', 'center'); }
  for (var k = 0; k <= 5; k++) { var dd = yMax * k / 5; txt(x, fmt(dd, 0) + '°', L - 6, Y(dd) + 4, 11, '#94a3b8', 'right'); }
  txt(x, 'গতি (km/h) →', R, h - 8, 11, '#7dd3fc', 'right', '700'); txt(x, 'ঝোঁক কোণ θ', L, 18, 12, '#7dd3fc', 'left', '700');
  var N = 120, pts = [];
  for (var n = 0; n <= N; n++) { var v = o.xMax * n / N, d = o.curve(v / 3.6); pts.push([X(v), Y(d), d]); }
  /* safe region */
  x.fillStyle = 'rgba(52,211,153,.10)'; x.fillRect(L, Y(lim), R - L, B - Y(lim));
  x.fillStyle = 'rgba(244,63,94,.08)'; x.fillRect(L, T, R - L, Y(lim) - T);
  o.limits.forEach(function (l, idx) { var yv = Y(l.deg); x.strokeStyle = l.col; x.lineWidth = 1.8; x.setLineDash([8, 6]); x.beginPath(); x.moveTo(L, yv); x.lineTo(R, yv); x.stroke(); x.setLineDash([]); txt(x, l.label + ' ' + fmt(l.deg, 0) + '°', R - 4, yv - 5 - (idx % 2) * 13, 11, l.col, 'right', '700'); });
  x.strokeStyle = '#38bdf8'; x.lineWidth = 3; x.beginPath(); pts.forEach(function (p, i) { if (i) x.lineTo(p[0], p[1]); else x.moveTo(p[0], p[1]); }); x.stroke();
  var cx = X(Math.min(o.cur.v, o.xMax)), cy = Y(o.cur.deg), bad = o.cur.deg > lim;
  x.setLineDash([3, 4]); x.strokeStyle = 'rgba(251,191,36,.7)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(cx, B); x.lineTo(cx, cy); x.lineTo(L, cy); x.stroke(); x.setLineDash([]);
  x.fillStyle = bad ? '#f43f5e' : '#fbbf24'; x.beginPath(); x.arc(cx, cy, 7, 0, TAU); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 2; x.stroke();
}

/* ================= ROAD BANKING ================= */
S.roadBanking = function (root, done) {
  var ui = shell(root, {
    title: 'রোড ব্যাঙ্কিং — ঢালু বাঁকে গাড়ির নিরাপদ গতি',
    intro: 'রাস্তার ঢাল, বাঁকের ব্যাসার্ধ, ঘর্ষণ, গাড়ির ধরন ও গ্রহ বদলে দেখুন কখন গাড়ি নিরাপদ, কখন বাইরের দিকে স্কিড করে বা ভেতরে পিছলে যায় এবং কখন উল্টে যাওয়ার ঝুঁকি তৈরি হয়।'
  });
  var G = 9.81, ph = 0, drift = 0, last = null;
  var cs = canvas(ui.viz, 680, 330, 'c4', 'বাঁকের প্রস্থচ্ছেদ ও বলসমূহ');
  var top = canvas(ui.viz, 330, 330, 'c2', 'উপর থেকে দেখা (লাইভ)');
  var gauge = canvas(ui.viz, 680, 104, 'c6', 'গতির নিরাপদ সীমা (km/h)');
  var form = Form(ui.form, function () { update(); done && done(); });
  var gv = form.group('🚗 যানবাহন', [
    { key: 'm', label: 'ভর m', min: 500, max: 30000, step: 50, value: 1400, unit: 'kg', dec: 0 },
    { key: 'h', label: 'ভরকেন্দ্রের উচ্চতা h', min: .3, max: 2.5, step: .05, value: .55, unit: 'm' },
    { key: 'w', label: 'চাকার মধ্যবর্তী দূরত্ব w', min: 1, max: 2.6, step: .05, value: 1.5, unit: 'm' }]);
  form.select(gv, 'যানবাহনের ধরন', [['car', 'ছোট গাড়ি'], ['sport', 'স্পোর্টস কার'], ['suv', 'SUV / মাইক্রোবাস'], ['bus', 'বাস'], ['truck', 'ট্রাক']], function (v) {
    var T = { car: [1400, .55, 1.5], sport: [1300, .45, 1.65], suv: [2100, .75, 1.6], bus: [12000, 1.4, 2.1], truck: [18000, 1.8, 2.1] }[v];
    form.set('m', T[0]); form.set('h', T[1]); form.set('w', T[2]); update();
  }, 'car');
  var gr = form.group('🛣️ রাস্তা ও বাঁক', [
    { key: 'r', label: 'বাঁকের ব্যাসার্ধ r', min: 10, max: 500, step: 1, value: 80, unit: 'm', dec: 0 },
    { key: 'th', label: 'ব্যাঙ্কিং কোণ θ', min: 0, max: 45, step: .5, value: 15, unit: '°', dec: 1 },
    { key: 'mu', label: 'ঘর্ষণ সহগ μ', min: 0, max: 1.2, step: .01, value: .6, unit: '' }]);
  form.select(gr, 'রাস্তার অবস্থা', [['.8', 'শুকনো পিচ (0.8)'], ['.6', 'সাধারণ পিচ (0.6)'], ['.4', 'ভেজা রাস্তা (0.4)'], ['.25', 'কাদা / বালি (0.25)'], ['.1', 'বরফ (0.1)'], ['0', 'ঘর্ষণহীন (0)']], function (v) { form.set('mu', v); update(); }, '.6');
  var gs = form.group('⚡ গতি ও পরিবেশ', [
    { key: 'v', label: 'গাড়ির বেগ v', min: 0, max: 220, step: 1, value: 70, unit: 'km/h', dec: 0 }]);
  form.select(gs, 'গ্রহ / অভিকর্ষ g', PLANETS, function (v) { G = +v; update(); }, '9.81');
  function calc() {
    var p = form.get(), vms = p.v / 3.6, b = bankPhys(vms, p.r, p.th, p.mu, G), tn = Math.tan(p.th * D2R), s = p.w / (2 * p.h);
    var vroll = (tn * s < 1) ? Math.sqrt(p.r * G * (tn + s) / (1 - tn * s)) : Infinity, st = 'ok';
    if (b.util > 1 && b.f > 0) st = 'out'; else if (b.util > 1) st = 'in';
    if (vms > vroll && vroll < b.vmax) st = 'roll';
    return { p: p, vms: vms, b: b, vroll: vroll, st: st };
  }
  var C = calc();
  function statusInfo(c) {
    var b = c.b, p = c.p;
    if (c.st === 'roll') return ['bad', '🚨 উল্টে যাওয়ার ঝুঁকি', 'বেগ ' + fmt(p.v, 0) + ' km/h উল্টে যাওয়ার সীমা ' + fmt(kmh(c.vroll), 0) + ' km/h-এর বেশি। ভরকেন্দ্র নিচু বা চাকার দূরত্ব বেশি করলে সীমা বাড়ে।'];
    if (c.st === 'out') return ['bad', '⚠️ বাইরের দিকে স্কিড', 'প্রয়োজনীয় ঘর্ষণ μN-এর চেয়ে বেশি। বেগ ' + fmt(kmh(b.vmax), 0) + ' km/h-এর নিচে আনুন বা ঘর্ষণ/ঢাল বাড়ান।'];
    if (c.st === 'in') return ['warn', '⚠️ ভেতরের দিকে পিছলে নামছে', 'বেগ খুব কম, ঢাল বেশি: গাড়ি ঢাল বেয়ে নিচে নামতে চায়। ন্যূনতম নিরাপদ বেগ ' + fmt(kmh(b.vmin), 0) + ' km/h।'];
    if (b.util < .06 && b.f !== undefined && Math.abs(c.p.v - kmh(b.v0)) < 2) return ['ok', '✅ আদর্শ বেগ', 'ঘর্ষণ ছাড়াই শুধু ঢালের লম্ব প্রতিক্রিয়া কেন্দ্রমুখী বল জোগাচ্ছে।'];
    return ['ok', '✅ নিরাপদ', 'ঘর্ষণের ' + fmt(b.util * 100, 0) + '% ব্যবহার হচ্ছে; নিরাপদ সীমা ' + fmt(kmh(b.vmin), 0) + ' – ' + (isFinite(b.vmax) ? fmt(kmh(b.vmax), 0) : '∞') + ' km/h।'];
  }
  function drawSection(c) {
    var x = cs.x, w = cs.w, h = cs.h, th = c.p.th * D2R, px = Math.round(w * .56), py = h - 80, k = 56;
    bg(x, w, h, '#071522', '#11324b'); grid(x, w, h, 34);
    x.save(); x.translate(px, py); x.rotate(-th);
    x.fillStyle = '#243b50'; x.fillRect(-760, 0, 1500, 80); x.strokeStyle = '#6b8dab'; x.lineWidth = 3; x.beginPath(); x.moveTo(-760, 0); x.lineTo(740, 0); x.stroke();
    x.setLineDash([22, 18]); x.strokeStyle = 'rgba(250,204,21,.5)'; x.lineWidth = 2; x.beginPath(); x.moveTo(-760, 18); x.lineTo(740, 18); x.stroke(); x.setLineDash([]);
    var W = c.p.w * k, H = Math.min(c.p.h * k, 118);
    x.fillStyle = '#0b1623'; [-W / 2, W / 2].forEach(function (wx) { x.beginPath(); x.arc(wx, -12, 12, 0, TAU); x.fill(); x.strokeStyle = '#64748b'; x.lineWidth = 2; x.stroke(); });
    x.fillStyle = c.st === 'ok' ? '#38bdf8' : (c.st === 'in' ? '#f59e0b' : '#f43f5e'); rr(x, -W / 2 - 8, -50, W + 16, 34, 9); x.fill();
    x.fillStyle = c.st === 'ok' ? '#0ea5e9' : '#be123c'; rr(x, -W / 2 + 6, -78, W - 12, 32, 9); x.fill();
    x.fillStyle = 'rgba(8,20,34,.7)'; rr(x, -W / 2 + 12, -72, W - 24, 20, 5); x.fill();
    x.restore();
    var com = tf(px, py, -th, 0, -H), s = 64 / G, b = c.b;
    x.setLineDash([4, 5]); x.strokeStyle = 'rgba(148,184,214,.5)'; x.lineWidth = 1; x.beginPath(); x.moveTo(30, com[1]); x.lineTo(com[0], com[1]); x.stroke(); x.setLineDash([]);
    txt(x, '← কেন্দ্র', 34, com[1] - 8, 12, '#7dd3fc', 'left', '700');
    x.fillStyle = '#f97316'; x.beginPath(); x.arc(com[0], com[1], 5.5, 0, TAU); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 1.5; x.stroke();
    arrow(x, com[0], com[1], com[0], com[1] + 64, '#fbbf24', 'mg', 3);
    var nx = -Math.sin(th), ny = -Math.cos(th), Nl = clamp(s * b.N, 8, 170);
    arrow(x, com[0], com[1], com[0] + nx * Nl, com[1] + ny * Nl, '#38bdf8', 'N', 3);
    var sg = b.f >= 0 ? 1 : -1, fl = clamp(s * Math.abs(b.f), 0, 160);
    if (fl > 4) arrow(x, com[0], com[1], com[0] - Math.cos(th) * fl * sg, com[1] + Math.sin(th) * fl * sg, '#a78bfa', 'f', 3);
    var cp = clamp(s * b.a, 4, 160); arrow(x, com[0] - 3, com[1] - 22, com[0] - 3 - cp, com[1] - 22, '#fb7185', 'mv²/r', 3);
    x.strokeStyle = '#fbbf24'; x.lineWidth = 2; x.beginPath(); x.arc(px, py, 70, -th, 0, false); x.stroke();
    txt(x, 'θ = ' + fmt(c.p.th, 1) + '°', px + 78, py - 8, 13, '#fbbf24', 'left', '800');
    txt(x, 'g = ' + fmt(G, 2) + ' m/s²', w - 12, 22, 12, '#94a3b8', 'right', '700');
  }
  function drawGauge(c) {
    var x = gauge.x, w = gauge.w, h = gauge.h, b = c.b, vm = kmh(b.vmax), v0 = kmh(b.v0), vn = kmh(b.vmin), cur = c.p.v;
    var top = Math.max(60, Math.min(320, Math.max(cur * 1.15, isFinite(vm) ? vm * 1.3 : cur * 1.8, c.p.v + 20)));
    var L = 20, R = w - 20, X = function (v) { return L + clamp(v, 0, top) / top * (R - L); };
    bg(x, w, h, '#071522', '#0c2234');
    x.fillStyle = 'rgba(245,158,11,.55)'; x.fillRect(X(0), 40, X(vn) - X(0), 22);
    x.fillStyle = 'rgba(52,211,153,.7)'; x.fillRect(X(vn), 40, X(Math.min(vm, top)) - X(vn), 22);
    if (isFinite(vm) && vm < top) { x.fillStyle = 'rgba(244,63,94,.65)'; x.fillRect(X(vm), 40, X(top) - X(vm), 22); }
    if (isFinite(c.vroll) && kmh(c.vroll) < top) { x.fillStyle = '#fff'; x.fillRect(X(kmh(c.vroll)) - 1, 36, 3, 30); txt(x, 'উল্টানো', X(kmh(c.vroll)), 80, 10, '#fecdd3', 'center', '700'); }
    var step = top > 200 ? 40 : (top > 100 ? 20 : 10); for (var t = 0; t <= top; t += step) { x.fillStyle = '#64748b'; x.fillRect(X(t), 62, 1, 5); txt(x, String(t), X(t), 78, 10, '#94a3b8', 'center'); }
    if (v0 > 0 && v0 < top) { x.fillStyle = '#fde047'; x.beginPath(); x.moveTo(X(v0), 38); x.lineTo(X(v0) - 5, 28); x.lineTo(X(v0) + 5, 28); x.fill(); txt(x, 'v₀', X(v0), 22, 11, '#fde047', 'center', '800'); }
    var cx = X(cur); x.fillStyle = '#fff'; x.beginPath(); x.moveTo(cx, 64); x.lineTo(cx - 7, 76); x.lineTo(cx + 7, 76); x.fill(); x.fillStyle = '#fff'; x.fillRect(cx - 1.5, 34, 3, 30);
    pill(x, fmt(cur, 0) + ' km/h', Math.min(Math.max(cx, 44), w - 44), 16, c.st === 'ok' ? '#34d399' : '#fb7185', 12);
    txt(x, 'নিচে পিছলায়', L + 2, 98, 10, '#fbbf24', 'left', '700'); txt(x, 'নিরাপদ অঞ্চল', (X(vn) + X(Math.min(vm, top))) / 2, 98, 10, '#6ee7b7', 'center', '700'); if (isFinite(vm) && vm < top) txt(x, 'স্কিড অঞ্চল', (X(vm) + R) / 2, 98, 10, '#fda4af', 'center', '700');
  }
  function update() {
    C = calc(); var c = C, p = c.p, b = c.b, m = p.m, si = statusInfo(c);
    setStatus(ui.status, si[0], si[1], si[2]);
    drawSection(c); drawGauge(c);
    var Fc = m * b.a, Nn = m * b.N, fr = m * b.f, fmx = p.mu * Nn;
    setStats(ui.stats, [
      ['বেগ v', fmt(c.vms, 2) + ' m/s', '', fmt(p.v, 0) + ' km/h'],
      ['কেন্দ্রমুখী ত্বরণ', fmt(b.a, 2) + ' m/s²', '', fmt(b.a / G, 2) + ' g'],
      ['কেন্দ্রমুখী বল mv²/r', fmt(Fc, 0) + ' N', ''],
      ['আদর্শ বেগ v₀ (ঘর্ষণ ছাড়া)', fmt(kmh(b.v0), 1) + ' km/h', 'gold', 'v₀ = √(rg tanθ)'],
      ['সর্বোচ্চ নিরাপদ বেগ', isFinite(b.vmax) ? fmt(kmh(b.vmax), 1) + ' km/h' : '∞', 'ok'],
      ['সর্বনিম্ন নিরাপদ বেগ', fmt(kmh(b.vmin), 1) + ' km/h', 'warn'],
      ['লম্ব প্রতিক্রিয়া N', fmt(Nn, 0) + ' N', '', fmt(Nn / (m * G), 2) + ' × ওজন'],
      ['প্রয়োজনীয় ঘর্ষণ বল f', fmt(Math.abs(fr), 0) + ' N', b.util > 1 ? 'bad' : '', fr >= 0 ? 'ঢাল বেয়ে ভেতরে' : 'ঢাল বেয়ে বাইরে'],
      ['সর্বোচ্চ ঘর্ষণ μN', fmt(fmx, 0) + ' N', ''],
      ['ঘর্ষণ ব্যবহার', fmt(Math.min(b.util, 9) * 100, 0) + '%', b.util > 1 ? 'bad' : (b.util > .8 ? 'warn' : 'ok')],
      ['ঘর্ষণহীন বাঁকের জন্য প্রয়োজনীয় কোণ', fmt(b.thetaReq, 1) + '°', ''],
      ['উল্টে যাওয়ার সীমা', isFinite(c.vroll) ? fmt(kmh(c.vroll), 0) + ' km/h' : '∞', c.st === 'roll' ? 'bad' : ''],
      ['একবার ঘুরতে সময় T', c.vms > 0 ? fmt(TAU * p.r / c.vms, 1) + ' s' : '—', ''],
      ['কৌণিক বেগ ω', fmt(c.vms / p.r, 3) + ' rad/s', '']
    ]);
    setSteps(ui.steps, '🧠 ধাপে ধাপে হিসাব', [
      'কেন্দ্রমুখী ত্বরণ: a = v²/r = ' + fmt(c.vms, 2) + '² / ' + fmt(p.r, 0) + ' = <b>' + fmt(b.a, 2) + ' m/s²</b>',
      'ঢালু তলের লম্ব বরাবর: N = m(g cosθ + a sinθ) = <b>' + fmt(Nn, 0) + ' N</b>',
      'ঢাল বরাবর ঘর্ষণ (ভেতরের দিকে ধনাত্মক): f = m(a cosθ − g sinθ) = <b>' + fmt(fr, 0) + ' N</b>',
      'শর্ত: |f| ≤ μN → ' + fmt(Math.abs(fr), 0) + ' ≤ ' + fmt(fmx, 0) + ' → <b>' + (b.util <= 1 ? 'সত্য, গাড়ি নিরাপদ' : 'মিথ্যা, গাড়ি পিছলাবে') + '</b>',
      'সীমা বেগ: v = √[ rg (tanθ ± μ) / (1 ∓ μ tanθ) ]। ঘর্ষণ না থাকলে v₀ = √(rg tanθ) = <b>' + fmt(kmh(b.v0), 1) + ' km/h</b>',
      'উল্টে যাওয়ার শর্তে s = w/2h = ' + fmt(p.w / (2 * p.h), 2) + '; বেশি s মানে বেশি স্থিতিশীল।'
    ]);
  }
  presetButtons(ui.presets, [
    ['🎯 আদর্শ বেগ', function () { var b = C.b; form.set('v', Math.round(kmh(b.v0))); update(); }],
    ['🛡️ সর্বোচ্চ নিরাপদ', function () { var b = C.b; if (isFinite(b.vmax)) form.set('v', Math.floor(kmh(b.vmax) * .98)); update(); }],
    ['🌧️ বৃষ্টির দিন', function () { form.set('mu', .4); update(); }],
    ['🧊 বরফে পিছল', function () { form.set('mu', .1); update(); }],
    ['🐢 খুব ধীরে', function () { form.set('v', 12); update(); }],
    ['🏁 রেসট্র্যাক', function () { form.set('r', 250); form.set('th', 30); form.set('mu', 1.1); form.set('v', 160); update(); }]
  ]);
  var ctl = document.createElement('div'); ctl.className = 'pl74-anim'; ui.viz.appendChild(ctl);
  var lp = loop(root, function (dt) {
    var c = C; ph += clamp(c.vms / c.p.r * 1.3, .12, 2.6) * dt; var tgt = c.st === 'out' || c.st === 'roll' ? 1 : (c.st === 'in' ? -.5 : 0);
    drift += (tgt - drift) * Math.min(1, dt * 1.6);
    drawTop(top, ph, { kind: 'car', color: c.st === 'ok' ? '#38bdf8' : '#f43f5e', rgb: c.st === 'ok' ? '56,189,248' : '244,63,94', speedPx: c.vms * 1.6, cpPx: c.b.a * 2.2, drift: drift, badge: statusInfo(c)[1].replace(/^[^ ]+ /, ''), badgeCol: c.st === 'ok' ? '#34d399' : '#fb7185' });
  });
  var pb = document.createElement('button'); pb.type = 'button'; pb.className = 'pl74-chip'; pb.textContent = 'অ্যানিমেশন থামান';
  pb.addEventListener('click', function () { var r = lp.toggle(); pb.textContent = r ? 'অ্যানিমেশন থামান' : 'অ্যানিমেশন চালু করুন'; }); ctl.appendChild(pb);
  update();
};

/* ================= CYCLE BANKING ================= */
S.cycleBanking = function (root, done) {
  var ui = shell(root, {
    title: 'সাইকেল ব্যাঙ্কিং — বাঁকে সাইকেল কতটা কাত হবে?',
    intro: 'সাইকেল বাঁক নেওয়ার সময় ভেতরের দিকে কাত হয় কারণ ভূমির প্রতিক্রিয়া বল R ভরকেন্দ্রের ভেতর দিয়ে যেতে হয়। গতি, ব্যাসার্ধ, ঘর্ষণ, ট্র্যাকের ঢাল ও আরোহীর ভর বদলে ঝোঁক কোণ, ঘর্ষণ ও প্যাডাল ঘষার ঝুঁকি দেখুন।'
  });
  var G = 9.81, ph = 0;
  var lv = canvas(ui.viz, 680, 330, 'c4', 'পেছন থেকে দেখা: ঝোঁক ও বলসমূহ');
  var top = canvas(ui.viz, 330, 330, 'c2', 'উপর থেকে দেখা (লাইভ)');
  var plot = canvas(ui.viz, 680, 230, 'c6', 'গতি বনাম ঝোঁক কোণ');
  var form = Form(ui.form, function () { update(); done && done(); });
  var g1 = form.group('🚴 সাইকেল ও আরোহী', [
    { key: 'm', label: 'আরোহী + সাইকেলের ভর', min: 30, max: 150, step: 1, value: 75, unit: 'kg', dec: 0 },
    { key: 'h', label: 'ভরকেন্দ্রের উচ্চতা', min: .6, max: 1.4, step: .01, value: 1.0, unit: 'm' },
    { key: 'pl', label: 'প্যাডাল ঘষার ঝোঁক সীমা', min: 25, max: 55, step: 1, value: 35, unit: '°', dec: 0 }]);
  var g2 = form.group('🛣️ বাঁক ও রাস্তা', [
    { key: 'r', label: 'বাঁকের ব্যাসার্ধ r', min: 3, max: 100, step: .5, value: 20, unit: 'm', dec: 1 },
    { key: 'phi', label: 'ট্র্যাকের ঢাল φ (ভেলোড্রোম)', min: 0, max: 45, step: .5, value: 0, unit: '°', dec: 1 },
    { key: 'mu', label: 'টায়ার–রাস্তার ঘর্ষণ μ', min: .05, max: 1.1, step: .01, value: .7, unit: '' }]);
  form.select(g2, 'রাস্তার ধরন', [['.7', 'শুকনো পিচ (0.7)'], ['.9', 'কাঠের ভেলোড্রোম (0.9)'], ['.45', 'ভেজা পিচ (0.45)'], ['.35', 'কাঁচা / নুড়ি (0.35)'], ['.2', 'শ্যাওলা / কাদা (0.2)'], ['.1', 'বরফ (0.1)']], function (v) { form.set('mu', v); update(); }, '.7');
  var g3 = form.group('⚡ গতি ও পরিবেশ', [{ key: 'v', label: 'সাইকেলের বেগ v', min: 3, max: 70, step: .5, value: 20, unit: 'km/h', dec: 1 }]);
  form.select(g3, 'গ্রহ / অভিকর্ষ g', PLANETS, function (v) { G = +v; update(); }, '9.81');
  function calc() {
    var p = form.get(), vms = p.v / 3.6, b = bankPhys(vms, p.r, p.phi, p.mu, G), lean = b.lean, st = 'ok';
    var skid = p.phi + Math.atan(p.mu) / D2R, pedal = p.pl + p.phi;
    var vSkid = Math.sqrt(p.r * G * Math.tan(skid * D2R)), vPedal = Math.sqrt(p.r * G * Math.tan(Math.min(89, pedal) * D2R));
    if (b.util > 1) st = b.f >= 0 ? 'skid' : 'slide'; else if (lean > pedal) st = 'pedal'; else if (lean > pedal - 5 || b.util > .85) st = 'near';
    return { p: p, vms: vms, b: b, lean: lean, skid: skid, pedal: pedal, vSkid: vSkid, vPedal: vPedal, st: st };
  }
  var C = calc();
  function info(c) {
    return { ok: ['ok', '✅ নিরাপদ বাঁক', 'ঝোঁক ' + fmt(c.lean, 1) + '°। টায়ারের ঘর্ষণ ও প্যাডালের ক্লিয়ারেন্স দুটোই সীমার মধ্যে।'],
      near: ['warn', '🟡 সীমার কাছাকাছি', 'গ্রিপ বা প্যাডাল ক্লিয়ারেন্স শেষ হওয়ার কাছে। বেগ সামান্য কমালে ঝুঁকি কমবে।'],
      pedal: ['bad', '⚠️ প্যাডাল মাটিতে ঘষা খাবে', 'ঝোঁক ' + fmt(c.lean, 1) + '° > সীমা ' + fmt(c.pedal, 0) + '°। বেগ কমান বা ব্যাসার্ধ বাড়ান।'],
      skid: ['bad', '🚨 সামনের/পেছনের চাকা স্কিড করবে', 'প্রয়োজনীয় ঘর্ষণ μN-কে ছাড়িয়ে গেছে। সর্বোচ্চ গ্রিপ-সীমা ' + fmt(kmh(c.vSkid), 1) + ' km/h।'],
      slide: ['warn', '⚠️ ঢাল বেয়ে নিচে পিছলাচ্ছে', 'ঢালু ট্র্যাকে বেগ খুব কম হলে সাইকেল নিচের দিকে নামতে চায়।'] }[c.st];
  }
  function update() {
    C = calc(); var c = C, p = c.p, b = c.b, m = p.m, si = info(c), Fc = m * b.a, Rr = m * Math.hypot(G, b.a), Nn = m * b.N, fr = m * b.f;
    setStatus(ui.status, si[0], si[1], si[2]);
    var com = leanView(lv, { kind: 'cycle', lean: c.lean, bank: p.phi, hCoM: p.h, G: G, a: b.a, N: b.N, f: b.f, spark: c.lean > c.pedal, sparkX: 28, t: performance.now() / 1000 });
    leanPlot(plot, { xMax: Math.max(40, Math.ceil(Math.max(p.v * 1.3, kmh(c.vSkid) * 1.1, 40) / 10) * 10), limits: [{ deg: c.skid, label: 'গ্রিপ সীমা', col: '#fb7185' }, { deg: c.pedal, label: 'প্যাডাল সীমা', col: '#fbbf24' }], curve: function (v) { return Math.atan(v * v / (p.r * G)) / D2R; }, cur: { v: p.v, deg: c.lean } });
    setStats(ui.stats, [
      ['ঝোঁক কোণ θ (উল্লম্ব থেকে)', fmt(c.lean, 1) + '°', 'gold', 'tanθ = v²/rg'],
      ['ট্র্যাকের তল থেকে ঝোঁক', fmt(c.lean - p.phi, 1) + '°', ''],
      ['কেন্দ্রমুখী ত্বরণ', fmt(b.a, 2) + ' m/s²', '', fmt(b.a / G, 2) + ' g'],
      ['কেন্দ্রমুখী বল', fmt(Fc, 1) + ' N', ''],
      ['ভূমির প্রতিক্রিয়া R', fmt(Rr, 0) + ' N', '', fmt(Rr / (m * G), 2) + ' × ওজন'],
      ['লম্ব প্রতিক্রিয়া N', fmt(Nn, 0) + ' N', ''],
      ['ঘর্ষণ বল f', fmt(Math.abs(fr), 0) + ' N', b.util > 1 ? 'bad' : '', 'সর্বোচ্চ ' + fmt(p.mu * Nn, 0) + ' N'],
      ['ঘর্ষণ ব্যবহার', fmt(Math.min(b.util, 9) * 100, 0) + '%', b.util > 1 ? 'bad' : (b.util > .8 ? 'warn' : 'ok')],
      ['গ্রিপের সর্বোচ্চ বেগ', fmt(kmh(c.vSkid), 1) + ' km/h', 'ok'],
      ['প্যাডাল সীমার বেগ', fmt(kmh(c.vPedal), 1) + ' km/h', 'warn'],
      ['এই বেগের জন্য ন্যূনতম r', fmt(c.vms * c.vms / (G * Math.tan(Math.min(c.skid, c.pedal) * D2R)), 1) + ' m', ''],
      ['ভরকেন্দ্রের পার্শ্ব সরণ', fmt(p.h * Math.sin(c.lean * D2R) * 100, 0) + ' cm', ''],
      ['এক পাক ঘুরতে সময়', fmt(TAU * p.r / c.vms, 1) + ' s', ''],
      ['ট্র্যাকের আদর্শ বেগ', fmt(kmh(b.v0), 1) + ' km/h', '']
    ]);
    setSteps(ui.steps, '🧠 কেন কাত হতে হয়?', [
      'বাঁকে কেন্দ্রমুখী বল লাগে: Fc = mv²/r = ' + fmt(m, 0) + ' × ' + fmt(c.vms, 2) + '² / ' + fmt(p.r, 1) + ' = <b>' + fmt(Fc, 1) + ' N</b>',
      'ভূমির প্রতিক্রিয়া R এর উল্লম্ব অংশ ওজন mg-কে ঠেকায়, অনুভূমিক অংশ Fc জোগায়।',
      'ভরকেন্দ্র উল্টে না যেতে R-কে ভরকেন্দ্রের ভেতর দিয়ে যেতে হয়: tanθ = Fc/mg = v²/rg → <b>θ = ' + fmt(c.lean, 1) + '°</b>',
      'ঘর্ষণ সীমা: ফ্ল্যাট রাস্তায় tanθ ≤ μ, অর্থাৎ সর্বোচ্চ ঝোঁক = tan⁻¹(μ) = ' + fmt(Math.atan(p.mu) / D2R, 1) + '°',
      'ট্র্যাক ঢালু হলে সীমা বাড়ে: θ ≤ φ + tan⁻¹μ = <b>' + fmt(c.skid, 1) + '°</b>; তাই ভেলোড্রোমে বেশি বেগে ঘোরা যায়।'
    ]);
  }
  presetButtons(ui.presets, [
    ['🚲 সাধারণ বাঁক', function () { form.set('v', 20); form.set('r', 20); form.set('phi', 0); form.set('mu', .7); update(); }],
    ['🌧️ ভেজা রাস্তা', function () { form.set('mu', .35); update(); }],
    ['🧊 বরফ', function () { form.set('mu', .1); form.set('v', 10); update(); }],
    ['🏟️ ভেলোড্রোম', function () { form.set('phi', 40); form.set('r', 25); form.set('v', 45); form.set('mu', .9); update(); }],
    ['🏁 সীমা পর্যন্ত', function () { form.set('v', Math.floor(kmh(Math.min(C.vSkid, C.vPedal)) * .98)); update(); }],
    ['🌙 চাঁদে সাইকেল', function () { G = 1.62; update(); }]
  ]);
  loop(root, function (dt) {
    var c = C; ph += clamp(c.vms / c.p.r * 1.3, .12, 2.6) * dt;
    var bad = c.st === 'skid' || c.st === 'pedal';
    drawTop(top, ph, { kind: 'cycle', color: bad ? '#f43f5e' : '#fbbf24', rgb: bad ? '244,63,94' : '251,191,36', speedPx: c.vms * 3, cpPx: c.b.a * 2.4, drift: c.st === 'skid' ? .6 : 0, badge: 'ঝোঁক ' + fmt(c.lean, 0) + '°', badgeCol: bad ? '#fb7185' : '#fbbf24' });
  });
  update();
};

/* ---------- friction (traction) circle ---------- */
function frictionCircle(cv, o) {
  var x = cv.x, w = cv.w, h = cv.h, cx = w / 2, cy = h / 2 + 6, R = Math.min(w, h) * .36, rng = Math.max(1.5, o.mu * 1.25);
  bg(x, w, h, '#071522', '#0d2335'); grid(x, w, h, 30);
  var S1 = R / o.mu;
  x.strokeStyle = 'rgba(148,184,214,.5)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(12, cy); x.lineTo(w - 12, cy); x.moveTo(cx, 28); x.lineTo(cx, h - 10); x.stroke();
  var gr = x.createRadialGradient(cx, cy, 5, cx, cy, R); gr.addColorStop(0, 'rgba(52,211,153,.05)'); gr.addColorStop(.8, 'rgba(52,211,153,.18)'); gr.addColorStop(1, 'rgba(244,63,94,.28)');
  x.fillStyle = gr; x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.fill();
  x.strokeStyle = '#fb7185'; x.lineWidth = 2.5; x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.stroke();
  x.setLineDash([5, 6]); x.strokeStyle = 'rgba(251,191,36,.8)'; x.lineWidth = 1.5; x.beginPath(); x.arc(cx, cy, R * .8, 0, TAU); x.stroke(); x.setLineDash([]);
  txt(x, 'গ্রিপ সীমা (μ = ' + fmt(o.mu, 2) + ')', cx, cy - R - 7, 11, '#fda4af', 'center', '700');
  txt(x, 'পার্শ্ব →', w - 10, cy - 6, 11, '#7dd3fc', 'right', '700'); txt(x, '↑ ত্বরণ', cx + 6, 24, 11, '#6ee7b7', 'left', '700'); txt(x, '↓ ব্রেক', cx + 6, h - 14, 11, '#fda4af', 'left', '700');
  var px = cx + clamp(o.lat / o.mu, -1.45, 1.45) * R, py = cy - clamp(o.lon / o.mu, -1.45, 1.45) * R, bad = o.util > 1;
  x.strokeStyle = bad ? '#fb7185' : '#34d399'; x.lineWidth = 3; x.beginPath(); x.moveTo(cx, cy); x.lineTo(px, py); x.stroke();
  x.fillStyle = bad ? '#f43f5e' : '#fbbf24'; x.beginPath(); x.arc(px, py, 8, 0, TAU); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 2; x.stroke();
  pill(x, 'ব্যবহার ' + fmt(Math.min(o.util, 9) * 100, 0) + '%', cx, h - 28 > cy + R + 16 ? cy + R + 18 : h - 30, bad ? '#fb7185' : '#34d399', 12);
}

/* ================= MOTORCYCLE BANKING ================= */
S.motorcycleBanking = function (root, done) {
  var ui = shell(root, {
    title: 'মোটরসাইকেল ব্যাঙ্কিং — ঝোঁক, গ্রিপ ও ফ্রিকশন সার্কেল',
    intro: 'মোটরসাইকেলকে বাঁকে কাত হতে হয়। টায়ারের গ্রিপ, ব্রেক/অ্যাক্সিলারেশন, রাস্তার ঢাল, রাইডারের শরীর ভেতরে ঝোঁকানো এবং গ্রাউন্ড ক্লিয়ারেন্স বদলে দেখুন কখন নিরাপদ, কখন হাঁটু/ফুটপেগ ঘষে, আর কখন টায়ার পিছলায়।'
  });
  var G = 9.81, ph = 0, t0 = 0;
  var lv = canvas(ui.viz, 680, 330, 'c4', 'পেছন থেকে দেখা: ঝোঁক ও বলসমূহ');
  var fc = canvas(ui.viz, 330, 330, 'c2', 'ফ্রিকশন সার্কেল (টায়ারের গ্রিপ)');
  var plot = canvas(ui.viz, 680, 250, 'c4', 'গতি বনাম ঝোঁক কোণ');
  var top = canvas(ui.viz, 330, 250, 'c2', 'উপর থেকে দেখা (লাইভ)');
  var form = Form(ui.form, function () { update(); done && done(); });
  var g1 = form.group('🏍️ বাইক ও রাইডার', [
    { key: 'm', label: 'রাইডার + বাইকের ভর', min: 120, max: 450, step: 1, value: 250, unit: 'kg', dec: 0 },
    { key: 'h', label: 'ভরকেন্দ্রের উচ্চতা', min: .45, max: 1.1, step: .01, value: .65, unit: 'm' },
    { key: 'hang', label: 'রাইডার ভেতরে ঝুঁকছে (hang-off)', min: 0, max: .35, step: .01, value: 0, unit: 'm' },
    { key: 'lim', label: 'গ্রাউন্ড ক্লিয়ারেন্সের ঝোঁক সীমা', min: 30, max: 60, step: 1, value: 50, unit: '°', dec: 0 }]);
  var g2 = form.group('🛞 টায়ার ও রাস্তা', [
    { key: 'mu', label: 'টায়ার–রাস্তার ঘর্ষণ μ', min: .1, max: 1.6, step: .01, value: 1, unit: '' },
    { key: 'phi', label: 'রাস্তার ব্যাঙ্কিং কোণ φ', min: 0, max: 20, step: .5, value: 0, unit: '°', dec: 1 },
    { key: 'r', label: 'বাঁকের ব্যাসার্ধ r', min: 10, max: 400, step: 1, value: 60, unit: 'm', dec: 0 }]);
  form.select(g2, 'টায়ার / রাস্তার অবস্থা', [['1', 'শুকনো রাস্তা, সাধারণ টায়ার (1.0)'], ['1.2', 'স্পোর্টস টায়ার (1.2)'], ['1.4', 'রেসিং স্লিক (1.4)'], ['.6', 'ভেজা রাস্তা (0.6)'], ['.3', 'বালি / তেল (0.3)'], ['.12', 'বরফ (0.12)']], function (v) { form.set('mu', v); update(); }, '1');
  form.group('⚡ গতি ও ত্বরণ', [
    { key: 'v', label: 'বাইকের বেগ v', min: 20, max: 300, step: 1, value: 80, unit: 'km/h', dec: 0 },
    { key: 'ax', label: 'অনুদৈর্ঘ্য ত্বরণ (− মানে ব্রেক)', min: -9, max: 6, step: .1, value: 0, unit: 'm/s²', dec: 1 }]);
  function calc() {
    var p = form.get(), vms = p.v / 3.6, t = p.phi * D2R, a = vms * vms / p.r;
    var N = G * Math.cos(t) + a * Math.sin(t), fl = a * Math.cos(t) - G * Math.sin(t), util = Math.hypot(fl, p.ax) / (p.mu * N + 1e-9);
    var thC = Math.atan(a / G) / D2R, delta = Math.atan(.72 * p.hang / p.h) / D2R, bike = Math.max(0, thC - delta), rel = bike - p.phi;
    var vg = 0; for (var u = 0; u <= 120; u += .25) { var aa = u * u / p.r, NN = G * Math.cos(t) + aa * Math.sin(t), ff = aa * Math.cos(t) - G * Math.sin(t); if (Math.hypot(ff, p.ax) / (p.mu * NN + 1e-9) <= 1) vg = u; else if (u > 1 && vg > 0) break; }
    var tc = (p.lim + p.phi + delta) * D2R, vcl = Math.sqrt(p.r * G * Math.tan(Math.min(tc, 1.5)));
    var st = 'ok'; if (util > 1) st = 'slip'; else if (rel > p.lim) st = 'scrape'; else if (util > .85 || rel > p.lim - 4) st = 'near'; else if (rel >= 38) st = 'knee';
    return { p: p, vms: vms, a: a, N: N, fl: fl, util: util, thC: thC, delta: delta, bike: bike, rel: rel, vg: vg, vcl: vcl, st: st, gforce: Math.hypot(1, a / G) };
  }
  var C = calc();
  function info(c) {
    return { ok: ['ok', '✅ নিরাপদ গ্রিপ', 'বাইকের ঝোঁক ' + fmt(c.rel, 1) + '°; টায়ারের গ্রিপের ' + fmt(c.util * 100, 0) + '% ব্যবহার হচ্ছে।'],
      knee: ['ok', '🏍️ হাঁটু নামানোর মতো ঝোঁক', 'ঝোঁক ' + fmt(c.rel, 1) + '°। রেসিং কর্নারিংয়ের মতো গভীর ঝোঁক, তবে এখনও গ্রিপ আছে।'],
      near: ['warn', '🟡 সীমার কাছাকাছি', 'গ্রিপ বা গ্রাউন্ড ক্লিয়ারেন্স প্রায় শেষ। ব্রেক/থ্রটল মসৃণ রাখুন, বেগ কমান।'],
      scrape: ['bad', '⚠️ ফুটপেগ/ফেয়ারিং মাটিতে ঘষছে', 'ঝোঁক সীমা ' + fmt(c.p.lim, 0) + '° ছাড়িয়েছে; বাইক আর বেশি কাত হতে পারে না।'],
      slip: ['bad', '🚨 টায়ার গ্রিপ হারাচ্ছে', 'পার্শ্ব ও অনুদৈর্ঘ্য বলের যোগফল μN ছাড়িয়েছে। গ্রিপের সর্বোচ্চ বেগ ≈ ' + fmt(kmh(c.vg), 0) + ' km/h।'] }[c.st];
  }
  function update() {
    C = calc(); var c = C, p = c.p, si = info(c), m = p.m, Nn = m * c.N, fx = m * p.ax;
    setStatus(ui.status, si[0], si[1], si[2]);
    leanView(lv, { kind: 'moto', lean: c.bike, bank: p.phi, hCoM: p.h, comOff: .72 * p.hang * 100, hangPx: p.hang * 100, G: G, a: c.a, N: c.N, f: c.fl, spark: c.rel >= 38 || c.st === 'scrape', knee: c.rel >= 38, sparkX: 64 + p.hang * 100, t: performance.now() / 1000 });
    frictionCircle(fc, { mu: p.mu, lat: Math.abs(c.fl) / G, lon: p.ax / G, util: c.util });
    leanPlot(plot, { xMax: Math.max(60, Math.ceil(Math.max(p.v * 1.25, kmh(Math.max(c.vg, c.vcl)) * 1.1) / 20) * 20), limits: [{ deg: p.phi + Math.atan(p.mu) / D2R, label: 'গ্রিপ সীমা', col: '#fb7185' }, { deg: p.lim + p.phi + c.delta, label: 'ক্লিয়ারেন্স সীমা', col: '#fbbf24' }], curve: function (v) { return Math.atan(v * v / (p.r * G)) / D2R; }, cur: { v: p.v, deg: c.thC } });
    setStats(ui.stats, [
      ['গাড়ির ঝোঁক (ভরকেন্দ্র রেখা)', fmt(c.thC, 1) + '°', 'gold', 'tanθ = v²/rg'],
      ['বাইকের ফ্রেমের ঝোঁক', fmt(c.bike, 1) + '°', '', 'hang-off কমায় ' + fmt(c.delta, 1) + '°'],
      ['রাস্তার তল থেকে ঝোঁক', fmt(c.rel, 1) + '°', c.rel > p.lim ? 'bad' : ''],
      ['পার্শ্ব ত্বরণ', fmt(c.a, 2) + ' m/s²', '', fmt(c.a / G, 2) + ' g'],
      ['অনুভূত g-বল', fmt(c.gforce, 2) + ' g', ''],
      ['টায়ারের লম্ব বল N', fmt(Nn, 0) + ' N', '', fmt(c.N / G, 2) + ' × ওজন'],
      ['পার্শ্ব ঘর্ষণ বল', fmt(Math.abs(m * c.fl), 0) + ' N', ''],
      ['অনুদৈর্ঘ্য বল (ব্রেক/থ্রটল)', fmt(Math.abs(fx), 0) + ' N', p.ax < 0 ? 'warn' : ''],
      ['মোট ঘর্ষণ ব্যবহার', fmt(Math.min(c.util, 9) * 100, 0) + '%', c.util > 1 ? 'bad' : (c.util > .85 ? 'warn' : 'ok')],
      ['অবশিষ্ট গ্রিপ', fmt(Math.max(0, 1 - c.util) * 100, 0) + '%', ''],
      ['গ্রিপের সর্বোচ্চ বেগ', fmt(kmh(c.vg), 0) + ' km/h', 'ok'],
      ['ক্লিয়ারেন্সের সর্বোচ্চ বেগ', fmt(kmh(c.vcl), 0) + ' km/h', 'warn'],
      ['কর্নার শেষ হতে সময় (এক পাক)', fmt(TAU * p.r / c.vms, 1) + ' s', '']
    ]);
    setSteps(ui.steps, '🧠 মোটরসাইকেল কেন এত কাত হয়?', [
      'পার্শ্ব ত্বরণ a = v²/r = ' + fmt(c.vms, 2) + '² / ' + fmt(p.r, 0) + ' = <b>' + fmt(c.a, 2) + ' m/s²</b> (' + fmt(c.a / G, 2) + ' g)',
      'ভরকেন্দ্র সোজা থাকতে হলে ঝোঁক কোণ: tanθ = a/g → <b>θ = ' + fmt(c.thC, 1) + '°</b>',
      'রাইডার ভেতরে ঝুঁকলে (' + fmt(p.hang, 2) + ' m) বাইকের ফ্রেমকে কম কাত হতে হয়: ফ্রেমের ঝোঁক ≈ <b>' + fmt(c.bike, 1) + '°</b> (সরল মডেল)',
      'ফ্রিকশন সার্কেল: √(f_পার্শ্ব² + f_দৈর্ঘ্য²) ≤ μN → ' + fmt(Math.hypot(m * c.fl, fx), 0) + ' ≤ ' + fmt(p.mu * Nn, 0) + ' N',
      'ব্রেক বা থ্রটল দিলে পার্শ্ব গ্রিপ কমে যায়, তাই বাঁকে ধীরে ও মসৃণভাবে ব্রেক করা নিরাপদ।'
    ]);
  }
  presetButtons(ui.presets, [
    ['🛣️ রোজকার বাঁক', function () { form.set('v', 60); form.set('r', 60); form.set('mu', 1); form.set('ax', 0); form.set('hang', 0); form.set('phi', 0); update(); }],
    ['🏁 রেস কর্নার', function () { form.set('v', 150); form.set('r', 90); form.set('mu', 1.4); form.set('hang', .25); form.set('ax', 0); update(); }],
    ['🌧️ ভেজা রাস্তা', function () { form.set('mu', .6); update(); }],
    ['🛑 বাঁকে ব্রেক', function () { form.set('ax', -6); update(); }],
    ['🚀 থ্রটল আউট', function () { form.set('ax', 4); update(); }],
    ['🎯 গ্রিপ সীমায়', function () { form.set('v', Math.max(20, Math.floor(kmh(C.vg) * .98))); update(); }]
  ]);
  loop(root, function (dt) {
    var c = C; ph += clamp(c.vms / c.p.r * 1.3, .12, 2.6) * dt; t0 += dt;
    var bad = c.st === 'slip' || c.st === 'scrape';
    drawTop(top, ph, { kind: 'bike', color: bad ? '#f43f5e' : '#38bdf8', rgb: bad ? '244,63,94' : '56,189,248', speedPx: c.vms * 1.1, cpPx: c.a * 2.2, drift: c.st === 'slip' ? .7 : 0, badge: info(c)[1].replace(/^[^ ]+ /, ''), badgeCol: bad ? '#fb7185' : '#34d399' });
    if (c.st === 'knee' || c.st === 'scrape') leanView(lv, { kind: 'moto', lean: c.bike, bank: c.p.phi, hCoM: c.p.h, comOff: .72 * c.p.hang * 100, hangPx: c.p.hang * 100, G: G, a: c.a, N: c.N, f: c.fl, spark: true, knee: true, sparkX: 64 + c.p.hang * 100, t: t0 });
  });
  update();
};

/* ================= NEWTONIAN MECHANICS LAB ================= */
S.newtonMechanics = function (root, done) {
  var ui = shell(root, {
    title: 'নিউটনীয় বলবিদ্যা ল্যাব — বল, ভর ও গতি',
    intro: 'ছয়টি পরীক্ষা বেছে নিন: ঘর্ষণসহ বল, আনত তল, অ্যাটউড মেশিন, টেবিল ও ঝুলন্ত ভর, লিফট এবং সংঘর্ষ। প্রতিটিতে ইনপুট বদলে বল, ত্বরণ, বেগ, সরণ এবং লাইভ গ্রাফ দেখুন।',
    cls: 'pl74-newton'
  });
  var G = 9.81, key = 'friction', paused = false, speed = 1, s = null, hist = [], C = null, form = null, wait = 0, acc = 0;
  var tabs = document.createElement('div'); tabs.className = 'pl74-tabs c6'; ui.viz.appendChild(tabs);
  var st = canvas(ui.viz, 680, 320, 'c6', 'চলমান দৃশ্য ও বলচিত্র');
  var ctl = document.createElement('div'); ctl.className = 'pl74-anim c6'; ui.viz.appendChild(ctl);
  var gr = canvas(ui.viz, 680, 230, 'c6', 'লাইভ গ্রাফ');
  var MU = [{ key: 'mus', label: 'স্থিতি ঘর্ষণ সহগ μs', min: 0, max: 1.2, step: .01, value: .5, unit: '' }, { key: 'muk', label: 'গতি ঘর্ষণ সহগ μk', min: 0, max: 1.2, step: .01, value: .35, unit: '' }];
  function bx(x, cx, cy, w, h, col, label) { x.fillStyle = col; rr(x, cx - w / 2, cy - h / 2, w, h, 6); x.fill(); x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 1.5; x.stroke(); if (label) txt(x, label, cx, cy + 4, 12, '#06121e', 'center', '800'); }
  function sz(m) { return 26 + Math.cbrt(m) * 9; }
  function head(x, w, c) { txt(x, 't = ' + fmt(s.t, 2) + ' s', 12, 22, 13, '#e2e8f0', 'left', '800'); txt(x, 'v = ' + fmt(s.v, 2) + ' m/s', 12, 40, 12, '#7dd3fc', 'left', '700'); txt(x, 'x = ' + fmt(s.x, 2) + ' m', 12, 58, 12, '#fbbf24', 'left', '700'); txt(x, 'a = ' + fmt(c.a, 2) + ' m/s²', 12, 76, 12, '#6ee7b7', 'left', '700'); txt(x, 'g = ' + fmt(G, 2), w - 12, 22, 12, '#94a3b8', 'right', '700'); }

  var SC = {
    friction: {
      name: 'বল ও ঘর্ষণ', icon: '🧱', gnames: ['বেগ v (m/s)', 'সরণ x (m)'],
      groups: [['📦 বস্তু ও বল', [{ key: 'm', label: 'ভর m', min: 1, max: 100, step: 1, value: 10, unit: 'kg', dec: 0 }, { key: 'F', label: 'প্রয়োগকৃত বল F', min: 0, max: 400, step: 1, value: 60, unit: 'N', dec: 0 }, { key: 'al', label: 'বলের কোণ (অনুভূমিক থেকে)', min: -30, max: 60, step: 1, value: 0, unit: '°', dec: 0 }]], ['🧱 তল', MU]],
      presets: [['🧊 মসৃণ তল', { mus: 0, muk: 0 }], ['⚖️ ঠিক সীমায়', { F: 50, mus: .5, muk: .35 }], ['⬆️ উপরে টানা', { al: 35, F: 80 }], ['🪨 ভারী বস্তু', { m: 80, F: 150 }]],
      calc: function (p) {
        var ar = p.al * D2R, Fx = p.F * Math.cos(ar), Fy = p.F * Math.sin(ar), N = Math.max(0, p.m * G - Fy), muk = Math.min(p.muk, p.mus), fsm = p.mus * N, fk = muk * N, stat = Fx <= fsm + 1e-9, a = stat ? 0 : (Fx - fk) / p.m, f = stat ? Fx : fk;
        return { a: a, N: N, Fx: Fx, Fy: Fy, fsm: fsm, fk: fk, f: f, stat: stat, tmax: 8,
          status: N <= 0 ? ['warn', '🪽 বস্তু মাটি ছেড়ে উঠে যাচ্ছে', 'F sinθ ≥ mg হওয়ায় লম্ব প্রতিক্রিয়া শূন্য।'] : (stat ? ['ok', '🧱 বস্তু স্থির', 'F cosθ = ' + fmt(Fx, 1) + ' N ≤ μsN = ' + fmt(fsm, 1) + ' N, তাই স্থিতি ঘর্ষণ বলকে সমান করছে।'] : ['ok', '🚀 বস্তু ত্বরান্বিত হচ্ছে', 'লব্ধি বল ' + fmt(Fx - fk, 1) + ' N, তাই a = ' + fmt(a, 2) + ' m/s²।']),
          rows: [['লম্ব প্রতিক্রিয়া N', fmt(N, 1) + ' N', ''], ['ওজন mg', fmt(p.m * G, 1) + ' N', ''], ['অনুভূমিক বল F cosθ', fmt(Fx, 1) + ' N', ''], ['সর্বোচ্চ স্থিতি ঘর্ষণ', fmt(fsm, 1) + ' N', 'warn'], ['গতি ঘর্ষণ', fmt(fk, 1) + ' N', ''], ['লব্ধি বল', fmt(stat ? 0 : Fx - fk, 1) + ' N', 'gold'], ['ত্বরণ a = ΣF/m', fmt(a, 2) + ' m/s²', 'ok'], ['চলা শুরুর ন্যূনতম বল', fmt(fsm / Math.max(.05, Math.cos(ar)), 1) + ' N', ''], ['১০ s-এ বেগ (অনুমান)', fmt(a * 10, 1) + ' m/s', '']],
          steps: ['লম্ব বল: N = mg − F sinθ = ' + fmt(N, 1) + ' N', 'ঘর্ষণ: fs(max) = μs N = ' + fmt(fsm, 1) + ' N, fk = μk N = ' + fmt(fk, 1) + ' N', 'যদি F cosθ ≤ fs(max) হয় বস্তু স্থির, নইলে ΣF = F cosθ − fk', 'ত্বরণ: a = ΣF / m = <b>' + fmt(a, 2) + ' m/s²</b>'] };
      },
      draw: function (x, w, h, c, p) {
        var gy = h - 78, cx = w * .4, bw = sz(p.m) + 14, bh = bw * .8, off = -(s.x * 44) % 70;
        bg(x, w, h, '#06121e', '#123550'); x.fillStyle = '#1b3145'; x.fillRect(0, gy, w, h - gy); x.strokeStyle = '#6b8dab'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, gy); x.lineTo(w, gy); x.stroke();
        x.strokeStyle = 'rgba(148,184,214,.35)'; x.lineWidth = 2; for (var i = -1; i < w / 70 + 1; i++) { x.beginPath(); x.moveTo(i * 70 + off, gy + 10); x.lineTo(i * 70 + off + 28, gy + 10); x.stroke(); }
        bx(x, cx, gy - bh / 2, bw, bh, '#38bdf8', p.m + ' kg');
        var k = 70 / (p.m * G), ar = p.al * D2R, cy = gy - bh / 2;
        arrow(x, cx, cy - 6, cx, cy - 6 - clamp(k * c.N, 4, 150), '#34d399', 'N', 3); arrow(x, cx, cy + 6, cx, cy + 6 + 70, '#fbbf24', 'mg', 3);
        if (p.F > 0) arrow(x, cx + bw / 2, cy, cx + bw / 2 + clamp(k * p.F, 10, 190) * Math.cos(ar), cy - clamp(k * p.F, 10, 190) * Math.sin(ar), '#f472b6', 'F', 3.4);
        if (c.f > .5) arrow(x, cx - bw / 2, gy - 4, cx - bw / 2 - clamp(k * c.f, 6, 150), gy - 4, '#a78bfa', c.stat ? 'fs' : 'fk', 3);
        head(x, w, c);
      }
    },
    incline: {
      name: 'আনত তল', icon: '📐', gnames: ['বেগ v (m/s)', 'সরণ x (m)'],
      groups: [['📦 বস্তু ও তল', [{ key: 'm', label: 'ভর m', min: 1, max: 100, step: 1, value: 10, unit: 'kg', dec: 0 }, { key: 'an', label: 'তলের কোণ θ', min: 0, max: 75, step: .5, value: 30, unit: '°', dec: 1 }, { key: 'Fp', label: 'ঢাল বরাবর উপরের দিকে বল', min: -100, max: 300, step: 1, value: 0, unit: 'N', dec: 0 }]], ['🧱 ঘর্ষণ', MU]],
      presets: [['🛝 মসৃণ ঢাল', { mus: 0, muk: 0 }], ['⚖️ সীমা কোণে', { mus: .577, muk: .5, an: 30 }], ['⛰️ খাড়া ঢাল', { an: 60 }], ['🪢 টেনে ধরা', { Fp: 49, mus: 0, muk: 0 }]],
      calc: function (p) {
        var t = p.an * D2R, N = p.m * G * Math.cos(t), W = p.m * G * Math.sin(t), net = p.Fp - W, muk = Math.min(p.muk, p.mus), stat = Math.abs(net) <= p.mus * N + 1e-9, sg = net >= 0 ? 1 : -1, a = stat ? 0 : (net - sg * muk * N) / p.m, f = stat ? -net : -sg * muk * N;
        return { a: a, N: N, W: W, net: net, f: f, stat: stat, xEnd: 2, tmax: 9,
          status: stat ? ['ok', '🧱 বস্তু স্থির', 'ঢালের বল ও প্রয়োগ বল ঘর্ষণ দিয়ে সামলানো যাচ্ছে (|ΣF| ≤ μsN)।'] : [a < 0 ? 'warn' : 'ok', a < 0 ? '⬇️ বস্তু ঢাল বেয়ে নামছে' : '⬆️ বস্তু ঢাল বেয়ে উঠছে', 'ত্বরণ ' + fmt(a, 2) + ' m/s² (ঢাল বরাবর, উপরের দিক ধনাত্মক)।'],
          rows: [['লম্ব প্রতিক্রিয়া mg cosθ', fmt(N, 1) + ' N', ''], ['ঢাল বরাবর উপাংশ mg sinθ', fmt(W, 1) + ' N', 'warn'], ['প্রয়োগ বল', fmt(p.Fp, 1) + ' N', ''], ['ঘর্ষণ বল', fmt(Math.abs(f), 1) + ' N', ''], ['সর্বোচ্চ স্থিতি ঘর্ষণ', fmt(p.mus * N, 1) + ' N', ''], ['ত্বরণ a', fmt(a, 2) + ' m/s²', 'ok'], ['স্থির থাকার সীমা কোণ tan⁻¹μs', fmt(Math.atan(p.mus) / D2R, 1) + '°', 'gold'], ['মসৃণ ঢালে ত্বরণ g sinθ', fmt(G * Math.sin(t), 2) + ' m/s²', ''], ['২ m পথ পেরোতে সময়', a !== 0 ? fmt(Math.sqrt(4 / Math.abs(a)), 2) + ' s' : '—', '']],
          steps: ['ঢালের লম্ব বরাবর: N = mg cosθ = ' + fmt(N, 1) + ' N', 'ঢাল বরাবর: mg sinθ = ' + fmt(W, 1) + ' N নিচের দিকে, প্রয়োগ বল Fp = ' + fmt(p.Fp, 1) + ' N উপরের দিকে', 'ΣF = Fp − mg sinθ ∓ μk N, তাই <b>a = ' + fmt(a, 2) + ' m/s²</b>', 'ভর কেটে যায়, তাই ঘর্ষণহীন ঢালে সব বস্তু একই ত্বরণে নামে: a = g sinθ'] };
      },
      draw: function (x, w, h, c, p) {
        var t = p.an * D2R, Ls = Math.min(430, (w - 120) / Math.max(.2, Math.cos(t)), t > .01 ? (h - 95) / Math.sin(t) : 999), A = [40, h - 36], Lx = Ls * Math.cos(t), Ly = Ls * Math.sin(t);
        bg(x, w, h, '#06121e', '#123550'); x.fillStyle = '#1e3a52'; x.beginPath(); x.moveTo(A[0], A[1]); x.lineTo(A[0] + Lx, A[1]); x.lineTo(A[0] + Lx, A[1] - Ly); x.closePath(); x.fill(); x.strokeStyle = '#7fa6c4'; x.lineWidth = 3; x.stroke();
        x.fillStyle = '#15283a'; x.fillRect(0, A[1], w, h - A[1]);
        txt(x, 'θ = ' + fmt(p.an, 1) + '°', A[0] + Lx - 56, A[1] - 8, 13, '#fbbf24', 'left', '800'); x.strokeStyle = '#fbbf24'; x.lineWidth = 2; x.beginPath(); x.arc(A[0] + Lx, A[1], 46, Math.PI, Math.PI + t, false); x.stroke();
        var u = clamp(.5 + s.x * .19, .1, .9), bw = sz(p.m) + 6, bh = bw * .75, P = [A[0] + u * Ls * Math.cos(t), A[1] - u * Ls * Math.sin(t)];
        x.save(); x.translate(P[0], P[1]); x.rotate(-t); x.fillStyle = '#38bdf8'; rr(x, -bw / 2, -bh, bw, bh, 5); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 1.4; x.stroke(); txt(x, p.m + ' kg', 0, -bh / 2 + 4, 11, '#06121e', 'center', '800'); x.restore();
        var ctr = [P[0] - Math.sin(t) * bh / 2, P[1] - Math.cos(t) * bh / 2], k = 70 / (p.m * G), nx = -Math.sin(t), ny = -Math.cos(t), dx = Math.cos(t), dy = -Math.sin(t);
        arrow(x, ctr[0], ctr[1], ctr[0], ctr[1] + 70, '#fbbf24', 'mg', 3);
        arrow(x, ctr[0], ctr[1], ctr[0] + nx * clamp(k * c.N, 6, 150), ctr[1] + ny * clamp(k * c.N, 6, 150), '#34d399', 'N', 3);
        if (Math.abs(p.Fp) > 1) arrow(x, ctr[0], ctr[1], ctr[0] + dx * clamp(k * p.Fp, 6, 170), ctr[1] + dy * clamp(k * p.Fp, 6, 170), '#f472b6', 'F', 3);
        if (Math.abs(c.f) > .5) arrow(x, P[0], P[1], P[0] + dx * clamp(k * c.f, -150, 150), P[1] + dy * clamp(k * c.f, -150, 150), '#a78bfa', 'f', 3);
        head(x, w, c);
      }
    },
    atwood: {
      name: 'অ্যাটউড মেশিন', icon: '⚖️', gnames: ['বেগ v (m/s)', 'সরণ x (m)'],
      groups: [['⚖️ দুই ভর ও চরকি', [{ key: 'm1', label: 'বাম ভর m₁', min: 1, max: 50, step: .5, value: 10, unit: 'kg' }, { key: 'm2', label: 'ডান ভর m₂', min: 1, max: 50, step: .5, value: 14, unit: 'kg' }, { key: 'M', label: 'চরকির ভর M (০ = আদর্শ)', min: 0, max: 30, step: .5, value: 0, unit: 'kg' }]]],
      presets: [['⚖️ সমান ভর', { m1: 12, m2: 12 }], ['🪨 অনেক পার্থক্য', { m1: 5, m2: 30 }], ['🎡 ভারী চরকি', { M: 20 }], ['🔬 কাছাকাছি ভর', { m1: 20, m2: 21 }]],
      calc: function (p) {
        var a = (p.m2 - p.m1) * G / (p.m1 + p.m2 + p.M / 2), T1 = p.m1 * (G + a), T2 = p.m2 * (G - a);
        return { a: a, T1: T1, T2: T2, xEnd: 1.6, tmax: 9, stat: Math.abs(a) < 1e-9,
          status: Math.abs(a) < 1e-9 ? ['ok', '⚖️ সাম্যাবস্থা', 'দুই ভর সমান, তাই নিট বল শূন্য।'] : ['ok', p.m2 > p.m1 ? '⬇️ ডান ভর নামছে' : '⬇️ বাম ভর নামছে', 'ভারী ভর নামছে, হালকা ভর উঠছে; ত্বরণ ' + fmt(Math.abs(a), 2) + ' m/s²।'],
          rows: [['ত্বরণ |a|', fmt(Math.abs(a), 3) + ' m/s²', 'ok'], ['দড়ির টান T₁ (বাম)', fmt(T1, 1) + ' N', ''], ['দড়ির টান T₂ (ডান)', fmt(T2, 1) + ' N', ''], ['m₁g', fmt(p.m1 * G, 1) + ' N', ''], ['m₂g', fmt(p.m2 * G, 1) + ' N', ''], ['টানের পার্থক্য T₂ − T₁', fmt(T2 - T1, 2) + ' N', p.M > 0 ? 'warn' : ''], ['আদর্শ চরকির ত্বরণ', fmt(Math.abs(p.m2 - p.m1) * G / (p.m1 + p.m2), 3) + ' m/s²', 'gold'], ['১ s পরে বেগ', fmt(Math.abs(a), 2) + ' m/s', '']],
          steps: ['ডান ভরের সমীকরণ: m₂g − T₂ = m₂a', 'বাম ভরের সমীকরণ: T₁ − m₁g = m₁a', p.M > 0 ? 'চরকির জন্য: (T₂ − T₁)R = ½MR²·(a/R) → T₂ − T₁ = ½Ma' : 'আদর্শ চরকিতে T₁ = T₂ = T', 'ত্বরণ: a = (m₂ − m₁)g / (m₁ + m₂ + M/2) = <b>' + fmt(a, 3) + ' m/s²</b>'] };
      },
      draw: function (x, w, h, c, p) {
        bg(x, w, h, '#06121e', '#123550'); var cx = w / 2, py = 52, R = 30 + Math.cbrt(p.M) * 3.2, ang = s.x * 1.6;
        x.strokeStyle = '#475569'; x.lineWidth = 6; x.beginPath(); x.moveTo(cx - 90, 14); x.lineTo(cx + 90, 14); x.moveTo(cx, 14); x.lineTo(cx, py); x.stroke();
        x.fillStyle = '#0f2437'; x.beginPath(); x.arc(cx, py, R, 0, TAU); x.fill(); x.strokeStyle = '#7dd3fc'; x.lineWidth = 3; x.stroke(); x.strokeStyle = '#fbbf24'; x.lineWidth = 3; x.beginPath(); x.moveTo(cx, py); x.lineTo(cx + Math.cos(ang) * R, py + Math.sin(ang) * R); x.stroke(); x.fillStyle = '#fbbf24'; x.beginPath(); x.arc(cx, py, 4, 0, TAU); x.fill();
        var y2 = 140 + s.x * 44, y1 = 140 - s.x * 44, s1 = sz(p.m1) + 6, s2 = sz(p.m2) + 6, xl = cx - R, xr = cx + R;
        x.strokeStyle = '#e2e8f0'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(xl, py); x.lineTo(xl, y1); x.moveTo(xr, py); x.lineTo(xr, y2); x.stroke();
        bx(x, xl, y1 + s1 / 2, s1, s1, '#34d399', 'm₁'); bx(x, xr, y2 + s2 / 2, s2, s2, '#f59e0b', 'm₂');
        arrow(x, xl, y1 - 2, xl, y1 - 2 - clamp(c.T1 * .4, 10, 90), '#f472b6', 'T₁', 3); arrow(x, xr, y2 - 2, xr, y2 - 2 - clamp(c.T2 * .4, 10, 90), '#f472b6', 'T₂', 3);
        arrow(x, xl, y1 + s1 + 2 - s1 / 2 + s1 / 2, xl, y1 + s1 + 2 + clamp(p.m1 * G * .4, 10, 48), '#fbbf24', 'm₁g', 3); arrow(x, xr, y2 + s2 + 2, xr, y2 + s2 + 2 + clamp(p.m2 * G * .4, 10, 48), '#fbbf24', 'm₂g', 3);
        head(x, w, c);
      }
    },
    table: {
      name: 'টেবিল ও ঝুলন্ত ভর', icon: '🪢', gnames: ['বেগ v (m/s)', 'সরণ x (m)'],
      groups: [['🧱 টেবিলের ওপরের ভর m₁ ও ঝুলন্ত ভর m₂', [{ key: 'm1', label: 'টেবিলের ওপর ভর m₁', min: 1, max: 50, step: .5, value: 8, unit: 'kg' }, { key: 'm2', label: 'ঝুলন্ত ভর m₂', min: .5, max: 50, step: .5, value: 5, unit: 'kg' }]], ['🧱 টেবিলের ঘর্ষণ', MU]],
      presets: [['🧊 মসৃণ টেবিল', { mus: 0, muk: 0 }], ['⚖️ আটকে থাকা', { m1: 10, m2: 4, mus: .5 }], ['🪨 ভারী ঝুলন্ত ভর', { m2: 20 }], ['🛷 রুক্ষ টেবিল', { mus: .8, muk: .6 }]],
      calc: function (p) {
        var muk = Math.min(p.muk, p.mus), stat = p.m2 <= p.mus * p.m1 + 1e-9, a = stat ? 0 : (p.m2 * G - muk * p.m1 * G) / (p.m1 + p.m2), T = stat ? p.m2 * G : p.m1 * (a + muk * G);
        return { a: a, T: T, xEnd: 2.4, tmax: 9, stat: stat,
          status: stat ? ['ok', '🧱 ব্যবস্থা স্থির', 'm₂g ≤ μs m₁g, তাই স্থিতি ঘর্ষণই টান সামলাচ্ছে।'] : ['ok', '🚀 ব্যবস্থা চলছে', 'ঝুলন্ত ভর নামছে, টেবিলের ভর টেনে নিচ্ছে; a = ' + fmt(a, 2) + ' m/s²।'],
          rows: [['ত্বরণ a', fmt(a, 3) + ' m/s²', 'ok'], ['দড়ির টান T', fmt(T, 2) + ' N', ''], ['m₂g', fmt(p.m2 * G, 2) + ' N', ''], ['সর্বোচ্চ স্থিতি ঘর্ষণ', fmt(p.mus * p.m1 * G, 2) + ' N', 'warn'], ['গতি ঘর্ষণ', fmt(muk * p.m1 * G, 2) + ' N', ''], ['চলা শুরুর সর্বনিম্ন m₂', fmt(p.mus * p.m1, 2) + ' kg', 'gold'], ['মসৃণ টেবিলে ত্বরণ', fmt(p.m2 * G / (p.m1 + p.m2), 2) + ' m/s²', ''], ['২.৪ m পথ পেরোতে সময়', a > 0 ? fmt(Math.sqrt(4.8 / a), 2) + ' s' : '—', '']],
          steps: ['ঝুলন্ত ভর: m₂g − T = m₂a', 'টেবিলের ভর: T − μk m₁g = m₁a', 'যোগ করে: a = (m₂ − μk m₁)g / (m₁ + m₂) = <b>' + fmt(a, 3) + ' m/s²</b>', 'T = m₁(a + μk g) = ' + fmt(T, 2) + ' N'] };
      },
      draw: function (x, w, h, c, p) {
        bg(x, w, h, '#06121e', '#123550'); var ty = 150, bw = sz(p.m1) + 8, pxp = Math.round(w * .7), bx0 = 80 + s.x * ((pxp - 80 - bw * 1.4 - 24) / 2.4);
        x.fillStyle = '#3b2f24'; x.fillRect(16, ty, pxp - 16, 22); x.fillStyle = '#2a2018'; x.fillRect(40, ty + 22, 14, h - ty - 22); x.fillRect(pxp - 44, ty + 22, 14, h - ty - 22);
        x.fillStyle = '#0f2437'; x.beginPath(); x.arc(pxp + 10, ty - 6, 15, 0, TAU); x.fill(); x.strokeStyle = '#7dd3fc'; x.lineWidth = 3; x.stroke();
        bx(x, bx0 + bw / 2, ty - bw * .4, bw, bw * .8, '#34d399', 'm₁');
        var ry = ty - bw * .4, y2 = ty + 8 + s.x * 40, s2 = sz(p.m2) + 6;
        x.strokeStyle = '#e2e8f0'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(bx0 + bw, ry); x.lineTo(pxp + 10, ty - 21); x.lineTo(pxp + 25, ty - 6); x.lineTo(pxp + 25, y2); x.stroke();
        bx(x, pxp + 25, y2 + s2 / 2, s2, s2, '#f59e0b', 'm₂');
        var k = 60 / (p.m1 * G);
        arrow(x, bx0 + bw, ry, bx0 + bw + clamp(k * c.T, 8, 130), ry, '#f472b6', 'T', 3);
        var fr = c.stat ? c.T : Math.min(p.muk, p.mus) * p.m1 * G; if (fr > .3) arrow(x, bx0, ty - 4, bx0 - clamp(k * fr, 8, 56), ty - 4, '#a78bfa', c.stat ? 'fs' : 'fk', 3);
        arrow(x, pxp + 25, y2 - 2, pxp + 25, y2 - 2 - clamp(c.T * .35, 8, 80), '#f472b6', 'T', 3); arrow(x, pxp + 25, y2 + s2 + 2, pxp + 25, y2 + s2 + 2 + clamp(p.m2 * G * .35, 8, 80), '#fbbf24', 'm₂g', 3);
        head(x, w, c);
      }
    },
    lift: {
      name: 'লিফট ও আপাত ওজন', icon: '🛗', gnames: ['বেগ v (m/s)', 'উচ্চতা x (m)'],
      groups: [['🛗 লিফট ও মানুষ', [{ key: 'm', label: 'মানুষের ভর m', min: 20, max: 120, step: 1, value: 60, unit: 'kg', dec: 0 }, { key: 'ae', label: 'লিফটের ত্বরণ (↑ ধনাত্মক)', min: -14, max: 12, step: .1, value: 2, unit: 'm/s²', dec: 1 }]]],
      presets: [['⬆️ উপরে ত্বরণ', { ae: 3 }], ['⬇️ নিচে ত্বরণ', { ae: -3 }], ['🪂 মুক্তপতন', { ae: -9.81 }], ['🛗 সমবেগ', { ae: 0 }], ['🧨 কেবল ছেঁড়া', { ae: -12 }]],
      calc: function (p) {
        var Nr = Math.max(0, p.m * (G + p.ae)), pct = Nr / (p.m * G) * 100, tone = p.ae > .05 ? 'ভারী' : (p.ae < -.05 ? 'হালকা' : 'স্বাভাবিক');
        return { a: p.ae, N: Nr, tmax: 6, stat: false, noEnd: true,
          status: Nr <= 0.001 ? ['warn', '🪐 ওজনহীনতা', p.ae < -G - .01 ? 'লিফট g-এর চেয়ে দ্রুত নামছে, মানুষ ছাদের দিকে উঠে যাবে।' : 'মুক্তপতনে ওজন কাঁটা শূন্য দেখায়।'] : [p.ae > .05 ? 'warn' : 'ok', p.ae > .05 ? '⬆️ নিজেকে ভারী লাগছে' : (p.ae < -.05 ? '⬇️ নিজেকে হালকা লাগছে' : '🛗 স্বাভাবিক ওজন'), 'ওজন কাঁটার পাঠ ' + fmt(Nr, 0) + ' N (সত্যিকারের ওজনের ' + fmt(pct, 0) + '%)।'],
          rows: [['ওজন কাঁটার পাঠ N', fmt(Nr, 1) + ' N', 'gold'], ['কিলোগ্রাম-ওজনে', fmt(Nr / G, 1) + ' kg', ''], ['সত্যিকারের ওজন mg', fmt(p.m * G, 1) + ' N', ''], ['আপাত ওজন', fmt(pct, 0) + '%', pct > 100 ? 'warn' : 'ok'], ['আপাত অভিকর্ষ g + a', fmt(Math.max(0, G + p.ae), 2) + ' m/s²', ''], ['অনুভূতি', tone, ''], ['মুক্তপতনের ত্বরণ', fmt(-G, 2) + ' m/s²', ''], ['লিফটের নিচে নামার সীমা (N = 0)', fmt(-G, 2) + ' m/s²', 'warn']],
          steps: ['মানুষের ওপর বল: ওজন কাঁটার ঠেলা N (↑) ও ওজন mg (↓)', 'নিউটনের দ্বিতীয় সূত্র: N − mg = ma', '<b>N = m(g + a) = ' + fmt(Nr, 1) + ' N</b>', 'a > 0 হলে ভারী, a < 0 হলে হালকা, a = −g হলে ওজনহীন।'] };
      },
      draw: function (x, w, h, c, p) {
        bg(x, w, h, '#06121e', '#0e2a40'); var cx = w * .5, off = (s.x * 60) % 60;
        x.strokeStyle = 'rgba(148,184,214,.18)'; x.lineWidth = 1.5; for (var i = -1; i < h / 60 + 2; i++) { var yy = i * 60 + off; x.beginPath(); x.moveTo(0, yy); x.lineTo(120, yy); x.moveTo(w - 120, yy); x.lineTo(w, yy); x.stroke(); }
        txt(x, 'উচ্চতা ' + fmt(s.x, 1) + ' m', 14, h - 12, 12, '#64748b', 'left', '700');
        var ex = cx - 92, ey = 34, ew = 184, eh = 244; x.fillStyle = 'rgba(15,36,55,.9)'; x.fillRect(ex, 0, ew, ey); x.strokeStyle = '#94a3b8'; x.lineWidth = 3; x.beginPath(); x.moveTo(cx, 0); x.lineTo(cx, ey); x.stroke();
        x.fillStyle = 'rgba(30,64,96,.55)'; rr(x, ex, ey, ew, eh, 10); x.fill(); x.strokeStyle = '#7dd3fc'; x.lineWidth = 3; x.stroke();
        var fy = ey + eh - 22, float = c.N <= .01, heavy = p.ae > 1 ? 4 : 0, py = float ? -34 : heavy;
        x.fillStyle = '#334155'; rr(x, cx - 46, fy, 92, 14, 5); x.fill(); x.fillStyle = '#fbbf24'; rr(x, cx - 30, fy + 3, 60, 8, 3); x.fill();
        x.fillStyle = '#f59e0b'; x.fillRect(cx - 14, fy - 66 + py + heavy, 28, 44 - heavy); x.fillStyle = '#fde68a'; x.beginPath(); x.arc(cx, fy - 80 + py + heavy, 13, 0, TAU); x.fill(); x.strokeStyle = '#1e3a8a'; x.lineWidth = 6; x.beginPath(); x.moveTo(cx - 7, fy - 22 + py + heavy); x.lineTo(cx - 9, fy + py * 0); x.moveTo(cx + 7, fy - 22 + py + heavy); x.lineTo(cx + 9, fy + py * 0); x.stroke();
        pill(x, fmt(c.N, 0) + ' N', cx + 78, fy + 12, c.N <= .01 ? '#fb7185' : '#34d399', 13);
        var k = 60 / (p.m * G); arrow(x, cx + 28, fy - 40, cx + 28, fy - 40 - clamp(k * c.N, 4, 160), '#34d399', 'N', 3); arrow(x, cx - 40, fy - 70, cx - 40, fy - 70 + 56, '#fbbf24', 'mg', 3);
        if (Math.abs(p.ae) > .1) arrow(x, ex + ew + 40, ey + eh / 2, ex + ew + 40, ey + eh / 2 - clamp(p.ae * 7, -90, 90), '#f472b6', 'a', 3.4);
        head(x, w, c);
      }
    },
    collision: {
      name: 'সংঘর্ষ ও ভরবেগ', icon: '💥', gnames: ['বেগ v₁ (m/s)', 'বেগ v₂ (m/s)'], collision: true,
      groups: [['🛒 গাড়ি ১ (বাম)', [{ key: 'm1', label: 'ভর m₁', min: 1, max: 20, step: .5, value: 4, unit: 'kg' }, { key: 'u1', label: 'প্রাথমিক বেগ u₁', min: -15, max: 15, step: .5, value: 6, unit: 'm/s' }]], ['🛒 গাড়ি ২ (ডান)', [{ key: 'm2', label: 'ভর m₂', min: 1, max: 20, step: .5, value: 2, unit: 'kg' }, { key: 'u2', label: 'প্রাথমিক বেগ u₂', min: -15, max: 15, step: .5, value: -2, unit: 'm/s' }]], ['💥 সংঘর্ষের ধরন', [{ key: 'e', label: 'প্রত্যাগতি সহগ e', min: 0, max: 1, step: .01, value: .8, unit: '' }]]],
      presets: [['🏀 স্থিতিস্থাপক (e = 1)', { e: 1 }], ['🧲 জুড়ে যায় (e = 0)', { e: 0 }], ['🎱 স্থির লক্ষ্য', { u2: 0, m1: 3, m2: 3, e: 1 }], ['🚛 ভারী বনাম হালকা', { m1: 15, m2: 2, u1: 4, u2: -4 }]],
      calc: function (p) {
        var M = p.m1 + p.m2, v1 = ((p.m1 - p.e * p.m2) * p.u1 + (1 + p.e) * p.m2 * p.u2) / M, v2 = ((p.m2 - p.e * p.m1) * p.u2 + (1 + p.e) * p.m1 * p.u1) / M, will = p.u1 - p.u2 > .05, pb = p.m1 * p.u1 + p.m2 * p.u2, pa = p.m1 * v1 + p.m2 * v2, kb = .5 * p.m1 * p.u1 * p.u1 + .5 * p.m2 * p.u2 * p.u2, ka = .5 * p.m1 * v1 * v1 + .5 * p.m2 * v2 * v2, J = p.m1 * (v1 - p.u1), tc = will ? (12 - 2.2) / (p.u1 - p.u2) : 0;
        var kind = p.e >= .999 ? 'পূর্ণ স্থিতিস্থাপক' : (p.e <= .001 ? 'পূর্ণ অস্থিতিস্থাপক (জুড়ে যায়)' : 'আংশিক স্থিতিস্থাপক');
        return { a: 0, v1: v1, v2: v2, tc: tc, will: will, tmax: 0, stat: false, collision: true,
          status: will ? ['ok', '💥 ' + kind + ' সংঘর্ষ', 'সংঘর্ষের আগে-পরে ভরবেগ ' + fmt(pb, 2) + ' kg·m/s অপরিবর্তিত; গতিশক্তি হারায় ' + fmt(kb > 0 ? (kb - ka) / kb * 100 : 0, 1) + '%।'] : ['warn', '↔️ সংঘর্ষ হবে না', 'বাম গাড়ির বেগ ডান গাড়ির বেগের চেয়ে বেশি নয়, তাই দুটি গাড়ি কখনও মিলিত হবে না।'],
          rows: [['সংঘর্ষের পর v₁', fmt(v1, 2) + ' m/s', 'ok'], ['সংঘর্ষের পর v₂', fmt(v2, 2) + ' m/s', 'ok'], ['ভরবেগ (আগে)', fmt(pb, 2) + ' kg·m/s', ''], ['ভরবেগ (পরে)', fmt(pa, 2) + ' kg·m/s', 'gold'], ['গতিশক্তি (আগে)', fmt(kb, 2) + ' J', ''], ['গতিশক্তি (পরে)', fmt(ka, 2) + ' J', ''], ['গতিশক্তির ক্ষতি', fmt(kb - ka, 2) + ' J', kb - ka > .01 ? 'warn' : ''], ['ঘাত J = Δp', fmt(J, 2) + ' N·s', ''], ['ভরকেন্দ্রের বেগ', fmt(pb / M, 2) + ' m/s', ''], ['আপেক্ষিক বেগ (আগে→পরে)', fmt(p.u1 - p.u2, 2) + ' → ' + fmt(v2 - v1, 2) + ' m/s', '']],
          steps: ['ভরবেগের সংরক্ষণ: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂ = ' + fmt(pb, 2) + ' kg·m/s', 'প্রত্যাগতি সহগ: e = (v₂ − v₁)/(u₁ − u₂) = ' + fmt(p.e, 2), 'v₁ = [(m₁ − e m₂)u₁ + (1 + e)m₂u₂]/(m₁ + m₂) = <b>' + fmt(v1, 2) + ' m/s</b>', 'v₂ = [(m₂ − e m₁)u₂ + (1 + e)m₁u₁]/(m₁ + m₂) = <b>' + fmt(v2, 2) + ' m/s</b>'] };
      },
      draw: function (x, w, h, c, p) {
        bg(x, w, h, '#06121e', '#123550'); var gy = h - 78, K = w / 24, cx = w / 2, wc = 2.2, hit = c.will && s.t >= c.tc;
        x.fillStyle = '#1b3145'; x.fillRect(0, gy, w, h - gy); x.strokeStyle = '#6b8dab'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, gy); x.lineTo(w, gy); x.stroke();
        var x1 = -7 + p.u1 * s.t, x2 = 5 + p.u2 * s.t; if (hit) { var dt = s.t - c.tc, xc1 = -7 + p.u1 * c.tc, xc2 = 5 + p.u2 * c.tc; x1 = xc1 + c.v1 * dt; x2 = xc2 + c.v2 * dt; }
        var cs = [[x1, p.m1, '#34d399', 'm₁', hit ? c.v1 : p.u1], [x2, p.m2, '#f59e0b', 'm₂', hit ? c.v2 : p.u2]];
        cs.forEach(function (o) { var bw = wc * K, bh = 28 + Math.cbrt(o[1]) * 9, px = cx + o[0] * K; bx(x, px, gy - bh / 2 - 8, bw, bh, o[2], bw >= 56 ? o[3] + ' = ' + o[1] : o[3]); x.fillStyle = '#0b1623'; x.beginPath(); x.arc(px - bw / 3, gy - 4, 6, 0, TAU); x.arc(px + bw / 3, gy - 4, 6, 0, TAU); x.fill(); arrow(x, px, gy - bh - 20, px + clamp(o[4] * K * .38, -K * 6, K * 6), gy - bh - 20, o[2], 'v = ' + fmt(o[4], 1), 3.4); });
        if (hit && s.t - c.tc < .35) { x.fillStyle = 'rgba(251,191,36,' + (1 - (s.t - c.tc) / .35) + ')'; x.beginPath(); x.arc(cx + ((-7 + p.u1 * c.tc) + 1.1) * K, gy - 34, 26 + (s.t - c.tc) * 80, 0, TAU); x.fill(); }
        txt(x, 't = ' + fmt(s.t, 2) + ' s', 12, 22, 13, '#e2e8f0', 'left', '800'); txt(x, hit ? 'সংঘর্ষের পর' : 'সংঘর্ষের আগে', 12, 40, 12, hit ? '#fbbf24' : '#7dd3fc', 'left', '700'); txt(x, 'Σp = ' + fmt(p.m1 * (hit ? c.v1 : p.u1) + p.m2 * (hit ? c.v2 : p.u2), 2) + ' kg·m/s', 12, 58, 12, '#6ee7b7', 'left', '700');
      }
    }
  };

  function graph() {
    var x = gr.x, w = gr.w, h = gr.h, L = 52, R = w - 14, T = 36, B = h - 32, sc = SC[key], vals = [], tmax = 4;
    bg(x, w, h, '#071522', '#0d2335'); hist.forEach(function (q) { tmax = Math.max(tmax, q.t); vals.push(q.a, q.b); });
    var lo = Math.min.apply(null, vals.concat([0])), hi = Math.max.apply(null, vals.concat([1])); if (hi - lo < 1) hi = lo + 1; var pad = (hi - lo) * .12; lo -= pad; hi += pad;
    var X = function (t) { return L + t / tmax * (R - L); }, Y = function (v) { return B - (v - lo) / (hi - lo) * (B - T); };
    x.strokeStyle = 'rgba(125,170,205,.14)'; x.lineWidth = 1; x.beginPath(); for (var i = 0; i <= 4; i++) { var yy = T + i * (B - T) / 4; x.moveTo(L, yy); x.lineTo(R, yy); txt(x, fmt(hi - i * (hi - lo) / 4, 1), L - 6, yy + 4, 10, '#94a3b8', 'right'); } x.stroke();
    for (var j = 0; j <= 4; j++) txt(x, fmt(tmax * j / 4, 1), X(tmax * j / 4), B + 15, 10, '#94a3b8', 'center'); txt(x, 'সময় t (s) →', R, h - 6, 11, '#7dd3fc', 'right', '700');
    x.strokeStyle = 'rgba(148,184,214,.5)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(L, Y(0)); x.lineTo(R, Y(0)); x.stroke();
    [['a', '#38bdf8'], ['b', '#fbbf24']].forEach(function (sr, si) { x.strokeStyle = sr[1]; x.lineWidth = 2.8; x.beginPath(); hist.forEach(function (q, i) { var px = X(q.t), py = Y(q[sr[0]]); if (i) x.lineTo(px, py); else x.moveTo(px, py); }); x.stroke(); x.fillStyle = sr[1]; x.fillRect(L + si * 150, 10, 12, 4); txt(x, sc.gnames[si], L + 18 + si * 150, 16, 11, sr[1], 'left', '700'); if (hist.length) { var q = hist[hist.length - 1]; x.beginPath(); x.arc(X(q.t), Y(q[sr[0]]), 4.5, 0, TAU); x.fill(); } });
  }
  function reset() { s = { t: 0, x: 0, v: 0 }; hist = [{ t: 0, a: 0, b: 0 }]; wait = 0; acc = 0; if (C.collision) { var p = form.get(); hist = [{ t: 0, a: p.u1, b: p.u2 }]; } }
  function stepSim(dt) {
    var c = C, p = form.get(); dt *= speed;
    if (wait > 0) { wait -= dt; if (wait <= 0) reset(); return; }
    s.t += dt; acc += dt;
    if (c.collision) { var hit = c.will && s.t >= c.tc; s.v1 = hit ? c.v1 : p.u1; s.v2 = hit ? c.v2 : p.u2; if (acc >= .04) { acc = 0; hist.push({ t: s.t, a: s.v1, b: s.v2 }); } if (s.t > (c.will ? c.tc + 3 : 6)) wait = 1.2; return; }
    s.v += c.a * dt; s.x += s.v * dt;
    if (c.xEnd && Math.abs(s.x) >= c.xEnd) { s.x = Math.sign(s.x) * c.xEnd; s.v = s.v; wait = 1.4; }
    if (acc >= .04) { acc = 0; hist.push({ t: s.t, a: s.v, b: s.x }); }
    if (s.t > (c.tmax || 8)) wait = 1.2;
  }
  function drawAll() { var p = form.get(); SC[key].draw(st.x, st.w, st.h, C, p); graph(); }
  function update(first) {
    var p = form.get(), sc = SC[key]; C = sc.calc(p); var si = C.status;
    setStatus(ui.status, si[0], si[1], si[2]); setStats(ui.stats, C.rows); setSteps(ui.steps, '🧠 ধাপে ধাপে ব্যাখ্যা', C.steps);
    reset(); drawAll();
  }
  function build() {
    var sc = SC[key]; ui.form.innerHTML = ''; var holder = document.createElement('div'); ui.form.appendChild(holder);
    form = Form(holder, function () { update(); done && done(); });
    sc.groups.forEach(function (g) { form.group(g[0], g[1].map(function (d) { return Object.assign({}, d); })); });
    var env = form.group('🌍 পরিবেশ', []); form.select(env, 'গ্রহ / অভিকর্ষ g', PLANETS, function (v) { G = +v; update(); }, String(G));
    form.refresh();
    presetButtons(ui.presets, sc.presets.map(function (pr) { return [pr[0], function () { Object.keys(pr[1]).forEach(function (k) { form.set(k, pr[1][k]); }); update(); }]; }));
    tabs.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-k') === key); b.setAttribute('aria-pressed', b.getAttribute('data-k') === key ? 'true' : 'false'); });
    C = sc.calc(form.get()); update();
  }
  Object.keys(SC).forEach(function (k) { var b = document.createElement('button'); b.type = 'button'; b.className = 'pl74-tab'; b.setAttribute('data-k', k); b.innerHTML = '<span>' + ['১','২','৩','৪','৫','৬'][Object.keys(SC).indexOf(k)] + '</span><b>' + SC[k].name + '</b>'; b.addEventListener('click', function () { key = k; build(); done && done(); }); tabs.appendChild(b); });
  var bp = document.createElement('button'); bp.type = 'button'; bp.className = 'pl74-chip'; bp.textContent = 'থামান';
  bp.addEventListener('click', function () { paused = !paused; bp.textContent = paused ? 'চালু করুন' : 'থামান'; });
  var br = document.createElement('button'); br.type = 'button'; br.className = 'pl74-chip'; br.textContent = 'শুরু থেকে'; br.addEventListener('click', function () { reset(); drawAll(); });
  var sl = document.createElement('label'); sl.className = 'pl74-speed'; sl.innerHTML = '<span>গতি</span><select><option value="0.25">০.২৫×</option><option value="0.5">০.৫×</option><option value="1" selected>১×</option><option value="2">২×</option></select>';
  sl.querySelector('select').addEventListener('change', function (e) { speed = +e.target.value; });
  ctl.appendChild(bp); ctl.appendChild(br); ctl.appendChild(sl);
  loop(root, function (dt) { if (!paused) { stepSim(dt); drawAll(); } });
  build();
};

/* ================= ARCADE: hands-on educational "Tuner Lab" games ================= */
var MODELS = {};
function gcd(a, b) { return b ? gcd(b, a % b) : a; }
function pot(r, x, y, w, h, col) { x.fillStyle = col; rr(x, r[0], r[1], w, h, 6); x.fill(); }

/* pendulum clock */
MODELS.pendulum = {
  ctl: function () { return [{ key: 'L', label: 'সুতার দৈর্ঘ্য L', min: .1, max: 6, step: .01, value: 4.5, unit: 'm' }]; },
  read: function (v, r) { var T = TAU * Math.sqrt(v.L / r.g); return 'T = ' + fmt(T, 2) + ' s (লক্ষ্য ' + fmt(r.T, 2) + ' s)'; },
  eval: function (v, r) { var T = TAU * Math.sqrt(v.L / r.g), ok = Math.abs(T - r.T) <= .04 * r.T; return { ok: ok, text: ok ? 'দোলনকাল লক্ষ্যের সাথে মিলেছে।' : (T > r.T ? 'দোলনকাল বেশি; সুতা ছোট করো।' : 'দোলনকাল কম; সুতা লম্বা করো।') }; },
  draw: function (x, w, h, v, r, t) {
    bg(x, w, h, '#06121e', '#123550'); var T = TAU * Math.sqrt(v.L / r.g), px = w * .35, py = 24, len = Math.min(h - 70, v.L * 44 + 20), ang = .45 * Math.cos(TAU * t / T);
    x.fillStyle = '#475569'; x.fillRect(px - 50, 14, 100, 10); x.strokeStyle = '#e2e8f0'; x.lineWidth = 2.5; var bx = px + Math.sin(ang) * len, by = py + Math.cos(ang) * len;
    x.beginPath(); x.moveTo(px, py); x.lineTo(bx, by); x.stroke(); x.fillStyle = '#fbbf24'; x.beginPath(); x.arc(bx, by, 14, 0, TAU); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 1.5; x.stroke();
    var tx = w * .62, tw = w * .32, ty = h * .35; txt(x, 'লক্ষ্য ছন্দ (মেট্রোনোম)', tx + tw / 2, ty - 22, 12, '#7dd3fc', 'center', '700');
    x.strokeStyle = 'rgba(148,184,214,.5)'; x.lineWidth = 3; x.beginPath(); x.moveTo(tx, ty); x.lineTo(tx + tw, ty); x.stroke(); x.fillStyle = '#34d399'; x.beginPath(); x.arc(tx + tw / 2 + Math.sin(TAU * t / r.T) * tw / 2, ty, 9, 0, TAU); x.fill();
    txt(x, 'তোমার দোলক', tx + tw / 2, ty + 48, 12, '#fbbf24', 'center', '700'); x.strokeStyle = 'rgba(148,184,214,.5)'; x.beginPath(); x.moveTo(tx, ty + 70); x.lineTo(tx + tw, ty + 70); x.stroke(); x.fillStyle = '#fbbf24'; x.beginPath(); x.arc(tx + tw / 2 + Math.sin(TAU * t / T) * tw / 2, ty + 70, 9, 0, TAU); x.fill();
    txt(x, 'g = ' + fmt(r.g, 2) + ' m/s²', w - 12, 22, 12, '#94a3b8', 'right', '700');
  }
};
/* wave tuner */
MODELS.wave = {
  ctl: function () { return [{ key: 'A', label: 'বিস্তার A', min: .5, max: 3, step: .1, value: 1, unit: '' }, { key: 'f', label: 'কম্পাঙ্ক (চিত্রে চক্র সংখ্যা)', min: 1, max: 6, step: .1, value: 1, unit: '' }, { key: 'ph', label: 'দশা φ', min: 0, max: 6.3, step: .1, value: 0, unit: 'rad' }]; },
  read: function (v) { return 'y = ' + fmt(v.A, 1) + ' sin(' + fmt(v.f, 1) + '·x + ' + fmt(v.ph, 1) + ')'; },
  eval: function (v, r) { var dA = Math.abs(v.A - r.A) <= .15, df = Math.abs(v.f - r.f) <= .15, dp = Math.abs(((v.ph - r.ph + 9.4248) % 6.2832) - 3.1416) >= 3.1416 - .25 && true; var d2 = Math.min(Math.abs(v.ph - r.ph), 6.2832 - Math.abs(v.ph - r.ph)) <= .25, ok = dA && df && d2; return { ok: ok, text: ok ? 'তরঙ্গ পুরোপুরি মিলেছে।' : 'মিলছে না: ' + [dA ? '' : 'বিস্তার', df ? '' : 'কম্পাঙ্ক', d2 ? '' : 'দশা'].filter(Boolean).join(', ') + ' ঠিক করো।' }; },
  draw: function (x, w, h, v, r, t) {
    bg(x, w, h, '#06121e', '#0e2a40'); grid(x, w, h, 30); var cy = h / 2, k = 36; x.strokeStyle = 'rgba(148,184,214,.4)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(0, cy); x.lineTo(w, cy); x.stroke();
    function curve(A, f, ph, col, dash) { x.strokeStyle = col; x.lineWidth = 3; x.setLineDash(dash || []); x.beginPath(); for (var i = 0; i <= w; i += 3) { var y = cy - A * k * Math.sin(f * (i / w) * TAU + ph); if (i) x.lineTo(i, y); else x.moveTo(i, y); } x.stroke(); x.setLineDash([]); }
    curve(r.A, r.f, r.ph, '#fbbf24', [9, 7]); curve(v.A, v.f, v.ph, '#38bdf8'); txt(x, 'লক্ষ্য', 12, 22, 12, '#fbbf24', 'left', '800'); txt(x, 'তোমার তরঙ্গ', 70, 22, 12, '#38bdf8', 'left', '800');
  }
};
/* straight line through two points */
MODELS.line = {
  ctl: function () { return [{ key: 'm', label: 'ঢাল m', min: -4, max: 4, step: .05, value: 0, unit: '' }, { key: 'c', label: 'y-ছেদক c', min: -5, max: 5, step: .05, value: 0, unit: '' }]; },
  read: function (v) { return 'y = ' + fmt(v.m, 2) + 'x ' + (v.c < 0 ? '− ' : '+ ') + fmt(Math.abs(v.c), 2); },
  eval: function (v, r) { var mt = (r.p2[1] - r.p1[1]) / (r.p2[0] - r.p1[0]), ct = r.p1[1] - mt * r.p1[0], om = Math.abs(v.m - mt) <= .1, oc = Math.abs(v.c - ct) <= .2; return { ok: om && oc, text: om && oc ? 'রেখাটি দুটি বিন্দু দিয়েই যাচ্ছে।' : (om ? 'ঢাল ঠিক; এবার y-ছেদক c ঠিক করো।' : 'ঢাল m = (y₂ − y₁)/(x₂ − x₁) দিয়ে হিসাব করো।') }; },
  draw: function (x, w, h, v, r) {
    bg(x, w, h, '#06121e', '#0e2a40'); var S = Math.min(w, h) / 12, ox = w / 2, oy = h / 2; x.strokeStyle = 'rgba(125,170,205,.14)'; x.lineWidth = 1; x.beginPath(); for (var i = -10; i <= 10; i++) { x.moveTo(ox + i * S, 0); x.lineTo(ox + i * S, h); x.moveTo(0, oy + i * S); x.lineTo(w, oy + i * S); } x.stroke();
    x.strokeStyle = 'rgba(203,213,225,.7)'; x.lineWidth = 1.8; x.beginPath(); x.moveTo(0, oy); x.lineTo(w, oy); x.moveTo(ox, 0); x.lineTo(ox, h); x.stroke();
    var L = (w / 2) / S; x.strokeStyle = '#38bdf8'; x.lineWidth = 3; x.beginPath(); x.moveTo(ox - L * S, oy - (v.m * -L + v.c) * S); x.lineTo(ox + L * S, oy - (v.m * L + v.c) * S); x.stroke();
    [r.p1, r.p2].forEach(function (p, i) { x.fillStyle = '#fbbf24'; x.beginPath(); x.arc(ox + p[0] * S, oy - p[1] * S, 7, 0, TAU); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 2; x.stroke(); pill(x, 'P' + (i + 1) + '(' + p[0] + ', ' + p[1] + ')', ox + p[0] * S + 8, oy - p[1] * S - 12, '#fbbf24', 11); });
  }
};
/* Newton's 2nd law with friction */
MODELS.force = {
  ctl: function () { return [{ key: 'F', label: 'প্রয়োগ বল F', min: 0, max: 400, step: 1, value: 0, unit: 'N', dec: 0 }]; },
  acc: function (v, r) { var fk = r.mu * r.m * r.g; return v.F > fk ? (v.F - fk) / r.m : 0; },
  read: function (v, r) { return 'a = ' + fmt(this.acc(v, r), 2) + ' m/s² (লক্ষ্য ' + fmt(r.a, 2) + ')'; },
  eval: function (v, r) { var a = this.acc(v, r), ok = Math.abs(a - r.a) <= Math.max(.1, .06 * r.a); return { ok: ok, text: ok ? 'ত্বরণ লক্ষ্যের সাথে মিলেছে।' : (a < r.a ? 'বল আরও বাড়াও (ঘর্ষণ ' + fmt(r.mu * r.m * r.g, 1) + ' N পেরোতে হবে)।' : 'ত্বরণ বেশি; বল কমাও।') }; },
  draw: function (x, w, h, v, r, t) {
    bg(x, w, h, '#06121e', '#123550'); var gy = h - 70, a = this.acc(v, r), off = -(.5 * a * (t % 4) * (t % 4) * 40) % 70; x.fillStyle = '#1b3145'; x.fillRect(0, gy, w, h - gy); x.strokeStyle = '#6b8dab'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, gy); x.lineTo(w, gy); x.stroke();
    x.strokeStyle = 'rgba(148,184,214,.35)'; x.lineWidth = 2; for (var i = -1; i < w / 70 + 1; i++) { x.beginPath(); x.moveTo(i * 70 + off, gy + 12); x.lineTo(i * 70 + off + 26, gy + 12); x.stroke(); }
    var bw = 52 + Math.cbrt(r.m) * 6, cx = w * .4, cy = gy - bw * .4, k = 60 / (r.m * r.g); bx(x, cx, cy, bw, bw * .8, '#38bdf8', r.m + ' kg');
    if (v.F > .5) arrow(x, cx + bw / 2, cy, cx + bw / 2 + clamp(k * v.F, 10, 220), cy, '#f472b6', 'F', 3.4); var fk = Math.min(v.F, r.mu * r.m * r.g); if (fk > .5) arrow(x, cx - bw / 2, gy - 4, cx - bw / 2 - clamp(k * fk, 8, 150), gy - 4, '#a78bfa', 'f', 3);
    txt(x, 'ঘর্ষণ μ = ' + r.mu + '   g = ' + fmt(r.g, 2), 12, 22, 13, '#e2e8f0', 'left', '700'); txt(x, 'লক্ষ্য ত্বরণ: ' + fmt(r.a, 2) + ' m/s²', 12, 42, 13, '#fbbf24', 'left', '800');
  }
};
function bx(x, cx, cy, w, h, col, label) { x.fillStyle = col; rr(x, cx - w / 2, cy - h / 2, w, h, 6); x.fill(); x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 1.5; x.stroke(); if (label) txt(x, label, cx, cy + 4, 12, '#06121e', 'center', '800'); }
/* elevator scale */
MODELS.lift = {
  ctl: function () { return [{ key: 'ae', label: 'লিফটের ত্বরণ (↑ ধনাত্মক)', min: -12, max: 12, step: .1, value: 0, unit: 'm/s²', dec: 1 }]; },
  read: function (v, r) { return 'কাঁটার পাঠ = ' + fmt(Math.max(0, r.m * (r.g + v.ae)), 0) + ' N (লক্ষ্য ' + fmt(r.N, 0) + ' N)'; },
  eval: function (v, r) { var N = Math.max(0, r.m * (r.g + v.ae)), ok = Math.abs(N - r.N) <= .03 * r.N + 1.5; return { ok: ok, text: ok ? 'কাঁটার পাঠ মিলেছে।' : (N < r.N ? 'পাঠ কম; ত্বরণ আরও ঊর্ধ্বমুখী করো (N = m(g + a))।' : 'পাঠ বেশি; ত্বরণ কমাও।') }; },
  draw: function (x, w, h, v, r, t) {
    bg(x, w, h, '#06121e', '#0e2a40'); var N = Math.max(0, r.m * (r.g + v.ae)), cx = w / 2, bob = Math.sin(t * 6) * (v.ae > .1 ? 2 : 0);
    x.fillStyle = 'rgba(30,64,96,.55)'; rr(x, cx - 90, 20, 180, h - 40, 10); x.fill(); x.strokeStyle = '#7dd3fc'; x.lineWidth = 3; x.stroke(); var fy = h - 74, fl = N <= .5, py = fl ? -30 : 0;
    x.fillStyle = '#334155'; rr(x, cx - 46, fy, 92, 14, 5); x.fill(); x.fillStyle = '#f59e0b'; x.fillRect(cx - 14, fy - 66 + py + bob, 28, 44); x.fillStyle = '#fde68a'; x.beginPath(); x.arc(cx, fy - 80 + py + bob, 13, 0, TAU); x.fill();
    pill(x, fmt(N, 0) + ' N', cx, fy + 36, N <= .5 ? '#fb7185' : '#34d399', 14); pill(x, 'লক্ষ্য ' + fmt(r.N, 0) + ' N', cx, 20, '#fbbf24', 13);
    if (Math.abs(v.ae) > .1) arrow(x, cx + 120, h / 2, cx + 120, h / 2 - clamp(v.ae * 7, -80, 80), '#f472b6', 'a', 3.4); txt(x, 'ভর ' + r.m + ' kg, g = ' + fmt(r.g, 2), 12, 22, 12, '#94a3b8', 'left', '700');
  }
};
/* momentum match */
MODELS.momentum = {
  ctl: function () { return [{ key: 'u1', label: 'গাড়ি ১-এর প্রাথমিক বেগ u₁', min: -10, max: 20, step: .1, value: 0, unit: 'm/s', dec: 1 }]; },
  fin: function (v, r) { var M = r.m1 + r.m2; return [((r.m1 - r.e * r.m2) * v.u1 + (1 + r.e) * r.m2 * r.u2) / M, ((r.m2 - r.e * r.m1) * r.u2 + (1 + r.e) * r.m1 * v.u1) / M]; },
  read: function (v, r) { var f = this.fin(v, r); return 'v₂′ = ' + fmt(f[1], 2) + ' m/s (লক্ষ্য ' + fmt(r.v2, 2) + ')'; },
  eval: function (v, r) { var f = this.fin(v, r), ok = Math.abs(f[1] - r.v2) <= .15; return { ok: ok, text: ok ? 'গাড়ি ২ লক্ষ্য বেগ পেয়েছে।' : (f[1] < r.v2 ? 'গাড়ি ২ ধীর; u₁ বাড়াও।' : 'গাড়ি ২ দ্রুত; u₁ কমাও।') }; },
  draw: function (x, w, h, v, r, t) {
    bg(x, w, h, '#06121e', '#123550'); var gy = h - 74, f = this.fin(v, r), cyc = (t % 5) / 5, pre = cyc < .5, K = w / 26, mid = w / 2;
    x.fillStyle = '#1b3145'; x.fillRect(0, gy, w, h - gy); var p = pre ? cyc / .5 : (cyc - .5) / .5, u = pre ? [v.u1, r.u2] : f; var x1 = mid + (pre ? -9 + (v.u1 > 0 ? p * 8 : 0) : -1.1 + f[0] * p * 1.6) * K, x2 = mid + (pre ? 9 - 8 * p + 0 : 1.1 + f[1] * p * 1.6) * K;
    if (pre) { x1 = mid - 1.1 * K - (1 - p) * 8 * K; x2 = mid + 1.1 * K + (1 - p) * 8 * K; }
    [[x1, r.m1, '#34d399', 'm₁', u[0]], [x2, r.m2, '#f59e0b', 'm₂', u[1]]].forEach(function (o) { var bh = 26 + Math.cbrt(o[1]) * 9; bx(x, o[0], gy - bh / 2 - 6, 2.2 * K, bh, o[2], o[3]); arrow(x, o[0], gy - bh - 18, o[0] + clamp(o[4] * K * .5, -K * 6, K * 6), gy - bh - 18, o[2], fmt(o[4], 1), 3); });
    txt(x, pre ? 'সংঘর্ষের আগে' : 'সংঘর্ষের পরে', 12, 22, 13, pre ? '#7dd3fc' : '#fbbf24', 'left', '800'); txt(x, 'm₁ = ' + r.m1 + ', m₂ = ' + r.m2 + ', u₂ = ' + r.u2 + ', e = ' + r.e, 12, 42, 12, '#94a3b8', 'left', '700'); txt(x, 'লক্ষ্য: v₂′ = ' + r.v2 + ' m/s', w - 12, 22, 13, '#fbbf24', 'right', '800');
  }
};
/* banking racer */
MODELS.banking = {
  ctl: function () { return [{ key: 'v', label: 'গাড়ির বেগ v', min: 5, max: 300, step: 1, value: 190, unit: 'km/h', dec: 0 }]; },
  b: function (v, r) { return bankPhys(v.v / 3.6, r.R, r.th, r.mu, r.g || 9.81); },
  read: function (v, r) { var b = this.b(v, r); return 'নিরাপদ সীমা ' + fmt(kmh(b.vmin), 0) + ' – ' + (isFinite(b.vmax) ? fmt(kmh(b.vmax), 0) : '∞') + ' km/h | ঘর্ষণ ব্যবহার ' + fmt(Math.min(b.util, 9) * 100, 0) + '%'; },
  eval: function (v, r) {
    var b = this.b(v, r), vm = kmh(b.vmax), v0 = kmh(b.v0), ok, msg;
    if (r.goal === 'ideal') { ok = Math.abs(v.v - v0) <= Math.max(2, .05 * v0); msg = ok ? 'আদর্শ বেগ ধরা পড়েছে: v₀ = √(rg tanθ)।' : 'ঘর্ষণ না লাগার বেগ v₀ = √(rg tanθ) বের করো।'; }
    else if (r.goal === 'max') { ok = Math.abs(v.v - vm) <= Math.max(2, .04 * vm) && b.util <= 1.001; msg = ok ? 'সর্বোচ্চ নিরাপদ বেগের কাছাকাছি, তবু গাড়ি নিরাপদ।' : 'সর্বোচ্চ বেগ vmax = √[rg(tanθ+μ)/(1−μ tanθ)]-এর খুব কাছে যাও, কিন্তু পার হয়ো না।'; }
    else { ok = b.util <= 1; msg = ok ? 'গাড়ি নিরাপদে বাঁক নিয়েছে।' : (b.f > 0 ? 'বাইরের দিকে স্কিড! বেগ কমাও।' : 'ভেতরে পিছলে নামছে! বেগ বাড়াও।'); }
    return { ok: ok, text: msg };
  },
  draw: function (x, w, h, v, r, t) {
    bg(x, w, h, '#06121e', '#123550'); var b = this.b(v, r), th = r.th * D2R, px = w * .5, py = h - 86, bad = b.util > 1;
    x.save(); x.translate(px, py); x.rotate(-th); x.fillStyle = '#243b50'; x.fillRect(-700, 0, 1400, 70); x.strokeStyle = '#6b8dab'; x.lineWidth = 3; x.beginPath(); x.moveTo(-700, 0); x.lineTo(700, 0); x.stroke();
    x.fillStyle = '#0b1623'; x.beginPath(); x.arc(-38, -11, 11, 0, TAU); x.arc(38, -11, 11, 0, TAU); x.fill(); x.fillStyle = bad ? '#f43f5e' : '#38bdf8'; rr(x, -50, -46, 100, 30, 8); x.fill(); x.fillStyle = bad ? '#be123c' : '#0ea5e9'; rr(x, -36, -70, 72, 28, 8); x.fill(); x.restore();
    var vm = kmh(b.vmax), vn = kmh(b.vmin), top = Math.max(60, Math.min(320, (isFinite(vm) ? vm : v.v) * 1.3)), L = 24, R = w - 24, gy = 34, X = function (q) { return L + clamp(q, 0, top) / top * (R - L); };
    x.fillStyle = 'rgba(245,158,11,.5)'; x.fillRect(X(0), gy, X(vn) - X(0), 14); x.fillStyle = 'rgba(52,211,153,.75)'; x.fillRect(X(vn), gy, X(Math.min(vm, top)) - X(vn), 14); if (isFinite(vm) && vm < top) { x.fillStyle = 'rgba(244,63,94,.7)'; x.fillRect(X(vm), gy, X(top) - X(vm), 14); }
    x.fillStyle = '#fff'; x.fillRect(X(v.v) - 2, gy - 6, 4, 26); pill(x, fmt(v.v, 0) + ' km/h', clamp(X(v.v), 44, w - 44), 22, bad ? '#fb7185' : '#34d399', 12);
    txt(x, 'r = ' + r.R + ' m, θ = ' + r.th + '°, μ = ' + r.mu + (r.g && r.g !== 9.81 ? ', g = ' + r.g : ''), 12, h - 12, 12, '#94a3b8', 'left', '700');
  }
};
/* chemical equation balancer */
MODELS.equation = {
  ctl: function (r) { return r.L.concat(r.R).map(function (s, i) { return { key: 'k' + i, label: s.f + '-এর সহগ', min: 1, max: 9, step: 1, value: 1, unit: '', dec: 0 }; }); },
  counts: function (v, r) { var L = {}, R = {}; r.L.forEach(function (s, i) { for (var e in s.a) L[e] = (L[e] || 0) + s.a[e] * v['k' + i]; }); r.R.forEach(function (s, i) { for (var e in s.a) R[e] = (R[e] || 0) + s.a[e] * v['k' + (r.L.length + i)]; }); return [L, R]; },
  coefs: function (v, r) { return r.L.concat(r.R).map(function (s, i) { return v['k' + i]; }); },
  read: function (v, r) { var c = this.counts(v, r); return Object.keys(c[0]).map(function (e) { return e + ': ' + (c[0][e] || 0) + '|' + (c[1][e] || 0); }).join('   '); },
  eval: function (v, r) { var c = this.counts(v, r), els = Object.keys(c[0]), bal = els.every(function (e) { return c[0][e] === c[1][e]; }), cs = this.coefs(v, r), g = cs.reduce(gcd); return { ok: bal && g === 1, text: bal ? (g === 1 ? 'সমীকরণ সুসম এবং সরলতম অনুপাতে আছে।' : 'সুসম হয়েছে, তবে সহগগুলো আরও সরল করো (গসাগু = 1)।') : 'এখনও পরমাণুর সংখ্যা মেলেনি; লাল মৌল দেখো।' }; },
  draw: function (x, w, h, v, r) {
    bg(x, w, h, '#06121e', '#0e2a40'); var c = this.counts(v, r), cs = this.coefs(v, r), parts = [], n = 0; r.L.forEach(function (s) { parts.push(cs[n++] + ' ' + s.f); }); var left = parts.join(' + '); parts = []; r.R.forEach(function (s) { parts.push(cs[n++] + ' ' + s.f); });
    txt(x, left + '  →  ' + parts.join(' + '), w / 2, 40, Math.min(22, w / 22), '#e2e8f0', 'center', '800'); var els = Object.keys(c[0]), bw = Math.min(150, (w - 40) / els.length - 14), y0 = 70;
    els.forEach(function (e, i) { var l = c[0][e] || 0, rr2 = c[1][e] || 0, ok = l === rr2, X0 = 20 + i * (bw + 14), mx = Math.max(l, rr2, 6), H = h - y0 - 40; txt(x, e, X0 + bw / 2, y0 + 8, 16, ok ? '#34d399' : '#fb7185', 'center', '900');
      [[l, '#38bdf8', 0], [rr2, '#fbbf24', 1]].forEach(function (b) { var bh = b[0] / mx * (H - 30); x.fillStyle = ok ? b[1] : '#f43f5e'; x.globalAlpha = .85; rr(x, X0 + 6 + b[2] * (bw / 2), y0 + H - bh + 6, bw / 2 - 10, Math.max(3, bh), 5); x.fill(); x.globalAlpha = 1; txt(x, String(b[0]), X0 + 6 + b[2] * (bw / 2) + (bw / 2 - 10) / 2, y0 + H - bh, 13, '#e2e8f0', 'center', '800'); }); });
    txt(x, 'বাম (বিক্রিয়ক)', 14, h - 10, 11, '#38bdf8', 'left', '800'); txt(x, 'ডান (উৎপাদ)', 120, h - 10, 11, '#fbbf24', 'left', '800');
  }
};
/* vector treasure walk */
MODELS.vector = {
  ctl: function () { return [{ key: 'm1', label: 'প্রথম ধাপের দূরত্ব', min: 0, max: 10, step: .1, value: 3, unit: 'একক' }, { key: 'a1', label: 'প্রথম ধাপের কোণ (x-অক্ষ থেকে)', min: 0, max: 360, step: 1, value: 0, unit: '°', dec: 0 }, { key: 'm2', label: 'দ্বিতীয় ধাপের দূরত্ব', min: 0, max: 10, step: .1, value: 3, unit: 'একক' }, { key: 'a2', label: 'দ্বিতীয় ধাপের কোণ', min: 0, max: 360, step: 1, value: 90, unit: '°', dec: 0 }]; },
  pos: function (v) { var a1 = v.a1 * D2R, a2 = v.a2 * D2R, p1 = [v.m1 * Math.cos(a1), v.m1 * Math.sin(a1)]; return [p1, [p1[0] + v.m2 * Math.cos(a2), p1[1] + v.m2 * Math.sin(a2)]]; },
  read: function (v) { var p = this.pos(v)[1]; return 'লব্ধি = (' + fmt(p[0], 1) + ', ' + fmt(p[1], 1) + '), |R| = ' + fmt(Math.hypot(p[0], p[1]), 1); },
  eval: function (v, r) { var p = this.pos(v)[1], d = Math.hypot(p[0] - r.tx, p[1] - r.ty); return { ok: d <= (r.tol || .6), text: d <= (r.tol || .6) ? 'গুপ্তধন পেয়েছ! দুটি ভেক্টরের যোগফলই লব্ধি।' : 'গুপ্তধন থেকে ' + fmt(d, 1) + ' একক দূরে; Rₓ = A cosθ₁ + B cosθ₂, Rᵧ = A sinθ₁ + B sinθ₂।' }; },
  draw: function (x, w, h, v, r) {
    bg(x, w, h, '#06121e', '#0e2a40'); var S = Math.min(w, h) / 22, ox = w / 2, oy = h / 2, P = this.pos(v); x.strokeStyle = 'rgba(125,170,205,.14)'; x.lineWidth = 1; x.beginPath(); for (var i = -12; i <= 12; i++) { x.moveTo(ox + i * S, 0); x.lineTo(ox + i * S, h); x.moveTo(0, oy + i * S); x.lineTo(w, oy + i * S); } x.stroke();
    x.strokeStyle = 'rgba(203,213,225,.6)'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(0, oy); x.lineTo(w, oy); x.moveTo(ox, 0); x.lineTo(ox, h); x.stroke();
    var X = function (q) { return ox + q * S; }, Y = function (q) { return oy - q * S; };
    arrow(x, X(0), Y(0), X(P[0][0]), Y(P[0][1]), '#34d399', 'A', 3); arrow(x, X(P[0][0]), Y(P[0][1]), X(P[1][0]), Y(P[1][1]), '#f59e0b', 'B', 3); x.setLineDash([6, 6]); x.strokeStyle = '#38bdf8'; x.lineWidth = 2; x.beginPath(); x.moveTo(X(0), Y(0)); x.lineTo(X(P[1][0]), Y(P[1][1])); x.stroke(); x.setLineDash([]);
    x.fillStyle = '#fbbf24'; x.beginPath(); x.arc(X(r.tx), Y(r.ty), 10, 0, TAU); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 2; x.stroke(); pill(x, 'গুপ্তধন (' + r.tx + ', ' + r.ty + ')', clamp(X(r.tx), 70, w - 70), Y(r.ty) - 18, '#fbbf24', 11);
    x.fillStyle = '#e2e8f0'; x.beginPath(); x.arc(ox, oy, 5, 0, TAU); x.fill();
  }
};
/* resistor combination */
var RCFG = { s: 'তিনটিই শ্রেণি (R₁ + R₂ + R₃)', p: 'তিনটিই সমান্তরাল', a: 'R₁ + (R₂ ‖ R₃)', b: 'R₁ ‖ (R₂ + R₃)', c: 'R₃ + (R₁ ‖ R₂)', d: '(R₁ + R₂) ‖ R₃' };
function par(a, b) { return a * b / (a + b); }
MODELS.resistor = {
  ctl: function () { return []; }, sel: { key: 'cfg', label: 'সংযোগের ধরন', opts: Object.keys(RCFG).map(function (k) { return [k, RCFG[k]]; }), value: 's' },
  req: function (v, r) { var R = r.R, a = R[0], b = R[1], c = R[2]; return { s: a + b + c, p: 1 / (1 / a + 1 / b + 1 / c), a: a + par(b, c), b: par(a, b + c), c: c + par(a, b), d: par(a + b, c) }[v.cfg]; },
  read: function (v, r) { return 'Rₑq = ' + fmt(this.req(v, r), 2) + ' Ω (লক্ষ্য ' + fmt(r.target, 2) + ' Ω)'; },
  eval: function (v, r) { var q = this.req(v, r), ok = Math.abs(q - r.target) <= .02 * r.target + .01; return { ok: ok, text: ok ? 'সংযোগ মিলেছে। শ্রেণিতে যোগ, সমান্তরালে ব্যস্তের যোগ।' : 'এই সংযোগে Rₑq = ' + fmt(q, 2) + ' Ω; অন্য সংযোগ চেষ্টা করো।' }; },
  draw: function (x, w, h, v, r) {
    bg(x, w, h, '#06121e', '#0e2a40'); var q = this.req(v, r), cy = h / 2 - 8, bwid = 64, bh = 30;
    function res(px, py, n) { x.fillStyle = '#fbbf24'; rr(x, px - bwid / 2, py - bh / 2, bwid, bh, 6); x.fill(); txt(x, 'R' + ['₁', '₂', '₃'][n] + '=' + r.R[n], px, py + 4, 12, '#06121e', 'center', '800'); }
    function wire(a, b, c, d) { x.strokeStyle = '#7dd3fc'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); }
    var L = 30, R = w - 30, m = w / 2, g = 52, cf = v.cfg; wire(L, cy, L + 14, cy);
    if (cf === 's') { [0, 1, 2].forEach(function (i) { res(L + 80 + i * (bwid + 26) + (w > 500 ? 70 : 0), cy, i); }); wire(L, cy, R, cy); x.fillStyle = 'rgba(6,18,30,.0)'; [0, 1, 2].forEach(function (i) { res(L + 80 + i * (bwid + 26) + (w > 500 ? 70 : 0), cy, i); }); }
    else if (cf === 'p') { wire(m - 70, cy - g, m - 70, cy + g); wire(m + 70, cy - g, m + 70, cy + g); wire(L, cy, m - 70, cy); wire(m + 70, cy, R, cy); [-1, 0, 1].forEach(function (k, i) { wire(m - 70, cy + k * g, m + 70, cy + k * g); res(m, cy + k * g, i); }); }
    else { var seriesFirst = cf === 'a' || cf === 'c', single = cf === 'a' ? 0 : (cf === 'c' ? 2 : null); if (cf === 'a' || cf === 'c') { var s0 = cf === 'a' ? 0 : 2, p0 = cf === 'a' ? [1, 2] : [0, 1]; wire(L, cy, m - 120, cy); res(m - 120 + 0, cy, s0); wire(m - 88, cy, m - 30, cy); wire(m - 30, cy - g * .6, m - 30, cy + g * .6); wire(m + 90, cy - g * .6, m + 90, cy + g * .6); wire(m + 90, cy, R, cy); [-1, 1].forEach(function (k, i) { wire(m - 30, cy + k * g * .6, m + 90, cy + k * g * .6); res(m + 30, cy + k * g * .6, p0[i]); }); }
      else { wire(L, cy, m - 60, cy); wire(m - 60, cy - g * .6, m - 60, cy + g * .6); wire(m + 120, cy - g * .6, m + 120, cy + g * .6); wire(m + 120, cy, R, cy); if (cf === 'b') { wire(m - 60, cy - g * .6, m + 120, cy - g * .6); res(m + 30, cy - g * .6, 0); wire(m - 60, cy + g * .6, m + 120, cy + g * .6); res(m - 5, cy + g * .6, 1); res(m + 65, cy + g * .6, 2); } else { wire(m - 60, cy - g * .6, m + 120, cy - g * .6); res(m - 5, cy - g * .6, 0); res(m + 65, cy - g * .6, 1); wire(m - 60, cy + g * .6, m + 120, cy + g * .6); res(m + 30, cy + g * .6, 2); } } }
    pill(x, 'Rₑq = ' + fmt(q, 2) + ' Ω', w / 2, h - 16, Math.abs(q - r.target) <= .02 * r.target + .01 ? '#34d399' : '#fbbf24', 14); pill(x, 'লক্ষ্য ' + fmt(r.target, 2) + ' Ω', w / 2, 22, '#fbbf24', 13);
  }
};

window.CL_GAMES = window.CL_GAMES || {};
window.CL_GAMES.tunerLab = function (root, game, A) {
  var d = game.data || {}, M = MODELS[d.model], rounds = Array.isArray(d.rounds) ? d.rounds : [];
  if (!M || !rounds.length) { root.innerHTML = '<div class="card">এই গেমের মিশন প্রস্তুত নয়।</div>'; return; }
  var E = A.E || function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var idx = 0, score = 0, solved = 0, tries = 0, hinted = false, lp = null, form = null, cv = null, cfg = null, t0 = 0, locked = false;
  function vals() { var v = form ? form.get() : {}; if (M.sel && cfg) v[M.sel.key] = cfg.value; return v; }
  function render() {
    if (lp) lp.stop(); locked = false; tries = 0; hinted = false; var r = rounds[idx];
    root.innerHTML = '<section class="pl74 tl74"><header class="tl74-head"><div><span class="pl74-badge">CONCEPTLAB · হাতে-কলমে ল্যাব</span><h2>' + E(game.t || 'Lab') + '</h2><p>' + E(game.d || '') + '</p></div><div class="tl74-score"><small>ধাপ</small><b>' + (idx + 1) + ' / ' + rounds.length + '</b><small>' + score + ' পয়েন্ট</small></div></header><div class="tl74-bar"><i style="width:' + Math.round(idx / rounds.length * 100) + '%"></i></div><div class="tl74-q">' + E(r.q) + '</div><div class="tl74-stage"></div><div class="tl74-read" aria-live="polite"></div><div class="tl74-form"></div><div class="tl74-actions"><button type="button" class="pl74-chip tl74-go">যাচাই করো</button><button type="button" class="pl74-chip tl74-hint">ইঙ্গিত</button><button type="button" class="pl74-chip tl74-skip">এড়িয়ে যাও</button></div><div class="tl74-fb" aria-live="polite"></div></section>';
    var q = function (s) { return root.querySelector(s); }; cv = canvas(q('.tl74-stage'), 680, 300, 'c6', null);
    var cl = M.ctl(r); form = Form(q('.tl74-form'), function () { upd(); }); var sec = form.group('নিয়ন্ত্রণ', cl.map(function (c) { return Object.assign({}, c); })); if (M.sel) { cfg = form.select(sec, M.sel.label, M.sel.opts, function () { upd(); }, M.sel.value); } form.refresh();
    function upd() { q('.tl74-read').textContent = M.read(vals(), r); }
    q('.tl74-go').onclick = function () {
      if (locked) return; var res = M.eval(vals(), r); tries++; var fb = q('.tl74-fb');
      if (res.ok) { var pts = Math.max(40, 100 - (tries - 1) * 20 - (hinted ? 15 : 0)); score += pts; solved++; locked = true; fb.innerHTML = '<div class="tl74-ok"><b>✓ +' + pts + ' পয়েন্ট</b> ' + E(res.text) + ' ' + E(r.e || '') + '</div>' + nextBtn(); bind(); }
      else { fb.innerHTML = '<div class="tl74-bad">' + E(res.text) + ' (চেষ্টা ' + tries + ')</div>'; }
    };
    q('.tl74-hint').onclick = function () { hinted = true; q('.tl74-fb').innerHTML = '<div class="tl74-hintbox">💡 ' + E(r.h || 'নিয়ন্ত্রণ বদলে লাইভ ফলাফল ও চিত্র লক্ষ্য করো।') + '</div>'; };
    q('.tl74-skip').onclick = function () { if (locked) return; locked = true; q('.tl74-fb').innerHTML = '<div class="tl74-hintbox">এই ধাপে পয়েন্ট নেই। ' + E(r.e || '') + '</div>' + nextBtn(); bind(); };
    function nextBtn() { return '<button type="button" class="pl74-chip tl74-next">' + (idx + 1 >= rounds.length ? 'ফলাফল দেখো →' : 'পরের ধাপ →') + '</button>'; }
    function bind() { q('.tl74-next').onclick = function () { if (idx + 1 >= rounds.length) { if (lp) lp.stop(); A.done({ score: score, pct: solved / rounds.length, detail: solved + ' / ' + rounds.length + ' চ্যালেঞ্জ সম্পন্ন' }); } else { idx++; render(); } }; }
    upd(); t0 = 0; lp = loop(root, function (dt) { t0 += dt; M.draw(cv.x, cv.w, cv.h, vals(), r, t0); });
  }
  render();
};

/* ---- catalogue (chapter-wise in the Arcade tab) ---- */
(function () {
  function G(id, t, icon, subj, ch, diff, xp, d, model, rounds) { return { id: id, t: t, title: t, icon: icon, on: true, type: 'tunerLab', subjectKey: subj, chapterKeys: [ch], chapterKey: ch, diff: diff, xp: xp, d: d, data: { model: model, rounds: rounds } }; }
  var gm = [
    G('tl74-banking-racer', 'Banking Racer: Corner Master', '🏎️', 'physics', 'phy1-04', 'Medium', 80, 'ঢালু বাঁকের ব্যাসার্ধ, ঢাল ও ঘর্ষণ দেখে গাড়ির বেগ ঠিক করো এবং নিরাপদ সীমা চেনো।', 'banking', [
      { R: 80, th: 15, mu: .6, goal: 'safe', q: 'ব্যাসার্ধ ৮০ m, ঢাল ১৫°, μ = 0.6। এমন বেগ দাও যাতে গাড়ি নিরাপদে বাঁক নেয়।', h: 'গেজের সবুজ অঞ্চলের ভেতরে বেগ রাখো।', e: 'নিরাপদ সীমায় ঘর্ষণ ও লম্ব প্রতিক্রিয়া মিলে কেন্দ্রমুখী বল জোগায়।' },
      { R: 100, th: 20, mu: 0, goal: 'ideal', q: 'রাস্তায় ঘর্ষণ নেই (μ = 0)। যে বেগে ঘর্ষণ ছাড়াই বাঁক নেওয়া যায় সেই v₀ সেট করো।', h: 'v₀ = √(r g tanθ)। উত্তর m/s থেকে km/h করতে ৩.৬ দিয়ে গুণ করো।', e: 'ঘর্ষণহীন বাঁকে শুধু লম্ব প্রতিক্রিয়ার অনুভূমিক অংশ কেন্দ্রমুখী বল দেয়।' },
      { R: 50, th: 10, mu: .1, goal: 'safe', q: 'বরফে ঢাকা রাস্তা: μ = 0.1, r = 50 m, θ = 10°। নিরাপদ বেগ বেছে নাও।', h: 'ঘর্ষণ কম হলে নিরাপদ অঞ্চল খুব সংকীর্ণ।', e: 'পিচ্ছিল রাস্তায় সীমা সরু; ঢালই এখানে প্রধান ভরসা।' },
      { R: 200, th: 30, mu: .8, goal: 'max', q: 'রেসট্র্যাক (r = 200 m, θ = 30°, μ = 0.8)। সর্বোচ্চ নিরাপদ বেগের ঠিক কাছে চালাও।', h: 'লাল অঞ্চলের ঠিক আগে থামো।', e: 'vmax-এ ঘর্ষণ পুরোপুরি ব্যবহৃত হয়।' },
      { R: 60, th: 25, mu: .5, g: 1.62, goal: 'ideal', q: 'চাঁদে (g = 1.62) ঘর্ষণ ছাড়া আদর্শ বেগ কত? v₀ সেট করো।', h: 'g বদলালে v₀ = √(rg tanθ) কমে যায়।', e: 'কম অভিকর্ষে একই বাঁকে আদর্শ বেগ কম।' }]),
    G('tl74-force-tuner', 'Force Tuner: Newton’s Second Law', '🛷', 'physics', 'phy1-04', 'Easy', 70, 'ঘর্ষণসহ বস্তুতে কত বল দিলে লক্ষ্য ত্বরণ পাওয়া যায় তা স্লাইডারে ঠিক করো।', 'force', [
      { m: 10, mu: .3, g: 9.81, a: 2, q: '১০ kg বস্তুর ঘর্ষণ μ = 0.3। ঠিক ২ m/s² ত্বরণ পেতে কত বল দেবে?', h: 'F = ma + μmg।', e: 'প্রথমে ঘর্ষণ পেরোতে হয়, বাকি বল ত্বরণ দেয়।' },
      { m: 25, mu: .2, g: 9.81, a: 1.5, q: '২৫ kg ভর, μ = 0.2, লক্ষ্য a = 1.5 m/s²।', h: 'গতি ঘর্ষণ μmg আগে হিসাব করো।', e: 'ΣF = F − μmg = ma।' },
      { m: 5, mu: 0, g: 9.81, a: 4, q: 'মসৃণ তল (μ = 0)। ৫ kg ভরে ৪ m/s² পেতে কত বল?', h: 'ঘর্ষণ নেই, তাই F = ma।', e: 'ঘর্ষণ না থাকলে ΣF = F।' },
      { m: 40, mu: .5, g: 9.81, a: .5, q: 'ভারী ৪০ kg বস্তু, μ = 0.5, লক্ষ্য a = 0.5 m/s²।', h: 'বেশিরভাগ বল ঘর্ষণ পেরোতেই লাগে।', e: 'ঘর্ষণ বেশি হলে অল্প ত্বরণেও বড় বল লাগে।' },
      { m: 15, mu: .4, g: 9.81, a: 3, q: '১৫ kg, μ = 0.4, লক্ষ্য a = 3 m/s²।', h: 'F = m(a + μg)।', e: 'ভর কেটে যায় না, কারণ ঘর্ষণও ভরের সমানুপাতিক।' }]),
    G('tl74-lift-scale', 'Lift Scale: Apparent Weight', '🛗', 'physics', 'phy1-04', 'Easy', 70, 'লিফটের ত্বরণ বদলে ওজন কাঁটাকে লক্ষ্য পাঠে আনো।', 'lift', [
      { m: 60, g: 9.81, N: 720, q: '৬০ kg মানুষের কাঁটায় ৭২০ N দেখাতে লিফটের ত্বরণ কত হবে?', h: 'N = m(g + a)।', e: 'ঊর্ধ্বমুখী ত্বরণে কাঁটার পাঠ ওজনের চেয়ে বেশি।' },
      { m: 70, g: 9.81, N: 490, q: '৭০ kg মানুষের কাঁটায় ৪৯০ N দেখাও।', h: 'a ঋণাত্মক হলে মানুষ হালকা লাগে।', e: 'নিম্নমুখী ত্বরণে পাঠ কমে।' },
      { m: 50, g: 9.81, N: 0, q: 'কাঁটা শূন্য দেখাতে হবে (ওজনহীনতা)।', h: 'a = −g।', e: 'মুক্তপতনে লিফট ও মানুষ একই ত্বরণে নামে, তাই ঠেলা নেই।' },
      { m: 80, g: 9.81, N: 1000, q: '৮০ kg মানুষের কাঁটায় ১০০০ N।', h: 'a = N/m − g।', e: 'N − mg = ma।' },
      { m: 60, g: 1.62, N: 300, q: 'চাঁদে (g = 1.62) ৬০ kg মানুষের কাঁটায় ৩০০ N।', h: 'আগে চাঁদের ওজন ৬০ × 1.62 দেখো।', e: 'আপাত ওজন নির্ভর করে g + a-এর ওপর।' }]),
    G('tl74-momentum-match', 'Momentum Match: Collision Designer', '🎱', 'physics', 'phy1-04', 'Medium', 80, 'প্রথম গাড়ির বেগ বদলে সংঘর্ষের পর দ্বিতীয় গাড়িকে লক্ষ্য বেগে পাঠাও।', 'momentum', [
      { m1: 4, m2: 2, u2: 0, e: 1, v2: 8, q: 'স্থিতিস্থাপক সংঘর্ষ (e = 1)। গাড়ি ২ কে ৮ m/s বেগে পাঠাতে u₁ কত?', h: 'ভরবেগ সংরক্ষণ ও e = (v₂ − v₁)/(u₁ − u₂) ব্যবহার করো।', e: 'ভারী গাড়ি হালকা গাড়িকে নিজের বেগের চেয়ে বেশি বেগে ঠেলে দিতে পারে।' },
      { m1: 3, m2: 3, u2: 0, e: 1, v2: 5, q: 'সমান ভর, স্থিতিস্থাপক সংঘর্ষে গাড়ি ২ হবে ৫ m/s। u₁ কত?', h: 'সমান ভরে বেগ বিনিময় হয়।', e: 'সমান ভরের স্থিতিস্থাপক সংঘর্ষে বেগ অদলবদল হয়।' },
      { m1: 2, m2: 6, u2: 0, e: .5, v2: 3, q: 'আংশিক স্থিতিস্থাপক (e = 0.5): গাড়ি ২ কে ৩ m/s বেগে পাঠাও।', h: 'v₂′ = (1 + e)m₁u₁/(m₁ + m₂) যখন u₂ = 0।', e: 'e কমলে গাড়ি ২ কম বেগ পায়।' },
      { m1: 5, m2: 1, u2: -3, e: 1, v2: 8.7, q: 'গাড়ি ২ বাঁ দিকে −৩ m/s বেগে আসছে। সংঘর্ষের পর তার বেগ ৮.৭ m/s করো।', h: 'চিহ্ন (দিক) খেয়াল রাখো।', e: 'বিপরীত দিকের বেগ ঋণাত্মক ধরতে হয়।' },
      { m1: 2, m2: 2, u2: -4, e: 0, v2: 1, q: 'জুড়ে যাওয়া সংঘর্ষ (e = 0)। সংঘর্ষের পর দুই গাড়ির সম্মিলিত বেগ ১ m/s করো।', h: 'e = 0 হলে দুই গাড়ির বেগ সমান।', e: 'পূর্ণ অস্থিতিস্থাপক সংঘর্ষে ভরবেগ সংরক্ষিত, কিন্তু গতিশক্তি নয়।' }]),
    G('tl74-pendulum-clock', 'Pendulum Clock: Fix the Period', '🕰️', 'physics', 'phy1-08', 'Easy', 70, 'সুতার দৈর্ঘ্য বদলে সরল দোলকের দোলনকাল লক্ষ্যে মেলাও।', 'pendulum', [
      { g: 9.81, T: 2, q: 'পৃথিবীতে দোলনকাল ঠিক ২ s করতে সুতার দৈর্ঘ্য কত?', h: 'T = 2π√(L/g)।', e: 'দৈর্ঘ্য চার গুণ করলে দোলনকাল দ্বিগুণ হয়।' },
      { g: 9.81, T: 3, q: 'দোলনকাল ৩ s।', h: 'L = g T²/4π²।', e: 'T² ∝ L।' },
      { g: 1.62, T: 2, q: 'চাঁদে (g = 1.62) দোলনকাল ২ s।', h: 'g কম হলে একই দৈর্ঘ্যে দোলনকাল বেশি।', e: 'কম অভিকর্ষে ছোট সুতাতেই একই দোলনকাল হয়।' },
      { g: 3.71, T: 4, q: 'মঙ্গলে (g = 3.71) দোলনকাল ৪ s।', h: 'L = g T²/4π²।', e: 'দোলনকাল নির্ভর করে L ও g-এর ওপর, ভরের ওপর নয়।' },
      { g: 9.81, T: 1, q: 'সেকেন্ডের অর্ধেক দোলনের ঘড়ি: দোলনকাল ১ s।', h: 'ছোট দৈর্ঘ্য লাগবে।', e: 'দোলনকাল ১ s-এর জন্য L প্রায় ২৫ cm।' }]),
    G('tl74-wave-tuner', 'Wave Tuner: Match the Signal', '🎚️', 'physics', 'phy1-09', 'Medium', 75, 'বিস্তার, কম্পাঙ্ক ও দশা মিলিয়ে লক্ষ্য তরঙ্গ তৈরি করো।', 'wave', [
      { A: 2, f: 3, ph: 0, q: 'সোনালি ড্যাশ তরঙ্গের সাথে নীল তরঙ্গ মেলাও।', h: 'প্রথমে বিস্তার, তারপর চক্রের সংখ্যা, শেষে দশা ঠিক করো।', e: 'বিস্তার উচ্চতা, কম্পাঙ্ক ঘনত্ব, দশা বাম-ডান সরণ নির্ধারণ করে।' },
      { A: 1.5, f: 2, ph: 1.6, q: 'এবার দশা ১.৬ rad। তরঙ্গটি মেলাও।', h: 'দশা বাড়ালে তরঙ্গ বামে সরে।', e: 'দশা φ তরঙ্গকে বাম/ডানে সরায়।' },
      { A: 2.5, f: 4, ph: 3.1, q: 'বেশি কম্পাঙ্কের তরঙ্গ মেলাও।', h: 'চক্র গুনে f ঠিক করো।', e: 'কম্পাঙ্ক বেশি হলে একই দৈর্ঘ্যে বেশি চক্র থাকে।' },
      { A: 1, f: 5, ph: 4.7, q: 'ছোট বিস্তার, উচ্চ কম্পাঙ্ক।', h: 'শিখরের উচ্চতা বিস্তারের সমান।', e: 'তিনটি রাশিই স্বাধীনভাবে তরঙ্গ বদলায়।' }]),
    G('tl74-line-fit', 'Line Fit: Slope Hunter', '📈', 'math', 'math1-03', 'Easy', 70, 'দুটি বিন্দু দেখে রেখার ঢাল ও y-ছেদক ঠিক করো।', 'line', [
      { p1: [-2, -1], p2: [2, 3], q: 'P₁(−2, −1) ও P₂(2, 3) বিন্দু দিয়ে যাওয়া রেখা আঁকো।', h: 'ঢাল m = (y₂ − y₁)/(x₂ − x₁)।', e: 'দুটি বিন্দু থেকে ঢাল ও ছেদক দুটিই নির্ণয় করা যায়।' },
      { p1: [0, 3], p2: [2, -1], q: 'P₁(0, 3) ও P₂(2, −1)।', h: 'x = 0 বিন্দুর y-ই c।', e: 'x = 0-তে y-এর মান হলো ছেদক।' },
      { p1: [-3, 0], p2: [1, 2], q: 'P₁(−3, 0) ও P₂(1, 2)।', h: 'ঢাল ভগ্নাংশ হতে পারে।', e: 'ঢাল = ২/৪ = ০.৫।' },
      { p1: [-1, -3], p2: [1, 1], q: 'P₁(−1, −3) ও P₂(1, 1)।', h: 'ঢাল ২, তাহলে c কত?', e: 'y = mx + c-এ একটি বিন্দু বসিয়ে c পাওয়া যায়।' },
      { p1: [-4, 2], p2: [4, -2], q: 'ঋণাত্মক ঢালের রেখা: P₁(−4, 2), P₂(4, −2)।', h: 'রেখা ডান দিকে নিচে নামছে।', e: 'ঢাল ঋণাত্মক হলে রেখা ডানে নিচে নামে।' }]),
    G('tl74-equation-balancer', 'Equation Balancer: Atom Counter', '⚖️', 'chemistry', 'chem2-03', 'Medium', 80, 'রাসায়নিক সমীকরণের সহগ বসিয়ে দুই পাশে পরমাণুর সংখ্যা সমান করো।', 'equation', [
      { L: [{ f: 'H₂', a: { H: 2 } }, { f: 'O₂', a: { O: 2 } }], R: [{ f: 'H₂O', a: { H: 2, O: 1 } }], q: 'হাইড্রোজেন ও অক্সিজেন মিলে পানি। সমীকরণ সুসম করো।', h: 'O পরমাণু বামে ২টি; ডানে অন্তত ২টি পানি লাগবে।', e: '2H₂ + O₂ → 2H₂O।' },
      { L: [{ f: 'N₂', a: { N: 2 } }, { f: 'H₂', a: { H: 2 } }], R: [{ f: 'NH₃', a: { N: 1, H: 3 } }], q: 'হেবার পদ্ধতিতে অ্যামোনিয়া তৈরি।', h: 'N-কে আগে মেলাও, তারপর H।', e: 'N₂ + 3H₂ → 2NH₃।' },
      { L: [{ f: 'CH₄', a: { C: 1, H: 4 } }, { f: 'O₂', a: { O: 2 } }], R: [{ f: 'CO₂', a: { C: 1, O: 2 } }, { f: 'H₂O', a: { H: 2, O: 1 } }], q: 'মিথেনের দহন সুসম করো।', h: 'H মেলাতে পানির সহগ ২।', e: 'CH₄ + 2O₂ → CO₂ + 2H₂O।' },
      { L: [{ f: 'Fe', a: { Fe: 1 } }, { f: 'O₂', a: { O: 2 } }], R: [{ f: 'Fe₂O₃', a: { Fe: 2, O: 3 } }], q: 'লোহায় মরিচা পড়ার বিক্রিয়া।', h: 'O-এর ক্ষুদ্রতম সাধারণ গুণিতক ৬।', e: '4Fe + 3O₂ → 2Fe₂O₃।' },
      { L: [{ f: 'C₃H₈', a: { C: 3, H: 8 } }, { f: 'O₂', a: { O: 2 } }], R: [{ f: 'CO₂', a: { C: 1, O: 2 } }, { f: 'H₂O', a: { H: 2, O: 1 } }], q: 'প্রোপেনের সম্পূর্ণ দহন।', h: 'C → H → O ক্রমে মেলাও।', e: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O।' }]),
    G('tl74-vector-treasure', 'Vector Treasure: Resultant Hunt', '🗺️', 'physics', 'phy1-02', 'Medium', 75, 'দুই ধাপের সরণ ভেক্টর (দূরত্ব ও কোণ) দিয়ে গুপ্তধনের কাছে পৌঁছাও।', 'vector', [
      { tx: 6, ty: 4, q: 'দুই ধাপে হেঁটে গুপ্তধনে (৬, ৪) পৌঁছাও।', h: 'একটি ধাপ x-অক্ষ বরাবর, অন্যটি y-অক্ষ বরাবর নিলে সহজ।', e: 'লব্ধি = দুই ভেক্টরের যোগফল; উপাংশ আলাদা যোগ করা যায়।' },
      { tx: -3, ty: 7, q: 'গুপ্তধন (−৩, ৭)।', h: 'বাম দিকের কোণ ১৮০°।', e: 'ঋণাত্মক x পেতে কোণ ৯০° পেরিয়ে যেতে হয়।' },
      { tx: 8, ty: -5, q: 'গুপ্তধন (৮, −৫): নিচে ও ডানে।', h: 'নিচের কোণ ২৭০°-এর কাছে।', e: 'ঋণাত্মক y পেতে কোণ ১৮০°–৩৬০°।' },
      { tx: -6, ty: -6, q: 'গুপ্তধন (−৬, −৬)।', h: 'একটি ধাপ ২২৫° কোণে নেওয়া যায়।', e: 'তৃতীয় চতুর্ভাগে x ও y দুটিই ঋণাত্মক।' },
      { tx: 0, ty: 9, q: 'গুপ্তধন (০, ৯): ঠিক উপরে।', h: 'x-উপাংশ কাটাকাটি করাতে হবে।', e: 'বিপরীত উপাংশ যোগ করলে শূন্য হয়।' }]),
    G('tl74-resistor-combo', 'Resistor Combo: Circuit Architect', '🔌', 'physics', 'phy2-03', 'Medium', 75, 'তিনটি রোধ শ্রেণি/সমান্তরালে সাজিয়ে লক্ষ্য তুল্য রোধ তৈরি করো।', 'resistor', [
      { R: [6, 3, 2], target: 4, q: 'R₁ = ৬ Ω, R₂ = ৩ Ω, R₃ = ২ Ω দিয়ে তুল্য রোধ ৪ Ω বানাও।', h: 'দুটিকে সমান্তরালে নিয়ে তৃতীয়টির সাথে শ্রেণিতে জোড়ো।', e: '৬ ‖ ৩ = ২ Ω, এর সাথে ২ Ω শ্রেণিতে = ৪ Ω।' },
      { R: [4, 4, 4], target: 6, q: 'তিনটি ৪ Ω রোধ দিয়ে ৬ Ω।', h: 'একটি একা, দুটি সমান্তরাল।', e: '৪ + (৪ ‖ ৪) = ৪ + ২ = ৬ Ω।' },
      { R: [10, 10, 5], target: 2.5, q: 'R = ১০, ১০, ৫ Ω দিয়ে ২.৫ Ω।', h: 'সমান্তরালে তুল্য রোধ ক্ষুদ্রতম রোধের চেয়েও কম।', e: '১/Rₑ = ১/১০ + ১/১০ + ১/৫।' },
      { R: [2, 3, 6], target: 7.2, q: 'R = ২, ৩, ৬ Ω দিয়ে ৭.২ Ω।', h: 'সবচেয়ে বড় রোধ একা শ্রেণিতে বসাও।', e: '৬ + (২ ‖ ৩) = ৬ + ১.২ = ৭.২ Ω।' },
      { R: [12, 6, 4], target: 8, q: 'R = ১২, ৬, ৪ Ω দিয়ে ৮ Ω।', h: '১২ ‖ ৬ = ৪।', e: '৪ + (১২ ‖ ৬) = ৮ Ω।' }])
  ];
  if (window.CL_GAME_ACADEMY && Array.isArray(window.CL_GAME_ACADEMY.games)) {
    var seen = Object.create(null); window.CL_GAME_ACADEMY.games.forEach(function (g) { if (g && g.id) seen[g.id] = 1; });
    gm.forEach(function (g) { if (!seen[g.id]) window.CL_GAME_ACADEMY.games.push(g); });
  }
})();

})();
