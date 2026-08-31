#!/usr/bin/env node
// Generate the AIS+ screen+webcam layout comp for one project.
// usage: node video-projects/_ais-plus-gen-layout.mjs <project-dir> <clean-cam.mp4> <clean-screen.mp4> <title>
// Layout (1920x1080), from the reference frame: full-bleed blue background
// (darkened), portrait webcam card left, 16:9 screen card right.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const [projDir, camPath, screenPath, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(" ") || path.basename(projDir);
const assets = path.join(projDir, "assets");
fs.mkdirSync(assets, { recursive: true });

// Proxies (clean-cam-crop.mp4, clean-cam.m4a, clean-screen.mp4) are real files
// built separately — the preview server refuses symlinks that escape the
// project root, and full-res files stall the player's preload. Only fall back
// to a symlink when a proxy is missing.
function linkIfMissing(target, name) {
  const dest = path.join(assets, name);
  if (fs.existsSync(dest)) return;
  fs.symlinkSync(target, dest);
}
linkIfMissing(path.resolve(screenPath), "clean-screen.mp4");
for (const f of ["background.jpg"]) {
  const dest = path.join(assets, f);
  if (!fs.existsSync(dest)) fs.copyFileSync("/Users/aidanstanik/Downloads/Videos for AIS+/background.jpg", dest);
}
const gsapSrc = "video-projects/caic-interview-2/assets/gsap.min.js";
if (!fs.existsSync(path.join(assets, "gsap.min.js"))) fs.copyFileSync(gsapSrc, path.join(assets, "gsap.min.js"));

const dur = f => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration",
  "-of", "default=noprint_wrappers=1:nokey=1", f]).toString().trim();
const camDur = dur(camPath);
const screenDur = dur(screenPath);
const total = +camDur.toFixed(3);

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<script src="assets/gsap.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:1920px;height:1080px;overflow:hidden;background:#000;}
#comp{position:absolute;inset:0;width:1920px;height:1080px;overflow:hidden;}
.bg{position:absolute;inset:0;}
.bg img{width:1920px;height:1080px;object-fit:cover;display:block;}
.bg .darken{position:absolute;inset:0;background:rgba(3,12,26,.38);}
.bg .vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 46%,rgba(0,0,10,.42) 100%);}
.card{position:absolute;overflow:hidden;background:#0a1420;
  box-shadow:0 26px 70px rgba(0,0,10,.5),0 6px 22px rgba(0,0,10,.4);}
#cam-card{left:48px;top:153px;width:438px;height:774px;border-radius:24px;}
#cam-card video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
#screen-card{left:520px;top:153px;width:1376px;height:774px;border-radius:28px;background:#101418;}
#screen-card video{position:absolute;inset:0;width:1376px;height:774px;object-fit:cover;}
</style>
</head>
<body>
<div id="comp" data-composition-id="comp" data-start="0" data-width="1920" data-height="1080">
  <div class="bg">
    <img src="assets/background.jpg" alt="">
    <div class="darken"></div>
    <div class="vig"></div>
  </div>
  <div class="card" id="screen-card">
    <video id="screen-video" src="assets/clean-screen.mp4" muted playsinline data-has-audio="false" data-start="0" data-duration="${screenDur.toFixed(3)}" data-track-index="3"></video>
  </div>
  <div class="card" id="cam-card">
    <div style="position:absolute;inset:0;">
      <video id="cam-video" src="assets/clean-cam-crop.mp4" muted playsinline data-has-audio="false" data-start="0" data-duration="${total}" data-track-index="4"></video>
    </div>
  </div>
  <audio id="main-audio" src="assets/clean-cam.m4a" data-start="0" data-duration="${total}" data-track-index="10" data-volume="1"></audio>
</div>
<script>
  const tl = gsap.timeline({ paused: true });
  tl.set({}, {}, ${total});
  window.__timelines = window.__timelines || {};
  window.__timelines["comp"] = tl;
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(projDir, "index.html"), html);
fs.writeFileSync(path.join(projDir, "hyperframes.json"), JSON.stringify({
  $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
  registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  paths: { blocks: "compositions", components: "compositions/components", assets: "assets" },
}, null, 2));
fs.writeFileSync(path.join(projDir, "meta.json"), JSON.stringify({
  title, width: 1920, height: 1080, fps: 30, duration: total,
}, null, 2));
console.log(JSON.stringify({ projDir, camDur, screenDur, total }));
