// Isolate-transcribe source slices with Scribe. usage: node _iso.mjs <name> <start> <end> [ctx=0.7]
// Extracts the slice (with +-ctx seconds of neighbour context) from assets/source.mp3 -> assets/iso/<name>.mp3,
// transcribes it, and prints the words heard with source-mapped timestamps. One slice per call (never stitch slices).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
const [name, s, e, c] = process.argv.slice(2);
const start = +s, end = +e, ctx = c != null ? +c : 0.7;
const a = Math.max(0, start - ctx), b = end + ctx;
const mp3 = `assets/iso/${name}.mp3`, json = `assets/iso/${name}.json`;
if (!fs.existsSync(json)) {
  let r = spawnSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(a), '-t', String(b - a), '-i', (process.env.ISO_AUDIO ?? 'assets/source.mp3'), '-c:a', 'libmp3lame', '-b:a', '64k', mp3]);
  if (r.status !== 0) { console.error(r.stderr.toString()); process.exit(1); }
  r = spawnSync('node', ['../../scripts/transcribe-elevenlabs.mjs', mp3, '--output', json, '--no-diarize'], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(r.stdout, r.stderr); process.exit(1); }
}
const t = JSON.parse(fs.readFileSync(json, 'utf8'));
const W = t.words.filter(w => w.type === 'word').map(w => ({ text: w.text, start: +(w.start + a).toFixed(2), end: +(w.end + a).toFixed(2) }));
const fmt = x => `${Math.floor(x / 60)}:${(x % 60).toFixed(2).padStart(5, '0')}`;
console.log(`[${name}] ${fmt(start)}-${fmt(end)} (+-${ctx}) -> ${W.length ? W.map(w => `${w.text}@${w.start.toFixed(2)}-${w.end.toFixed(2)}`).join(' ') : '(no words)'}`);
