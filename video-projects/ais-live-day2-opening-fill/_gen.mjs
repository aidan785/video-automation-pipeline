// AIS LIVE — Block 5: DAY 2 OPENING (main stage / lobby, 8:30-9:45 AM Day 2).
// Brief (rev. 2026-07-11): a SINGLE exactly-75:00 build that plays once,
// 8:30 -> 9:45 (this replaces the separate morning-fill block — no dead gap;
// Nate opens live at 9:45, HyperAgent workshop at 10:00). Six varied passes
// of the production order, outro lands on 9:45.
// rev. 2026-07-11 (Aidan): the 18:25 HyperAgent keynote is REMOVED from this
// block entirely; the freed time carries the new DAY 1 RECAP session clips —
// 19 word-accurate clips cut from the real Day 1 recordings (Liberty White's
// Foundation workshop, Dave Ebbelaar's Advanced workshop, the Scope-to-Ship
// VIP session), presented in the community-testimonial format (rounded 16:9
// slot + name/role/quote), voice audio on.
//   1. DAY 1 RECAP    — v7.1 verbatim agenda + verified quotes/stats + the
//                       Day 1 session clips (recap-*.mp4, assets/recap/)
//   2. TODAY          — Day 2 agenda (v7.1; Clay lunch row dropped — Clay is out
//                       event-wide per Aidan 2026-07-07; 5 VIP rooms collapsed
//                       to one row) + Nate 9:45 / HyperAgent 10:00 wayfinding
//   3. GET SET UP     — agenda / booths / networking (copy from the approved
//                       Block 1 get-set-up walkthrough)
//   4. AIS+           — membership ad, mounted (66s, voice audio), every pass
//   5. CERTIFICATION  — the CAIC cert launch video (Block 4's cert-launch.mp4)
//                       mounts on alternating passes; authored verified-facts
//                       beats in between
//   6. SPONSOR REEL   — HyperAgent 60s (finished-looking logo spotlight until
//                       the spot lands) + Glaido. NO Clay (Aidan 2026-07-08).
//   7. TESTIMONIALS   — community reels (#4 building / #5 earning, alternating)
//      + MEMBER WINS  — 4 real win-post screenshots per pass (24 placements of
//                       the 16 verified Block 1 win cards, Aidan 2026-07-08)
//
// AUDIO: mounted pieces (AIS+ ad, testimonial reels, cert video, Day 1 recap
// clips; HyperAgent 60s when it lands) keep their voice audio; every authored
// card is silent — the venue runs a music bed underneath.
//
//   node _gen.mjs         -> writes cards/day2-opening-fill.html
//   node _gen.mjs --set   -> also copies it to index.html (active for preview/render)

import { writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const SRC = join(DIR, "cards");
mkdirSync(SRC, { recursive: true });

const TARGET = 4500; // 75:00 exactly — plays once, fills the 8:30-9:45 window
const PASSES = 6;

// ---------------------------------------------------------------------------
// MOUNTED VIDEO PIECES — probed at gen time so re-rendered pieces stay exact.
// Durations floor-snapped to the 30fps frame grid.
// ---------------------------------------------------------------------------
const probe = (f, sub = "video") => {
  const d = +execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${join(DIR, "assets", sub, f)}"`).toString().trim();
  return Math.floor(d * 30) / 30;
};
const MOUNT_HOLD = 0.4; // lastframe hold at the tail so the exit whip rides a real frame
const VID = {
  membership: { file: "ais-plus-membership", dur: probe("ais-plus-membership.mp4"), audio: true },
  building:   { file: "testi-building",      dur: probe("testi-building.mp4"),      audio: true },
  earning:    { file: "testi-earning",       dur: probe("testi-earning.mp4"),       audio: true },
  // NOTE (Aidan 2026-07-11): the 18:25 HyperAgent keynote is OUT of this block.
  // assets/video/hyperagent-keynote.mp4 stays on disk (Block 1 standalone use).
};
// HyperAgent's 60s sponsor spot is sponsor-provided and not delivered yet.
// Drop it at assets/video/hyperagent-60.mp4 (+ poster/lastframe jpgs) and re-run
// _gen.mjs --set — it mounts in every pass, replacing the logo spotlight 1:1.
const H60 = existsSync(join(DIR, "assets/video/hyperagent-60.mp4"))
  ? { file: "hyperagent-60", dur: probe("hyperagent-60.mp4"), audio: true }
  : null;
// Russ's AIS Certification launch video (#7) — Drive folder 7 still empty as of
// 2026-07-08. Drop it at assets/video/cert-launch.mp4 (+ poster/lastframe jpgs)
// and re-run _gen.mjs --set — it mounts 1:1 in the cert segment of every pass.
const CERT = existsSync(join(DIR, "assets/video/cert-launch.mp4"))
  ? { file: "cert-launch", dur: probe("cert-launch.mp4"), audio: true }
  : null;

// ---------------------------------------------------------------------------
// DAY 1 RECAP — Agenda v7.1 (doc 1TnnCp3zNzf2JgP5I2_iL347rDH2Raa5fV1DcSMKTL18)
// session titles + times verbatim (same rows as Block 4's recap)
// ---------------------------------------------------------------------------
const RECAP = [
  { t: "10:15 AM", label: "Welcome to AIS LIVE" },
  { t: "10:30 AM", label: "Anatomy of Three Real Deals" },
  { t: "11:40 AM", label: "The New Standard: A Fleet of Always-On Agents" },
  { t: "12:20 PM", label: "Evals, Live" },
  { t: "12:45 PM", label: "Workshop Block 1 (Foundation + Advanced)" },
  { t: "2:35 PM",  label: "Run an Entire AI Agency Using Claude Code" },
  { t: "3:10 PM",  label: "Workshop Block 2 (Foundation + Advanced)" },
  { t: "4:20 PM",  label: "Workshop 3: Enterprise AI Services" },
  { t: "5:05 PM",  label: "Get AIS Certified" }, // "AIS Certified", NOT AIS+ (Aidan 2026-07-08)
  { t: "5:20 PM",  label: "Day 1 Closing Remarks" },
];

// ---------------------------------------------------------------------------
// DAY 2 — v7.1 (doors-open-loop DAY2_SCHED), edits: Clay lunch row DROPPED
// (Clay out event-wide, Aidan 2026-07-07/08), 5 VIP 1:35 rooms collapsed to one.
// ---------------------------------------------------------------------------
const DAY2 = [
  { t: "8:30 AM",  label: "Virtual Doors Open + Expo" },
  { t: "9:00 AM",  label: "Morning Expo + Networking" },
  { t: "9:45 AM",  label: "Day 2 Open: Turn This Into Money" },
  { t: "10:00 AM", label: "HyperAgent Workshop: Build an Agent Fleet" },
  { t: "11:10 AM", label: "The Tool War Panel" },
  { t: "11:50 AM", label: "Where Your First 10 Clients Are Hiding" },
  { t: "12:30 PM", label: "The Sales Arc, LIVE" },
  { t: "1:35 PM",  label: "Lunch + Discovery Call Practice" },
  { t: "1:35 PM",  label: "VIP Working Sessions (5 Rooms)" },
  { t: "2:10 PM",  label: "Sales Call Recap + Intro to Pricing" },
  { t: "2:25 PM",  label: "Ditching Hourly: The Pricing Mindset" },
  { t: "3:10 PM",  label: "What Companies Are Actually Buying in AI" },
  { t: "3:55 PM",  label: "Live Debrief: What Buyers Want" },
  { t: "4:05 PM",  label: "The Client Didn't Ask for AI" },
  { t: "4:05 PM",  label: "VIP Pricing War Room" },
  { t: "4:35 PM",  label: "Live Debrief: Pricing Reflections" },
  { t: "4:45 PM",  label: "What Actually Matters in AI Right Now" },
  { t: "5:15 PM",  label: "Closing Keynote: Build to Sell" },
  { t: "5:45 PM",  label: "Nate's Close + AIS+ Pitch" },
  { t: "6:10 PM",  label: "VIP After-Party with Nate" },
];
const DAY2_A = DAY2.slice(0, 10), DAY2_B = DAY2.slice(10);

// verified member quotes (testimonial-soundbites shortlist, face-checked set used in #1)
const QUOTES = [
  { eyebrow: "FROM THE COMMUNITY",   quote: "In six weeks I landed two contracts worth nearly $20,000. And the sky's the limit.", attrib: "Amy Simpson" },
  { eyebrow: "MEMBER WIN",           quote: "Six months of engineering work, compressed into one afternoon.",                     attrib: "Duy Nguyen" },
  { eyebrow: "WHY WE'RE HERE",       quote: "I found my home. I found my tribe.",                                                 attrib: "Tonia Hardeman" },
  { eyebrow: "MEMBER WIN",           quote: "Every client came to me. I never sent a single cold DM.",                            attrib: "Abdurrahman Ibrahim" },
  { eyebrow: "FROM LAID OFF TO HIRED", quote: "In a month and a half, I went from being laid off to having a job.",               attrib: "Griffin Maklansky" },
  { eyebrow: "CAREER SHIFT",         quote: "I actually got my dream role: head of AI.",                                          attrib: "Pedro Gomez" },
  { eyebrow: "THE VERDICT",          quote: "The best money I've ever spent on any community.",                                   attrib: "Nick Mohler" },
];
// verified stats (the #1/Blocks 2-4 set), labels in Day-2-morning tense
const STATS = [
  { kicker: "YESTERDAY AT AIS LIVE",    num: "1600+", unit: "BUILDERS IN THE ROOM",  sub: "Day 1, together. Day 2 starts now." },
  { kicker: "SHIPPED BY THE COMMUNITY", num: "100K+", unit: "AUTOMATIONS SHIPPED",   sub: "Real workflows. Real businesses." },
  { kicker: "MEMBERS WORLDWIDE",        num: "400K+", unit: "BUILDERS STRONG",       sub: "One community. Every timezone." },
  { kicker: "ON STAGE THIS WEEKEND",    num: "25+",   unit: "SPEAKERS",              sub: "Founders, operators, and closers." },
  { kicker: "ACROSS TWO DAYS",          num: "30+",   unit: "LIVE SESSIONS",         sub: "Talks, panels, and hands-on workshops." },
  { kicker: "THE WORLD IS WATCHING",    num: "40M+",  unit: "VIEWS & COUNTING",      sub: "They watch. We build." },
];

// ---------------------------------------------------------------------------
// MEMBER WINS — real community win posts (the verified Block 1 set: screenshots
// from Yash's wins folder, summaries with numbers verbatim from the posts).
// 4 per pass right after the testimonial reel -> 24 placements across 6 passes
// (all 16 shown at least once, the first 8 twice). Aidan: 20+ scattered.
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

// ---------------------------------------------------------------------------
// BEAT PROGRAM — 3 varied passes of the production order, filler-tuned to
// exactly TARGET, calm markflash loop seam at the end of the build.
// ---------------------------------------------------------------------------
// cert video (the CAIC launch video from Block 4) mounts on alternating passes;
// authored verified-facts beats hold the segment in between — launched Day 1,
// 5:05 PM, main stage. Never a dashed placeholder on stage.
const certSegment = (i) => (CERT && i % 2 === 0)
  ? [
      { type: "tagline", dur: 9, eyebrow: "AIS CERTIFICATION", pre: "Get AIS ", accent: "Certified.", sub: "The AIS Certification Programme, launched yesterday on the main stage." },
      { type: "mount", video: CERT, dur: +(CERT.dur + MOUNT_HOLD).toFixed(3) },
    ]
  : [
      { type: "tagline", dur: 9, eyebrow: "AIS CERTIFICATION", pre: "Get AIS ", accent: "Certified.", sub: "The AIS Certification Programme, launched yesterday on the main stage." },
      { type: "action", dur: 9, eyebrow: "LAUNCHED DAY 1 · 5:05 PM", pre: "Certification is ", accent: "live.", sub: "Launched at AIS LIVE. Ask the AIS+ team." },
    ];

// every pass runs the 60s spotlight slot (real spot swaps in 1:1 when it lands)
// — the 18:25 keynote that pass 3 used to carry is out (Aidan 2026-07-11)
const sponsorSegment = () => [
  { type: "hero", dur: 6, eyebrow: "THANK YOU", pre: "The sponsors ", accent: "behind AIS LIVE." },
  ...(H60
    ? [{ type: "mount", video: H60, dur: +(H60.dur + MOUNT_HOLD).toFixed(3) }]
    : [{ type: "sponsor", dur: 60, eyebrow: "OUR SPONSORS", logos: [{ src: "hyperagent-white-big", hgt: 130, role: "PRESENTING SPONSOR" }] }]),
  { type: "sponsor", dur: 12, eyebrow: "OUR SPONSORS", logos: [{ src: "glaido-white", hgt: 150, role: "SPONSOR" }] },
];

// ---------------------------------------------------------------------------
// DAY 1 RECAP SESSION CLIPS (Aidan 2026-07-11) — 19 word-accurate clips cut
// from the real Day 1 recordings (cutter: ais-live-day2-sizzle-clips/
// _cut-recap.mjs; shortlist: CLIP-CANDIDATES.md). Presented in the community-
// testimonial format: rounded 16:9 slot left, name/role/quote right, voice
// audio on. VIP clips are single-speaker crops; workshop clips are the full
// frame (Dave's slides pair with his audio; Liberty's are her Q&A camera).
// ---------------------------------------------------------------------------
const RECAP_WHO = {
  dave:    { name: "Dave Ebbelaar",  role: "AI ENGINEER · DATALUMINA",   tag: "DAY 1 · LOW-CODE TO FULL-CODE" },
  liberty: { name: "Liberty White",  role: "FOUNDER · SHE LEARNS AI",    tag: "DAY 1 · FIRST 30 DAYS IN AI AUTOMATION" },
  kodi:    { name: "Kodi Zene",      role: "AIS LIVE EVENT TEAM",        tag: "DAY 1 · VIP: SCOPE TO SHIP" },
  mustafa: { name: "Mustafa Tawfiq", role: "AIS LIVE EVENT TEAM",        tag: "DAY 1 · VIP: SCOPE TO SHIP" },
  sabrina: { name: "Sabrina Ramonov", role: "FOUNDER · BLOTATO",         tag: "DAY 1 · YOUR FIRST AI CONTENT ENGINE" },
};
const RECAPS = Object.fromEntries([
  ["dave-no-code-6mo",        "dave",    "I haven't written a single line of code in over six months."],
  ["liberty-tribe",           "liberty", "People are waiting for your opinion. Your tribe will find you."],
  ["kodi-api-cost",           "kodi",    "Never eat the API cost. Make it pass-through."],
  ["dave-13-years",           "dave",    "What you can do right now with AI is insane."],
  ["mustafa-done",            "mustafa", "Both of you have to know when it ends."],
  ["kodi-value-lens",         "kodi",    "Price the value it brings, not your time."],
  ["dave-atomic",             "dave",    "The most important skill: thinking in atomic building blocks."],
  ["liberty-decision-maker",  "liberty", "Find the decision maker. That is the biggest thing."],
  ["mustafa-scoping",         "mustafa", "Imagine yourself inside the build. Go deep."],
  ["dave-better-time",        "dave",    "There has never been a better time to learn how to code."],
  ["kodi-transparent",        "kodi",    "AI is not free. Your client should never think it is."],
  ["dave-backend-5min",       "dave",    "Your first Python backend, in five minutes."],
  ["dave-postgres",           "dave",    "Postgres is all you need."],
  ["liberty-constraints",     "liberty", "Always give it your constraints."],
  ["mustafa-value",           "mustafa", "What matters is the value you deliver."],
  ["dave-think-like-dev",     "dave",    "You already think like a developer."],
  ["dave-pricing",            "dave",    "Hourly billing is broken. Quote a fixed-price prototype."],
  ["kodi-scope-clause",       "kodi",    "Get the clause into the signed agreement."],
  ["dave-peaceful",           "dave",    "Beneath the new tools, things are stable."],
  ["sabrina-intro",           "sabrina", "I treat marketing like a systems engineering problem."],
  ["sabrina-zero-edits",      "sabrina", "Zero edits. And the post is going viral."],
  ["sabrina-every-biz",       "sabrina", "Social media is a free marketing channel."],
  ["sabrina-referral-demand", "sabrina", "Users ask me to refer them an AI consultant."],
  ["sabrina-testimonial-content", "sabrina", "Every testimonial a business gets is a piece of content."],
  ["sabrina-done-for-you",    "sabrina", "Pitch me something? It better be done for you."],
  ["sabrina-niche-research",  "sabrina", "The algorithm shoves the research in your face."],
  ["sabrina-hyperframes",     "sabrina", "HyperFrames is the iPhone. Skip Remotion."],
].map(([id, who, quote]) => [id, {
  file: `recap-${id}`, dur: probe(`recap-${id}.mp4`, "recap"), ...RECAP_WHO[who], quote,
}]));
// per-pass deal — every clip exactly once, sources interleaved within a pass
const RECAP_DEAL = [
  ["dave-no-code-6mo", "liberty-tribe", "sabrina-intro", "kodi-api-cost"],
  ["dave-13-years", "sabrina-hyperframes", "mustafa-done", "kodi-value-lens"],
  ["dave-atomic", "sabrina-every-biz", "liberty-decision-maker", "mustafa-scoping"],
  ["dave-better-time", "sabrina-zero-edits", "kodi-transparent", "dave-backend-5min", "sabrina-niche-research"],
  ["dave-postgres", "sabrina-testimonial-content", "liberty-constraints", "mustafa-value", "dave-think-like-dev"],
  ["dave-pricing", "sabrina-referral-demand", "kodi-scope-clause", "sabrina-done-for-you", "dave-peaceful"],
];
const RECAP_LEADS = [
  { eyebrow: "DAY 1 · FROM THE STAGE", pre: "The moments worth ", accent: "replaying.", sub: "Real clips from yesterday's sessions." },
  { eyebrow: "DAY 1 RECAP", pre: "Straight from ", accent: "the speakers.", sub: "In their own words, from the Day 1 stage." },
  { eyebrow: "DAY 1 · FROM THE STAGE", pre: "The knowledge kept ", accent: "coming.", sub: "More from yesterday's sessions." },
  { eyebrow: "DAY 1 RECAP", pre: "Yesterday had ", accent: "range.", sub: "Workshops, working sessions, and the main stage." },
  { eyebrow: "DAY 1 · FROM THE STAGE", pre: "Catch what you ", accent: "missed.", sub: "Two tracks ran at once. Here's the other room." },
  { eyebrow: "DAY 1 RECAP", pre: "One more look ", accent: "back.", sub: "Then it's all about earning." },
];
const RECAP_LEAD_IN = 0.9, RECAP_TAIL = 0.9; // card entrance before the clip, settle after

const setupSegment = () => [
  { type: "hero", dur: 7, eyebrow: "WHILE YOU WAIT · GET SET UP", pre: "First things ", accent: "first.", sub: "Get set up in three quick moves." },
  { type: "step", dur: 6, num: "01", eyebrow: "STEP 01 OF 03", pre: "Build your ", accent: "agenda." },
  { type: "rows", dur: 10, eyebrow: "STEP 01 · YOUR AGENDA", rows: [
      "Open the Agenda tab",
      "Star the sessions you don't want to miss",
      "Pick your workshop track",
    ], sub: "Foundation or Advanced. Choose the room that matches where you are." },
  { type: "step", dur: 6, num: "02", eyebrow: "STEP 02 OF 03", pre: "Visit the ", accent: "booths." },
  { type: "sponsor", dur: 10, eyebrow: "STEP 02 · THE EXPO IS OPEN", logos: [
      { src: "hyperagent-white-big", hgt: 110, role: "PRESENTING SPONSOR" },
      { src: "glaido-white", hgt: 130, role: "SPONSOR" },
    ], caption: "Stop by the sponsor booths. Live demos all weekend." },
  { type: "step", dur: 6, num: "03", eyebrow: "STEP 03 OF 03", pre: "Meet people in ", accent: "Networking." },
  { type: "rows", dur: 10, eyebrow: "STEP 03 · SAY HI", rows: [
      "Complete your profile",
      "Jump into the Networking room",
      "Introduce yourself to three people",
    ], sub: "You'll be earning alongside these people all day." },
];

// per-pass varied copy
const P = [
  { // ---- PASS 1 ----
    open: [
      { type: "hero", dur: 6, eyebrow: "AIS LIVE · DAY 2", pre: "Good ", accent: "morning." },
      { type: "tagline", dur: 9, eyebrow: "SUNDAY · JULY 12 · EARN DAY", pre: "Build day is done. ", accent: "Now let's get paid.", sub: "Welcome to Day 2 of AIS LIVE." },
    ],
    recapHero: { type: "hero", dur: 5, eyebrow: "DAY 1 · THE RECAP", pre: "Look at what we ", accent: "covered." },
    recapQ: [QUOTES[1], QUOTES[0]], recapS: STATS[0],
    todayHero: { type: "hero", dur: 5, eyebrow: "TODAY", pre: "Here's what's ", accent: "coming." },
    plusLead: { type: "tagline", dur: 8, eyebrow: "AIS+ MEMBERS", pre: "Built yesterday? ", accent: "Get paid next.", sub: "One minute on what AIS+ unlocks." },
    testi: "building",
    testiLead: { type: "tagline", dur: 8, eyebrow: "THE COMMUNITY", pre: "They built ", accent: "it.", sub: "Real members, in their own words." },
    reset: [
      { type: "action", dur: 9, eyebrow: "9:45 AM · MAIN STAGE", pre: "Nate opens Day 2 ", accent: "at 9:45.", sub: "Day 2 Open: Turn This Into Money" },
    ],
  },
  { // ---- PASS 2 ----
    open: [
      { type: "hero", dur: 6, eyebrow: "AIS LIVE · DAY 2", pre: "Welcome ", accent: "back." },
      { type: "tagline", dur: 9, eyebrow: "SUNDAY · JULY 12", pre: "It's ", accent: "Earn Day.", sub: "Market. Sales. Pricing. Delivery." },
    ],
    recapHero: { type: "hero", dur: 5, eyebrow: "YESTERDAY", pre: "Day 1 is ", accent: "in the books." },
    recapQ: [QUOTES[4], QUOTES[2]], recapS: STATS[1],
    todayHero: { type: "hero", dur: 5, eyebrow: "THE PLAN", pre: "Today we turn this ", accent: "into money." },
    plusLead: { type: "tagline", dur: 8, eyebrow: "AIS+ MEMBERS", pre: "Don't do this ", accent: "alone.", sub: "One minute on what AIS+ unlocks." },
    testi: "earning",
    testiLead: { type: "tagline", dur: 8, eyebrow: "THE COMMUNITY", pre: "They're getting ", accent: "paid.", sub: "Real members. Real revenue." },
    reset: [
      { type: "action", dur: 9, eyebrow: "10:00 AM · SPONSORED WORKSHOP", pre: "HyperAgent workshop ", accent: "at 10:00.", sub: "Build an agent fleet, live." },
    ],
  },
  { // ---- PASS 3 ----
    open: [
      { type: "hero", dur: 6, eyebrow: "AIS LIVE · DAY 2", pre: "Day 2 ", accent: "is here." },
      { type: "tagline", dur: 9, eyebrow: "SUNDAY · JULY 12 · EARN DAY", pre: "You built it. ", accent: "Now sell it.", sub: "Day 2 is about getting paid for the work." },
    ],
    recapHero: { type: "hero", dur: 5, eyebrow: "DAY 1 · THE RECAP", pre: "Yesterday, you ", accent: "built." },
    recapQ: [QUOTES[3], QUOTES[6]], recapS: STATS[2],
    todayHero: { type: "hero", dur: 5, eyebrow: "TODAY", pre: "One day. ", accent: "All signal." },
    plusLead: { type: "tagline", dur: 8, eyebrow: "AIS+ MEMBERS", pre: "Keep this going ", accent: "after the weekend.", sub: "One minute on what AIS+ unlocks." },
    testi: "building",
    testiLead: { type: "tagline", dur: 8, eyebrow: "THE COMMUNITY", pre: "People just like ", accent: "you.", sub: "Real members, in their own words." },
    reset: [
      { type: "action", dur: 9, eyebrow: "9:45 AM · MAIN STAGE", pre: "We go live ", accent: "at 9:45.", sub: "Nate opens Day 2 on the main stage." },
    ],
  },
];

function makePass(i) {
  const p = P[i % P.length];
  // rotate quote/stat picks per pass so passes 4-6 don't mirror 1-3 exactly
  const rq = [QUOTES[(2 * i) % QUOTES.length], QUOTES[(2 * i + 3) % QUOTES.length]];
  const rs = STATS[i % STATS.length];
  const testi = i % 2 === 0 ? "building" : "earning"; // strict alternation across 6 passes
  const wins = [0, 1, 2, 3].map(k => ({ type: "win", dur: 8, ...WINS[(i * 4 + k) % WINS.length] }));
  return [
    // ---- morning open ----
    ...p.open,
    // ---- 1 · DAY 1 RECAP ----
    p.recapHero,
    { type: "agenda", dur: 36, eyebrow: "YESTERDAY AT AIS LIVE", rows: RECAP, caption: "Day 1 · Build Day · All times Central" },
    { type: "quote", dur: 8, ...rq[0] },
    { type: "stat", dur: 8, ...rs },
    { type: "quote", dur: 8, ...rq[1] },
    // ---- 1b · DAY 1 RECAP — session clips, testimonial format (2026-07-11) ----
    { type: "tagline", dur: 8, ...RECAP_LEADS[i] },
    ...RECAP_DEAL[i].map(id => ({
      type: "recap", clip: RECAPS[id],
      dur: +(RECAPS[id].dur + RECAP_LEAD_IN + RECAP_TAIL).toFixed(3),
    })),
    // ---- 2 · TODAY / DAY 2 AGENDA ----
    p.todayHero,
    { type: "tagline", dur: 10, eyebrow: "9:45 AM · MAIN STAGE", pre: "Nate takes the stage ", accent: "at 9:45.", sub: "Day 2 Open: Turn This Into Money" },
    { type: "agenda", dur: 32, eyebrow: "TODAY AT AIS LIVE · 1/2", rows: DAY2_A, caption: "Day 2 · Earn Day · All times Central" },
    { type: "agenda", dur: 32, eyebrow: "TODAY AT AIS LIVE · 2/2", rows: DAY2_B, caption: "Day 2 · Earn Day · All times Central" },
    { type: "tagline", dur: 10, eyebrow: "10:00 AM · SPONSORED WORKSHOP", pre: "Then: the HyperAgent ", accent: "workshop.", sub: "Build an agent fleet, live on the main stage." },
    // ---- 3 · GET SET UP ----
    ...setupSegment(),
    // ---- 4 · AIS+ MEMBERSHIP (mounted ad, voice audio) ----
    p.plusLead,
    { type: "mount", video: VID.membership, dur: +(VID.membership.dur + MOUNT_HOLD).toFixed(3) },
    // ---- 5 · AIS CERTIFICATION (video on alternating passes) ----
    ...certSegment(i),
    // ---- 6 · SPONSOR REEL ----
    ...sponsorSegment(),
    // ---- 7 · COMMUNITY TESTIMONIALS (alternating reel) + MEMBER WINS ----
    p.testiLead,
    { type: "mount", video: VID[testi], dur: +(VID[testi].dur + MOUNT_HOLD).toFixed(3) },
    ...wins, // 4 real member win posts, right after the reel (Block 1 pattern)
    { type: "FILL" }, // community-proof fillers ride the testimonial afterglow
    // ---- pass reset ----
    ...p.reset,
    { type: "FILL" }, // wayfinding/housekeeping fillers before the pass seam
    ...(i === PASSES - 1
      ? [ // ---- fixed outro — lands exactly on the 9:45 handoff ----
          { type: "tagline", dur: 10, eyebrow: "9:45 AM · MAIN STAGE", pre: "It's time. ", accent: "We're live.", sub: "Day 2 Open: Turn This Into Money" },
          { type: "markflash", dur: 12, sub: "Nate takes the stage now. AIS LIVE · Day 2 · Earn Day" },
        ]
      : [{ type: "markflash", dur: 8, sub: "AIS LIVE · Day 2 · Earn Day" }]),
  ];
}

// every beat carries its pass index so --split can emit per-pass chunk comps
// (pass seams are the only frame/audio-clean cut points for a chunked render)
let BEATS = Array.from({ length: PASSES }, (_, i) => makePass(i).map(b => ({ ...b, pass: i }))).flat();

// ---- filler tuning: cycle verified quotes/stats into the FILL slots until the
// build hits TARGET; sub-beat remainder goes onto the final markflash hold ----
const FILLERS = [
  { type: "quote", dur: 8, ...QUOTES[5] },
  { type: "stat", dur: 8, ...STATS[3] },
  { type: "action", dur: 9, eyebrow: "THE EXPO IS OPEN", pre: "Booths are ", accent: "live.", sub: "HyperAgent and Glaido are in the expo now." },
  { type: "quote", dur: 8, ...QUOTES[2] },
  { type: "stat", dur: 8, ...STATS[4] },
  { type: "action", dur: 9, eyebrow: "WHILE YOU WAIT", pre: "Build your ", accent: "agenda.", sub: "Star the sessions you don't want to miss." },
  { type: "quote", dur: 8, ...QUOTES[0] },
  { type: "stat", dur: 8, ...STATS[5] },
  { type: "action", dur: 9, eyebrow: "NETWORKING IS OPEN", pre: "Say hi to ", accent: "three people.", sub: "You'll be earning alongside them all day." },
  { type: "quote", dur: 8, ...QUOTES[1] },
  { type: "tagline", dur: 9, eyebrow: "AIS LIVE · 2026", pre: "Two days. ", accent: "One community.", sub: "Built together. Paid together." },
  { type: "action", dur: 9, eyebrow: "9:45 AM · MAIN STAGE", pre: "We're live ", accent: "at 9:45.", sub: "Nate opens Day 2 on the main stage." },
  { type: "quote", dur: 8, ...QUOTES[3] },
  { type: "stat", dur: 8, ...STATS[0] },
  { type: "action", dur: 9, eyebrow: "SETTLE IN", pre: "Grab a coffee. ", accent: "We start at 9:45.", sub: "The morning expo and networking are open until then." },
  { type: "quote", dur: 8, ...QUOTES[4] },
  { type: "tagline", dur: 9, eyebrow: "DAY 2 · EARN DAY", pre: "Market. Sales. ", accent: "Pricing. Delivery.", sub: "Everything today points at revenue." },
  { type: "action", dur: 9, eyebrow: "10:00 AM · SPONSORED WORKSHOP", pre: "HyperAgent goes live ", accent: "at 10:00.", sub: "Build an agent fleet, right after the open." },
  { type: "quote", dur: 8, ...QUOTES[6] },
  { type: "stat", dur: 8, ...STATS[1] },
];
const sum = arr => arr.reduce((s, b) => s + (b.dur || 0), 0);
let remaining = +(TARGET - sum(BEATS)).toFixed(3);
if (remaining < 0) throw new Error(`base program is ${-remaining}s OVER the ${TARGET}s target — trim beat durations`);
const slots = BEATS.map((b, i) => (b.type === "FILL" ? i : -1)).filter(i => i >= 0);
const fills = [];
let fi = 0;
while (remaining >= FILLERS[fi % FILLERS.length].dur + 5) { // keep >=5s for the seam absorb
  const f = FILLERS[fi % FILLERS.length];
  fills.push({ ...f });
  remaining = +(remaining - f.dur).toFixed(3);
  fi++;
}
// deal CONSECUTIVE pool runs to each slot (chunked, not round-robin — stride
// sampling can land same-type beats back to back; chunks keep the q/s/a mix)
const perSlot = slots.map(() => []);
{
  const n = slots.length, base = Math.floor(fills.length / n), rem = fills.length % n;
  let i = 0;
  for (let k = 0; k < n; k++) { const size = base + (k < rem ? 1 : 0); perSlot[k] = fills.slice(i, i + size); i += size; }
}
// splice the fillers into their slots (deterministic, slot-by-slot)
{
  const out = []; let si = 0;
  for (const b of BEATS) {
    if (b.type === "FILL") { out.push(...perSlot[si++].map(f => ({ ...f, pass: b.pass }))); } else out.push(b);
  }
  BEATS = out;
}
// absorb the remainder across the pass-seam markflashes so D === TARGET exactly
// (splitting keeps any one mark hold short — a 20s+ static mark reads dead)
{
  const mfs = BEATS.map((b, i) => (b.type === "markflash" ? i : -1)).filter(i => i >= 0);
  const share = +(remaining / mfs.length).toFixed(3);
  for (const i of mfs) { BEATS[i].dur = +(BEATS[i].dur + share).toFixed(3); }
  BEATS[BEATS.length - 1].dur = +(BEATS[BEATS.length - 1].dur + (TARGET - sum(BEATS))).toFixed(3);
}
if (Math.abs(sum(BEATS) - TARGET) > 0.002) throw new Error(`tuning failed: D=${sum(BEATS)}`);

// ---- CHUNKED RENDER MODE (fat-file split, Aidan 2026-07-11) ----------------
// `node _gen.mjs --pass=N` (1-based) emits ONLY pass N as a standalone comp at
// the project ROOT (_passN.html — root-level so relative assets/ paths hold).
// Pass seams are markflash cards (silent, everything hard-killed), so the six
// chunks butt-join losslessly in Premiere: calm settle out -> fresh open in.
// Chunk durations sum to exactly TARGET. Full build (no flag) is unchanged.
const passArg = process.argv.find(a => a.startsWith("--pass="));
const PASS_N = passArg ? +passArg.split("=")[1] : null;
if (PASS_N != null) {
  if (!(PASS_N >= 1 && PASS_N <= PASSES)) throw new Error(`--pass must be 1-${PASSES}`);
  BEATS = BEATS.filter(b => b.pass === PASS_N - 1);
}

// ---------------------------------------------------------------------------
// scene HTML renderers
// ---------------------------------------------------------------------------
const wrapWords = (str, cls) => str.trim().split(/\s+/)
  .map(w => `<span class="wd ${cls || ""}">${w}</span>`).join("");

// AIS+ product mark is ALL WHITE, + included (directives) — inline it in copy
const plusMark = s => s.replace(/AIS\+/g, `<span class="plus">AIS<span class="p">+</span></span>`);

function headline(b, heroForce) {
  const pre = b.pre ? wrapWords(b.pre) : "";
  const ac = b.accent ? wrapWords(b.accent, "ac") : ""; // accents are always brand blue (directives)
  const hero = heroForce || b.type === "hero" || b.hero;
  return `<div class="ln${hero ? " hero" : ""}">${pre}${ac}</div>`;
}
const eyeb = b => b.eyebrow ? `<div class="eyebrow">${plusMark(b.eyebrow)}</div>` : "";
const sub = t => t ? `<div class="sub">${plusMark(t)}</div>` : "";

function numStart(b) {
  if (/^\d+$/.test(b.num)) return "0";
  if (/^\d+K\+$/.test(b.num)) return "0K+";
  if (/^\d+M\+$/.test(b.num)) return "0M+";
  if (/^\d+\+$/.test(b.num)) return "0+";
  return b.num;
}

function sceneBody(b) {
  switch (b.type) {
    case "welcome": case "tagline": case "hero": case "action":
      return `${eyeb(b)}${headline(b)}${sub(b.sub)}`;

    case "quote":
      return `${eyeb(b)}<div class="ln quoteln">${wrapWords(b.quote)}</div><div class="sub attrib">${b.attrib}</div>`;

    case "stat":
      return `${eyeb(b)}
        <div class="statwrap">
          ${b.kicker ? `<div class="kicker">${b.kicker}</div>` : ""}
          <div class="num">${numStart(b)}</div>
          <div class="unit">${b.unit || ""}</div>
        </div>${sub(b.sub)}`;

    case "step":
      return `${eyeb(b)}<div class="stepnum">${b.num}</div>${headline(b)}`;

    case "win":
      return `<div class="winwrap">
          <div class="wintext">
            ${eyeb({ eyebrow: b.eyebrow || "MEMBER WIN · FROM THE COMMUNITY" })}
            <div class="winhead">${wrapWords(b.pre)}${wrapWords(b.accent, "ac")}</div>
            <div class="winsub">${plusMark(b.sub)}</div>
            <div class="winname">${b.name}</div>
          </div>
          <div class="winshot"><img src="assets/wins/${b.img}.png" alt="" /></div>
        </div>`;

    case "rows": {
      const rows = b.rows.map(r =>
        `<div class="ckrow"><span class="tick"></span><span class="cktxt">${plusMark(r)}</span></div>`).join("");
      return `${eyeb(b)}<div class="checklist">${rows}</div>${sub(b.sub)}`;
    }

    case "sponsor": {
      const logos = b.logos.map(l =>
        `<div class="logo"><div class="logobox"><img src="assets/sponsors/${l.src}.png" alt="" style="height:${l.hgt}px" /></div>${l.role ? `<div class="logorole">${l.role}</div>` : ""}</div>`).join("");
      return `${eyeb(b)}<div class="logorow">${logos}</div>${sub(b.caption)}`;
    }

    case "agenda": {
      const rows = b.rows.map(r =>
        `<div class="agrow"><span class="agt">${r.t}</span><span class="agl">${plusMark(r.label)}</span></div>`).join("");
      return `${eyeb(b)}<div class="agenda">${rows}</div>${sub(b.caption)}`;
    }

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

BEATS.forEach((b, idx) => {
  const start = t, s = `sc${idx}`, track = 12 + idx;
  const win = +(b.dur + OVERLAP).toFixed(3);
  const first = idx === 0, last = idx === BEATS.length - 1;
  const S = n => +(start + n).toFixed(3);

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

  // ---- DAY 1 RECAP CLIP — testimonial-format card, video in the rounded slot.
  // The whole card lives at STAGE ROOT (outside #camera): the framework cannot
  // drive a timed <video> nested in a timed element (lint: frozen in renders),
  // so the media rides a NON-timed wrapper (#m) that mirrors the card's tweens,
  // and the card section skips the camera drift so both stay registered. ----
  if (b.type === "recap") {
    const v = b.clip, m = `rc${mountN++}`;
    const vs = S(RECAP_LEAD_IN); // clip audio/video start after the card entrance
    rootHTML.push(
`      <section id="${s}" class="scene clip rcscene" data-start="${+start.toFixed(3)}" data-duration="${last ? b.dur : win}" data-track-index="${track}">
        <div class="inner">
        <div class="rcwrap">
          <div class="rspace"></div>
          <div class="rtext">
            <div class="rtag">${v.tag}</div>
            <div class="rname">${v.name}</div>
            <div class="rrole">${v.role}</div>
            <div class="rquote"><span class="qm">“</span>${v.quote}<span class="qm">”</span></div>
          </div>
        </div>
        </div>
      </section>
      <div id="${m}" class="rclip">
        <img id="${m}-poster" class="rfill" src="assets/recap/${v.file}-poster.jpg" alt="" />
        <video id="${m}-v" class="rfill" muted playsinline data-has-audio="false" src="assets/recap/${v.file}.mp4" data-start="${vs}" data-duration="${v.dur}" data-track-index="${500 + mountN}"></video>
        <img id="${m}-last" class="rfill" src="assets/recap/${v.file}-lastframe.jpg" alt="" />
      </div>`);
    audioHTML.push(`      <audio id="${m}-a" src="assets/recap/${v.file}.mp4" data-start="${vs}" data-duration="${v.dur}" data-track-index="${560 + mountN}" data-volume="1"></audio>`);
    tj.push(`      // ${s} · recap ${v.file}  (${b.dur}s, voice audio)`);
    tj.push(`      streak(${S(0)});`);
    tj.push(`      tl.set("#${m}", { autoAlpha: 0 }, 0);`);
    tj.push(`      tl.set("#${m}-last", { autoAlpha: 0 }, 0);`);
    tj.push(`      drop("#${s} .rtag", ${S(0.12)});`);
    tj.push(`      shotIn("#${m}", ${S(0.22)});`); // media card enters like the testimonial slot
    tj.push(`      drop("#${s} .rname", ${S(0.42)});`);
    tj.push(`      drop("#${s} .rrole", ${S(0.58)});`);
    tj.push(`      drop("#${s} .rquote", ${S(0.74)});`);
    tj.push(`      tl.set("#${m}-poster", { autoAlpha: 0 }, ${S(RECAP_LEAD_IN + 0.2)});`); // video is live by now
    tj.push(`      tl.set("#${m}-last", { autoAlpha: 1 }, ${S(RECAP_LEAD_IN + v.dur - 0.04)});`); // cover video end
    tj.push(`      whipOut("#${s} .inner", ${S(b.dur - 0.30)});`);
    tj.push(`      whipOut("#${m}", ${S(b.dur - 0.30)});`); // identical tween keeps card + media registered
    tj.push(`      tl.set("#${s} .inner", { autoAlpha: 0 }, ${S(b.dur)});`);
    tj.push(`      tl.set("#${m}", { autoAlpha: 0 }, ${S(b.dur)});`);
    tj.push(``);
    t += b.dur;
    return;
  }

  scenesHTML.push(
`      <section id="${s}" class="scene clip" data-start="${+start.toFixed(3)}" data-duration="${last ? b.dur : win}" data-track-index="${track}">
        <div class="inner">
        ${sceneBody(b)}
        </div>
      </section>`);

  tj.push(`      // ${s} · ${b.type}  (${b.dur}s)`);
  if (!first) tj.push(`      streak(${S(0)});`);

  // ---- entrance ----
  if (b.eyebrow) tj.push(`      drop("#${s} .eyebrow", ${S(0.12)});`);
  if (["welcome", "tagline", "hero", "action"].includes(b.type)) {
    tj.push(`      words("#${s} .ln .wd", ${S(0.24)});`);
  } else if (b.type === "quote") {
    tj.push(`      words("#${s} .quoteln .wd", ${S(0.26)});`);
    tj.push(`      drop("#${s} .attrib", ${S(0.95)});`);
  } else if (b.type === "stat") {
    tj.push(`      drop("#${s} .kicker", ${S(0.28)});`);
    tj.push(`      pop("#${s} .num", ${S(0.42)});`);
    if (/^\d+$/.test(b.num)) tj.push(`      countUp("#${s} .num", ${S(0.48)}, ${b.num}, 0.9, 0);`);
    else if (/^(\d+)K\+$/.test(b.num)) tj.push(`      countUp("#${s} .num", ${S(0.48)}, ${b.num.replace(/K\+$/, "")}, 1.0, "K+");`);
    else if (/^(\d+)M\+$/.test(b.num)) tj.push(`      countUp("#${s} .num", ${S(0.48)}, ${b.num.replace(/M\+$/, "")}, 1.0, "M+");`);
    else if (/^(\d+)\+$/.test(b.num)) tj.push(`      countUp("#${s} .num", ${S(0.48)}, ${b.num.replace(/\+$/, "")}, 1.1, "+");`);
    tj.push(`      drop("#${s} .unit", ${S(0.78)});`);
  } else if (b.type === "agenda") {
    tj.push(`      slideX("#${s} .agrow", ${S(0.30)}, 0.07);`);
  } else if (b.type === "step") {
    tj.push(`      pop("#${s} .stepnum", ${S(0.20)});`);
    tj.push(`      words("#${s} .ln .wd", ${S(0.40)});`);
  } else if (b.type === "win") {
    tj.push(`      drop("#${s} .eyebrow", ${S(0.14)});`);
    tj.push(`      words("#${s} .winhead .wd", ${S(0.28)});`);
    tj.push(`      drop("#${s} .winsub", ${S(0.75)});`);
    tj.push(`      drop("#${s} .winname", ${S(0.92)});`);
    tj.push(`      shotIn("#${s} .winshot", ${S(0.4)});`);
    tj.push(`      drift("#${s} .winshot", ${S(1.8)}, ${+((b.dur - 2.4) / 4.8).toFixed(2)});`);
  } else if (b.type === "rows") {
    tj.push(`      slideX("#${s} .ckrow", ${S(0.30)}, 0.14);`);
  } else if (b.type === "sponsor") {
    tj.push(`      glowIn("#${s} .logo", ${S(0.34)}, 0.14);`);
  } else if (b.type === "markflash") {
    tj.push(`      markPop("#${s} .bigmark", ${S(0.22)});`);
  }
  if (b.sub || b.caption) tj.push(`      drop("#${s} .sub", ${S(b.type === "quote" ? 0.95 : 0.82)});`);

  // ---- long-hold ambient: gentle drift on signage so nothing sits dead ----
  if ((b.type === "agenda" || b.type === "sponsor") && b.dur > 16) {
    const box = b.type === "agenda" ? ".agenda" : ".logorow";
    tj.push(`      drift("#${s} ${box}", ${S(2.0)}, ${+((b.dur - 3.0) / 4.8).toFixed(2)});`);
  }

  // ---- exit ----
  // last beat settles out calmly (loop seam — the wrap lands on the open's entrance)
  if (last) tj.push(`      settleOut("#${s} .inner", ${S(b.dur - 0.9)});`);
  else tj.push(`      whipOut("#${s} .inner", ${S(b.dur - 0.30)});`);
  // hard kill at the clip boundary — non-linear seek must land on a clean autoAlpha:0
  if (!last) tj.push(`      tl.set("#${s} .inner", { autoAlpha: 0 }, ${S(b.dur)});`);
  tj.push(``);

  t += b.dur;
});

const D = +t.toFixed(3);
if (PASS_N == null && Math.abs(D - TARGET) > 0.002) throw new Error(`D=${D}, expected ${TARGET}`);
// (no 1.6s-grid constraint any more — the build plays once, it does not loop)

// ambient cycle counts — short fixed periods, even segment counts so yoyo motion
// starts AND ends at rest (D/2-period yoyo would read static at 75 min)
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
    <title>AIS LIVE — Block 5: Day 2 Opening${PASS_N ? ` — pass ${PASS_N}/${PASSES} chunk` : ""} (${(D / 60).toFixed(1)} min${PASS_N ? "" : ", plays once 8:30-9:45"})</title>
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
      /* no ::before marker chip, no coral variant — live-asset directives */

      .ln{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:122px;line-height:1.16;
        letter-spacing:-.03em;max-width:1600px;}
      .ln.hero{font-size:176px;}
      /* generous padding so italic-900 ascenders/descenders never clip out of the
         background-clip:text box; side padding supplies the inter-word gap.
         NO will-change on gradient text: promoting a background-clip:text span to
         its own compositing layer under the animated #camera transform makes
         Chromium rasterize it with a truncated text mask — descenders (y/p/g)
         get chopped flat (verified via the _cliptest render matrix 2026-07-08;
         the delivered Block 4 render shows the bug on "up."). Painting into the
         parent layer keeps the full glyph mask at zero per-frame raster cost. */
      .ln .wd{display:inline-block;padding:.12em .15em .32em;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .ln .wd.ac{background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 56%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 48px rgba(55,189,248,.62);}
      .ln.quoteln{font-size:78px;line-height:1.28;max-width:1500px;}
      .quoteln{position:relative;}
      .quoteln::before{content:"\\201C";color:var(--blue);margin-right:.04em;}
      .quoteln::after{content:"\\201D";color:var(--blue);margin-left:.04em;}

      .sub{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:41px;line-height:1.25;
        color:rgba(209,220,232,.85);max-width:1440px;will-change:transform,opacity;}
      .attrib{font-style:normal;font-family:var(--font-mono);font-weight:500;font-size:27px;letter-spacing:.06em;color:rgba(180,214,238,.82);}

      /* AIS+ product mark — ALL WHITE incl. the +, never tinted (directives) */
      .plus{font-family:var(--font-display);font-style:italic;font-weight:900;color:#fff;letter-spacing:-.02em;}
      .plus .p{color:#fff;}

      /* stat */
      .statwrap{display:flex;flex-direction:column;align-items:center;gap:2px;}
      .kicker{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.30em;text-transform:uppercase;color:#fff;}
      .num{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:320px;line-height:1.0;
        letter-spacing:-.04em;padding:.08em .14em .26em; /* no will-change: see .ln .wd */
        background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 55%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 90px rgba(55,189,248,.6);}
      .unit{font-family:var(--font-mono);font-weight:700;font-size:28px;letter-spacing:.30em;text-transform:uppercase;color:var(--blue);}

      /* step numeral (get-set-up) */
      .stepnum{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:230px;line-height:1.0;
        letter-spacing:-.04em;padding:.08em .14em .2em; /* no will-change: see .ln .wd */
        background:linear-gradient(180deg,#b3ecff 0%,#37bdf8 55%,#1487c9 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 80px rgba(55,189,248,.55);}

      /* checklist rows */
      .checklist{display:flex;flex-direction:column;gap:26px;width:max-content;max-width:1560px;}
      .ckrow{display:flex;align-items:center;gap:30px;text-align:left;will-change:transform,opacity;}
      .tick{width:34px;height:34px;flex:0 0 34px;border:3px solid var(--blue);border-radius:9px;position:relative;
        box-shadow:0 0 18px rgba(55,189,248,.35);}
      .tick::after{content:"";position:absolute;inset:7px;background:var(--blue);border-radius:4px;
        box-shadow:0 0 12px rgba(55,189,248,.7);}
      .cktxt{font-family:var(--font-body);font-weight:700;font-size:52px;color:#fff;}

      /* ---------- member win card: summary left, post screenshot right ---------- */
      .winwrap{position:absolute;inset:0;display:flex;align-items:center;gap:70px;padding:80px 110px 90px 150px;}
      .wintext{flex:0 0 760px;display:flex;flex-direction:column;align-items:flex-start;text-align:left;}
      .winhead{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:76px;line-height:1.12;
        letter-spacing:-.03em;margin-left:-.15em;max-width:780px;margin-top:26px;}
      .winhead .wd{display:inline-block;padding:.12em .15em .32em; /* no will-change: see .ln .wd */
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

      /* agenda */
      .agenda{display:flex;flex-direction:column;gap:14px;width:max-content;max-width:1680px;will-change:transform;}
      .agrow{display:flex;align-items:baseline;gap:26px;font-family:var(--font-body);font-weight:700;font-size:38px;color:#fff;text-align:left;will-change:transform,opacity;}
      .agt{font-family:var(--font-mono);font-weight:700;font-size:22px;color:var(--blue);min-width:130px;letter-spacing:.04em;}

      /* mounted finished pieces — full-frame, above the camera scenes */
      .mount{position:absolute;inset:0;background:#000;will-change:transform,opacity,filter;z-index:20;}
      .mfill{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}

      /* ---------- Day 1 recap clip card (community-testimonial format) ----------
         card section + media wrapper both sit at STAGE ROOT (no camera drift) so
         the framework-managed video stays registered with the card chrome */
      .rcscene{z-index:8;} /* above the camera scenes, below mounts (20) / whip (30) */
      .rcwrap{position:absolute;inset:0;display:flex;align-items:center;gap:70px;padding:80px 100px 90px 120px;}
      .rspace{width:900px;height:506px;flex:0 0 auto;} /* layout ghost — media rides #rcN */
      .rclip{position:absolute;left:120px;top:282px;width:900px;height:506px;border-radius:26px;overflow:hidden;
        background:linear-gradient(158deg,#0c1724,#0a131c);border:1px solid rgba(255,255,255,.10);
        box-shadow:0 34px 90px rgba(0,0,0,.5), 0 0 70px -14px var(--blue);
        will-change:transform,opacity,filter;transform-style:preserve-3d;z-index:9;}
      .rfill{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
      .rtext{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:18px;}
      .rtag{font-family:var(--font-mono);font-weight:700;font-size:20px;letter-spacing:.3em;text-transform:uppercase;
        color:var(--blue);text-shadow:0 0 14px rgba(55,189,248,.4);will-change:transform,opacity;}
      .rname{font-family:var(--font-display);font-style:italic;font-weight:900;font-size:74px;line-height:.96;
        letter-spacing:-.03em;color:#fff;will-change:transform,opacity;} /* solid white — no gradient clip risk */
      .rrole{font-family:var(--font-mono);font-weight:600;font-size:19px;letter-spacing:.12em;text-transform:uppercase;
        color:rgba(209,220,232,.72);will-change:transform,opacity;}
      .rquote{font-family:var(--font-display);font-style:italic;font-weight:600;font-size:38px;line-height:1.22;
        letter-spacing:-.015em;color:#fff;max-width:640px;margin-top:8px;will-change:transform,opacity;}
      .rquote .qm{color:var(--blue);font-weight:900;}

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
    <div id="stage" data-composition-id="cmp-day2-opening-fill" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
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
      // transform+opacity only — NO filter on text (a filter region clips italic edges + glow).
      // force3D:false on anything touching gradient text: a 3D-promoted
      // background-clip:text layer rasterizes with a truncated mask (descenders
      // chop) — same bug as will-change, but triggered during the tween itself,
      // which is what Studio playback shows even when the render is clean.
      function words(sel, at){ tl.fromTo(sel,{autoAlpha:0,yPercent:110,scale:.92},
        {autoAlpha:1,yPercent:0,scale:1,duration:.46,ease:"expo.out",stagger:.05,transformOrigin:"50% 100%",force3D:false},at); }
      function pop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,scale:.55},{autoAlpha:1,scale:1,duration:d||.62,ease:"back.out(1.6)",transformOrigin:"50% 55%",force3D:false},at); }
      function slideX(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,x:-46,filter:"blur(6px)"},
        {autoAlpha:1,x:0,filter:"blur(0px)",duration:.5,ease:"power2.out",stagger:step||.12},at); }
      function glowIn(sel, at, step){ tl.fromTo(sel,{autoAlpha:0,scale:.7,filter:"brightness(2.4) blur(6px)"},
        {autoAlpha:1,scale:1,filter:"brightness(1) blur(0px)",duration:.7,ease:"power2.out",stagger:step||.12,transformOrigin:"50% 50%"},at); }
      function shotIn(sel, at){ tl.fromTo(sel,{autoAlpha:0,x:70,rotationY:-14,filter:"blur(8px)"},
        {autoAlpha:1,x:0,rotationY:0,filter:"blur(0px)",duration:.65,ease:"power3.out"},at); }
      function markPop(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:.6,filter:"blur(18px) brightness(2.6)"},
        {autoAlpha:1,scale:1,filter:"blur(0px) brightness(1)",duration:.8,ease:"back.out(1.5)",transformOrigin:"50% 50%"},at); }
      // gentle float during long signage holds — lists only, never headline type
      function drift(sel, at, cycles){ tl.to(sel,{y:"-=12",duration:2.4,yoyo:true,repeat:Math.max(1,Math.round(cycles*2)-1),
        ease:"sine.inOut",stagger:{each:.25,from:"center"}},at); }
      function whipOut(sel, at){ tl.to(sel,{autoAlpha:0,y:-155,filter:"blur(30px)",duration:.26,ease:"power2.in"},at); }
      function settleOut(sel, at){ tl.to(sel,{autoAlpha:0,filter:"blur(12px)",duration:.8,ease:"power2.in"},at); }
      function mountIn(sel, at){ tl.fromTo(sel,{autoAlpha:0,scale:1.045,filter:"blur(14px)"},
        {autoAlpha:1,scale:1,filter:"blur(0px)",duration:.5,ease:"power2.out",transformOrigin:"50% 50%"},at); }
      function streak(at){
        tl.fromTo("#whip",{xPercent:-130,scaleX:.5,autoAlpha:0},{autoAlpha:.95,duration:.1,ease:"none",immediateRender:false,overwrite:"auto"},at-0.05);
        tl.to("#whip",{xPercent:270,scaleX:1.7,autoAlpha:0,duration:.34,ease:"power3.in",overwrite:"auto"},at+0.02);
      }
      function countUp(sel, at, target, dur, suffix){
        var o={v:0};
        tl.call(function(){var el=document.querySelector(sel); if(el) el.textContent="0"+(suffix||"");}, null, at-0.001);
        tl.to(o,{v:target,duration:dur,ease:"power2.out",onUpdate:function(){
          var el=document.querySelector(sel); if(el) el.textContent=Math.round(o.v)+(suffix||"");}},at);
      }

      /* ---- AMBIENT — camera never sleeps; short fixed cycles, even segment counts
             so yoyo motion starts AND ends at rest (loop-clean); dot/ring tile
             because D is a multiple of their 1.6s cycle ---- */
      tl.to("#camera", { scale:1.035, y:-16, duration:D/${CAM}, yoyo:true, repeat:${CAM - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.to(".grid-floor",   { backgroundPositionY:"+=1716px", duration:D, ease:"none" }, 0);
      tl.to(".grid-ceiling", { backgroundPositionY:"-=1716px", duration:D, ease:"none" }, 0);
      tl.to(".beam",     { rotation:8, duration:D/${BEAM}, yoyo:true, repeat:${BEAM - 1}, ease:"sine.inOut", transformOrigin:"50% 0%" }, 0);
      tl.to(".beam",     { opacity:.4, duration:D/${FLICK}, yoyo:true, repeat:${FLICK - 1}, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue",{ x:44, y:-24, duration:D/${GLOW}, yoyo:true, repeat:${GLOW - 1}, ease:"sine.inOut" }, 0);
      tl.to(".glow.coral",{ x:-36, y:22, duration:D/${GLOW}, yoyo:true, repeat:${GLOW - 1}, ease:"sine.inOut" }, 0);
      tl.to(".vignette", { opacity:.9, duration:D/${VIG}, yoyo:true, repeat:${VIG - 1}, ease:"sine.inOut" }, 0);
      // live-dot pulse — the only ambient motion on the SOLID mark (brand)
      tl.to(".dot", { scale:1.1, duration:.8, yoyo:true, repeat:${Math.round(D / 0.8) - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.fromTo(".ring", { scale:1, autoAlpha:0 }, { keyframes:[
        { autoAlpha:.5, scale:1, duration:.001 },
        { autoAlpha:0, scale:2.6, duration:.999, ease:"power2.out" },
        { autoAlpha:0, scale:1, duration:.6 }
      ], repeat:${Math.round(D / 1.6) - 1}, ease:"none" }, 0);

      /* ---- SCENES ---- */
${tj.join("\n")}
      tl.to({}, { duration: D }, 0); // Law #11 — fill the slot
      window.__timelines["cmp-day2-opening-fill"] = tl;
    <\/script>
  </body>
</html>
`;

if (PASS_N != null) {
  const out = join(DIR, `_pass${PASS_N}.html`);
  writeFileSync(out, html);
  console.log(`wrote _pass${PASS_N}.html — pass ${PASS_N}/${PASSES}, ${BEATS.length} beats, ${D}s (${(D / 60).toFixed(2)} min)`
    + ` · ${BEATS.filter(b => b.type === "recap").length} recap clips · render with:`
    + `\n  node "../../.hf-cli/node_modules/hyperframes/dist/cli.js" render -c _pass${PASS_N}.html --workers auto --gpu --video-frame-format jpg -o renders/day2-opening-pass${PASS_N}.mp4`);
  process.exit(0);
}
writeFileSync(join(SRC, "day2-opening-fill.html"), html);
const nFill = perSlot.flat().length;
const recapBeats = BEATS.filter(b => b.type === "recap");
console.log(`wrote cards/day2-opening-fill.html — ${BEATS.length} beats (${PASSES} passes + ${nFill} fillers), ${D}s (${(D / 60).toFixed(2)} min), plays ONCE 8:30-9:45, absorb ${remaining}s`
  + ` · NO keynote (removed 2026-07-11) · ${recapBeats.length} Day 1 recap clips (${recapBeats.reduce((s, b) => s + b.clip.dur, 0).toFixed(1)}s)`
  + ` · ${BEATS.filter(b => b.type === "win").length} member-win cards`
  + (H60 ? " · HyperAgent 60s MOUNTED" : " · HyperAgent 60s slot = logo spotlight")
  + (CERT ? " · CAIC cert video mounted (alternating passes)" : " · cert video MISSING"));
if (process.argv.includes("--set")) {
  copyFileSync(join(SRC, "day2-opening-fill.html"), join(DIR, "index.html"));
  console.log("index.html <- cards/day2-opening-fill.html");
}
