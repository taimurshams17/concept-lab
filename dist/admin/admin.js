(function () {
  var $ = function (s) { return document.querySelector(s); }, root = $('#root');
  var T = localStorage.getItem('clt') || '', ME = localStorage.getItem('clu') || '', D = null, sec = 'dashboard', cur = -1, dirty = false;
  var SUBS = {}, DEF = window.CL_DEF, SCH = window.CL_SCHEMA;
  var SIMS = { line: 'Straight line graph', force: 'Force and motion', flame: 'Flame test colours', wave: 'Wave machine', projectile: 'Projectile launcher', pendulum: 'Pendulum', spring: 'Spring and mass', circuit: 'Ohm’s law circuit', gas: 'Gas particles', vectors: 'Vector adder', unit: 'Unit circle', tangent: 'Derivative / tangent zoom', matrix: 'Matrix transformer', circle: 'Circle explorer', kinetics: 'Reaction kinetics', equilibrium: 'Chemical equilibrium', ph: 'pH explorer', titration: 'Acid–base titration', electrochem: 'Electrochemical cell', optics: 'Thin lens optics', magnetic: 'Magnetic field', periodic: 'Periodic trends', bond: 'Chemical bonding & polarity', stoich: 'Stoichiometry / limiting reagent', integration: 'Definite integral area model', probability: 'Probability trials', custom: 'Custom (paste your own HTML/JS)', none: 'No simulation' };
  var NAV = [['dashboard', 'Dashboard'], ['students', 'Students & Accounts'], ['feedback', 'Feedback'], ['home', 'Home Page'], ['chapters', 'Chapters'], ['games', 'Games (Arcade)'], ['labs', 'Simulations (Lab)'], ['rewards', 'XP & Badges'], ['subjects', 'Subjects'], ['texts', 'All Texts'], ['media', 'Images / Media'], ['theme', 'Theme / Colors'], ['settings', 'Website Settings'], ['team', 'Team & Password']];
  var TITLES = { dashboard: 'Dashboard', students: 'Students & Accounts', feedback: 'Feedback', home: 'Home Page', chapters: 'Chapters', games: 'Games (Arcade)', labs: 'Simulations (Lab)', rewards: 'XP & Badges', theme: 'Theme / Colors', settings: 'Website Settings', team: 'Team & Password', subjects: 'Subjects', texts: 'All Texts', media: 'Images / Media' };
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
    sec_t: function () { return { t: 'New' }; },
    sec_stat: function () { return { t: 'New number', k: 'custom', v: '10' }; },
    sec_goal: function () { return { i: '⭐', t: 'New card', p: '' }; },
    sec_stage: function () { return { t: '', p: '' }; },
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
    d.settings = Object.assign({}, def.settings, d.settings || {});
    d.theme = Object.assign({}, def.theme, d.theme || {});
    d.subjects = d.subjects && d.subjects.length ? d.subjects : def.subjects;
    d.chapters = d.chapters && d.chapters.length ? d.chapters : def.chapters;
    d.home = d.home && d.home.sections ? d.home : def.home;
    d.games = Array.isArray(d.games) ? d.games : def.games;
    d.labs = Array.isArray(d.labs) ? d.labs : def.labs;
    d.gam = Object.assign({}, def.gam, d.gam || {});
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
    root.innerHTML = '<div class="app"><aside class="sb"><div class="who"><div class="av">' + E((ME || 'A').slice(0, 2).toUpperCase()) + '</div><div><b>' + E(D.settings.siteName || 'ConceptLab') + '</b><a href="/" target="_blank">View live site ↗</a></div></div><nav>' + NAV.map(function (n) { return '<button data-s="' + n[0] + '">' + n[1] + '</button>'; }).join('') + '</nav><button class="so" id="so">Sign Out</button></aside><main class="mn"><header class="tp"><div><h1 id="ttl"></h1><p>Signed in as <b>' + E(ME) + '</b></p></div><div class="act"><span id="dot"></span><a class="b2" href="/" target="_blank">Preview Site</a><button class="b1" id="sv">Save changes</button></div></header><div id="body"></div></main></div>';
    $('#so').onclick = out; $('#sv').onclick = save;
    document.querySelectorAll('.sb nav button').forEach(function (b) { b.onclick = function () { sec = b.dataset.s; cur = -1; view(); }; });
    $('#body').oninput = onIn; $('#body').onchange = onIn; $('#body').onclick = onClick; view();
  }
  function save() { api('PUT', '/content', D).then(function () { dirty = false; $('#dot').className = ''; toast('Saved. Changes are live.'); }).catch(function (e) { toast(e.message, 1); }); }
  function mark() { dirty = true; var d = $('#dot'); if (d) d.className = 'on'; }
  function onIn(e) {
    var p = e.target.dataset && e.target.dataset.p; if (!p) return;
    var v = e.target.value; if (/\.a$/.test(p)) v = +v; if (e.target.dataset.num) v = v === '' ? '' : +v; if (/\.on$/.test(p)) v = (v === '1'); set(D, p, v); mark();
    if (e.type === 'change' && /\.(status|sim)$|blocks\.\d+\.t$/.test(p)) view();
  }
  function view() {
    document.querySelectorAll('.sb nav button').forEach(function (b) { b.classList.toggle('on', b.dataset.s === sec); });
    sync();
    var t = TITLES[sec]; if (cur >= 0 && { chapters: 1, home: 1, games: 1, labs: 1 }[sec]) t = { chapters: 'Edit concept', home: 'Edit section', games: 'Edit game', labs: 'Edit simulation' }[sec];
    $('#ttl').textContent = t;
    var V = { dashboard: vDash, students: vStudents, feedback: vFeedback, home: cur >= 0 ? vSecEdit : vHome, chapters: cur >= 0 ? vEdit : vChapters, games: cur >= 0 ? vGameEdit : vGames, labs: cur >= 0 ? vLabEdit : vLabs, rewards: vRewards, theme: vTheme, settings: vSet, team: vTeam, subjects: vSubs, texts: vTexts, media: vMedia };
    $('#body').innerHTML = V[sec](); window.scrollTo(0, 0);
    if (sec === 'dashboard') loadStudentCount();
    if (sec === 'students') loadStudents();
    if (sec === 'feedback') loadFeedback();
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
    var cards = [['student-count', 'Student accounts', '<span id="studentCountValue">Loading…</span> registered'], ['feedback', 'Feedback', 'View messages sent by visitors'], ['home', 'Home Page', D.home.sections.length + ' sections, hero text'], ['chapters', 'Chapters & Concepts', Object.keys(chapterNames).length + ' chapters · ' + D.chapters.length + ' concepts (' + av + ' available)'], ['games', 'Games (Arcade)', D.games.length + ' games'], ['labs', 'Simulations (Lab)', D.labs.length + ' simulations'], ['rewards', 'XP & Badges', (D.gam.badges || []).length + ' badges, XP rules'], ['texts', 'All Texts', 'Change any word on the site'], ['media', 'Images / Media', 'Upload and manage images'], ['subjects', 'Subjects', D.subjects.length + ' subjects'], ['theme', 'Theme / Colors', 'Colours, glow, effects'], ['settings', 'Website Settings', 'Site name, footer, about'], ['team', 'Team & Password', 'Add your friend, change password']];
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
    return h + '</div>';
  }
  function vSubs() { return '<div class="card2"><p class="hint">Add or rename subjects (for example Biology, ICT). Each chapter belongs to one subject.</p>' + D.subjects.map(function (s, i) { return '<div class="it"><input class="si" data-p="subjects.' + i + '.name" value="' + E(s.name) + '"><button data-ds="' + i + '">Delete</button></div>'; }).join('') + '<br><button class="b1" id="adds">+ Add subject</button></div>'; }
  function vTexts() { return CL_TXT.map(function (g) { return '<div class="card2"><h3 class="gh">' + g[0] + '</h3>' + g[1].map(function (t) { return F(t[1], 'texts.' + t[0], t[2].length > 55 ? 'area' : 'text', 2); }).join('') + '</div>'; }).join(''); }
  function vMedia() { setTimeout(function () { var g = $('#mg'); if (g) mgrid(g); }, 0); return '<div class="card2"><p class="hint">Upload images once, then pick them anywhere (logo, home picture, chapter cover, content blocks). Images are shrunk automatically.</p><button class="b1" id="upl">+ Upload image</button><br><br><div class="mg" id="mg">Loading…</div></div>'; }
  function vSet() { return '<div class="card2">' + F('Site name', 'settings.siteName') + imgF('Logo image (optional)', 'settings.logo', D.settings.logo) + imgF('Home page picture (replaces the animation)', 'settings.hero', D.settings.hero) + imgF('About page picture', 'settings.aboutImg', D.settings.aboutImg) + F('Footer text', 'settings.footer', 'area', 2) + F('About page text', 'settings.about', 'area', 4) + '</div>'; }
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
  function onClick(e) {
    var t = e.target.closest('button'); if (!t) return; var d = t.dataset;
    if (d.pick) return picker(d.pick);
    if (d.pdf) { var pp = d.pdf; return upPdf(function (u) { set(D, pp, u); mark(); view(); }); }
    if (t.id === 'upl') return up(function () { view(); });
    if (d.dm) { if (confirm('Delete this image? Places using it will show nothing.')) api('DELETE', '/media', { id: d.dm }).then(function () { view(); }); return; }
    if (d.cp) { try { navigator.clipboard.writeText(location.origin + d.cp); toast('Link copied'); } catch (x) { toast(d.cp); } return; }
    /* generic lists */
    if (d.la) { var arr = get(D, d.la); if (!arr) { set(D, d.la, []); arr = get(D, d.la); } arr.push(TPL[d.tpl]()); mark(); return view(); }
    if (d.ld) { var a = d.ld.split('|'); get(D, a[0]).splice(+a[1], 1); mark(); return view(); }
    if (d.lm) { var m = d.lm.split('|'); return swap(m[0], +m[1], +m[2]); }
    if (d.tg) { var cv = get(D, d.tg); set(D, d.tg, cv === false ? true : false); mark(); return view(); }
    if (d.dtop) { var q = d.dtop.split('|'); if (confirm('Delete this item? This cannot be undone after you save.')) { get(D, q[0]).splice(+q[1], 1); mark(); view(); } return; }
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
  window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
  boot();
})();
