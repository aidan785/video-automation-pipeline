import fs from 'fs';
const edl = JSON.parse(fs.readFileSync('raw.silence-edl.json', 'utf8'));
let acc = 0; const mapped = [];
for (const k of edl.keep_ranges) {
  const lo = Math.max(194.27, k.start), hi = Math.min(196.26, k.end);
  if (hi > lo + 0.04) mapped.push({ start: +(acc + (lo - k.start)).toFixed(3), end: +(acc + (hi - k.start)).toFixed(3), reason: 'dead air: knowledge of -> connecting (source silence 194.09-196.41)' });
  acc += k.end - k.start;
}
const ac = JSON.parse(fs.readFileSync('approved-cuts.json', 'utf8'));
ac.cuts.push(...mapped);
ac.cuts.sort((a, b) => a.start - b.start);
for (let i = 1; i < ac.cuts.length; i++) if (ac.cuts[i].start < ac.cuts[i-1].end) throw new Error('overlap');
fs.writeFileSync('approved-cuts.json', JSON.stringify(ac, null, 2));
console.log('added', JSON.stringify(mapped), '-> total', ac.cuts.length, 'cuts');
