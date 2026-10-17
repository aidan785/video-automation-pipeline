import sharp from 'sharp';
import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {once} from 'node:events';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '..');
const width = 2400, height = 660, fps = 30, duration = 8;
const platforms = [
  {id: 'unity', label: 'Unity', color: '#111111', size: 192},
  {id: 'unrealengine', label: 'Unreal Engine', color: '#111111', size: 196},
  {id: 'windows', label: 'Windows', color: '#0078D4', size: 180},
  {id: 'apple', label: 'Mac', color: '#111111', size: 182},
];
for (const p of platforms) {
  const source = await readFile(path.join(here, 'assets', `${p.id}.svg`), 'utf8');
  p.paths = [...source.matchAll(/<path\b[^>]*\bd="([^"]+)"[^>]*\/?\s*>/g)].map(m => m[1]);
  if (!p.paths.length) throw Error(`Missing paths for ${p.id}`);
}
const clamp = x => Math.max(0, Math.min(1, x));
const easeOut = x => 1 - (1 - clamp(x)) ** 3;
const easeIn = x => clamp(x) ** 3;
const spring = t => t <= 0 ? 0 : t >= 0.85 ? 1 : 1 - Math.exp(-9.5 * t) * (Math.cos(12 * t) + 9.5 / 12 * Math.sin(12 * t));

function svgAt(t, background = 'transparent') {
  const bg = background === 'checker'
    ? '<defs><pattern id="checker" width="48" height="48" patternUnits="userSpaceOnUse"><rect width="48" height="48" fill="#283039"/><path d="M0 0h24v24H0zM24 24h24v24H24z" fill="#303944"/></pattern></defs><rect width="2400" height="660" fill="url(#checker)"/>'
    : '';
  const cards = platforms.map((p, i) => {
    const local = t - 0.12 - i * 0.14;
    const entered = spring(local);
    const exiting = easeIn((t - 6.85 - i * 0.09) / 0.58);
    const opacity = easeOut(local / 0.24) * (1 - exiting);
    if (opacity <= 0) return '';
    const scale = (0.80 + 0.20 * entered) * (1 - 0.055 * exiting);
    const cx = 420 + i * 520;
    const cy = 330 + 44 * (1 - entered) + 28 * exiting;
    const size = p.size;
    return `<g opacity="${opacity.toFixed(6)}" transform="translate(${cx} ${cy.toFixed(4)}) scale(${scale.toFixed(6)})">
      <rect x="-216" y="-216" width="432" height="432" rx="68" fill="#FFFFFF" stroke="#E7E9EC" stroke-width="1.5"/>
      <g transform="translate(${-size / 2} ${-53 - size / 2}) scale(${size / 24})" fill="${p.color}">${p.paths.map(d => `<path d="${d}"/>`).join('')}</g>
      <text x="0" y="129" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${i === 1 ? 36 : 38}" font-weight="600" fill="#15171B">${p.label}</text>
    </g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${bg}${cards}</svg>`;
}

await sharp(Buffer.from(svgAt(2))).png().toFile(path.join(out, 'Aura Platform Logos - Still.png'));
await sharp(Buffer.from(svgAt(2, 'checker'))).resize(1600).png().toFile(path.join(out, 'preview-still.png'));
await writeFile(path.join(here, 'layout.svg'), svgAt(2));

if (process.argv.includes('--still')) process.exit(0);
const target = path.join(out, 'Aura Platform Logos - Transparent.mov');
const ff = spawn('/opt/homebrew/bin/ffmpeg', [
  '-hide_banner', '-loglevel', 'warning', '-y',
  '-f', 'rawvideo', '-pixel_format', 'rgba', '-video_size', `${width}x${height}`,
  '-framerate', String(fps), '-i', 'pipe:0', '-an',
  '-c:v', 'prores_ks', '-profile:v', '4', '-pix_fmt', 'yuva444p10le',
  '-alpha_bits', '16', '-vendor', 'apl0', '-threads', '4',
  '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
  '-movflags', '+faststart', target,
], {stdio: ['pipe', 'inherit', 'inherit']});
let encodingError;
ff.stdin.on('error', e => { encodingError = e; });
const completed = once(ff, 'close');
for (let f = 0; f < fps * duration; f++) {
  if (encodingError) throw encodingError;
  const rgba = await sharp(Buffer.from(svgAt(f / fps))).ensureAlpha().raw().toBuffer();
  if (!ff.stdin.write(rgba)) await once(ff.stdin, 'drain');
  if (f % 60 === 0) console.log(`Rendered ${f}/${fps * duration} frames`);
}
ff.stdin.end();
const [code] = await completed;
if (code !== 0) throw Error(`FFmpeg exited ${code}`);
console.log(target);
await writeFile(path.join(out, 'clip-info.txt'), [
  'Aura platform logos — Unity, Unreal Engine, Windows, Mac',
  'Import: Aura Platform Logos - Transparent.mov',
  '2400 x 660, 30 fps, 8 seconds, ProRes 4444 with straight alpha, no audio.',
  '0.12–1.4 s: staggered entrance. 1.4–6.85 s: hold. 6.85–7.7 s: exit.',
  'Place above your footage in Premiere. Scale and position as needed.',
  'The PNG is a transparent still for extending the hold.',
  'The preview MP4 has a checkerboard baked in for viewing only.',
  'Editable vector assets and renderer are in source/.',
].join('\n') + '\n');
