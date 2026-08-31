// AIS LIVE — #22 "We're Live" day-of + #11 Day-1 Close Outro.
// Headline cards. The "We're live" word carries the live-dot treatment (blue LIVE + red dot)
// echoing the mark; the AIS LIVE lockup signs off below. Both dots pulse on the 1.6s beat.
//   node _gen.mjs <slug>  -> writes all cards + copies <slug> to index.html

import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildCard } from "../_ais-brand-kit.mjs";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

const D = 8.0;

export const CARDS = [
  // ---- #22 We're Live (day-of) ----
  { slug: "live-day1", variant: "headline", hero: true, live: true, eyebrow: "ON AIR", eyebrowColor: "red",
    pre: "We're ", accent: "live", subline: "Day 1 · Saturday, July 11 · the room is open.", accentColor: "blue", glow: "blue", dur: D },
  { slug: "live-day2", variant: "headline", hero: true, live: true, eyebrow: "ON AIR", eyebrowColor: "red",
    pre: "We're ", accent: "live", subline: "Day 2 · Sunday, July 12 · welcome back in.", accentColor: "blue", glow: "blue", dur: D },

  // ---- #11 Day-1 Close Outro ----
  { slug: "wrap-day1", variant: "headline", eyebrow: "THAT'S A WRAP", pre: "Day 1 ", accent: "done.",
    subline: "Back tomorrow — Sunday, July 12 · doors at 10am.", accentColor: "blue", glow: "blue", dur: D },
  { slug: "see-you-tomorrow", variant: "headline", eyebrow: "DAY 1 COMPLETE", pre: "See you ", accent: "tomorrow.",
    subline: "Sunday, July 12 · Real projects, real revenue.", accentColor: "blue", glow: "blue", dur: D },
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
