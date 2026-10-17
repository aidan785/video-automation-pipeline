// Final assembly in ONE encode from the originals: finished intro (1920x1080, centred on the 3840x1080 OBS canvas exactly where
// the raw intro recording sat) + the tutorial cut (keep ranges of the union EDL, straight from the source recording).
// usage: node _assemble.mjs <intro.mp4> <union-edl.json> <source.mov> <out.mp4> [--apply]
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const [intro, edlPath, src, out] = process.argv.slice(2);
const apply = process.argv.includes('--apply');
const edl = JSON.parse(fs.readFileSync(edlPath, 'utf8'));
const K = edl.keep_ranges;
if (!K.every(k => Number.isInteger(k.startFrame) && Number.isInteger(k.endFrame))) throw new Error('expects a frame-snapped EDL (_snap-edl.mjs)');
const pr = spawnSync('ffprobe', ['-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', intro], { encoding: 'utf8' });
const introFrames = parseInt(pr.stdout.trim(), 10); if (!(introFrames > 0)) throw new Error('could not count intro frames');
const L = [];
L.push(`[0:v]fps=30,scale=1920:1080:flags=lanczos,setsar=1,pad=3840:1080:960:0:black,format=yuv420p,setpts=PTS-STARTPTS[iv];`);
L.push(`[0:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,apad,atrim=end_sample=${introFrames * 1600},asetpts=PTS-STARTPTS[ia];`);
K.forEach((k, i) => {
  // frame-exact: video by frame index, audio by sample index (1600 samples per frame at 48 kHz), so both streams of a segment match
  L.push(`[1:v]trim=start_frame=${k.startFrame}:end_frame=${k.endFrame},setpts=PTS-STARTPTS[v${i}];`);
  L.push(`[1:a]atrim=start_sample=${k.startFrame * 1600}:end_sample=${k.endFrame * 1600},asetpts=PTS-STARTPTS[a${i}];`);
});
L.push(K.map((_, i) => `[v${i}][a${i}]`).join('') + `concat=n=${K.length}:v=1:a=1[mv0][ma0];`);
L.push(`[mv0]format=yuv420p,setsar=1[mv];[ma0]aformat=sample_fmts=fltp:channel_layouts=stereo[ma];`);
L.push(`[iv][ia][mv][ma]concat=n=2:v=1:a=1[v][a]`);
const filt = out.replace(/\.mp4$/, '.filter.txt');
fs.writeFileSync(filt, L.join('\n'));
const args = ['-y', '-i', intro, '-i', src, '-/filter_complex', filt, '-map', '[v]', '-map', '[a]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-g', '30', '-keyint_min', '30', '-sc_threshold', '0', '-pix_fmt', 'yuv420p',
  '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv',
  '-fps_mode', 'cfr', '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', out];
const frames = K.reduce((s, k) => s + k.endFrame - k.startFrame, 0);
console.log(JSON.stringify({ introFrames, keepRanges: K.length, tutorialFrames: frames, totalFrames: introFrames + frames, totalSeconds: +((introFrames + frames) / 30).toFixed(3), filter: filt }));
console.log('ffmpeg ' + args.join(' '));
if (apply) { const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-stats', ...args], { stdio: 'inherit' }); process.exit(r.status ?? 1); }
