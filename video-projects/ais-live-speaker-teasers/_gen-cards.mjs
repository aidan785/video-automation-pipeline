// AIS LIVE — speaker session teaser cards (batch).
// One ~7s portrait clip per session, both days, in the "headshot" style Aidan
// approved from the What's Coming Today teaser video: cutout left, session
// info right (tag, chrome title, divider, names, hook, meta), house depth-grid
// ambient bg + solid AIS/LIVE mark bug. All-blue directives apply (no
// coral/yellow, no eyebrow dots, no on-screen em dashes, real sponsor logos,
// v7.1 times/speakers verbatim). No September event references anywhere.
//
// Skipped (no cutout art yet): Kodi Zene (Scope to Ship), Meghan Cox
// (Tooling Reset), Clay lunch session (speakers TBD in v7.1).
//
//   node _gen-cards.mjs   -> writes cards/<slug>.html + _manifest.json

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));

// ---- People (name + credential), roles from the speaker-announcements set --
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
  "cole-medin": { name: "Cole Medin", role: "Founder · Dynamous AI" },
  "pat-blakely": { name: "Pat Blakely", role: "Writer & Product Manager" },
  "yash-chauhan": { name: "Yash Chauhan", role: "Community Manager · AIS" },
  "jonathan-stark": { name: "Jonathan Stark", role: "Founder · The Ditching Hourly Guy" },
  "dariia-vasylieva": { name: "Dr. Dariia Vasylieva", role: "Founder & CEO · RaiseTalks" },
  "anne-marie-enns": { name: "Anne-Marie Enns", role: "" },
  "amy-simpson": { name: "Amy Simpson", role: "Co-Owner · Simpatico Design Studio" },
  "matt-wolfe": { name: "Matt Wolfe", role: "Founder · Future Tools" },
};

// ---- Cards: one per session, facts verbatim from Agenda v7.1 ---------------
// faces: 1 = solo, 2 = duo, 3+ = group. tsize fits the title.
const D1 = "SAT · JUL 11";
const D2 = "SUN · JUL 12";

const CARDS = [
  // ------------------------------ DAY 1 ------------------------------------
  { slug: "d1-nate-vipqa", tag: "VIP Q&A · 9:30 AM", faces: ["nate-herk"],
    title: "VIP Q&A with Nate", tsize: 84,
    hook: "Bring the question you've been mulling over for weeks.",
    meta: `${D1} · 9:30 AM CT · VIP ROOM` },

  { slug: "d1-welcome", tag: "OPENING · 10:15 AM", faces: ["nate-herk"],
    title: "Welcome to AIS Live", tsize: 84,
    hook: "How you actually make money in AI services, and the shape of the weekend.",
    meta: `${D1} · 10:15 AM CT · MAIN STAGE` },

  { slug: "d1-anatomy", tag: "MAIN STAGE · 10:30 AM",
    faces: ["aidan-finnegan", "glenn-marcus", "wyatt-lyonsmith", "nate-herk"],
    fstyle: ["height:44%;max-width:none", "height:55%;max-width:none",
             "height:55%;max-width:none", "height:46%;max-width:none"],
    names: "Aidan Finnegan · Nate Herk · Glenn Marcus · Wyatt Lyonsmith",
    title: "Anatomy of Three Real Deals", tsize: 62,
    hook: "Three real client engagements, end to end. The actual version, numbers attached.",
    meta: `${D1} · 10:30 AM CT` },

  { slug: "d1-debrief-deals", tag: "LIVE DEBRIEF · 11:25 AM", faces: ["jon-morrow"],
    title: "Patterns from Real Deals", tsize: 80,
    hook: "The throughline that turned each conversation into a signed engagement.",
    meta: `${D1} · 11:25 AM CT · MAIN STAGE` },

  { slug: "d1-alex-keynote", tag: "KEYNOTE · 11:40 AM", faces: ["alex-mcdonnell"],
    logo: "hyperagent-white.png",
    title: "The New Standard", tsize: 84,
    hook: "Why you need a fleet of always-on agents.",
    meta: `${D1} · 11:40 AM CT · MAIN STAGE` },

  { slug: "d1-glaido", tag: "SPONSORED SESSION · 12:00 PM", faces: ["jannis-moore"],
    logo: "glaido-white.png",
    title: "Voice, Live", tsize: 84,
    hook: "Voice AI you can actually bill for. Live demo from the Glaido team.",
    meta: `${D1} · 12:00 PM CT · MAIN STAGE` },

  { slug: "d1-evals", tag: "CO-BUILD · 12:20 PM",
    faces: ["nate-herk", "ednan-abdullayev"],
    names: "Nate Herk + Ednan Abdullayev",
    title: "Evals", tsize: 94,
    hook: "Built live. The eval results tell you exactly what to fix.",
    meta: `${D1} · 12:20 PM CT · MAIN STAGE` },

  { slug: "d1-liberty-30days", tag: "FOUNDATION TRACK · 12:45 PM", faces: ["liberty-white"],
    title: "Your First 30 Days in AI Automation", tsize: 62,
    hook: "What to build first, what to ignore, what to ship in week one.",
    meta: `${D1} · 12:45 PM CT · WORKSHOP BLOCK 1` },

  { slug: "d1-dave-lowcode", tag: "ADVANCED TRACK · 12:45 PM", faces: ["dave-ebbelaar"],
    title: "Low-Code to Full-Code", tsize: 76,
    hook: "The architecture choices that hold up at scale.",
    meta: `${D1} · 12:45 PM CT · WORKSHOP BLOCK 1` },

  { slug: "d1-jon-land", tag: "VIP WORKING SESSION · 2:00 PM", faces: ["jon-morrow"],
    title: "Land Your First Paying Client", tsize: 68,
    hook: "The fastest realistic path to your first paid AI engagement.",
    meta: `${D1} · 2:00 PM CT · VIP` },

  { slug: "d1-jenn-expertise", tag: "VIP WORKING SESSION · 2:00 PM", faces: ["jenn-van-wagner"],
    title: "Turn Your Expertise Into a Service", tsize: 62,
    hook: "Turn what you already know into a productized, sellable AI service offer.",
    meta: `${D1} · 2:00 PM CT · VIP` },

  { slug: "d1-russ-price", tag: "VIP WORKING SESSION · 2:00 PM", faces: ["russ-henneberry"],
    title: "Price It Right", tsize: 88,
    hook: "Packaging, anchoring, and what to charge for your AI work.",
    meta: `${D1} · 2:00 PM CT · VIP` },

  { slug: "d1-kacper-claude", tag: "FEATURED SESSION · 2:35 PM", faces: ["kacper-rutkiewicz"],
    title: "How I Run an Entire AI Automation Agency Using Claude Code", tsize: 52,
    hook: "Client delivery. Sales. Content. One workspace.",
    meta: `${D1} · 2:35 PM CT · MAIN STAGE` },

  { slug: "d1-sabrina-content", tag: "FOUNDATION TRACK · 3:10 PM", faces: ["sabrina-ramonov"],
    title: "Build Your First AI Content Engine", tsize: 62,
    hook: "A content engine built live, end to end, in 60 minutes.",
    meta: `${D1} · 3:10 PM CT · WORKSHOP BLOCK 2` },

  { slug: "d1-samin-voice", tag: "ADVANCED TRACK · 3:10 PM", faces: ["samin-yasar"],
    title: "Build a Voice AI Sales Rep", tsize: 70,
    hook: "Live on stage, end to end. Architecture that holds up in the wild.",
    meta: `${D1} · 3:10 PM CT · WORKSHOP BLOCK 2` },

  { slug: "d1-tangy-enterprise", tag: "WORKSHOP BLOCK 3 · 4:20 PM", faces: ["tangy-frederick"],
    title: "Enterprise AI Services", tsize: 80,
    hook: "How a small AI agency wins deals against firms ten times its size.",
    meta: `${D1} · 4:20 PM CT · MAIN STAGE` },

  { slug: "d1-ednan-certified", tag: "MAIN STAGE · 5:05 PM", faces: ["_placeholder"],
    names: "Ednan Abdullayev",
    title: "Get AIS+ Certified", tsize: 80,
    hook: "The credential that proves you can build and sell real AI services.",
    meta: `${D1} · 5:05 PM CT · MAIN STAGE` },

  { slug: "d1-nate-close", tag: "CLOSING · 5:20 PM", faces: ["nate-herk"],
    title: "Day 1 Closing Remarks", tsize: 76,
    hook: "The day's biggest moments, plus the overnight challenge that sets up Day 2.",
    meta: `${D1} · 5:20 PM CT · MAIN STAGE` },

  // ------------------------------ DAY 2 ------------------------------------
  { slug: "d2-nate-open", tag: "DAY 2 OPEN · 9:45 AM", faces: ["nate-herk"],
    title: "Now Let's Turn This Into Money", tsize: 64,
    hook: "Build Day is done. Day 2 is about earning.",
    meta: `${D2} · 9:45 AM CT · MAIN STAGE` },

  { slug: "d2-alex-workshop", tag: "WORKSHOP · 10:00 AM", faces: ["alex-mcdonnell"],
    logo: "hyperagent-white.png",
    title: "How to Build an Always-On Fleet of Agents", tsize: 56,
    hook: "Sixty minutes, hands-on. System prompts, skills, tools, loops.",
    meta: `${D2} · 10:00 AM CT · MAIN STAGE` },

  { slug: "d2-toolwar", tag: "PANEL · 11:10 AM",
    faces: ["devin-kearns", "dave-ebbelaar"],
    names: "Devin Kearns · Dave Ebbelaar",
    title: "The Tool War: What Actually Makes Money in 2026", tsize: 54,
    hook: "Honest swings at each other's stacks. What ships, what's overhyped.",
    meta: `${D2} · 11:10 AM CT · MAIN STAGE` },

  { slug: "d2-clients-hiding", tag: "MAIN STAGE · 11:50 AM",
    faces: ["jon-morrow", "pat-blakely"],
    names: "Jon Morrow · Pat Blakely",
    title: "Where Your First 10 Clients Are Hiding", tsize: 58,
    hook: "Specific channels, specific behaviors, outreach that gets picked up.",
    meta: `${D2} · 11:50 AM CT · MAIN STAGE` },

  { slug: "d2-salesarc", tag: "MAIN STAGE · 12:30 PM",
    faces: ["jon-morrow", "pat-blakely"],
    names: "Jon Morrow · Pat Blakely",
    title: "The Sales Arc, LIVE", tsize: 84,
    hook: "A real AI services sales call, live on stage. No script. No safety net.",
    meta: `${D2} · 12:30 PM CT · MAIN STAGE` },

  { slug: "d2-pat-10clients", tag: "VIP WORKING SESSION · 1:35 PM", faces: ["pat-blakely"],
    title: "Your First 10 Clients Plan", tsize: 70,
    hook: "Who, where, and the outreach that works right now.",
    meta: `${D2} · 1:35 PM CT · VIP` },

  { slug: "d2-jenn-expertise", tag: "VIP WORKING SESSION · 1:35 PM", faces: ["jenn-van-wagner"],
    title: "Turn Your Expertise Into a Service", tsize: 62,
    hook: "Turn what you already know into a productized, sellable AI service offer.",
    meta: `${D2} · 1:35 PM CT · VIP` },

  { slug: "d2-jon-land", tag: "VIP WORKING SESSION · 1:35 PM", faces: ["jon-morrow"],
    title: "Land Your First Paying Client", tsize: 68,
    hook: "The fastest realistic path to your first paid AI engagement.",
    meta: `${D2} · 1:35 PM CT · VIP` },

  { slug: "d2-russ-salesprep", tag: "VIP WORKING SESSION · 1:35 PM", faces: ["russ-henneberry"],
    title: "First Sales Call Prep", tsize: 76,
    hook: "The questions to ask, how to run discovery, and how to move to a yes.",
    meta: `${D2} · 1:35 PM CT · VIP` },

  { slug: "d2-yash-solo", tag: "VIP WORKING SESSION · 1:35 PM", faces: ["yash-chauhan"],
    title: "From Solo to Real Business", tsize: 70,
    hook: "Systems, team, and the shift from doing the work to running the company.",
    meta: `${D2} · 1:35 PM CT · VIP` },

  { slug: "d2-recap", tag: "MAIN STAGE · 2:10 PM",
    faces: ["nate-herk", "jon-morrow"],
    names: "Nate Herk · Jon Morrow",
    title: "Sales Call Recap + Intro to Pricing", tsize: 60,
    hook: "The moves that worked, and the phrases to take into your next client call.",
    meta: `${D2} · 2:10 PM CT · MAIN STAGE` },

  { slug: "d2-jonathan-hourly", tag: "FIRESIDE · 2:25 PM", faces: ["jonathan-stark"],
    title: "Ditching Hourly: The Pricing Mindset That Changes Everything", tsize: 52,
    hook: "The pricing mindset that turns $5,000 projects into $50,000 engagements.",
    meta: `${D2} · 2:25 PM CT · MAIN STAGE` },

  { slug: "d2-buying-ai", tag: "FIRESIDE · 3:10 PM",
    faces: ["dariia-vasylieva", "anne-marie-enns"],
    fstyle: ["transform:scale(1.18);transform-origin:bottom center", ""],
    names: "Dr. Dariia Vasylieva · Anne-Marie Enns",
    title: "What Companies Are Actually Buying in AI", tsize: 56,
    hook: "What buyers actually want, from someone who has seen hundreds of AI companies.",
    meta: `${D2} · 3:10 PM CT · MAIN STAGE` },

  { slug: "d2-amy-client", tag: "MAIN STAGE · 4:05 PM", faces: ["amy-simpson"],
    title: "The Client Didn't Ask for AI", tsize: 66,
    hook: "How to upgrade the services you already sell. Real numbers from real contracts.",
    meta: `${D2} · 4:05 PM CT · MAIN STAGE` },

  { slug: "d2-warroom", tag: "VIP · 4:05 PM",
    faces: ["nate-herk", "jon-morrow"],
    names: "Nate Herk · Jon Morrow",
    title: "VIP Pricing War Room", tsize: 74,
    hook: "Real pricing problems, worked through live. Yours might be one of them.",
    meta: `${D2} · 4:05 PM CT · VIP` },

  { slug: "d2-matt-matters", tag: "MAIN STAGE · 4:45 PM",
    faces: ["matt-wolfe", "nate-herk"],
    names: "Matt Wolfe · Nate Herk",
    title: "What Actually Matters in AI Right Now", tsize: 58,
    hook: "Unscripted. What's overhyped, what's underbuilt, where real value is emerging.",
    meta: `${D2} · 4:45 PM CT · MAIN STAGE` },

  { slug: "d2-devin-buildtosell", tag: "CLOSING KEYNOTE · 5:15 PM", faces: ["devin-kearns"],
    title: "Build to Sell", tsize: 92,
    hook: "The window to position your agency to be bought is now.",
    meta: `${D2} · 5:15 PM CT · MAIN STAGE` },

  { slug: "d2-nate-finalclose", tag: "CLOSING · 5:45 PM", faces: ["nate-herk"],
    title: "Nate's Close + AIS+ Pitch", tsize: 70,
    hook: "The patterns that ran through every session, and a Monday morning challenge.",
    meta: `${D2} · 5:45 PM CT · MAIN STAGE` },

  { slug: "d2-nate-afterparty", tag: "VIP · 6:10 PM", faces: ["nate-herk"],
    title: "VIP After-Party with Nate", tsize: 70,
    hook: "Unstructured time, peer breakouts, and a final fireside with the host.",
    meta: `${D2} · 6:10 PM CT · VIP` },
];

// ---------------------------------------------------------------------------
const wrapWords = str => str.trim().split(/\s+/)
  .map(w => `<span class="wd">${w}</span>`).join("");

const DUR = 7;

function cardHTML(c) {
  const id = `cmp-${c.slug}`;
  const faces = c.faces;
  const mode = faces.length === 1 ? "solo" : faces.length === 2 ? "duo" : "multi";
  const imgs = faces.map((f, i) =>
    `<img src="assets/cutouts/${f}.png"${c.fstyle?.[i] ? ` style="${c.fstyle[i]}"` : ""} alt="" />`).join("");
  const logo = c.logo ? `<div class="plogo"><img src="assets/${c.logo}" alt="" /></div>` : "";
  const p0 = PEOPLE[faces[0]] || { name: "", role: "" };
  const names = c.names || p0.name;
  const role = faces.length === 1 && p0.role ? p0.role : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>AIS LIVE — ${c.slug}</title>
    <link href="assets/fonts/fonts.css" rel="stylesheet" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"><\/script>
    <style>
      :root{
        --onyx:#07121c; --blue:#37bdf8; --red-live:#ff3b30;
        --font-display:"Montserrat",sans-serif; --font-body:"Inter",sans-serif; --font-mono:"JetBrains Mono",monospace;
      }
      *{margin:0;padding:0;box-sizing:border-box;}
      html,body{width:1920px;height:1080px;overflow:hidden;background:#000;color:#fff;font-family:var(--font-body);}
      #stage{position:relative;width:1920px;height:1080px;overflow:hidden;background:var(--onyx);isolation:isolate;}
      #stage .clip{position:absolute;inset:0;width:1920px;height:1080px;pointer-events:none;}

      #bg{overflow:hidden;}
      .depth{position:absolute;left:-40%;right:-40%;height:78%;
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
      .glow.blue2{bottom:-220px;right:-140px;width:620px;height:620px;background:var(--blue);filter:blur(165px);opacity:.08;}
      .vignette{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.62) 96%);will-change:opacity;}
      .grain{position:absolute;inset:0;opacity:.05;mix-blend-mode:screen;
        background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='7' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}

      .portrait{position:absolute;left:30px;bottom:0;width:860px;height:960px;
        display:flex;align-items:flex-end;justify-content:center;will-change:transform,opacity;}
      .portrait img{max-width:100%;max-height:100%;object-fit:contain;object-position:bottom center;
        filter:drop-shadow(0 26px 54px rgba(0,0,0,.55));
        -webkit-mask-image:
          linear-gradient(to bottom,#000 80%,transparent 100%),
          linear-gradient(to right,transparent 0%,#000 10%,#000 90%,transparent 100%);
        -webkit-mask-composite:source-in;
        mask-image:
          linear-gradient(to bottom,#000 80%,transparent 100%),
          linear-gradient(to right,transparent 0%,#000 10%,#000 90%,transparent 100%);
        mask-composite:intersect;}
      .portrait.duo{width:1020px;left:-16px;}
      .portrait.duo img:first-child{max-width:58%;position:relative;z-index:2;}
      .portrait.duo img:last-child{max-width:48%;margin-left:-90px;}
      .portrait.multi{width:1150px;left:-90px;}
      .portrait.multi img{max-width:40%;position:relative;}
      .portrait.multi img:nth-child(1){z-index:4;}
      .portrait.multi img:nth-child(2){z-index:3;margin-left:-190px;}
      .portrait.multi img:nth-child(3){z-index:2;margin-left:-190px;}
      .portrait.multi img:nth-child(4){z-index:1;margin-left:-190px;}

      .pcontent{position:absolute;left:930px;right:110px;top:0;bottom:40px;
        display:flex;flex-direction:column;align-items:flex-start;justify-content:center;}
      .pcontent.wide{left:1010px;}
      .pcontent.multiw{left:1100px;}
      .pcontent.multiw .ptitle,.pcontent.multiw .pname,.pcontent.multiw .phook{max-width:700px;}
      .eyebrow{font-family:var(--font-mono);font-weight:700;font-size:26px;letter-spacing:.32em;text-transform:uppercase;
        color:var(--blue);margin-bottom:26px;text-shadow:0 0 16px rgba(55,189,248,.45);will-change:transform,opacity;}
      .plogo{margin-bottom:10px;will-change:transform,opacity;}
      .plogo img{height:60px;display:block;filter:drop-shadow(0 0 28px rgba(55,189,248,.30));}
      .ptitle{font-family:var(--font-display);font-style:italic;font-weight:900;letter-spacing:-.03em;
        line-height:1.1;color:#fff;max-width:840px;margin-left:-.15em;font-size:${c.tsize}px;}
      .ptitle .wd{display:inline-block;padding:.12em .15em .32em;will-change:transform,opacity;
        background:linear-gradient(180deg,#ffffff 0%,#d4dee8 50%,#9fb3c4 100%);
        -webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;
        text-shadow:0 0 34px rgba(255,255,255,.22);}
      .divider{width:128px;height:2px;background:var(--blue);margin:26px 0 28px;
        box-shadow:0 0 16px rgba(55,189,248,.6);transform-origin:left center;will-change:transform,opacity;}
      .pname{font-family:var(--font-display);font-style:italic;font-weight:800;letter-spacing:-.02em;
        font-size:${names.length > 40 ? 34 : 44}px;color:#fff;line-height:1.15;max-width:840px;will-change:transform,opacity;}
      .prole{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:27px;
        letter-spacing:-.01em;color:rgba(209,220,232,.75);margin-top:8px;will-change:transform,opacity;}
      .phook{font-family:var(--font-body);font-weight:300;font-style:italic;font-size:29px;line-height:1.3;
        color:rgba(209,220,232,.85);margin-top:${role ? 18 : 12}px;max-width:820px;will-change:transform,opacity;}
      .pmeta{font-family:var(--font-mono);font-weight:500;font-size:23px;letter-spacing:.22em;
        text-transform:uppercase;color:var(--blue);margin-top:32px;text-shadow:0 0 14px rgba(55,189,248,.4);will-change:transform,opacity;}

      .backdrop-mark{position:absolute;right:72px;bottom:60px;display:inline-flex;z-index:6;}
      .mark{font-family:var(--font-display);font-style:italic;font-weight:900;letter-spacing:-.03em;line-height:.9;
        font-size:92px;display:inline-flex;align-items:baseline;position:relative;}
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
    <div id="stage" data-composition-id="${id}" data-start="0" data-duration="${DUR}" data-width="1920" data-height="1080">
      <div id="bg" class="clip" data-start="0" data-duration="${DUR}" data-track-index="0">
        <div class="depth grid-ceiling"></div>
        <div class="depth grid-floor"></div>
        <div class="beam"></div>
        <div class="glow blue"></div>
        <div class="glow blue2"></div>
        <div class="vignette"></div>
        <div class="grain"></div>
      </div>
      <div id="markbug" class="clip" data-start="0" data-duration="${DUR}" data-track-index="1">
        <div class="backdrop-mark"><span class="mark"><span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="ring"></span><span class="dot"></span></span></span></div>
      </div>
      <div id="scene" class="clip" data-start="0" data-duration="${DUR}" data-track-index="2">
        <div class="portrait ${mode === "solo" ? "" : mode}">${imgs}</div>
        <div class="pcontent ${mode === "duo" ? "wide" : mode === "multi" ? "multiw" : ""}">
          <div class="eyebrow">${c.tag}</div>
          ${logo}
          <div class="ptitle">${wrapWords(c.title)}</div>
          <div class="divider"></div>
          <div class="pname">${names}</div>
          ${role ? `<div class="prole">${role}</div>` : ""}
          <div class="phook">${c.hook}</div>
          <div class="pmeta">${c.meta}</div>
        </div>
      </div>
    </div>

    <script>
      window.__timelines = window.__timelines || {};
      const D = ${DUR};
      const tl = gsap.timeline({ paused: true });

      function drop(sel, at, d){ tl.fromTo(sel,{autoAlpha:0,y:-16},{autoAlpha:1,y:0,duration:d||.5,ease:"power2.out"},at); }
      function words(sel, at){ tl.fromTo(sel,{autoAlpha:0,yPercent:110,scale:.92},
        {autoAlpha:1,yPercent:0,scale:1,duration:.46,ease:"expo.out",stagger:.05,transformOrigin:"50% 100%"},at); }
      function rise(sel, at){ tl.fromTo(sel,{autoAlpha:0,y:110,filter:"blur(10px)"},
        {autoAlpha:1,y:0,filter:"blur(0px)",duration:.7,ease:"power3.out"},at); }
      function wipe(sel, at){ tl.fromTo(sel,{autoAlpha:0,scaleX:0},{autoAlpha:1,scaleX:1,duration:.55,ease:"power2.out"},at); }

      /* ambient */
      tl.to(".beam",     { rotation:8, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut", transformOrigin:"50% 0%" }, 0);
      tl.to(".beam",     { opacity:.4, duration:D/4, yoyo:true, repeat:3, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue",{ x:34, y:-18, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut" }, 0);
      tl.to(".glow.blue2",{ x:-26, y:16, duration:D/2, yoyo:true, repeat:1, ease:"sine.inOut" }, 0);
      tl.to(".grid-floor",   { backgroundPositionY:"+=140px", duration:D, ease:"none" }, 0);
      tl.to(".grid-ceiling", { backgroundPositionY:"-=140px", duration:D, ease:"none" }, 0);
      tl.to(".vignette", { opacity:.9, duration:D/4, yoyo:true, repeat:3, ease:"sine.inOut" }, 0);
      tl.to(".dot", { scale:1.1, duration:.8, yoyo:true, repeat:${Math.round(DUR / 0.8) - 1}, ease:"sine.inOut", transformOrigin:"50% 50%" }, 0);
      tl.fromTo(".ring", { scale:1, autoAlpha:0 }, { keyframes:[
        { autoAlpha:.5, scale:1, duration:.001 },
        { autoAlpha:0, scale:2.6, duration:.999, ease:"power2.out" },
        { autoAlpha:0, scale:1, duration:.6 }
      ], repeat:${Math.round(DUR / 1.6) - 1}, ease:"none" }, 0);

      /* content */
      rise(".portrait", 0.16);
      drop(".eyebrow", 0.22);
      ${c.logo ? `drop(".plogo", 0.3);` : ""}
      words(".ptitle .wd", 0.36);
      wipe(".divider", 0.74);
      drop(".pname", 0.88);
      ${"" /* role+hook+meta cascade */}
      drop(".prole, .phook", 1.02);
      drop(".pmeta", 1.2);

      /* settle out */
      tl.to("#scene", { autoAlpha:0, filter:"blur(12px)", duration:.55, ease:"power2.in" }, D - 0.65);

      tl.to({}, { duration: D }, 0);
      window.__timelines["${id}"] = tl;
    <\/script>
  </body>
</html>
`;
}

const manifest = [];
for (const c of CARDS) {
  writeFileSync(join(DIR, "cards", `${c.slug}.html`), cardHTML(c));
  const day = c.meta.startsWith("SAT") ? "Sat Jul 11 2026" : "Sun Jul 12 2026";
  const time = c.tag.match(/\d{1,2}:\d{2} [AP]M/)?.[0] || "";
  const names = c.names || PEOPLE[c.faces[0]].name;
  manifest.push({
    slug: c.slug, comp: `cmp-${c.slug}`,
    file: `${names.replaceAll(" · ", ", ").replaceAll(" + ", ", ")} - ${c.title.replaceAll(":", " -")} - ${day} ${time.replace(":", ".")} CT.mp4`,
  });
}
writeFileSync(join(DIR, "_manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`wrote ${CARDS.length} cards + _manifest.json`);
