// scripts/bump-cache-key.cjs
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { randomUUID } = require('crypto');

function buildKey() {
  let sha = '';
  try { sha = execSync('git rev-parse --short HEAD', { stdio: ['ignore','pipe','ignore'] }).toString().trim(); } catch {}
  const ts = Date.now();              // ms precision
  const uid = randomUUID().slice(0,8); // short random part
  return `${sha || 'nogit'}-${ts}-${uid}`;
}

const KEY = process.env.CACHE_KEY || buildKey();
const filePath = path.join(process.cwd(), 'app', 'GlobalVar.tsx');

let src = fs.readFileSync(filePath, 'utf8');
// Replace the whole RHS of the const (string or env expression)
const re = /const\s+cacheKey\s*=\s*[^;]*;?/m;

if (re.test(src)) {
  src = src.replace(re, `const cacheKey = '${KEY}';`);
} else if (/export\s*\{\s*cacheKey\s*\}\s*;?/.test(src)) {
  src = src.replace(/export\s*\{\s*cacheKey\s*\}\s*;?/, `const cacheKey = '${KEY}';\nexport { cacheKey };`);
} else {
  src += `\nconst cacheKey = '${KEY}';\nexport { cacheKey };\n`;
}

fs.writeFileSync(filePath, src);
console.log('CACHE_KEY bumped to:', KEY);