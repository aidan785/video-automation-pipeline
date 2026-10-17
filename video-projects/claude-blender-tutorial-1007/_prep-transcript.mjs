// Prepare the raw Scribe transcript for cut-silences:
//  1. drop zero-content tokens
//  2. inject [CLIP] protect tokens for the silent demo payoffs (stripped again after cut-silences)
// (clamp-stretched-tokens found nothing to clamp on this take; every wordless gap >= 1.5s was isolate-transcribed: assets/iso-gaps-report.txt)
// in: assets/raw-transcript.json -> out: assets/source.json (+ assets/protect-clips.json)
import fs from 'node:fs';
const t = JSON.parse(fs.readFileSync('assets/raw-transcript.json', 'utf8'));
let W = t.words; const log = [];
const before = W.length;
W = W.filter(w => w.type !== 'word' || /[a-z0-9]/i.test(w.text));
log.push(`dropped ${before - W.length} zero-content token(s)`);
const words = W.filter(w => w.type === 'word');
const after = (text, start) => { const w = words.find(w => w.text === text && Math.abs(w.start - start) < 0.05); if (!w) throw new Error('anchor ' + text); return w.end + 0.01; };
const P = [
  { start: after('shot.', 255.24), end: 263.40, label: 'spaceship stills: he flips forward through images 6-11 of 11 (about 1.2s each) after "this is like an action shot." (he flips back to image 2 afterwards, cut)' },
  { start: 967.50, end: 971.00, label: 'fixed-finger proof: rendered close-up of the fingers on the branch, then two zoom steps out (hand, then wide) between "And you can see ..." and "And now that finger is not interfering with our branch."' },
];
for (const p of P) { if (!(p.end > p.start + 0.3)) throw new Error('bad protect ' + JSON.stringify(p)); W.push({ text: '[CLIP]', start: +p.start.toFixed(3), end: +p.end.toFixed(3), type: 'word', speaker_id: 'speaker_0' }); }
W.sort((a, b) => a.start - b.start);
const ww = W.filter(w => w.type === 'word');
for (let i = 1; i < ww.length; i++) if (ww[i].start < ww[i - 1].end - 0.005) log.push(`OVERLAP ${ww[i - 1].text}@${ww[i - 1].start}-${ww[i - 1].end} / ${ww[i].text}@${ww[i].start}`);
t.words = W; t.text = ww.map(w => w.text).join(' ');
fs.writeFileSync('assets/source.json', JSON.stringify(t));
fs.writeFileSync('assets/protect-clips.json', JSON.stringify(P.map(p => ({ start: +p.start.toFixed(3), end: +p.end.toFixed(3), label: p.label })), null, 2));
console.log(log.join('\n'));
console.log(`words: ${ww.length} (${P.length} [CLIP]) -> assets/source.json`);
