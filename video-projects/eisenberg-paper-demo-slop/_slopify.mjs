// Deliberately-generic motion pass for the A/B comparison. Takes each wrapped
// card from the skilled demo and replaces its choreographed timeline with the
// stereotypical AI-slop version: everything fades in with the same uniform
// 0.4s power1 tween, one element after another. No camera push, no drift, no
// arcs, no follow-through, no ghosting, no typewriters, no count-ups
// (numbers just appear at their final value), connectors appear pre-drawn.
import fs from "node:fs";
import path from "node:path";

const SRC = "/Users/aidanstanik/Projects/Video Automation/video-projects/eisenberg-paper-demo/cards";
const OUT = "/Users/aidanstanik/Projects/Video Automation/video-projects/eisenberg-paper-demo-slop/cards";
fs.mkdirSync(OUT, { recursive: true });

for (const f of fs.readdirSync(SRC).filter((x) => x.endsWith(".html"))) {
  let html = fs.readFileSync(path.join(SRC, f), "utf8");

  const rootId = html.match(/const root = "([^"]+)";/)[1];
  const dur = html.match(/const DUR = ([\d.]+);/)[1];

  // swap the inline timeline script (keep the gsap <script src>)
  const slopJs = `
      window.__timelines = window.__timelines || {};
      const root = "${rootId}";
      const DUR = ${dur};

      /* SLOP: statics instead of animation — numbers at final value, meter full */
      document.querySelectorAll(root + " .count").forEach((el) => {
        const v = parseFloat(el.getAttribute("data-value")) || 0;
        const p = el.getAttribute("data-prefix") || "";
        el.textContent = p + Math.round(v).toLocaleString("en-US");
      });
      const fill = document.querySelector(root + " .fill");
      if (fill) fill.style.transform = "scaleX(0.78)";
      const cur = document.querySelector(root + " .cursor, " + root + " .caret");
      if (cur) cur.style.display = "none";

      /* SLOP: one uniform opacity fade for everything, same duration, same ease */
      const tl = gsap.timeline({ paused: true });
      const movers = gsap.utils.toArray(root + " .mover");
      tl.from(movers, { autoAlpha: 0, y: 30, duration: 0.4, ease: "power1.out", stagger: 0.45 }, 0.2)
        .set({}, {}, DUR);

      window.__timelines["${rootId.slice(1)}"] = tl;
  `;
  html = html.replace(/(<script src="https:\/\/cdn[^"]+"><\/script>\s*<script>)[\s\S]*?(<\/script>)/,
    (m, a, b) => a + slopJs + b);

  fs.writeFileSync(path.join(OUT, f), html);
  console.log("slopified", f);
}
