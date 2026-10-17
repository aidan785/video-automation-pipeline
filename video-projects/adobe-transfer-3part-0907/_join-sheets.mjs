// Contact sheets of the frame right AFTER every join in a rendered cut (edited-timeline), to eyeball for private
// content / wrong scene at each cut point. usage: node _join-sheets.mjs <render.mp4> <union-edl.json> <prefix>
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
const [video, edlPath, prefix] = process.argv.slice(2);
const e = JSON.parse(fs.readFileSync(edlPath, 'utf8'));
let acc = 0; const joins = [];
for (const k of e.keep_ranges) { joins.push(acc); acc += k.end - k.start; }
// drift: ~5.4ms per join; sample 0.25s after each join start so the frame is inside the new segment even with drift
const per = 40;
for (let s = 0; s < joins.length; s += per) {
  const batch = joins.slice(s, s + per);
  const files = [];
  batch.forEach((t, i) => {
    const f = `frames/_j${s + i}.png`;
    spawnSync('ffmpeg', ['-v', 'error', '-y', '-ss', (t + 0.25 + (s + i) * 0.0054).toFixed(3), '-i', video, '-frames:v', '1', '-vf', 'scale=384:108', f]);
    files.push(f);
  });
  const inputs = files.flatMap(f => ['-i', f]);
  const n = files.length;
  spawnSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', `${files.map((_, i) => `[${i}:v]`).join('')}concat=n=${n}:v=1:a=0,tile=5x${Math.ceil(n / 5)}`, '-frames:v', '1', `frames/${prefix}-joins-${String(s / per).padStart(2, '0')}.png`]);
  files.forEach(f => fs.unlinkSync(f));
}
console.log(`${joins.length} joins -> frames/${prefix}-joins-*.png (tile i = join ${0}+i, edited t listed below)`);
console.log(joins.map((t, i) => `${i}:${t.toFixed(1)}`).join(' '));
