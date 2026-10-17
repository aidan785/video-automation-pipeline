// Prepare the raw Scribe transcript for cut-silences:
//  1. fix stretched / merged tokens from RMS + isolate-transcription ground truth
//  2. drop zero-content tokens (a lone "," token breaks phrase matching + hides a pause)
//  3. inject [CLIP] protect tokens for the silent demo playback windows (intro showcase, alley pan, backflip result)
// in: assets/transcript-raw.orig.json  ->  out: assets/source.json (+ assets/protect-clips.json)
import fs from 'node:fs';
const t = JSON.parse(fs.readFileSync('assets/transcript-raw.orig.json', 'utf8'));
let W = t.words;
const find = (text, start, tol = 0.05) => { const i = W.findIndex(w => w.type === 'word' && w.text === text && Math.abs(w.start - start) < tol); if (i < 0) throw new Error(`token not found: ${text}@${start}`); return i; };
const tok = (text, start, end) => ({ text, start: +start.toFixed(3), end: +end.toFixed(3), type: 'word', speaker_id: 'speaker_0' });
const log = [];
function retime(text, start, ns, ne) { const i = find(text, start); log.push(`retime "${text}" ${W[i].start}-${W[i].end} -> ${ns}-${ne}`); W[i].start = ns; W[i].end = ne; }
function replace(text, start, toks) { const i = find(text, start); log.push(`replace "${text}" ${W[i].start}-${W[i].end} -> ${toks.map(x => `${x.text}@${x.start}`).join(' ')}`); W.splice(i, 1, ...toks); }

// 1. token fixes (RMS 50ms sweep + isolated Scribe on the slice)
retime('Even', 52.74, 85.08, 85.40);            // -30dB silence 36.87-85.12; onset -36dB @85.20
retime('Claude', 153.90, 153.90, 154.32);       // voice to 154.20, -51dB @154.30
retime('of', 301.74, 301.74, 302.02);           // voice to 301.85, -56dB @302.05
retime('Also', 383.96, 394.94, 395.34);         // onset -29dB @395.00
replace('So', 485.38, [tok('So,', 564.82, 565.06), tok('so', 565.68, 565.92)]);   // iso heard "So, so on the left"; RMS onsets 564.85 / 565.75
replace('finding', 622.16, [tok('f-', 622.16, 622.38), tok('if', 622.42, 622.50), tok("you're", 622.50, 622.60), tok('having', 622.60, 622.80), tok('trouble', 622.80, 623.06), tok('finding', 623.08, 623.48)]); // iso: "having a trouble f- if you're having trouble finding"
replace('backflip.', 998.15, [tok('back', 998.12, 998.32), tok('flip.', 999.70, 999.95)]);  // iso: "back" 998.14 / "flip." 999.72 (typing pause between)
retime('output.', 1008.87, 1008.87, 1009.25);   // quiet word (-37..-42dB) ends 1009.15; then keyboard

// 2. zero-content tokens
const before = W.length;
W = W.filter(w => w.type !== 'word' || /[a-z0-9]/i.test(w.text));
log.push(`dropped ${before - W.length} zero-content token(s)`);

// 3. protect windows (source seconds) — injected as [CLIP] word tokens, stripped after cut-silences
const words = W.filter(w => w.type === 'word');
const after = (text, start) => { const w = words.find(w => w.text === text && Math.abs(w.start - start) < 0.05); if (!w) throw new Error('anchor ' + text); return w.end + 0.01; };
const upto = (text, start) => { const w = words.find(w => w.text === text && Math.abs(w.start - start) < 0.05); if (!w) throw new Error('anchor ' + text); return w.start - 0.01; };
const P = [
  { start: after('this.', 9.91), end: 12.60, label: 'intro: facial-expression demo tail after "just like this."' },
  { start: after('movements.', 36.42), end: 38.00, label: 'intro: walk demo tail after "some walking movements."' },
  { start: 83.40, end: upto('Even', 85.08), label: 'intro: backflip lead-in before "Even gave him this nice backflip"' },
  { start: after('5.1.', 91.10), end: 93.30, label: 'intro: backflip tail after "all prompting Fable 5.1."' },
  { start: 107.60, end: upto('Gave', 109.12), label: 'intro: wave lead-in before "Gave him a nice little wave animation."' },
  { start: after('animation.', 110.30), end: 112.40, label: 'intro: wave tail' },
  { start: after('zooms.', 157.26), end: upto('And', 162.96), label: 'intro: alley camera pan / DEAD END sign (the "camera movements, camera zooms" he just described)' },
  { start: after('minutes.', 176.22), end: 179.50, label: 'intro: alley walk tail after "in under thirty minutes."' },
  { start: after('this.', 1475.00), end: 1477.00, label: 'backflip result tail after "rig animation like this."' },
];
for (const p of P) { if (!(p.end > p.start + 0.3)) throw new Error('bad protect ' + JSON.stringify(p)); W.push({ text: '[CLIP]', start: +p.start.toFixed(3), end: +p.end.toFixed(3), type: 'word', speaker_id: 'speaker_0' }); }
W.sort((a, b) => a.start - b.start);
// overlap sanity
const ww = W.filter(w => w.type === 'word');
for (let i = 1; i < ww.length; i++) if (ww[i].start < ww[i - 1].end - 0.005) log.push(`OVERLAP ${ww[i - 1].text}@${ww[i - 1].start}-${ww[i - 1].end} / ${ww[i].text}@${ww[i].start}`);
t.words = W; t.text = ww.map(w => w.text).join(' ');
fs.writeFileSync('assets/source.json', JSON.stringify(t));
fs.writeFileSync('assets/protect-clips.json', JSON.stringify(P.map(p => ({ start: +p.start.toFixed(3), end: +p.end.toFixed(3), label: p.label })), null, 2));
console.log(log.join('\n'));
console.log(`words: ${ww.length} (${P.length} [CLIP]) -> assets/source.json`);
