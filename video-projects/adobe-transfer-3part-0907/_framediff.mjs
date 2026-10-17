// Per-second frame-diff of the SCREEN half (left 1920x1080) — finds silent windows where the screen is animating
// (demo playbacks that need [CLIP] protection) vs static (dead waits). Output: assets/framediff-per-sec.json
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
const W = 160, H = 90;
const r = spawnSync('ffmpeg', ['-v', 'error', '-i', 'assets/source.mov', '-vf', `crop=1920:1080:0:0,fps=1,scale=${W}:${H},format=gray`, '-f', 'rawvideo', '-'], { maxBuffer: 1 << 30 });
if (r.status !== 0) { console.error(r.stderr.toString()); process.exit(1); }
const buf = r.stdout; const n = Math.floor(buf.length / (W * H));
const out = [];
for (let i = 1; i < n; i++) {
  let s = 0; const a = i * W * H, b = (i - 1) * W * H;
  for (let p = 0; p < W * H; p++) s += Math.abs(buf[a + p] - buf[b + p]);
  out.push({ t: i, diff: +(s / (W * H)).toFixed(2) });
}
fs.writeFileSync('assets/framediff-per-sec.json', JSON.stringify(out));
const moving = out.filter(x => x.diff > 2).length;
console.log(`frames ${n}; seconds with screen motion (>2.0 mean abs diff): ${moving}`);
