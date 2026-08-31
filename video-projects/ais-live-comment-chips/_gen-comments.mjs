#!/usr/bin/env node
// AIS LIVE — 50 generated live-event chat comment chips for After Effects.
// Renders each comment as a transparent PNG (rounded corners baked into alpha,
// 2x resolution) via headless Chrome. Mix: Glaido questions, event/logistics
// questions, hype/support, build-along wins — what a live AIS LIVE chat reads
// like. Styling: AIS brand (blue #37BDF8 accents only, no em dashes).
//   node _gen-comments.mjs           -> chips/comment-NN.png + MANIFEST.txt
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const DIR = dirname(fileURLToPath(import.meta.url));
const OUT = join(DIR, "chips");
mkdirSync(OUT, { recursive: true });
const FONTS = join(DIR, "../ais-live-day2-opening-fill/assets/fonts/fonts.css");

// [name, time, message, kind]  — kind: glaido | event | hype | win
const COMMENTS = [
  ["Marcus T.",  "11:42 AM", "Does Glaido handle inbound and outbound calls?", "glaido"],
  ["Priya S.",   "11:44 AM", "What languages does Glaido support?", "glaido"],
  ["Devon R.",   "11:47 AM", "That Glaido demo was smooth. The voice sounded actually human", "glaido"],
  ["Elena V.",   "11:49 AM", "Can I white label Glaido for my clients?", "glaido"],
  ["Sam K.",     "11:51 AM", "Whats Glaido pricing look like for a small agency?", "glaido"],
  ["Jordan M.",  "11:53 AM", "How does Glaido handle interruptions mid sentence?", "glaido"],
  ["Aisha B.",   "11:55 AM", "Glaido plus a booking calendar = receptionist replaced honestly", "glaido"],
  ["Tom W.",     "11:58 AM", "Is there a Glaido API or just the dashboard?", "glaido"],
  ["Rachel D.",  "12:01 PM", "Anyone using Glaido for dental offices? Client wants voice booking", "glaido"],
  ["Victor H.",  "12:03 PM", "The latency on that Glaido call was impressive", "glaido"],
  ["Nina P.",    "12:05 PM", "Can Glaido transfer to a human when it gets stuck?", "glaido"],
  ["Chris L.",   "12:08 PM", "Booth visit was worth it, the Glaido team answered everything", "glaido"],

  ["Megan F.",   "10:22 AM", "Will the recordings be available after?", "event"],
  ["Omar J.",    "10:25 AM", "Are the slides shared anywhere?", "event"],
  ["Katie N.",   "12:44 PM", "Which room is the Foundation track?", "event"],
  ["Ben A.",     "12:47 PM", "Is every workshop template saved for AIS+ members?", "event"],
  ["Lucia G.",   "9:36 AM",  "First time here. This chat moves FAST", "event"],
  ["Derek C.",   "2:02 PM",  "Coffee refilled, ready for round two", "event"],
  ["Hannah W.",  "5:28 PM",  "What time does Nate open tomorrow?", "event"],
  ["Raj P.",     "3:19 PM",  "Can we get the link to the skills repo again?", "event"],
  ["Sofia M.",   "1:11 PM",  "Anyone else taking notes in Claude while watching?", "event"],
  ["Tyler B.",   "9:48 AM",  "How do I star sessions on my agenda?", "event"],
  ["Grace E.",   "10:18 AM", "The VIP Q&A was worth the upgrade alone", "event"],
  ["Ivan S.",    "5:09 PM",  "Is the certification open to international members?", "event"],
  ["Paula R.",   "11:24 AM", "Missed the first hour. Is there a recap anywhere?", "event"],

  ["Jake H.",    "12:31 PM", "This session is pure gold", "hype"],
  ["Dana K.",    "10:19 AM", "Nate delivered AGAIN", "hype"],
  ["Felix O.",   "3:27 PM",  "Okay that demo just blew my mind", "hype"],
  ["Anika R.",   "1:05 PM",  "Watching from Bangladesh. 3am here and wide awake", "hype"],
  ["Sean Q.",    "11:12 AM", "The energy in this chat is unreal", "hype"],
  ["Maya L.",    "2:52 PM",  "Screenshot everything folks", "hype"],
  ["Noah D.",    "4:33 PM",  "Best virtual event I have attended this year", "hype"],
  ["Carmen S.",  "5:22 PM",  "Day 1 and I already got my moneys worth", "hype"],
  ["Leo F.",     "10:41 AM", "The production quality of this stream is insane", "hype"],
  ["Tara V.",    "12:58 PM", "Whoever is running this chat, you are a legend", "hype"],
  ["Gus M.",     "2:41 PM",  "Give the AV team a raise", "hype"],
  ["Iris B.",    "4:07 PM",  "This is better than conferences I paid 10x more for", "hype"],
  ["Cole W.",    "5:31 PM",  "Take my money, joining AIS+ right now", "hype"],
  ["Farah N.",   "1:29 PM",  "Watching with my whole team in the office", "hype"],
  ["Eddie T.",   "5:36 PM",  "Cant believe this is only day 1", "hype"],

  ["Zoe C.",     "10:52 AM", "Just closed my first client last week. This is next level", "win"],
  ["Miles J.",   "1:18 PM",  "Building along live. My agent just worked first try", "win"],
  ["Ruth A.",    "12:39 PM", "Used the eval trick from earlier and found 3 bugs already", "win"],
  ["Andre B.",   "1:52 PM",  "My discovery call skill is DONE. 20 minutes", "win"],
  ["Jenna Y.",   "3:44 PM",  "Cloned the marketing skills. My post scored 8.9", "win"],
  ["Pete G.",    "2:16 PM",  "Sent my first proposal during the lunch break lol", "win"],
  ["Layla H.",   "4:49 PM",  "That pricing framework just paid for my ticket", "win"],
  ["Owen K.",    "2:38 PM",  "Note to self: stop charging hourly", "win"],
  ["Marco D.",   "3:58 PM",  "My wife asked why I am smiling at a spreadsheet", "win"],
  ["Steph R.",   "5:40 PM",  "See everyone tomorrow for Earn Day", "win"],
];

// avatar hues stay in the brand's blue range + neutral slate (directives: all-blue accents)
const HUES = [199, 205, 212, 218, 194, 224, 208];
const initials = n => n.split(/\s+/).map(w => w[0]).join("").toUpperCase().slice(0, 2);

const chip = (c, i) => {
  const [name, time, msg] = c;
  const h = HUES[i % HUES.length];
  return `<div class="chip" id="chip${i}">
    <div class="avatar" style="background:linear-gradient(145deg,hsl(${h},72%,52%),hsl(${h + 14},70%,38%))">${initials(name)}</div>
    <div class="body">
      <div class="meta"><span class="name">${name}</span><span class="time">${time}</span></div>
      <div class="msg">${msg}</div>
    </div>
  </div>`;
};

const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="file://${FONTS}" rel="stylesheet">
<style>
  body{background:transparent;margin:0;padding:40px;display:flex;flex-direction:column;gap:28px;
    font-family:"Inter",sans-serif;width:640px;}
  .chip{display:flex;gap:14px;align-items:flex-start;width:max-content;max-width:640px;
    background:linear-gradient(158deg,rgba(13,24,37,.96),rgba(9,18,28,.96));
    border:1px solid rgba(255,255,255,.14);border-radius:22px;padding:16px 22px 17px 16px;
    box-shadow:0 18px 44px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.06);}
  .avatar{width:44px;height:44px;flex:0 0 44px;border-radius:50%;display:flex;align-items:center;
    justify-content:center;color:#fff;font-weight:800;font-size:16px;letter-spacing:.02em;
    border:1px solid rgba(255,255,255,.22);}
  .body{display:flex;flex-direction:column;gap:4px;min-width:0;}
  .meta{display:flex;align-items:baseline;gap:10px;}
  .name{font-weight:700;font-size:16px;color:#37bdf8;}
  .time{font-family:"JetBrains Mono",monospace;font-weight:500;font-size:11.5px;letter-spacing:.06em;
    color:rgba(209,220,232,.45);}
  .msg{font-weight:500;font-size:17.5px;line-height:1.35;color:rgba(235,242,248,.96);}
</style></head><body>
${COMMENTS.map(chip).join("\n")}
</body></html>`;

writeFileSync(join(DIR, "comments.html"), html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 760, height: 900 }, deviceScaleFactor: 2 });
await page.goto(`file://${join(DIR, "comments.html")}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);

const manifest = [];
for (let i = 0; i < COMMENTS.length; i++) {
  const el = await page.$(`#chip${i}`);
  const nn = String(i + 1).padStart(2, "0");
  const kind = COMMENTS[i][3];
  const file = `comment-${nn}-${kind}.png`;
  await el.screenshot({ path: join(OUT, file), omitBackground: true });
  manifest.push(`${file}  [${COMMENTS[i][1]}] ${COMMENTS[i][0]}: ${COMMENTS[i][2]}`);
  }
await browser.close();
writeFileSync(join(OUT, "MANIFEST.txt"),
  `AIS LIVE generated live-chat comment chips — ${COMMENTS.length} PNGs, transparent, 2x (~1300px wide)\n` +
  `Mix: 12 Glaido Q&A, 13 event/logistics, 15 hype, 10 build-along wins. Generated (not real attendees).\n\n` +
  manifest.join("\n"));
console.log(`${COMMENTS.length} chips -> ${OUT}`);
