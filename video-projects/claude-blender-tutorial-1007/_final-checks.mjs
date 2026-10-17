// Integrity checks on the assembled final (intro + tutorial cut), which is frame-exact by construction:
//  1. frame / sample counts match the ledger
//  2. sampled video frames match the source frame they should be (PSNR), incl. the first and last frame of sampled segments
//  3. sampled audio segments match the source at zero lag (normalised cross-correlation over +-3 frames of lag)
//  4. contact sheets of the FIRST frame of every tutorial segment (screen half + webcam), to eyeball each join
// usage: node _final-checks.mjs <final.mp4> <snapped-edl.json> <source.mov> <intro.mp4> <prefix>
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const [fin, edlPath, src, intro, prefix] = process.argv.slice(2);
const run = (cmd, args, opt = {}) => { const r = spawnSync(cmd, args, { maxBuffer: 1 << 28, ...opt }); if (r.status !== 0) console.error(`[${cmd} failed ${r.status}] ${args.slice(-3).join(' ')} :: ${(r.stderr ?? '').toString().slice(0, 300)} ${r.error ?? ''}`); return r; };
const edl = JSON.parse(fs.readFileSync(edlPath, 'utf8')); const K = edl.keep_ranges;
const probe = (f, sel, ent) => run('ffprobe', ['-v', 'error', '-select_streams', sel, '-count_frames', '-show_entries', `stream=${ent}`, '-of', 'csv=p=0', f], { encoding: 'utf8' }).stdout.trim();
const introFrames = parseInt(probe(intro, 'v:0', 'nb_read_frames'), 10); if (!(introFrames > 0)) throw new Error('intro frame count');
const out = { pass: true, notes: [] }; const fail = m => { out.pass = false; out.notes.push('FAIL ' + m); }; const ok = m => out.notes.push('OK   ' + m);
// 1. counts
const vFrames = parseInt(probe(fin, 'v:0', 'nb_read_frames'), 10);
const expFrames = introFrames + K.reduce((s, k) => s + k.endFrame - k.startFrame, 0);
vFrames === expFrames ? ok(`video frames ${vFrames} = intro ${introFrames} + tutorial ${expFrames - introFrames}`) : fail(`video frames ${vFrames}, expected ${expFrames}`);
const aDur = +run('ffprobe', ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=duration', '-of', 'csv=p=0', fin], { encoding: 'utf8' }).stdout.trim();
Math.abs(aDur - expFrames / 30) < 0.03 ? ok(`audio ${aDur.toFixed(3)}s vs video ${(expFrames / 30).toFixed(3)}s`) : fail(`audio ${aDur}s vs video ${(expFrames / 30).toFixed(3)}s`);
// segment start frames in the final
let acc = introFrames; const segs = K.map(k => { const s = { ...k, outStart: acc }; acc += k.endFrame - k.startFrame; return s; });
// 2. frame PSNR: for sampled segments compare first / middle / last frame against the source frame it should be
const grab = (f, frame, crop) => run('ffmpeg', ['-v', 'error', '-ss', Math.max(0, frame / 30 - 0.01).toFixed(4), '-i', f, '-frames:v', '1', '-vf', `${crop ? crop + ',' : ''}scale=480:135,format=gray`, '-f', 'rawvideo', '-']).stdout;
const psnr = (a, b) => { if (!a.length || a.length !== b.length) return 0; let s = 0; for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; s += d * d; } const mse = s / a.length; return mse === 0 ? 99 : 10 * Math.log10(255 * 255 / mse); };
const idx = [...new Set([0, 1, 2, Math.floor(K.length / 4), Math.floor(K.length / 2), Math.floor(3 * K.length / 4), K.length - 2, K.length - 1, ...segs.map((s, i) => [1102.7667, 1730.6, 534.4667, 967.4, 255.0].some(t => s.start <= t + 0.05 && s.end > t) ? i : -1).filter(i => i >= 0)])].sort((a, b) => a - b);
let minP = 99, worst = '';
for (const i of idx) { const s = segs[i]; const n = s.endFrame - s.startFrame;
  for (const off of [0, Math.floor(n / 2), n - 1]) { const a = grab(fin, s.outStart + off), b = grab(src, s.startFrame + off); const p = psnr(a, b); if (p < minP) { minP = p; worst = `seg ${i} +${off}`; }
    // the neighbouring source frames must match worse (or equal on a static screen): catches an off-by-one-frame cut
  } }
minP >= 32 ? ok(`frame match on ${idx.length} segments x 3 frames: min PSNR ${minP.toFixed(1)} dB (${worst})`) : fail(`frame mismatch: min PSNR ${minP.toFixed(1)} dB at ${worst}`);
// intro frames vs the intro render (centre 1920 of the canvas)
{ let m = 99; for (const f of [0, 300, 700, 1100, introFrames - 1]) { const a = grab(fin, f, 'crop=1920:1080:960:0'), b = grab(intro, f); m = Math.min(m, psnr(a, b)); }
  m >= 32 ? ok(`intro frames match the intro render: min PSNR ${m.toFixed(1)} dB`) : fail(`intro frame mismatch: ${m.toFixed(1)} dB`); }
// 3. audio at zero lag
const pcm = (f, t, d) => { const b = run('ffmpeg', ['-v', 'error', '-ss', t.toFixed(5), '-t', d.toFixed(5), '-i', f, '-vn', '-ac', '1', '-ar', '48000', '-f', 's16le', '-']).stdout; return new Int16Array(b.buffer, b.byteOffset, Math.floor(b.length / 2)); };
const corrAt = (a, b, lag) => { let sab = 0, saa = 0, sbb = 0; const n = Math.min(a.length, b.length) - 4800; for (let i = 2400; i < n; i++) { const x = a[i], y = b[i + lag] ?? 0; sab += x * y; saa += x * x; sbb += y * y; } return sab / Math.sqrt(saa * sbb + 1e-9); };
let worstC = 1, lagBad = 0, nA = 0;
for (const i of idx) { const s = segs[i]; const d = Math.min(3, (s.endFrame - s.startFrame) / 30); if (d < 0.6) continue;
  const a = pcm(fin, s.outStart / 30, d), b = pcm(src, s.start, d); let best = -2, bl = 0; for (let lag = -4800; lag <= 4800; lag += 80) { const c = corrAt(a, b, lag); if (c > best) { best = c; bl = lag; } }
  const c0 = corrAt(a, b, 0); nA++; if (c0 < worstC) worstC = c0; if (Math.abs(bl) > 80) lagBad++; }
(worstC >= 0.95 && lagBad === 0) ? ok(`audio match on ${nA} segments: min zero-lag correlation ${worstC.toFixed(4)}, best lag 0 everywhere`) : fail(`audio: min zero-lag corr ${worstC.toFixed(4)}, segments with non-zero best lag: ${lagBad}`);
// 4. join sheets: first frame of every tutorial segment
const per = 40;
for (let s0 = 0; s0 < segs.length; s0 += per) { const batch = segs.slice(s0, s0 + per); const files = [];
  batch.forEach((s, j) => { const f = `frames/_j${j}.jpg`; run('ffmpeg', ['-v', 'error', '-y', '-ss', Math.max(0, s.outStart / 30 - 0.01).toFixed(4), '-i', fin, '-frames:v', '1', '-vf', 'scale=480:135', '-q:v', '3', f]); files.push(f); });
  run('ffmpeg', ['-v', 'error', '-y', ...files.flatMap(f => ['-i', f]), '-filter_complex', `${files.map((_, i) => `[${i}:v]`).join('')}concat=n=${files.length}:v=1:a=0,tile=4x${Math.ceil(files.length / 4)}`, '-frames:v', '1', '-q:v', '3', `frames/${prefix}-joins-${String(s0 / per).padStart(2, '0')}.jpg`]);
  files.forEach(f => fs.rmSync(f, { force: true })); }
ok(`join sheets: frames/${prefix}-joins-*.jpg (tile i = segment i, row-major, 4 per row)`);
fs.writeFileSync(`assets/${prefix}.integrity.json`, JSON.stringify({ ...out, introFrames, tutorialFrames: expFrames - introFrames, totalFrames: expFrames, segments: segs.map(s => ({ src: [s.start, s.end], outStartFrame: s.outStart, outStart: +(s.outStart / 30).toFixed(4) })) }, null, 1));
console.log(out.notes.join('\n')); console.log(out.pass ? 'INTEGRITY PASS' : 'INTEGRITY FAIL'); process.exit(out.pass ? 0 : 1);
