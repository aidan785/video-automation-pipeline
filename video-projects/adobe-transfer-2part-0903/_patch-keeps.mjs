// Adjust specific keep-range boundaries in the union EDL (source coords), in place.
// usage: node _patch-keeps.mjs <union-edl.json>
import fs from 'node:fs';
const p = process.argv[2] ?? 'assets/clean-v1.union-edl.json';
const e = JSON.parse(fs.readFileSync(p, 'utf8'));
const K = e.keep_ranges;
const FIX = [
  { findStart: 40.037, newStart: 39.85, why: "video head: 0.25s pre-roll before 'I connected Claude Fable 5.1' (breath zone from 39.49)" },
  { findEnd: 1305.5, newEnd: 1305.75, tol: 0.15, why: "'effectively' tail: clamp chopped the -ly (-45dB silence starts 1305.69), fresh heard 'effective'" },
];
for (const f of FIX) {
  const tol = f.tol ?? 0.02;
  const k = f.findStart != null ? K.find(k => Math.abs(k.start - f.findStart) < tol) : K.find(k => Math.abs(k.end - f.findEnd) < tol);
  if (!k) { console.error('NOT FOUND', f); process.exit(1); }
  const before = `${k.start}-${k.end}`;
  if (f.newStart != null) k.start = f.newStart;
  if (f.newEnd != null) k.end = f.newEnd;
  console.log(`keep ${before} -> ${k.start}-${k.end}  (${f.why})`);
}
// rebuild deletes + duration
const D = []; let cur = 0;
for (const k of K) { if (k.start > cur + 0.001) D.push({ start: cur, end: k.start }); cur = k.end; }
if (cur < e.source_duration - 0.001) D.push({ start: cur, end: e.source_duration });
e.delete_ranges = D; e.edited_duration = +K.reduce((a, k) => a + (k.end - k.start), 0).toFixed(3);
fs.writeFileSync(p, JSON.stringify(e, null, 2));
console.log('edited_duration', e.edited_duration);
