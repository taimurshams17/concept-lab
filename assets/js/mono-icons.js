/* ConceptLab monochrome icon layer: replaces decorative emoji glyphs in rendered UI with distinct white line icons. */
(() => {
  'use strict';
  const shapes = {
    home: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/>',
    atom: '<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="4.2"/><ellipse cx="12" cy="12" rx="9" ry="4.2" transform="rotate(60 12 12)"/>',
    flask: '<path d="M9 3h6M10 3v6l-5.5 9.2A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.8L14 9V3M8 15h8"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    bulb: '<path d="M9 18h6m-5 3h4M8.5 14.5A7 7 0 1 1 15.5 14.5c-.9.7-1.2 1.6-1.3 2.5h-4.4c-.1-.9-.4-1.8-1.3-2.5Z"/>',
    ruler: '<path d="M4 20 20 4l3 3L7 23zM9 15l-2-2m5-1-2-2m5-1-2-2m5-1-2-2"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
    stairs: '<path d="M3 20h5v-5h5v-5h5V5h3"/>',
    scale: '<path d="M12 3v18M5 6h14M7 6l-4 7h8L7 6Zm10 0-4 7h8l-4-7ZM7 21h10"/>',
    chart: '<path d="M3 3v18h18M7 15l4-5 4 3 5-7"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    game: '<path d="M6 8h12a4 4 0 0 1 3.8 5.2l-1.2 4A2.5 2.5 0 0 1 16 18l-2-2h-4l-2 2a2.5 2.5 0 0 1-4.6-.8l-1.2-4A4 4 0 0 1 6 8Z"/><path d="M7 11v4m-2-2h4m7-1h.01M18 14h.01"/>',
    brain: '<path d="M12 4a3 3 0 0 0-5-1 4 4 0 0 0-3 6 4 4 0 0 0 1 7 4 4 0 0 0 5 4h2V4Zm0 0a3 3 0 0 1 5-1 4 4 0 0 1 3 6 4 4 0 0 1-1 7 4 4 0 0 1-5 4h-2M7 7l2 2m-3 5 3-1m8-6-2 2m4 5-3-1"/>',
    trophy: '<path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4ZM7 6H3v2a5 5 0 0 0 5 5m9-7h4v2a5 5 0 0 1-5 5"/>',
    cloud: '<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 20 10a4 4 0 0 1-1 8Z"/>',
    warning: '<path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5m0 3h.01"/>',
    magnet: '<path d="M6 3v8a6 6 0 0 0 12 0V3h-5v8a1 1 0 0 1-2 0V3H6Z"/><path d="M6 7h5m2 0h5"/>',
    microscope: '<path d="m9 3 5 5-3 3-5-5zM12 11l4 4m-8 2a6 6 0 0 0 11-3M5 21h16M8 17l-3 4"/>',
    rocket: '<path d="M12 15c4-2 7-7 7-12-5 0-10 3-12 7l5 5Z"/><path d="m7 10-4 1 4 4m6 0-1 5 4-4M9 15l-4 4m7-12h.01"/>',
    celebration: '<path d="m12 3 1.2 4.8L18 9l-4.8 1.2L12 15l-1.2-4.8L6 9l4.8-1.2L12 3ZM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15ZM5 2l.7 2.3L8 5l-2.3.7L5 8l-.7-2.3L2 5l2.3-.7L5 2Z"/>',
    planet: '<circle cx="12" cy="12" r="6"/><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-25 12 12)"/>',
    beaker: '<path d="M9 3h6m-5 0v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7 16h10"/>',
    puzzle: '<path d="M4 4h5a3 3 0 1 1 6 0h5v5a3 3 0 1 0 0 6v5h-5a3 3 0 1 1-6 0H4v-5a3 3 0 1 0 0-6z"/>',
    spiral: '<path d="M12 12m-2 0a2 2 0 1 0 4 0 4 4 0 1 0-4 4 6 6 0 1 0-6-6 8 8 0 1 0 8-8"/>',
    notes: '<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    alphabet: '<path d="M4 18 9 5l5 13M6 14h6M15 18l4-10 4 10m-6-3h4"/>',
    thermometer: '<path d="M14 14.8V5a3 3 0 0 0-6 0v9.8a5 5 0 1 0 6 0Z"/><path d="M11 11v7"/>',
    telescope: '<path d="m4 8 11-4 3 6-11 4zM15 10l4 8m-9-4-2 7m-4 0h10"/>',
    satellite: '<path d="m8 8 8 8m-6-10 6-2 4 4-2 6M6 12l-4 2 4 4 2-4M12 6l-2-4-4 4 4 2"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    battery: '<rect x="3" y="7" width="17" height="10" rx="2"/><path d="M20 10h2v4h-2M7 10v4m4-4v4m4-4v4"/>',
    tools: '<path d="M14 7a5 5 0 0 0-6-6l3 3-3 3-3-3a5 5 0 0 0 6 6l8 8a2 2 0 0 0 3-3z"/>',
    books: '<path d="M4 4h6v16H4zM14 4h6v16h-6zM10 7h4M10 17h4"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4zM20 4h-4a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h4z"/>',
    sword: '<path d="m14 4 6-2-2 6-10 10-4-4zM4 14l6 6m-8 2 6-6"/>',
    waves: '<path d="M2 8c3-3 5 3 8 0s5 3 8 0 4 0 4 0M2 13c3-3 5 3 8 0s5 3 8 0 4 0 4 0M2 18c3-3 5 3 8 0s5 3 8 0 4 0 4 0"/>',
    cart: '<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 3h2l3 12h12l3-9H5"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
    graduation: '<path d="m2 9 10-5 10 5-10 5L2 9Zm4 3v5c4 3 8 3 12 0v-5M22 9v6"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.5-3"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    laptop: '<rect x="4" y="4" width="16" height="12" rx="1"/><path d="M2 20h20l-2-4H4z"/>',
    chat: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
    save: '<path d="M5 3h12l4 4v14H3V3zM7 3v6h10V3M7 21v-8h10v8"/>',
    medal: '<circle cx="12" cy="8" r="5"/><path d="m8 12-2 9 6-3 6 3-2-9"/>',
    dna: '<path d="M7 3c0 6 10 12 10 18M17 3C17 9 7 15 7 21M8 6h8M6 10h12M6 14h12M8 18h8"/>',
    signal: '<path d="M3 20h2v-3H3zM8 20h2v-7H8zM13 20h2V9h-2zM18 20h2V4h-2z"/>',
    extinguisher: '<path d="M9 4h6v4H9zM11 4V2h4l2 2M8 8h8v13H8zM16 10h4v5h-4"/>',
    brick: '<path d="M3 4h8v6H3zM13 4h8v6h-8zM7 12h8v6H7zM17 12h4v6h-4zM3 20h3m4 0h4m4 0h3"/>',
    toolbox: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V5h8v3M3 13h18m-11 0v3h4v-3"/>',
    chartbars: '<path d="M4 20V10h4v10M10 20V4h4v16M16 20v-7h4v7M2 20h20"/>',
    pin: '<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2"/>',
    magic: '<path d="m4 20 12-12 4 4L8 24zM15 4l1-3 1 3 3 1-3 1-1 3-1-3-3-1zM5 3l.7 2.3L8 6l-2.3.7L5 9l-.7-2.3L2 6l2.3-.7z"/>',
    snow: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4M20 14l-4 1 1 4M4 14l4 1-1 4M20 10l-4-1 1-4"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M15 8.5c-.7-1-1.7-1.5-3-1.5-1.7 0-3 1-3 2.5s1.3 2.5 3 2.5 3 1 3 2.5-1.3 2.5-3 2.5c-1.3 0-2.3-.5-3-1.5M12 5v14"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9 2 2-2 2 2 2-3 3-2-2-3 3"/>',
    leaf: '<path d="M20 4C10 4 4 8 4 15a5 5 0 0 0 5 5c7 0 11-6 11-16ZM4 20l9-9"/>',
    flower: '<path d="M12 12c-5-1-6-7-2-8 2-1 3 2 2 8Zm0 0c1-5 7-6 8-2 1 2-2 3-8 2Zm0 0c5 1 6 7 2 8-2 1-3-2-2-8Zm0 0c-1 5-7 6-8 2-1-2 2-3 8-2Z"/><circle cx="12" cy="12" r="2"/>',
    kite: '<path d="m12 2 9 9-9 9-9-9zM12 20l-2 2m2-2 2 4"/>',
    wheel: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="m12 3 0 6m0 6v6m9-9h-6M9 12H3m15.4-6.4-4.2 4.2m-4.4 4.4-4.2 4.2m12.8 0-4.2-4.2m-4.4-4.4L5.4 5.6"/>',
    bottle: '<path d="M9 3h6v4l2 3v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V10l2-3zM9 7h6M7 14h10"/>',
    gift: '<rect x="3" y="9" width="18" height="12" rx="1"/><path d="M2 6h20v3H2zM12 6v15M12 6c-5 0-7-5-3-5 3 0 3 5 3 5Zm0 0c5 0 7-5 3-5-3 0-3 5-3 5Z"/>',
    sparkles: '<path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
    handshake: '<path d="m3 12 4-4 4 1 2-1 4 1 4 4-3 3-3-2-3 2-4-2-2 2-3-4ZM7 8l3-3 4 1 2-1 4 3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    link: '<path d="M10 13a5 5 0 0 0 7 .2l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7-.2l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    droplet: '<path d="M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13Z"/>',
    plug: '<path d="M8 3v5m8-5v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
    dice: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01"/>',
    diamond: '<path d="M6 3h12l4 6-10 12L2 9zM2 9h20M6 3l3 6 3 12 3-12 3-6"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    cross: '<path d="m6 6 12 12M18 6 6 18"/>',
    star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    globe2: '<circle cx="12" cy="12" r="9"/><path d="m3 12 18 0M12 3c5 5 5 13 0 18M12 3c-5 5-5 13 0 18"/>',
    medal2: '<circle cx="12" cy="8" r="5"/><path d="M8 12 6 22l6-3 6 3-2-10"/>',
    calculator: '<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M8 6h8M8 11h2m4 0h2M8 15h2m4 0h2M8 18h2m4 0h2"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flask2: '<path d="M9 3h6M10 3v7l-6 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-9V3M7 16h10"/>',
    atom2: '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="9" ry="4"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)"/>',
    function: '<path d="M4 20 10 4h10M7 13h9M13 4l-2 16"/>',
    calculator2: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M7 7h10M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
    flask3: '<path d="M8 3h8M10 3v7l-5 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-8V3M7 16h10"/>',
    ruler2: '<path d="M3 7 7 3l14 14-4 4L3 7Z"/><path d="m8 8 2-2m1 5 2-2m1 5 2-2"/>',
    bookopen: '<path d="M3 5h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H3zM21 5h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6z"/>',
    shield: '<path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/><path d="m8 12 3 3 5-6"/>',
    headphones: '<path d="M3 13v-2a9 9 0 0 1 18 0v2M3 13h4v7H5a2 2 0 0 1-2-2zM21 13h-4v7h2a2 2 0 0 0 2-2z"/>',
    generic: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8m-4-4h8"/>'
  };
  const map = new Map();
  const assign = (chars, name) => chars.forEach(ch => map.set(ch, name));
  assign(['🏠','⌂'],'home'); assign(['⏱','⏱️'],'clock'); assign(['☑','✅'],'check'); assign(['🃏','🧩'],'puzzle'); assign(['⚛','🧬'],'atom'); assign(['🧪','🧫','⚗'],'flask'); assign(['🎯'],'target'); assign(['💡'],'bulb'); assign(['📐','📏'],'ruler'); assign(['⚡'],'bolt'); assign(['🪜'],'stairs'); assign(['⚖'],'scale'); assign(['📈'],'chart'); assign(['🔖'],'bookmark'); assign(['🎮'],'game'); assign(['🧠'],'brain'); assign(['🏆'],'trophy'); assign(['☁'],'cloud'); assign(['⚠'],'warning'); assign(['🧲'],'magnet'); assign(['🔬'],'microscope'); assign(['🚀'],'rocket'); assign(['🎉','🎈'],'celebration'); assign(['🪐'],'planet'); assign(['🧩'],'puzzle'); assign(['🌀'],'spiral'); assign(['📝'],'notes'); assign(['📅'],'calendar'); assign(['🔤'],'alphabet'); assign(['🌡'],'thermometer'); assign(['🔭'],'telescope'); assign(['🛰','📡'],'satellite'); assign(['🧭'],'compass'); assign(['🔋'],'battery'); assign(['🛠','🧰'],'tools'); assign(['📚'],'books'); assign(['📖'],'book'); assign(['⚔'],'sword'); assign(['🌊'],'waves'); assign(['🛒'],'cart'); assign(['♥'],'heart'); assign(['🎓'],'graduation'); assign(['🔁'],'refresh'); assign(['🔒','🗝'],'lock'); assign(['🔎'],'search'); assign(['💻'],'laptop'); assign(['💬'],'chat'); assign(['💾'],'save'); assign(['🥇'],'medal'); assign(['🥈'],'medal2'); assign(['🥉'],'trophy'); assign(['🧯'],'extinguisher'); assign(['🧱'],'brick'); assign(['📊'],'chartbars'); assign(['🧷'],'pin'); assign(['🪄'],'magic'); assign(['🧊'],'snow'); assign(['🪙'],'coin'); assign(['🪶'],'leaf'); assign(['🪴'],'leaf'); assign(['🪸','🪷'],'flower'); assign(['🪁'],'kite'); assign(['🛞'],'wheel'); assign(['🧴','🧻'],'bottle'); assign(['🎁'],'gift'); assign(['✨','✦'],'sparkles'); assign(['🤝'],'handshake'); assign(['🌍'],'globe'); assign(['🔗'],'link'); assign(['💧'],'droplet'); assign(['🔌'],'plug'); assign(['🎲'],'dice'); assign(['💎'],'diamond'); assign(['➡'],'arrow'); assign(['✔','✓','✅'],'check'); assign(['✘','✕','✗'],'cross'); assign(['★','🔥'],'star'); assign(['👨'],'person'); assign(['🔵','🟠'],'target'); assign(['🏁'],'medal'); assign(['⚙'],'tools'); assign(['📴'],'laptop'); assign(['🧮'],'ruler'); assign(['🧵'],'link'); assign(['🌈'],'sparkles'); assign(['🔲'],'game'); assign(['🚤'],'waves'); assign(['☄'],'rocket'); assign(['🌌'],'planet'); assign(['🗺'],'globe'); assign(['🌱'],'leaf'); assign(['🌟'],'star'); assign(['🔍'],'search');
  // Keep emoji outside this set untouched when it is part of non-decorative prose.
  // Match all pictographic emoji, including symbols that were absent from the old replacement list.
  const regex = /(?:\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?)*(?:\uFE0F|\uFE0E)?|[0-9#*]\uFE0F?\u20E3)/gu;
  const semanticRules = [
    [/odd one out|odd-one-out|spot the odd/i, 'target'],
    [/step order|sequence|arrange the steps|order the/i, 'stairs'],
    [/reaction race|chemical equation|balanc(e|ing)|ion challenge|ion identification/i, 'flask'],
    [/periodic quest|periodic trend|periodic table|element explorer/i, 'atom2'],
    [/formula sprint|formula challenge|equation sprint/i, 'calculator2'],
    [/projectile|trajectory|motion lab|velocity|acceleration/i, 'chart'],
    [/vector|vector addition|components/i, 'compass'],
    [/memory|matching pairs|card match/i, 'brain'],
    [/word|alphabet|vocabulary|spelling/i, 'alphabet'],
    [/tournament|leaderboard|champion|trophy|winning streak/i, 'trophy'],
    [/habit|habits|অভ্যাস/i, 'leaf'],
    [/daily reward|daily mission|streak/i, 'calendar'],
    [/microscope|cell structure|biology|dna|genetics/i, 'dna'],
    [/lens|mirror|reflection|refraction|optics/i, 'telescope'],
    [/circuit|electricity|resistance|voltage|current/i, 'plug'],
    [/gas law|ideal gas|pressure|temperature|thermodynamics/i, 'thermometer'],
    [/graph|plot|function graph|coordinate/i, 'chart'],
    [/রসায়ন|chemistry|ion|molecule|reaction|periodic|bond|acid|base|lab|flask|chemical/i, 'flask'],
    [/পদার্থবিজ্ঞান|physics|force|motion|projectile|velocity|magnet|wave|circuit|electric|optics|gravity/i, 'atom'],
    [/গণিত|mathematics|math|algebra|matrix|vector|calculus|equation|formula|calculate|number|arithmetic/i, 'calculator'],
    [/গেম|game|arcade|play|challenge|sprint|quest|race|puzzle|match|memory/i, 'game'],
    [/সিমুলেশন|simulation|experiment|virtual lab|interactive/i, 'microscope'],
    [/কুইজ|quiz|question|answer|practice|test|exam|assessment/i, 'notes'],
    [/প্রগ্রেস|progress|level|xp|score|leaderboard|rank|achievement|badge/i, 'chartbars'],
    [/নোটিশ|message|notification|inbox|alert|announcement/i, 'bell'],
    [/সময়|time|timer|duration|daily|streak|calendar|schedule/i, 'clock'],
    [/বই|book|chapter|lesson|read|study|learn|syllabus|course|textbook/i, 'bookopen'],
    [/সুরক্ষা|safe|safety|secure|privacy|protect|shield/i, 'shield'],
    [/শুনুন|audio|sound|listen|voice|headphone/i, 'headphones'],
    [/লেখচিত্র|graph|chart|trend|analytics|data|statistic/i, 'chart'],
    [/দিকনির্দেশ|map|location|navigate|compass|direction/i, 'compass']
  ];
  function contextualIcon(node, emoji) {
    const host = node && (node.parentElement || node.parentNode);
    const card = host && (host.closest('a,button,article,li,[class*=card],[class*=tile],[class*=item],[class*=game],[class*=sim]') || host.parentElement || host);
    const context = ((card && card.textContent) || (host && host.textContent) || '').slice(0, 700);
    for (const rule of semanticRules) if (rule[0].test(context)) return rule[1];
    return map.get(emoji) || 'generic';
  }
  const makeIcon = name => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('class','cl-mono-icon'); svg.setAttribute('aria-hidden','true');
    svg.setAttribute('focusable','false'); svg.setAttribute('fill','none'); svg.setAttribute('stroke','currentColor'); svg.setAttribute('stroke-width','1.7'); svg.setAttribute('stroke-linecap','round'); svg.setAttribute('stroke-linejoin','round');
    svg.innerHTML = shapes[name] || shapes.generic; return svg;
  };
  const replaceText = node => {
    if (!node || !node.nodeValue || !regex.test(node.nodeValue)) { regex.lastIndex = 0; return; }
    regex.lastIndex = 0;
    const text = node.nodeValue, frag = document.createDocumentFragment(); let last = 0, match;
    while ((match = regex.exec(text))) {
      if (match.index > last) frag.append(document.createTextNode(text.slice(last, match.index)));
      const span = document.createElement('span'); span.className = 'cl-icon-wrap'; span.setAttribute('aria-hidden','true');
      span.append(makeIcon(contextualIcon(node, match[0]))); frag.append(span); last = match.index + match[0].length;
    }
    if (last < text.length) frag.append(document.createTextNode(text.slice(last)));
    node.parentNode?.replaceChild(frag, node);
  };
  const scan = root => {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) { replaceText(root); return; }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (root.nodeType === Node.ELEMENT_NODE && (root.matches('script,style,textarea,input,code,pre,svg,.cl-icon-wrap,[contenteditable="true"]'))) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {acceptNode(n) { return n.parentElement?.closest('script,style,textarea,input,code,pre,svg,.cl-icon-wrap,[contenteditable="true"]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }});
    const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode); nodes.forEach(replaceText);
  };
  let pending = false;
  const schedule = () => { if (pending) return; pending=true; requestAnimationFrame(() => { pending=false; scan(document.body); }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true}); else schedule();
  new MutationObserver(records => { for (const r of records) { if (r.type === 'characterData') replaceText(r.target); else r.addedNodes.forEach(n => { if (n.nodeType === Node.TEXT_NODE) replaceText(n); else scan(n); }); } }).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
})();
