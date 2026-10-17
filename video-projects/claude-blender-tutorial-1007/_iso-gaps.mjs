// Isolate-transcribe every wordless transcript gap >= MIN seconds (each slice individually, 4 at a time), summarise words heard
// that are NOT boundary words (inside the gap by > 0.35s). usage: node _iso-gaps.mjs [min=1.5]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const MIN = +(process.argv[2] ?? 1.5);
const t = JSON.parse(fs.readFileSync('assets/raw-transcript.json', 'utf8'));
const W = t.words.filter(w => w.type === 'word');
const gaps = [];
for (let i = 0; i + 1 < W.length; i++) { const a = W[i], b = W[i + 1]; if (b.start - a.end >= MIN) gaps.push({ start: a.end, end: b.start, prev: a.text, next: b.text }); }
if (W[0].start >= MIN) gaps.unshift({ start: 0, end: W[0].start, prev: '<head>', next: W[0].text });
const dur = t.audio_duration_secs; const last = W[W.length - 1];
if (dur - last.end >= MIN) gaps.push({ start: last.end, end: dur, prev: last.text, next: '<tail>' });
console.log(`${gaps.length} gaps >= ${MIN}s, total ${gaps.reduce((s, g) => s + g.end - g.start, 0).toFixed(1)}s`);
const fmt = x => `${Math.floor(x / 60)}:${(x % 60).toFixed(2).padStart(5, '0')}`;
const run = g => new Promise(res => { const name = `gap-${g.start.toFixed(1)}`; const p = spawn('node', ['_iso.mjs', name, g.start.toFixed(2), g.end.toFixed(2), '0.3']); let err = ''; p.stderr.on('data', d => err += d); p.on('close', () => res({ g, name, err })); });
const out = []; let idx = 0;
async function worker() { while (idx < gaps.length) { const g = gaps[idx++]; const { name, err } = await run(g);
  const j = `assets/iso/${name}.json`;
  if (!fs.existsSync(j)) { out.push({ s: g.start, line: `${fmt(g.start)}-${fmt(g.end)} ERROR ${err.slice(0, 200)}` }); continue; }
  const a = Math.max(0, g.start - 0.3);
  const ws = JSON.parse(fs.readFileSync(j, 'utf8')).words.filter(w => w.type === 'word').map(w => ({ text: w.text, s: w.start + a, e: w.end + a }));
  const inner = ws.filter(w => w.s > g.start + 0.35 && w.e < g.end - 0.35);
  out.push({ s: g.start, line: `${fmt(g.start)}-${fmt(g.end)} [${g.start.toFixed(2)}-${g.end.toFixed(2)}] (${(g.end - g.start).toFixed(1)}s) after "${g.prev}" before "${g.next}" -> ${inner.length ? 'HEARD: ' + inner.map(w => `${w.text}@${w.s.toFixed(2)}`).join(' ') : 'clean'}${ws.length !== inner.length ? `  [edge: ${ws.filter(w => !inner.includes(w)).map(w => w.text).join(' ')}]` : ''}` }); } }
await Promise.all([worker(), worker(), worker(), worker()]);
out.sort((x, y) => x.s - y.s);
fs.writeFileSync('assets/iso-gaps-report.txt', out.map(o => o.line).join('\n'));
console.log(out.map(o => o.line).join('\n'));
