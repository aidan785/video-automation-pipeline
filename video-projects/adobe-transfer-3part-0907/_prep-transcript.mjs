// Prepare the raw Scribe transcript for cut-silences:
//  1. fix stretched / phantom tokens from isolated re-transcription ground truth (assets/iso/*.json, see iso-tokens.txt / iso-midtokens.txt)
//  2. drop zero-content tokens ("..." x9)
//  3. inject [CLIP] protect tokens for the silent demo payoffs + the Backrooms playback (has audio but no words)
// in: assets/transcript-raw.orig.json -> out: assets/source.json (+ assets/protect-clips.json)
import fs from 'node:fs';
const t = JSON.parse(fs.readFileSync('assets/transcript-raw.orig.json', 'utf8'));
let W = t.words;
const find = (text, start, tol = 0.05) => { const i = W.findIndex(w => w.type === 'word' && w.text === text && Math.abs(w.start - start) < tol); if (i < 0) throw new Error(`token not found: ${text}@${start}`); return i; };
const log = [];
function retime(text, start, ns, ne) { const i = find(text, start); log.push(`retime "${text}" ${W[i].start}-${W[i].end} -> ${ns}-${ne}`); W[i].start = ns; W[i].end = ne; }

// 1a. phantom tokens fully inside silence (clamp skipped them)
retime('I', 51.02, 103.30, 103.38);           // iso: I@103.30 also@103.42 ("I also," restart)
retime('Yo,', 2066.49, 2182.44, 2182.70);     // iso: Yo,@2182.44 (start of the phone call; all cut anyway)
// 1b. stretched tokens > 1.2s (clamp table reviewed; ends taken from the isolated Scribe pass, not the -30dB edge)
retime('and', 394.08, 394.08, 394.36);
retime('in', 500.33, 500.33, 500.60);
retime('prompt.', 626.79, 626.79, 627.10);
retime('So', 710.25, 710.25, 710.50);
retime('up.', 737.12, 737.12, 737.30);
retime('folders.', 754.10, 754.10, 754.50);
retime('ChatGPT--', 788.56, 788.56, 789.22);
retime('entire', 829.96, 829.96, 830.64);
retime('general', 871.44, 871.44, 871.86);
retime('path.', 915.58, 915.58, 915.94);
retime('GPT-6', 991.18, 991.18, 992.14);
retime('connected', 1136.15, 1136.15, 1136.60);
retime('facial', 1734.56, 1734.56, 1734.98);
retime('can', 1751.02, 1751.02, 1751.34);
retime('expressions.', 1763.06, 1763.06, 1763.64);
// ("Python-based" 294.82-296.28 and the spoken URL 774.10-776.33 are genuinely long: iso heard them the same)
// 1c. mid-length tokens (0.75-1.2s) hiding sub-second pauses (iso-midtokens.txt)
retime('can,', 112.38, 112.38, 112.50);
retime('down.', 139.36, 139.36, 139.66);
retime('of', 569.01, 569.01, 569.24);
retime('and', 618.37, 618.37, 618.60);
retime('like', 787.56, 787.56, 787.72);
retime('here.', 835.44, 835.44, 835.68);
retime('connection.', 852.70, 852.70, 853.16);
retime('you.', 1014.56, 1014.56, 1014.75);
retime('rigged,', 1067.22, 1067.22, 1067.66);

// 2. zero-content tokens
const before = W.length;
W = W.filter(w => w.type !== 'word' || /[a-z0-9]/i.test(w.text));
log.push(`dropped ${before - W.length} zero-content token(s)`);

// 3. protect windows (source seconds) — injected as [CLIP] word tokens, stripped after cut-silences
const words = W.filter(w => w.type === 'word');
const after = (text, start) => { const w = words.find(w => w.text === text && Math.abs(w.start - start) < 0.05); if (!w) throw new Error('anchor ' + text); return w.end + 0.01; };
const P = [
  { start: after('objects.', 115.20), end: 121.70, label: 'intro: pickup demo after "pick up objects." (hand lifts the ball 114.5-117.5, face 118, zoom-out 118.5, places it down 119-121.5)' },
  { start: after('up.', 176.64), end: 178.00, label: 'intro: stand-up completes after "stand right back up." (rises 176-177)' },
  { start: after('Astra.', 230.02), end: 231.60, label: 'intro: walk-cycle tail after "walking all with GPT 6 Astra."' },
  { start: after('cliff.', 369.99), end: 374.60, label: 'intro: cliff reveal after "then it shows the actual cliff." (grass 368.5-372, cliff wall 372.5-373.5, back to the boy 374.5)' },
  { start: after('watch.', 2419.91), end: 2452.55, label: 'Backrooms final output: fullscreen from 2421, audio 2423.0-2452.4 (he unmuted so viewers hear it), cut-to-black ending' },
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
