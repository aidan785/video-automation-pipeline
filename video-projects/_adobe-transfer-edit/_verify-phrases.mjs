#!/usr/bin/env node
// usage: node _verify-phrases.mjs <transcript.json> <checks.json>
// checks.json: { "gone": ["phrase", ...], "kept": ["phrase", ...] }
import fs from 'node:fs';
const [tPath, cPath] = process.argv.slice(2);
const t = JSON.parse(fs.readFileSync(tPath, 'utf8'));
const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const text = norm(t.text || t.words.map(w => w.text).join(' '));
const checks = JSON.parse(fs.readFileSync(cPath, 'utf8'));
let fail = 0;
const count = p => text.split(norm(p)).length - 1;
for (const p of checks.gone) {
  const n = count(p);
  if (n !== 0) { console.log(`FAIL gone x${n}: "${p}"`); fail++; } else console.log(`ok   gone: "${p}"`);
}
for (const p of checks.kept) {
  const n = count(p);
  if (n < 1) { console.log(`FAIL kept x${n}: "${p}"`); fail++; } else console.log(`ok   kept x${n}: "${p}"`);
}
console.log(fail ? `\n${fail} FAILURES` : '\nALL CHECKS PASSED');
process.exit(fail ? 1 : 0);
