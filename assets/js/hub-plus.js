/* ConceptLab Student Hub Plus v12 — tool framework.
   Lets new study tools live at #/hub/<id> next to the existing Hub tools.
   A tool is: { id, icon, label, desc, group, priority, highlight, render(), mount(root), unmount(), click(el,e), change(el,e), input(el,e), key(e) }.
   Tools call HP.paint() to re-render their body. Everything is client-side (localStorage). */
(function () {
  'use strict';
  var TOOLS = [], hooks = { spotlight: [] }, active = null, bound = false;

  /* ---------- helpers ---------- */
  var BN = '০১২৩৪৫৬৭৮৯';
  var u = {
    E: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    bd: function (s) { return String(s).replace(/\d/g, function (d) { return BN[+d]; }); },
    uid: function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); },
    pad: function (n) { return (n < 10 ? '0' : '') + n; },
    hms: function (sec) { sec = Math.max(0, Math.floor(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return (h ? h + ':' + u.pad(m) : u.pad(m)) + ':' + u.pad(s); },
    dur: function (sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60); if (!h && !m) return u.bd(sec) + ' সে'; return (h ? u.bd(h) + ' ঘ ' : '') + (m || !h ? u.bd(m) + ' মি' : '').trim(); },
    dayKey: function (d) { d = d instanceof Date ? d : new Date(d); return d.getFullYear() + '-' + u.pad(d.getMonth() + 1) + '-' + u.pad(d.getDate()); },
    load: function (k, def) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; } catch (e) { return def; } },
    save: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    toast: function (msg) {
      var t = document.getElementById('hpToast');
      if (!t) { t = document.createElement('div'); t.id = 'hpToast'; t.className = 'hp-toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
      t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('on'); }, 2600);
    },
    beep: function (pattern) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        var c = u._ac || (u._ac = new AC()); if (c.state === 'suspended') c.resume();
        (pattern || [[880, 0, .18], [1175, .22, .18], [1480, .44, .3]]).forEach(function (p) {
          var o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = p[0];
          g.gain.setValueAtTime(0, c.currentTime + p[1]); g.gain.linearRampToValueAtTime(.18, c.currentTime + p[1] + .02); g.gain.exponentialRampToValueAtTime(.001, c.currentTime + p[1] + p[2]);
          o.connect(g); g.connect(c.destination); o.start(c.currentTime + p[1]); o.stop(c.currentTime + p[1] + p[2] + .05);
        });
        if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
      } catch (e) { }
    },
    download: function (name, text, type) {
      try { var b = new Blob([text], { type: type || 'text/plain;charset=utf-8' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400); } catch (e) { u.toast('ডাউনলোড করা যায়নি'); }
    },
    copy: function (text) {
      if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).then(function () { u.toast('কপি হয়েছে'); }, function () { u.toast('কপি করা যায়নি'); });
      u.toast('এই ব্রাউজারে কপি সমর্থিত নয়');
    }
  };

  /* ---------- routing ---------- */
  function routeId() { return (location.hash.replace(/^#\/?/, '').split('/')[1] || '').split('?')[0]; }
  function byId(id) { for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i].id === id) return TOOLS[i]; return null; }

  function page(t) {
    return '<section class="w pgw hub hub-tool-page hp hp-' + t.id + '"><div class="hub-tool-page-nav"><a class="btn ghost" href="#/hub">← সব টুল</a></div>' +
      '<h1>' + u.E(t.label) + '</h1><p class="lead hp-lead">' + u.E(t.desc) + '</p><div class="hp-body" id="hpBody" data-hp="' + t.id + '">' + t.render() + '</div></section>';
  }
  function paint() {
    var t = active; if (!t) return; var b = document.getElementById('hpBody'); if (!b) return;
    var y = window.scrollY; b.innerHTML = t.render(); if (t.afterPaint) t.afterPaint(b); window.scrollTo(0, y);
  }

  var hub = window.CL_HUB = window.CL_HUB || { pages: {}, mount: function () { } };
  var origPage = hub.pages.hub, prevMount = hub.mount;
  hub.pages.hub = function () {
    var t = byId(routeId());
    if (t) return page(t);
    var html = origPage ? origPage.apply(this, arguments) : '';
    var spot = hooks.spotlight.map(function (f) { try { return f() || ''; } catch (e) { return ''; } }).join('');
    var marker = '<section class="hub-tool-box card" id="hub-tools">';
    return spot && html.indexOf(marker) >= 0 ? html.replace(marker, spot + marker) : html;
  };
  hub.mount = function (pg, app) {
    var t = pg === 'hub' ? byId(routeId()) : null;
    if (active && active !== t && active.unmount) { try { active.unmount(); } catch (e) { } }
    active = t;
    if (!t) { if (prevMount) prevMount(pg, app); return; }
    if (t.mount) t.mount(document.getElementById('hpBody'));
    if (!bound) { bound = true; bind(app); }
  };
  function bind(app) {
    app.addEventListener('click', function (e) { if (!active || !active.click) return; var el = e.target.closest && e.target.closest('[data-a]'); if (el && el.closest('#hpBody')) active.click(el, e); });
    app.addEventListener('change', function (e) { if (active && active.change && e.target.closest && e.target.closest('#hpBody')) active.change(e.target, e); });
    app.addEventListener('input', function (e) { if (active && active.input && e.target.closest && e.target.closest('#hpBody')) active.input(e.target, e); });
    app.addEventListener('keydown', function (e) { if (active && active.key && e.target.closest && e.target.closest('#hpBody')) active.key(e, e.target); });
  }

  /* ---------- registration ---------- */
  function add(t) {
    TOOLS.push(t);
    var S = window.CL_STUDIO = window.CL_STUDIO || { tiles: [] }; S.tiles = S.tiles || [];
    S.tiles.push({ href: '#/hub/' + t.id, icon: t.icon, label: t.label, desc: t.desc, group: t.group || 'tools', priority: t.priority || 0, highlight: !!t.highlight });
  }
  window.CL_HUBPLUS = { add: add, paint: paint, u: u, byId: byId, hooks: hooks, tools: TOOLS };
})();
