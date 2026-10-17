#!/usr/bin/env node
// Finishing step (White Glass audio-preservation approach, plus the approved -16 LUFS target):
//   video stream copied untouched from the HyperFrames render,
//   audio taken from the verified clean edit (never the renderer's re-encode, avoids AAC priming offset),
//   two-pass linear loudnorm to -16 LUFS integrated / -1 dBTP, trimmed to the render's exact duration.
// Then checks: full decode clean, loudness measured on the output, A/V durations match.
// Usage: node tools/finish.mjs <render.mp4> <clean-audio-source.mp4> <out.mp4>
import { execFileSync, spawnSync } from "node:child_process";

const [render, audioSrc, out] = process.argv.slice(2);
if (!out) { console.error("usage: finish.mjs <render.mp4> <audio-source.mp4> <out.mp4>"); process.exit(2); }
const probe = (f, sel) => JSON.parse(execFileSync("ffprobe", ["-v", "error", ...sel, "-of", "json", f], { encoding: "utf8" }));
const vdur = parseFloat(probe(render, ["-select_streams", "v:0", "-show_entries", "stream=duration"]).streams[0].duration);

const TARGET = "I=-16:TP=-1:LRA=11";
const pass1 = spawnSync("ffmpeg", ["-hide_banner", "-t", String(vdur), "-i", audioSrc, "-vn", "-af", `loudnorm=${TARGET}:print_format=json`, "-f", "null", "-"], { encoding: "utf8" }).stderr;
const m = JSON.parse(pass1.slice(pass1.lastIndexOf("{"), pass1.lastIndexOf("}") + 1));
const af = `loudnorm=${TARGET}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,alimiter=limit=0.8:attack=2:release=60:level=disabled,aresample=48000`; // limiter: linear loudnorm alone left true peak at -0.9 (CP6 QA), spec is -1 dBTP
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", render, "-t", String(vdur), "-i", audioSrc, "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
  "-af", af, "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-t", String(vdur), "-movflags", "+faststart", out]);

const dec = spawnSync("ffmpeg", ["-v", "warning", "-i", out, "-f", "null", "-"], { encoding: "utf8" });
const eb = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", out, "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const I = +eb.match(/I:\s+(-?[\d.]+) LUFS/g).pop().match(/-?[\d.]+/)[0];
const TP = +eb.match(/Peak:\s+(-?[\d.]+) dBFS/g).pop().match(/-?[\d.]+/)[0];
const s = probe(out, ["-show_entries", "stream=codec_type,duration,width,height,avg_frame_rate"]).streams;
const v = s.find((x) => x.codec_type === "video"), a = s.find((x) => x.codec_type === "audio");
const report = { out, size: `${v.width}x${v.height}`, fps: v.avg_frame_rate, videoDur: +(+v.duration).toFixed(3), audioDur: +(+a.duration).toFixed(3),
  loudnessLUFS: I, truePeakDBFS: TP, decodeClean: dec.status === 0 && !dec.stderr.trim(), loudnormInput: +m.input_i };
console.log(JSON.stringify(report));
if (!report.decodeClean || Math.abs(I + 16) > 1 || TP > -1 || Math.abs(report.videoDur - report.audioDur) > 0.1) { console.error("FINISH CHECK FAILED"); process.exit(1); }
