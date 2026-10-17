#!/usr/bin/env node
// Assemble one VSL version from rendered parts (intro + core A + core B, or intro + core B for Generic).
//   video: part renders concatenated with stream copy (identical HyperFrames encode settings, checked first)
//   audio: ONE continuous track from the verified clean audio of each part (trimmed to its speaker length,
//          silence-padded to the part's comp length), then two-pass loudnorm -16 LUFS / -1 dBTP on the whole
//   captions: part SRTs rebased onto the version timeline
//   map: part boundaries (incl. PROOF BRIDGE) written to <out>.map.json
// Usage: node tools/assemble-vsl.mjs "<version name>" <part>...    part = <compDir>:<cleanAudio.mp4>
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [name, ...partArgs] = process.argv.slice(2);
const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const OUTDIR = join(ROOT, process.env.VSL_OUT || "07-previews/cp5");
mkdirSync(OUTDIR, { recursive: true });
const tmp = join(OUTDIR, `.assemble-${Date.now()}`);
mkdirSync(tmp);
const probe = (f) => JSON.parse(execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", f], { encoding: "utf8" }));

const parts = partArgs.map((a) => {
  const [comp, audio] = a.split(":");
  const dir = resolve(ROOT, comp);
  const render = join(dir, "renders/raw.mp4");
  const html = readFileSync(join(dir, "index.html"), "utf8");
  const D = Number(html.match(/data-composition-id="main" data-start="0" data-duration="([\d.]+)"/)[1]);
  const VD = Number(html.match(/<video id="speaker"[^>]*data-duration="([\d.]+)"/)[1]);
  const v = probe(render).streams.find((s) => s.codec_type === "video");
  // pace audio + captions to the RENDER's real length (the renderer rounds up to whole frames)
  const RD = +(Number(v.nb_frames) / 30).toFixed(4); // exact frame-count length (the container duration runs ~1 frame long)
  return { comp: basename(dir), render, audio: resolve(ROOT, audio), D: RD, planD: D, VD, srt: join(dir, `${basename(dir)}.srt`), v };
});
// encode-parameter check (stream-copy concat requires identical streams)
const sig = (v) => [v.codec_name, v.profile, v.width, v.height, v.pix_fmt, v.r_frame_rate, v.time_base].join("|");
if (new Set(parts.map((p) => sig(p.v))).size !== 1) throw new Error("part renders differ in encode parameters: " + parts.map((p) => sig(p.v)).join(" vs "));

// 1) audio per part -> wav at the part's exact comp length
let t = 0;
const map = [];
parts.forEach((p, i) => {
  const wav = join(tmp, `a${i}.wav`);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-t", String(p.VD), "-i", p.audio, "-vn", "-af", `apad=whole_dur=${p.D}`, "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", "-t", String(p.D), wav]);
  map.push({ part: p.comp, start: +t.toFixed(3), end: +(t + p.D).toFixed(3), duration: p.D });
  t += p.D;
});
// 2) video concat (stream copy)
writeFileSync(join(tmp, "v.txt"), parts.map((p) => `file '${p.render.replace(/'/g, "'\\''")}'\nduration ${p.D}`).join("\n")); // duration = frame-exact offsets, no gap at joins
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", join(tmp, "v.txt"), "-map", "0:v:0", "-c", "copy", join(tmp, "v.mp4")]);
// 3) audio concat + loudnorm on the whole version
writeFileSync(join(tmp, "a.txt"), parts.map((_, i) => `file '${join(tmp, `a${i}.wav`)}'`).join("\n"));
execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", join(tmp, "a.txt"), "-c", "copy", join(tmp, "a.wav")]);
const TARGET = "I=-16:TP=-1:LRA=11";
const p1 = spawnSync("ffmpeg", ["-hide_banner", "-i", join(tmp, "a.wav"), "-af", `loudnorm=${TARGET}:print_format=json`, "-f", "null", "-"], { encoding: "utf8" }).stderr;
const m = JSON.parse(p1.slice(p1.lastIndexOf("{"), p1.lastIndexOf("}") + 1));
const out = join(OUTDIR, `${name}.mp4`);
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", join(tmp, "v.mp4"), "-i", join(tmp, "a.wav"), "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
  "-af", `loudnorm=${TARGET}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,alimiter=limit=0.8:attack=2:release=60:level=disabled,aresample=48000`, // limiter keeps true peak <= -1 dBTP
  "-c:a", "aac", "-b:a", "192k", "-t", t.toFixed(3), "-movflags", "+faststart", out]);
// 4) captions rebased
const tc = (s) => { const [h, mi, rest] = s.split(":"); const [se, ms] = rest.split(","); return +h * 3600 + +mi * 60 + +se + +ms / 1000; };
const fmt = (x) => { const ms = Math.round(x * 1000); return `${String(Math.floor(ms / 3600000)).padStart(2, "0")}:${String(Math.floor(ms / 60000) % 60).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`; };
let n = 0; const srt = [];
parts.forEach((p, i) => {
  for (const block of readFileSync(p.srt, "utf8").trim().split(/\n\n+/)) {
    const lines = block.split("\n"); const [a, b] = lines[1].split(" --> ");
    srt.push(`${++n}\n${fmt(tc(a) + map[i].start)} --> ${fmt(tc(b) + map[i].start)}\n${lines.slice(2).join("\n")}\n`);
  }
});
writeFileSync(join(OUTDIR, `${name}.srt`), srt.join("\n"));
rmSync(tmp, { recursive: true, force: true });
// 5) QA on the assembled file
const q = probe(out); const vv = q.streams.find((s) => s.codec_type === "video"), aa = q.streams.find((s) => s.codec_type === "audio");
const dec = spawnSync("ffmpeg", ["-v", "warning", "-i", out, "-f", "null", "-"], { encoding: "utf8" });
const eb = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", out, "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const report = { out, size: `${vv.width}x${vv.height}`, fps: vv.r_frame_rate, videoDur: +(+vv.duration).toFixed(3), audioDur: +(+aa.duration).toFixed(3), expected: +t.toFixed(3),
  lufs: +eb.match(/I:\s+(-?[\d.]+) LUFS/g).pop().match(/-?[\d.]+/)[0], truePeak: +eb.match(/Peak:\s+(-?[\d.]+) dBFS/g).pop().match(/-?[\d.]+/)[0],
  decodeClean: dec.status === 0 && !dec.stderr.trim(), captions: n, parts: map };
writeFileSync(join(OUTDIR, `${name}.map.json`), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report));
