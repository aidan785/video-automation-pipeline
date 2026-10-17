// Round 2 (after the first verified render + the fresh-transcript retake read): two source-coordinate keep-range edits.
//  1. "So I'm really ha- [pause] So I'm really happy": raw Scribe had merged the restart into one 0.90s "really" token
//     (1102.28-1103.18). Isolated pass: take 1 = 1102.10-1102.56, silence 1102.67-1102.84, take 2 onset 1102.85. Drop take 1.
//  2. Outro "So I high-- [pause] So I highly recommend": raw Scribe labelled the s of the second "So" as a separate "s-" token
//     (1730.75-1730.77), so the v1 cut ended at 1730.78 and clipped it (fresh pass heard "But I highly recommend").
//     Silence runs 1730.47-1730.69, the s starts at 1730.70: resume at 1730.62 instead.
// in: assets/clean-v1.union-edl.json -> out: assets/clean-v2.union-edl.json
import fs from 'node:fs';
const e = JSON.parse(fs.readFileSync('assets/clean-v1.union-edl.json', 'utf8'));
const K = e.keep_ranges.map(k => ({ ...k }));
const at = t => { const k = K.find(k => k.start <= t && k.end > t); if (!k) throw new Error('no keep at ' + t); return k; };
const log = [];
{ const k = at(1102.5); log.push(`keep ${k.start.toFixed(3)}-${k.end.toFixed(3)} -> start 1102.780 (drop "So I'm really ha-")`); k.start = 1102.78; }
{ const k = at(1731.0); if (Math.abs(k.start - 1730.78) > 0.03) throw new Error('unexpected outro keep start ' + k.start); log.push(`keep ${k.start.toFixed(3)}-${k.end.toFixed(3)} -> start 1730.620 (restore the s of "So I highly recommend")`); k.start = 1730.62; }
for (let i = 0; i < K.length; i++) { if (!(K[i].end - K[i].start >= 0.3)) throw new Error('sliver ' + JSON.stringify(K[i])); if (i && K[i].start < K[i - 1].end) throw new Error('overlap at ' + K[i].start); }
const D = []; let p = 0; for (const k of K) { if (k.start > p + 1e-6) D.push({ start: +p.toFixed(4), end: +k.start.toFixed(4) }); p = k.end; }
if (e.source_duration > p + 1e-6) D.push({ start: +p.toFixed(4), end: e.source_duration });
const out = { source_duration: e.source_duration, edited_duration: +K.reduce((s, k) => s + k.end - k.start, 0).toFixed(3), keep_ranges: K, delete_ranges: D };
fs.writeFileSync('assets/clean-v2.union-edl.json', JSON.stringify(out, null, 2));
console.log(log.join('\n')); console.log(`keeps ${K.length}, edited ${out.edited_duration}s -> assets/clean-v2.union-edl.json`);
