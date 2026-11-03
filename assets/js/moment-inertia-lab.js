/* ConceptLab — Moment of Inertia Explorer
   One responsive simulation with 14 selectable cases: two definitions, ten body formulas,
   and both axis theorems. All values are evaluated from the selected physical model. */
(function () {
  'use strict';

  var key = 'moment-inertia-explorer';
  var chapter = 'নিউটনীয় বলবিদ্যা';
  var cases = [
    {
      id: 'discrete', group: 'ভিত্তি ও সংজ্ঞা', label: 'বিচ্ছিন্ন কণা · Σmr²',
      formula: 'I = Σ mᵢrᵢ²',
      controls: [
        { k: 'M', l: 'মোট ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' },
        { k: 'R', l: 'সর্বোচ্চ ব্যাসার্ধ R', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' },
        { k: 'N', l: 'কণার সংখ্যা N', min: 2, max: 12, step: 1, v: 6, u: 'টি' }
      ],
      calc: function (v) { var sum = 0, n = Math.round(v.N); for (var i = 0; i < n; i++) { var r = v.R * (0.25 + 0.75 * (n === 1 ? 1 : i / (n - 1))); sum += (v.M / n) * r * r; } return { I: sum, extra: 'প্রতিটি কণার ভর m = ' + f(v.M / n, 3) + ' kg; আলাদা আলাদা mᵢrᵢ² যোগ করলে মোট I পাওয়া যায়।' }; },
      note: 'বস্তুকে অনেকগুলো ছোট কণা হিসেবে ভাবুন। প্রতিটি কণার ভর mᵢ এবং ঘূর্ণন অক্ষ থেকে লম্ব দূরত্ব rᵢ। দূরের কণাগুলো বেশি অবদান রাখে।',
      insight: 'একই ভরকে অক্ষ থেকে আরও দূরে সরালে জড়তার ভ্রামক দ্রুত বাড়ে।'
    },
    {
      id: 'integral', group: 'ভিত্তি ও সংজ্ঞা', label: 'ধারাবাহিক ভর · ∫r²dm',
      formula: 'I = ∫ r² dm',
      controls: [{ k: 'M', l: 'ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' }, { k: 'L', l: 'দণ্ডের দৈর্ঘ্য L', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' }],
      calc: function (v) { return { I: v.M * v.L * v.L / 12, extra: 'সমবন্টিত সরু দণ্ডের জন্য dm = (M/L)dx; −L/2 থেকে +L/2 পর্যন্ত সমাকলন করলে I = ML²/12।' }; },
      note: 'ধারাবাহিক বস্তুকে অতি ক্ষুদ্র ভরখণ্ড dm-এ ভাগ করুন। প্রতিটি খণ্ডের অবদান r²dm; সব খণ্ডের অবদান সমাকলন করে যোগ করা হয়। এখানে উদাহরণ হিসেবে কেন্দ্র দিয়ে অক্ষ নেওয়া সমবন্টিত দণ্ড দেখানো হয়েছে।',
      insight: 'কণা যত ছোট ধরা হয়, যোগফল ততই সমাকলনের কাছাকাছি যায়।'
    },
    {
      id: 'rod-centre', group: 'দণ্ড, চাকতি ও গোলক', label: 'সরু দণ্ড · কেন্দ্রীয় অক্ষ', formula: 'I = ML²/12',
      controls: [{ k: 'M', l: 'ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' }, { k: 'L', l: 'দৈর্ঘ্য L', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' }],
      calc: function (v) { return { I: v.M * v.L * v.L / 12 }; },
      note: 'দণ্ডের মাঝখান দিয়ে দৈর্ঘ্যের ওপর লম্ব অক্ষ গেছে। দুই পাশের ভর সমানভাবে অক্ষের চারদিকে ছড়িয়ে আছে।', insight: 'দৈর্ঘ্য দ্বিগুণ করলে I চার গুণ হয়, কারণ এখানে I ∝ L²।', draw: 'rod-centre'
    },
    {
      id: 'rod-end', group: 'দণ্ড, চাকতি ও গোলক', label: 'সরু দণ্ড · এক প্রান্তের অক্ষ', formula: 'I = ML²/3',
      controls: [{ k: 'M', l: 'ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' }, { k: 'L', l: 'দৈর্ঘ্য L', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' }],
      calc: function (v) { return { I: v.M * v.L * v.L / 3 }; },
      note: 'দণ্ডের এক প্রান্ত দিয়ে দৈর্ঘ্যের ওপর লম্ব অক্ষ গেছে। কেন্দ্রীয় অক্ষের তুলনায় ভরের গড় দূরত্ব বেশি।', insight: 'একই দণ্ডে প্রান্তের অক্ষের I, কেন্দ্রীয় অক্ষের I-এর চার গুণ।', draw: 'rod-end'
    },
    {
      id: 'ring', group: 'দণ্ড, চাকতি ও গোলক', label: 'পাতলা বৃত্তাকার রিং', formula: 'I = MR²',
      controls: [{ k: 'M', l: 'ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' }, { k: 'R', l: 'ব্যাসার্ধ R', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' }],
      calc: function (v) { return { I: v.M * v.R * v.R }; },
      note: 'রিংয়ের প্রায় সব ভরই কেন্দ্র থেকে একই দূরত্ব R-এ থাকে। তাই প্রতিটি ভরখণ্ডের জন্য r = R।', insight: 'একই M ও R হলে রিংয়ের I, কঠিন চাকতির দ্বিগুণ।', draw: 'ring'
    },
    {
      id: 'disc', group: 'দণ্ড, চাকতি ও গোলক', label: 'কঠিন বৃত্তাকার চাকতি', formula: 'I = ½MR²',
      controls: [{ k: 'M', l: 'ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' }, { k: 'R', l: 'ব্যাসার্ধ R', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' }],
      calc: function (v) { return { I: v.M * v.R * v.R / 2 }; },
      note: 'চাকতির ভর কেন্দ্র থেকে বাইরের প্রান্ত পর্যন্ত পুরো ক্ষেত্রজুড়ে ছড়ানো থাকে। তাই রিংয়ের তুলনায় গড় r² কম।', insight: 'সমান ভর ও ব্যাসার্ধে চাকতির I রিংয়ের অর্ধেক।', draw: 'disc'
    },
    {
      id: 'cylinder-solid', group: 'দণ্ড, চাকতি ও গোলক', label: 'কঠিন বেলন · দৈর্ঘ্য অক্ষ', formula: 'I = ½MR²',
      controls: [{ k: 'M', l: 'ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' }, { k: 'R', l: 'ব্যাসার্ধ R', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' }],
      calc: function (v) { return { I: v.M * v.R * v.R / 2 }; },
      note: 'বেলনের মধ্যদৈর্ঘ্য বরাবর কেন্দ্রীয় অক্ষের সাপেক্ষে। কঠিন বেলনের ভর পুরো প্রস্থচ্ছেদে ছড়ানো।', insight: 'কঠিন বেলন ও চাকতির কেন্দ্রীয় অক্ষের সূত্র একই।', draw: 'cylinder-solid'
    },
    {
      id: 'cylinder-hollow', group: 'দণ্ড, চাকতি ও গোলক', label: 'পাতলা ফাঁপা বেলন', formula: 'I = MR²',
      controls: [{ k: 'M', l: 'ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' }, { k: 'R', l: 'ব্যাসার্ধ R', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' }],
      calc: function (v) { return { I: v.M * v.R * v.R }; },
      note: 'পাতলা ফাঁপা বেলনের দেয়ালে প্রায় সব ভরই অক্ষ থেকে R দূরত্বে থাকে। তাই এটি রিংয়ের মতো আচরণ করে।', insight: 'একই M ও R হলে পাতলা ফাঁপা বেলনের I, কঠিন বেলনের দ্বিগুণ।', draw: 'cylinder-hollow'
    },
    {
      id: 'sphere-solid', group: 'দণ্ড, চাকতি ও গোলক', label: 'কঠিন গোলক · ব্যাস অক্ষ', formula: 'I = ⅖MR²',
      controls: [{ k: 'M', l: 'ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' }, { k: 'R', l: 'ব্যাসার্ধ R', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' }],
      calc: function (v) { return { I: 2 * v.M * v.R * v.R / 5 }; },
      note: 'গোলকের ভর পুরো আয়তনে ছড়ানো থাকে। ঘূর্ণন অক্ষটি কেন্দ্র দিয়ে একটি ব্যাস বরাবর গেছে।', insight: 'একই M ও R হলে কঠিন গোলকের I পাতলা গোলীয় খোলকের চেয়ে কম।', draw: 'sphere-solid'
    },
    {
      id: 'sphere-shell', group: 'দণ্ড, চাকতি ও গোলক', label: 'পাতলা গোলীয় খোলক', formula: 'I = ⅔MR²',
      controls: [{ k: 'M', l: 'ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' }, { k: 'R', l: 'ব্যাসার্ধ R', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' }],
      calc: function (v) { return { I: 2 * v.M * v.R * v.R / 3 }; },
      note: 'পাতলা গোলীয় খোলকের ভর পৃষ্ঠের কাছাকাছি থাকে; কেন্দ্রের ভেতরে ভর নেই বললেই চলে।', insight: 'ভর বাইরের দিকে বেশি থাকায় একই M ও R-এ এর I কঠিন গোলকের চেয়ে বেশি।', draw: 'sphere-shell'
    },
    {
      id: 'plate', group: 'পাত ও শঙ্কু', label: 'আয়তাকার পাত · লম্ব অক্ষ', formula: 'I = M(a² + b²)/12',
      controls: [{ k: 'M', l: 'ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' }, { k: 'a', l: 'দৈর্ঘ্য a', min: 0.5, max: 4, step: 0.1, v: 3, u: 'm' }, { k: 'b', l: 'প্রস্থ b', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' }],
      calc: function (v) { return { I: v.M * (v.a * v.a + v.b * v.b) / 12 }; },
      note: 'অক্ষটি পাতের কেন্দ্র দিয়ে তলের ওপর লম্ব। a ও b হলো পাতের দুই বাহুর দৈর্ঘ্য।', insight: 'দৈর্ঘ্য বা প্রস্থ—দুটিই বাড়লে I বাড়ে; দুটির বর্গ যোগ হয়।', draw: 'plate'
    },
    {
      id: 'cone', group: 'পাত ও শঙ্কু', label: 'কঠিন বৃত্তাকার শঙ্কু', formula: 'I = 3MR²/10',
      controls: [{ k: 'M', l: 'ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' }, { k: 'R', l: 'ভিত্তির ব্যাসার্ধ R', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' }],
      calc: function (v) { return { I: 3 * v.M * v.R * v.R / 10 }; },
      note: 'শঙ্কুর কেন্দ্রীয় প্রতিসাম্য অক্ষের সাপেক্ষে। ভর অক্ষের কাছে ও ভিত্তির দিকে কীভাবে ছড়িয়েছে, তা সূত্রে প্রতিফলিত।', insight: 'একই M ও R-এ শঙ্কুর I, চাকতির ½MR²-এর চেয়ে কম।', draw: 'cone'
    },
    {
      id: 'parallel', group: 'অক্ষের উপপাদ্য', label: 'সমান্তরাল অক্ষ উপপাদ্য', formula: 'I = Icm + Md²',
      controls: [{ k: 'M', l: 'ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' }, { k: 'R', l: 'চাকতির ব্যাসার্ধ R', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' }, { k: 'd', l: 'অক্ষের দূরত্ব d', min: 0, max: 4, step: 0.1, v: 1, u: 'm' }],
      calc: function (v) { var cm = v.M * v.R * v.R / 2, shift = v.M * v.d * v.d; return { I: cm + shift, parts: [['Icm', cm], ['Md²', shift]], extra: 'এই প্রদর্শনে বস্তুর উদাহরণ হিসেবে কঠিন চাকতি নেওয়া হয়েছে; Icm = ½MR²।' }; },
      note: 'ভরকেন্দ্র দিয়ে যাওয়া অক্ষের সমান্তরাল অন্য অক্ষের দূরত্ব d। দেখানো উদাহরণে চাকতির কেন্দ্রীয় অক্ষ থেকে d দূরে নতুন অক্ষ নেওয়া হয়েছে।', insight: 'd বাড়লে অতিরিক্ত Md² অংশ বর্গানুপাতে বাড়ে।', draw: 'parallel'
    },
    {
      id: 'perpendicular', group: 'অক্ষের উপপাদ্য', label: 'লম্ব অক্ষ উপপাদ্য', formula: 'Iᶻ = Iˣ + Iʸ',
      controls: [{ k: 'M', l: 'ভর M', min: 1, max: 20, step: 0.5, v: 5, u: 'kg' }, { k: 'a', l: 'দৈর্ঘ্য a', min: 0.5, max: 4, step: 0.1, v: 3, u: 'm' }, { k: 'b', l: 'প্রস্থ b', min: 0.5, max: 4, step: 0.1, v: 2, u: 'm' }],
      calc: function (v) { var ix = v.M * v.b * v.b / 12, iy = v.M * v.a * v.a / 12; return { I: ix + iy, parts: [['Ix = Mb²/12', ix], ['Iy = Ma²/12', iy]], extra: 'আয়তাকার পাতের x ও y অক্ষ তলের মধ্যে; z অক্ষ কেন্দ্র দিয়ে তলের ওপর লম্ব।' }; },
      note: 'সমতল পাতের জন্যই এই উপপাদ্য প্রযোজ্য। x ও y অক্ষ একই সমতলে পরস্পর লম্ব; z অক্ষ তাদের ছেদবিন্দু দিয়ে পাতের ওপর লম্ব।', insight: 'পাতের জন্য লম্ব অক্ষের I হলো একই বিন্দুতে থাকা দুই সমতল অক্ষের I-এর যোগফল।', draw: 'perpendicular'
    }
  ];

  function f(n, digits) { return Number(n).toFixed(digits == null ? 2 : digits); }
  function html(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  function install(root, done) {
    var groups = {};
    cases.forEach(function (item) { (groups[item.group] = groups[item.group] || []).push(item); });
    var options = Object.keys(groups).map(function (group) {
      return '<optgroup label="' + html(group) + '">' + groups[group].map(function (item) { return '<option value="' + item.id + '">' + html(item.label) + '</option>'; }).join('') + '</optgroup>';
    }).join('');

    root.innerHTML = '<section class="mi-lab" aria-label="Moment of inertia interactive simulation">' +
      '<header class="mi-head"><div><span class="mi-kicker">ROTATIONAL MECHANICS · INTERACTIVE LAB</span><h2>Moment of Inertia Explorer</h2><p>ভর কোথায় আছে এবং ঘূর্ণন অক্ষ থেকে কত দূরে—নিজে বদলে জড়তার ভ্রামক বুঝুন।</p></div><div class="mi-head-mark" aria-hidden="true">I</div></header>' +
      '<div class="mi-mode-row"><label for="miMode">মডেল বেছে নিন</label><select id="miMode" class="mi-mode-select">' + options + '</select><span class="mi-mode-count">১৪টি শেখার মডেল</span></div>' +
      '<div class="mi-main-grid"><div class="mi-visual-panel"><div class="mi-visual-head"><span>LIVE MODEL</span><span class="mi-live-dot">● ANIMATED</span></div><canvas class="mi-canvas" width="1200" height="525" aria-label="ঘূর্ণন অক্ষ, বস্তু ও ভরের অবস্থান দেখানো অ্যানিমেটেড চিত্র"></canvas><div class="mi-motion-bar"><button type="button" class="mi-control-btn" data-mi-action="toggle">Ⅱ বিরতি</button><button type="button" class="mi-control-btn" data-mi-action="reset">↺ ঘূর্ণন রিসেট</button><span>অক্ষের চারদিকে ঘূর্ণন</span></div></div>' +
      '<aside class="mi-result-panel"><span class="mi-result-label">MOMENT OF INERTIA</span><div class="mi-result-value" data-mi-result>—</div><div class="mi-result-unit">kg·m²</div><div class="mi-formula-box"><small>প্রযোজ্য সূত্র</small><strong data-mi-formula></strong></div><div class="mi-parts" data-mi-parts></div><p class="mi-insight" data-mi-insight></p></aside></div>' +
      '<section class="mi-adjust-panel"><div class="mi-section-title"><div><span>CHANGE THE VARIABLES</span><h3>মান পরিবর্তন করুন</h3></div><button type="button" class="mi-reset-values" data-mi-action="values">↺ ডিফল্ট মান</button></div><div class="mi-fields" data-mi-fields></div></section>' +
      '<section class="mi-learning-panel"><div class="mi-section-title"><div><span>UNDERSTAND THE MODEL</span><h3>কীভাবে বুঝবেন</h3></div></div><p data-mi-note></p><div class="mi-observe"><b>যা লক্ষ্য করবেন</b><span data-mi-extra>ভর বা দূরত্ব বদলে ফলাফল দেখুন।</span></div><details class="mi-how"><summary>সিমুলেশনটি ব্যবহারের নিয়ম</summary><ol><li>উপরের তালিকা থেকে বস্তু বা উপপাদ্য বেছে নিন।</li><li>ভর ও প্রয়োজনীয় দৈর্ঘ্য/ব্যাসার্ধের মান পরিবর্তন করুন।</li><li>চিত্রে অক্ষ এবং ভর কোথায় ছড়িয়ে আছে তা লক্ষ্য করুন।</li><li>ফলাফল ও সূত্রের অংশ মিলিয়ে দেখুন—কোন মান বদলালে I কতটা বদলায়।</li></ol></details></section>' +
      '<section class="mi-compare-panel"><h3>এক নজরে তুলনা</h3><div class="mi-compare-grid"><div><b>রিং / পাতলা ফাঁপা বেলন</b><strong>MR²</strong></div><div><b>চাকতি / কঠিন বেলন</b><strong>½MR²</strong></div><div><b>কঠিন গোলক</b><strong>⅖MR²</strong></div><div><b>পাতলা গোলীয় খোলক</b><strong>⅔MR²</strong></div></div><p>সব ক্ষেত্রে একই M ও R ধরলে তুলনাটি সরাসরি বোঝা যায়।</p></section>' +
      '</section>';

    var canvas = root.querySelector('.mi-canvas');
    var ctx = canvas.getContext('2d');
    var select = root.querySelector('#miMode');
    var fields = root.querySelector('[data-mi-fields]');
    var current = cases[0];
    var values = {};
    var phase = 0;
    var running = true;
    var raf = 0;
    var last = 0;
    var lastDraw = 0;
    var inView = true;
    var observer = null;
    if ('IntersectionObserver' in window) { observer = new IntersectionObserver(function (entries) { inView = !!(entries[0] && entries[0].isIntersecting); }); observer.observe(root); }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) running = false;

    function resetValues() {
      values = {};
      current.controls.forEach(function (c) { values[c.k] = c.v; });
    }
    function renderFields() {
      fields.innerHTML = current.controls.map(function (c) {
        return '<div class="mi-field"><label for="mi-input-' + c.k + '"><span>' + html(c.l) + '</span></label><div class="mi-field-value"><output data-mi-output="' + c.k + '">' + f(values[c.k], 2) + ' ' + html(c.u) + '</output></div><input id="mi-input-' + c.k + '" type="range" min="' + c.min + '" max="' + c.max + '" step="' + c.step + '" value="' + values[c.k] + '" data-mi-input="' + c.k + '" aria-label="' + html(c.l) + '"></div>'; 
      }).join('');
      fields.querySelectorAll('input[type="range"]').forEach(function (input) {
        input.addEventListener('input', function () {
          values[input.dataset.miInput] = Number(input.value);
          var def = current.controls.filter(function (c) { return c.k === input.dataset.miInput; })[0];
          var output = fields.querySelector('[data-mi-output="' + input.dataset.miInput + '"]');
          if (output) output.textContent = f(values[input.dataset.miInput], 2) + (def.u ? ' ' + def.u : '');
          updateResult(); draw();
          if (typeof done === 'function') done();
        });
      });
    }
    function updateResult() {
      var result = current.calc(values);
      root.querySelector('[data-mi-result]').textContent = f(result.I, 3);
      root.querySelector('[data-mi-formula]').textContent = current.formula;
      root.querySelector('[data-mi-insight]').textContent = current.insight;
      root.querySelector('[data-mi-note]').textContent = current.note;
      root.querySelector('[data-mi-extra]').textContent = result.extra || 'ভর ও অক্ষ থেকে দূরত্ব পরিবর্তন করে ফলাফলের পরিবর্তন লক্ষ্য করুন।';
      var parts = root.querySelector('[data-mi-parts]');
      parts.innerHTML = result.parts ? result.parts.map(function (p) { return '<div><span>' + html(p[0]) + '</span><b>' + f(p[1], 3) + ' kg·m²</b></div>'; }).join('') : '';
    }
    function setCase(id) {
      current = cases.filter(function (item) { return item.id === id; })[0] || cases[0];
      resetValues(); renderFields(); updateResult(); phase = 0; draw();
    }

    function roundedRect(x, y, w, h, r) {
      r = Math.min(r || 0, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
    }
    function line(x1, y1, x2, y2, color, width, dash) {
      ctx.beginPath(); ctx.setLineDash(dash || []); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = color || '#77c6ed'; ctx.lineWidth = width || 2; ctx.stroke(); ctx.setLineDash([]);
    }
    function label(text, x, y, color, size, align) {
      ctx.fillStyle = color || '#c9d9e7'; ctx.font = '600 ' + (size || 17) + 'px "Hind Siliguri", sans-serif'; ctx.textAlign = align || 'left'; ctx.fillText(text, x, y);
    }
    function arrow(x1, y1, x2, y2, color) {
      var a = Math.atan2(y2 - y1, x2 - x1), h = 11;
      line(x1, y1, x2, y2, color || '#38bdf8', 3);
      ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - h * Math.cos(a - .45), y2 - h * Math.sin(a - .45)); ctx.lineTo(x2 - h * Math.cos(a + .45), y2 - h * Math.sin(a + .45)); ctx.closePath(); ctx.fillStyle = color || '#38bdf8'; ctx.fill();
    }
    function axis(x, y, vertical, text) {
      if (vertical) { line(x, y + 108, x, y - 108, '#f5c46a', 2, [7, 6]); arrow(x, y - 50, x, y - 112, '#f5c46a'); }
      else { line(x - 180, y, x + 180, y, '#f5c46a', 2, [7, 6]); arrow(x + 120, y, x + 184, y, '#f5c46a'); }
      label(text || 'ঘূর্ণন অক্ষ', x + (vertical ? 14 : 0), y - (vertical ? 116 : 15), '#f8d995', 15, vertical ? 'left' : 'center');
    }
    function glowCircle(x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.shadowColor = fill; ctx.shadowBlur = 14; ctx.fill(); ctx.shadowBlur = 0; }
    function base() {
      var g = ctx.createLinearGradient(0, 0, 0, 525); g.addColorStop(0, '#0a1d2a'); g.addColorStop(1, '#07111d'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1200, 525);
      ctx.strokeStyle = 'rgba(110,170,205,.10)'; ctx.lineWidth = 1;
      for (var x = 24; x < 1200; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 525); ctx.stroke(); }
      for (var y = 24; y < 525; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1200, y); ctx.stroke(); }
      label(current.label, 34, 42, '#e4f2fb', 22);
      line(34, 58, 1165, 58, 'rgba(125,190,230,.2)', 1);
    }
    function drawRod(end) {
      var y = 280, left = 190, right = 800, ax = end ? left : (left + right) / 2;
      ctx.save(); ctx.translate(ax, y); ctx.rotate(.32 * Math.sin(phase)); ctx.translate(-ax, -y);
      var grad = ctx.createLinearGradient(left, y - 24, right, y + 24); grad.addColorStop(0, '#247a9d'); grad.addColorStop(.5, '#8bd6f2'); grad.addColorStop(1, '#247a9d');
      ctx.fillStyle = grad; ctx.strokeStyle = '#a8e5fb'; ctx.lineWidth = 2; roundedRect(left, y - 17, right - left, 34, 12); ctx.fill(); ctx.stroke();
      for (var i = 0; i <= 16; i++) { var px = left + i * (right - left) / 16; glowCircle(px, y, 4.5, 'rgba(233,249,255,.9)'); }
      ctx.restore();
      axis(ax, y, true, end ? 'প্রান্তের অক্ষ' : 'কেন্দ্রীয় অক্ষ');
      var d = current.id === 'integral' ? (values.L / 2) : (values.L / 2);
      line(end ? ax : ax, y + 42, end ? right : right, y + 42, '#f7cb78', 2);
      label('L = ' + f(values.L, 1) + ' m', (left + right) / 2, y + 73, '#f8d995', 18, 'center');
      if (!end) { line(ax, y + 45, ax, y + 12, '#f8d995', 2); label('L/2', ax + 16, y + 63, '#f8d995', 14); }
      else label('r = x', (left + right) / 2, y + 105, '#a9c8da', 14, 'center');
      if (current.id === 'integral') {
        for (var j = 0; j < 32; j++) { var sx = left + (j + .5) * (right - left) / 32; ctx.fillStyle = 'rgba(245,196,106,' + (.12 + .3 * Math.abs(sx - ax) / (right - left)) + ')'; ctx.fillRect(sx - 3, y - 28, 6, 56); }
        label('ক্ষুদ্র ভরখণ্ড dm', 520, 165, '#f8d995', 17, 'center'); arrow(520, 180, 520, 238, '#f8d995');
      }
      ctx.beginPath(); ctx.arc(ax, y, 86, end ? -Math.PI / 2 : -Math.PI / 3, end ? Math.PI / 3 : Math.PI / 3); ctx.strokeStyle = '#65d0f1'; ctx.lineWidth = 3; ctx.stroke();
    }
    function drawRing(solid) {
      var cx = 490, cy = 285, rx = 230, ry = 132;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = solid ? 'rgba(56,189,248,.28)' : 'rgba(56,189,248,.04)'; ctx.fill(); ctx.strokeStyle = '#8cddf5'; ctx.lineWidth = solid ? 3 : 8; ctx.stroke();
      if (solid) { for (var r = .18; r < 1; r += .18) { ctx.beginPath(); ctx.ellipse(cx, cy, rx * r, ry * r, 0, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(153,225,247,.25)'; ctx.lineWidth = 1; ctx.stroke(); } }
      axis(cx, cy, true, 'কেন্দ্রীয় লম্ব অক্ষ'); glowCircle(cx, cy, 7, '#f5c46a');
      var ang = phase; var px = cx + rx * Math.cos(ang), py = cy + ry * Math.sin(ang); glowCircle(px, py, 8, '#f5c46a');
      line(cx, cy, px, py, '#f5c46a', 2); label('R', (cx + px) / 2 + 12, (cy + py) / 2 - 8, '#f8d995', 17);
    }
    function drawCylinder(hollow) {
      var left = 260, right = 760, cy = 280, rx = 54, ry = 120;
      ctx.fillStyle = 'rgba(56,189,248,.18)'; ctx.strokeStyle = '#8cddf5'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(left, cy - ry); ctx.lineTo(right, cy - ry); ctx.lineTo(right, cy + ry); ctx.lineTo(left, cy + ry); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(left, cy, rx, ry, 0, Math.PI / 2, Math.PI * 1.5); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(right, cy, rx, ry, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke();
      if (hollow) { ctx.beginPath(); ctx.ellipse(right, cy, rx * .67, ry * .67, 0, 0, Math.PI * 2); ctx.strokeStyle = '#f5c46a'; ctx.lineWidth = 3; ctx.stroke(); }
      arrow(left - 30, cy, right + 70, cy, '#f5c46a'); label('দৈর্ঘ্য বরাবর কেন্দ্রীয় অক্ষ', 520, cy - 22, '#f8d995', 17, 'center');
      label(hollow ? 'পাতলা দেয়াল · ভর বাইরের দিকে' : 'কঠিন পদার্থ · ভর পুরো আয়তনে', 520, 445, '#c6dce9', 16, 'center');
      var capAngle = phase; var capX = right + rx * .72 * Math.cos(capAngle), capY = cy + ry * .72 * Math.sin(capAngle); line(right, cy, capX, capY, '#f5c46a', 2); glowCircle(capX, capY, 6, '#f5c46a');
    }
    function drawSphere(shell) {
      var cx = 490, cy = 280, rx = 170, ry = 160;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = shell ? 'rgba(56,189,248,.04)' : 'rgba(56,189,248,.2)'; ctx.fill(); ctx.strokeStyle = '#8cddf5'; ctx.lineWidth = shell ? 7 : 3; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, cy, rx * .48, ry, 0, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(137,218,244,.55)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry * .36, 0, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(137,218,244,.55)'; ctx.lineWidth = 2; ctx.stroke();
      if (!shell) { for (var i = 0; i < 28; i++) { var a = i * 2.399, rr = Math.sqrt((i + .5) / 28); glowCircle(cx + Math.cos(a) * rx * rr * .82, cy + Math.sin(a) * ry * rr * .82, 3.5, 'rgba(245,196,106,.85)'); } }
      else { for (var j = 0; j < 16; j++) { var aa = j * Math.PI * 2 / 16 + phase; glowCircle(cx + Math.cos(aa) * rx * .94, cy + Math.sin(aa) * ry * .94, 5, '#f5c46a'); } }
      axis(cx, cy, true, 'ব্যাস বরাবর অক্ষ'); line(cx, cy, cx + rx * .82, cy, '#f5c46a', 2); label('R', cx + rx * .45, cy - 12, '#f8d995', 17);
      var surfaceX = cx + rx * .88 * Math.cos(phase), surfaceY = cy + ry * .54 * Math.sin(phase); glowCircle(surfaceX, surfaceY, 6, '#f5c46a');
    }
    function drawPlate(perpendicular) {
      var x = 250, y = 160, w = 490, h = 230, cx = x + w / 2, cy = y + h / 2;
      ctx.fillStyle = 'rgba(56,189,248,.2)'; ctx.strokeStyle = '#8cddf5'; ctx.lineWidth = 3; roundedRect(x, y, w, h, 10); ctx.fill(); ctx.stroke();
      for (var i = 1; i < 7; i++) { line(x + i * w / 7, y, x + i * w / 7, y + h, 'rgba(137,218,244,.18)', 1); }
      for (var j = 1; j < 4; j++) { line(x, y + j * h / 4, x + w, y + j * h / 4, 'rgba(137,218,244,.18)', 1); }
      label('a = ' + f(values.a, 1) + ' m', cx, y - 18, '#f8d995', 17, 'center'); label('b = ' + f(values.b, 1) + ' m', x + w + 20, cy, '#f8d995', 17);
      if (perpendicular) {
        arrow(cx - 165, cy, cx + 175, cy, '#38bdf8'); label('x অক্ষ', cx + 190, cy + 5, '#8fdcf4', 15);
        arrow(cx, cy + 125, cx, cy - 125, '#65d0f1'); label('y অক্ষ', cx + 16, cy - 135, '#8fdcf4', 15);
        ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.strokeStyle = '#f5c46a'; ctx.lineWidth = 3; ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fillStyle = '#f5c46a'; ctx.fill(); label('z অক্ষ: পাতের ওপর লম্ব', cx, y + h + 48, '#f8d995', 16, 'center');
      } else { axis(cx, cy, true, 'কেন্দ্র দিয়ে পাতের ওপর লম্ব অক্ষ'); }
      ctx.beginPath(); ctx.ellipse(cx, cy, 54, 27, 0, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(245,196,106,.55)'; ctx.lineWidth = 2; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]); glowCircle(cx + 54 * Math.cos(phase), cy + 27 * Math.sin(phase), 5, '#f5c46a');
    }
    function drawCone() {
      var cx = 490, top = 115, bottom = 410, rx = 210, ry = 65;
      ctx.fillStyle = 'rgba(56,189,248,.18)'; ctx.strokeStyle = '#8cddf5'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(cx + rx, bottom); ctx.ellipse(cx, bottom, rx, ry, 0, 0, Math.PI, true); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(cx - rx, bottom); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, bottom, rx, ry, 0, 0, Math.PI); ctx.stroke();
      for (var r = .25; r <= .85; r += .2) { ctx.beginPath(); ctx.ellipse(cx, top + (bottom - top) * r, rx * r, ry * r, 0, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(245,196,106,.42)'; ctx.lineWidth = 2; ctx.stroke(); }
      axis(cx, (top + bottom) / 2, true, 'কেন্দ্রীয় প্রতিসাম্য অক্ষ'); label('ভিত্তির ব্যাসার্ধ R', cx + rx * .5, bottom + 76, '#f8d995', 16, 'center');
      var coneY = top + (bottom - top) * .72, coneR = rx * .72; glowCircle(cx + coneR * Math.cos(phase), coneY + ry * .4 * Math.sin(phase), 6, '#f5c46a');
    }
    function drawParallel() {
      var cx = 360, cy = 280, rx = 115, ry = 95, dist = 120 + values.d * 45, shifted = cx + dist;
      ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.fillStyle = 'rgba(56,189,248,.2)'; ctx.fill(); ctx.strokeStyle = '#8cddf5'; ctx.lineWidth = 3; ctx.stroke();
      axis(cx, cy, true, 'ভরকেন্দ্রীয় অক্ষ'); line(shifted, cy + 115, shifted, cy - 115, '#f5c46a', 3, [7, 6]); arrow(shifted, cy - 50, shifted, cy - 116, '#f5c46a'); label('সমান্তরাল অক্ষ', shifted + 12, cy - 124, '#f8d995', 15);
      line(cx, cy + 155, shifted, cy + 155, '#f5c46a', 3); line(cx, cy + 143, cx, cy + 166, '#f5c46a', 2); line(shifted, cy + 143, shifted, cy + 166, '#f5c46a', 2); label('d = ' + f(values.d, 1) + ' m', (cx + shifted) / 2, cy + 182, '#f8d995', 17, 'center');
      var orbitX = cx + rx * .72 * Math.cos(phase), orbitY = cy + ry * .72 * Math.sin(phase); line(cx, cy, orbitX, orbitY, '#f5c46a', 2); glowCircle(orbitX, orbitY, 6, '#f5c46a');
      label('উদাহরণ: কঠিন চাকতি', 500, 450, '#c6dce9', 16, 'center');
    }
    function draw() {
      if (!ctx) return;
      base();
      if (current.id === 'discrete') {
        var cx = 470, cy = 285, n = Math.round(values.N), radius = 160;
        for (var i = 0; i < n; i++) { var rr = radius * (0.25 + .75 * (n === 1 ? 1 : i / (n - 1))), a = phase + i * Math.PI * 2 / n; ctx.beginPath(); ctx.ellipse(cx, cy, rr, rr * .58, 0, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(137,218,244,.2)'; ctx.lineWidth = 1.5; ctx.stroke(); glowCircle(cx + rr * Math.cos(a), cy + rr * .58 * Math.sin(a), 7, '#f5c46a'); }
        axis(cx, cy, true, 'ঘূর্ণন অক্ষ'); label('m₁, m₂, …, mₙ', cx + 180, cy - 115, '#c9d9e7', 18); label('rᵢ', cx + 100, cy + 38, '#f8d995', 17); line(cx, cy, cx + 150, cy + 60, '#f5c46a', 2); label('প্রতিটি কণার অবদান যোগ হয়', 610, 455, '#c6dce9', 16, 'center');
      } else if (current.id === 'integral' || current.id.indexOf('rod-') === 0) drawRod(current.id === 'rod-end');
      else if (current.id === 'ring') drawRing(false);
      else if (current.id === 'disc') drawRing(true);
      else if (current.id.indexOf('cylinder-') === 0) drawCylinder(current.id === 'cylinder-hollow');
      else if (current.id.indexOf('sphere-') === 0) drawSphere(current.id === 'sphere-shell');
      else if (current.id === 'plate') drawPlate(false);
      else if (current.id === 'cone') drawCone();
      else if (current.id === 'parallel') drawParallel();
      else if (current.id === 'perpendicular') drawPlate(true);
      label('M = ' + f(values.M, 1) + ' kg', 1135, 492, '#a9c8da', 16, 'right');
    }

    select.addEventListener('change', function () { setCase(select.value); });
    root.querySelector('[data-mi-action="toggle"]').addEventListener('click', function (event) {
      running = !running; event.currentTarget.textContent = running ? 'Ⅱ বিরতি' : '▶ চালু করুন';
    });
    root.querySelector('[data-mi-action="reset"]').addEventListener('click', function () { phase = 0; draw(); });
    root.querySelector('[data-mi-action="values"]').addEventListener('click', function () { resetValues(); renderFields(); updateResult(); draw(); if (typeof done === 'function') done(); });

    function frame(now) {
      if (!root.isConnected) { cancelAnimationFrame(raf); if (observer) observer.disconnect(); return; }
      var dt = last ? Math.min(.05, (now - last) / 1000) : 0; last = now;
      if (running && inView && document.visibilityState !== 'hidden') { phase += dt * .65; if (!lastDraw || now - lastDraw >= 1000 / 30) { draw(); lastDraw = now; } }
      raf = requestAnimationFrame(frame);
    }
    setCase(current.id);
    raf = requestAnimationFrame(frame);
  }

  window.CL_SIMS = window.CL_SIMS || {};
  window.CL_SIMS[key] = install;
  if (window.CL_SIMKEYS && window.CL_SIMKEYS.indexOf(key) < 0) window.CL_SIMKEYS.push(key);
  if (window.CL_DEF) {
    window.CL_DEF.labs = window.CL_DEF.labs || [];
    if (!window.CL_DEF.labs.some(function (lab) { return lab.id === key || lab.sim === key; })) {
      window.CL_DEF.labs.push({
        id: key, sim: key, on: true, icon: '◉', t: 'Moment of Inertia: 14-Mode Explorer', sub: 'Physics',
        d: '১৪টি ইন্টারঅ্যাকটিভ মডেলে কণা, দণ্ড, রিং, চাকতি, বেলন, গোলক, পাত, শঙ্কু এবং অক্ষের উপপাদ্য পরীক্ষা করুন।',
        tip: 'জড়তার ভ্রামক: I = Σmr² = ∫r²dm', hsc: true, chapter: chapter, physicsChapter: chapter, concept: 'Moment of Inertia', physicsAdded: true
      });
    }
  }
})();
