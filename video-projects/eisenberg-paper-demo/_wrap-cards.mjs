// Mechanical Agent-3-style wrap: standalone library card -> <template> sub-composition.
// Pulls the card's main div, its <style>, and its scripts inside one template,
// drops the tokens.css <link> (root index.html loads tokens once), and applies
// per-mount slot text so each card matches the VO beat.
import fs from "node:fs";
import path from "node:path";

const LIB = "/Users/aidanstanik/Projects/Video Automation/style-library/10-eisenberg-paper/cards";
const OUT = "/Users/aidanstanik/Projects/Video Automation/video-projects/eisenberg-paper-demo/cards";

const CARDS = [
  { file: "tier1/t1-thesis-stack.html", slots: {} },
  { file: "tier1/t1-section-sticker.html", slots: {} },
  { file: "tier1/t1-overview-pills.html", slots: {} },
  { file: "tier1/t1-terminal-hero.html", slots: { prompt: "Respond in 4 bullets max. No fluff." } },
  { file: "tier1/t1-list-terminal.html", slots: {
      s2: "[BULLET MODE]", s3: "[NO ESSAYS]", title: "// RESPONSE",
      i1a: "01_FOUR_BULLETS", i1b: "NOT_400_WORDS",
      i2a: "02_CRISP_ANSWERS", i2b: "ZERO_FLUFF",
      i3a: "03_LESS_TOKENS", i3b: "SPARING_THE_SPEND" } },
  { file: "tier1/t1-quote-ledger.html", slots: {
      q1: "that saved budget", q2: "goes straight", q3: "into the next plugin",
      attrib: "— plugin #2: morph" } },
  { file: "custom/custom-icon-connect.html", slots: {} },
  { file: "tier1/t1-stat-progress.html", slots: { sub: "reasoning cost" } },
];

fs.mkdirSync(OUT, { recursive: true });

for (const { file, slots } of CARDS) {
  let html = fs.readFileSync(path.join(LIB, file), "utf8");

  const style = html.match(/<style>([\s\S]*?)<\/style>/)[1]
    .replace(/^\s*html, body \{[^}]*\}\s*$/m, "");
  const bodyChunk = html.match(/<body>\s*([\s\S]*?)\s*<script src="https:\/\/cdn/)[1];
  const gsapSrc = html.match(/<script src="(https:\/\/cdn[^"]+gsap[^"]+)"><\/script>/)[1];
  let js = html.match(/<script src="https:\/\/cdn[^"]+"><\/script>\s*<script>([\s\S]*?)<\/script>/)[1];

  // main div minus its final closing tag, so style+scripts nest inside it
  let div = bodyChunk.trimEnd();
  if (!div.endsWith("</div>")) throw new Error("unexpected card structure: " + file);
  div = div.slice(0, -"</div>".length);

  // slot re-fills for this mount
  for (const [name, text] of Object.entries(slots)) {
    const re = new RegExp(`(data-slot="${name}"[^>]*>)[\\s\\S]*?(</)`);
    if (!re.test(div)) throw new Error(`slot ${name} not found in ${file}`);
    div = div.replace(re, `$1${text}$2`);
  }

  const name = path.basename(file);
  const compId = bodyChunk.match(/data-composition-id="([^"]+)"/)[1];
  const out = `<template id="tpl-${compId}">
${div}
  <style>${style}</style>
  <script src="${gsapSrc}"><\/script>
  <script>${js}<\/script>
</div>
</template>
`;
  fs.writeFileSync(path.join(OUT, name), out);
  console.log("wrapped", name, "->", compId, Object.keys(slots).length ? `(slots: ${Object.keys(slots).join(",")})` : "");
}
