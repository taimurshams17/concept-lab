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
for (const relative of ['assets/js/defaults.js', 'assets/js/game-academy.js', 'assets/js/games.js']) {
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
}

if (issues.length) {
  console.error(`Arcade integrity check failed (${issues.length} issues):`);
  issues.forEach((item) => console.error(` - ${item}`));
  process.exit(1);
}

console.log(`Arcade integrity check passed: ${games.length} active games, ${new Set(games.map((game) => game.type)).size} game types, ${Object.keys(handlers).length} registered handlers.`);
