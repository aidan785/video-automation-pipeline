import fs from 'fs';
// source-truth silence trims (source coords), margins already applied
const srcCuts = [
  { a: 118.78, b: 119.71, reason: 'dead air: knowledge of -> connecting (source silence 118.60-119.88)' },
  { a: 470.71, b: 474.47, reason: 'dead air before "is natural" (source silence 470.53-474.65)' },
  { a: 2382.43, b: 2386.70, reason: 'dead air: sign up -> We\'ll show (source silence 2382.23-2386.88)' },
  { a: 3368.14, b: 3368.65, reason: 'dead air: price. So -> in my honest (source silence 3367.96-3368.83)' },
];
const edl = JSON.parse(fs.readFileSync('raw.silence-edl.json', 'utf8'));
const keeps = edl.keep_ranges;
let acc = 0;
const mapped = [];
for (const k of keeps) {
  const d = k.end - k.start;
  for (const c of srcCuts) {
    const lo = Math.max(c.a, k.start), hi = Math.min(c.b, k.end);
    if (hi > lo + 0.04) mapped.push({ start: +(acc + (lo - k.start)).toFixed(3), end: +(acc + (hi - k.start)).toFixed(3), reason: c.reason });
  }
  acc += d;
}
const ac = JSON.parse(fs.readFileSync('approved-cuts.json', 'utf8'));
const before = ac.cuts.length;
ac.cuts = ac.cuts.filter(c => !(Math.abs(c.start - 263.42) < 0.01)); // drop the bad manual cut that clipped "natural"
ac.cuts.push(...mapped);
ac.cuts.sort((x, y) => x.start - y.start);
// merge/validate overlaps
const merged = [];
for (const c of ac.cuts) {
  const last = merged[merged.length - 1];
  if (last && c.start <= last.end + 0.001) { last.end = Math.max(last.end, c.end); last.reason += ' + ' + c.reason; }
  else merged.push(c);
}
ac.cuts = merged;
fs.writeFileSync('approved-cuts.json', JSON.stringify(ac, null, 2));
console.log(`was ${before}, mapped ${mapped.length} source cuts:`, JSON.stringify(mapped, null, 1));
console.log(`now ${ac.cuts.length} cuts, total ${ac.cuts.reduce((s, c) => s + c.end - c.start, 0).toFixed(1)}s`);
