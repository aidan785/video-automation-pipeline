// Give the new video head ~0.25s of pre-roll before "I connected Claude Fable 5.1" (raw "I" at 40.10;
// -45dB breath noise from 39.49). Edits the union EDL in place: first delete ends at 39.85, first keep starts there.
import fs from 'node:fs';
const p = process.argv[2] ?? 'assets/clean-v1.union-edl.json';
const e = JSON.parse(fs.readFileSync(p, 'utf8'));
const HEAD = 39.85;
const d0 = e.delete_ranges[0]; const k0 = e.keep_ranges[0];
if (!(d0.start === 0 && Math.abs(d0.end - k0.start) < 1e-6)) { console.error('unexpected EDL head', d0, k0); process.exit(1); }
console.log(`head: delete 0-${d0.end} -> 0-${HEAD}; keep ${k0.start}-${k0.end} -> ${HEAD}-${k0.end}`);
d0.end = HEAD; k0.start = HEAD;
e.edited_duration = +e.keep_ranges.reduce((a, k) => a + (k.end - k.start), 0).toFixed(3);
fs.writeFileSync(p, JSON.stringify(e, null, 2));
console.log('edited_duration now', e.edited_duration);
