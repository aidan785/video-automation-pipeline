// Readable dump of a Scribe transcript: one line per phrase (break at gap >= GAP or sentence end), with source timecodes and gap markers.
// usage: node _dump.mjs <transcript.json> [gap=0.8] > dump.txt
import fs from 'node:fs';
const [p, g] = process.argv.slice(2); const GAP = +(g ?? 0.8);
const t = JSON.parse(fs.readFileSync(p, 'utf8'));
const W = t.words.filter(w => w.type === 'word');
const fmt = x => `${String(Math.floor(x / 60)).padStart(2, '0')}:${(x % 60).toFixed(2).padStart(5, '0')}`;
let line = [], out = [];
const flush = () => { if (line.length) { out.push(`[${fmt(line[0].start)} ${line[0].start.toFixed(2)}] ${line.map(w => w.text).join(' ')}`); line = []; } };
for (let i = 0; i < W.length; i++) {
  const w = W[i], prev = W[i - 1];
  if (prev) { const gap = w.start - prev.end; if (gap >= GAP) { flush(); out.push(`        ~~ gap ${gap.toFixed(1)}s (${prev.end.toFixed(2)} -> ${w.start.toFixed(2)})`); } }
  line.push(w);
  if (/[.!?]["')]?$/.test(w.text) || /--$/.test(w.text)) flush();
}
flush();
console.log(out.join('\n'));
const long = W.filter(w => w.end - w.start > 1.2);
console.error(`words ${W.length}, dur ${t.audio_duration_secs ?? ''}, tokens>1.2s: ${long.length}`);
for (const w of long) console.error(`  LONG "${w.text}" ${w.start.toFixed(2)}-${w.end.toFixed(2)} (${(w.end - w.start).toFixed(1)}s)`);
