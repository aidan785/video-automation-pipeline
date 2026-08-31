#!/usr/bin/env node
// Cut Day 1 recap clips for Block 5 — word-boundary-snapped via the Scribe
// transcripts, loudness-normalized, cropped per layout, poster/lastframe jpgs.
// Output -> ../ais-live-day2-opening-fill/assets/recap/
import { readFileSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const OUT = join(DIR, "../ais-live-day2-opening-fill/assets/recap");
mkdirSync(OUT, { recursive: true });

const SRC = {
  F: "/Volumes/Extreme SSD/AIS LIVE Assets/Foundation Workshop- Your First 30 Days in AI Automation .mp4",
  A: "/Volumes/Extreme SSD/AIS LIVE Assets/Workshop Block 1- Advanced - Low-Code to Full-Code.mp4",
  V: "/Volumes/Extreme SSD/AIS LIVE Assets/VIP Working Session 1 - Scope to Ship .mp4",
  S: "/Volumes/Extreme SSD/AIS LIVE Assets/Sabrina.mp4",
};
const TR = {
  F: "transcripts/foundation-workshop.json",
  A: "transcripts/workshop-low-code-to-full-code.json",
  V: "transcripts/vip-scope-to-ship.json",
  S: "transcripts/sabrina-content-engine.json",
};

// crop filters: VIP two-cam layout -> single-speaker 16:9; others full frame
const CROPS = {
  vipL: "crop=940:528:10:216,scale=1280:720",
  vipR: "crop=940:528:967:216,scale=1280:720",
  full: "scale=1280:720",
};

// start/end phrases are verbatim transcript runs (fuzzy-normalized match);
// after = only match starting past this many seconds (disambiguates repeats)
const CLIPS = [
  { id: "kodi-api-cost", src: "V", crop: "vipL", after: 500,
    start: "I think we're all hopefully aware", end: "tied to their account already" },
  { id: "kodi-value-lens", src: "V", crop: "vipL", after: 1880,
    start: "a lead agent for a landscaping company", end: "your time and overhead spent to create it" },
  { id: "mustafa-scoping", src: "V", crop: "vipR", after: 1300,
    start: "something that is really helpful that I've been doing", end: "take so much time that I haven't thought of" },
  { id: "kodi-scope-clause", src: "V", crop: "vipL", after: 1690,
    start: "it's good to have a clause", end: "something set in the", endTail: "signed agreement" },

  { id: "liberty-tribe", src: "F", crop: "full", after: 3740,
    start: "this is the switch, and I hope this is helpful", end: "your village will find you" },
  { id: "liberty-decision-maker", src: "F", crop: "full", after: 3630,
    start: "you need to find a decision maker", end: "we're the ones that come up first" },
  { id: "liberty-constraints", src: "F", crop: "full", after: 3970,
    start: "if I could add something and I hope you take away", end: "So it then breaks that down" },

  { id: "dave-13-years", src: "A", crop: "full", after: 1630,
    start: "It took me almost 13 years", end: "it's insane what you can do" },
  { id: "dave-better-time", src: "A", crop: "full", after: 1710,
    start: "there has never been a better time to learn how to code", end: "what's going on behind the scenes" },
  { id: "dave-no-code-6mo", src: "A", crop: "full", after: 3490,
    start: "I haven't written a single line of code in over six months", end: "I don't write myself anymore" },
  { id: "dave-postgres", src: "A", crop: "full", after: 2570,
    start: "my recommendation is, is Postgres is all you need", end: "you will never outgrow it" },
  { id: "dave-peaceful", src: "A", crop: "full", after: 3610,
    start: "if you are just entering the world of AI and technology", end: "because it has been stable" },
  { id: "dave-pricing", src: "A", crop: "full", after: 5230,
    start: "the tech industry is also changing a little bit", end: "We deliver it in two, two weeks" },
  { id: "dave-atomic", src: "A", crop: "full", after: 2330,
    start: "what matters the most, especially nowadays with AI", end: "break it down?" },
  { id: "dave-backend-5min", src: "A", crop: "full", after: 2150,
    start: "So the beauty of this is if you now say to an AI", end: "you're off to the start" },
  { id: "dave-think-like-dev", src: "A", crop: "full", after: 4350,
    start: "The move is not binary", end: "but then with different tools" },
  { id: "mustafa-value", src: "V", crop: "vipR", after: 960,
    start: "it doesn't matter, um, how many or the percentage", end: "value of the project that you're delivering" },
  { id: "mustafa-done", src: "V", crop: "vipR", after: 1110,
    start: "the definition of done has to", end: "a milestone in the project itself" },
  { id: "kodi-transparent", src: "V", crop: "vipL", after: 730,
    start: "it comes back to being transparent with the clients", end: "which should be included in your price" },

  // Sabrina Ramonov — Workshop Block 2: Build Your First AI Content Engine.
  // Full frame throughout: slides layouts pair with the audio (her intro slide
  // shows the 3M+/30M+ stats while she says them); hyperframes clip is full cam.
  { id: "sabrina-intro", src: "S", crop: "full", after: 950,
    start: "my name's Sabrina Ramanov. I've grown from zero", end: "why I've been so successful with it" },
  { id: "sabrina-zero-edits", src: "S", crop: "full", after: 2250,
    start: "I can tell you right now, I filmed a YouTube video tutorial", end: "going viral with zero editing" },
  { id: "sabrina-every-biz", src: "S", crop: "full", after: 3600,
    start: "every business in the world needs marketing", end: "potentially reach millions of potential customers" },
  { id: "sabrina-referral-demand", src: "S", crop: "full", after: 3680,
    start: "as the founder of Bloatato, I regularly get asked", end: "they're just swamped in work" },
  { id: "sabrina-testimonial-content", src: "S", crop: "full", after: 3850,
    start: "every Google testimonial a business gets is a piece of content", end: "posts it automatically to social media" },
  { id: "sabrina-done-for-you", src: "S", crop: "full", after: 3900,
    start: "business owners just want you to do it", end: "two weeks for me to respond to you about anything" },
  { id: "sabrina-niche-research", src: "S", crop: "full", after: 3970,
    start: "It's very easy, actually, because every social media platform", end: "shoving viral videos in your face" },
  { id: "sabrina-hyperframes", src: "S", crop: "full", after: 4300,
    start: "people ask me, \"HyperFrames or Remotion?\"", end: "just use HyperFrames and skip Remotion" },
];

const norm = s => s.toLowerCase().replace(/[^a-z0-9$£%]+/g, " ").trim().split(/\s+/).filter(Boolean);
const cache = {};
// flatten to a token stream (contractions split into multiple tokens) with a
// back-map from token index -> source word, so boundaries stay word-accurate
const words = k => (cache[k] ??= (() => {
  const ws = JSON.parse(readFileSync(join(DIR, TR[k]), "utf8")).words.filter(w => w.type === "word");
  const toks = [], ref = [];
  for (const w of ws) for (const t of norm(w.text)) { toks.push(t); ref.push(w); }
  return { toks, ref };
})());

function findPhrase(stream, phrase, after) {
  const p = norm(phrase);
  const { toks, ref } = stream;
  for (let i = 0; i <= toks.length - p.length; i++) {
    if (ref[i].start < after) continue;
    let ok = true;
    for (let j = 0; j < p.length; j++) if (toks[i + j] !== p[j]) { ok = false; break; }
    if (ok) return { first: ref[i], last: ref[i + p.length - 1] };
  }
  throw new Error(`phrase not found after ${after}s: "${phrase}"`);
}

const PAD_IN = 0.25, PAD_OUT = 0.45;
const results = [];
for (const c of CLIPS) {
  const ws = words(c.src);
  const s = findPhrase(ws, c.start, c.after);
  const endAnchor = findPhrase(ws, c.endTail ?? c.end, s.first.start); // end must follow start
  const t0 = +(s.first.start - PAD_IN).toFixed(3);
  const t1 = +(endAnchor.last.end + PAD_OUT).toFixed(3);
  const dur = +(t1 - t0).toFixed(3);
  const out = join(OUT, `recap-${c.id}.mp4`);
  execSync(`ffmpeg -v error -y -ss ${t0} -t ${dur} -i "${SRC[c.src]}" ` +
    `-vf "${CROPS[c.crop]}" -c:v libx264 -preset medium -crf 19 -r 30 ` +
    `-af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 160k -movflags +faststart "${out}"`);
  const real = +execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${out}"`).toString().trim();
  execSync(`ffmpeg -v error -y -i "${out}" -frames:v 1 -q:v 3 "${join(OUT, `recap-${c.id}-poster.jpg`)}"`);
  execSync(`ffmpeg -v error -y -sseof -0.15 -i "${out}" -frames:v 1 -q:v 3 "${join(OUT, `recap-${c.id}-lastframe.jpg`)}"`);
  results.push({ id: c.id, t0, t1, dur: real.toFixed(2) });
  console.log(`recap-${c.id}.mp4  src ${c.src} ${t0}s -> ${t1}s  (${real.toFixed(2)}s)`);
}
console.log(`\n${results.length} clips, total ${results.reduce((s, r) => s + +r.dur, 0).toFixed(1)}s`);
