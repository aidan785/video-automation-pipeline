// Final cut list from the rendered-truth (frame-snapped) EDL: every deleted source range of TODAYY2.mov with the editorial reason
// where a mistake cut / round-2 fix overlaps. usage: node _cutlist-final.mjs <snapped-edl.json> <out.md> <introSeconds>
import fs from 'node:fs';
const [edlPath, outPath, introS] = process.argv.slice(2);
const e = JSON.parse(fs.readFileSync(edlPath, 'utf8'));
const tc = s => `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, '0')}`;
const reasons = [];
for (const m of fs.readFileSync('assets/clean-v1.cutlist.md', 'utf8').matchAll(/src (\d+):([\d.]+) - (\d+):([\d.]+) \([\d.]+s\)\s+(.*)/g)) reasons.push({ s: +m[1] * 60 + +m[2], e: +m[3] * 60 + +m[4], r: m[5].trim() });
const cuts = JSON.parse(fs.readFileSync('assets/approved-cuts.json', 'utf8')).cuts;
reasons.forEach((r, i) => { if (cuts[i]) r.r = `"${cuts[i].removes.replace(/\s+/g, ' ').slice(0, 90)}${cuts[i].removes.length > 90 ? '…' : ''}" (${r.r})`; });
reasons.push({ s: 1102.03, e: 1102.77, r: '"So I\'m really ha-" (hidden restart, found in the fresh-transcript read; round 2)' });
const rows = e.delete_ranges.map((d, i) => {
  const hits = reasons.filter(r => r.s < d.end - 0.05 && r.e > d.start + 0.05).map(r => r.r);
  const kind = hits.length ? 'cut' : (d.end - d.start >= 2 ? 'silence/wait' : 'pause');
  return `${String(i + 1).padStart(3)}. ${tc(d.start)} - ${tc(d.end)} (${(d.end - d.start).toFixed(2)}s)  ${kind}${hits.length ? ': ' + [...new Set(hits)].join(' · ') : ''}`;
});
const total = e.delete_ranges.reduce((a, d) => a + d.end - d.start, 0);
const prot = JSON.parse(fs.readFileSync('assets/protect-clips.json', 'utf8'));
const out = `# I Let Claude Run Blender For A Day: final cut list (2026-10-07)\n\nFinal file = intro (${tc(+introS)}, from video-projects/claude-blender-full-day) + tutorial cut. Timecodes below are SOURCE timecodes in TODAYY2.mov (29:17.0).\nTutorial: ${tc(e.source_duration)} -> ${tc(e.edited_duration)}. ${e.delete_ranges.length} deleted ranges (${tc(total)} removed), ${e.keep_ranges.length} kept segments, every boundary on a frame.\n"cut" = editorial (retake / false start / filler / note to self); "silence/wait" = dead air of 2s or more trimmed to a breath; "pause" = shorter pause trimmed to a breath.\n\nSilent beats kept on purpose:\n${prot.map(p => `- ${tc(p.start)} - ${tc(p.end)}: ${p.label}`).join('\n')}\n\n${rows.join('\n')}\n`;
fs.writeFileSync(outPath, out);
console.log(`${e.delete_ranges.length} ranges, ${tc(total)} removed, ${rows.filter(r => r.includes(' cut: ')).length} editorial rows -> ${outPath}`);
