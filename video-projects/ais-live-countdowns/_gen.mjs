// AIS LIVE — #21 Week-of Countdown + #20 Registration Urgency.
// Numeral countdown cards (canonical "eyebrow + numeral + 1-line + mark", brand surface #1)
// plus deadline/urgency cards. No fabricated prices/dates — registration copy is templated
// so the exact tier/price is a one-line edit here.
//   node _gen.mjs            -> writes all cards/*.html
//   node _gen.mjs <slug>     -> also copies that slug to index.html (for render)

import { writeFileSync, copyFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildCard } from "../_ais-brand-kit.mjs";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

const D = 8.0;
const COUNT_SUB = "Saturday, July 11 · Real projects, real revenue.";

export const CARDS = [
  // ---- #21 Week-of countdown (numerals) ----
  { slug: "countdown-7", variant: "countdown", eyebrow: "COUNTDOWN", num: "7", unit: "DAYS TO GO", subline: COUNT_SUB, accentColor: "blue", glow: "blue", dur: D },
  { slug: "countdown-5", variant: "countdown", eyebrow: "COUNTDOWN", num: "5", unit: "DAYS TO GO", subline: COUNT_SUB, accentColor: "blue", glow: "blue", dur: D },
  { slug: "countdown-3", variant: "countdown", eyebrow: "COUNTDOWN", num: "3", unit: "DAYS TO GO", subline: COUNT_SUB, accentColor: "blue", glow: "blue", dur: D },
  { slug: "countdown-2", variant: "countdown", eyebrow: "COUNTDOWN", num: "2", unit: "DAYS TO GO", subline: COUNT_SUB, accentColor: "blue", glow: "blue", dur: D },
  { slug: "countdown-1", variant: "countdown", eyebrow: "COUNTDOWN", num: "1", unit: "DAY TO GO", subline: "Tomorrow — Saturday, July 11 · doors at 10am.", accentColor: "blue", glow: "blue", dur: D },

  // ---- #20 Registration urgency (no fabricated price/date) ----
  { slug: "reg-super-early", variant: "headline", eyebrow: "REGISTRATION", pre: "Super early bird ", accent: "ends soon.", subline: "Best price on your seat — before it's gone.", accentColor: "blue", glow: "blue", dur: D },
  { slug: "reg-early-bird", variant: "headline", eyebrow: "PRICING", pre: "Early bird ", accent: "closing.", subline: "Prices step up at the next tier.", accentColor: "blue", glow: "blue", dur: D },
  { slug: "reg-final-call", variant: "headline", eyebrow: "LAST CALL", pre: "Final ", accent: "days.", subline: "Registration closes before July 11.", accentColor: "coral", glow: "coral", dur: D },
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
