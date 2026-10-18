// Copies the static site into dist/ (no extra build tools needed).
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), out = path.join(root, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const f of ['index.html', '404.html', 'robots.txt', 'assets', 'admin'])
  fs.cpSync(path.join(root, f), path.join(out, f), { recursive: true });
console.log('Built to dist/');
