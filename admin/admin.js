(function () {
  var $ = function (s) { return document.querySelector(s); }, root = $('#root');
  var T = localStorage.getItem('clt') || '', ME = localStorage.getItem('clu') || '', D = null, sec = 'dashboard', cur = -1, dirty = false;
  var SUBS = {}, DEF = window.CL_DEF, SCH = window.CL_SCHEMA;
  var SIMS = { atomBasics: 'Atom structure / particle counts', rutherfordModel: 'Rutherford nuclear atom model', planckQuantum: 'Planck energy quanta', deBroglie: 'de Broglie matter wave', uncertainty: 'Heisenberg uncertainty', quantumNumbers: 'Four quantum-number validator', spinOrbitalDiagram: 'Electron spin & orbital diagram', bohr: 'Bohr shell explorer', rutherford: 'Rutherford alpha scattering', dalton: 'Dalton atom model', atomCounting: 'Atom counting model', thomson: 'Thomson plum-pudding model', cathode: 'Cathode-ray tube', spectrum: 'Energy-level spectrum', emissionLines: 'Emission transition', quantum: 'Quantum-number validity', quantumSpin: 'Electron spin selector', orbitals: 'Orbital shape explorer', orbitalCapacity: 'Subshell capacity', aufbau: 'Orbital filling diagram', nplusl: '(n+l) filling rule', pauli: 'Pauli exclusion model', isotope: 'Nucleus / isotope model', isotone: 'Isotone comparison', atomicNotation: 'Atomic notation calculator', atomicNotation2: 'Nuclide symbol builder', valence: 'Valence-electron model', hund: 'Hund rule (p orbitals)', ionization: 'Ionization-energy trend', electroncloud: 'Electron probability cloud', isotopeCompare: 'Isotope comparison', shellCapacity: '2n² shell capacity', orbitalCount: 'Orbital count by l', aufbauOrder: 'Aufbau order explorer', hundRule: 'Hund rule (d orbitals)', electronConfig: 'Electron configuration builder', valenceShell: 'Valence shell explorer', line: 'Straight line graph', force: 'Force and motion', flame: 'Flame test colours', wave: 'Wave machine', projectile: 'Projectile launcher', pendulum: 'Pendulum', spring: 'Spring and mass', circuit: 'Ohm’s law circuit', gas: 'Gas particles', vectors: 'Vector adder', unit: 'Unit circle', tangent: 'Derivative / tangent zoom', matrix: 'Matrix transformer', circle: 'Circle explorer', kinetics: 'Reaction kinetics', equilibrium: 'Chemical equilibrium', ph: 'pH explorer', titration: 'Acid–base titration', electrochem: 'Electrochemical cell', optics: 'Thin lens optics', magnetic: 'Magnetic field', periodic: 'Periodic trends', bond: 'Chemical bonding & polarity', stoich: 'Stoichiometry / limiting reagent', integration: 'Definite integral area model', probability: 'Probability trials', custom: 'Custom (paste your own HTML/JS)', none: 'No simulation' };
  var NAV = [['dashboard', 'Dashboard'], ['registry', 'Feature Registry'], ['pages', 'Pages & Tabs'], ['students', 'Students & Accounts'], ['feedback', 'Feedback'], ['home', 'Home Page'], ['roadmap', 'Roadmap'], ['chapters', 'Chapters'], ['games', 'Games (Arcade)'], ['labs', 'Simulations (Lab)'], ['daily', 'Daily & Missions'], ['practice', 'Practice & Sync'], ['questions', 'Question Bank'], ['insights', 'Learning Insights'], ['health', 'Content Health'], ['backup', 'Backup & History'], ['rewards', 'XP & Badges'], ['subjects', 'Subjects'], ['texts', 'All Texts'], ['media', 'Images / Media'], ['theme', 'Theme / Colors'], ['important-notice', 'Important Notice'], ['settings', 'Website Settings'], ['footer', 'Footer & Social Media'], ['team', 'Team & Password']];
  var TITLES = { registry: 'Feature Registry & Advanced Controls', pages: 'Pages & Tabs', daily: 'Daily Challenge & Missions', practice: 'Smart Practice & Cloud Sync', questions: 'Question Bank', insights: 'Learning Insights', health: 'Content Health', backup: 'Backup & Version History', dashboard: 'Dashboard', students: 'Students & Accounts', feedback: 'Feedback', home: 'Home Page', roadmap: 'Roadmap', chapters: 'Chapters', games: 'Games (Arcade)', labs: 'Simulations (Lab)', rewards: 'XP & Badges', theme: 'Theme / Colors', settings: 'Website Settings', 'important-notice': 'Important Notice', footer: 'Footer & Social Media', team: 'Team & Password', subjects: 'Subjects', texts: 'All Texts', media: 'Images / Media' };
  var YN = { 1: 'Visible', 0: 'Hidden' };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function rid(p) { return (p || 'x') + '-' + Date.now().toString(36) + Math.floor(Math.random() * 1e3).toString(36); }
  function E(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function toast(t, bad) { var x = $('#toast'); x.textContent = t; x.className = 'on' + (bad ? ' bad' : ''); clearTimeout(toast.t); toast.t = setTimeout(function () { x.className = ''; }, 3200); }
  function api(m, p, b) {
    return fetch('/api' + p, { method: m, headers: { 'content-type': 'application/json', authorization: 'Bearer ' + T }, body: b ? JSON.stringify(b) : undefined })
      .then(function (r) { return r.json().then(function (j) { if (r.status === 401 && T && p !== '/login') { out(); throw new Error(j.error); } if (!r.ok) throw new Error(j.error || 'Error ' + r.status); return j; }); });
  }
  function out() { localStorage.removeItem('clt'); T = ''; boot(); }
  function get(o, p) { return p.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function set(o, p, v) { var k = p.split('.'), l = k.pop(), t = o; k.forEach(function (x) { if (t[x] == null) t[x] = /^\d+$/.test(l) && k[k.length - 1] === x ? [] : {}; t = t[x]; }); t[l] = v; }
  function F(l, p, k, h) {
    var v = get(D, p); v = v == null ? '' : v; if (k === 'img') return imgF(l, p, v);
    return '<label class="f"><span>' + l + '</span>' + (k === 'area' ? '<textarea rows="' + (h || 4) + '" data-p="' + p + '">' + E(v) + '</textarea>' : '<input type="' + (k === 'num' ? 'number' : (k || 'text')) + '"' + (k === 'num' ? ' data-num="1"' : '') + ' data-p="' + p + '" value="' + E(v) + '">') + '</label>';
  }
  function SEL(l, p, o) { var v = get(D, p); return '<label class="f"><span>' + l + '</span><select data-p="' + p + '">' + Object.keys(o).map(function (k) { return '<option value="' + k + '"' + (k == v ? ' selected' : '') + '>' + E(o[k]) + '</option>'; }).join('') + '</select></label>'; }
  function fld(p, fd) { var k = fd[2]; if (k === 'sel') return SEL(fd[1], p, fd[3]); return F(fd[1], p, k, fd[3]); }
  function imgF(l, p, v) { return '<div class="f"><span>' + l + '</span><div class="im">' + (v ? '<img src="' + E(v) + '" alt="">' : '') + '<input data-p="' + p + '" value="' + E(v) + '" placeholder="Image link, or press Choose"><button class="b2" data-pick="' + p + '">Choose / upload</button></div></div>'; }
  function sync() { SUBS = {}; D.subjects.forEach(function (s) { SUBS[s.id] = s.name; }); }

  /* ---------- generic list editor ---------- */
  var TPL = {
    mission: function () { return { id: rid('m'), i: '🎯', t: 'New mission', d: '', s: '', xp: 20, on: true, link: '#/chapters', hint: '', goals: [{ k: 'stages', n: 3 }] }; },
    g_odd: function () { return { q: '', i: ['', '', '', ''], odd: 0, why: '' }; },
    g_step: function () { return { t: '', steps: ['', '', '', ''], why: '' }; },
    sec_t: function () { return { t: 'New' }; },
    sec_stat: function () { return { t: 'New number', k: 'custom', v: '10' }; },
    sec_goal: function () { return { i: 'lightbulb', tag: 'NEW FEATURE', color: '#38bdf8', image: '', t: 'New card', p: '' }; },
    sec_stage: function () { return { t: 'New stage', tag: 'EXPLORE', p: '', i: 'sparkles', color: '#38bdf8', image: '' }; },
    sec_road: function () { return { d: 'Phase', t: 'New step', p: '', s: 'next' }; },
    sec_faq: function () { return { q: 'New question', a: '' }; },
    g_q: function () { return { q: '', o: ['', '', '', ''], a: 0, e: '' }; },
    g_pair: function () { return { a: '', b: '' }; },
    g_tf: function () { return { s: '', t: 'true', e: '' }; },
    g_word: function () { return { w: '', h: '' }; },
    g_eq: function () { return 'H₂ + O₂ → H₂O'; },
    g_ion: function () { return { n: 'New ion', c: '#38bdf8', l: '' }; },
    badge: function () { return { id: rid('b'), i: '⭐', t: 'New badge', d: 'Describe how to earn it', k: 'xp', n: 50 }; }
  };
  function listEd(path, title, fields, tpl, hint) {
    var arr = get(D, path) || [], h = '<h3 class="gh">' + title + ' <span class="cnt">' + arr.length + '</span></h3>' + (hint ? '<p class="hint">' + hint + '</p>' : '');
    arr.forEach(function (it, i) {
      var B = path + '.' + i;
      h += '<div class="qc"><div class="qh"><b>#' + (i + 1) + '</b><span><button data-lm="' + path + '|' + i + '|-1">↑</button> <button data-lm="' + path + '|' + i + '|1">↓</button> <button data-ld="' + path + '|' + i + '">Remove</button></span></div>' +
        fields.map(function (fd) { return fld(fd[0] === '' ? B : B + '.' + fd[0], fd); }).join('') + '</div>';
    });
    return h + '<button class="b2" data-la="' + path + '" data-tpl="' + tpl + '">+ Add</button>';
  }

  /* ---------- media ---------- */
  function up(cb) { var i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = function () { var f = i.files[0]; if (!f) return; toast('Uploading…'); var im = new Image(); im.onload = function () { var s = Math.min(1, 1600 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = im.width * s; c.height = im.height * s; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); api('POST', '/media', { name: f.name, type: 'image/webp', data: c.toDataURL('image/webp', .85).split(',')[1] }).then(function (r) { toast('Uploaded'); cb(r.url); }).catch(function (e) { toast(e.message, 1); }); }; im.onerror = function () { toast('Could not read that image', 1); }; im.src = URL.createObjectURL(f); }; i.click(); }
  function mgrid(el, pick) { api('GET', '/media-list').then(function (r) { el.innerHTML = r.items.length ? r.items.map(function (m) { return '<div><button class="th" data-use="' + E(m.url) + '">' + (/\.pdf$/i.test(m.name) ? '<span class="pf">PDF</span>' : '<img src="' + E(m.url) + '" alt="">') + '</button><small>' + E(m.name) + '</small>' + (pick ? '' : '<span><button data-cp="' + E(m.url) + '">Copy link</button><button data-dm="' + m.id + '">Delete</button></span>') + '</div>'; }).join('') : '<p class="hint">No images yet. Press Upload.</p>'; }).catch(function (e) { el.textContent = e.message; }); }
  function upPdf(cb) { var i = document.createElement('input'); i.type = 'file'; i.accept = 'application/pdf'; i.onchange = function () { var f = i.files[0]; if (!f) return; if (f.size > 4.2e6) return toast('PDF is too large (max 4 MB)', 1); toast('Uploading…'); var r = new FileReader(); r.onload = function () { api('POST', '/media', { name: f.name, type: 'application/pdf', data: String(r.result).split(',')[1] }).then(function (x) { toast('PDF uploaded'); cb(x.url); }).catch(function (e) { toast(e.message, 1); }); }; r.readAsDataURL(f); }; i.click(); }
  function picker(path) { var m = document.createElement('div'); m.id = 'mdl'; m.innerHTML = '<div><div class="qh"><b>Choose an image</b><span><button class="b1" id="mu">+ Upload new</button> <button class="b2" id="mx">Close</button></span></div><div class="mg" id="pg">Loading…</div></div>'; document.body.appendChild(m); var g = m.querySelector('#pg'); mgrid(g, 1); m.querySelector('#mx').onclick = function () { m.remove(); }; m.querySelector('#mu').onclick = function () { up(function () { mgrid(g, 1); }); }; g.onclick = function (e) { var b = e.target.closest('[data-use]'); if (b) { set(D, path, b.dataset.use); mark(); m.remove(); view(); } }; }
  function blocksEd(P, c) { var h = '<h3 class="gh">Extra content (shown in Stage 2)</h3><p class="hint">Add as many as you like: heading, text, image, YouTube video link or highlighted note.</p>'; (c.blocks || []).forEach(function (b, n) { var B = P + '.blocks.' + n; h += '<div class="qc"><div class="qh"><span>' + SEL('Type', B + '.t', { text: 'Paragraph', head: 'Heading', image: 'Image', video: 'YouTube video', pdf: 'PDF file', note: 'Highlighted note' }) + '</span><span><button data-bm="' + n + '|-1">↑</button> <button data-bm="' + n + '|1">↓</button> <button data-bd="' + n + '">Remove</button></span></div>' + (b.t === 'image' ? imgF('Image', B + '.v', b.v) + F('Caption (optional)', B + '.c') : b.t === 'pdf' ? F('PDF link (upload below)', B + '.v') + '<button class="b2" data-pdf="' + B + '.v">Upload PDF (max 4 MB)</button><br><br>' + F('Title shown above the PDF (optional)', B + '.c') : b.t === 'video' ? F('YouTube link', B + '.v') : F('Content', B + '.v', 'area', b.t === 'head' ? 2 : 5)) + '</div>'; }); return h + '<button class="b2" id="addb">+ Add content block</button>'; }

  /* ---------- normalise loaded content ---------- */
  function norm(d) {
    d = d || {}; var def = clone(DEF);
    d.settings = Object.assign({}, def.settings, d.settings || {}); var oldAbout = 'ConceptLab একটি স্বাধীন, শিক্ষার্থী-পরিচালিত শিক্ষামূলক প্রকল্প, তৈরি করেছেন Taimur Shams। লক্ষ্য: মুখস্থের বাইরে গিয়ে মূল ধারণা বোঝানো।'; if (d.settings.about === oldAbout) d.settings.about = 'ConceptLab একটি স্বাধীন, শিক্ষার্থী-পরিচালিত শিক্ষামূলক প্রকল্প, তৈরি করেছেন Taimur Shams ও Moshiur Rahman Araf। লক্ষ্য: মুখস্থের বাইরে গিয়ে মূল ধারণা বোঝানো।';
    d.theme = Object.assign({}, def.theme, d.theme || {});
    var navDefaults = Array.isArray(def.navigation) ? def.navigation : [], navSaved = Array.isArray(d.navigation) ? d.navigation : [], navById = {}; navSaved.forEach(function (x) { if (x && x.id) navById[x.id] = x; }); d.navigation = navDefaults.map(function (x) { return Object.assign({}, x, navById[x.id] || {}); }); navSaved.forEach(function (x) { if (x && x.id && !navDefaults.some(function (n) { return n.id === x.id; })) d.navigation.push(x); }); d.customPages = Array.isArray(d.customPages) ? d.customPages : [];
    d.subjects = d.subjects && d.subjects.length ? d.subjects : def.subjects;
    d.chapters = d.chapters && d.chapters.length ? d.chapters : def.chapters;
    /* Add newly authored Qualitative Chemistry concepts to older saved content and migrate the former shared Bohr simulation. */
    var qcDefaults = def.chapters.filter(function(c){ return /^qc-(2[4-9]|3[01])$/.test(c.id); });
    qcDefaults.forEach(function(dc){ var ex=d.chapters.filter(function(c){return c.id===dc.id})[0]; if(!ex){d.chapters.push(clone(dc));} });
    def.chapters.filter(function(c){return /^qc-\d+$/.test(c.id)}).forEach(function(dc){var ex=d.chapters.filter(function(c){return c.id===dc.id})[0];if(ex&&ex.sim==='bohr'&&dc.sim&&dc.sim!=='bohr')ex.sim=dc.sim;if(ex&&dc.id==='qc-01'&&ex.sim==='dalton')ex.sim='atomBasics';});
    d.home = d.home && d.home.sections ? d.home : def.home;
    /* Backfill editable visual properties for older saved Home sections; preserve their custom text. */
    (d.home.sections || []).forEach(function (sec) {
      if (!sec || ['stages', 'features'].indexOf(sec.type) < 0) return;
      var base = (def.home.sections || []).filter(function (x) { return x.id === sec.id; })[0]; if (!base) return;
      sec.animation = sec.animation || base.animation || 'float'; sec.items = Array.isArray(sec.items) ? sec.items : clone(base.items || []);
      var oldStageText = ['বাস্তব জীবনের একটি প্রশ্ন দিয়ে শুরু।', 'মূল ধারণাটি সহজ ভাষায়।', 'স্লাইডার ও বোতাম দিয়ে নিজে পরীক্ষা করুন।', 'কুইজে যাচাই করুন, রেফারেন্স দেখুন।'];
      var emojiIcon = {'💡':'lightbulb','🧪':'flask','📖':'bookopen','📚':'bookopen','📈':'chart','🏆':'trophy','🔥':'flame','🧠':'brain','🧭':'compass','🎯':'target','✨':'sparkles','🎓':'graduation','🛡️':'shield','🚀':'rocket','⚛️':'atom','🧮':'calculator','🌊':'waves','🏅':'medal','🧩':'puzzle','⏱':'clock','☑':'check'};
      sec.items.forEach(function (it, i) {
        var bi = (base.items || [])[i] || {};
        ['i', 'tag', 'color', 'image'].forEach(function (k) { if (it[k] == null || it[k] === '') it[k] = bi[k] !== undefined ? bi[k] : (k === 'image' ? '' : k === 'color' ? ['#38bdf8','#a78bfa','#34d399','#fbbf24'][i % 4] : ''); });
        if (emojiIcon[it.i]) it.i = emojiIcon[it.i];
        if (sec.type === 'stages') { if (!it.t) it.t = bi.t || ['Real-World Hook','Core Intuition','Interactive Simulation','Quiz & References'][i] || 'Learning stage'; if (oldStageText.indexOf(it.p) >= 0 && bi.p) it.p = bi.p; if (!it.p) it.p = bi.p || ''; }
        if (sec.type === 'features') { var oldFeatureCopy = ['প্রতিটি সূত্রের পেছনের কারণ আগে, সূত্র পরে।','স্লাইডার ও বোতাম বদলে ফলাফল সঙ্গে সঙ্গে দেখুন।','জটিল বিষয়ও সহজ বাংলায় বোঝানো হয়।','ধাপ শেষ করলে My Progress পেজে অগ্রগতি জমা হয়।','পড়ে, খেলে ও কুইজ দিয়ে XP জমান, লেভেল বাড়ান, ব্যাজ জিতুন।','প্রতিদিন একটি বিশেষ গেম—খেললে দ্বিগুণ XP।']; if (oldFeatureCopy.indexOf(it.p) >= 0 && bi.p) it.p = bi.p; if (!it.p) it.p = bi.p || ''; if (!it.t) it.t = bi.t || ''; }
      });
    });
    if (d.home && Array.isArray(d.home.sections) && !d.home.sections.some(function (x) { return x && (x.id === 's-ayat-hadith' || x.type === 'ayatHadith'); })) {
      var ahSection = (def.home.sections || []).filter(function (x) { return x.id === 's-ayat-hadith'; })[0];
      if (ahSection) { var stageIndex = d.home.sections.findIndex(function (x) { return x && (x.id === 's-stages' || x.type === 'stages'); }); d.home.sections.splice(stageIndex >= 0 ? stageIndex + 1 : d.home.sections.length, 0, clone(ahSection)); }
    }
    d.games = Array.isArray(d.games) ? d.games : def.games;
    d.labs = Array.isArray(d.labs) ? d.labs : def.labs;
    d.gam = Object.assign({}, def.gam, d.gam || {});
    d.daily = Object.assign({}, def.daily, d.daily || {}); d.practice = Object.assign({}, def.practice, d.practice || {}); d.missions = Array.isArray(d.missions) ? d.missions : def.missions; d.deletedGames = Array.isArray(d.deletedGames) ? d.deletedGames : [];
    (def.games || []).forEach(function (g) { if ((/^(odd-one|step-order|periodic-quest|element-sprint|trend-duel)/.test(g.id) || /^edu-/.test(g.id)) && !d.games.some(function (x) { return x.id === g.id; }) && d.deletedGames.indexOf(g.id) < 0) d.games.push(clone(g)); });
    d.texts = d.texts || {};
    CL_TXT.forEach(function (g) { g[1].forEach(function (t) { if (d.texts[t[0]] == null || d.texts[t[0]] === '') d.texts[t[0]] = t[2]; }); });
    d.chapters.forEach(function (c) { c.blocks = c.blocks || []; c.q = c.q || []; });
    d.games.forEach(function (g) { g.data = g.data || {}; });
    D = d; sync(); return d;
  }

  /* ---------- auth / boot ---------- */
  function auth(mode) {
    var setup = mode === 'setup';
    root.innerHTML = '<div class="auth"><div class="card2"><h1>' + (setup ? 'Create admin account' : 'Admin sign in') + '</h1><p>' + (setup ? 'First time here. Create the first account now. You can add your friend afterwards.' : 'ConceptLab admin panel') + '</p><label class="f"><span>Username</span><input id="au" autocomplete="username"></label><label class="f"><span>Password' + (setup ? ' (8+ characters)' : '') + '</span><input id="ap" type="password" autocomplete="' + (setup ? 'new-password' : 'current-password') + '"></label><button class="b1" id="ab">' + (setup ? 'Create account' : 'Sign in') + '</button></div></div>';
    function go() { api('POST', setup ? '/setup' : '/login', { username: $('#au').value, password: $('#ap').value }).then(function (r) { T = r.token; ME = r.user; localStorage.setItem('clt', T); localStorage.setItem('clu', ME); boot(); }).catch(function (e) { toast(e.message, 1); }); }
    $('#ab').onclick = go; $('#ap').onkeydown = function (e) { if (e.key === 'Enter') go(); };
  }
  function boot() {
    api('GET', '/status').then(function (s) {
      if (s.setup) return auth('setup');
      if (!T) return auth('login');
      return api('GET', '/me').then(function () { return api('GET', '/content'); }).then(function (d) { norm(d); dirty = false; shell(); });
    }).catch(function (e) { if (T) return; root.innerHTML = '<div class="auth"><div class="card2"><h1>Cannot reach the server</h1><p>The admin panel works only on the deployed Netlify site (deployed from GitHub). ' + E(e.message) + '</p></div></div>'; });
  }
  function shell() {
    root.innerHTML = '<div class="app"><aside class="sb"><div class="who"><div class="av">' + E((ME || 'A').slice(0, 2).toUpperCase()) + '</div><div><b>' + E(D.settings.siteName || 'ConceptLab') + '</b><a href="/" target="_blank">View live site ↗</a></div></div><nav>' + NAV.map(function (n) { return '<button data-s="' + n[0] + '">' + n[1] + '</button>'; }).join('') + '</nav><button class="so" id="so">Sign Out</button></aside><main class="mn"><header class="tp"><div><h1 id="ttl"></h1><p>Signed in as <b>' + E(ME) + '</b></p></div><div class="act"><span id="dot"></span><button class="b2" id="gsb">🔍 Search</button><a class="b2" href="/" target="_blank">Preview Site</a><button class="b1" id="sv">Save changes</button></div></header><div id="body"></div></main></div>';
    $('#so').onclick = out; $('#sv').onclick = save; $('#gsb').onclick = openSearch;
    document.querySelectorAll('.sb nav button').forEach(function (b) { b.onclick = function () { sec = b.dataset.s; cur = -1; view(); }; });
    $('#body').oninput = onIn; $('#body').onchange = onIn; $('#body').onclick = onClick; view();
  }
  function save() { normExtra(); api('PUT', '/content', D).then(function () { dirty = false; $('#dot').className = ''; toast('Saved. Changes are live.'); }).catch(function (e) { toast(e.message, 1); }); }
  function mark() { dirty = true; var d = $('#dot'); if (d) d.className = 'on'; }
  function onIn(e) {
    if (e.target.id === 'qbq') { qb.q = e.target.value; qb.page = 0; if (e.type === 'change') view(); return; }
    var p = e.target.dataset && e.target.dataset.p; if (!p) return;
    var v = e.target.value; if (/\.a$/.test(p)) v = +v; if (e.target.dataset.num) v = v === '' ? '' : +v; if (/\.(on|enabled)$/.test(p)) v = (v === '1'); set(D, p, v); mark();
    if (e.type === 'change' && /\.(status|sim)$|blocks\.\d+\.t$/.test(p)) view();
  }
  function view() {
    document.querySelectorAll('.sb nav button').forEach(function (b) { b.classList.toggle('on', b.dataset.s === sec); });
    sync();
    var t = TITLES[sec]; if (cur >= 0 && { chapters: 1, home: 1, games: 1, labs: 1 }[sec]) t = { chapters: 'Edit concept', home: 'Edit section', games: 'Edit game', labs: 'Edit simulation' }[sec];
    $('#ttl').textContent = t;
    var V = { dashboard: vDash, registry: vRegistry, 'important-notice': vNotice, pages: vPages, students: vStudents, feedback: vFeedback, home: cur >= 0 ? vSecEdit : vHome, roadmap: vRoadmap, chapters: cur >= 0 ? vEdit : vChapters, games: cur >= 0 ? vGameEdit : vGames, labs: cur >= 0 ? vLabEdit : vLabs, rewards: vRewards, daily: vDaily, practice: vPractice, questions: vQuestions, insights: vInsights, health: vHealth, backup: vBackup, theme: vTheme, settings: vSet, footer: vFooter, team: vTeam, subjects: vSubs, texts: vTexts, media: vMedia };
    $('#body').innerHTML = V[sec](); window.scrollTo(0, 0);
    if (sec === 'dashboard') loadStudentCount();
    if (sec === 'students') loadStudents();
    if (sec === 'feedback') loadFeedback();
  }

  function vRegistry() {
    var sections = (D.home && D.home.sections) || [];
    var known = Object.keys(SCH.secTypes || {}).length;
    var h = '<div class="registry-hero"><div><span class="registry-eyebrow">CONCEPTLAB CONTROL PLANE</span><h2>Feature Registry</h2><p>Find every homepage feature, update its content, change icons and images, and edit settings added later. Known section types use structured controls; advanced JSON exposes additional fields that do not yet have a dedicated form.</p></div><div class="registry-hero-mark">✦</div></div>';
    h += '<div class="registry-stats"><div><b>' + sections.length + '</b><span>Homepage sections</span></div><div><b>' + known + '</b><span>Editor schemas</span></div><div><b>' + sections.filter(function (x) { return x && x.on !== false; }).length + '</b><span>Visible sections</span></div></div>';
    h += '<div class="card2"><div class="registry-list-head"><div><h3 class="gh">Editable feature inventory</h3><p class="hint">Edit a feature visually or open its full data object. New sections are automatically listed here once they exist in Home Page content.</p></div><button class="b1" data-go="home">＋ Add / manage sections</button></div><div class="registry-list">';
    sections.forEach(function (sec, i) {
      var tp = SCH.secTypes[sec.type] || { n: sec.type || 'Custom section' };
      var count = Array.isArray(sec.items) ? sec.items.length : 0;
      h += '<article class="registry-item"><span class="registry-item-index">' + String(i + 1).padStart(2, '0') + '</span><div class="registry-item-copy"><b>' + E(sec.h || tp.n || sec.type) + '</b><span>' + E(tp.n || sec.type) + ' · ' + E(sec.id || 'custom-section') + (count ? ' · ' + count + ' items' : '') + '</span></div><span class="tg ' + (sec.on === false ? '' : 'av') + '">' + (sec.on === false ? 'Hidden' : 'Visible') + '</span><div class="registry-item-actions"><button class="b2" data-open-home-section="' + i + '">Edit feature</button><button class="b2" data-json-editor="home.sections.' + i + '" data-json-title="' + E(sec.h || tp.n || 'Section settings') + '">Advanced JSON</button></div></article>';
    });
    return h + '</div></div><div class="card2"><h3 class="gh">How future features become editable</h3><p class="hint">For a new content-driven section, add its configuration to Home Page sections; it will appear in this inventory and can be edited in Advanced JSON immediately. For a polished form, declare its fields in <code>CL_SCHEMA.secTypes</code>. A new interactive feature implemented purely in JavaScript still needs its runtime options mapped to content/settings—the panel cannot safely infer arbitrary code behavior automatically.</p><button class="b2" data-json-editor="settings" data-json-title="Advanced site settings">Open site settings JSON</button></div>';
  }

  function openJsonEditor(path, title) {
    var target = get(D, path);
    if (target == null || typeof target !== 'object') return toast('This configuration path is not an object.', 1);
    var m = document.createElement('div'); m.id = 'advJsonModal'; m.className = 'admin-json-overlay';
    m.innerHTML = '<section class="admin-json-panel" role="dialog" aria-modal="true" aria-labelledby="advJsonTitle"><header><div><span class="registry-eyebrow">ADVANCED CONFIGURATION</span><h2 id="advJsonTitle"></h2></div><button type="button" class="b2" id="advJsonClose" aria-label="Close editor">✕</button></header><p class="hint">Edit valid JSON. Keep property names in double quotes. These changes stay in draft until you press the main Save changes button.</p><textarea id="advJsonValue" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea><div class="admin-json-actions"><span class="mu">JSON · ' + E(path) + '</span><div><button type="button" class="b2" id="advJsonCancel">Cancel</button> <button type="button" class="b1" id="advJsonApply">Apply changes</button></div></div></section>';
    document.body.appendChild(m); m.querySelector('#advJsonTitle').textContent = title || 'Advanced JSON editor'; m.querySelector('#advJsonValue').value = JSON.stringify(target, null, 2);
    function close() { m.remove(); }
    m.querySelector('#advJsonClose').onclick = close; m.querySelector('#advJsonCancel').onclick = close;
    m.addEventListener('click', function (e) { if (e.target === m) close(); });
    m.querySelector('#advJsonApply').onclick = function () {
      var parsed;
      try { parsed = JSON.parse(m.querySelector('#advJsonValue').value); } catch (e) { toast('Invalid JSON: ' + e.message, 1); return; }
      if (!parsed || typeof parsed !== 'object') { toast('The configuration must be a JSON object or array.', 1); return; }
      if (path === 'settings' && Array.isArray(parsed)) { toast('Site settings must be a JSON object.', 1); return; }
      if (/^home\.sections\.\d+$/.test(path) && (Array.isArray(parsed) || !parsed.type || typeof parsed.type !== 'string')) { toast('A section must be an object with a valid type.', 1); return; }
      set(D, path, parsed); mark(); close(); view(); toast('Configuration applied. Press Save changes to publish.');
    };
    m.querySelector('#advJsonValue').focus();
  }

  function vPages() {
    var map = {
      home: ['Home page', 'home', 'Hero, home sections, Ayat/Hadith and Daily Inspiration'],
      chapters: ['Explore Chapters', 'chapters', 'Concepts, questions, explanations and chapter status'],
      play: ['Games', 'games', 'Game content, settings, visibility and ordering'],
      lab: ['Simulations', 'labs', 'Interactive lab catalogue and descriptions'],
      progress: ['My Progress', 'rewards', 'XP rules and badges'],
      'study-space': ['Study Space', 'texts', 'Labels and explanatory text'],
      daily: ['Daily & Missions', 'daily', 'Daily challenge and learning missions'],
      'smart-practice': ['Smart Practice', 'practice', 'Review intervals and practice options'],
      analytics: ['Analytics', 'texts', 'Public labels and interface text'],
      leaderboard: ['Leaderboard', 'texts', 'Public labels and interface text'],
      about: ['About', 'settings', 'About copy, credits and website settings'],
      solver: ['Formula Solver', 'settings', 'Formula solver visibility and default preferences'],
      reference: ['Reference Shelf', 'settings', 'Reference tool visibility and website preferences'],
      'share-card': ['Progress Card', 'settings', 'Progress card page visibility and related settings'],
      appearance: ['Appearance Studio', 'settings', 'User appearance options and default typography'],
      settings: ['Settings', 'settings', 'Guest settings, fonts, spacing and content width'],
      profile: ['My Profile', 'students', 'Student profile and account records']
    };
    var nav = Array.isArray(D.navigation) ? D.navigation : [];
    var h = '<div class="pages-intro"><div><span class="eyebrow">SITE CONTROL CENTER</span><h2>Pages & Tabs</h2><p>Manage which destinations appear in the public menu, rename tabs, change their order and jump straight to the correct content editor. Add custom pages for future sections without editing code.</p></div><button class="b1" id="addCustomPage">＋ Create custom page</button></div>';
    h += '<div class="pages-stats"><div><strong>' + nav.length + '</strong><span>Built-in tabs</span></div><div><strong>' + nav.filter(function (n) { return n.enabled !== false && n.enabled !== '0'; }).length + '</strong><span>Visible in menu</span></div><div><strong>' + (D.customPages || []).length + '</strong><span>Custom pages</span></div></div>';
    h += '<div class="card2"><h3 class="gh">Built-in tabs</h3><p class="hint">Each row controls a public navigation item. “Edit content” opens the current editor for that tab. The destination itself remains available by direct URL when hidden from the menu.</p><div class="page-manager-list">';
    nav.forEach(function (n, i) {
      var info = map[n.id] || [n.label || n.id, 'texts', 'Edit the labels and content associated with this destination'];
      var href = n.href || '#/' + (n.id === 'home' ? '' : n.id);
      h += '<section class="page-manager-row"><div class="page-manager-identity"><span class="page-manager-index">' + String(i + 1).padStart(2, '0') + '</span><div><b>' + E(info[0]) + '</b><small>' + E(href) + '</small><span>' + E(info[2]) + '</span></div></div><div class="page-manager-fields">' + F('Menu label', 'navigation.' + i + '.label') + F('Menu description', 'navigation.' + i + '.description') + SEL('Menu visibility', 'navigation.' + i + '.enabled', YN) + '</div><div class="page-manager-actions"><button data-lm="navigation|' + i + '|-1" aria-label="Move up">↑</button><button data-lm="navigation|' + i + '|1" aria-label="Move down">↓</button><button class="b2" data-go="' + E(info[1]) + '">Edit content ↗</button></div></section>';
    });
    h += '</div></div>';
    h += '<div class="card2"><h3 class="gh">Custom pages</h3><p class="hint">Create a new public page, set its menu name, edit its text and publish it. Content is rendered as text, not arbitrary HTML, to avoid breaking the site layout.</p>';
    if (!(D.customPages || []).length) h += '<div class="empty-students"><h3>No custom pages yet</h3><p>Create a custom page to add a new destination to the public menu.</p></div>';
    (D.customPages || []).forEach(function (pg, i) {
      var P = 'customPages.' + i;
      h += '<article class="custom-page-editor"><div class="qh"><div><b>' + E(pg.title || pg.navLabel || 'Untitled page') + '</b><small class="custom-page-route">#/page/' + E(pg.slug || pg.id) + '</small></div><span>' + SEL('Published?', P + '.on', YN).replace('<label class="f">', '<label class="f compact-field">') + '</span></div><div class="g2"><div>' + F('Page title', P + '.title') + F('Menu label', P + '.navLabel') + '</div><div>' + F('URL slug (a-z, 0-9 and hyphens)', P + '.slug') + '<p class="hint">Public address: <b>#/page/' + E(pg.slug || pg.id) + '</b></p></div></div>' + F('Page content (plain text; separate paragraphs with a blank line)', P + '.body', 'area', 6) + '<div class="page-manager-actions"><button class="b2" data-go="pages">Refresh editor</button><button class="dg" data-delete-page="' + i + '">Delete page</button></div></article>';
    });
    return h + '</div>';
  }

  /* ---------- views ---------- */
  function loadStudentCount() {
    var el = document.getElementById('studentCountValue'); if (!el) return;
    fetch('/api/student-stats', { headers: { Authorization: 'Bearer ' + T }, cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('Unavailable'); return r.json(); })
      .then(function (d) { var n = document.getElementById('studentCountValue'); if (n) n.textContent = String(d.count || 0); })
      .catch(function () { var n = document.getElementById('studentCountValue'); if (n) n.textContent = 'Unavailable'; });
  }
  function loadStudents() {
    var box = document.getElementById('studentList'); if (!box) return;
    box.innerHTML = '<p class="hint">Loading registered student accounts…</p>';
    fetch('/api/student-stats', { headers: { Authorization: 'Bearer ' + T }, cache: 'no-store' })
      .then(function (r) { return r.json().then(function (d) { if (!r.ok) throw new Error(d.error || 'Could not load students'); return d; }); })
      .then(function (d) {
        var target = document.getElementById('studentList'); if (!target) return;
        var students = d.students || [];
        target.innerHTML = '<div class="student-admin-summary"><strong>' + Number(d.count || 0) + '</strong><span>registered student accounts</span></div>' + (students.length ? '<label class="student-search"><span>Search students</span><input id="studentSearch" type="search" placeholder="Search name, email or institute…"></label><div class="student-admin-table"><div class="student-admin-row head"><span>Name</span><span>Email address</span><span>Institute</span><span>XP</span><span>Joined</span></div>' + students.map(function (u) { return '<div class="student-admin-row" data-student-row data-search="' + E([u.name,u.email,u.school].join(' ').toLowerCase()) + '"><b>' + E(u.name || 'Student') + '</b><span>' + E(u.email || '') + '</span><span>' + E(u.school || '—') + '</span><strong>' + Number(u.xp || 0) + ' XP</strong><small>' + E(u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—') + '</small></div>'; }).join('') + '<p id="studentSearchEmpty" class="hint" hidden>No matching students found.</p></div>' : '<div class="empty-students"><h3>No student accounts yet</h3><p>When students sign up on the website, their accounts will appear here.</p></div>');
        var search = document.getElementById('studentSearch'); if (search) search.addEventListener('input', function () { var q = search.value.trim().toLowerCase(), rows = Array.prototype.slice.call(target.querySelectorAll('[data-student-row]')), shown = 0; rows.forEach(function (row) { var match = row.dataset.search.indexOf(q) >= 0; row.hidden = !match; if (match) shown++; }); var empty = document.getElementById('studentSearchEmpty'); if (empty) empty.hidden = shown > 0; });
      }).catch(function (e) { var target = document.getElementById('studentList'); if (target) target.innerHTML = '<p class="hint">Could not load student accounts: ' + E(e.message) + '</p>'; });
  }
  function vStudents() {
    return '<div class="card2"><h3 class="gh">Student accounts</h3><p class="hint">This list is read from the shared online student database. It includes account count, name, email, XP and signup date. Passwords are never displayed.</p><div id="studentList"><p class="hint">Loading…</p></div><button class="b2" id="refreshStudents">Refresh student list</button></div>';
  }
  function vFeedback() {
    return '<div class="card2"><h3 class="gh">Visitor feedback & issue reports</h3><p class="hint">Messages sent from About → Feedback are stored privately and visible only to signed-in admins. If a visitor leaves an email, you can use it to reply. Unread messages are highlighted.</p><div id="feedbackList"><p class="hint">Loading feedback…</p></div><button class="b2" id="refreshFeedback">Refresh feedback</button></div>';
  }
  function loadFeedback() {
    var box = document.getElementById('feedbackList'); if (!box) return;
    box.innerHTML = '<p class="hint">Loading feedback…</p>';
    api('GET', '/feedback').then(function (r) {
      var target = document.getElementById('feedbackList'); if (!target) return;
      var list = r.feedback || [];
      if (!list.length) { target.innerHTML = '<div class="empty-students"><h3>No feedback yet</h3><p>Messages submitted from the About page will appear here.</p></div>'; return; }
      target.innerHTML = '<div class="student-admin-summary"><strong>' + Number(r.unread || 0) + '</strong><span>unread · ' + Number(r.count || 0) + ' total messages</span></div><div class="lst">' + list.map(function (f) {
        var date = f.createdAt ? new Date(f.createdAt).toLocaleString() : 'Date unavailable';
        return '<article class="feedback-admin-item' + (f.read ? '' : ' unread') + '"><div class="feedback-admin-head"><div><span class="tg ' + (f.read ? '' : 'av') + '">' + (f.read ? 'Read' : 'Unread') + '</span> <b>' + E(f.name || 'Anonymous') + '</b></div><small>' + E(date) + '</small></div>' + (f.email ? '<p><b>Email:</b> <a href="mailto:' + E(f.email) + '">' + E(f.email) + '</a></p>' : '<p class="mu">No reply email provided</p>') + '<p><b>Page:</b> ' + E(f.page || '#/about') + '</p><div class="feedback-admin-message">' + E(f.message || '').replace(/\n/g, '<br>') + '</div><div class="row2"><button class="b2" data-feedback-read="' + E(f.id) + '" data-read="' + (!f.read ? '1' : '0') + '">' + (f.read ? 'Mark unread' : 'Mark as read') + '</button><button class="dg" data-feedback-delete="' + E(f.id) + '">Delete</button></div></article>';
      }).join('') + '</div>';
    }).catch(function (e) { var target = document.getElementById('feedbackList'); if (target) target.innerHTML = '<p class="hint">Could not load feedback: ' + E(e.message) + '</p>'; });
  }

  function vDash() {
    var av = D.chapters.filter(function (c) { return c.status === 'available'; }).length; var chapterNames = {}; D.chapters.forEach(function (c) { chapterNames[String(c.s) + '::' + String(c.chapterTitle || c.chapter || c.t || 'Chapter')] = 1; });
    var cards = [['student-count', 'Student accounts', '<span id="studentCountValue">Loading…</span> registered'], ['pages', 'Pages & Tabs', 'Control public navigation, tab order, visibility and custom pages'], ['settings', 'Website Settings & Appearance Defaults', 'Default fonts, text size, layout, contrast, motion and guest settings'], ['feedback', 'Feedback', 'View messages sent by visitors'], ['home', 'Home Page', D.home.sections.length + ' sections, hero text'], ['registry', 'Feature Registry & Advanced Controls', 'Discover editable features, visual controls and future content fields'], ['chapters', 'Chapters & Concepts', Object.keys(chapterNames).length + ' chapters · ' + D.chapters.length + ' concepts (' + av + ' available)'], ['daily', 'Daily & Missions', (D.missions || []).length + ' missions, daily challenge'], ['practice', 'Practice & Sync', 'Revision gaps, step help, cloud sync'], ['questions', 'Question Bank', 'Edit every question & explanation'], ['insights', 'Learning Insights', 'Most-missed concepts, activity'], ['health', 'Content Health', 'Find empty or broken content'], ['backup', 'Backup & History', 'Download, restore versions'], ['games', 'Games (Arcade)', D.games.length + ' games'], ['labs', 'Simulations (Lab)', D.labs.length + ' simulations'], ['rewards', 'XP & Badges', (D.gam.badges || []).length + ' badges, XP rules'], ['texts', 'All Texts', 'Change any word on the site'], ['media', 'Images / Media', 'Upload and manage images'], ['subjects', 'Subjects', D.subjects.length + ' subjects'], ['theme', 'Theme / Colors', 'Colours, glow, effects'], ['important-notice', 'Important Notice', 'Publish a message in the homepage message centre'], ['team', 'Team & Password', 'Add your friend, change password']];
    return '<div class="card2"><h3 class="gh">Welcome back</h3><p class="hint">Everything on the website is editable here. Pick a section, change it, then press Save changes. Saved changes go live immediately.</p><div class="dash">' + cards.map(function (c) { return c[0] === 'student-count' ? '<div class="dc student-count-card"><b>' + c[1] + '</b><span><strong id="studentCountValue">Loading…</strong> registered students</span></div>' : '<button class="dc" data-go="' + c[0] + '"><b>' + c[1] + '</b><span>' + E(c[2]) + '</span></button>'; }).join('') + '</div></div>';
  }
  function secTitle(s) { var t = SCH.secTypes[s.type]; return E(s.h ? String(s.h).replace('|', ' ') : (t ? t.n : s.type)); }
  function vHome() {
    var h = '<div class="card2"><h3 class="gh">Hero (top of the home page)</h3>' + F('Small badge above the title', 'settings.badge') + F('Main title', 'settings.h1', 'area', 2) + F('Intro text', 'settings.lead', 'area', 3) + '<div class="g2">' + F('Typing line: start words', 'settings.heroPre') + F('Typing line: words (comma separated)', 'settings.heroWords') + '</div><p class="hint">Buttons and menu words are in <b>All Texts</b>. The animated picture can be replaced in <b>Website Settings</b>.</p></div>';
    h += '<div class="card2"><h3 class="gh">Sections below the hero</h3><p class="hint">Show, hide, reorder, edit or delete any section. Add new ones too.</p><div class="lst">';
    D.home.sections.forEach(function (s, i) {
      var tp = SCH.secTypes[s.type] || { n: s.type };
      h += '<div class="it"><span class="tg ' + (s.on === false ? '' : 'av') + '">' + (s.on === false ? 'Hidden' : 'Visible') + '</span><b>' + secTitle(s) + '</b> <span class="mu">· ' + E(tp.n) + '</span><span class="sp"></span><button data-tg="home.sections.' + i + '.on">' + (s.on === false ? 'Show' : 'Hide') + '</button><button data-lm="home.sections|' + i + '|-1">↑</button><button data-lm="home.sections|' + i + '|1">↓</button><button data-ed="' + i + '">Edit</button><button data-dtop="home.sections|' + i + '">Delete</button></div>';
    });
    h += '</div><div class="row2" style="margin-top:16px"><select id="newsec">' + Object.keys(SCH.secTypes).map(function (k) { return '<option value="' + k + '">' + E(SCH.secTypes[k].n) + '</option>'; }).join('') + '</select><button class="b1" id="addsec">+ Add section</button><button class="b2" id="rsthome">Restore default home page</button></div></div>';
    return h;
  }
  function vSecEdit() {
    var P = 'home.sections.' + cur, s = D.home.sections[cur]; if (!s) { cur = -1; return vHome(); }
    var tp = SCH.secTypes[s.type] || { f: [] };
    var h = '<button class="b2" id="bk">← All sections</button><div class="card2" style="margin-top:16px"><h3 class="gh">' + E(tp.n || s.type) + '</h3>' + SEL('Show this section?', P + '.on', YN);
    (tp.f || []).forEach(function (fd) { h += fld(P + '.' + fd[0], fd); });
    if (tp.items) h += listEd(P + '.items', tp.items[0], tp.items[1], tp.items[2]);
    h += '<div class="advanced-editor-callout"><div><b>Advanced section data</b><p>Edit the complete section configuration, including nested fields and future feature options that do not yet have a dedicated form control.</p></div><button class="b2" data-json-editor="' + P + '" data-json-title="Advanced section configuration">Open JSON editor ↗</button></div>';
    return h + '</div>';
  }
  function vRoadmap() {
    var idx = (D.home.sections || []).findIndex(function (s) { return s.id === 's-road' || s.type === 'roadmap'; });
    if (idx < 0) { toast('Roadmap section was not found in Home Page content.', 1); return '<div class="card2"><p class="hint">Roadmap section was not found. Open Home Page to check your sections.</p></div>'; }
    var path = 'home.sections.' + idx, secRoad = D.home.sections[idx];
    secRoad.items = Array.isArray(secRoad.items) ? secRoad.items : [];
    var h = '<div class="card2"><p class="hint">Edit the public Roadmap section here. Change phase names, descriptions and statuses, then press <b>Save changes</b> to publish.</p>' +
      SEL('Show Roadmap on the website?', path + '.on', YN) +
      F('Small label', path + '.pill') +
      F('Heading (use | to split into two lines)', path + '.h') +
      F('Intro text', path + '.p', 'area', 3) +
      '<h3 class="gh">Phases <span class="cnt">' + secRoad.items.length + '</span></h3>';
    secRoad.items.forEach(function (it, i) {
      var b = path + '.items.' + i;
      h += '<div class="qc"><div class="qh"><b>Phase ' + (i + 1) + '</b><button data-ld="' + path + '.items|' + i + '">Delete phase</button></div>' +
        F('Phase label', b + '.d') + F('Title', b + '.t') + F('Description', b + '.p', 'area', 3) +
        SEL('Status', b + '.s', { done: 'Done', now: 'In progress', next: 'Coming next' }) + '</div>';
    });
    h += '<button class="b1" data-la="' + path + '.items" data-tpl="sec_road">+ Add phase</button></div>';
    return h;
  }
  function vSubs() { return '<div class="card2"><p class="hint">Add or rename subjects (for example Biology, ICT). Each chapter belongs to one subject.</p>' + D.subjects.map(function (s, i) { return '<div class="it"><input class="si" data-p="subjects.' + i + '.name" value="' + E(s.name) + '"><button data-ds="' + i + '">Delete</button></div>'; }).join('') + '<br><button class="b1" id="adds">+ Add subject</button></div>'; }
  function vTexts() { return CL_TXT.map(function (g) { return '<div class="card2"><h3 class="gh">' + g[0] + '</h3>' + g[1].map(function (t) { return F(t[1], 'texts.' + t[0], t[2].length > 55 ? 'area' : 'text', 2); }).join('') + '</div>'; }).join(''); }
  function vMedia() { setTimeout(function () { var g = $('#mg'); if (g) mgrid(g); }, 0); return '<div class="card2"><p class="hint">Upload images once, then pick them anywhere (logo, home picture, chapter cover, content blocks). Images are shrunk automatically.</p><button class="b1" id="upl">+ Upload image</button><br><br><div class="mg" id="mg">Loading…</div></div>'; }
  function vNotice() { return '<div class="card2"><h3 class="gh">Important Notice</h3><p class="hint">এখানে লেখা বার্তা হোমপেজের Message Centre-এ দেখা যাবে। নতুন বার্তা প্রকাশের পর ব্যবহারকারীর মেসেজ আইকনে নতুন বার্তার সংখ্যা দেখাবে এবং আইকনটি জ্বলজ্বল করবে। পরিবর্তনের পর Save changes চাপুন।</p>' + F('Message (বাংলা/English)', 'settings.importantNotice', 'area', 6) + F('Message title (optional)', 'settings.importantNoticeTitle') + '</div>'; }
  function vSet() { return '<div class="card2"><h3 class="gh">Website Settings</h3>' + F('Site name', 'settings.siteName') + imgF('Logo image (optional)', 'settings.logo', D.settings.logo) + imgF('Home page picture (replaces the animation)', 'settings.hero', D.settings.hero) + imgF('About page picture', 'settings.aboutImg', D.settings.aboutImg) + F('Footer credit (shown on every page, e.g. Created by …)', 'settings.credit', 'area', 2) + F('About page text', 'settings.about', 'area', 4) + '<div class="advanced-editor-callout"><div><b>Advanced site settings</b><p>Use JSON mode to edit additional settings added by future features without waiting for a custom form.</p></div><button class="b2" data-json-editor="settings" data-json-title="Advanced site settings">Open settings JSON ↗</button></div>' + '</div><div class="card2"><h3 class="gh">New tools — headings and descriptions</h3><p class="hint">The text below is editable. Save changes to update these new public pages.</p>' + F('Formula Solver title', 'settings.solverTitle') + F('Formula Solver description', 'settings.solverIntro', 'area', 2) + F('Reference Shelf title', 'settings.referenceTitle') + F('Reference Shelf description', 'settings.referenceIntro', 'area', 2) + F('Progress Card title', 'settings.progressCardTitle') + F('Progress Card description', 'settings.progressCardIntro', 'area', 2) + F('Appearance Studio title', 'settings.appearanceTitle') + F('Appearance Studio description', 'settings.appearanceIntro', 'area', 2) + F('Settings page title', 'settings.settingsTitle') + F('Settings page description', 'settings.settingsIntro', 'area', 2) + '</div><div class="card2"><h3 class="gh">Personalisation defaults</h3><p class="hint">These values are the defaults for visitors who have not saved their own preferences. Their personal Settings and Appearance choices remain local to their device.</p>' + SEL('Guest settings (allow without sign-in)', 'settings.allowGuestSettings', { on: 'Enabled', off: 'Disabled' }) + SEL('Default website font', 'settings.defaultFont', { hind: 'Hind Siliguri · Bengali friendly', manrope: 'Manrope · Modern', system: 'System default' }) + SEL('Default text size', 'settings.defaultFontScale', { '90': 'Small · 90%', '95': 'Compact · 95%', '100': 'Standard · 100%', '105': 'Large · 105%', '110': 'Extra large · 110%', '120': 'Largest · 120%' }) + SEL('Default card spacing', 'settings.defaultDensity', { comfortable: 'Comfortable', compact: 'Compact' }) + SEL('Default corner style', 'settings.defaultCorners', { rounded: 'Rounded', crisp: 'Crisp' }) + SEL('Default content width', 'settings.defaultContentWidth', { narrow: 'Narrow', standard: 'Standard', wide: 'Wide' }) + SEL('Default accent colour', 'settings.defaultAccent', { sky: 'Sky blue', violet: 'Violet', emerald: 'Emerald', rose: 'Rose', amber: 'Amber' }) + SEL('Default animated background', 'settings.defaultFx', { on: 'On', off: 'Off' }) + SEL('Default calm mode', 'settings.defaultCalm', { on: 'On', off: 'Off' }) + SEL('Default high contrast', 'settings.defaultContrast', { on: 'On', off: 'Off' }) + '</div><div class="card2"><h3 class="gh">Premium interface</h3><p class="hint">The floating plus button has been removed; new tools are available in the three-line menu and Student Hub.</p>' + SEL('Scroll progress bar at the top of the page', 'settings.premiumProgress', { on: 'On', off: 'Off' }) + SEL('“Student power tools” strip at the bottom of the home page', 'settings.premiumHome', { on: 'On', off: 'Off' }) + '</div>'; }
  function vFooter() { D.settings.socialLinks = Array.isArray(D.settings.socialLinks) ? D.settings.socialLinks : []; return '<div class="card2"><h3 class="gh">Footer content</h3><p class="hint">Edit the footer text and links shown on every public page. Press Save changes to publish.</p>' + F('Footer heading / tagline', 'settings.footerTitle', 'area', 2) + F('Footer description', 'settings.footerText', 'area', 3) + F('Footer credit text', 'settings.credit', 'area', 2) + '<p class="hint">The oversized promotional banner was removed from the public footer. Use these settings to edit the compact footer tagline and links instead.</p>' + '<h3 class="gh">Facebook</h3>' + F('Facebook button text', 'settings.facebookLabel') + F('Facebook page URL', 'settings.facebookUrl', 'url') + '<h3 class="gh">Additional social media links</h3><p class="hint">Add as many links as you need. Use a full URL, including https://.</p>' + D.settings.socialLinks.map(function (x, i) { return '<div class="card2" style="margin:10px 0;padding:12px"><div class="g2">' + F('Platform / button label', 'settings.socialLinks.' + i + '.label') + F('Website URL', 'settings.socialLinks.' + i + '.url', 'url') + '</div>' + F('Icon type (facebook or link)', 'settings.socialLinks.' + i + '.kind') + '<button type="button" class="b2" data-social-remove="' + i + '">Remove this social link</button></div>'; }).join('') + '<button type="button" class="b1" id="socialAdd">+ Add social media</button></div>'; }
  function vTheme() { return '<div class="card2"><p class="hint">The site background is black. Glow effects are intentionally subdued. Pick accent colours, then Save and open Preview Site.</p><div class="g4">' + F('Main accent (sky blue)', 'theme.p', 'color') + F('Secondary accent', 'theme.s', 'color') + F('Highlight (XP, stars)', 'theme.a', 'color') + F('Background', 'theme.bg', 'color') + F('Bottom glow colour', 'theme.glow', 'color') + '</div>' + SEL('Animated background (stars, floating glow, cursor light)', 'theme.fx', { on: 'On', off: 'Off (calmer, faster on old phones)' }) + '<button class="b2" id="rsttheme">Reset to the black + sky-blue look</button></div>'; }
  function vRewards() {
    return '<div class="card2"><h3 class="gh">XP rules</h3><p class="hint">Students earn XP, level up and unlock badges. Game XP is set per game in the Games section.</p><div class="g4">' + F('XP per stage completed', 'gam.xpStage', 'num') + F('XP per simulation explored', 'gam.xpSim', 'num') + F('XP per correct quiz answer', 'gam.xpQuiz', 'num') + F('XP needed per level', 'gam.lvl', 'num') + '</div></div>' +
      '<div class="card2">' + listEd('gam.badges', 'Badges', [['i', 'Icon (emoji)'], ['t', 'Name'], ['d', 'How to earn it'], ['k', 'Earned by', 'sel', { xp: 'Total XP reaches', stages: 'Stages completed', sims: 'Different simulations tried', games: 'Games played', streak: 'Day streak', perfect: 'Perfect chapter quizzes' }], ['n', 'Number needed', 'num']], 'badge') + '</div>';
  }
  function vChapters() {
    var h = '<div class="row2"><button class="b1" id="addc">+ Add chapter</button><button class="b2" id="addconcept">+ Add concept</button><button class="b2" id="starter">Add missing starter concepts</button></div><p class="hint">Structure: Subject → Chapter → many concepts → four stages for every concept. Use + Add chapter to create a chapter and its first concept, or + Add concept inside an existing chapter. Each concept has its own Stage 1 hook, Stage 2 explanation, Stage 3 simulation and Stage 4 quiz.</p>';
    Object.keys(SUBS).forEach(function (s) {
      var list = D.chapters.map(function (c, i) { return { c: c, i: i }; }).filter(function (x) { return x.c.s === s; });
      if (!list.length) return;
      var groups = {};
      list.forEach(function (x) { var name = String(x.c.chapterTitle || x.c.chapter || x.c.t || 'Untitled chapter').trim(); (groups[name] || (groups[name] = [])).push(x); });
      h += '<h3 class="gh">' + E(SUBS[s]) + '</h3>';
      Object.keys(groups).forEach(function (name) {
        h += '<div class="concept-chapter"><div class="concept-chapter-head"><div><small>CHAPTER</small><h3>' + E(name) + '</h3></div><span class="tg">' + groups[name].length + ' concept' + (groups[name].length === 1 ? '' : 's') + '</span><button class="b2" data-addconcept="' + E(s + '|' + name) + '">+ Add concept</button></div><div class="lst">';
        groups[name].forEach(function (x) { var c=x.c,i=x.i; h += '<div class="it"><span class="tg ' + (c.status === 'available' ? 'av' : '') + '">' + (c.status === 'available' ? 'Available' : 'Coming soon') + '</span><b>' + E(c.t) + '</b><span class="sp"></span><button data-mv="' + i + '|-1">↑</button><button data-mv="' + i + '|1">↓</button><button data-ed="' + i + '">Edit concept</button></div>'; });
        h += '</div></div>';
      });
    });
    return h;
  }
  function vEdit() {
    var P = 'chapters.' + cur, c = D.chapters[cur]; if (!c) { cur = -1; return vChapters(); }
    var h = '<button class="b2" id="bk">← All chapters</button><div class="card2" style="margin-top:16px"><h3 class="gh">Concept details · four stages belong to this concept only</h3>' + F('Chapter name (all concepts with this chapter name are grouped together)', P + '.chapterTitle') + F('Concept title', P + '.t') + '<div class="g2">' + SEL('Subject', P + '.s', SUBS) + SEL('Status', P + '.status', { available: 'Available (students can open it)', soon: 'Coming soon' }) + '</div>' + SEL('Interactive simulation (stage 3)', P + '.sim', SIMS);
    if (c.status === 'available') {
      h += (c.sim === 'custom' ? F('Custom simulation: paste full HTML + JS', P + '.html', 'area', 10) : '') + imgF('Cover image', P + '.cover', c.cover) + F('Stage 1: Real-World Hook', P + '.hook', 'area', 5) + F('Stage 2: Core Intuition', P + '.intu', 'area', 5) + blocksEd(P, c) + F('Reference note under the quiz (optional)', P + '.ref') + '<h3 class="gh">Stage 4: Quiz questions</h3>';
      h += c.q.map(function (q, n) { var Q = P + '.q.' + n; return '<div class="qc"><div class="qh"><b>Question ' + (n + 1) + '</b><button data-dq="' + n + '">Remove</button></div>' + F('Question', Q + '.q') + [0, 1, 2, 3].map(function (k) { return F('Option ' + (k + 1), Q + '.o.' + k); }).join('') + SEL('Correct answer', Q + '.a', { 0: 'Option 1', 1: 'Option 2', 2: 'Option 3', 3: 'Option 4' }) + F('Explanation shown after answering', Q + '.e') + '</div>'; }).join('');
      h += '<button class="b2" id="addq">+ Add question</button>';
    } else h += '<p class="hint">Set the status to Available to write the lesson and quiz.</p>';
    return h + '<br><button class="dg" id="delc">Delete this chapter</button></div>';
  }
  function vGames() {
    var h = '<div class="card2"><p class="hint">These appear on the Arcade page and on the home page. Add several copies of the same game type with different content (for example a Chemistry memory deck).</p><div class="lst">';
    D.games.forEach(function (g, i) {
      var tp = SCH.game[g.type] || { n: g.type };
      h += '<div class="it"><span class="gi2">' + E(g.icon) + '</span><span class="tg ' + (g.on === false ? '' : 'av') + '">' + (g.on === false ? 'Hidden' : 'Visible') + '</span><b>' + E(g.t) + '</b> <span class="mu">· ' + E(tp.n) + '</span><span class="sp"></span><button data-tg="games.' + i + '.on">' + (g.on === false ? 'Show' : 'Hide') + '</button><button data-lm="games|' + i + '|-1">↑</button><button data-lm="games|' + i + '|1">↓</button><button data-ed="' + i + '">Edit</button><button data-dtop="games|' + i + '">Delete</button></div>';
    });
    return h + '</div><div class="row2" style="margin-top:16px"><select id="newg">' + Object.keys(SCH.game).map(function (k) { return '<option value="' + k + '">' + E(SCH.game[k].n) + '</option>'; }).join('') + '</select><button class="b1" id="addg">+ Add game</button><button class="b2" id="addnewgames">Add missing starter games</button><button class="b2" id="rstgames">Restore default games</button></div></div>';
  }
  function vGameEdit() {
    var P = 'games.' + cur, g = D.games[cur]; if (!g) { cur = -1; return vGames(); }
    var tp = SCH.game[g.type] || { n: g.type };
    var h = '<button class="b2" id="bk">← All games</button><div class="card2" style="margin-top:16px"><h3 class="gh">' + E(tp.n) + '</h3>' + SEL('Show this game?', P + '.on', YN) + '<div class="g2">' + F('Icon (emoji)', P + '.icon') + F('Title', P + '.t') + '</div>' + F('Short description', P + '.d', 'area', 2) + '<div class="g2">' + SEL('Difficulty label', P + '.diff', { Easy: 'Easy', Medium: 'Medium', Hard: 'Hard' }) + F('Maximum XP for a perfect round', P + '.xp', 'num') + '</div>';
    (tp.data || []).forEach(function (fd) { h += fld(P + '.' + fd[0], fd); });
    if (tp.list) h += listEd(P + '.' + tp.list[0], tp.list[1], tp.list[2], tp.list[3]);
    if (!tp.data && !tp.list) h += '<p class="hint">This game creates its own questions automatically, so there is nothing else to fill in.</p>';
    return h + '</div>';
  }
  function vLabs() {
    var h = '<div class="card2"><p class="hint">These appear in the home-page left/right simulation carousel and on the Simulations page, grouped by Physics, Chemistry and Mathematics. Add the HSC pack to populate topic-specific entries. Entries may share an interactive engine but have their own topic, description and challenge. Attach an engine to any concept in the chapter editor.</p><div class="lst">';
    D.labs.forEach(function (l, i) {
      h += '<div class="it"><span class="gi2">' + E(l.icon) + '</span><span class="tg ' + (l.on === false ? '' : 'av') + '">' + (l.on === false ? 'Hidden' : 'Visible') + '</span><b>' + E(l.t) + '</b> <span class="mu">· ' + E(l.sub || '') + (l.chapter ? ' · ' + E(l.chapter) : '') + '</span><span class="sp"></span><button data-tg="labs.' + i + '.on">' + (l.on === false ? 'Show' : 'Hide') + '</button><button data-lm="labs|' + i + '|-1">↑</button><button data-lm="labs|' + i + '|1">↓</button><button data-ed="' + i + '">Edit</button></div>';
    });
    return h + '</div><div class="row2" style="margin-top:16px"><button class="b1" id="addlabs">Add missing HSC simulation pack</button><span class="mu">Adds only entries not already present. Save changes to publish.</span></div></div>';
  }
  function vLabEdit() {
    var P = 'labs.' + cur, l = D.labs[cur]; if (!l) { cur = -1; return vLabs(); }
    return '<button class="b2" id="bk">← All simulations</button><div class="card2" style="margin-top:16px"><h3 class="gh">' + E(SIMS[l.sim] || l.sim) + '</h3>' + SEL('Show this simulation?', P + '.on', YN) + '<div class="g2">' + F('Icon (emoji)', P + '.icon') + F('Title', P + '.t') + '</div>' + SEL('Interactive simulation engine', P + '.sim', SIMS) + '<div class="g2">' + F('Subject label', P + '.sub') + F('HSC chapter / unit', P + '.chapter') + '</div>' + F('Concept focus', P + '.concept') + F('Short description', P + '.d', 'area', 3) + F('“Try this” challenge for students', P + '.tip', 'area', 3) + '<p class="hint">Choose the engine that best matches this topic. You can reuse an engine for several different HSC concepts.</p></div>';
  }
  function vTeam() {
    setTimeout(loadUsers, 0);
    return '<div class="card2"><h3 class="gh">Team members</h3><div id="ul" class="lst">Loading…</div><h3 class="gh">Add a team member</h3><div class="g2"><label class="f"><span>Username</span><input id="nu"></label><label class="f"><span>Password (8+ characters)</span><input id="np" type="password"></label></div><button class="b1" id="adu">Add member</button></div><div class="card2"><h3 class="gh">Change my password</h3><div class="g2"><label class="f"><span>Current password</span><input id="op" type="password"></label><label class="f"><span>New password (8+ characters)</span><input id="n2" type="password"></label></div><button class="b1" id="cpw">Change password</button></div>';
  }
  function loadUsers() { api('GET', '/users').then(function (r) { var u = $('#ul'); if (!u) return; u.innerHTML = r.users.map(function (n) { return '<div class="it"><b>' + E(n) + '</b>' + (n === r.me ? '<span class="tg">you</span>' : '') + '<span class="sp"></span>' + (n === r.me ? '' : '<button data-du="' + E(n) + '">Remove</button>') + '</div>'; }).join(''); }).catch(function (e) { toast(e.message, 1); }); }

  /* ---------- actions ---------- */
  function starter() {
    var add = 0, fill = 0;
    clone(DEF.chapters).forEach(function (dc) {
      if (!SUBS[dc.s]) return;
      var ex = D.chapters.filter(function (c) { return c.id === dc.id; })[0];
      if (!ex) { D.chapters.push(dc); add++; }
      else {
        /* Migrate the old one-chapter/one-lesson shape into Chapter → Concept. */
        if (!ex.chapterTitle && dc.chapterTitle) { ex.chapterTitle = dc.chapterTitle; fill++; }
        if ((!ex.t || ex.t === dc.chapterTitle || ex.t === dc.t && !ex.chapterTitle) && dc.t) ex.t = dc.t;
        if (ex.status === 'soon' && dc.status === 'available' && !ex.hook && !ex.intu) { ['status', 'sim', 'hook', 'intu', 'q'].forEach(function (k) { ex[k] = dc[k]; }); ex.blocks = ex.blocks || []; fill++; }
      }
    });
    mark(); toast(add + ' concepts added, ' + fill + ' concepts migrated/filled. Press Save changes.'); view();
  }
  function swap(path, i, d) { var a = get(D, path), j = i + d; if (a && a[j] !== undefined) { var t = a[i]; a[i] = a[j]; a[j] = t; mark(); view(); } }
  /* ---------- v6 admin: daily/missions, practice, insights, question bank, health, backup, search ---------- */
  var GOALS = { '': '— none —', stages: 'Concept stages completed', quiz: 'Quizzes completed', games: 'Games played', sims: 'Different simulations tried', daily: 'Daily challenge days done', xp: 'Total XP', perfect: 'Perfect quizzes', review: 'Correct mistake-book reviews' };
  var qb = { q: '', f: 'all', page: 0 };
  function subOpts() { var o = { '': 'All subjects' }; D.subjects.forEach(function (s) { o[s.id] = s.name; }); return o; }
  function missionEd() {
    var arr = D.missions = D.missions || [], h = '<h3 class="gh">Learning missions <span class="cnt">' + arr.length + '</span></h3><p class="hint">Each mission has up to 3 goals. A mission with a subject only counts that subject\'s stages and quizzes. Students claim the XP reward when all goals are met.</p>';
    arr.forEach(function (m, i) {
      var B = 'missions.' + i; m.goals = m.goals || [];
      h += '<div class="qc"><div class="qh"><b>#' + (i + 1) + ' ' + E(m.t || '') + '</b><span><button data-lm="missions|' + i + '|-1">↑</button> <button data-lm="missions|' + i + '|1">↓</button> <button data-ld="missions|' + i + '">Remove</button></span></div>' +
        SEL('Visible?', B + '.on', YN) + '<div class="g2">' + F('Icon (emoji)', B + '.i') + F('Title', B + '.t') + '</div>' + F('Description', B + '.d', 'area', 2) + '<div class="g2">' + SEL('Subject', B + '.s', subOpts()) + F('XP reward', B + '.xp', 'num') + '</div><div class="g2">' + F('Start button link (e.g. #/chapters)', B + '.link') + F('Hint (shown under 💡)', B + '.hint') + '</div>';
      for (var g = 0; g < 3; g++) { m.goals[g] = m.goals[g] || { k: '', n: 1 }; h += '<div class="g2">' + SEL('Goal ' + (g + 1), B + '.goals.' + g + '.k', GOALS) + F('Target number', B + '.goals.' + g + '.n', 'num') + '</div>'; }
      h += '</div>';
    });
    return h + '<button class="b2" data-la="missions" data-tpl="mission">+ Add mission</button>';
  }
  function vDaily() {
    D.daily = D.daily || {}; var d = D.daily, qs = [];
    D.chapters.forEach(function (c) { if (c.status === 'available') (c.q || []).forEach(function (q, i) { qs.push([c.id + ':' + i, c.t + ' #' + (i + 1) + ' — ' + String(q.q || '').slice(0, 60)]); }); });
    return '<div class="card2"><h3 class="gh">Daily Challenge</h3><p class="hint">Every day the site picks questions from all available chapter quizzes (same set for every student, changes at midnight). Wrong answers go to the student\'s mistake book.</p>' +
      SEL('Show Daily Challenge?', 'daily.on', YN).replace('data-p="daily.on"', 'data-p="daily.on" data-bool="1"') + F('Page title', 'daily.title') + F('Intro text', 'daily.intro', 'area', 2) +
      '<div class="g4">' + F('Questions per day (1-20)', 'daily.count', 'num') + F('XP for a full set', 'daily.xp', 'num') + F('Bonus XP (perfect, no hints)', 'daily.bonus', 'num') + SEL('Hint button', 'daily.hints', { 1: 'Enabled', 0: 'Disabled' }) + '</div>' +
      '<h3 class="gh">Pinned questions <span class="cnt">' + (d.pinned || []).length + '</span></h3><p class="hint">Pinned questions always appear first (e.g. before an exam). Pick from the list; remove to unpin.</p>' +
      (d.pinned || []).map(function (k, i) { return '<div class="it"><span>' + E(k) + '</span><span class="sp"></span><button data-unpin="' + i + '">Unpin</button></div>'; }).join('') +
      '<div class="row2" style="margin-top:10px"><select id="pinsel">' + qs.map(function (x) { return '<option value="' + E(x[0]) + '">' + E(x[1]) + '</option>'; }).join('') + '</select><button class="b2" id="pinadd">+ Pin question</button></div></div>' +
      '<div class="card2">' + missionEd() + '</div>';
  }
  function vPractice() {
    D.practice = D.practice || {};
    return '<div class="card2"><h3 class="gh">Smart Practice (mistake book)</h3><p class="hint">Wrong answers return after these gaps. Each correct review moves to the next gap; a wrong answer restarts from the first. After the last gap the question is mastered and removed.</p>' +
      F('Revision gaps in days (comma separated, e.g. 1,3,7,14)', 'practice.intervals') + '<div class="g2">' + F('Questions per practice session (1-50)', 'practice.sessionSize', 'num') + SEL('Step-by-step help on hard questions', 'practice.stepHints', { 1: 'Enabled', 0: 'Disabled' }) + '</div></div>' +
      '<div class="card2"><h3 class="gh">Cloud sync</h3><p class="hint">Signed-in students automatically sync progress, quiz history, badges, streaks, mistake book and missions across devices through this site\'s server function (Netlify Blobs). XP is always stored on the server.</p><button class="b2" id="syncTest">Check sync API</button> <span id="syncRes" class="hint"></span></div>' +
      '<div class="card2"><h3 class="gh">Explanations</h3><p class="hint">Short explanations are shown under every wrongly answered quiz, daily and game question. Add or improve them in <b>Question Bank</b>.</p><button class="b2" data-go="questions">Open Question Bank</button></div>';
  }
  function vInsights() { setTimeout(loadInsights, 0); return '<div class="card2"><h3 class="gh">Learning insights</h3><p class="hint">Built from progress that students have synced to the server. Use it to find concepts whose explanations need improvement.</p><div id="insBox">Loading…</div></div>'; }
  function loadInsights() {
    api('GET', '/student-insights').then(function (r) {
      var box = $('#insBox'); if (!box) return;
      var nm = function (id) { var c = D.chapters.filter(function (x) { return x.id === id; })[0]; return c ? c.t : id; };
      box.innerHTML = '<div class="dash">' + [['Students', r.students], ['With synced progress', r.withSync], ['Active (7 days)', r.active7], ['Quiz attempts', r.attempts], ['Average score', r.avgAccuracy == null ? '—' : r.avgAccuracy + '%'], ['Best streak', r.bestStreak]].map(function (x) { return '<div class="dc"><b>' + x[0] + '</b><span><strong>' + E(x[1]) + '</strong></span></div>'; }).join('') + '</div><h3 class="gh">Most-missed concepts</h3>' +
        (r.topMissed.length ? r.topMissed.map(function (m) { var ix = -1; D.chapters.forEach(function (c, i) { if (c.id === m.conceptId) ix = i; }); return '<div class="it"><b>' + E(nm(m.conceptId)) + '</b><span class="mu">· ' + m.wrong + ' wrong answers</span><span class="sp"></span>' + (ix >= 0 ? '<button data-jump="chapters|' + ix + '">Edit concept</button>' : '') + '</div>'; }).join('') : '<p class="hint">No data yet.</p>');
    }).catch(function (e) { var box = $('#insBox'); if (box) box.textContent = e.message; });
  }
  function qList() {
    var out = [], q = qb.q.trim().toLowerCase();
    D.chapters.forEach(function (c, ci) { (c.q || []).forEach(function (x, qi) {
      var miss = !String(x.e || '').trim(), long = String(x.e || '').length > 160;
      if (qb.f === 'noexp' && !miss) return; if (qb.f === 'long' && !long) return;
      if (q && (String(x.q || '') + ' ' + String(x.e || '') + ' ' + c.t).toLowerCase().indexOf(q) < 0) return;
      out.push({ ci: ci, qi: qi, c: c, x: x });
    }); });
    return out;
  }
  function vQuestions() {
    var all = qList(), per = 15, pages = Math.max(1, Math.ceil(all.length / per)); qb.page = Math.min(qb.page, pages - 1);
    var tot = 0, noexp = 0; D.chapters.forEach(function (c) { (c.q || []).forEach(function (x) { tot++; if (!String(x.e || '').trim()) noexp++; }); });
    var h = '<div class="card2"><p class="hint">' + tot + ' questions in total · <b>' + noexp + '</b> without an explanation. Keep explanations short (1-2 sentences, under 160 characters).</p><div class="row2"><input id="qbq" class="srch" placeholder="Search questions, explanations, concepts…" value="' + E(qb.q) + '">' +
      [['all', 'All'], ['noexp', 'No explanation'], ['long', 'Too long']].map(function (f) { return '<button class="' + (qb.f === f[0] ? 'b1' : 'b2') + '" data-qbf="' + f[0] + '">' + f[1] + '</button>'; }).join(' ') + '</div></div>';
    all.slice(qb.page * per, qb.page * per + per).forEach(function (r) {
      var B = 'chapters.' + r.ci + '.q.' + r.qi;
      h += '<div class="qc"><div class="qh"><b>' + E(r.c.t) + ' · Q' + (r.qi + 1) + '</b><span><button data-jump="chapters|' + r.ci + '">Open concept</button></span></div>' + F('Question', B + '.q', 'area', 2) + '<div class="g2">' + [0, 1, 2, 3].map(function (k) { return F('Option ' + (k + 1), B + '.o.' + k); }).join('') + '</div>' + SEL('Correct answer', B + '.a', { 0: 'Option 1', 1: 'Option 2', 2: 'Option 3', 3: 'Option 4' }) + F('Short explanation (' + String(r.x.e || '').length + ' chars)', B + '.e', 'area', 2) + '</div>';
    });
    return h + '<div class="row2" style="margin-top:14px"><button class="b2" data-qbp="-1">← Prev</button><span class="hint">Page ' + (qb.page + 1) + ' / ' + pages + ' · ' + all.length + ' shown</span><button class="b2" data-qbp="1">Next →</button></div>';
  }
  function audit() {
    var is = [], add = function (sev, msg, sec, cur) { is.push({ sev: sev, msg: msg, sec: sec, cur: cur }); };
    D.chapters.forEach(function (c, i) {
      if (c.status !== 'available') return;
      if (!String(c.hook || '').trim()) add('warn', c.t + ': Stage 1 hook is empty', 'chapters', i);
      if (!String(c.intu || '').trim()) add('warn', c.t + ': Stage 2 intuition is empty', 'chapters', i);
      if (!(c.q || []).length) add('warn', c.t + ': no quiz questions', 'chapters', i);
      (c.q || []).forEach(function (q, k) {
        if (!String(q.q || '').trim()) add('err', c.t + ' Q' + (k + 1) + ': empty question', 'chapters', i);
        var op = (q.o || []).map(function (o) { return String(o || '').trim(); });
        if (op.some(function (o) { return !o; })) add('err', c.t + ' Q' + (k + 1) + ': an option is empty', 'chapters', i);
        if (new Set(op).size < op.length) add('err', c.t + ' Q' + (k + 1) + ': duplicate options', 'chapters', i);
        if (!String(q.e || '').trim()) add('info', c.t + ' Q' + (k + 1) + ': no explanation', 'questions', -1);
      });
    });
    D.games.forEach(function (g, i) { var dt = g.data || {}, n = { blitz: (dt.q || []).length, memory: (dt.pairs || []).length, tf: (dt.items || []).length, scramble: (dt.words || []).length, balance: (dt.eqs || []).length, oddOne: (dt.sets || []).length, stepOrder: (dt.puzzles || []).length }[g.type]; if (n != null && n < 2 && !(g.type === 'blitz' && String(dt.useChapters) !== '0')) add('warn', 'Game "' + g.t + '" has too little content (' + n + ')', 'games', i); });
    (D.missions || []).forEach(function (m, i) { if (!(m.goals || []).some(function (g) { return g.k; })) add('warn', 'Mission "' + m.t + '" has no goals', 'daily', -1); if (m.s && !SUBS[m.s]) add('err', 'Mission "' + m.t + '" uses a missing subject', 'daily', -1); });
    return is;
  }
  function vHealth() {
    var is = audit(), c = { err: 0, warn: 0, info: 0 }; is.forEach(function (x) { c[x.sev]++; });
    return '<div class="card2"><h3 class="gh">Content health check</h3><p class="hint">Static checks of the content you are editing (not saved yet). Errors can break a question; warnings are quality gaps.</p><div class="dash"><div class="dc"><b>Errors</b><span><strong>' + c.err + '</strong></span></div><div class="dc"><b>Warnings</b><span><strong>' + c.warn + '</strong></span></div><div class="dc"><b>Notes</b><span><strong>' + c.info + '</strong></span></div></div></div><div class="card2">' +
      (is.length ? is.slice(0, 150).map(function (x) { return '<div class="it"><span class="tg ' + (x.sev === 'err' ? '' : 'av') + '">' + x.sev + '</span><span>' + E(x.msg) + '</span><span class="sp"></span><button data-jump="' + x.sec + '|' + x.cur + '">Fix</button></div>'; }).join('') + (is.length > 150 ? '<p class="hint">…and ' + (is.length - 150) + ' more.</p>' : '') : '<p class="hint">✓ No problems found.</p>') + '</div>';
  }
  function vBackup() {
    setTimeout(loadHistory, 0);
    return '<div class="card2"><h3 class="gh">Backup file</h3><p class="hint">Download all content as a JSON file, or load a previous file. Loading only fills the editor; press Save changes to publish.</p><button class="b1" id="bkExport">⬇ Download backup</button> <button class="b2" id="bkImport">⬆ Load backup file</button></div>' +
      '<div class="card2"><h3 class="gh">Version history</h3><p class="hint">Every save keeps the previous version (last 20). Restoring publishes that version immediately and keeps the current one as a new history entry.</p><div id="histBox">Loading…</div></div>';
  }
  function loadHistory() { api('GET', '/content-history').then(function (r) { var b = $('#histBox'); if (!b) return; b.innerHTML = r.items.length ? r.items.map(function (v) { return '<div class="it"><b>' + E(new Date(v.at).toLocaleString()) + '</b><span class="mu">· ' + E(v.by || '') + ' · ' + v.chapters + ' concepts · ' + Math.round(v.bytes / 1024) + ' KB</span><span class="sp"></span><button data-restore="' + E(v.id) + '">Restore</button></div>'; }).join('') : '<p class="hint">No saved versions yet. They appear after your next save.</p>'; }).catch(function (e) { var b = $('#histBox'); if (b) b.textContent = e.message; }); }
  function normExtra() {
    if (D.practice) { var iv = D.practice.intervals; if (typeof iv === 'string') iv = iv.split(/[,\s]+/).filter(Boolean).map(Number).filter(function (x) { return x >= 0 && x <= 365; }); if (!Array.isArray(iv) || !iv.length) iv = [1, 3, 7, 14]; D.practice.intervals = iv.slice(0, 8); D.practice.sessionSize = Math.max(1, Math.min(50, +D.practice.sessionSize || 10)); D.practice.stepHints = +D.practice.stepHints === 0 ? 0 : 1; }
    if (D.daily) { D.daily.count = Math.max(1, Math.min(20, +D.daily.count || 5)); D.daily.xp = Math.max(0, Math.min(500, +D.daily.xp || 0)); D.daily.bonus = Math.max(0, Math.min(500, +D.daily.bonus || 0)); D.daily.hints = +D.daily.hints === 0 ? 0 : 1; D.daily.on = +D.daily.on === 0 || D.daily.on === false ? 0 : 1; D.daily.pinned = (D.daily.pinned || []).slice(0, 40); }
    (D.missions || []).forEach(function (m) { m.goals = (m.goals || []).filter(function (g) { return g && g.k; }).map(function (g) { return { k: g.k, n: Math.max(1, Math.min(1000, +g.n || 1)) }; }); m.xp = Math.max(0, +m.xp || 0); if (typeof m.on !== 'boolean') m.on = !(m.on === 0 || m.on === '0'); m.s = m.s || ''; });
    (D.games || []).forEach(function (g) { if (g.type === 'oddOne') (g.data.sets || []).forEach(function (s) { s.odd = +s.odd || 0; }); });
    (D.customPages || []).forEach(function (page, i) { page.title = String(page.title || 'Untitled page').trim(); page.navLabel = String(page.navLabel || page.title).trim(); page.body = String(page.body || ''); var slug = String(page.slug || page.title).toLowerCase(); if (slug.normalize) slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); slug = slug.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'learning-page'; var base = slug, suffix = 2; while ((D.customPages || []).some(function (other, j) { return j !== i && other.slug === slug; })) slug = base + '-' + suffix++; page.slug = slug; if (typeof page.on !== 'boolean') page.on = !(page.on === 0 || page.on === '0' || page.on === false); });
  }
  function globalSearch(q) {
    q = q.trim().toLowerCase(); if (q.length < 2) return [];
    var r = [], has = function (s) { return String(s || '').toLowerCase().indexOf(q) >= 0; };
    D.chapters.forEach(function (c, i) { if (has(c.t) || has(c.chapterTitle) || has(c.hook) || has(c.intu)) r.push(['Concept', c.t, 'chapters', i]); (c.q || []).forEach(function (x) { if (has(x.q) || has(x.e)) r.push(['Question', c.t + ': ' + String(x.q).slice(0, 70), 'questions', -1]); }); });
    D.games.forEach(function (g, i) { if (has(g.t) || has(g.d)) r.push(['Game', g.t, 'games', i]); });
    (D.missions || []).forEach(function (m) { if (has(m.t) || has(m.d)) r.push(['Mission', m.t, 'daily', -1]); });
    CL_TXT.forEach(function (g) { g[1].forEach(function (t) { if (has(t[1]) || has(D.texts[t[0]])) r.push(['Text', t[1] + ' — ' + String(D.texts[t[0]] || '').slice(0, 50), 'texts', -1]); }); });
    D.home.sections.forEach(function (s, i) { if (has(s.h) || has(s.p) || has(s.pill)) r.push(['Home section', String(s.h || s.type).replace('|', ' '), 'home', i]); });
    return r.slice(0, 40);
  }
  function openSearch() {
    var m = document.createElement('div'); m.id = 'mdl'; m.innerHTML = '<div><div class="qh"><b>Search everything</b><span><button class="b2" id="gsx">Close</button></span></div><input id="gsq" class="srch" placeholder="Type at least 2 letters…" autofocus><div id="gsr" style="margin-top:10px"></div></div>'; document.body.appendChild(m);
    var inp = m.querySelector('#gsq'), res = m.querySelector('#gsr'); inp.focus();
    inp.oninput = function () { var r = globalSearch(inp.value); res.innerHTML = r.length ? r.map(function (x) { return '<div class="it"><span class="tg av">' + x[0] + '</span><span>' + E(x[1]) + '</span><span class="sp"></span><button data-jump="' + x[2] + '|' + x[3] + '">Open</button></div>'; }).join('') : '<p class="hint">' + (inp.value.trim().length < 2 ? '' : 'No results.') + '</p>'; };
    m.querySelector('#gsx').onclick = function () { m.remove(); };
    res.onclick = function (e) { var b = e.target.closest('[data-jump]'); if (b) { var j = b.dataset.jump.split('|'); m.remove(); sec = j[0]; cur = +j[1]; view(); } };
  }
  function onClick2(e) {
    var t = e.target.closest('button'); if (!t) return false; var d = t.dataset;
    if (d.jump) { var j = d.jump.split('|'); sec = j[0]; cur = +j[1]; view(); return true; }
    if (d.unpin != null) { D.daily.pinned.splice(+d.unpin, 1); mark(); view(); return true; }
    if (t.id === 'pinadd') { var v = $('#pinsel') && $('#pinsel').value; D.daily.pinned = D.daily.pinned || []; if (v && D.daily.pinned.indexOf(v) < 0) { D.daily.pinned.push(v); mark(); view(); } return true; }
    if (d.qbf) { qb.f = d.qbf; qb.page = 0; view(); return true; }
    if (d.qbp) { qb.page = Math.max(0, qb.page + +d.qbp); view(); return true; }
    if (t.id === 'syncTest') { api('GET', '/student-insights').then(function (r) { $('#syncRes').textContent = '✓ Sync API reachable. ' + r.withSync + ' of ' + r.students + ' students have synced data.'; }).catch(function (x) { $('#syncRes').textContent = '✗ ' + x.message; }); return true; }
    if (t.id === 'bkExport') { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(D, null, 1)], { type: 'application/json' })); a.download = 'conceptlab-backup-' + new Date().toISOString().slice(0, 10) + '.json'; a.click(); return true; }
    if (t.id === 'bkImport') { var i = document.createElement('input'); i.type = 'file'; i.accept = 'application/json'; i.onchange = function () { var f = i.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { try { var o = JSON.parse(r.result); if (!o || !Array.isArray(o.chapters) || !o.settings || !o.theme) throw new Error('Not a ConceptLab backup'); if (!confirm('Load this backup into the editor? Unsaved edits will be replaced.')) return; norm(o); mark(); toast('Backup loaded. Press Save changes to publish.'); view(); } catch (x) { toast(x.message, 1); } }; r.readAsText(f); }; i.click(); return true; }
    if (d.restore) { if (confirm('Restore this version now? It goes live immediately.')) api('POST', '/content-history', { id: d.restore }).then(function () { return api('GET', '/content'); }).then(function (c) { norm(c); dirty = false; $('#dot').className = ''; toast('Version restored and live.'); view(); }).catch(function (x) { toast(x.message, 1); }); return true; }
    if (t.id === 'socialAdd') { D.settings.socialLinks = Array.isArray(D.settings.socialLinks) ? D.settings.socialLinks : []; D.settings.socialLinks.push({ label: 'Instagram', url: 'https://', kind: 'link' }); mark(); view(); return true; }
    if (d.socialRemove != null) { if (confirm('Remove this social media link?')) { D.settings.socialLinks.splice(+d.socialRemove, 1); mark(); view(); } return true; }
    if (t.id === 'gsb') { openSearch(); return true; }
    return false;
  }
  function onClick(e) {
    var t = e.target.closest('button'); if (!t) return; var d = t.dataset;
    if (onClick2(e)) return;
    if (d.pick) return picker(d.pick);
    if (d.jsonEditor) return openJsonEditor(d.jsonEditor, d.jsonTitle || 'Advanced JSON editor');
    if (d.openHomeSection != null) { sec = 'home'; cur = +d.openHomeSection; return view(); }
    if (d.pdf) { var pp = d.pdf; return upPdf(function (u) { set(D, pp, u); mark(); view(); }); }
    if (t.id === 'upl') return up(function () { view(); });
    if (d.dm) { if (confirm('Delete this image? Places using it will show nothing.')) api('DELETE', '/media', { id: d.dm }).then(function () { view(); }); return; }
    if (d.cp) { try { navigator.clipboard.writeText(location.origin + d.cp); toast('Link copied'); } catch (x) { toast(d.cp); } return; }
    if (t.id === 'addCustomPage') {
      var title = prompt('Enter the public page title:', 'New learning page');
      if (!title || !title.trim()) return;
      title = title.trim();
      var slug = title.normalize ? title.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : title;
      slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'learning-page';
      var baseSlug = slug, suffix = 2; while ((D.customPages || []).some(function (x) { return x.slug === slug; })) slug = baseSlug + '-' + suffix++;
      D.customPages.push({ id: rid('page'), slug: slug, title: title, navLabel: title, body: 'এই পেজের লেখা এখানে লিখুন।\n\nপ্রতিটি নতুন অনুচ্ছেদের মাঝে একটি ফাঁকা লাইন রাখুন।', on: true });
      mark(); return view();
    }
    if (d.deletePage != null) { if (confirm('Delete this custom page? It will be removed from the public menu after saving.')) { D.customPages.splice(+d.deletePage, 1); mark(); return view(); } return; }
    /* generic lists */
    if (d.la) { var arr = get(D, d.la); if (!arr) { set(D, d.la, []); arr = get(D, d.la); } arr.push(TPL[d.tpl]()); mark(); return view(); }
    if (d.ld) { var a = d.ld.split('|'); get(D, a[0]).splice(+a[1], 1); mark(); return view(); }
    if (d.lm) { var m = d.lm.split('|'); return swap(m[0], +m[1], +m[2]); }
    if (d.tg) { var cv = get(D, d.tg); set(D, d.tg, cv === false ? true : false); mark(); return view(); }
    if (d.dtop) { var q = d.dtop.split('|'); if (confirm('Delete this item? This cannot be undone after you save.')) { if (q[0] === 'games') { var gx = D.games[+q[1]]; if (gx) { D.deletedGames = D.deletedGames || []; D.deletedGames.push(gx.id); } } get(D, q[0]).splice(+q[1], 1); mark(); view(); } return; }
    /* chapter blocks */
    if (t.id === 'addb') { D.chapters[cur].blocks.push({ t: 'text', v: '', c: '' }); mark(); return view(); }
    if (d.bd != null) { D.chapters[cur].blocks.splice(+d.bd, 1); mark(); return view(); }
    if (d.bm) { var bq = d.bm.split('|'), a1 = +bq[0], b1 = a1 + +bq[1], B = D.chapters[cur].blocks; if (B[b1]) { var tmp = B[a1]; B[a1] = B[b1]; B[b1] = tmp; mark(); view(); } return; }
    /* subjects */
    if (t.id === 'adds') { D.subjects.push({ id: 's' + Date.now().toString(36), name: 'New subject' }); mark(); sync(); return view(); }
    if (d.ds != null) { var sj = D.subjects[+d.ds]; if (D.subjects.length < 2) return toast('Keep at least one subject', 1); if (D.chapters.some(function (c) { return c.s === sj.id; })) return toast('Move or delete its chapters first', 1); D.subjects.splice(+d.ds, 1); mark(); sync(); return view(); }
    if (t.id === 'refreshStudents') return loadStudents();
    if (t.id === 'refreshFeedback') return loadFeedback();
    if (d.feedbackRead) return api('PUT', '/feedback', { id: d.feedbackRead, read: d.read === '1' }).then(function () { toast('Feedback updated'); loadFeedback(); }).catch(function (e) { toast(e.message, 1); });
    if (d.feedbackDelete) { if (confirm('Delete this feedback message permanently?')) api('DELETE', '/feedback', { id: d.feedbackDelete }).then(function () { toast('Feedback deleted'); loadFeedback(); }).catch(function (e) { toast(e.message, 1); }); return; }
    if (d.go) { sec = d.go; cur = -1; return view(); }
    if (d.ed != null) { cur = +d.ed; return view(); }
    if (t.id === 'bk') { cur = -1; return view(); }
    /* home */
    if (t.id === 'addsec') { var ty = $('#newsec').value; D.home.sections.push({ id: rid('s'), type: ty, on: true, pill: '', h: 'New section', p: '', items: [] }); cur = D.home.sections.length - 1; mark(); return view(); }
    if (t.id === 'rsthome') { if (confirm('Replace the home page sections with the default ones? Your current sections will be lost after you save.')) { D.home = clone(DEF.home); mark(); view(); } return; }
    /* games / labs / theme */
    if (t.id === 'addg') { var gt = $('#newg').value, base = clone(DEF.games.filter(function (g) { return g.type === gt; })[0] || { type: gt, icon: '🎮', t: 'New game', d: '', diff: 'Medium', xp: 30, data: {} }); base.id = rid(gt); base.t = 'New ' + (SCH.game[gt] || { n: gt }).n; base.on = true; D.games.push(base); cur = D.games.length - 1; mark(); return view(); }
    if (t.id === 'addnewgames') { var added = 0, skippedGames = 0; ['physics-formula-sprint','chemistry-ion-challenge','math-concept-scramble','physics-unit-rush','chem-reaction-race','math-truth-arena','formula-pair-cosmos','hsc-term-scramble'].forEach(function (id) { var game = DEF.games.filter(function (x) { return x.id === id; })[0]; if (!game || D.games.some(function (x) { return x.id === id; })) return; if (D.games.length >= 40) { skippedGames++; return; } D.games.push(clone(game)); added++; }); mark(); toast(added + ' new starter games added' + (skippedGames ? '; game limit reached' : '') + '. Review and press Save changes.'); return view(); }
    if (t.id === 'rstgames') { if (confirm('Replace all games with the default games? Your current games will be lost after you save.')) { D.games = clone(DEF.games); mark(); view(); } return; }
    if (t.id === 'addlabs') { var n = 0, skipped = 0; clone(DEF.labs).forEach(function (l) { if (D.labs.some(function (x) { return x.id === l.id; })) return; if (D.labs.length >= 250) { skipped++; return; } D.labs.push(l); n++; }); mark(); toast(n + ' HSC simulation entries added' + (skipped ? '; ' + skipped + ' skipped because the 250-entry safety limit was reached' : '') + '. Review and press Save changes.'); return view(); }
    if (t.id === 'rsttheme') { D.theme = clone(DEF.theme); mark(); return view(); }
    /* chapters */
    if (t.id === 'starter') return starter();
    if (t.id === 'addc') { var title = prompt('Enter the chapter name (for example: Straight Lines):', 'New chapter'); if (!title || !title.trim()) return; D.chapters.push({ id: rid('concept'), s: D.subjects[0].id, chapterTitle: title.trim(), t: 'First concept', status: 'soon', sim: 'none', hook: '', intu: '', q: [], blocks: [] }); cur = D.chapters.length - 1; mark(); return view(); }
    if (t.id === 'addconcept' || d.addconcept) { var groupValue = d.addconcept ? d.addconcept : ''; var parts = groupValue ? groupValue.split('|') : []; var last = parts.length > 1 ? { s: parts.shift(), chapterTitle: parts.join('|') } : (D.chapters[cur] || D.chapters.filter(function (x) { return x.s === D.subjects[0].id; }).slice(-1)[0]); D.chapters.push({ id: rid('concept'), s: last ? last.s : D.subjects[0].id, chapterTitle: last ? (last.chapterTitle || last.t) : 'New chapter', t: 'New concept', status: 'soon', sim: 'none', hook: '', intu: '', q: [], blocks: [] }); cur = D.chapters.length - 1; mark(); return view(); }
    if (d.mv) { var mv = d.mv.split('|'), i = +mv[0], s = +mv[1], j = i + s; while (D.chapters[j] && D.chapters[j].s !== D.chapters[i].s) j += s; if (D.chapters[j]) { var x = D.chapters[i]; D.chapters[i] = D.chapters[j]; D.chapters[j] = x; mark(); view(); } return; }
    if (t.id === 'addq') { D.chapters[cur].q.push({ q: '', o: ['', '', '', ''], a: 0, e: '' }); mark(); return view(); }
    if (d.dq != null) { D.chapters[cur].q.splice(+d.dq, 1); mark(); return view(); }
    if (t.id === 'delc') { if (confirm('Delete this chapter? This cannot be undone after you save.')) { D.chapters.splice(cur, 1); cur = -1; mark(); view(); } return; }
    /* team */
    if (t.id === 'adu') return api('POST', '/users', { username: $('#nu').value, password: $('#np').value }).then(function () { toast('Member added'); view(); }).catch(function (e) { toast(e.message, 1); });
    if (d.du) { if (confirm('Remove ' + d.du + '?')) api('DELETE', '/users', { username: d.du }).then(function () { toast('Removed'); loadUsers(); }).catch(function (e) { toast(e.message, 1); }); return; }
    if (t.id === 'cpw') return api('POST', '/password', { old: $('#op').value, new: $('#n2').value }).then(function () { toast('Password changed'); $('#op').value = $('#n2').value = ''; }).catch(function (e) { toast(e.message, 1); });
  }
  window.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && $('#sv')) { e.preventDefault(); save(); } if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && $('#sv')) { e.preventDefault(); openSearch(); } });
  window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
  boot();
})();
