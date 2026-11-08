/* Structural integrity check for every built-in Arcade game. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectRoot = path.join(__dirname, '..');
const context = {
  window: {},
  console,
  Math,
  Date,
  JSON,
  localStorage: { getItem() { return null; }, setItem() {} }
};
vm.createContext(context);
for (const relative of ['assets/js/defaults.js', 'assets/js/game-academy.js', 'assets/js/games.js', 'assets/js/arcade-expansion.js']) {
  const filename = path.join(projectRoot, relative);
  vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename });
}

const baseGames = context.window.CL_DEF && context.window.CL_DEF.games;
const academy = context.window.CL_GAME_ACADEMY;
const handlers = context.window.CL_GAMES || {};
if (!Array.isArray(baseGames) || !academy || typeof academy.merge !== 'function') {
  throw new Error('Could not load the built-in Arcade catalog.');
}

const games = academy.merge(baseGames).filter((game) => game && game.on !== false && game.on !== '0');
const ids = new Set();
const issues = [];
const issue = (game, message) => issues.push(`${game && game.id ? game.id : '(missing id)'}: ${message}`);

for (const game of games) {
  if (!game.id) issue(game, 'missing game ID');
  else if (ids.has(game.id)) issue(game, 'duplicate game ID');
  else ids.add(game.id);

  if (!game.type || typeof handlers[game.type] !== 'function') issue(game, `missing handler for ${game.type || '(missing type)'}`);
  const data = game.data || {};

  if (game.type === 'blitz') {
    if (!Array.isArray(data.q) || data.q.length < 2) issue(game, 'needs at least two questions');
    (data.q || []).forEach((q, index) => {
      if (!q || !q.q || !Array.isArray(q.o) || q.o.filter(Boolean).length < 2 || !Number.isInteger(+q.a) || +q.a < 0 || +q.a >= q.o.length) {
        issue(game, `invalid multiple-choice question ${index + 1}`);
      }
    });
  }
  if (game.type === 'memory' && (!Array.isArray(data.pairs) || data.pairs.filter((pair) => pair && pair.a && pair.b).length < 2)) {
    issue(game, 'needs at least two complete matching pairs');
  }
  if (game.type === 'tf' && (!Array.isArray(data.items) || data.items.filter((item) => item && item.s && [true, false, 'true', 'false', '1', '0'].includes(item.t)).length < 2)) {
    issue(game, 'needs at least two valid true/false statements');
  }
  if (game.type === 'scramble' && (!Array.isArray(data.words) || data.words.filter((word) => word && String(word.w || '').trim().length >= 3).length < 1)) {
    issue(game, 'has no usable scramble words');
  }
  if (game.type === 'balance' && (!Array.isArray(data.eqs) || !data.eqs.length || data.eqs.some((equation) => !/(?:→|⟶|->|=>|=)/.test(String(equation))))) {
    issue(game, 'has a missing or malformed chemical equation');
  }
  if (game.type === 'flame' && (!Array.isArray(data.items) || data.items.filter((item) => item && item.n && /^#[0-9a-f]{6}$/i.test(item.c || '')).length < 3)) {
    issue(game, 'needs at least three ion/color entries');
  }
  if (game.type === 'oddOne' && (!Array.isArray(data.sets) || !data.sets.some((set) => set && Array.isArray(set.i) && set.i.filter(Boolean).length >= 3 && Number.isInteger(+set.odd) && +set.odd >= 0 && +set.odd < set.i.length))) {
    issue(game, 'has no valid odd-one-out question');
  }
  if (game.type === 'stepOrder' && (!Array.isArray(data.puzzles) || !data.puzzles.some((puzzle) => puzzle && Array.isArray(puzzle.steps) && puzzle.steps.filter(Boolean).length >= 3))) {
    issue(game, 'has no valid step-order puzzle');
  }
  if (game.type === 'simExplorer' && (!data.sim || !data.sim.kind || !data.sim.values || !Object.keys(data.sim.values).length)) {
    issue(game, 'has an incomplete simulation definition');
  }
  if (game.type === 'arcadeQuest') {
    const rounds = data.rounds;
    const mode = data.mode;
    if (!['sort', 'sequence', 'build', 'target', 'path', 'spot', 'connect', 'balance'].includes(mode)) issue(game, `unsupported Arcade Quest mode ${mode}`);
    if (!Array.isArray(rounds) || rounds.length < 4) issue(game, 'needs at least four playable missions');
    (Array.isArray(rounds) ? rounds : []).forEach((round, index) => {
      let valid = true;
      if (mode === 'sort') valid = !!round[0] && !!round[1] && Array.isArray(round[2]) && Number.isInteger(+round[3]) && +round[3] >= 0 && +round[3] < round[2].length && !!round[4];
      if (mode === 'sequence') valid = !!round[0] && Array.isArray(round[1]) && round[1].length >= 3 && !!round[2];
      if (mode === 'build') valid = !!round[0] && Array.isArray(round[1]) && Array.isArray(round[2]) && round[2].length > 0 && round[2].every((part) => Number.isInteger(+part) && +part >= 0 && +part < round[1].length) && !!round[3];
      if (mode === 'target') valid = !!round[0] && Number.isFinite(+round[1]) && Number.isFinite(+round[2]) && +round[1] < +round[2] && +round[3] >= +round[1] && +round[3] <= +round[2] && !!round[5];
      if (mode === 'path' || mode === 'spot') valid = !!round[0] && Array.isArray(round[1]) && Number.isInteger(+round[2]) && +round[2] >= 0 && +round[2] < round[1].length && !!round[3];
      if (mode === 'connect') valid = !!round[0] && Array.isArray(round[1]) && round[1].length >= 2 && round[1].every((pair) => pair && pair[0] && pair[1]) && !!round[2];
      if (mode === 'balance') {
        valid = !!round[0] && Array.isArray(round[1]) && round[1].length > 0 && Number.isFinite(+round[2]) && !!round[4];
        if (valid) {
          let achievable = false;
          for (let mask = 1; mask < (1 << round[1].length); mask++) {
            const sum = round[1].reduce((total, value, i) => total + ((mask >> i) & 1 ? +value : 0), 0);
            if (sum === +round[2]) { achievable = true; break; }
          }
          valid = achievable;
        }
      }
      if (!valid) issue(game, `invalid ${mode || 'unknown'} mission ${index + 1}`);
    });
  }
}

if (issues.length) {
  console.error(`Arcade integrity check failed (${issues.length} issues):`);
  issues.forEach((item) => console.error(` - ${item}`));
  process.exit(1);
}

console.log(`Arcade integrity check passed: ${games.length} active games, ${new Set(games.map((game) => game.type)).size} game types, ${Object.keys(handlers).length} registered handlers.`);
