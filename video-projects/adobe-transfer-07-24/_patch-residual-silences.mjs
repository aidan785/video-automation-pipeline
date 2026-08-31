#!/usr/bin/env node
// Round-2 fix after verify-cuts FAIL: residual dead air survived because Scribe
// stretched tokens across pauses (sub-3s stretches missed by the first clamp).
// Ground truth: ffmpeg silencedetect on the SOURCE audio (assets/source-silences.txt,
// -30dB d=0.6). Everything is computed in source coords — no rendered-timeline
// mapping, so the concat frame-rounding drift (~0.9s over 162 joins) can't skew
// the cuts. Each kept range that still contains >=0.6s of continuous source
// silence is trimmed to a breath; two residual flubs are cut by word timestamps;
// MIN_KEEP bridges slivers; re-render from the ORIGINAL source in one pass.
// Emits assets/final-union-edl.json for verify-cuts' ledger sweep.
//
// usage: node _patch-residual-silences.mjs [--apply]

import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const SRC = '/Users/aidanstanik/Projects/Adobe Transfer Folder/2026-07-24 16-53-41.mov';
const OUT = 'assets/clean.mp4';
const apply = process.argv.includes('--apply');

// residual flubs, SOURCE coords (from raw-transcript word timestamps)
const FLUB_DELETES = [
  { start: 60.40, end: 66.68, reason: "false start: \"it's a ...\" -> keep \"It's okay.\"" },
  { start: 1821.30, end: 1829.72, reason: 'abandoned take: stretched "So" + "So you can see like the multi-stacking." -> keep full second take' },
];

// source silences: "<start> <end>" per line
const silences = fs.readFileSync('assets/source-silences.txt', 'utf8').trim().split('\n')
  .map(l => l.trim().split(/\s+/).map(Number)).map(([s, e]) => ({ start: s, end: e }));

// v1 final keep ranges (source coords) from the render's filtergraph
const filter = fs.readFileSync('assets/clean.filter.txt', 'utf8');
const keeps = [...filter.matchAll(/\[0:v\]trim=start=([\d.]+):end=([\d.]+)/g)]
  .map(m => ({ start: +m[1], end: +m[2] }));
console.log(`v1 keeps: ${keeps.length}, silences: ${silences.length}`);

// trim any >=0.6s silence overlap inside a keep down to a breath
const lastKeepEnd = keeps[keeps.length - 1].end;
const deletions = [...FLUB_DELETES.map(f => ({ start: f.start, end: f.end }))];
for (const k of keeps) {
  for (const s of silences) {
    const lo = Math.max(s.start, k.start), hi = Math.min(s.end, k.end);
    if (hi - lo < 0.6) continue;
    const isTail = Math.abs(hi - lastKeepEnd) < 0.05;
    const ds = lo + (isTail ? 0.30 : 0.12);
    const de = isTail ? hi : hi - 0.10;
    if (de - ds > 0.15) deletions.push({ start: ds, end: de });
  }
}
deletions.sort((a, b) => a.start - b.start);

// subtract deletions from keeps, MIN_KEEP sliver bridge
const MIN_KEEP = 0.3;
let finalKeeps = [];
for (const k of keeps) {
  let cursor = k.start;
  for (const d of deletions) {
    if (d.end <= k.start || d.start >= k.end) continue;
    if (d.start > cursor) finalKeeps.push({ start: cursor, end: Math.min(d.start, k.end) });
    cursor = Math.max(cursor, d.end);
  }
  if (cursor < k.end) finalKeeps.push({ start: cursor, end: k.end });
}
finalKeeps = finalKeeps.filter(k => k.end - k.start >= MIN_KEEP);

const outDur = finalKeeps.reduce((a, k) => a + (k.end - k.start), 0);
console.log(JSON.stringify({
  deletions: deletions.length,
  finalKeepRanges: finalKeeps.length,
  finalDuration: +outDur.toFixed(2),
}, null, 2));

// final union EDL (source coords) for verify-cuts' ledger sweep
const srcDur = 2335.9133125;
const unionDeletes = [];
let cur = 0;
for (const k of finalKeeps) {
  if (k.start > cur + 0.001) unionDeletes.push({ start: cur, end: k.start });
  cur = k.end;
}
if (cur < srcDur - 0.001) unionDeletes.push({ start: cur, end: srcDur });
fs.writeFileSync('assets/final-union-edl.json', JSON.stringify({
  source_duration: srcDur, edited_duration: +outDur.toFixed(3),
  keep_ranges: finalKeeps, delete_ranges: unionDeletes,
}, null, 2));

// filtergraph + render
const lines = [];
finalKeeps.forEach((k, i) => {
  lines.push(`[0:v]trim=start=${k.start.toFixed(4)}:end=${k.end.toFixed(4)},setpts=PTS-STARTPTS[v${i}];`);
  lines.push(`[0:a]atrim=start=${k.start.toFixed(4)}:end=${k.end.toFixed(4)},asetpts=PTS-STARTPTS[a${i}];`);
});
lines.push(finalKeeps.map((_, i) => `[v${i}][a${i}]`).join('') + `concat=n=${finalKeeps.length}:v=1:a=1[v][a]`);
fs.writeFileSync('assets/clean-v2.filter.txt', lines.join('\n'));

const args = ['-y', '-i', SRC, '-/filter_complex', 'assets/clean-v2.filter.txt', '-map', '[v]', '-map', '[a]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', OUT];
console.log('ffmpeg ' + args.join(' '));
if (apply) execFileSync('ffmpeg', args, { stdio: 'inherit' });
