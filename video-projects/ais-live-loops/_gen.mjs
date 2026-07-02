// AIS LIVE — #1 Doors-Open holding loop + #15 Stage Backdrop loop + #24 September/Austin tease.
// doors-open / stage-backdrop are SEAMLESS loops (variant "loop": ambient-only, no entrance) so
// they tile perfectly for long holds. september-tease is a headline reveal (in-person flagship,
// brand surfaces #6 + #33: "Austin · Sept 18-20, 2026"). Durations are 1.6s multiples.
//   node _gen.mjs <slug>  -> writes all cards + copies <slug> to index.html

import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildCard } from "../_ais-brand-kit.mjs";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

export const CARDS = [
  // ---- #1 Doors-Open holding loop (seamless, 16s — playback software loops it) ----
  { slug: "doors-open", variant: "loop", eyebrow: "DOORS OPEN · WELCOME",
    linePre: "Real projects. Real ", line: "revenue.", subline: "AIS LIVE begins shortly.",
    accentColor: "blue", glow: "blue", showGrid: true, dur: 16.0 },

  // ---- #15 Stage Backdrop (seamless, mark as a corner bug, center kept clear for overlaid content) ----
  { slug: "stage-backdrop", variant: "loop", backdrop: true, glowSwell: true,
    accentColor: "blue", glow: "blue", showGrid: true, dur: 16.0 },

  // ---- #24 September / Austin tease (in-person flagship) ----
  { slug: "september-tease", variant: "headline", hero: true, eyebrow: "COMING TO AUSTIN",
    pre: "", accent: "September.", subline: "Sept 18–20, 2026 · In person · Real projects, real revenue.",
    accentColor: "blue", glow: "blue", dur: 11.2 },
];

let wrote = 0;
for (const c of CARDS) {
  writeFileSync(join(SRC, `${c.slug}.html`), buildCard(c));
  wrote++;
}
const arg = process.argv[2];
if (arg) {
  copyFileSync(join(SRC, `${arg}.html`), join(DIR, "index.html"));
  console.log(`wrote ${wrote} cards/*.html; index.html <- cards/${arg}.html`);
} else {
  console.log(`wrote ${wrote} cards/*.html`);
}
