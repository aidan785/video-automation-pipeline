// Final cut list from the rendered-truth union EDL: every deleted source range, with per-source-file timecodes
// (1.mov 0-1988.20, 2.mov 1988.20-2330.83, 3.mov 2330.83-end) and the editorial reason where a mistake cut / round-2/3 fix overlaps.
import fs from 'node:fs';
const e = JSON.parse(fs.readFileSync('assets/clean-v1.union-edl.json', 'utf8'));
const FILES = [['1.mov', 0, 1988.20], ['2.mov', 1988.20, 2330.833], ['3.mov', 2330.833, 2536.533]];
const tc = s => `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, '0')}`;
const fileTc = t => { const f = FILES.find(f => t >= f[1] && t < f[2]) ?? FILES[2]; return `${f[0]} ${tc(t - f[1])}`; };
// reasons: v1 mistake cuts (source coords) from the v1 cutlist + round-2/3 fixes
const reasons = [];
for (const m of fs.readFileSync('assets/clean-v1.cutlist.md', 'utf8').matchAll(/src (\d+):([\d.]+) - (\d+):([\d.]+) \([\d.]+s\)\s+(.*)/g)) reasons.push({ s: +m[1] * 60 + +m[2], e: +m[3] * 60 + +m[4], r: m[5].trim() });
for (const f of ['assets/flubs-v2.json', 'assets/flubs-v3.json']) for (const x of JSON.parse(fs.readFileSync(f, 'utf8'))) reasons.push({ s: x.start, e: x.end, r: x.reason.split(':')[0].replace(/^'|'$/g, '') + ' (round ' + (f.includes('v3') ? 3 : 2) + ')' });
reasons.push({ s: 175.37, e: 176.80, r: 'drop "And then stand right back up." (round 2)' }, { s: 1073.04, e: 1073.46, r: 'drop clipped "ri-" fragment, first "rigged," restored (round 2)' });
const rows = e.delete_ranges.map((d, i) => {
  const hits = reasons.filter(r => r.s < d.end - 0.05 && r.e > d.start + 0.05).map(r => r.r);
  const kind = hits.length ? 'cut' : (d.end - d.start >= 2 ? 'silence/wait' : 'pause');
  return `${String(i + 1).padStart(3)}. src ${tc(d.start)} - ${tc(d.end)} (${(d.end - d.start).toFixed(2)}s)  [${fileTc(d.start)} -> ${fileTc(d.end)}]  ${kind}${hits.length ? ': ' + [...new Set(hits)].join(' · ') : ''}`;
});
const total = e.delete_ranges.reduce((a, d) => a + d.end - d.start, 0);
const out = `# GPT-6 Astra Blender Animation Tutorial — final cut list (2026-09-07)\n\nSource: Adobe Transfer Folder 1.mov + 2.mov + 3.mov concatenated (42:16.5). Final: 15:00.8 (EDL ${tc(e.edited_duration)} + concat frame padding). ${e.delete_ranges.length} deleted ranges (${tc(total)} removed), ${e.keep_ranges.length} kept segments.\n"cut" = editorial (mistake / retake / filler / phone call); "silence/wait" = dead air ≥ 2s trimmed to a breath; "pause" = inter-word pause trimmed to a breath.\nIntentional silent beats kept on purpose: pickup demo 1:55.6-2:01.7, stand-up 2:56.8-2:57.9, walk tail 3:50.3-3:51.5, cliff reveal 6:10.3-6:14.6, Backrooms playback with audio 40:20.3-40:52.5 (all 1.mov timecodes).\n\n${rows.join('\n')}\n`;
fs.writeFileSync('assets/clean-v3.cutlist.md', out);
console.log(`${e.delete_ranges.length} ranges, ${tc(total)} removed -> assets/clean-v3.cutlist.md`);
console.log(rows.filter(r => r.includes('cut:')).length, 'editorial rows');
