// v2 flub list (SOURCE coords) for patch-residual-silences --flubs:
//  - the "but you would do..." fragment raw Scribe merged into a "do" token (fresh heard it at 3:18.7)
//  - tighten the silent demo lead-ins / tails so each showcase junction sits ~1s, not 1.5-1.7s
// Boundaries are read from the v1 union EDL so the trims land exactly on the kept breath.
import fs from 'node:fs';
const e = JSON.parse(fs.readFileSync('assets/clean-v1.union-edl.json', 'utf8'));
const K = e.keep_ranges;
const keepEndingNear = (t, tol = 0.4) => { const k = K.find(k => Math.abs(k.end - t) < tol); if (!k) throw new Error('no keep ending near ' + t); return k; };
const keepStartingNear = (t, tol = 0.4) => { const k = K.find(k => Math.abs(k.start - t) < tol); if (!k) throw new Error('no keep starting near ' + t); return k; };
const F = [];
const tail = (nearEnd, newEnd, why) => { const k = keepEndingNear(nearEnd); if (newEnd >= k.end) throw new Error('tail no-op ' + why); F.push({ start: +newEnd.toFixed(3), end: +(k.end + 0.001).toFixed(3), reason: `${why} (keep ${k.start}-${k.end} -> ends ${newEnd})` }); };
const lead = (nearStart, newStart, why) => { const k = keepStartingNear(nearStart); if (newStart <= k.start) throw new Error('lead no-op ' + why); F.push({ start: +(k.start - 0.001).toFixed(3), end: +newStart.toFixed(3), reason: `${why} (keep ${k.start}-${k.end} -> starts ${newStart})` }); };

F.push({ start: 605.68, end: 609.82, reason: "'a month, but you would do--' fragment: raw Scribe merged 'you would do... But do' into one token; real 'But do remember' onset 10:09.88" });
tail(38.13, 37.75, 'walk demo tail 1.25s -> 0.87s after "walking movements."');
lead(83.29, 83.95, 'backflip lead-in 1.8s -> 1.13s before "Even gave him"');
tail(93.54, 92.85, 'backflip tail 1.8s -> 1.13s after "Fable 5.1."');
lead(107.49, 108.10, 'wave lead-in 1.6s -> 1.02s before "Gave him a nice little wave"');
tail(112.64, 112.15, 'wave tail 1.7s -> 1.23s after "wave animation."');
tail(179.74, 178.60, 'alley tail 3.2s -> 2.08s after "in under thirty minutes."');
tail(1477.24, 1476.30, 'backflip-result tail: "this." really ends 1475.28 (raw token stretched to 1476.1); ~1.0s tail');
F.sort((a, b) => a.start - b.start);
fs.writeFileSync('assets/flubs-v2.json', JSON.stringify(F, null, 2));
for (const f of F) console.log(`${f.start.toFixed(2)}-${f.end.toFixed(2)} (${(f.end - f.start).toFixed(2)}s) ${f.reason}`);
