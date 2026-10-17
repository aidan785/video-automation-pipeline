// Isolate-transcribe every wordless transcript gap >= MIN seconds (each slice individually), summarise words heard
// that are NOT boundary words (inside the gap by > 0.35s). usage: node _iso-gaps.mjs [min=1.5]
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
const MIN = +(process.argv[2] ?? 1.5);
const t = JSON.parse(fs.readFileSync('assets/transcript-raw.orig.json', 'utf8'));
const W = t.words.filter(w => w.type === 'word');
const gaps = [];
for (let i = 0; i + 1 < W.length; i++) {
  // skip the two phantom stretched tokens' own spans: treat the gap as from the previous real word
  const a = W[i], b = W[i + 1];
  const g = b.start - a.end;
  if (g >= MIN) gaps.push({ start: a.end, end: b.start, prev: a.text, next: b.text });
}
// phantom tokens fully inside silence: "I" 51.02-102.88, "Yo," 2066.49-2182.53 -> add their spans as gaps too
gaps.push({ start: 29.9, end: 103.3, prev: 'show.', next: '(I) also,' });
gaps.push({ start: 2054.1, end: 2190.2, prev: 'done.', next: '(Yo,) can' });
if (W[0].start >= MIN) gaps.unshift({ start: 0, end: W[0].start, prev: '<head>', next: W[0].text });
gaps.sort((x, y) => x.start - y.start);
console.log(`${gaps.length} gaps >= ${MIN}s`);
const fmt = x => `${Math.floor(x / 60)}:${(x % 60).toFixed(2).padStart(5, '0')}`;
const out = [];
for (const g of gaps) {
  const name = `gap-${g.start.toFixed(1)}`;
  const r = spawnSync('node', ['_iso.mjs', name, g.start.toFixed(2), g.end.toFixed(2), '0.3'], { encoding: 'utf8' });
  const j = `assets/iso/${name}.json`;
  if (!fs.existsSync(j)) { out.push(`${fmt(g.start)}-${fmt(g.end)} ERROR ${r.stderr.slice(0, 200)}`); continue; }
  const a = Math.max(0, g.start - 0.3);
  const ws = JSON.parse(fs.readFileSync(j, 'utf8')).words.filter(w => w.type === 'word').map(w => ({ text: w.text, s: w.start + a, e: w.end + a }));
  const inner = ws.filter(w => w.s > g.start + 0.35 && w.e < g.end - 0.35);
  out.push(`${fmt(g.start)}-${fmt(g.end)} (${(g.end - g.start).toFixed(1)}s) after "${g.prev}" -> ${inner.length ? 'HEARD: ' + inner.map(w => `${w.text}@${fmt(w.s)}`).join(' ') : 'clean'}${ws.length !== inner.length ? `  [edge: ${ws.filter(w => !inner.includes(w)).map(w => w.text).join(' ')}]` : ''}`);
  console.log(out[out.length - 1]);
}
fs.writeFileSync('assets/iso-gaps-report.txt', out.join('\n'));
