// Snap every keep boundary of a union EDL to the 30 fps frame grid, so each kept segment has exactly matching video and audio
// lengths (no concat padding, constant frame rate, zero A/V offset inside every segment).
// Per boundary the two neighbouring grid points are compared on source-audio level (see snap()).
// usage: node _snap-edl.mjs <in-edl.json> <out-edl.json>
import fs from 'node:fs';
const [inp, outp] = process.argv.slice(2);
const e = JSON.parse(fs.readFileSync(inp, 'utf8'));
const wav = fs.readFileSync('assets/source.wav'); const dataAt = wav.indexOf(Buffer.from('data')) + 8;
const pcm = new Int16Array(wav.buffer, wav.byteOffset + dataAt, Math.floor((wav.length - dataAt) / 2));
const db = t => { const c = Math.round(t * 16000); let s = 0, n = 0; for (let i = c - 160; i < c + 160; i++) if (i >= 0 && i < pcm.length) { s += pcm[i] * pcm[i]; n++; } return 10 * Math.log10(s / Math.max(n, 1) / (32768 * 32768) + 1e-12); };
const FPS = 30, QUIET = -42;
const stats = { earlier: 0, later: 0, quieter: 0, nearest: 0, exact: 0 };
function snap(b, isStart) {
  const lo = Math.floor(b * FPS + 1e-6) / FPS, hi = Math.ceil(b * FPS - 1e-6) / FPS;
  if (hi - lo < 1e-9) { stats.exact++; return lo; }
  // both boundaries prefer the EARLIER grid point when it is quiet: a keep start gains pre-roll (protects the onset) and a keep end
  // gives the same amount back, so pauses keep the length the silence pass chose. Not quiet there: the later point if quiet,
  // else the clearly quieter of the two, else the nearest.
  if (db(lo) <= QUIET) { stats.earlier++; return lo; }
  if (db(hi) <= QUIET) { stats.later++; return hi; }
  if (Math.abs(db(lo) - db(hi)) >= 4) { stats.quieter++; return db(lo) < db(hi) ? lo : hi; }
  // sound on both sides (words run together): shave the kept segment rather than let a sliver of the removed word in
  stats.nearest++; return isStart ? hi : lo;
}
const total = Math.floor(e.source_duration * FPS) / FPS;
const K = e.keep_ranges.map(k => ({ start: snap(k.start, true), end: Math.min(snap(k.end, false), total) }));
for (let i = 0; i < K.length; i++) {
  if (i && K[i].start < K[i - 1].end - 1e-9) throw new Error(`overlap after snap at ${K[i].start}`);
  if (K[i].end - K[i].start < 0.3 - 1e-9) throw new Error(`sliver after snap ${JSON.stringify(K[i])}`);
}
const r = x => Math.round(x * FPS) / FPS;
const frames = K.reduce((s, k) => s + Math.round((k.end - k.start) * FPS), 0);
const D = []; let p = 0; for (const k of K) { if (k.start > p + 1e-9) D.push({ start: p, end: k.start }); p = k.end; }
if (e.source_duration > p + 1e-9) D.push({ start: p, end: e.source_duration });
const maxShift = Math.max(...K.map((k, i) => Math.max(Math.abs(k.start - e.keep_ranges[i].start), Math.abs(k.end - e.keep_ranges[i].end))));
fs.writeFileSync(outp, JSON.stringify({ source_duration: e.source_duration, fps: FPS, frames, edited_duration: +(frames / FPS).toFixed(4), keep_ranges: K.map(k => ({ start: +r(k.start).toFixed(6), end: +r(k.end).toFixed(6), startFrame: Math.round(k.start * FPS), endFrame: Math.round(k.end * FPS) })), delete_ranges: D.map(d => ({ start: +d.start.toFixed(6), end: +d.end.toFixed(6) })) }, null, 2));
console.log(JSON.stringify({ keeps: K.length, frames, edited: +(frames / FPS).toFixed(3), maxShiftMs: Math.round(maxShift * 1000), ...stats }));
