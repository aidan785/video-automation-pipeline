// Render the same 2.5s scene once per fix-candidate and extract the same frame.
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const FIXES = {
  control: "",
  lnlh: ".ln{line-height:1.45;}",
  padbig: ".ln .wd{padding:.12em .18em .55em;}",
  noshadow: ".ln .wd{text-shadow:none;} .ln .wd.ac{text-shadow:none;}",
  nowc: ".ln .wd{will-change:auto;}",
  flat: ".scene,.inner{transform-style:flat;}",
  inline: ".ln .wd{display:inline;}",
  nocamera: "", // camera tween removed via flag below
};

const page = (fixCss, camera) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1920, height=1080" />
<title>clip matrix</title><link href="assets/fonts/fonts.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:1920px;height:1080px;overflow:hidden;background:#000;color:#fff;font-family:"Inter",sans-serif;}
#stage{position:relative;width:1920px;height:1080px;overflow:hidden;background:#07121c;isolation:isolate;perspective:1600px;perspective-origin:50% 44%;}
#stage .clip{position:absolute;inset:0;width:1920px;height:1080px;pointer-events:none;}
#camera{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform;}
.scene{display:flex;align-items:center;justify-content:center;transform-style:preserve-3d;}
.inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;padding:96px 120px;text-align:center;transform-style:preserve-3d;will-change:transform,opacity;}
.ln{font-family:"Montserrat",sans-serif;font-style:italic;font-weight:900;font-size:122px;line-height:1.16;letter-spacing:-.03em;max-width:1600px;}
.ln .wd{display:inline-block;padding:.12em .15em .32em;will-change:transform,opacity;
  background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
  text-shadow:0 0 34px rgba(255,255,255,.22);}
.ln .wd.ac{background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
  -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
  text-shadow:0 0 48px rgba(55,189,248,.62);}
${fixCss}
</style></head>
<body>
<div id="stage" data-composition-id="cmp-cliptest" data-start="0" data-duration="2.5" data-width="1920" data-height="1080">
  <div id="camera">
    <section id="s0" class="scene clip" data-start="0" data-duration="2.5" data-track-index="10">
      <div class="inner"><div class="ln"><span class="wd">They</span><span class="wd">py</span><span class="wd ac">gyp.</span></div></div>
    </section>
  </div>
</div>
<script>
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
tl.fromTo("#s0 .wd",{autoAlpha:0,yPercent:110,scale:.92},{autoAlpha:1,yPercent:0,scale:1,duration:.46,ease:"expo.out",stagger:.05,transformOrigin:"50% 100%"},0.2);
${camera ? 'tl.to("#camera", { scale:1.035, y:-16, duration:1.25, yoyo:true, repeat:1, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);' : ""}
tl.to({}, { duration: 2.5 }, 0);
window.__timelines["cmp-cliptest"] = tl;
<\/script>
</body></html>
`;

for (const [name, css] of Object.entries(FIXES)) {
  writeFileSync("index.html", page(css, name !== "nocamera"));
  execSync(`npx hyperframes render --quality draft --workers auto --browser-gpu --gpu --output renders/m_${name}.mp4`, { stdio: "pipe" });
  execSync(`ffmpeg -v error -ss 1.8 -i renders/m_${name}.mp4 -frames:v 1 -y /tmp/m_${name}.png`);
  execSync(`ffmpeg -v error -i /tmp/m_${name}.png -vf "crop=1300:400:310:360" -y /tmp/mz_${name}.png`);
  console.log("done", name);
}
