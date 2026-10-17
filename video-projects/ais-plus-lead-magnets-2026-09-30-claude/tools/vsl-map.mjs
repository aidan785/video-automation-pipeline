#!/usr/bin/env node
// Chapter + cut map for an assembled VSL version (reads <version>.map.json from assemble-vsl.mjs,
// the part compositions' scene lists, and the core edit plan). Writes <version> - MAP.md.
// Usage: node tools/vsl-map.mjs "<version name>"
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const name = process.argv[2];
const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const OUT = join(ROOT, process.env.VSL_OUT || "07-previews/cp5");
const rep = JSON.parse(readFileSync(join(OUT, `${name}.map.json`), "utf8"));
const mmss = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, "0")}`;
const core = JSON.parse(readFileSync(join(ROOT, "04-edit-plan/08-vsl-core.plan.json"), "utf8"));
const bridgeCore = core.markers.find((m) => m.id === "PROOF_BRIDGE");

// scenes per part, straight from the built compositions (eyebrow + headline, or "Nate on camera" for solo passages)
const scenesOf = (comp) => {
  const html = readFileSync(join(ROOT, "06-compositions", comp, "index.html"), "utf8");
  const SC = JSON.parse(html.match(/const SCENES = (\[.*?\]);/)[1]);
  const text = [...html.matchAll(/<section id="s(\d+)"[^>]*>.*?<div class="eyebrow">(.*?)<\/div><h1[^>]*>(.*?)<\/h1>/g)].reduce((o, m) => ((o[m[1]] = `${m[2]}: ${m[3].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}`), o), {});
  return SC.map((s, i) => ({ t: s[0], layout: s[2], label: s[2] === "solo" ? "(Nate on camera)" : text[i] || "" }));
};
const PART_LABEL = { "vsl-intro-sop": "Intro: First AI Client SOP", "vsl-intro-aios": "Intro: AI OS Template", "vsl-intro-scrollcraft": "Intro: Scrollcraft", "vsl-intro-generic": "Intro: Generic", "vsl-core-a": "Core A: opening (custom intros only)", "vsl-core-b": "Core B: PROOF BRIDGE onward" };

let md = `# ${name}: chapter + cut map\n\n`;
md += `Length **${mmss(rep.videoDur)}** · ${rep.size} ${rep.fps} · ${rep.lufs} LUFS / ${rep.truePeak} dBTP · decode ${rep.decodeClean ? "clean" : "ERRORS"} · ${rep.captions} captions\n\n`;
md += `## Parts and joins\n\n| Part | Starts | Ends |\n| --- | --- | --- |\n` + rep.parts.map((p) => `| ${PART_LABEL[p.part] || p.part} | ${mmss(p.start)} | ${mmss(p.end)} |`).join("\n") + "\n\n";
const b = rep.parts.find((p) => p.part === "vsl-core-b");
md += `**PROOF BRIDGE marker:** ${mmss(b.start)} in this version ("So this page is full of examples...", raw core ${bridgeCore.raw}). The Generic version enters the core here.\n\n`;
md += `## Chapters\n\n| Time | Layout | Chapter |\n| --- | --- | --- |\n`;
for (const p of rep.parts) for (const s of scenesOf(p.part)) md += `| ${mmss(p.start + s.t)} | ${s.layout} | ${s.label} |\n`;
// core retakes placed on this version's timeline (the kept take starts at the join)
md += `\n## Core retake cuts (last take kept)\n\n| Version time | Raw core cut | Kept take starts (raw) | Removed |\n| --- | --- | --- | --- |\n`;
const coreStart = rep.parts.find((p) => p.part === "vsl-core-a")?.start ?? null;
for (const r of core.retakeCuts) {
  const toSec = (x) => { const [m, s] = x.split(":"); return +m * 60 + +s; };
  const keptRaw = toSec(r.keptTakeStarts);
  const seg = core.keepSegments.find((k) => keptRaw >= k.srcIn - 0.001 && keptRaw <= k.srcOut);
  const coreEdit = seg ? seg.editIn : null;
  const inB = coreEdit != null && coreEdit >= bridgeCore.editTime - 0.01;
  const vt = coreEdit == null ? null : inB ? b.start + (coreEdit - bridgeCore.editTime) : coreStart != null ? coreStart + coreEdit : null;
  md += `| ${vt == null ? "n/a" : "~" + mmss(vt)} | ${r.firstRemovedWord} to ${r.keptTakeStarts} | ${r.keptTakeStarts} | ${r.removedText.length > 70 ? r.removedText.slice(0, 70) + "..." : r.removedText} |\n`;
}
writeFileSync(join(OUT, `${name} - MAP.md`), md);
console.log(md.split("\n").slice(0, 12).join("\n"));
