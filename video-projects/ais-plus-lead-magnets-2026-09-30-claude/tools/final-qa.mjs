#!/usr/bin/env node
// Final QA + manifest for the 10 exports (CP6). Collects the approved/final file of each deliverable into
// 09-exports/ (hard links, no extra disk) and checks every one:
//   format (size, 30 fps CFR), video = audio length, full decode clean, loudness -16 LUFS (+-1) / true peak <= -1 dBTP,
//   frame steps uniform, black frames (none allowed), frozen stretches (only the VSL end-card hold), SRT present,
//   in order, non-overlapping and inside the video.
// Writes 09-exports/MANIFEST.md + qa.json. Usage: node tools/final-qa.mjs
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, linkSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const OUT = join(ROOT, "09-exports");
mkdirSync(OUT, { recursive: true });
const P = (cp, f) => join(ROOT, "07-previews", cp, f);
const EXPORTS = [
  ["01 AD - First AI Automation Client SOP - 16x9", "cp6", "CP3 approved; CP6 re-render for the handshake icon only"],
  ["01 AD - First AI Automation Client SOP - 9x16", "cp6", "CP3 approved; CP6 re-render for the handshake icon only"],
  ["02 AD - AI OS Template - 16x9", "cp6", "CP4 approved; audio re-finished with a peak limiter (true peak was -0.9), video bit-identical"],
  ["02 AD - AI OS Template - 9x16", "cp6", "CP4 approved; audio re-finished with a peak limiter (true peak was -0.9), video bit-identical"],
  ["03 AD - Scrollcraft - 16x9", "cp6", "CP4 approved; audio re-finished with a peak limiter (true peak was -0.9), video bit-identical"],
  ["03 AD - Scrollcraft - 9x16", "cp6", "CP4 approved; audio re-finished with a peak limiter (true peak was -0.9), video bit-identical"],
  ["04 VSL - First AI Client SOP - 16x9", "cp5", "CP5 r2 approved (Skool screenshots)"],
  ["05 VSL - AI OS Template - 16x9", "cp6", "CP6: new intro + shared core A + B"],
  ["06 VSL - Scrollcraft - 16x9", "cp6", "CP6: new intro + shared core A + B"],
  ["07 VSL - Generic (free Skool join emails) - 16x9", "cp6", "CP6: new intro + core B (from the proof bridge)"],
];
const probe = (f) => JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", f], { encoding: "utf8" }));
const tc = (x) => { const [h, m, r] = x.split(":"); const [s, ms] = r.split(","); return +h * 3600 + +m * 60 + +s + +ms / 1000; };
const mmss = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, "0")}`;

const rows = [];
for (const [name, cp, status] of EXPORTS) {
  const src = P(cp, `${name}.mp4`), srt = P(cp, `${name}.srt`);
  const r = { name, source: `07-previews/${cp}`, status, fails: [] };
  if (!existsSync(src) || !existsSync(srt)) { r.fails.push("missing mp4 or srt"); rows.push(r); continue; }
  const map = P(cp, `${name} - MAP.md`);
  for (const [a, b] of [[src, join(OUT, `${name}.mp4`)], [srt, join(OUT, `${name}.srt`)], ...(existsSync(map) ? [[map, join(OUT, `${name} - MAP.md`)]] : [])]) { rmSync(b, { force: true }); linkSync(a, b); }
  const q = probe(src), v = q.streams.find((s) => s.codec_type === "video"), a = q.streams.find((s) => s.codec_type === "audio");
  r.size = `${v.width}x${v.height}`; r.fps = v.r_frame_rate; r.videoDur = +(+v.duration).toFixed(3); r.audioDur = +(+a.duration).toFixed(3);
  r.mb = +(+q.format.size / 1e6).toFixed(1);
  const vsl = name.includes(" VSL ");
  const want = name.endsWith("9x16") ? "1080x1920" : "1920x1080";
  if (r.size !== want) r.fails.push(`size ${r.size}`);
  if (r.fps !== "30/1") r.fails.push(`fps ${r.fps}`);
  if (Math.abs(r.videoDur - r.audioDur) > 0.05) r.fails.push(`A/V ${r.videoDur} vs ${r.audioDur}`);
  const dec = spawnSync("ffmpeg", ["-v", "warning", "-i", src, "-f", "null", "-"], { encoding: "utf8" });
  r.decodeClean = dec.status === 0 && !dec.stderr.trim(); if (!r.decodeClean) r.fails.push("decode warnings");
  const eb = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", src, "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  r.lufs = +eb.match(/I:\s+(-?[\d.]+) LUFS/g).pop().match(/-?[\d.]+/)[0]; r.truePeak = +eb.match(/Peak:\s+(-?[\d.]+) dBFS/g).pop().match(/-?[\d.]+/)[0];
  if (Math.abs(r.lufs + 16) > 1) r.fails.push(`loudness ${r.lufs}`);
  if (r.truePeak > -0.95) r.fails.push(`true peak ${r.truePeak}`);
  const pts = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-show_entries", "packet=pts_time", "-of", "csv=p=0", src], { encoding: "utf8" }).trim().split("\n").map(Number).sort((x, y) => x - y);
  r.frames = pts.length; r.irregularSteps = pts.slice(1).filter((t, i) => Math.abs(t - pts[i] - 1 / 30) > 0.0015).length;
  if (r.irregularSteps) r.fails.push(`${r.irregularSteps} irregular frame steps`);
  const bd = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", src, "-vf", "blackdetect=d=0.1:pic_th=0.98", "-an", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  r.black = [...bd.matchAll(/black_start:([\d.]+) black_end:([\d.]+)/g)].map((m) => [+m[1], +m[2]]);
  if (r.black.length) r.fails.push(`black frames ${JSON.stringify(r.black)}`);
  const fd = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", src, "-vf", "freezedetect=n=0.0005:d=1.5", "-an", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const fs = [...fd.matchAll(/freeze_start: ([\d.]+)/g)].map((m) => +m[1]);
  r.freezes = fs.map((t) => +t.toFixed(2));
  const unexpected = r.freezes.filter((t) => !(vsl && t > r.videoDur - 4)); // the VSL end-card hold is intentional
  if (unexpected.length) r.fails.push(`frozen at ${unexpected.join(", ")}`);
  const cues = readFileSync(srt, "utf8").trim().split(/\n\n+/).map((b) => { const [x, y] = b.split("\n")[1].split(" --> "); return [tc(x), tc(y), b.split("\n").slice(2).join(" ")]; });
  r.captions = cues.length;
  const bad = cues.filter((c, i) => c[1] <= c[0] || (i && c[0] < cues[i - 1][1] - 0.001) || c[1] > r.videoDur + 0.05);
  if (bad.length) r.fails.push(`${bad.length} bad caption cues`);
  r.result = r.fails.length ? "FAIL" : "PASS";
  rows.push(r);
  console.log(`${r.result}  ${name}  ${mmss(r.videoDur)}  ${r.lufs} LUFS / ${r.truePeak} dBTP  ${r.fails.join("; ")}`);
}
writeFileSync(join(OUT, "qa.json"), JSON.stringify(rows, null, 2) + "\n");
let md = `# AIS lead magnet ads + AIS+ VSLs: exports (Claude Code run)\n\nBrief: Steven, 9/30. 3 ads (16:9 + 9:16) + 4 AIS+ VSLs (16:9). Dark Glass HyperFrames system. Burned-in captions + SRT sidecars. Audio -16 LUFS / -1 dBTP.\n\n`;
md += `| # | File | Length | Size | Loudness | QA | Status |\n| --- | --- | --- | --- | --- | --- | --- |\n`;
rows.forEach((r, i) => { md += `| ${i + 1} | ${r.name}.mp4 (+ .srt) | ${r.videoDur ? mmss(r.videoDur) : "-"} | ${r.size || "-"}, ${r.mb || "-"} MB | ${r.lufs ?? "-"} LUFS / ${r.truePeak ?? "-"} dBTP | ${r.result || "FAIL"}${r.fails.length ? ": " + r.fails.join("; ") : ""} | ${r.status} |\n`; });
md += `\nChecks per file: 1080p/1080x1920 at 30 fps CFR, video = audio length, full decode with no warnings, loudness within 1 LU of -16 with true peak at or under -1 dBTP, every frame step 1/30s (no dropped or held frames at joins), no black frames, no frozen stretches over 1.5s (except the VSL end-card hold), SRT cues in order, non-overlapping and inside the video. Raw numbers: \`qa.json\`.\n`;
md += `\nVSL structure: 04/05/06 = custom intro + core A + core B; 07 = Generic intro + core B (enters at the proof bridge). Chapter + cut maps: the \`* - MAP.md\` file next to each VSL.\n`;
writeFileSync(join(OUT, "MANIFEST.md"), md);
console.log(`\n${rows.filter((r) => r.result === "PASS").length}/${rows.length} PASS -> 09-exports/MANIFEST.md`);
