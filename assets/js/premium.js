/* ConceptLab v9.6.1 — Premium student layer.
   Registers solver, reference, progress card and unified public settings page through CL_HUB.
   app.js supplies routing, profile links and the admin-managed three-line navigation.
   Preferences stay local to the current browser unless a visitor signs in for account data. */
(function () {
  'use strict';

  /* ---------- tiny helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function jget(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function jset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function api() { return window.CL_API || {}; }
  function settings() { try { return (api().settings && api().settings()) || {}; } catch (e) { return {}; } }
  function settingText(k, fallback) { var v = settings()[k]; return typeof v === 'string' && v.trim() ? v : fallback; }
  function flagOn(v) { return !(v === 'off' || v === false || v === 0 || v === '0'); }
  var toastT;
  function toast(msg) {
    var t = $('.px-toast');
    if (!t) { t = document.createElement('div'); t.className = 'px-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on'); clearTimeout(toastT);
    toastT = setTimeout(function () { t.classList.remove('on'); }, 1900);
  }
  function copyText(txt) {
    function fallback() { var ta = document.createElement('textarea'); ta.value = txt; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('Copied'); } catch (e) { toast('Copy not supported'); } ta.remove(); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { toast('Copied'); }, fallback); else fallback();
  }

  /* ---------- number parsing / formatting ---------- */
  var SUPM = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function sup(n) { return String(n).split('').map(function (c) { return SUPM[c] || c; }).join(''); }
  function parseNum(s) {
    s = String(s == null ? '' : s).trim().replace(/,/g, '');
    if (!s) return NaN;
    s = s.replace(/×/g, '*').replace(/−/g, '-').replace(/\bpi\b|π/gi, '(3.141592653589793)').replace(/\^/g, '**');
    if (!/^[0-9eE+\-*/().\s]+$/.test(s)) return NaN;
    try { var v = Function('"use strict";return (' + s + ')')(); return (typeof v === 'number' && isFinite(v)) ? v : NaN; } catch (e) { return NaN; }
  }
  function sig(x, n) {
    n = n || 5;
    if (x === 0) return '0';
    if (!isFinite(x)) return String(x);
    var ax = Math.abs(x);
    if (ax >= 1e6 || ax < 1e-3) {
      var e = x.toExponential(n - 1).split('e'), m = e[0];
      if (m.indexOf('.') > -1) m = m.replace(/0+$/, '').replace(/\.$/, '');
      return m + ' × 10' + sup(parseInt(e[1], 10));
    }
    return String(Number(x.toPrecision(n)));
  }
  function wrapv(x) { var s = sig(x, 6); return (x < 0 || s.indexOf('×') > -1) ? '(' + s + ')' : s; }
  var D2R = Math.PI / 180, R2D = 180 / Math.PI;

  /* ---------- formula library ---------- */
  var KC = { G: 6.6743e-11, k: 8.9875517923e9, h: 6.62607015e-34, c: 299792458, R: 0.082057, NA: 6.02214076e23 };
  var KD = { G: 'G', k: 'k', h: 'h', c: 'c', R: 'R', NA: 'Nₐ' };
  // vars: [key, name, unit, display symbol, default]
  var FORMS = [
    /* ---- Physics ---- */
    { id: 'kin1', s: 'phy', n: 'First equation of motion', eq: 'v = u + at', vars: [['v', 'Final velocity', 'm/s'], ['u', 'Initial velocity', 'm/s'], ['a', 'Acceleration', 'm/s²'], ['t', 'Time', 's']],
      sol: { v: ['{u} + {a} × {t}', function (x) { return x.u + x.a * x.t; }], u: ['{v} − {a} × {t}', function (x) { return x.v - x.a * x.t; }], a: ['({v} − {u}) / {t}', function (x) { return (x.v - x.u) / x.t; }], t: ['({v} − {u}) / {a}', function (x) { return (x.v - x.u) / x.a; }] } },
    { id: 'kin2', s: 'phy', n: 'Second equation of motion', eq: 's = ut + ½at²', vars: [['s', 'Displacement', 'm'], ['u', 'Initial velocity', 'm/s'], ['t', 'Time', 's'], ['a', 'Acceleration', 'm/s²']],
      note: 'Solving for t returns the positive root of the quadratic.',
      sol: { s: ['{u} × {t} + ½ × {a} × {t}²', function (x) { return x.u * x.t + 0.5 * x.a * x.t * x.t; }], u: ['({s} − ½ × {a} × {t}²) / {t}', function (x) { return (x.s - 0.5 * x.a * x.t * x.t) / x.t; }], a: ['2 × ({s} − {u} × {t}) / {t}²', function (x) { return 2 * (x.s - x.u * x.t) / (x.t * x.t); }],
        t: ['(−{u} + √({u}² + 2 × {a} × {s})) / {a}', function (x) { if (x.a === 0) return x.s / x.u; var d = x.u * x.u + 2 * x.a * x.s; if (d < 0) return NaN; var r1 = (-x.u + Math.sqrt(d)) / x.a, r2 = (-x.u - Math.sqrt(d)) / x.a, c = [r1, r2].filter(function (r) { return r >= 0; }); return c.length ? Math.min.apply(null, c) : NaN; }] } },
    { id: 'kin3', s: 'phy', n: 'Third equation of motion', eq: 'v² = u² + 2as', vars: [['v', 'Final velocity', 'm/s'], ['u', 'Initial velocity', 'm/s'], ['a', 'Acceleration', 'm/s²'], ['s', 'Displacement', 'm']],
      note: 'Square-root answers are given as the positive magnitude.',
      sol: { v: ['√({u}² + 2 × {a} × {s})', function (x) { return Math.sqrt(x.u * x.u + 2 * x.a * x.s); }], u: ['√({v}² − 2 × {a} × {s})', function (x) { return Math.sqrt(x.v * x.v - 2 * x.a * x.s); }], a: ['({v}² − {u}²) / (2 × {s})', function (x) { return (x.v * x.v - x.u * x.u) / (2 * x.s); }], s: ['({v}² − {u}²) / (2 × {a})', function (x) { return (x.v * x.v - x.u * x.u) / (2 * x.a); }] } },
    { id: 'newton2', s: 'phy', n: "Newton's second law", eq: 'F = ma', vars: [['F', 'Force', 'N'], ['m', 'Mass', 'kg'], ['a', 'Acceleration', 'm/s²']],
      sol: { F: ['{m} × {a}', function (x) { return x.m * x.a; }], m: ['{F} / {a}', function (x) { return x.F / x.a; }], a: ['{F} / {m}', function (x) { return x.F / x.m; }] } },
    { id: 'momentum', s: 'phy', n: 'Linear momentum', eq: 'p = mv', vars: [['p', 'Momentum', 'kg·m/s'], ['m', 'Mass', 'kg'], ['v', 'Velocity', 'm/s']],
      sol: { p: ['{m} × {v}', function (x) { return x.m * x.v; }], m: ['{p} / {v}', function (x) { return x.p / x.v; }], v: ['{p} / {m}', function (x) { return x.p / x.m; }] } },
    { id: 'ke', s: 'phy', n: 'Kinetic energy', eq: 'K = ½mv²', vars: [['K', 'Kinetic energy', 'J'], ['m', 'Mass', 'kg'], ['v', 'Speed', 'm/s']],
      sol: { K: ['½ × {m} × {v}²', function (x) { return 0.5 * x.m * x.v * x.v; }], m: ['2 × {K} / {v}²', function (x) { return 2 * x.K / (x.v * x.v); }], v: ['√(2 × {K} / {m})', function (x) { return Math.sqrt(2 * x.K / x.m); }] } },
    { id: 'pe', s: 'phy', n: 'Gravitational potential energy', eq: 'U = mgh', vars: [['U', 'Potential energy', 'J'], ['m', 'Mass', 'kg'], ['g', 'Gravitational acceleration', 'm/s²', 'g', 9.8], ['h', 'Height', 'm']],
      sol: { U: ['{m} × {g} × {h}', function (x) { return x.m * x.g * x.h; }], m: ['{U} / ({g} × {h})', function (x) { return x.U / (x.g * x.h); }], h: ['{U} / ({m} × {g})', function (x) { return x.U / (x.m * x.g); }], g: ['{U} / ({m} × {h})', function (x) { return x.U / (x.m * x.h); }] } },
    { id: 'work', s: 'phy', n: 'Work done by a force', eq: 'W = Fs cos θ', vars: [['W', 'Work done', 'J'], ['F', 'Force', 'N'], ['s', 'Displacement', 'm'], ['th', 'Angle between F and s', '°', 'θ', 0]],
      sol: { W: ['{F} × {s} × cos({th}°)', function (x) { return x.F * x.s * Math.cos(x.th * D2R); }], F: ['{W} / ({s} × cos({th}°))', function (x) { return x.W / (x.s * Math.cos(x.th * D2R)); }], s: ['{W} / ({F} × cos({th}°))', function (x) { return x.W / (x.F * Math.cos(x.th * D2R)); }], th: ['cos⁻¹({W} / ({F} × {s}))', function (x) { var r = x.W / (x.F * x.s); return Math.abs(r) > 1 ? NaN : Math.acos(r) * R2D; }] } },
    { id: 'power', s: 'phy', n: 'Mechanical power', eq: 'P = W / t', vars: [['P', 'Power', 'W'], ['W', 'Work / energy', 'J'], ['t', 'Time', 's']],
      sol: { P: ['{W} / {t}', function (x) { return x.W / x.t; }], W: ['{P} × {t}', function (x) { return x.P * x.t; }], t: ['{W} / {P}', function (x) { return x.W / x.P; }] } },
    { id: 'hooke', s: 'phy', n: "Hooke's law", eq: 'F = kx', vars: [['F', 'Restoring force', 'N'], ['k', 'Spring constant', 'N/m'], ['x', 'Extension', 'm']],
      sol: { F: ['{k} × {x}', function (x) { return x.k * x.x; }], k: ['{F} / {x}', function (x) { return x.F / x.x; }], x: ['{F} / {k}', function (x) { return x.F / x.k; }] } },
    { id: 'centri', s: 'phy', n: 'Centripetal force', eq: 'F = mv² / r', vars: [['F', 'Centripetal force', 'N'], ['m', 'Mass', 'kg'], ['v', 'Speed', 'm/s'], ['r', 'Radius', 'm']],
      sol: { F: ['{m} × {v}² / {r}', function (x) { return x.m * x.v * x.v / x.r; }], m: ['{F} × {r} / {v}²', function (x) { return x.F * x.r / (x.v * x.v); }], v: ['√({F} × {r} / {m})', function (x) { return Math.sqrt(x.F * x.r / x.m); }], r: ['{m} × {v}² / {F}', function (x) { return x.m * x.v * x.v / x.F; }] } },
    { id: 'pendulum', s: 'phy', n: 'Simple pendulum period', eq: 'T = 2π √(L / g)', vars: [['T', 'Time period', 's'], ['L', 'Length', 'm'], ['g', 'Gravitational acceleration', 'm/s²', 'g', 9.8]],
      sol: { T: ['2π × √({L} / {g})', function (x) { return 2 * Math.PI * Math.sqrt(x.L / x.g); }], L: ['{g} × ({T} / 2π)²', function (x) { return x.g * Math.pow(x.T / (2 * Math.PI), 2); }], g: ['4π² × {L} / {T}²', function (x) { return 4 * Math.PI * Math.PI * x.L / (x.T * x.T); }] } },
    { id: 'gravity', s: 'phy', n: "Newton's law of gravitation", eq: 'F = G m₁m₂ / r²', K: { G: KC.G }, note: 'Uses G = 6.6743 × 10⁻¹¹ N·m²/kg².',
      vars: [['F', 'Gravitational force', 'N'], ['m1', 'Mass 1', 'kg', 'm₁'], ['m2', 'Mass 2', 'kg', 'm₂'], ['r', 'Distance between centres', 'm']],
      sol: { F: ['{G} × {m1} × {m2} / {r}²', function (x) { return x.G * x.m1 * x.m2 / (x.r * x.r); }], m1: ['{F} × {r}² / ({G} × {m2})', function (x) { return x.F * x.r * x.r / (x.G * x.m2); }], m2: ['{F} × {r}² / ({G} × {m1})', function (x) { return x.F * x.r * x.r / (x.G * x.m1); }], r: ['√({G} × {m1} × {m2} / {F})', function (x) { return Math.sqrt(x.G * x.m1 * x.m2 / x.F); }] } },
    { id: 'coulomb', s: 'phy', n: "Coulomb's law", eq: 'F = k q₁q₂ / r²', K: { k: KC.k }, note: 'Uses k = 8.9876 × 10⁹ N·m²/C². Enter charges with sign; a negative force means attraction.',
      vars: [['F', 'Electric force', 'N'], ['q1', 'Charge 1', 'C', 'q₁'], ['q2', 'Charge 2', 'C', 'q₂'], ['r', 'Separation', 'm']],
      sol: { F: ['{k} × {q1} × {q2} / {r}²', function (x) { return x.k * x.q1 * x.q2 / (x.r * x.r); }], q1: ['{F} × {r}² / ({k} × {q2})', function (x) { return x.F * x.r * x.r / (x.k * x.q2); }], q2: ['{F} × {r}² / ({k} × {q1})', function (x) { return x.F * x.r * x.r / (x.k * x.q1); }], r: ['√({k} × {q1} × {q2} / {F})', function (x) { return Math.sqrt(x.k * x.q1 * x.q2 / x.F); }] } },
    { id: 'ohm', s: 'phy', n: "Ohm's law", eq: 'V = IR', vars: [['V', 'Potential difference', 'V'], ['I', 'Current', 'A'], ['R', 'Resistance', 'Ω']],
      sol: { V: ['{I} × {R}', function (x) { return x.I * x.R; }], I: ['{V} / {R}', function (x) { return x.V / x.R; }], R: ['{V} / {I}', function (x) { return x.V / x.I; }] } },
    { id: 'epower', s: 'phy', n: 'Electrical power', eq: 'P = VI', vars: [['P', 'Power', 'W'], ['V', 'Voltage', 'V'], ['I', 'Current', 'A']],
      sol: { P: ['{V} × {I}', function (x) { return x.V * x.I; }], V: ['{P} / {I}', function (x) { return x.P / x.I; }], I: ['{P} / {V}', function (x) { return x.P / x.V; }] } },
    { id: 'lens', s: 'phy', n: 'Lens / mirror formula', eq: '1/f = 1/u + 1/v', note: 'Real-is-positive convention: real object/image distances are positive; virtual images and concave lenses/convex mirrors give negative v or f. State your sign convention in exams.',
      vars: [['f', 'Focal length', 'cm'], ['u', 'Object distance', 'cm'], ['v', 'Image distance', 'cm']],
      sol: { f: ['1 / (1/{u} + 1/{v})', function (x) { return 1 / (1 / x.u + 1 / x.v); }], u: ['1 / (1/{f} − 1/{v})', function (x) { return 1 / (1 / x.f - 1 / x.v); }], v: ['1 / (1/{f} − 1/{u})', function (x) { return 1 / (1 / x.f - 1 / x.u); }] } },
    { id: 'snell', s: 'phy', n: "Snell's law", eq: 'n₁ sin θ₁ = n₂ sin θ₂', vars: [['n1', 'Refractive index 1', '', 'n₁'], ['th1', 'Angle of incidence', '°', 'θ₁'], ['n2', 'Refractive index 2', '', 'n₂'], ['th2', 'Angle of refraction', '°', 'θ₂']],
      sol: { n1: ['{n2} × sin({th2}°) / sin({th1}°)', function (x) { return x.n2 * Math.sin(x.th2 * D2R) / Math.sin(x.th1 * D2R); }], n2: ['{n1} × sin({th1}°) / sin({th2}°)', function (x) { return x.n1 * Math.sin(x.th1 * D2R) / Math.sin(x.th2 * D2R); }],
        th1: ['sin⁻¹({n2} × sin({th2}°) / {n1})', function (x) { var r = x.n2 * Math.sin(x.th2 * D2R) / x.n1; return Math.abs(r) > 1 ? NaN : Math.asin(r) * R2D; }], th2: ['sin⁻¹({n1} × sin({th1}°) / {n2})', function (x) { var r = x.n1 * Math.sin(x.th1 * D2R) / x.n2; return Math.abs(r) > 1 ? NaN : Math.asin(r) * R2D; }] } },
    { id: 'wave', s: 'phy', n: 'Wave speed', eq: 'v = fλ', vars: [['v', 'Wave speed', 'm/s'], ['f', 'Frequency', 'Hz'], ['lam', 'Wavelength', 'm', 'λ']],
      sol: { v: ['{f} × {lam}', function (x) { return x.f * x.lam; }], f: ['{v} / {lam}', function (x) { return x.v / x.lam; }], lam: ['{v} / {f}', function (x) { return x.v / x.f; }] } },
    { id: 'photon', s: 'phy', n: 'Photon energy (frequency)', eq: 'E = hf', K: { h: KC.h }, note: 'Uses h = 6.62607 × 10⁻³⁴ J·s.', vars: [['E', 'Photon energy', 'J'], ['f', 'Frequency', 'Hz']],
      sol: { E: ['{h} × {f}', function (x) { return x.h * x.f; }], f: ['{E} / {h}', function (x) { return x.E / x.h; }] } },
    { id: 'photonwl', s: 'phy', n: 'Photon energy (wavelength)', eq: 'E = hc / λ', K: { h: KC.h, c: KC.c }, note: 'Uses h = 6.62607 × 10⁻³⁴ J·s and c = 2.99792 × 10⁸ m/s.', vars: [['E', 'Photon energy', 'J'], ['lam', 'Wavelength', 'm', 'λ']],
      sol: { E: ['{h} × {c} / {lam}', function (x) { return x.h * x.c / x.lam; }], lam: ['{h} × {c} / {E}', function (x) { return x.h * x.c / x.E; }] } },
    { id: 'heat', s: 'phy', n: 'Heat energy', eq: 'Q = mcΔT', vars: [['Q', 'Heat energy', 'J'], ['m', 'Mass', 'kg'], ['c', 'Specific heat capacity', 'J/(kg·K)'], ['dT', 'Temperature change', 'K', 'ΔT']],
      sol: { Q: ['{m} × {c} × {dT}', function (x) { return x.m * x.c * x.dT; }], m: ['{Q} / ({c} × {dT})', function (x) { return x.Q / (x.c * x.dT); }], c: ['{Q} / ({m} × {dT})', function (x) { return x.Q / (x.m * x.dT); }], dT: ['{Q} / ({m} × {c})', function (x) { return x.Q / (x.m * x.c); }] } },
    { id: 'density', s: 'phy', n: 'Density', eq: 'ρ = m / V', vars: [['rho', 'Density', 'kg/m³', 'ρ'], ['m', 'Mass', 'kg'], ['V', 'Volume', 'm³']],
      sol: { rho: ['{m} / {V}', function (x) { return x.m / x.V; }], m: ['{rho} × {V}', function (x) { return x.rho * x.V; }], V: ['{m} / {rho}', function (x) { return x.m / x.rho; }] } },
    { id: 'pressure', s: 'phy', n: 'Pressure', eq: 'P = F / A', vars: [['P', 'Pressure', 'Pa'], ['F', 'Force', 'N'], ['A', 'Area', 'm²']],
      sol: { P: ['{F} / {A}', function (x) { return x.F / x.A; }], F: ['{P} × {A}', function (x) { return x.P * x.A; }], A: ['{F} / {P}', function (x) { return x.F / x.P; }] } },
    { id: 'projectile', s: 'phy', n: 'Projectile motion (level ground)', eq: 'T = 2u sin θ / g · H = u² sin²θ / 2g · R = u² sin 2θ / g', note: 'Launch and landing at the same height; air resistance ignored.',
      vars: [['u', 'Launch speed', 'm/s'], ['th', 'Launch angle', '°', 'θ', 45], ['g', 'Gravitational acceleration', 'm/s²', 'g', 9.8]],
      multi: function (x) { var s = Math.sin(x.th * D2R), T = 2 * x.u * s / x.g, H = x.u * x.u * s * s / (2 * x.g), R = x.u * x.u * Math.sin(2 * x.th * D2R) / x.g; return [['Time of flight', sig(T) + ' s'], ['Maximum height', sig(H) + ' m'], ['Horizontal range', sig(R) + ' m']]; } },
    { id: 'resistors', s: 'phy', n: 'Resistors: series & parallel', eq: 'R_s = R₁ + R₂ + R₃ · 1/R_p = 1/R₁ + 1/R₂ + 1/R₃', note: 'Leave R₃ empty to combine just two resistors.',
      vars: [['R1', 'Resistor 1', 'Ω', 'R₁'], ['R2', 'Resistor 2', 'Ω', 'R₂'], ['R3', 'Resistor 3 (optional)', 'Ω', 'R₃']], optional: ['R3'],
      multi: function (x) { var r = [x.R1, x.R2]; if (isFinite(x.R3)) r.push(x.R3); var s = r.reduce(function (a, b) { return a + b; }, 0), p = 1 / r.reduce(function (a, b) { return a + 1 / b; }, 0); return [['Series', sig(s) + ' Ω'], ['Parallel', sig(p) + ' Ω']]; } },
    /* ---- Chemistry ---- */
    { id: 'moles', s: 'chem', n: 'Moles from mass', eq: 'n = m / M', vars: [['n', 'Amount of substance', 'mol'], ['m', 'Mass', 'g'], ['M', 'Molar mass', 'g/mol']],
      sol: { n: ['{m} / {M}', function (x) { return x.m / x.M; }], m: ['{n} × {M}', function (x) { return x.n * x.M; }], M: ['{m} / {n}', function (x) { return x.m / x.n; }] } },
    { id: 'molarity', s: 'chem', n: 'Molarity', eq: 'C = n / V', vars: [['C', 'Molarity', 'mol/L'], ['n', 'Amount of solute', 'mol'], ['V', 'Volume of solution', 'L']],
      sol: { C: ['{n} / {V}', function (x) { return x.n / x.V; }], n: ['{C} × {V}', function (x) { return x.C * x.V; }], V: ['{n} / {C}', function (x) { return x.n / x.C; }] } },
    { id: 'dilution', s: 'chem', n: 'Dilution', eq: 'C₁V₁ = C₂V₂', vars: [['C1', 'Initial concentration', 'mol/L', 'C₁'], ['V1', 'Initial volume', 'mL', 'V₁'], ['C2', 'Final concentration', 'mol/L', 'C₂'], ['V2', 'Final volume', 'mL', 'V₂']],
      sol: { C1: ['{C2} × {V2} / {V1}', function (x) { return x.C2 * x.V2 / x.V1; }], V1: ['{C2} × {V2} / {C1}', function (x) { return x.C2 * x.V2 / x.C1; }], C2: ['{C1} × {V1} / {V2}', function (x) { return x.C1 * x.V1 / x.V2; }], V2: ['{C1} × {V1} / {C2}', function (x) { return x.C1 * x.V1 / x.C2; }] } },
    { id: 'idealgas', s: 'chem', n: 'Ideal gas equation', eq: 'PV = nRT', K: { R: KC.R }, note: 'Uses R = 0.082057 L·atm/(mol·K). Temperature must be in kelvin (K = °C + 273.15).',
      vars: [['P', 'Pressure', 'atm'], ['V', 'Volume', 'L'], ['n', 'Amount of gas', 'mol'], ['T', 'Temperature', 'K']],
      sol: { P: ['{n} × {R} × {T} / {V}', function (x) { return x.n * x.R * x.T / x.V; }], V: ['{n} × {R} × {T} / {P}', function (x) { return x.n * x.R * x.T / x.P; }], n: ['{P} × {V} / ({R} × {T})', function (x) { return x.P * x.V / (x.R * x.T); }], T: ['{P} × {V} / ({n} × {R})', function (x) { return x.P * x.V / (x.n * x.R); }] } },
    { id: 'boyle', s: 'chem', n: "Boyle's law", eq: 'P₁V₁ = P₂V₂', note: 'Constant temperature and amount of gas.', vars: [['P1', 'Initial pressure', 'atm', 'P₁'], ['V1', 'Initial volume', 'L', 'V₁'], ['P2', 'Final pressure', 'atm', 'P₂'], ['V2', 'Final volume', 'L', 'V₂']],
      sol: { P1: ['{P2} × {V2} / {V1}', function (x) { return x.P2 * x.V2 / x.V1; }], V1: ['{P2} × {V2} / {P1}', function (x) { return x.P2 * x.V2 / x.P1; }], P2: ['{P1} × {V1} / {V2}', function (x) { return x.P1 * x.V1 / x.V2; }], V2: ['{P1} × {V1} / {P2}', function (x) { return x.P1 * x.V1 / x.P2; }] } },
    { id: 'ph', s: 'chem', n: 'pH and hydrogen-ion concentration', eq: 'pH = −log₁₀[H⁺]', vars: [['pH', 'pH', ''], ['H', 'Hydrogen-ion concentration [H⁺]', 'mol/L', '[H⁺]']],
      sol: { pH: ['−log₁₀({H})', function (x) { return -Math.log10(x.H); }], H: ['10^(−{pH})', function (x) { return Math.pow(10, -x.pH); }] } },
    { id: 'phpoh', s: 'chem', n: 'pH + pOH at 25 °C', eq: 'pH + pOH = 14', vars: [['pH', 'pH', ''], ['pOH', 'pOH', '']],
      sol: { pH: ['14 − {pOH}', function (x) { return 14 - x.pOH; }], pOH: ['14 − {pH}', function (x) { return 14 - x.pH; }] } },
    { id: 'avogadro', s: 'chem', n: 'Number of particles', eq: 'N = n × Nₐ', K: { NA: KC.NA }, note: 'Uses Nₐ = 6.02214 × 10²³ mol⁻¹.', vars: [['N', 'Number of particles', ''], ['n', 'Amount of substance', 'mol']],
      sol: { N: ['{n} × {NA}', function (x) { return x.n * x.NA; }], n: ['{N} / {NA}', function (x) { return x.N / x.NA; }] } },
    { id: 'yield', s: 'chem', n: 'Percentage yield', eq: '% yield = (actual / theoretical) × 100', vars: [['Y', 'Percentage yield', '%'], ['act', 'Actual yield', 'g'], ['theo', 'Theoretical yield', 'g']],
      sol: { Y: ['{act} / {theo} × 100', function (x) { return x.act / x.theo * 100; }], act: ['{Y} × {theo} / 100', function (x) { return x.Y * x.theo / 100; }], theo: ['{act} × 100 / {Y}', function (x) { return x.act * 100 / x.Y; }] } },
    /* ---- Higher Maths ---- */
    { id: 'apn', s: 'math', n: 'Arithmetic progression: nth term', eq: 'aₙ = a + (n − 1)d', vars: [['an', 'nth term', '', 'aₙ'], ['a', 'First term', ''], ['n', 'Term number', ''], ['d', 'Common difference', '']],
      sol: { an: ['{a} + ({n} − 1) × {d}', function (x) { return x.a + (x.n - 1) * x.d; }], a: ['{an} − ({n} − 1) × {d}', function (x) { return x.an - (x.n - 1) * x.d; }], n: ['({an} − {a}) / {d} + 1', function (x) { return (x.an - x.a) / x.d + 1; }], d: ['({an} − {a}) / ({n} − 1)', function (x) { return (x.an - x.a) / (x.n - 1); }] } },
    { id: 'aps', s: 'math', n: 'Arithmetic progression: sum', eq: 'Sₙ = n/2 · [2a + (n − 1)d]', vars: [['Sn', 'Sum of n terms', '', 'Sₙ'], ['n', 'Number of terms', ''], ['a', 'First term', ''], ['d', 'Common difference', '']],
      sol: { Sn: ['{n} / 2 × (2 × {a} + ({n} − 1) × {d})', function (x) { return x.n / 2 * (2 * x.a + (x.n - 1) * x.d); }], a: ['(2 × {Sn} / {n} − ({n} − 1) × {d}) / 2', function (x) { return (2 * x.Sn / x.n - (x.n - 1) * x.d) / 2; }], d: ['(2 × {Sn} / {n} − 2 × {a}) / ({n} − 1)', function (x) { return (2 * x.Sn / x.n - 2 * x.a) / (x.n - 1); }] } },
    { id: 'gpn', s: 'math', n: 'Geometric progression: nth term', eq: 'aₙ = a · rⁿ⁻¹', vars: [['an', 'nth term', '', 'aₙ'], ['a', 'First term', ''], ['r', 'Common ratio', ''], ['n', 'Term number', '']],
      sol: { an: ['{a} × {r}^({n} − 1)', function (x) { return x.a * Math.pow(x.r, x.n - 1); }], a: ['{an} / {r}^({n} − 1)', function (x) { return x.an / Math.pow(x.r, x.n - 1); }], r: ['({an} / {a})^(1 / ({n} − 1))', function (x) { return Math.pow(x.an / x.a, 1 / (x.n - 1)); }], n: ['1 + ln({an} / {a}) / ln({r})', function (x) { return 1 + Math.log(x.an / x.a) / Math.log(x.r); }] } },
    { id: 'gps', s: 'math', n: 'Geometric progression: sum', eq: 'Sₙ = a(1 − rⁿ) / (1 − r)', vars: [['Sn', 'Sum of n terms', '', 'Sₙ'], ['a', 'First term', ''], ['r', 'Common ratio (r ≠ 1)', ''], ['n', 'Number of terms', '']],
      sol: { Sn: ['{a} × (1 − {r}^{n}) / (1 − {r})', function (x) { return x.a * (1 - Math.pow(x.r, x.n)) / (1 - x.r); }], a: ['{Sn} × (1 − {r}) / (1 − {r}^{n})', function (x) { return x.Sn * (1 - x.r) / (1 - Math.pow(x.r, x.n)); }] } },
    { id: 'quad', s: 'math', n: 'Quadratic equation', eq: 'ax² + bx + c = 0', note: 'Complex roots are shown as p ± qi when the discriminant is negative.', vars: [['a', 'Coefficient a', ''], ['b', 'Coefficient b', ''], ['c', 'Constant c', '']],
      multi: function (x) { if (x.a === 0) return [['Not quadratic', 'a must not be 0']]; var d = x.b * x.b - 4 * x.a * x.c, out = [['Discriminant (b² − 4ac)', sig(d)]]; if (d >= 0) { out.push(['x₁', sig((-x.b + Math.sqrt(d)) / (2 * x.a))]); out.push(['x₂', sig((-x.b - Math.sqrt(d)) / (2 * x.a))]); out.push(['Nature of roots', d === 0 ? 'Real and equal' : 'Real and distinct']); } else { var p = -x.b / (2 * x.a), q = Math.sqrt(-d) / (2 * x.a); out.push(['x₁', sig(p) + ' + ' + sig(Math.abs(q)) + 'i']); out.push(['x₂', sig(p) + ' − ' + sig(Math.abs(q)) + 'i']); out.push(['Nature of roots', 'Complex conjugates']); } return out; } },
    { id: 'dist', s: 'math', n: 'Distance, midpoint & slope', eq: 'd = √[(x₂ − x₁)² + (y₂ − y₁)²]', vars: [['x1', 'x₁', '', 'x₁'], ['y1', 'y₁', '', 'y₁'], ['x2', 'x₂', '', 'x₂'], ['y2', 'y₂', '', 'y₂']],
      multi: function (x) { var dx = x.x2 - x.x1, dy = x.y2 - x.y1; return [['Distance', sig(Math.sqrt(dx * dx + dy * dy))], ['Midpoint', '(' + sig((x.x1 + x.x2) / 2) + ', ' + sig((x.y1 + x.y2) / 2) + ')'], ['Slope', dx === 0 ? 'Undefined (vertical line)' : sig(dy / dx)]]; } }
  ];
  var SUBJ = { phy: 'Physics', chem: 'Chemistry', math: 'Higher Math' };

  function fById(id) { for (var i = 0; i < FORMS.length; i++) if (FORMS[i].id === id) return FORMS[i]; return null; }
  function vdisp(f, key) { for (var i = 0; i < f.vars.length; i++) if (f.vars[i][0] === key) return f.vars[i][3] || key; return KD[key] || key; }
  function targets(f) { return f.sol ? f.vars.filter(function (v) { return f.sol[v[0]]; }).map(function (v) { return v[0]; }) : []; }

  /* returns {missing:[]}|{error:true}|{value,x,tpl}|{multi:[[l,v]]} */
  function compute(f, target, vals) {
    var x = {}, missing = [];
    f.vars.forEach(function (v) {
      if (f.sol && v[0] === target) return;
      var n = parseNum(vals[v[0]]);
      if (isNaN(n)) { if (f.optional && f.optional.indexOf(v[0]) > -1 && !String(vals[v[0]] || '').trim()) x[v[0]] = NaN; else missing.push(v[0]); } else x[v[0]] = n;
    });
    if (missing.length) return { missing: missing };
    Object.keys(f.K || {}).forEach(function (k) { x[k] = f.K[k]; });
    try {
      if (f.multi) { var m = f.multi(x); return { multi: m, x: x }; }
      var s = f.sol[target], r = s[1](x);
      if (typeof r !== 'number' || !isFinite(r)) return { error: true };
      return { value: r, x: x, tpl: s[0] };
    } catch (e) { return { error: true }; }
  }
  function fillTpl(tpl, f, x, mode) {
    return tpl.replace(/\{(\w+)\}/g, function (m, k) { return mode === 'sym' ? vdisp(f, k) : wrapv(x[k]); });
  }

  /* ---------- Formula Solver page ---------- */
  var solverState = { q: '', s: 'all', id: 'kin1', target: null, vals: {} };
  function solverList() {
    var q = solverState.q.trim().toLowerCase();
    return FORMS.filter(function (f) { return (solverState.s === 'all' || f.s === solverState.s) && (!q || (f.n + ' ' + f.eq + ' ' + SUBJ[f.s]).toLowerCase().indexOf(q) > -1); });
  }
  function listHTML() {
    var l = solverList();
    if (!l.length) return '<p class="px-empty">No formula matches “' + E(solverState.q) + '”.</p>';
    return l.map(function (f) { return '<button type="button" class="px-fitem" data-pxf="' + f.id + '" aria-current="' + (f.id === solverState.id) + '"><span>' + E(f.n) + '</span><small>' + E(f.eq.split(' · ')[0]) + '</small></button>'; }).join('');
  }
  function mainHTML() {
    var f = fById(solverState.id) || FORMS[0], tg = targets(f), t = solverState.target;
    if (f.sol && tg.indexOf(t) < 0) t = solverState.target = tg[0];
    var chips = f.sol ? '<div class="px-row"><span>Solve for</span><div class="px-chips" role="group" aria-label="Variable to solve for">' + tg.map(function (k) { return '<button type="button" class="px-chip" data-pxt="' + k + '" aria-pressed="' + (k === t) + '">' + E(vdisp(f, k)) + '</button>'; }).join('') + '</div></div>' : '';
    var inputs = f.vars.filter(function (v) { return !f.sol || v[0] !== t; }).map(function (v) {
      var val = solverState.vals[f.id + ':' + v[0]]; if (val == null) val = v[4] != null ? String(v[4]) : '';
      return '<div class="px-field"><label for="pxv-' + v[0] + '"><span>' + E(v[3] || v[0]) + ' — ' + E(v[1]) + '</span><i>' + E(v[2]) + '</i></label><input class="px-in" id="pxv-' + v[0] + '" data-pxv="' + v[0] + '" inputmode="decimal" autocomplete="off" placeholder="Enter value" value="' + E(val) + '"></div>';
    }).join('');
    return '<span class="px-tag">' + E(SUBJ[f.s]) + '</span><h2>' + E(f.n) + '</h2><div class="px-eq" aria-label="Formula">' + E(f.eq) + '</div>' + chips +
      '<div class="px-inputs">' + inputs + '</div>' + (f.note ? '<p class="px-note">ℹ ' + E(f.note) + '</p>' : '') +
      '<p class="px-note">Tip: you can type expressions like <b>9.8*2</b>, <b>3e8</b> or <b>2^5</b>.</p>' +
      '<div class="px-row"><button type="button" class="px-btn pri" data-pxsave>Save to history</button><button type="button" class="px-btn" data-pxclear>Clear</button></div>' +
      '<div class="px-result empty" id="pxResult" aria-live="polite">Fill in all the values to see the answer with steps.</div>';
  }
  function curVals(f) { var o = {}; f.vars.forEach(function (v) { var i = $('#pxv-' + v[0]); o[v[0]] = i ? i.value : (solverState.vals[f.id + ':' + v[0]] || ''); }); return o; }
  var lastResult = null;
  function runSolver() {
    var f = fById(solverState.id), box = $('#pxResult'); if (!f || !box) return;
    var vals = curVals(f); f.vars.forEach(function (v) { solverState.vals[f.id + ':' + v[0]] = vals[v[0]]; });
    var r = compute(f, solverState.target, vals); lastResult = null;
    if (r.missing) { box.className = 'px-result empty'; box.textContent = 'Fill in all the values to see the answer with steps.'; return; }
    if (r.error) { box.className = 'px-result empty'; box.textContent = 'These values cannot be solved (division by zero, a negative square root or an out-of-range angle). Check your inputs.'; return; }
    box.className = 'px-result';
    if (r.multi) {
      box.innerHTML = '<div class="px-multi">' + r.multi.map(function (m) { return '<div><small>' + E(m[0]) + '</small><b>' + E(m[1]) + '</b></div>'; }).join('') + '</div>';
      lastResult = { n: f.n, res: r.multi.map(function (m) { return m[0] + ': ' + m[1]; }).join(' · ') };
      return;
    }
    var v = f.vars.filter(function (q) { return q[0] === solverState.target; })[0], sym = vdisp(f, solverState.target), unit = v[2] ? ' ' + v[2] : '';
    var ans = sig(r.value);
    box.innerHTML = '<div class="px-answer"><b>' + E(sym + ' = ' + ans) + '</b><span>' + E(v[2]) + '</span></div><ol class="px-steps">' +
      '<li><div><small>Formula</small>' + E(f.eq) + '</div></li>' +
      '<li><div><small>Rearrange for ' + E(sym) + '</small>' + E(sym + ' = ' + fillTpl(r.tpl, f, r.x, 'sym')) + '</div></li>' +
      '<li><div><small>Substitute values</small>' + E(sym + ' = ' + fillTpl(r.tpl, f, r.x, 'val')) + '</div></li>' +
      '<li><div><small>Answer</small>' + E(sym + ' = ' + ans + unit) + '</div></li></ol>' +
      '<p class="px-note"><button type="button" class="px-btn" data-pxcopy>Copy answer</button></p>';
    lastResult = { n: f.n, res: sym + ' = ' + ans + unit, copy: ans + unit };
  }
  function histHTML() {
    var h = jget('clpx_hist', []);
    return '<h3><span>Recent solutions</span>' + (h.length ? '<button type="button" class="px-btn" data-pxhclear style="min-height:34px;padding:0 12px;font-size:12px">Clear</button>' : '') + '</h3>' +
      (h.length ? '<ul>' + h.map(function (e) { return '<li><b>' + E(e.n) + '</b><br>' + E(e.res) + '</li>'; }).join('') + '</ul>' : '<p class="px-note" style="margin:0">Nothing saved yet. Solve something and press “Save to history”.</p>');
  }
  function solverPage() {
    var hp = (location.hash.replace(/^#\/?/, '').split('/')[1] || '').split('?')[0];
    if (hp && fById(hp)) { solverState.id = hp; solverState.target = null; }
    return '<section class="px-page"><span class="px-tag">STUDENT POWER TOOL</span><h1>' + E(settingText('solverTitle', 'Formula Solver — answers with steps')) + '</h1>' +
      '<p class="lead">' + E(settingText('solverIntro', 'Pick a formula, choose the unknown, type the rest. ConceptLab rearranges the equation, substitutes your numbers and shows every step — so you learn the method, not just the result.')) + '</p>' +
      '<div class="px-solver"><aside class="px-panel px-side"><input class="px-in" id="pxSearch" type="search" placeholder="Search formulas (e.g. force, pH, quadratic)" value="' + E(solverState.q) + '" aria-label="Search formulas">' +
      '<div class="px-chips" id="pxSubj" role="group" aria-label="Subject filter">' + [['all', 'All'], ['phy', 'Physics'], ['chem', 'Chemistry'], ['math', 'Math']].map(function (s) { return '<button type="button" class="px-chip" data-pxs="' + s[0] + '" aria-pressed="' + (solverState.s === s[0]) + '">' + s[1] + '</button>'; }).join('') + '</div>' +
      '<div class="px-flist" id="pxList">' + listHTML() + '</div></aside><div><div class="px-panel px-main" id="pxMain">' + mainHTML() + '</div><div class="px-panel px-hist" id="pxHist">' + histHTML() + '</div></div></div>' +
      '<p class="px-note" style="margin-top:18px">Always check the units and the values your exam question gives. This tool is a study aid, not a substitute for showing your own working.</p></section>';
  }
  function mountSolver(app) {
    var root = $('.px-solver', app); if (!root) return;
    runSolver();
    root.addEventListener('input', function (e) {
      if (e.target.id === 'pxSearch') { solverState.q = e.target.value; $('#pxList').innerHTML = listHTML(); }
      else if (e.target.hasAttribute('data-pxv')) runSolver();
    });
    root.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-pxf]'))) { solverState.id = b.getAttribute('data-pxf'); solverState.target = null; $('#pxMain').innerHTML = mainHTML(); $('#pxList').innerHTML = listHTML(); runSolver(); try { history.replaceState(null, '', '#/solver/' + solverState.id); } catch (x) { } if (window.innerWidth < 860) $('#pxMain').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      else if ((b = e.target.closest('[data-pxs]'))) { solverState.s = b.getAttribute('data-pxs'); $$('#pxSubj .px-chip').forEach(function (c) { c.setAttribute('aria-pressed', c === b); }); $('#pxList').innerHTML = listHTML(); }
      else if ((b = e.target.closest('[data-pxt]'))) { var f = fById(solverState.id); f.vars.forEach(function (v) { var i = $('#pxv-' + v[0]); if (i) solverState.vals[f.id + ':' + v[0]] = i.value; }); solverState.target = b.getAttribute('data-pxt'); $('#pxMain').innerHTML = mainHTML(); runSolver(); }
      else if (e.target.closest('[data-pxclear]')) { var g = fById(solverState.id); g.vars.forEach(function (v) { solverState.vals[g.id + ':' + v[0]] = v[4] != null ? String(v[4]) : ''; }); $('#pxMain').innerHTML = mainHTML(); runSolver(); }
      else if (e.target.closest('[data-pxcopy]')) { if (lastResult) copyText(lastResult.copy || lastResult.res); }
      else if (e.target.closest('[data-pxsave]')) { if (!lastResult) { toast('Solve something first'); return; } var h = jget('clpx_hist', []); h.unshift({ n: lastResult.n, res: lastResult.res }); jset('clpx_hist', h.slice(0, 8)); $('#pxHist').innerHTML = histHTML(); toast('Saved to history'); }
      else if (e.target.closest('[data-pxhclear]')) { jset('clpx_hist', []); $('#pxHist').innerHTML = histHTML(); }
    });
  }

  /* ---------- Reference shelf ---------- */
  var REF = {
    constants: ['Constants', [
      ['Speed of light in vacuum', 'c = 2.99792458 × 10⁸ m/s', 'Exact'],
      ['Gravitational constant', 'G = 6.6743 × 10⁻¹¹ N·m²/kg²', 'Newton’s gravitation'],
      ['Standard gravity', 'g = 9.80665 m/s²', 'Most exams use 9.8 or 10'],
      ['Planck constant', 'h = 6.62607015 × 10⁻³⁴ J·s', 'Exact'],
      ['Reduced Planck constant', 'ħ = 1.054571817 × 10⁻³⁴ J·s', 'h / 2π'],
      ['Elementary charge', 'e = 1.602176634 × 10⁻¹⁹ C', 'Exact'],
      ['Electron mass', 'mₑ = 9.1093837 × 10⁻³¹ kg', 'Atomic'],
      ['Proton mass', 'mₚ = 1.67262192 × 10⁻²⁷ kg', 'Atomic'],
      ['Neutron mass', 'mₙ = 1.67492750 × 10⁻²⁷ kg', 'Atomic'],
      ['Atomic mass unit', 'u = 1.66053907 × 10⁻²⁷ kg', 'Atomic'],
      ['Boltzmann constant', 'k_B = 1.380649 × 10⁻²³ J/K', 'Exact'],
      ['Avogadro constant', 'Nₐ = 6.02214076 × 10²³ mol⁻¹', 'Exact'],
      ['Universal gas constant', 'R = 8.314462618 J/(mol·K)', 'Also 0.082057 L·atm/(mol·K)'],
      ['Faraday constant', 'F = 96485.33 C/mol', 'Electrochemistry'],
      ['Vacuum permittivity', 'ε₀ = 8.8541878 × 10⁻¹² F/m', 'Electrostatics'],
      ['Vacuum permeability', 'μ₀ = 1.25663706 × 10⁻⁶ N/A²', 'Magnetism'],
      ['Coulomb constant', 'k = 8.9875518 × 10⁹ N·m²/C²', '1 / 4πε₀'],
      ['Stefan–Boltzmann constant', 'σ = 5.670374 × 10⁻⁸ W/(m²·K⁴)', 'Thermal radiation'],
      ['Rydberg constant', 'R∞ = 1.0973732 × 10⁷ m⁻¹', 'Atomic spectra'],
      ['Bohr radius', 'a₀ = 5.29177211 × 10⁻¹¹ m', 'Hydrogen atom'],
      ['One electron-volt', '1 eV = 1.602176634 × 10⁻¹⁹ J', 'Energy unit'],
      ['Standard atmosphere', '1 atm = 101325 Pa', 'Pressure'],
      ['Molar volume at STP (0 °C, 1 atm)', '22.414 L/mol', 'Ideal gas'],
      ['Specific heat of water (approx.)', '4186 J/(kg·K)', 'Approximate'],
      ['Speed of sound in air at 20 °C (approx.)', '343 m/s', 'Approximate'],
      ['Mass of Earth', '5.972 × 10²⁴ kg', 'Astronomy'],
      ['Mean radius of Earth', '6.371 × 10⁶ m', 'Astronomy'],
      ['Mass of the Sun', '1.989 × 10³⁰ kg', 'Astronomy'],
      ['Astronomical unit', '1.495978707 × 10¹¹ m', 'Exact']]],
    prefixes: ['SI Prefixes', [
      ['tera (T)', '10¹²', '1 000 000 000 000'], ['giga (G)', '10⁹', '1 000 000 000'], ['mega (M)', '10⁶', '1 000 000'], ['kilo (k)', '10³', '1 000'],
      ['hecto (h)', '10²', '100'], ['deca (da)', '10¹', '10'], ['deci (d)', '10⁻¹', '0.1'], ['centi (c)', '10⁻²', '0.01'], ['milli (m)', '10⁻³', '0.001'],
      ['micro (μ)', '10⁻⁶', '0.000001'], ['nano (n)', '10⁻⁹', '0.000000001'], ['pico (p)', '10⁻¹²', '0.000000000001'], ['femto (f)', '10⁻¹⁵', '0.000000000000001']]],
    greek: ['Greek letters', [
      ['α alpha', 'α', 'Angular acceleration, alpha particle, fine-structure const.'], ['β beta', 'β', 'Beta particle, current gain'], ['γ gamma', 'γ', 'Gamma ray, Lorentz factor, specific-heat ratio'], ['δ / Δ delta', 'δ  Δ', 'Small change / change in'],
      ['ε epsilon', 'ε', 'Permittivity, emf, strain'], ['η eta', 'η', 'Efficiency, viscosity'], ['θ theta', 'θ', 'Angle'], ['λ lambda', 'λ', 'Wavelength, decay constant'],
      ['μ mu', 'μ', 'Friction coefficient, permeability, micro'], ['ν nu', 'ν', 'Frequency, neutrino'], ['π pi', 'π', '3.14159…'], ['ρ rho', 'ρ', 'Density, resistivity'],
      ['σ / Σ sigma', 'σ  Σ', 'Conductivity, stress / sum'], ['τ tau', 'τ', 'Torque, time constant'], ['φ / Φ phi', 'φ  Φ', 'Phase, work function, magnetic flux'], ['ψ psi', 'ψ', 'Wave function'],
      ['ω / Ω omega', 'ω  Ω', 'Angular velocity / ohm'], ['κ kappa', 'κ', 'Dielectric constant'], ['Γ gamma (capital)', 'Γ', 'Gamma function, decay width'], ['Λ lambda (capital)', 'Λ', 'Cosmological constant']]],
    ions: ['Common ions', [
      ['Hydrogen', 'H⁺', 'Cation'], ['Lithium', 'Li⁺', 'Cation'], ['Sodium', 'Na⁺', 'Cation'], ['Potassium', 'K⁺', 'Cation'], ['Ammonium', 'NH₄⁺', 'Cation'], ['Silver', 'Ag⁺', 'Cation'],
      ['Magnesium', 'Mg²⁺', 'Cation'], ['Calcium', 'Ca²⁺', 'Cation'], ['Barium', 'Ba²⁺', 'Cation'], ['Zinc', 'Zn²⁺', 'Cation'], ['Lead(II)', 'Pb²⁺', 'Cation'], ['Copper(II)', 'Cu²⁺', 'Cation'],
      ['Iron(II)', 'Fe²⁺', 'Cation'], ['Iron(III)', 'Fe³⁺', 'Cation'], ['Aluminium', 'Al³⁺', 'Cation'], ['Manganese(II)', 'Mn²⁺', 'Cation'], ['Nickel(II)', 'Ni²⁺', 'Cation'], ['Chromium(III)', 'Cr³⁺', 'Cation'],
      ['Fluoride', 'F⁻', 'Anion'], ['Chloride', 'Cl⁻', 'Anion'], ['Bromide', 'Br⁻', 'Anion'], ['Iodide', 'I⁻', 'Anion'], ['Hydroxide', 'OH⁻', 'Anion'], ['Nitrate', 'NO₃⁻', 'Anion'], ['Nitrite', 'NO₂⁻', 'Anion'],
      ['Sulfate', 'SO₄²⁻', 'Anion'], ['Sulfite', 'SO₃²⁻', 'Anion'], ['Carbonate', 'CO₃²⁻', 'Anion'], ['Hydrogencarbonate', 'HCO₃⁻', 'Anion'], ['Phosphate', 'PO₄³⁻', 'Anion'], ['Permanganate', 'MnO₄⁻', 'Anion'],
      ['Dichromate', 'Cr₂O₇²⁻', 'Anion'], ['Chromate', 'CrO₄²⁻', 'Anion'], ['Ethanoate (acetate)', 'CH₃COO⁻', 'Anion'], ['Oxalate', 'C₂O₄²⁻', 'Anion'], ['Sulfide', 'S²⁻', 'Anion'], ['Oxide', 'O²⁻', 'Anion']]],
    maths: ['Maths identities', [
      ['Pythagorean identity', 'sin²θ + cos²θ = 1', 'Trigonometry'], ['Tangent identity', '1 + tan²θ = sec²θ', 'Trigonometry'], ['Cotangent identity', '1 + cot²θ = cosec²θ', 'Trigonometry'],
      ['Double angle (sine)', 'sin 2A = 2 sin A cos A', 'Trigonometry'], ['Double angle (cosine)', 'cos 2A = cos²A − sin²A = 2cos²A − 1 = 1 − 2sin²A', 'Trigonometry'], ['Double angle (tangent)', 'tan 2A = 2 tan A / (1 − tan²A)', 'Trigonometry'],
      ['Sine of sum / difference', 'sin(A ± B) = sin A cos B ± cos A sin B', 'Trigonometry'], ['Cosine of sum / difference', 'cos(A ± B) = cos A cos B ∓ sin A sin B', 'Trigonometry'], ['Tangent of sum / difference', 'tan(A ± B) = (tan A ± tan B) / (1 ∓ tan A tan B)', 'Trigonometry'],
      ['Triple angle', 'sin 3A = 3 sin A − 4 sin³A · cos 3A = 4cos³A − 3 cos A', 'Trigonometry'],
      ['Log of a product', 'log(ab) = log a + log b', 'Logarithms'], ['Log of a quotient', 'log(a/b) = log a − log b', 'Logarithms'], ['Log of a power', 'log aⁿ = n log a', 'Logarithms'], ['Change of base', 'logₐ b = log b / log a', 'Logarithms'],
      ['Quadratic formula', 'x = [−b ± √(b² − 4ac)] / 2a', 'Algebra'], ['Binomial general term', 'T(r+1) = ⁿCᵣ · aⁿ⁻ʳ · bʳ', 'Algebra'],
      ['Derivative of a power', 'd/dx (xⁿ) = n xⁿ⁻¹', 'Calculus'], ['Derivative of eˣ', 'd/dx (eˣ) = eˣ', 'Calculus'], ['Derivative of ln x', 'd/dx (ln x) = 1/x', 'Calculus'], ['Derivative of sin x, cos x', 'd/dx (sin x) = cos x · d/dx (cos x) = −sin x', 'Calculus'], ['Derivative of tan x', 'd/dx (tan x) = sec²x', 'Calculus'],
      ['Product rule', 'd(uv)/dx = u dv/dx + v du/dx', 'Calculus'], ['Quotient rule', 'd(u/v)/dx = (v du/dx − u dv/dx) / v²', 'Calculus'], ['Chain rule', 'dy/dx = (dy/du)(du/dx)', 'Calculus'],
      ['Integral of a power', '∫xⁿ dx = xⁿ⁺¹/(n+1) + C  (n ≠ −1)', 'Calculus'], ['Integral of 1/x', '∫(1/x) dx = ln|x| + C', 'Calculus'], ['Integral of eˣ', '∫eˣ dx = eˣ + C', 'Calculus'], ['Integral of sin x, cos x', '∫sin x dx = −cos x + C · ∫cos x dx = sin x + C', 'Calculus'],
      ['Distance formula', 'd = √[(x₂ − x₁)² + (y₂ − y₁)²]', 'Coordinate geometry'], ['Section formula (internal)', '((m x₂ + n x₁)/(m + n), (m y₂ + n y₁)/(m + n))', 'Coordinate geometry'], ['Circle (centre h,k)', '(x − h)² + (y − k)² = r²', 'Coordinate geometry']]]
  };
  var refState = { tab: 'constants', q: '' };
  function refHTML() {
    var q = refState.q.trim().toLowerCase(), items;
    if (q) {
      items = []; Object.keys(REF).forEach(function (k) { REF[k][1].forEach(function (r) { if ((r.join(' ') + ' ' + REF[k][0]).toLowerCase().indexOf(q) > -1) items.push({ r: r, g: REF[k][0] }); }); });
    } else items = REF[refState.tab][1].map(function (r) { return { r: r, g: REF[refState.tab][0] }; });
    if (!items.length) return '<p class="px-empty">Nothing matches “' + E(refState.q) + '”. Try another word.</p>';
    return '<div class="px-refgrid">' + items.map(function (it, i) { return '<div class="px-ref"><small>' + E(q ? it.g + ' · ' : '') + E(it.r[2] || '') + '</small><b>' + E(it.r[0]) + '</b><code>' + E(it.r[1]) + '</code><button type="button" class="cp" data-pxcp="' + E(it.r[1]) + '" aria-label="Copy ' + E(it.r[0]) + '">⧉</button></div>'; }).join('') + '</div>';
  }
  function referencePage() {
    return '<section class="px-page"><span class="px-tag">STUDENT POWER TOOL</span><h1>' + E(settingText('referenceTitle', 'Reference Shelf — everything at hand')) + '</h1>' +
      '<p class="lead">' + E(settingText('referenceIntro', 'Physical constants, SI prefixes, Greek letters, common ions and the maths identities you keep looking up. Tap the copy button to paste a value into your notes.')) + '</p>' +
      '<div class="px-panel" style="margin-top:22px"><input class="px-in" id="pxRefQ" type="search" placeholder="Search everything (e.g. planck, sulfate, sin 2A)" value="' + E(refState.q) + '" aria-label="Search reference shelf">' +
      '<div class="px-tabs" id="pxRefTabs" role="tablist">' + Object.keys(REF).map(function (k) { return '<button type="button" class="px-chip" role="tab" data-pxtab="' + k + '" aria-pressed="' + (!refState.q && refState.tab === k) + '">' + REF[k][0] + '</button>'; }).join('') + '</div>' +
      '<div id="pxRefBody">' + refHTML() + '</div></div>' +
      '<p class="px-note" style="margin-top:16px">Constants follow CODATA 2018 values, rounded. Your exam paper may give slightly different values — always use the ones printed in the question.</p></section>';
  }
  function mountReference(app) {
    var q = $('#pxRefQ', app); if (!q) return;
    q.addEventListener('input', function () { refState.q = q.value; $('#pxRefBody').innerHTML = refHTML(); $$('#pxRefTabs .px-chip').forEach(function (c) { c.setAttribute('aria-pressed', !refState.q && c.getAttribute('data-pxtab') === refState.tab); }); });
    app.addEventListener('click', function (e) {
      var t = e.target.closest('[data-pxtab]'), c = e.target.closest('[data-pxcp]');
      if (t) { refState.tab = t.getAttribute('data-pxtab'); refState.q = ''; q.value = ''; $$('#pxRefTabs .px-chip').forEach(function (b) { b.setAttribute('aria-pressed', b === t); }); $('#pxRefBody').innerHTML = refHTML(); }
      else if (c) copyText(c.getAttribute('data-pxcp'));
    });
  }

  /* ---------- Progress card ---------- */
  function gameState() { try { if (api().GS) return api().GS(); } catch (e) { } return Object.assign({ xp: 0, streak: 0, sims: {}, games: {}, badges: {} }, jget('cl2', {})); }
  function levelOf(xp) { try { if (api().lvl) return api().lvl(xp); } catch (e) { } return { n: Math.floor(xp / 100) + 1, into: xp % 100, size: 100 }; }
  function studentName() { try { var s = api().student ? api().student() : jget('clstudent', null); return (s && s.name) || ''; } catch (e) { return ''; } }
  function levelTitle(n) { return n < 3 ? 'Curious Starter' : n < 6 ? 'Concept Explorer' : n < 10 ? 'Lab Scientist' : n < 15 ? 'Idea Architect' : 'Concept Master'; }
  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function cssVar(n, d) { var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || d; }
  function drawCard(cv, name, logo) {
    var W = 1080, H = 1350, c = cv.getContext('2d'), g = gameState(), xp = +g.xp || 0, lv = levelOf(xp), P = cssVar('--p', '#38bdf8'), S = cssVar('--s', '#7dd3fc'), A = cssVar('--a', '#fbbf24'), GL = cssVar('--glow', '#0ea5e9');
    var FF = 'Manrope,"Hind Siliguri",system-ui,sans-serif';
    cv.width = W; cv.height = H;
    c.fillStyle = '#02060c'; c.fillRect(0, 0, W, H);
    var r1 = c.createRadialGradient(180, 120, 20, 180, 120, 700); r1.addColorStop(0, 'rgba(14,165,233,.38)'); r1.addColorStop(1, 'rgba(14,165,233,0)'); c.fillStyle = r1; c.fillRect(0, 0, W, H);
    var r2 = c.createRadialGradient(960, 1180, 20, 960, 1180, 560); r2.addColorStop(0, 'rgba(251,191,36,.16)'); r2.addColorStop(1, 'rgba(251,191,36,0)'); c.fillStyle = r2; c.fillRect(0, 0, W, H);
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < 110; i++) { c.globalAlpha = .15 + rnd() * .5; c.fillStyle = '#cfeeff'; c.beginPath(); c.arc(rnd() * W, rnd() * H, .6 + rnd() * 1.6, 0, 7); c.fill(); } c.globalAlpha = 1;
    var bg = c.createLinearGradient(0, 0, W, H); bg.addColorStop(0, S); bg.addColorStop(.5, 'rgba(125,211,252,.12)'); bg.addColorStop(1, A); c.strokeStyle = bg; c.lineWidth = 3; rrect(c, 28, 28, W - 56, H - 56, 46); c.stroke();
    if (logo) { c.save(); rrect(c, 80, 78, 84, 84, 22); c.clip(); c.drawImage(logo, 80, 78, 84, 84); c.restore(); }
    c.fillStyle = '#f4fbff'; c.font = '800 40px ' + FF; c.textAlign = 'left'; c.fillText('ConceptLab', 184, 118);
    c.fillStyle = '#7fb6d4'; c.font = '600 21px ' + FF; c.fillText('Explore · Experiment · Understand', 184, 150);
    var cx = W / 2, cy = 470, R = 170;
    c.lineWidth = 18; c.lineCap = 'round'; c.strokeStyle = 'rgba(125,211,252,.14)'; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.stroke();
    var pr = c.createLinearGradient(cx - R, cy - R, cx + R, cy + R); pr.addColorStop(0, S); pr.addColorStop(.6, P); pr.addColorStop(1, A); c.strokeStyle = pr;
    var frac = Math.max(0.02, Math.min(1, lv.into / (lv.size || 100))); c.beginPath(); c.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); c.stroke();
    c.textAlign = 'center'; c.fillStyle = '#8fb6cf'; c.font = '800 24px ' + FF; c.fillText('L E V E L', cx, cy - 56);
    c.fillStyle = '#ffffff'; c.font = '800 140px ' + FF; c.fillText(String(lv.n), cx, cy + 66);
    var nm = (name || 'ConceptLab Learner').trim(), fs = 68; c.font = '800 ' + fs + 'px ' + FF; while (c.measureText(nm).width > W - 200 && fs > 30) { fs -= 2; c.font = '800 ' + fs + 'px ' + FF; }
    c.fillStyle = '#f4fbff'; c.fillText(nm, cx, 736);
    c.fillStyle = A; c.font = '800 30px ' + FF; c.fillText(levelTitle(lv.n).toUpperCase(), cx, 790);
    var stats = [['TOTAL XP', xp.toLocaleString('en-US')], ['DAY STREAK', String(+g.streak || 0)], ['SIMULATIONS TRIED', String(Object.keys(g.sims || {}).length)], ['GAMES PLAYED', String(Object.keys(g.games || {}).length)]];
    stats.forEach(function (s, i) {
      var x = 84 + (i % 2) * 468, y = 850 + Math.floor(i / 2) * 192, w = 444, h = 168;
      c.fillStyle = 'rgba(10,32,50,.82)'; rrect(c, x, y, w, h, 28); c.fill(); c.strokeStyle = 'rgba(125,211,252,.22)'; c.lineWidth = 2; rrect(c, x, y, w, h, 28); c.stroke();
      c.textAlign = 'left'; c.fillStyle = '#7fa3bb'; c.font = '800 21px ' + FF; c.fillText(s[0], x + 34, y + 54);
      var vg = c.createLinearGradient(x, y, x + w, y); vg.addColorStop(0, S); vg.addColorStop(1, P); c.fillStyle = vg; c.font = '800 70px ' + FF; c.fillText(s[1], x + 34, y + 128);
    });
    var bc = Object.keys(g.badges || {}).length; c.textAlign = 'center'; c.fillStyle = 'rgba(251,191,36,.14)'; rrect(c, cx - 190, 1222, 380, 56, 28); c.fill(); c.fillStyle = A; c.font = '800 25px ' + FF; c.fillText(bc + (bc === 1 ? ' BADGE EARNED' : ' BADGES EARNED'), cx, 1259);
    c.fillStyle = '#6f8da5'; c.font = '600 22px ' + FF; c.fillText(location.host + ' · ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), cx, 1304);
  }
  function cardPage() {
    return '<section class="px-page"><span class="px-tag">STUDENT POWER TOOL</span><h1>' + E(settingText('progressCardTitle', 'Progress Card — show off your level')) + '</h1>' +
      '<p class="lead">' + E(settingText('progressCardIntro', 'A shareable card built from your real ConceptLab progress: level, XP, streak, simulations, games and badges. Download it or share it with friends.')) + '</p>' +
      '<div class="px-cardwrap"><div><canvas id="pxCardCv" width="1080" height="1350" role="img" aria-label="Your ConceptLab progress card"></canvas></div>' +
      '<div class="px-panel px-cardctl"><div class="px-field"><label for="pxCardName"><span>Name on the card</span></label><input class="px-in" id="pxCardName" maxlength="32" placeholder="Your name" value="' + E(jget('clpx_name', '') || studentName()) + '"></div>' +
      '<div class="px-row"><button type="button" class="px-btn pri" id="pxCardDl">Download PNG</button><button type="button" class="px-btn" id="pxCardShare">Share</button></div>' +
      '<p class="px-note" style="margin:0">The card is generated on your device from the progress saved in this browser (or your signed-in account). Nothing is uploaded.</p></div></div></section>';
  }
  function mountCard(app) {
    var cv = $('#pxCardCv', app); if (!cv) return;
    var logo = new Image(), ready = false;
    function paint() { var p = (document.fonts && document.fonts.load) ? Promise.race([Promise.all([document.fonts.load('800 40px Manrope'), document.fonts.load('600 20px Manrope')]), new Promise(function (r) { setTimeout(r, 900); })]) : Promise.resolve(); p.then(function () { drawCard(cv, $('#pxCardName').value, ready ? logo : null); }, function () { drawCard(cv, $('#pxCardName').value, ready ? logo : null); }); }
    logo.onload = function () { ready = true; paint(); }; logo.onerror = function () { paint(); }; logo.src = 'assets/images/conceptlab-main-logo.webp'; paint();
    $('#pxCardName').addEventListener('input', function (e) { jset('clpx_name', e.target.value); paint(); });
    function blob(cb) { cv.toBlob(function (b) { cb(b); }, 'image/png'); }
    $('#pxCardDl').addEventListener('click', function () { blob(function (b) { if (!b) { toast('Could not create image'); return; } var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'conceptlab-progress-card.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000); toast('Card downloaded'); }); });
    $('#pxCardShare').addEventListener('click', function () { blob(function (b) { if (!b) return; var f; try { f = new File([b], 'conceptlab-progress-card.png', { type: 'image/png' }); } catch (e) { } if (f && navigator.canShare && navigator.canShare({ files: [f] })) navigator.share({ files: [f], title: 'My ConceptLab progress', text: 'My progress on ConceptLab — ' + location.origin }).catch(function () { }); else if (navigator.share) navigator.share({ title: 'My ConceptLab progress', text: 'Learn by doing on ConceptLab', url: location.origin }).catch(function () { }); else toast('Sharing isn’t supported here — use Download'); }); });
  }

  /* ---------- Appearance & public Settings ---------- */
  var ACCENTS = [['sky', 'Sky', '#7dd3fc', '#0ea5e9', null], ['violet', 'Violet', '#c4b5fd', '#8b5cf6', ['#a78bfa', '#c4b5fd', '#8b5cf6']], ['emerald', 'Emerald', '#6ee7b7', '#10b981', ['#34d399', '#6ee7b7', '#10b981']], ['rose', 'Rose', '#fda4af', '#f43f5e', ['#fb7185', '#fda4af', '#f43f5e']], ['amber', 'Amber', '#fcd34d', '#f59e0b', ['#fbbf24', '#fcd34d', '#f59e0b']]];
  function prefs() {
    var s = settings();
    return Object.assign({
      accent: s.defaultAccent || 'sky', fx: flagOn(s.defaultFx), calm: flagOn(s.defaultCalm), contrast: flagOn(s.defaultContrast),
      bnFont: s.defaultBanglaFont || 'hind', enFont: s.defaultEnglishFont || 'inter', scale: String(s.defaultFontScale || '100'),
      density: s.defaultDensity || 'comfortable', corners: s.defaultCorners || 'rounded',
      content: s.defaultContentWidth || 'standard'
    }, jget('clpx_prefs', {}));
  }
  function applyPrefs() {
    var p = prefs(), st = $('#clpxTheme');
    if (!st) { st = document.createElement('style'); st.id = 'clpxTheme'; document.head.appendChild(st); }
    var a = ACCENTS.filter(function (x) { return x[0] === p.accent; })[0], css = '';
    if (a && a[4]) css += ':root{--p:' + a[4][0] + '!important;--s:' + a[4][1] + '!important;--glow:' + a[4][2] + '!important}';
    if (!p.fx) css += '#stars,.horizon{display:none!important}';
    var banglaFonts = {
      hind: '"Hind Siliguri",sans-serif', noto: '"Noto Sans Bengali",sans-serif',
      notoserif: '"Noto Serif Bengali",serif', anek: '"Anek Bangla","Noto Sans Bengali",sans-serif',
      atma: 'Atma,"Noto Sans Bengali",sans-serif', baloo: '"Baloo Da 2","Noto Sans Bengali",sans-serif',
      mina: 'Mina,"Noto Sans Bengali",sans-serif', tiro: '"Tiro Bangla","Noto Serif Bengali",serif',
      galada: 'Galada,"Noto Sans Bengali",sans-serif', mukti: 'Mukti,"Noto Sans Bengali",sans-serif',
      kalpurush: 'Kalpurush,"Hind Siliguri",sans-serif', solaiman: 'SolaimanLipi,"Hind Siliguri",sans-serif',
      system: 'system-ui,sans-serif'
    };
    var englishFonts = {
      inter: 'Inter,sans-serif', manrope: 'Manrope,sans-serif', roboto: 'Roboto,sans-serif',
      poppins: 'Poppins,sans-serif', lora: 'Lora,serif', amiri: 'Amiri,serif',
      system: 'system-ui,sans-serif', serif: 'Georgia,serif'
    };
    css += 'html{font-size:' + ({'90':'90%','95':'95%','100':'100%','105':'105%','110':'110%','120':'120%'}[String(p.scale)] || '100%') + '!important;}';
    css += 'body,body button,body input,body select,body textarea,body .pgw,body .px-page,body .hub,body header,body footer{font-family:' + (englishFonts[p.enFont] || englishFonts.inter) + ',' + (banglaFonts[p.bnFont] || banglaFonts.hind) + ',sans-serif!important;}';
    var widths = { narrow: '900px', standard: '1160px', wide: '1400px' };
    css += 'main#app>.w,main#app>.pgw,main#app>.px-page,.px-page{max-width:' + (widths[p.content] || widths.standard) + '!important;}';
    if (p.density === 'compact') css += '.card,.px-panel,.hubc,.px-power-card,.profile-head,.study-panel{padding:clamp(10px,2vw,14px)!important}.px-panel{border-radius:14px!important}.px-power-grid{gap:9px!important}.pgw h1{margin-top:8px!important;margin-bottom:8px!important}';
    if (p.corners === 'crisp') css += '.card,.px-panel,.hubc,.px-power-card,.px-ref,.px-switch,.btn,.px-btn,.hub-in{border-radius:9px!important}';
    if (p.line === 'relaxed') css += 'body,body p,body li,body .lead{line-height:1.85!important}'; else if (p.line === 'tight') css += 'body,body p,body li,body .lead{line-height:1.35!important}';
    if (p.contrast) css += 'body{color:#fff!important}body .lead,body .mutt,body .px-note,body .px-set p{color:#d5e3ee!important}body .card,body .px-panel,body .hubc,body input,body select,body textarea{border-color:rgba(190,225,255,.42)!important}';
    st.textContent = css;
    document.body.classList.toggle('px-calm', !!p.calm);
    document.body.classList.toggle('px-high-contrast', !!p.contrast);
    document.body.classList.toggle('px-compact', p.density === 'compact');
  }
  var deferredInstall = null, isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent), isStandalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone;
  function installable() { return !isStandalone && (deferredInstall || isIOS); }
  function doInstall() {
    if (deferredInstall) { deferredInstall.prompt(); deferredInstall.userChoice.then(function () { deferredInstall = null; syncInstall(); }); }
    else if (isIOS) toast('Tap Share, then “Add to Home Screen”');
    else toast('Use your browser menu → Install app');
  }
  function syncInstall() {
    var li = $('#pfInstallLi'); if (li) li.hidden = !installable();
    var b = $('#pxInstallBtn'); if (b) b.hidden = !installable();
    var n = $('#pxInstallNote'); if (n) n.textContent = isStandalone ? 'ConceptLab is already installed on this device.' : (installable() ? 'Install ConceptLab like an app — it opens full-screen and keeps working on weak connections.' : 'Your browser hasn’t offered installation yet. Open the browser menu and look for “Install app” or “Add to Home Screen”.');
  }
  function prefOptions() {
    var p = prefs();
    return '<div class="px-pref-grid">' +
      '<section class="px-pref-section"><h3>Accent colour</h3><p>Button, highlight and glow colours.</p><div class="px-swatches" role="group" aria-label="Accent colour">' + ACCENTS.map(function (a) { return '<button type="button" class="px-swatch" data-pxacc="' + a[0] + '" aria-pressed="' + (p.accent === a[0]) + '" aria-label="' + a[1] + '" style="--c1:' + a[2] + ';--c2:' + a[3] + '"><span>' + a[1] + '</span></button>'; }).join('') + '</div></section>' +
      '<section class="px-pref-section"><h3>Fonts · ফন্ট</h3><p>বাংলা ও English ফন্ট আলাদাভাবে বেছে নিন। একটি বদলালে অন্যটি বদলাবে না।</p>' +
      '<label class="px-pref-label">বাংলা ফন্ট (শুধু বাংলা অক্ষর)<select class="px-in" data-pxpref="bnFont">' +
      [['hind','Hind Siliguri · পরিষ্কার ও আধুনিক'],['noto','Noto Sans Bengali · সহজপাঠ্য'],['notoserif','Noto Serif Bengali · Serif'],['anek','Anek Bangla · Contemporary'],['atma','Atma · Rounded'],['baloo','Baloo Da 2 · Friendly'],['mina','Mina · Bengali text'],['tiro','Tiro Bangla · Serif'],['galada','Galada · Decorative'],['mukti','Mukti · Classic'],['kalpurush','Kalpurush · যদি ডিভাইসে থাকে'],['solaiman','SolaimanLipi · যদি ডিভাইসে থাকে'],['system','System Bengali fallback']].map(function (f) { return '<option value="' + f[0] + '" ' + (p.bnFont === f[0] ? 'selected' : '') + '>' + E(f[1]) + '</option>'; }).join('') +
      '</select><small class="px-note">বাংলা অক্ষরের জন্যই এই নির্বাচন প্রযোজ্য। কিছু স্থানীয় ফন্ট ডিভাইসে ইনস্টল থাকা প্রয়োজন।</small></label>' +
      '<label class="px-pref-label">English font (English letters only)<select class="px-in" data-pxpref="enFont">' +
      [['inter','Inter · Clean UI'],['manrope','Manrope · Modern'],['roboto','Roboto · Familiar'],['poppins','Poppins · Geometric'],['lora','Lora · Editorial serif'],['amiri','Amiri · Classic serif'],['serif','Georgia · System serif'],['system','System default']].map(function (f) { return '<option value="' + f[0] + '" ' + (p.enFont === f[0] ? 'selected' : '') + '>' + E(f[1]) + '</option>'; }).join('') +
      '</select><small class="px-note">This choice changes English/Latin letters only, not Bengali glyphs.</small></label></section>' +
      '<section class="px-pref-section"><h3>Text size</h3><p>Adjust the overall interface scale for your screen.</p><label class="px-pref-label">Text scaling<select class="px-in" data-pxpref="scale"><option value="90" ' + (String(p.scale) === '90' ? 'selected' : '') + '>Small · 90%</option><option value="95" ' + (String(p.scale) === '95' ? 'selected' : '') + '>Compact · 95%</option><option value="100" ' + (String(p.scale) === '100' ? 'selected' : '') + '>Standard · 100%</option><option value="105" ' + (String(p.scale) === '105' ? 'selected' : '') + '>Large · 105%</option><option value="110" ' + (String(p.scale) === '110' ? 'selected' : '') + '>Extra large · 110%</option><option value="120" ' + (String(p.scale) === '120' ? 'selected' : '') + '>Largest · 120%</option></select></label></section>' +
      '<section class="px-pref-section"><h3>Reading & language</h3><p>আরও আরামদায়কভাবে পড়ুন।</p><label class="px-pref-label">Lesson line spacing<select class="px-in" data-pxpref="line"><option value="normal" ' + (p.line === 'normal' ? 'selected' : '') + '>Normal</option><option value="relaxed" ' + (p.line === 'relaxed' ? 'selected' : '') + '>Relaxed · পড়তে আরাম</option><option value="tight" ' + (p.line === 'tight' ? 'selected' : '') + '>Tight · বেশি কনটেন্ট</option></select></label><label class="px-pref-label">Interface language<select class="px-in" data-pxpref="language"><option value="mixed" ' + ((p.language || 'mixed') === 'mixed' ? 'selected' : '') + '>বাংলা + English</option><option value="bn" ' + (p.language === 'bn' ? 'selected' : '') + '>বাংলা অগ্রাধিকার</option><option value="en" ' + (p.language === 'en' ? 'selected' : '') + '>English অগ্রাধিকার</option></select></label></section>' +
      '<section class="px-pref-section"><h3>Layout</h3><p>Choose comfortable or compact spacing.</p><label class="px-pref-label">Card spacing<select class="px-in" data-pxpref="density"><option value="comfortable" ' + (p.density === 'comfortable' ? 'selected' : '') + '>Comfortable</option><option value="compact" ' + (p.density === 'compact' ? 'selected' : '') + '>Compact · save screen space</option></select></label><label class="px-pref-label">Content width<select class="px-in" data-pxpref="content"><option value="narrow" ' + (p.content === 'narrow' ? 'selected' : '') + '>Narrow · focused reading</option><option value="standard" ' + (p.content === 'standard' ? 'selected' : '') + '>Standard</option><option value="wide" ' + (p.content === 'wide' ? 'selected' : '') + '>Wide</option></select></label><label class="px-pref-label">Corner style<select class="px-in" data-pxpref="corners"><option value="rounded" ' + (p.corners === 'rounded' ? 'selected' : '') + '>Rounded</option><option value="crisp" ' + (p.corners === 'crisp' ? 'selected' : '') + '>Crisp · less rounded</option></select></label></section>' +
      '<section class="px-pref-section"><h3>Motion & accessibility</h3>' +
      '<div class="px-switch"><div><b>Animated background</b><small>Stars and horizon glow</small></div><button type="button" class="px-toggle" role="switch" data-pxtog="fx" aria-checked="' + (!!p.fx) + '" aria-label="Animated background"></button></div>' +
      '<div class="px-switch"><div><b>Calm mode</b><small>Reduces animation and transitions</small></div><button type="button" class="px-toggle" role="switch" data-pxtog="calm" aria-checked="' + (!!p.calm) + '" aria-label="Calm mode"></button></div>' +
      '<div class="px-switch"><div><b>Higher contrast</b><small>Stronger text and control borders</small></div><button type="button" class="px-toggle" role="switch" data-pxtog="contrast" aria-checked="' + (!!p.contrast) + '" aria-label="Higher contrast"></button></div></section>' +
      '</div>';
  }
  function settingsPage() {
    var s = api().student ? api().student() : null;
    if (!flagOn(settings().allowGuestSettings) && !s) return '<section class="px-page"><span class="px-tag">CONCEPTLAB SETTINGS</span><h1>Settings</h1><p class="lead">ব্যক্তিগত Settings ব্যবহার করতে সাইন ইন করুন।</p><a class="px-btn pri" href="#/account/signin">Sign in</a></section>';
    return '<section class="px-page px-settings-page"><span class="px-tag">CONCEPTLAB SETTINGS</span><h1>' + E(settingText('settingsTitle', 'Settings — your learning space')) + '</h1>' +
      '<p class="lead">' + E(settingText('settingsIntro', 'অ্যাকাউন্ট ছাড়াই ওয়েবসাইটের ফন্ট, টেক্সট সাইজ, রং, লেআউট ও অ্যানিমেশন বদলাতে পারবেন। পরিবর্তন এই ডিভাইসে সংরক্ষিত হবে।')) + '</p>' +
      '<div class="px-panel px-set">' + prefOptions() + '<div class="px-settings-actions">' + (s ? '<a class="px-btn" href="#/profile">My profile</a><a class="px-btn" href="#/edit-profile">Edit profile</a>' : '<a class="px-btn" href="#/account/signup">Create an account (optional)</a>') + '</div><section><button type="button" class="px-btn" data-pxreset>Reset preferences</button></section></div>' +
      '<p class="px-note" style="margin-top:14px">প্রাইভেসি নোট: এই পছন্দগুলো লোকাল ব্রাউজার স্টোরেজে থাকে; পাসওয়ার্ড বা ব্যক্তিগত তথ্য এখানে চাওয়া হয় না।</p></section>';
  }
  function mountPreferences(app) {
    syncInstall();
    if (app._prefBound) return;
    app._prefBound = true;
    app.addEventListener('click', function (e) {
      var a = e.target.closest('[data-pxacc]'), t = e.target.closest('[data-pxtog]'), r = e.target.closest('[data-pxreset]'), i = e.target.closest('#pxInstallBtn');
      var p = prefs();
      if (a) {
        p.accent = a.getAttribute('data-pxacc'); jset('clpx_prefs', p); applyPrefs();
        $$('.px-swatch', app).forEach(function (b) { b.setAttribute('aria-pressed', b === a); }); toast('Accent colour saved');
      } else if (t) {
        var k = t.getAttribute('data-pxtog'); p[k] = !p[k]; jset('clpx_prefs', p); applyPrefs(); t.setAttribute('aria-checked', p[k]); toast('Preference saved');
      } else if (r) {
        jset('clpx_prefs', {}); applyPrefs();
        var pg = (location.hash.replace(/^#\/?/, '').split('/')[0] || 'settings');
        app.innerHTML = settingsPage(); syncInstall(); toast('Preferences reset');
      } else if (i) doInstall();
    });
    app.addEventListener('change', function (e) {
      var el = e.target.closest('[data-pxpref]'); if (!el) return;
      var key = el.getAttribute('data-pxpref'), val = el.value, allowed = {
        bnFont: ['hind','noto','notoserif','anek','atma','baloo','mina','tiro','galada','mukti','kalpurush','solaiman','system'], enFont: ['inter','manrope','roboto','poppins','lora','amiri','serif','system'], line: ['normal','relaxed','tight'], language: ['mixed','bn','en'], scale: ['90','95','100','105','110','120'],
        density: ['comfortable','compact'], corners: ['rounded','crisp'], content: ['narrow','standard','wide']
      };
      if (!allowed[key] || allowed[key].indexOf(val) < 0) return;
      var p = prefs(); p[key] = val; jset('clpx_prefs', p); applyPrefs(); toast('Settings saved');
    });
  }

  /* ---------- Home "power tools" strip ---------- */
  var TOOLS = [
    ['#/solver', '🧮', 'Formula Solver', FORMS.length+' formulas across Physics, Chemistry and Math, solved step by step.', '#38bdf8'],
    ['#/reference', '📚', 'Reference Shelf', 'Constants, ions, identities and prefixes — searchable and copy-ready.', '#34d399'],
    ['#/share-card', '🏅', 'Progress Card', 'Turn your level, XP and streak into a shareable image.', '#fbbf24'],
    ['#/settings', '⚙️', 'Settings', 'Fonts, text size, contrast and responsive layout.', '#fb7185']
  ];
  function powerStrip(app) {
    if ($('.px-power', app) || !flagOn(settings().premiumHome)) return;
    app.insertAdjacentHTML('beforeend', '<section class="px-power" aria-label="Student power tools"><div class="px-power-head"><span class="px-tag">STUDENT POWER TOOLS</span><h2>Study smarter, <em>not harder.</em></h2><p>Handy tools that sit beside your lessons — no sign-up needed.</p></div><div class="px-power-grid">' +
      TOOLS.map(function (t) { return '<a class="px-power-card" href="' + t[0] + '" style="--c:' + t[4] + '"><span class="ic" aria-hidden="true">' + t[1] + '</span><b>' + E(t[2]) + '</b><small>' + E(t[3]) + '</small><span class="go">Open →</span></a>'; }).join('') + '</div></section>');
  }

  /* ---------- progress bar and navigation ---------- */
  function ensureChrome() {
    var S = settings();
    if (!$('.px-progress')) { var pb = document.createElement('div'); pb.className = 'px-progress'; pb.setAttribute('aria-hidden', 'true'); pb.innerHTML = '<i></i>'; document.body.appendChild(pb); }
    $('.px-progress').hidden = !flagOn(S.premiumProgress);
    /* The old floating + quick dock is intentionally removed; all tools live in the three-line menu and Student Hub. */
    var oldDock = $('#pxDock'); if (oldDock) oldDock.remove();
  }
  var barTick = false;
  function updateBar() {
    if (barTick) return; barTick = true;
    requestAnimationFrame(function () { barTick = false; var i = $('.px-progress i'); if (!i) return; var h = document.documentElement, max = h.scrollHeight - h.clientHeight; i.style.transform = 'scaleX(' + (max > 8 ? Math.min(1, (window.pageYOffset || h.scrollTop) / max) : 0) + ')'; });
  }
  /* The built-in navigation is rendered from admin-managed defaults.js. Do not append a second, non-editable menu. */
  function menuGroup() { return; }

  /* ---------- footer / PWA sync ---------- */
  function syncFooter() { syncInstall(); }

  /* ---------- PWA ---------- */
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferredInstall = e; syncInstall(); });
  window.addEventListener('appinstalled', function () { deferredInstall = null; isStandalone = true; syncInstall(); toast('ConceptLab installed'); });
  function registerSW() { if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { }); }); }

  /* ---------- wiring into the existing router ---------- */
  function mount(pg, app) {
    try {
      applyPrefs(); ensureChrome(); menuGroup(); syncFooter(); updateBar();
      if (pg === 'solver') mountSolver(app); else if (pg === 'reference') mountReference(app); else if (pg === 'share-card') mountCard(app); else if (pg === 'settings' || pg === 'appearance') mountPreferences(app);
      else if (pg === '' || pg === 'home') powerStrip(app);
    } catch (e) { console.error('ConceptLab premium layer:', e); }
  }
  var hub = window.CL_HUB = window.CL_HUB || { pages: {}, mount: function () { } };
  hub.pages = hub.pages || {};
  hub.pages.solver = function () { return solverPage(); };
  hub.pages.reference = function () { return referencePage(); };
  hub.pages['share-card'] = function () { return cardPage(); };
  hub.pages.appearance = function () { return settingsPage(); };
  hub.pages.settings = function () { return settingsPage(); };
  var origMount = hub.mount;
  hub.mount = function (pg, app) { try { origMount && origMount.call(hub, pg, app); } catch (e) { console.error(e); } mount(pg, app); };

  function init() {
    applyPrefs(); ensureChrome(); menuGroup(); syncFooter(); registerSW();
    window.addEventListener('scroll', updateBar, { passive: true }); window.addEventListener('resize', updateBar);
    var nav = $('#nav'); if (nav && window.MutationObserver) new MutationObserver(function () { menuGroup(); }).observe(nav, { childList: true });
    var burger = $('#burger'); if (burger && window.MutationObserver) new MutationObserver(function () { document.body.classList.toggle('px-nav-open', burger.getAttribute('aria-expanded') === 'true'); }).observe(burger, { attributes: true, attributeFilter: ['aria-expanded'] });
    document.addEventListener('click', function (e) {
      if (e.target.closest('#ftop')) { e.preventDefault(); window.scrollTo({ top: 0, behavior: document.body.classList.contains('px-calm') ? 'auto' : 'smooth' }); }
      else if (e.target.closest('#pfInstall')) { e.preventDefault(); doInstall(); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.CL_PREMIUM = { forms: FORMS, compute: compute, parseNum: parseNum, sig: sig };
})();
