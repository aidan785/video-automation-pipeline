// Round-2 keep-range edits on the union EDL (source coords), in place. Boundaries from 20ms RMS sweeps (assets/_rms.sh).
import fs from 'node:fs';
const p = process.argv[2] ?? 'assets/clean-v1.union-edl.json';
const e = JSON.parse(fs.readFileSync(p, 'utf8'));
let K = e.keep_ranges;
const near = (v, t, tol = 0.02) => Math.abs(v - t) < tol;
const FIX = [
  { findStart: 175.372, newStart: 176.80, why: 'drop "And then stand right back up." (175.48-176.72; read as a doubled phrase after the 4.8s wait was trimmed); keep the silent rise 176.80-177.89' },
  { findEnd: 1067.084, newEnd: 1067.80, why: 'restore the first, full "rigged," (1067.34-1067.66) + 0.14 breath' },
  { drop: [1073.044, 1073.461], why: 'drop the clipped "ri-" fragment (1073.10-1073.28) that v1 kept instead' },
  { findStart: 1073.981, newStart: 1073.88, why: '"character" onset 1074.04: 0.16s pre-roll' },
];
for (const f of FIX) {
  if (f.drop) { const i = K.findIndex(k => near(k.start, f.drop[0]) && near(k.end, f.drop[1])); if (i < 0) { console.error('NOT FOUND', f); process.exit(1); } console.log(`drop keep ${K[i].start}-${K[i].end}  (${f.why})`); K.splice(i, 1); continue; }
  const k = f.findStart != null ? K.find(k => near(k.start, f.findStart)) : K.find(k => near(k.end, f.findEnd));
  if (!k) { console.error('NOT FOUND', f); process.exit(1); }
  const before = `${k.start}-${k.end}`;
  if (f.newStart != null) k.start = f.newStart;
  if (f.newEnd != null) k.end = f.newEnd;
  console.log(`keep ${before} -> ${k.start}-${k.end}  (${f.why})`);
}
const D = []; let cur = 0;
for (const k of K) { if (k.start > cur + 0.001) D.push({ start: cur, end: k.start }); cur = k.end; }
if (cur < e.source_duration - 0.001) D.push({ start: cur, end: e.source_duration });
e.keep_ranges = K; e.delete_ranges = D; e.edited_duration = +K.reduce((a, k) => a + (k.end - k.start), 0).toFixed(3);
fs.writeFileSync(p, JSON.stringify(e, null, 2));
console.log('keeps', K.length, 'edited_duration', e.edited_duration);
