// Print a 10ms source-audio RMS strip around each cut boundary whose margin to the neighbouring word is tight.
// usage: node _join-rms.mjs [maxMargin=0.05]
import fs from 'node:fs';
const MAXM = +(process.argv[2] ?? 0.05);
const cuts = JSON.parse(fs.readFileSync('assets/approved-cuts.json', 'utf8')).cuts;
const words = JSON.parse(fs.readFileSync('assets/source.silence-transcript.json', 'utf8')).words.filter(w => w.type !== 'spacing' && /\S/.test(w.text));
const edl = JSON.parse(fs.readFileSync('assets/source.silence-edl.json', 'utf8'));
let acc = 0; const segs = edl.keep_ranges.map(k => { const s = { srcStart: k.start, edStart: acc, edEnd: acc + (k.end - k.start) }; acc = s.edEnd; return s; });
const toSrc = t => { const s = segs.find(s => t >= s.edStart - 1e-6 && t <= s.edEnd + 1e-6); return s.srcStart + (t - s.edStart); };
const wav = fs.readFileSync('assets/source.wav'); const dataAt = wav.indexOf(Buffer.from('data')) + 8;
const pcm = new Int16Array(wav.buffer, wav.byteOffset + dataAt, Math.floor((wav.length - dataAt) / 2));
const rms = f => { let s = 0; const a = f * 160; for (let i = a; i < a + 160; i++) s += pcm[i] * pcm[i]; return Math.round(10 * Math.log10(s / 160 / (32768 * 32768) + 1e-12)); };
const strip = (c, marks) => { let o = ''; for (let f = Math.round((c - 0.25) * 100); f <= Math.round((c + 0.25) * 100); f++) { const t = f / 100; const m = marks.filter(m => Math.abs(m.t - t) < 0.005).map(m => m.l).join(''); o += (m ? `[${m}]` : ' ') + (-rms(f)); } return o; };
for (const c of cuts) {
  const iF = words.findIndex(w => w.start >= c.start - 0.04 && w.end > c.start + 0.001 && w.start < c.end);
  let iL = iF; while (iL + 1 < words.length && words[iL + 1].end <= c.end + 0.04 && words[iL + 1].start < c.end - 0.001) iL++;
  const prev = words[iF - 1], first = words[iF], last = words[iL], next = words[iL + 1];
  const mS = prev ? first.start - prev.end : 9, mE = next ? next.start - last.end : 9;
  if (mS >= 0.15 && mE >= 0.15) continue;
  console.log(`\n== ${c.removes.slice(0, 60)} | src ${toSrc(c.start).toFixed(2)}-${toSrc(c.end).toFixed(2)} | prev "${prev?.text}" first "${first.text}" last "${last.text}" next "${next?.text}" gaps ${mS.toFixed(2)}/${mE.toFixed(2)}`);
  if (mS < 0.15 && prev) console.log(' START ' + strip(toSrc(c.start), [{ t: +toSrc(prev.end).toFixed(2), l: 'pe' }, { t: +toSrc(first.start).toFixed(2), l: 'fs' }, { t: +toSrc(c.start).toFixed(2), l: 'CUT' }]) + `  (center ${toSrc(c.start).toFixed(2)})`);
  if (mE < 0.15 && next) console.log(' END   ' + strip(toSrc(c.end), [{ t: +toSrc(last.end).toFixed(2), l: 'le' }, { t: +toSrc(next.start).toFixed(2), l: 'ns' }, { t: +toSrc(c.end).toFixed(2), l: 'CUT' }]) + `  (center ${toSrc(c.end).toFixed(2)})`);
}
