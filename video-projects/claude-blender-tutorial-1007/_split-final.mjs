// Split the fresh transcript of the assembled final into intro + tutorial (tutorial words shifted to start at 0), so the
// tutorial part can be verified against its own EDL. usage: node _split-final.mjs <final.fresh.json> <introSeconds> <tutorial-out.json>
import fs from 'node:fs';
const [p, introS, out] = process.argv.slice(2); const T = +introS;
const t = JSON.parse(fs.readFileSync(p, 'utf8'));
const intro = t.words.filter(w => w.type === 'word' && w.start < T - 0.05);
const tut = t.words.filter(w => w.start >= T - 0.05).map(w => ({ ...w, start: +(Math.max(0, w.start - T)).toFixed(3), end: +(w.end - T).toFixed(3) }));
const tw = tut.filter(w => w.type === 'word');
fs.writeFileSync(out, JSON.stringify({ language_code: t.language_code, text: tw.map(w => w.text).join(' '), words: tut, audio_duration_secs: +(t.audio_duration_secs - T).toFixed(3) }));
console.log(`intro: ${intro.length} words, last "${intro.at(-1)?.text}" ends ${intro.at(-1)?.end.toFixed(2)} | tutorial: ${tw.length} words, first "${tw[0].text}" at ${(tw[0].start + T).toFixed(2)} (join gap ${(tw[0].start + T - intro.at(-1).end).toFixed(2)}s)`);
console.log('INTRO TEXT: ' + intro.map(w => w.text).join(' '));
