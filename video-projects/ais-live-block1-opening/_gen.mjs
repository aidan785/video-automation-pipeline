// AIS LIVE — Block 1: OPENING (general room, 9:30-10:15 CT, Day 1).
// Brief (Aidan, 2026-07-08): 45-min build that RUNS ONCE and fills the whole
// window (plays while the VIP Q&A runs in the VIP room). Assembled IN ORDER:
//   1. Welcome title / hype open        <- Aidan's own asset: PLACEHOLDER BOX
//   2. Day 1 agenda walkthrough (3:00)  <- mounted render
//   3. Get set up (agenda/booths/networking, 1:01)  <- mounted render
//   4. VIP prompt: Q&A with Nate live now (0:34)    <- mounted render
//   5. What's coming today, session teasers (1:24)  <- mounted render
//   6. Community testimonials (reels rotate per pass)
//   7. Sponsor reel: HyperAgent 60s (PLACEHOLDER) + Glaido sting + Clay (PLACEHOLDER)
//   8. AIS+ membership pitch (mounted ad)
//   9. soft loop back to 1 to fill remaining time; fixed outro lands on
//      "Welcome to AIS Live, 10:15 main stage" as the window ends.
//
// PLACEHOLDER slots render as unmistakable dashed drop-in boxes (per Aidan:
// "create a placeholder box so I know I need to add it in"). Each auto-mounts
// when its file lands in assets/video/ (+ re-run _gen.mjs):
//   welcome-open.mp4   -> replaces the Welcome placeholder (any length)
//   hyperagent-60.mp4  -> replaces the HyperAgent 60s placeholder
//   clay.mp4           -> replaces the Clay placeholder
// Pass math recomputes automatically; TOTAL stays pinned to exactly 2700s.
//
// Engine forked from ais-live-lunch-fill/_gen.mjs (command-deck style: depth
// grid tunnel, beam, chrome type, whip cuts, breathing vignette, grain, solid
// AIS/LIVE mark w/ live dot; mounted mp4s poster/lastframe-bracketed).
// AUDIO: testimonial reels + AIS+ ad keep their voice audio; all authored
// cards + the walkthrough renders are silent — venue runs the music bed.
//
//   node _gen.mjs         -> writes cards/block1-opening.html
//   node _gen.mjs --set   -> also copies it to index.html (active for preview/render)

import { writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

const TARGET = 2700; // 45:00 exactly — plays once, fills the 9:30-10:15 window

// ---------------------------------------------------------------------------
// MOUNTED VIDEO PIECES — probed at gen time; floor-snapped to the 30fps grid.
// ---------------------------------------------------------------------------
const probe = f => {
  const d = +execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${join(DIR, "assets/video", f)}"`).toString().trim();
  return Math.floor(d * 30) / 30;
};
const MOUNT_HOLD = 0.4; // lastframe hold at the tail so the exit whip rides a real frame
const VID = {
  agenda:     { file: "day1-agenda",  dur: probe("day1-agenda.mp4"),  audio: false },
  setup:      { file: "get-setup",    dur: probe("get-setup.mp4"),    audio: false },
  vip:        { file: "vip-qa",       dur: probe("vip-qa.mp4"),       audio: false },
  teasers:    { file: "day1-teasers", dur: probe("day1-teasers.mp4"), audio: false },
  building:   { file: "testi-building", dur: probe("testi-building.mp4"), audio: true },
  earning:    { file: "testi-earning",  dur: probe("testi-earning.mp4"),  audio: true },
  membership: { file: "ais-plus-membership", dur: probe("ais-plus-membership.mp4"), audio: true },
  // HyperAgent keynote (Alex McDonnell, 18:25) — sponsor-provided, plays ONCE
  // in pass 1's sponsor slot so it runs through the heart of the window
  keynote:    { file: "hyperagent-keynote", dur: probe("hyperagent-keynote.mp4"), audio: true },
};
// optional drop-ins — auto-mount when the file exists
const optional = (file, audio = true) => existsSync(join(DIR, "assets/video", `${file}.mp4`))
  ? { file, dur: probe(`${file}.mp4`), audio } : null;
const WELCOME = optional("welcome-open");

const mount = v => ({ type: "mount", video: v, dur: +(v.dur + MOUNT_HOLD).toFixed(3) });

// ---------------------------------------------------------------------------
// SPEAKER SPOTLIGHTS — 36 portrait cards (headshot left, session right), one
// slice of 9 per pass so the loop never repeats a speaker. Day 1 fills passes
// 1-2, Day 2 ("tomorrow") fills passes 3-4. Facts verbatim from Agenda v7.1.
// Cutouts fill top-to-bottom: 4:5 crops at 96%, squarish chest-up crops at 88%.
// ---------------------------------------------------------------------------
const PEOPLE = {
  "nate-herk": { name: "Nate Herk", role: "Founder · Uppit AI & AIS" },
  "aidan-finnegan": { name: "Aidan Finnegan", role: "Founder · Opulence AI" },
  "glenn-marcus": { name: "Glenn Marcus", role: "Founder · Cliq Consulting" },
  "wyatt-lyonsmith": { name: "Wyatt Lyonsmith", role: "Owner · GrowMoto" },
  "jon-morrow": { name: "Jon Morrow", role: "President & COO · Uppit AI" },
  "alex-mcdonnell": { name: "Alex McDonnell", role: "Product Marketing · HyperAgent" },
  "ednan-abdullayev": { name: "Ednan Abdullayev", role: "Tech Lead · AIS" },
  "jannis-moore": { name: "Jannis Moore", role: "Co-Founder · Glaido" },
  "liberty-white": { name: "Liberty White", role: "Founder · She Learns AI" },
  "dave-ebbelaar": { name: "Dave Ebbelaar", role: "Founder · Datalumina" },
  "jenn-van-wagner": { name: "Jenn Van Wagner", role: "Business Operations Specialist · Uppit AI" },
  "russ-henneberry": { name: "Russ Henneberry", role: "Founder · theCLICK" },
  "kacper-rutkiewicz": { name: "Kacper Rutkiewicz", role: "Founder · DeepRooted" },
  "sabrina-ramonov": { name: "Sabrina Ramonov", role: "Founder & CEO · Blotato" },
  "samin-yasar": { name: "Samin Yasar", role: "Founder & CEO · BookedIn.ai" },
  "tangy-frederick": { name: "Tangy Frederick", role: "President · Regal Unicorn" },
  "devin-kearns": { name: "Devin Kearns", role: "Founder · Custom AI Studio" },
  "pat-blakely": { name: "Pat Blakely", role: "Writer & Product Manager" },
  "yash-chauhan": { name: "Yash Chauhan", role: "Community Manager · AIS" },
  "jonathan-stark": { name: "Jonathan Stark", role: "Founder · The Ditching Hourly Guy" },
  "dariia-vasylieva": { name: "Dr. Dariia Vasylieva", role: "Founder & CEO · RaiseTalks" },
  "anne-marie-enns": { name: "Anne-Marie Enns", role: "" },
  "amy-simpson": { name: "Amy Simpson", role: "Co-Owner · Simpatico Design Studio" },
  "matt-wolfe": { name: "Matt Wolfe", role: "Founder · Future Tools" },
  "_placeholder": { name: "", role: "" },
};
// squarish chest-up crops (aspect > 0.9) that need the 88% scale-up
const SQUARISH = new Set(["aidan-finnegan", "dave-ebbelaar", "devin-kearns", "jon-morrow",
  "kacper-rutkiewicz", "nate-herk", "tangy-frederick", "anne-marie-enns"]);

const D1 = "SAT · JUL 11", D2 = "SUN · JUL 12";
const SPEAKERS = [
  // ---- Day 1 (today) — passes 1-2 ----
  { tag: "VIP Q&A · 9:30 AM", faces: ["nate-herk"], title: "VIP Q&A with Nate", tsize: 84,
    hook: "Bring the question you've been mulling over for weeks.", meta: `${D1} · 9:30 AM CT · VIP ROOM` },
  { tag: "OPENING · 10:15 AM", faces: ["nate-herk"], title: "Welcome to AIS Live", tsize: 84,
    hook: "How you actually make money in AI services, and the shape of the weekend.", meta: `${D1} · 10:15 AM CT · MAIN STAGE` },
  { tag: "MAIN STAGE · 10:30 AM", faces: ["aidan-finnegan", "glenn-marcus", "wyatt-lyonsmith", "nate-herk"],
    names: "Aidan Finnegan · Nate Herk · Glenn Marcus · Wyatt Lyonsmith",
    title: "Anatomy of Three Real Deals", tsize: 62,
    hook: "Three real client engagements, end to end. The actual version, numbers attached.", meta: `${D1} · 10:30 AM CT` },
  { tag: "LIVE DEBRIEF · 11:25 AM", faces: ["jon-morrow"], title: "Patterns from Real Deals", tsize: 80,
    hook: "The throughline that turned each conversation into a signed engagement.", meta: `${D1} · 11:25 AM CT · MAIN STAGE` },
  { tag: "KEYNOTE · 11:40 AM", faces: ["alex-mcdonnell"], logo: "hyperagent-white.png",
    title: "The New Standard", tsize: 84,
    hook: "Why you need a fleet of always-on agents.", meta: `${D1} · 11:40 AM CT · MAIN STAGE` },
  { tag: "SPONSORED SESSION · 12:00 PM", faces: ["jannis-moore"], logo: "glaido-white.png",
    title: "Voice, Live", tsize: 84,
    hook: "Voice AI you can actually bill for. Live demo from the Glaido team.", meta: `${D1} · 12:00 PM CT · MAIN STAGE` },
  { tag: "CO-BUILD · 12:20 PM", faces: ["nate-herk", "ednan-abdullayev"], names: "Nate Herk + Ednan Abdullayev",
    title: "Evals", tsize: 94,
    hook: "Built live. The eval results tell you exactly what to fix.", meta: `${D1} · 12:20 PM CT · MAIN STAGE` },
  { tag: "FOUNDATION TRACK · 12:45 PM", faces: ["liberty-white"], title: "Your First 30 Days in AI Automation", tsize: 62,
    hook: "What to build first, what to ignore, what to ship in week one.", meta: `${D1} · 12:45 PM CT · WORKSHOP BLOCK 1` },
  { tag: "ADVANCED TRACK · 12:45 PM", faces: ["dave-ebbelaar"], title: "Low-Code to Full-Code", tsize: 76,
    hook: "The architecture choices that hold up at scale.", meta: `${D1} · 12:45 PM CT · WORKSHOP BLOCK 1` },
  { tag: "VIP WORKING SESSION · 2:00 PM", faces: ["jon-morrow"], title: "Land Your First Paying Client", tsize: 68,
    hook: "The fastest realistic path to your first paid AI engagement.", meta: `${D1} · 2:00 PM CT · VIP` },
  { tag: "VIP WORKING SESSION · 2:00 PM", faces: ["jenn-van-wagner"], title: "Turn Your Expertise Into a Service", tsize: 62,
    hook: "Turn what you already know into a productized, sellable AI service offer.", meta: `${D1} · 2:00 PM CT · VIP` },
  { tag: "VIP WORKING SESSION · 2:00 PM", faces: ["russ-henneberry"], title: "Price It Right", tsize: 88,
    hook: "Packaging, anchoring, and what to charge for your AI work.", meta: `${D1} · 2:00 PM CT · VIP` },
  { tag: "FEATURED SESSION · 2:35 PM", faces: ["kacper-rutkiewicz"],
    title: "How I Run an Entire AI Automation Agency Using Claude Code", tsize: 52,
    hook: "Client delivery. Sales. Content. One workspace.", meta: `${D1} · 2:35 PM CT · MAIN STAGE` },
  { tag: "FOUNDATION TRACK · 3:10 PM", faces: ["sabrina-ramonov"], title: "Build Your First AI Content Engine", tsize: 62,
    hook: "A content engine built live, end to end, in 60 minutes.", meta: `${D1} · 3:10 PM CT · WORKSHOP BLOCK 2` },
  { tag: "ADVANCED TRACK · 3:10 PM", faces: ["samin-yasar"], title: "Build a Voice AI Sales Rep", tsize: 70,
    hook: "Live on stage, end to end. Architecture that holds up in the wild.", meta: `${D1} · 3:10 PM CT · WORKSHOP BLOCK 2` },
  { tag: "WORKSHOP BLOCK 3 · 4:20 PM", faces: ["tangy-frederick"], title: "Enterprise AI Services", tsize: 80,
    hook: "How a small AI agency wins deals against firms ten times its size.", meta: `${D1} · 4:20 PM CT · MAIN STAGE` },
  { tag: "MAIN STAGE · 5:05 PM", faces: ["ednan-abdullayev"],
    title: "Get AIS+ Certified", tsize: 80,
    hook: "The credential that proves you can build and sell real AI services.", meta: `${D1} · 5:05 PM CT · MAIN STAGE` },
  { tag: "CLOSING · 5:20 PM", faces: ["nate-herk"], title: "Day 1 Closing Remarks", tsize: 76,
    hook: "The day's biggest moments, plus the overnight challenge that sets up Day 2.", meta: `${D1} · 5:20 PM CT · MAIN STAGE` },

  // ---- Day 2 (tomorrow) — passes 3-4 ----
  { tag: "TOMORROW · DAY 2 OPEN · 9:45 AM", faces: ["nate-herk"], title: "Now Let's Turn This Into Money", tsize: 64,
    hook: "Build Day is done. Day 2 is about earning.", meta: `${D2} · 9:45 AM CT · MAIN STAGE` },
  { tag: "TOMORROW · WORKSHOP · 10:00 AM", faces: ["alex-mcdonnell"], logo: "hyperagent-white.png",
    title: "How to Build an Always-On Fleet of Agents", tsize: 56,
    hook: "Sixty minutes, hands-on. System prompts, skills, tools, loops.", meta: `${D2} · 10:00 AM CT · MAIN STAGE` },
  { tag: "TOMORROW · PANEL · 11:10 AM", faces: ["devin-kearns", "dave-ebbelaar"], names: "Devin Kearns · Dave Ebbelaar",
    title: "The Tool War: What Actually Makes Money in 2026", tsize: 54,
    hook: "Honest swings at each other's stacks. What ships, what's overhyped.", meta: `${D2} · 11:10 AM CT · MAIN STAGE` },
  { tag: "TOMORROW · 11:50 AM", faces: ["jon-morrow", "pat-blakely"], names: "Jon Morrow · Pat Blakely",
    title: "Where Your First 10 Clients Are Hiding", tsize: 58,
    hook: "Specific channels, specific behaviors, outreach that gets picked up.", meta: `${D2} · 11:50 AM CT · MAIN STAGE` },
  { tag: "TOMORROW · 12:30 PM", faces: ["jon-morrow", "pat-blakely"], names: "Jon Morrow · Pat Blakely",
    title: "The Sales Arc, LIVE", tsize: 84,
    hook: "A real AI services sales call, live on stage. No script. No safety net.", meta: `${D2} · 12:30 PM CT · MAIN STAGE` },
  { tag: "TOMORROW · VIP · 1:35 PM", faces: ["pat-blakely"], title: "Your First 10 Clients Plan", tsize: 70,
    hook: "Who, where, and the outreach that works right now.", meta: `${D2} · 1:35 PM CT · VIP` },
  { tag: "TOMORROW · VIP · 1:35 PM", faces: ["russ-henneberry"], title: "First Sales Call Prep", tsize: 76,
    hook: "The questions to ask, how to run discovery, and how to move to a yes.", meta: `${D2} · 1:35 PM CT · VIP` },
  { tag: "TOMORROW · VIP · 1:35 PM", faces: ["yash-chauhan"], title: "From Solo to Real Business", tsize: 70,
    hook: "Systems, team, and the shift from doing the work to running the company.", meta: `${D2} · 1:35 PM CT · VIP` },
  { tag: "TOMORROW · 2:10 PM", faces: ["nate-herk", "jon-morrow"], names: "Nate Herk · Jon Morrow",
    title: "Sales Call Recap + Intro to Pricing", tsize: 60,
    hook: "The moves that worked, and the phrases to take into your next client call.", meta: `${D2} · 2:10 PM CT · MAIN STAGE` },
  { tag: "TOMORROW · FIRESIDE · 2:25 PM", faces: ["jonathan-stark"],
    title: "Ditching Hourly: The Pricing Mindset That Changes Everything", tsize: 52,
    hook: "The pricing mindset that turns $5,000 projects into $50,000 engagements.", meta: `${D2} · 2:25 PM CT · MAIN STAGE` },
  { tag: "TOMORROW · FIRESIDE · 3:10 PM", faces: ["dariia-vasylieva", "anne-marie-enns"],
    names: "Dr. Dariia Vasylieva · Anne-Marie Enns",
    title: "What Companies Are Actually Buying in AI", tsize: 56,
    hook: "What buyers actually want, from someone who has seen hundreds of AI companies.", meta: `${D2} · 3:10 PM CT · MAIN STAGE` },
  { tag: "TOMORROW · 4:05 PM", faces: ["amy-simpson"], title: "The Client Didn't Ask for AI", tsize: 66,
    hook: "How to upgrade the services you already sell. Real numbers from real contracts.", meta: `${D2} · 4:05 PM CT · MAIN STAGE` },
  { tag: "TOMORROW · VIP · 4:05 PM", faces: ["nate-herk", "jon-morrow"], names: "Nate Herk · Jon Morrow",
    title: "VIP Pricing War Room", tsize: 74,
    hook: "Real pricing problems, worked through live. Yours might be one of them.", meta: `${D2} · 4:05 PM CT · VIP` },
  { tag: "TOMORROW · 4:45 PM", faces: ["matt-wolfe", "nate-herk"], names: "Matt Wolfe · Nate Herk",
    title: "What Actually Matters in AI Right Now", tsize: 58,
    hook: "Unscripted. What's overhyped, what's underbuilt, where real value is emerging.", meta: `${D2} · 4:45 PM CT · MAIN STAGE` },
  { tag: "TOMORROW · CLOSING KEYNOTE · 5:15 PM", faces: ["devin-kearns"], title: "Build to Sell", tsize: 92,
    hook: "The window to position your agency to be bought is now.", meta: `${D2} · 5:15 PM CT · MAIN STAGE` },
  { tag: "TOMORROW · CLOSING · 5:45 PM", faces: ["nate-herk"], title: "Nate's Close + AIS+ Pitch", tsize: 70,
    hook: "The patterns that ran through every session, and a Monday morning challenge.", meta: `${D2} · 5:45 PM CT · MAIN STAGE` },
  { tag: "TOMORROW · VIP · 6:10 PM", faces: ["nate-herk"], title: "VIP After-Party with Nate", tsize: 70,
    hook: "Unstructured time, peer breakouts, and a final fireside with the host.", meta: `${D2} · 6:10 PM CT · VIP` },
];
// ---------------------------------------------------------------------------
// MEMBER WINS — real community win posts (screenshots from Yash's wins folder)
// shown 4 per pass right after the testimonial reel, with a loose summary of
// what they accomplished beside the post. Numbers verbatim from the posts.
// ---------------------------------------------------------------------------
const WINS = [
  { img: "david-kim", name: "David Kim", pre: "$385,000 ", accent: "contract.",
    sub: "A $25K implementation fee plus $15K a month for 24 months, closed at a 76% profit margin." },
  { img: "jacob-west", name: "Jacob West", pre: "Two deals, ", accent: "one week.",
    sub: "$22.5K and $42K sold in the same week, crossing $15K MRR and making his first hire." },
  { img: "mohammad-sallam", name: "Mohammad Sallam", pre: "$50K+ in ", accent: "the pipeline.",
    sub: "Four new clients within a month, just a couple of weeks in." },
  { img: "kobe-shemesh", name: "Kobe Shemesh", pre: "$40K ", accent: "upfront.",
    sub: "Plus 20% revenue share, on one custom AI build." },

  { img: "joe-scott", name: "Joe Scott", pre: "£1K to ", accent: "£30K projects.",
    sub: "From selling £1,000 workflows a year ago to closing AI agent projects at £25-30K." },
  { img: "sef-el", name: "Sef El", pre: "$25K ", accent: "this month.",
    sub: "What started as a side hustle now invoices $25K a month, with $9K more in the pipeline." },
  { img: "abdurrahman-ibrahim", name: "Abdurrahman Ibrahim", pre: "$10K in ", accent: "one year.",
    sub: "A side hustle while still in university. 80% of it came through AIS+ connections." },
  { img: "noel-payano", name: "Noel Payano", pre: "First client, ", accent: "$5K.",
    sub: "Closed at 18 years old." },

  { img: "tyler-capps", name: "Tyler Capps", pre: "$5,000, ", accent: "locked in.",
    sub: "First client closed at 38, with a full-time job and a toddler at home." },
  { img: "michael-elliott", name: "Michael Elliott", pre: "Three builds, ", accent: "one week.",
    sub: "Two recurring sites at $150 and $200 a month, plus a $1,000 portfolio build." },
  { img: "galyn-fergerson", name: "Galyn Fergerson", pre: "$750 in ", accent: "six days.",
    sub: "Landed her first AI OS build less than a week after joining." },
  { img: "nika-matveeva", name: "Nika Matveeva", pre: "Paid $800, ", accent: "first project.",
    sub: "A Claude-coded home inventory system cataloging 1,000+ items." },

  { img: "christian-barraza", name: "Christian Barraza", pre: "Second client ", accent: "in 3 days.",
    sub: "Three days after signing his first, and the new client paid on the spot." },
  { img: "chase-coughlin", name: "Chase Coughlin", pre: "Client in ", accent: "week one.",
    sub: "Two courses finished and a first paying client, all in the first week." },
  { img: "diane-mccracken", name: "Diane McCracken", pre: "100 sessions ", accent: "at 68.",
    sub: "Her 100th Claude Code session, building automations at 68 years young." },
  { img: "wayne-dowden", name: "Wayne Dowden", pre: "Analyst ", accent: "to builder.",
    sub: "After 15 years designing systems, he finally builds them, and signed a monthly retainer." },
];
const WINS_PER_PASS = 4;

const SPOT_PER_PASS = 9;
const SPOT_INTROS = [
  { eyebrow: "TODAY'S SPEAKERS", pre: "Who's on ", accent: "today." },
  { eyebrow: "TODAY'S SPEAKERS", pre: "More of ", accent: "today's lineup." },
  { eyebrow: "TOMORROW · EARN DAY", pre: "And tomorrow, ", accent: "we earn." },
  { eyebrow: "TOMORROW · EARN DAY", pre: "More of ", accent: "tomorrow's lineup." },
];

// ---------------------------------------------------------------------------
// BEAT PROGRAM — one pass = Aidan's assembly order. Testimonial reel
// alternates per pass (#4 building / #5 earning) so the loop rotates proof.
// ---------------------------------------------------------------------------
function pass(n) {
  return [
    // ---- 1 · WELCOME TITLE / HYPE OPEN (Aidan's asset) ----
    ...(WELCOME ? [mount(WELCOME)]
      : [{ type: "ph", dur: 60, label: "Welcome Title / Hype Open",
           slot: "60 SECOND SLOT · PLAYS FIRST",
           note: "Drop your file at assets/video/welcome-open.mp4 and re-run _gen.mjs. It mounts here automatically." }]),

    // ---- 2 · TODAY'S SCHEDULE + AGENDA WALKTHROUGH ----
    mount(VID.agenda),

    // ---- 3 · GET SET UP (action prompts) ----
    mount(VID.setup),

    // ---- 4 · VIP PROMPT — Q&A live now ----
    mount(VID.vip),

    // ---- 5 · WHAT'S COMING TODAY (session teasers) ----
    mount(VID.teasers),

    // ---- 5b · SPEAKER SPOTLIGHTS — fresh slice of the roster every pass ----
    { type: "hero", dur: 4, ...SPOT_INTROS[n % SPOT_INTROS.length] },
    ...SPEAKERS.slice((n % 4) * SPOT_PER_PASS, (n % 4) * SPOT_PER_PASS + SPOT_PER_PASS)
      .map(c => ({ type: "portrait", dur: 7, ...c })),

    // ---- 6 · COMMUNITY TESTIMONIALS (rotating reels) ----
    { type: "hero", dur: 5, eyebrow: "FROM THE COMMUNITY",
      ...(n % 2 === 0 ? { pre: "Real members. ", accent: "Real numbers." } : { pre: "Real builds. ", accent: "Real paydays." }) },
    mount(n % 2 === 0 ? VID.building : VID.earning),
    // member win posts — fresh slice of 4 each pass, right after the reel
    ...WINS.slice((n % 4) * WINS_PER_PASS, (n % 4) * WINS_PER_PASS + WINS_PER_PASS)
      .map(w => ({ type: "win", dur: 8, ...w })),

    // ---- 7 · SPONSOR REEL — HyperAgent keynote (18:25, pass 1 only) + Glaido ----
    { type: "hero", dur: 5, eyebrow: "THANK YOU", pre: "The sponsors ", accent: "behind AIS LIVE." },
    ...(n === 0
      ? [mount(VID.keynote)]
      : [{ type: "sponsor", dur: 8, eyebrow: "PRESENTING SPONSOR",
           logos: [{ src: "hyperagent-white-big", hgt: 130, role: "PRESENTING SPONSOR" }] }]),
    { type: "sponsor", dur: 8, eyebrow: "OUR SPONSORS",
      logos: [{ src: "glaido-white", hgt: 150, role: "SPONSOR" }] },

    // ---- 8 · AIS+ MEMBERSHIP PITCH ----
    { type: "hero", dur: 5, eyebrow: "AIS+ MEMBERSHIP", plus: true,
      pre: "Why join. ", accent: "What's inside." },
    mount(VID.membership),

    // ---- 9 · seam back to the welcome (soft loop) ----
    { type: "markflash", dur: 7, sub: "Doors are open · Main stage at 10:15 CT" },
  ];
}

// ---------------------------------------------------------------------------
// ASSEMBLY — full passes while they fit, then a partial pass (in order,
// skipping anything that no longer fits), then the fixed outro. Pad rides the
// outro markflash so TOTAL lands on 2700s exactly.
// ---------------------------------------------------------------------------
const OUTRO = [
  { type: "hero", dur: 6, eyebrow: "MAIN STAGE · 10:15 AM", pre: "Welcome to ", accent: "AIS Live." },
  { type: "tagline", dur: 8, eyebrow: "STARTING NOW",
    pre: "Nate Herk takes ", accent: "the stage.", sub: "How you actually make money in AI services." },
  { type: "markflash", dur: 8, sub: "Day 1 · Build Day · Starting now" },
];
const sum = arr => arr.reduce((s, b) => s + b.dur, 0);
const outroDur = sum(OUTRO);

const BEATS = [];
let p = 0;
while (sum(BEATS) + sum(pass(p)) + outroDur <= TARGET) { BEATS.push(...pass(p)); p++; }
const PASSES = p;
// partial soft-loop pass — walk the next pass in order, keep whatever still fits
let partial = 0;
for (const b of pass(p)) {
  if (sum(BEATS) + b.dur + outroDur <= TARGET) { BEATS.push(b); partial++; }
}
// filler — soak any remaining slack, alternating speaker cards and member
// wins (continuing both pools from where the partial pass's slices ended)
let sf = ((p % 4) + 1) * SPOT_PER_PASS;
let wf = ((p % 4) + 1) * WINS_PER_PASS;
let fillers = 0;
while (fillers < SPEAKERS.length + WINS.length) {
  const wantWin = fillers % 2 === 1;
  const beat = wantWin
    ? { type: "win", dur: 8, ...WINS[wf % WINS.length] }
    : { type: "portrait", dur: 7, ...SPEAKERS[sf % SPEAKERS.length] };
  if (sum(BEATS) + beat.dur + outroDur > TARGET) break;
  BEATS.push(beat);
  if (wantWin) wf++; else sf++;
  fillers++;
}
BEATS.push(...OUTRO.map(b => ({ ...b })));
const pad = +(TARGET - sum(BEATS)).toFixed(3);
BEATS[BEATS.length - 1].dur += pad;

// ---------------------------------------------------------------------------
// scene HTML renderers
// ---------------------------------------------------------------------------
const wrapWords = (str, cls) => str.trim().split(/\s+/)
  .map(w => `<span class="wd ${cls || ""}">${w}</span>`).join("");

// AIS+ product mark is ALL WHITE, + included (directives) — inline it in copy
const plusMark = s => s.replace(/AIS\+/g, `<span class="plus">AIS<span class="p">+</span></span>`);

function headline(b) {
  const pre = b.pre ? wrapWords(b.pre) : "";
  const ac = b.accent ? wrapWords(b.accent, "ac") : "";
  const hero = b.type === "hero" || b.hero;
  return `<div class="ln${hero ? " hero" : ""}">${pre}${ac}</div>`;
}
const eyeb = b => b.eyebrow ? `<div class="eyebrow">${plusMark(b.eyebrow)}</div>` : "";
const sub = t => t ? `<div class="sub">${plusMark(t)}</div>` : "";

function sceneBody(b) {
  switch (b.type) {
    case "tagline": case "hero":
      return `${eyeb(b)}${headline(b)}${sub(b.sub)}`;

    case "portrait": {
      const list = b.faces;
      // solo -> full-height cutout; 2+ speakers -> circle-medallion column
      // (the announcement-card "circle format")
      let visual;
      if (list.length === 1) {
        const st = `height:${SQUARISH.has(list[0]) ? 88 : 96}%;width:auto;max-width:none`;
        visual = `<div class="portrait"><img src="assets/cutouts/${list[0]}.png" style="${st}" alt="" /></div>`;
      } else {
        const size = list.length === 2 ? 340 : list.length === 3 ? 280 : 220;
        const gap = list.length === 2 ? 30 : 20;
        visual = `<div class="pics" style="gap:${gap}px">${list.map(f =>
          `<img class="pic" src="assets/medallions/${f}.png" style="width:${size}px;height:${size}px" alt="" />`).join("")}</div>`;
      }
      const p0 = PEOPLE[list[0]] || { name: "", role: "" };
      const names = b.names || p0.name;
      const role = list.length === 1 && p0.role ? p0.role : "";
      const logo = b.logo ? `<div class="plogo"><img src="assets/sponsors/${b.logo}" alt="" /></div>` : "";
      return `${visual}
        <div class="pcontent">
          <div class="peyebrow">${b.tag}</div>
          ${logo}
          <div class="ptitle" style="font-size:${b.tsize}px">${wrapWords(b.title)}</div>
          <div class="pdivider"></div>
          <div class="pname"${names.length > 40 ? ' style="font-size:34px"' : ""}>${names}</div>
          ${role ? `<div class="prole">${role}</div>` : ""}
          <div class="phook">${plusMark(b.hook)}</div>
          <div class="pmeta">${b.meta}</div>
        </div>`;
    }

    case "win":
      return `<div class="winwrap">
          <div class="wintext">
            <div class="peyebrow">MEMBER WIN</div>
            <div class="winhead">${wrapWords(b.pre)}${wrapWords(b.accent, "ac")}</div>
            <div class="winsub">${plusMark(b.sub)}</div>
            <div class="winname">${b.name}</div>
          </div>
          <div class="winshot"><img src="assets/wins/${b.img}.png" alt="" /></div>
        </div>`;

    case "sponsor": {
      const logos = b.logos.map(l =>
        `<div class="logo"><div class="logobox"><img src="assets/sponsors/${l.src}.png" alt="" style="height:${l.hgt}px" /></div>${l.role ? `<div class="logorole">${l.role}</div>` : ""}</div>`).join("");
      return `${eyeb(b)}<div class="logorow">${logos}</div>${sub(b.caption)}`;
    }

    case "ph":
      return `<div class="phbox">
          <div class="pheyebrow">PLACEHOLDER · DROP-IN SLOT</div>
          <div class="phtitle">${b.label}</div>
          <div class="phslot">${b.slot}</div>
          <div class="phnote">${b.note}</div>
        </div>`;

    case "markflash":
      return `<div class="bigmark"><span class="mark big"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>${sub(b.sub)}`;
  }
  return "";
}

// ---------------------------------------------------------------------------
// build scenes + per-beat timeline
// ---------------------------------------------------------------------------
let t = 0;
const OVERLAP = 0.4;
const scenesHTML = [];
const rootHTML = [];  // mounted video stages (outside #camera — stay pin-sharp)
const audioHTML = []; // voice audio siblings for mounted pieces
const tj = [];
let mountN = 0;
const SEAMS = []; // segment start times, for verification

BEATS.forEach((b, idx) => {
  const start = t, s = `sc${idx}`, track = 12 + idx;
  const win = +(b.dur + OVERLAP).toFixed(3);
  const first = idx === 0, last = idx === BEATS.length - 1;
  const S = n => +(start + n).toFixed(3);
  SEAMS.push({ t: +start.toFixed(3), what: b.type === "mount" ? b.video.file : b.type === "ph" ? `ph:${b.label}` : b.type });

  // ---- MOUNTED PIECE — finished mp4 full-screen, poster/lastframe bracketed ----
  if (b.type === "mount") {
    const v = b.video, m = `mnt${mountN++}`;
    rootHTML.push(
`      <div id="${m}" class="mount">
        <img id="${m}-poster" class="mfill" src="assets/video/${v.file}-poster.jpg" alt="" />
        <video id="${m}-v" class="mfill" muted playsinline data-has-audio="false" src="assets/video/${v.file}.mp4" data-start="${S(0)}" data-duration="${v.dur}" data-track-index="${500 + mountN}"></video>
        <img id="${m}-last" class="mfill" src="assets/video/${v.file}-lastframe.jpg" alt="" />
      </div>`);
    if (v.audio) {
      audioHTML.push(`      <audio id="${m}-a" src="assets/video/${v.file}.mp4" data-start="${S(0)}" data-duration="${v.dur}" data-track-index="${560 + mountN}" data-volume="1"></audio>`);
    }
    tj.push(`      // ${s} · mount ${v.file}  (${b.dur}s${v.audio ? ", voice audio" : ""})`);
    tj.push(`      streak(${S(0)});`);
    tj.push(`      tl.set("#${m}", { autoAlpha: 0 }, 0);`);
    tj.push(`      tl.set("#${m}-last", { autoAlpha: 0 }, 0);`);
    tj.push(`      mountIn("#${m}", ${S(0)});`);
    tj.push(`      tl.set("#${m}-poster", { autoAlpha: 0 }, ${S(0.2)});`); // video is live by now
    tj.push(`      tl.set("#${m}-last", { autoAlpha: 1 }, ${S(v.dur - 0.04)});`); // cover video end
    tj.push(`      whipOut("#${m}", ${S(b.dur - 0.30)});`);
    tj.push(`      tl.set("#${m}", { autoAlpha: 0 }, ${S(b.dur)});`);
    tj.push(``);
    t += b.dur;
    return;
  }

  scenesHTML.push(
`      <section id="${s}" class="scene clip ${b.type === "portrait" ? "scene-portrait" : ""}" data-start="${+start.toFixed(3)}" data-duration="${win}" data-track-index="${track}">
        <div class="inner">
        ${sceneBody(b)}
        </div>
      </section>`);

  tj.push(`      // ${s} · ${b.type}  (${b.dur}s)`);
  if (!first) tj.push(`      streak(${S(0)});`);

  if (b.eyebrow) tj.push(`      drop("#${s} .eyebrow", ${S(0.12)});`);
  if (["tagline", "hero"].includes(b.type)) {
    tj.push(`      words("#${s} .ln .wd", ${S(0.24)});`);
  } else if (b.type === "portrait") {
    if (b.faces.length === 1) tj.push(`      rise("#${s} .portrait", ${S(0.16)});`);
    else tj.push(`      glowIn("#${s} .pic", ${S(0.16)}, 0.12);`);
    tj.push(`      drop("#${s} .peyebrow", ${S(0.22)});`);
    if (b.logo) tj.push(`      drop("#${s} .plogo", ${S(0.3)});`);
    tj.push(`      words("#${s} .ptitle .wd", ${S(0.36)});`);
    tj.push(`      wipe("#${s} .pdivider", ${S(0.72)});`);
    tj.push(`      drop("#${s} .pname", ${S(0.86)});`);
    tj.push(`      drop("#${s} .prole, #${s} .phook", ${S(1.0)});`);
    tj.push(`      drop("#${s} .pmeta", ${S(1.18)});`);
  } else if (b.type === "sponsor") {
    tj.push(`      glowIn("#${s} .logo", ${S(0.34)}, 0.14);`);
  } else if (b.type === "win") {
    tj.push(`      drop("#${s} .peyebrow", ${S(0.14)});`);
    tj.push(`      words("#${s} .winhead .wd", ${S(0.28)});`);
    tj.push(`      drop("#${s} .winsub", ${S(0.75)});`);
    tj.push(`      drop("#${s} .winname", ${S(0.92)});`);
    tj.push(`      shotIn("#${s} .winshot", ${S(0.4)});`);
    tj.push(`      drift("#${s} .winshot", ${S(1.8)}, ${+((b.dur - 2.4) / 4.8).toFixed(2)});`);
  } else if (b.type === "ph") {
    tj.push(`      phIn("#${s} .phbox", ${S(0.2)});`);
    tj.push(`      drop("#${s} .pheyebrow", ${S(0.45)});`);
    tj.push(`      drop("#${s} .phtitle", ${S(0.6)});`);
    tj.push(`      drop("#${s} .phslot", ${S(0.75)});`);
    tj.push(`      drop("#${s} .phnote", ${S(0.9)});`);
    tj.push(`      phPulse("#${s} .phbox", ${S(1.2)}, ${+((b.dur - 2) / 2.4).toFixed(2)});`);
  } else if (b.type === "markflash") {
    tj.push(`      markPop("#${s} .bigmark", ${S(0.22)});`);
  }
  if (b.sub) tj.push(`      drop("#${s} .sub", ${S(0.82)});`);

  if (last) tj.push(`      settleOut("#${s} .inner", ${S(b.dur - 0.9)});`);
  else tj.push(`      whipOut("#${s} .inner", ${S(b.dur - 0.30)});`);
  if (!last) tj.push(`      tl.set("#${s} .inner", { autoAlpha: 0 }, ${S(b.dur)});`);
  tj.push(``);

  t += b.dur;
});

const D = +t.toFixed(3);
if (Math.abs(D - TARGET) > 0.01) throw new Error(`duration drift: ${D} != ${TARGET}`);
writeFileSync(join(DIR, "_seams.json"), JSON.stringify(SEAMS, null, 2));

// ambient cycle counts — fixed short periods; even counts so yoyo ends at rest
const segs = approx => { let n = Math.round(D / approx); if (n % 2) n++; return n; };
const CAM = segs(30), BEAM = segs(25), FLICK = segs(6), GLOW = segs(30), VIG = segs(8.4);

// ---------------------------------------------------------------------------
// assemble
// ---------------------------------------------------------------------------
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — Block 1: Opening (${(D / 60).toFixed(1)} min)</title>
    <link href="assets/fonts/fonts.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
    <style>
      :root{
        --onyx:#07121c; --blue:#37bdf8; --coral:#ff8a5c; --red-live:#ff3b30; /* coral = ambient bg glow only */
        --font-display:"Montserrat",sans-serif; --font-body:"Inter",sans-serif; --font-mono:"JetBrains Mono",monospace;
      }
      *{margin:0;padding:0;box-sizing:border-box;}
      html,body{width:1920px;height:1080px;overflow:hidden;background:#000;color:#fff;font-family:var(--font-body);}
      #stage{position:relative;width:1920px;height:1080px;overflow:hidden;background:var(--onyx);
        isolation:isolate;perspective:1600px;perspective-origin:50% 44%;}
      #stage .clip{position:absolute;inset:0;width:1920px;height:1080px;pointer-events:none;}
      #camera{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform;}

      /* ---------- depth background ---------- */
      #bg{overflow:hidden;}
      .depth{position:absolute;left:-40%;right:-40%;height:78%;background-color:transparent;
        background-image:
          repeating-linear-gradient(0deg, rgba(55,189,248,.16) 0 1px, transparent 1px 66px),
          repeating-linear-gradient(90deg, rgba(55,189,248,.09) 0 1px, transparent 1px 66px);
        will-change:background-position;}
      .grid-floor{bottom:-14%;transform:perspective(680px) rotateX(66deg);transform-origin:50% 100%;
        -webkit-mask-image:linear-gradient(to top,#000 2%,rgba(0,0,0,.7) 32%,transparent 90%);
        mask-image:linear-gradient(to top,#000 2%,rgba(0,0,0,.7) 32%,transparent 90%);}
      .grid-ceiling{top:-14%;transform:perspective(680px) rotateX(-66deg);transform-origin:50% 0%;opacity:.6;
        -webkit-mask-image:linear-gradient(to bottom,#000 2%,rgba(0,0,0,.6) 30%,transparent 88%);
        mask-image:linear-gradient(to bottom,#000 2%,rgba(0,0,0,.6) 30%,transparent 88%);}
      .beam{position:absolute;top:-20%;left:50%;width:1400px;height:1200px;margin-left:-700px;
        background:conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(55,189,248,.14) 22deg, transparent 44deg);
        filter:blur(30px);opacity:.7;will-change:transform,opacity;}
      .glow{position:absolute;border-radius:50%;will-change:transform;}
      .glow.blue{top:-160px;left:50%;width:760px;height:760px;margin-left:-380px;background:var(--blue);filter:blur(155px);opacity:.18;}
      .glow.coral{bottom:-220px;right:-140px;width:620px;height:620px;background:var(--coral);filter:blur(165px);opacity:.11;}
      .vignette{position:absolute;inset:0;pointer-events:none;
        background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.62) 96%);will-change:opacity;}
      .grain{position:absolute;inset:0;opacity:.05;mix-blend-mode:screen;
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}
      .whip{position:absolute;top:50%;left:0;width:46%;height:10px;margin-top:-5px;opacity:0;
        background:linear-gradient(90deg,transparent,rgba(255,255,255,.95),rgba(55,189,248,.8),transparent);
        filter:blur(7px);will-change:transform,opacity;z-index:30;}

      /* ---------- scene ---------- */
      .scene{display:flex;align-items:center;justify-content:center;transform-style:preserve-3d;}
      .inner{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
        gap:34px;padding:96px 120px;text-align:center;transform-style:preserve-3d;will-change:transform,opacity;}

      .eyebrow{font-family:var(--font-mono);font-weight:700;font-size:27px;letter-spacing:.34em;text-transform:uppercase;
        color:var(--blue);display:inline-flex;align-items:center;gap:13px;text-shadow:0 0 16px rgba(55,189,248,.45);}

      .ln{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:122px;line-height:1.16;
        letter-spacing:-.03em;max-width:1600px;}
      .ln.hero{font-size:176px;}
      .ln .wd{display:inline-block;padding:.12em .15em .32em;will-change:transform,opacity;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .ln .wd.ac{background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(55,189,248,.62);}

      .sub{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:41px;line-height:1.25;
        color:rgba(209,220,232,.85);max-width:1440px;will-change:transform,opacity;}

      /* AIS+ product mark — ALL WHITE incl. the +, never tinted (directives) */
      .plus{font-family:var(--font-display);font-style:italic;font-weight:900;color:#fff;letter-spacing:-.02em;}
      .plus .p{color:#fff;}

      /* ---------- speaker spotlight (portrait) ---------- */
      .scene-portrait .inner{display:block;padding:0;text-align:left;}
      .portrait{position:absolute;left:-60px;top:40px;bottom:0;width:880px;
        display:flex;align-items:flex-end;justify-content:center;will-change:transform,opacity;}
      .portrait img{object-fit:contain;object-position:bottom center;
        filter:drop-shadow(0 26px 54px rgba(0,0,0,.55));
        -webkit-mask-image:
          linear-gradient(to bottom,#000 80%,transparent 100%),
          linear-gradient(to right,transparent 0%,#000 10%,#000 90%,transparent 100%);
        -webkit-mask-composite:source-in;
        mask-image:
          linear-gradient(to bottom,#000 80%,transparent 100%),
          linear-gradient(to right,transparent 0%,#000 10%,#000 90%,transparent 100%);
        mask-composite:intersect;}
      /* multi-speaker: circle-medallion column, vertically centered on the left */
      .pics{position:absolute;left:170px;top:0;bottom:40px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;}
      .pic{display:block;border-radius:50%;will-change:transform,opacity;
        filter:drop-shadow(0 18px 36px rgba(0,0,0,.55));}
      .pcontent{position:absolute;left:930px;right:110px;top:0;bottom:40px;
        display:flex;flex-direction:column;align-items:flex-start;justify-content:center;}
      .peyebrow{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.32em;text-transform:uppercase;
        color:var(--blue);margin-bottom:26px;text-shadow:0 0 16px rgba(55,189,248,.45);will-change:transform,opacity;}
      .plogo{margin-bottom:10px;will-change:transform,opacity;}
      .plogo img{height:60px;display:block;filter:drop-shadow(0 0 28px rgba(55,189,248,.30));}
      .ptitle{font-family:var(--font-display);font-style:italic;font-weight:900;letter-spacing:-.03em;
        line-height:1.1;color:#fff;max-width:840px;margin-left:-.15em;}
      .ptitle .wd{display:inline-block;padding:.12em .15em .32em;will-change:transform,opacity;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .pdivider{width:128px;height:2px;background:var(--blue);margin:26px 0 28px;
        box-shadow:0 0 16px rgba(55,189,248,.6);transform-origin:left center;will-change:transform,opacity;}
      .pname{font-family:var(--font-display);font-style:italic;font-weight:800;letter-spacing:-.02em;
        font-size:44px;color:#fff;line-height:1.15;max-width:840px;will-change:transform,opacity;}
      .prole{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:27px;
        letter-spacing:-.01em;color:rgba(209,220,232,.75);margin-top:8px;will-change:transform,opacity;}
      .phook{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:29px;line-height:1.3;
        color:rgba(209,220,232,.85);margin-top:14px;max-width:820px;will-change:transform,opacity;}
      .pmeta{font-family:var(--font-mono);font-weight:500;font-size:23px;letter-spacing:.22em;
        text-transform:uppercase;color:var(--blue);margin-top:32px;text-shadow:0 0 14px rgba(55,189,248,.4);will-change:transform,opacity;}

      /* ---------- member win card: summary left, post screenshot right ---------- */
      .winwrap{position:absolute;inset:0;display:flex;align-items:center;gap:70px;padding:80px 110px 90px 150px;}
      .wintext{flex:0 0 760px;display:flex;flex-direction:column;align-items:flex-start;text-align:left;}
      .winhead{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:76px;line-height:1.12;
        letter-spacing:-.03em;margin-left:-.15em;max-width:780px;}
      .winhead .wd{display:inline-block;padding:.12em .15em .32em;will-change:transform,opacity;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .winhead .wd.ac{background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(55,189,248,.62);}
      .winsub{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:31px;line-height:1.35;
        color:rgba(209,220,232,.85);margin-top:16px;max-width:720px;will-change:transform,opacity;}
      .winname{font-family:var(--font-mono);font-weight:500;font-size:24px;letter-spacing:.2em;text-transform:uppercase;
        color:var(--blue);margin-top:30px;text-shadow:0 0 14px rgba(55,189,248,.4);will-change:transform,opacity;}
      .winshot{flex:1;display:flex;align-items:center;justify-content:center;max-height:840px;
        will-change:transform,opacity;transform-style:preserve-3d;}
      .winshot img{max-width:100%;max-height:840px;object-fit:contain;border-radius:20px;
        border:1px solid rgba(255,255,255,.14);box-shadow:0 40px 90px rgba(0,0,0,.55), 0 0 60px rgba(55,189,248,.10);}

      /* sponsor logos (white on transparent) */
      .logorow{display:flex;gap:110px;justify-content:center;align-items:flex-start;}
      .logo{display:flex;flex-direction:column;align-items:center;gap:44px;will-change:transform,opacity;}
      .logobox{height:180px;display:flex;align-items:center;justify-content:center;}
      .logo img{width:auto;object-fit:contain;display:block;filter:drop-shadow(0 0 36px rgba(55,189,248,.28));}
      .logorole{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.24em;text-transform:uppercase;color:var(--blue);text-shadow:0 0 14px rgba(55,189,248,.4);}

      /* ---------- placeholder drop-in box ---------- */
      .phbox{width:1280px;padding:80px 90px;border-radius:26px;text-align:center;
        display:flex;flex-direction:column;align-items:center;gap:24px;
        border:3px dashed rgba(55,189,248,.55);background:rgba(9,20,32,.55);
        box-shadow:0 0 60px rgba(55,189,248,.12), inset 0 0 80px rgba(55,189,248,.05);
        will-change:transform,opacity;}
      .pheyebrow{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.34em;text-transform:uppercase;
        color:var(--blue);text-shadow:0 0 16px rgba(55,189,248,.45);will-change:transform,opacity;}
      .phtitle{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:92px;line-height:1.1;
        letter-spacing:-.03em;color:#fff;padding:0 .1em .12em;text-shadow:0 0 40px rgba(255,255,255,.2);will-change:transform,opacity;}
      .phslot{font-family:var(--font-mono);font-weight:700;font-size:24px;letter-spacing:.26em;text-transform:uppercase;
        color:rgba(209,220,232,.65);will-change:transform,opacity;}
      .phnote{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:30px;line-height:1.35;
        color:rgba(209,220,232,.75);max-width:1000px;will-change:transform,opacity;}

      /* mounted finished pieces — full-frame, above the camera scenes */
      .mount{position:absolute;inset:0;background:#000;will-change:transform,opacity,filter;z-index:20;}
      .mfill{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}

      /* mark */
      .backdrop-mark{position:absolute;right:72px;bottom:60px;display:inline-flex;z-index:6;}
      .bigmark{display:inline-flex;will-change:transform,opacity,filter;}
      .mark{font-family:var(--font-display);font-style:italic;font-weight:900;letter-spacing:-.03em;line-height:.9;
        font-size:92px;display:inline-flex;align-items:baseline;position:relative;}
      .mark.big{font-size:262px;}
      .mark .ais{color:#fff;}
      .mark .gap{display:inline-block;width:.08em;}
      .live{position:relative;color:var(--blue);text-shadow:0 0 60px rgba(55,189,248,.55);padding-right:.28em;}
      .dot{position:absolute;top:.08em;left:100%;margin-left:.06em;width:.16em;height:.16em;border-radius:50%;
        background:var(--red-live);box-shadow:0 0 .7em #ff3b30,0 0 .25em #ff3b30;}
      .ring{position:absolute;top:.08em;left:100%;margin-left:.06em;width:.16em;height:.16em;border-radius:50%;
        background:rgba(255,59,48,.55);opacity:0;transform-origin:50% 50%;pointer-events:none;}
    </style>
  </head>
  <body>
    <div id="stage" data-composition-id="cmp-block1-opening" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
      <div id="bg" class="clip" data-start="0" data-duration="${D}" data-track-index="0">
        <div class="depth grid-ceiling"></div>
        <div class="depth grid-floor"></div>
        <div class="beam"></div>
        <div class="glow blue"></div>
        <div class="glow coral"></div>
        <div class="vignette"></div>
        <div class="grain"></div>
      </div>
      <div class="whip clip" id="whip" data-start="0" data-duration="${D}" data-track-index="1"></div>
      <div id="markbug" class="clip" data-start="0" data-duration="${D}" data-track-index="2">
        <div class="backdrop-mark"><span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>
      </div>

      <div id="camera">
${scenesHTML.join("\n")}
      </div>
${rootHTML.join("\n")}
${audioHTML.join("\n")}
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const D = ${D};
      const tl = gsap.timeline({ paused: true });

      /* ---- reveal / transition helpers (all fromTo so nothing is left invisible) ---- */
      function drop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:d||.5,ease:"power2.out"},at); }
      function words(sel, at){ tl.fromTo(sel,{autoAlpha:0,yPercent:110,scale:.92},
        {autoAlpha:1,yPercent:0,scale:1,duration:.46,ease:"expo.out",stagger:.05,transformOrigin:"50% 100%"},at); }
      function markPop(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:.6,filter:"blur(18px) brightness(2.6)"},
        {autoAlpha:1,scale:1,filter:"blur(0px) brightness(1)",duration:.8,ease:"back.out(1.5)",transformOrigin:"50% 50%"},at); }
      function rise(sel, at){ tl.fromTo(sel,{autoAlpha:0,y:110,filter:"blur(10px)"},
        {autoAlpha:1,y:0,filter:"blur(0px)",duration:.7,ease:"power3.out"},at); }
      function wipe(sel, at){ tl.fromTo(sel,{autoAlpha:0,scaleX:0},{autoAlpha:1,scaleX:1,duration:.55,ease:"power2.out"},at); }
      function glowIn(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,scale:.7,filter:"brightness(2.4) blur(6px)"},
        {autoAlpha:1,scale:1,filter:"brightness(1) blur(0px)",duration:.7,ease:"back.out(1.4)",stagger:step||.12},at); }
      function shotIn(sel, at){ tl.fromTo(sel,{autoAlpha:0,x:70,rotationY:-14,filter:"blur(8px)"},
        {autoAlpha:1,x:0,rotationY:0,filter:"blur(0px)",duration:.65,ease:"power3.out"},at); }
      function drift(sel, at, cycles){ tl.to(sel,{y:"-=10",duration:2.4,yoyo:true,repeat:Math.max(1,Math.round(cycles*2)-1),
        ease:"sine.inOut"},at); }
      function phIn(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:.92,y:30},
        {autoAlpha:1,scale:1,y:0,duration:.6,ease:"power3.out",transformOrigin:"50% 50%"},at); }
      // slow breathing on the dashed box so the drop-in slot reads alive, not broken
      function phPulse(sel, at, cycles){ tl.to(sel,{borderColor:"rgba(55,189,248,.25)",duration:2.4,yoyo:true,
        repeat:Math.max(1,Math.round(cycles*2)-1),ease:"sine.inOut"},at); }
      function whipOut(sel, at){ tl.to(sel,{autoAlpha:0,y:-155,filter:"blur(30px)",duration:.26,ease:"power2.in"},at); }
      function settleOut(sel, at){ tl.to(sel,{autoAlpha:0,filter:"blur(12px)",duration:.8,ease:"power2.in"},at); }
      function mountIn(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:1.045,filter:"blur(14px)"},
        {autoAlpha:1,scale:1,filter:"blur(0px)",duration:.5,ease:"power2.out",transformOrigin:"50% 50%"},at); }
      function streak(at){
        tl.fromTo("#whip",{xPercent:-130,scaleX:.5,autoAlpha:0},{autoAlpha:.95,duration:.1,ease:"none",immediateRender:false,overwrite:"auto"},at-0.05);
        tl.to("#whip",{xPercent:270,scaleX:1.7,autoAlpha:0,duration:.34,ease:"power3.in",overwrite:"auto"},at+0.02);
      }

      /* ---- AMBIENT — short fixed cycles, even counts so yoyo ends at rest ---- */
      tl.to("#camera", { scale:1.035, y:-16, duration:D/${CAM}, yoyo:true, repeat:${CAM - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.to(".grid-floor",   { backgroundPositionY:"+=1716px", duration:D, ease:"none" }, 0);
      tl.to(".grid-ceiling", { backgroundPositionY:"-=1716px", duration:D, ease:"none" }, 0);
      tl.to(".beam",     { rotation:8, duration:D/${BEAM}, yoyo:true, repeat:${BEAM - 1}, ease:"sine.inOut", transformOrigin:"50% 0%" }, 0);
      tl.to(".beam",     { opacity:.4, duration:D/${FLICK}, yoyo:true, repeat:${FLICK - 1}, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue",{ x:44, y:-24, duration:D/${GLOW}, yoyo:true, repeat:${GLOW - 1}, ease:"sine.inOut" }, 0);
      tl.to(".glow.coral",{ x:-36, y:22, duration:D/${GLOW}, yoyo:true, repeat:${GLOW - 1}, ease:"sine.inOut" }, 0);
      tl.to(".vignette", { opacity:.9, duration:D/${VIG}, yoyo:true, repeat:${VIG - 1}, ease:"sine.inOut" }, 0);
      tl.to(".dot", { scale:1.1, duration:.8, yoyo:true, repeat:${Math.round(TARGET / 0.8) - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.fromTo(".ring", { scale:1, autoAlpha:0 }, { keyframes:[
        { autoAlpha:.5, scale:1, duration:.001 },
        { autoAlpha:0, scale:2.6, duration:.999, ease:"power2.out" },
        { autoAlpha:0, scale:1, duration:.6 }
      ], repeat:${Math.round(TARGET / 1.6) - 1}, ease:"none" }, 0);

      /* ---- SCENES ---- */
${tj.join("\n")}
      tl.to({}, { duration: D }, 0); // fill the slot
      window.__timelines["cmp-block1-opening"] = tl;
    <\/script>
  </body>
</html>
`;

writeFileSync(join(SRC, "block1-opening.html"), html);
console.log(`wrote cards/block1-opening.html — ${BEATS.length} beats · ${PASSES} full passes + ${partial}-beat partial pass + outro · ${D}s (${(D / 60).toFixed(2)} min) · pad ${pad}s`);
console.log(`placeholders: ${WELCOME ? "welcome MOUNTED" : "WELCOME box"} · HyperAgent keynote MOUNTED (18:25, pass 1) · Clay removed (not a sponsor)`);
if (process.argv.includes("--set")) {
  copyFileSync(join(SRC, "block1-opening.html"), join(DIR, "index.html"));
  console.log("index.html <- cards/block1-opening.html");
}
