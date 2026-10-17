// Beat plan generator for the AIS+ Annual Upsell.
// Anchors are verbatim phrases; starts are resolved from assets/transcript.json
// so every beat enters LEAD seconds before its word (Gate 0 window -0.2..1.8).
//
// 9/2 r2 (Aidan): "from minute 3 on there is a lot of motion graphics missing ...
// make sure there's motion graphics pretty much happening every time ... starting
// and ending at the right times ... a lot of delay or cutting short". So from the
// tech-support beat on, every card names WHEN IT ENDS instead of a fixed length:
//   "next"                 hold until the next card enters (chained handoff)
//   ["until", phrase]      hold to the end of that phrase (+TAIL)
//   "end"                  hold to the end of the video
// and the default lead is 0.6 so the headline lands ON the word (words start
// +0.30 into the card; in sidepanel mode the panel is in by +0.65).
import { writeFileSync } from "node:fs";
import { findAnchor, WORDS } from "./_anchors.mjs";

const LEAD = 0.3;      // first half (approved 9/2 as-is)
const LEAD2 = 0.6;     // second half default
const TAIL = 0.25;     // hold past the last word of an "until" phrase
const VIDEO_END = 384.3; // assets/clean.mp4 after the 9/2 penny re-cut (ffprobe)
// a cover card (takeover/flash) followed by a sidepanel leaves this much plan gap
// so the sidepanel zoom starts UNDER the cover (post-build section 7 clamps the
// zoom behind the previous beat's plan end); the chain still holds the cover to
// the sidepanel start.
const COVER_TO_PANEL_GAP = 0.5;

const idxAfter = (sec) => { let i = 0; while (i < WORDS.length && WORDS[i].start < sec) i++; return i; };
const B = (anchor, duration, mode, tier, purpose, slots = {}, cardId = null, lead = LEAD, after = 0) => {
  const a = findAnchor(anchor, after ? idxAfter(after) : 0);
  if (!a) throw new Error(`anchor not found: ${anchor}` + (after ? ` (after ${after}s)` : ""));
  const beat = { tier, purpose, mode, start: +(a.start - lead).toFixed(2), duration, anchor, slots };
  if (cardId) beat.cardId = cardId;
  if (after) beat.anchorAfter = after;
  return beat;
};
const T1 = "ais-live-v2.t1.", T2 = "ais-live-v2.t2.";
const COVER = new Set(["takeover", "flash"]);

const beats = [
  // ---------------------------------------------------------------- first half (unchanged)
  B("they watch tutorials", 6.0, "overlay", 2, "label", {}, T2 + "label.iconpop"),
  B("never actually build a complete system", 5.6, "sidepanel", 1, "thesis",
    { eyebrow: "WHAT MOST PEOPLE DO", headline: "TUTORIALS,<br>NO <em>SYSTEM</em>", sub: "Never a complete way to start and scale" }, T1 + "thesis.chrome"),
  B("two days building your own AI OS", 5.2, "takeover", 1, "thesis",
    { eyebrow: "TWO DAYS AT AIS LIVE", headline: "BUILD YOUR <em>AI OS</em>", sub: "" }, T1 + "thesis.hero"),
  B("averaging about", 5.4, "takeover", 1, "stat",
    { kicker: "THE COMPANY IT RUNS", stat: "$$420K", unit: "/MO", sub: "FEWER THAN 10 FULL-TIME EMPLOYEES" }, T1 + "stat.countup"),
  B("automate content, marketing, sales", 5.8, "overlay", 2, "label", {}, T2 + "label.iconpop"),
  B("I have a surprise for you", 1.9, "flash", 1, "section", { sub: "A SURPRISE" }, T1 + "section.markflash"),
  B("attend every future AIS Live event for free", 5.0, "takeover", 1, "thesis",
    { eyebrow: "THE SURPRISE", headline: "EVERY FUTURE EVENT <em>FREE</em>", sub: "" }, T1 + "thesis.hero"),
  B("New tools appear", 6.0, "overlay", 2, "label", {}, T2 + "label.iconpop"),
  B("AI Automation Society Plus", 5.6, "takeover", 1, "title",
    { eyebrow: "THE PLATFORM BEHIND IT ALL", headline: "AI AUTOMATION<br>SOCIETY <em>PLUS</em>", badge1: "COMMUNITY", badge2: "TRAINING" }, T1 + "title.event"),
  B("over 3,000 builders", 5.6, "takeover", 1, "stat",
    { kicker: "INSIDE AIS+", stat: "3700+", unit: "MEMBERS", sub: "OWNERS · ENGINEERS · AGENCIES · FREELANCERS" }, T1 + "stat.countup"),
  B("every AIS Live event is included", "next", "sidepanel", 1, "thesis",
    { eyebrow: "ON THE ANNUAL PLAN", headline: "EVERY EVENT<br><em>INCLUDED</em>", sub: "You never buy another ticket" }, T1 + "thesis.chrome"),
  B("free events are just the beginning", "next", "sidepanel", 1, "thesis",
    { eyebrow: "BUT THAT IS THE FLOOR", headline: "THE EVENT IS<br>THE <em>FIRST DRAFT</em>", sub: "AIS+ is how far you take it" }, T1 + "thesis.chrome"),
  B("how far can you actually take it", "next", "sidepanel", 1, "overview",
    { eyebrow: "THE QUESTION AFTER THE EVENT", caption: "" }, T1 + "overview.checklist"),
  B("four Claude Code build courses", "next", "sidepanel", 1, "diagram",
    { eyebrow: "INSIDE THE BUILD MODULES", caption: "Hands-on, step by step" }, T1 + "diagram.ladder"),
  B("Get Your First Client", "next", "sidepanel", 1, "thesis",
    { eyebrow: "MODULE 05", headline: "GET YOUR<br><em>FIRST CLIENTS</em>", sub: "Step by step, exactly how to land them" }, T1 + "thesis.chrome", 1.8), // 2:13.0
  B("the AI partner model", "next", "sidepanel", 1, "thesis",
    { eyebrow: "MODULE 02", headline: "THE AI<br><em>PARTNER MODEL</em>", sub: "" }, T1 + "thesis.chrome", 0.74), // 2:22.9 "Then there's"; the $100K/mo stat is a bullet on this card (post-build)
  B("live Q&As", 13.42, "sidepanel", 1, "icons", // holds to 2:49.3, the end of "...questions live." (Aidan 9/2)
    { eyebrow: "EVERY SINGLE WEEK", headline: "LIVE <em>Q&amp;AS</em>", sub: "Show up, ask, get unstuck in real time" }, T1 + "icons.row", 0.7), // 2:35.9

  // ---------------------------------------------------------------- second half (r2)
  // 2:50 tech support: chips pop on their words, the strip stays through "...answer your questions."
  B("unlimited tech support", ["until", "answer your questions"], "overlay", 2, "label", {}, T2 + "label.iconpop"),
  // 3:01 $3M tool deals: the count lands as he says "$3 million", then hands to the discounts panel
  B("3 million in exclusive tool deals", "next", "takeover", 1, "stat",
    { kicker: "EXCLUSIVE TOOL DEALS", stat: "$$3M", unit: "+", sub: "ON THE SOFTWARE YOU WILL NEED" }, T1 + "stat.countup", 1.3),
  B("discounts on the software", "next", "sidepanel", 1, "thesis",
    { eyebrow: "MEMBER EXCLUSIVE", headline: "DISCOUNTS ON<br>THE <em>SOFTWARE</em>", sub: "Everything you need to run and build your business" }, T1 + "thesis.chrome", LEAD2),
  // 3:11 the community: 3,700+ (Aidan 9/2), chips pop on "ahead of you / beside you / 11 PM"
  B("community of over 3,000 builders", "next", "sidepanel", 1, "icons",
    { eyebrow: "ON THE SAME PATH AS YOU", headline: "3,700+ <em>BUILDERS</em>", sub: "" }, T1 + "icons.row", LEAD2),
  // 3:26 price
  B("129 bucks per month", "next", "sidepanel", 1, "thesis",
    { eyebrow: "NORMALLY", headline: "$$129<em>/MONTH</em>", sub: "That is $$1,548 a year" }, T1 + "thesis.chrome", LEAD2),
  B("avoiding one unnecessary hire or landing", "next", "sidepanel", 1, "thesis",
    { eyebrow: "WORTH EVERY PENNY", headline: "ONE HIRE AVOIDED<br><em>PAYS THE YEAR</em>", sub: "Or one client project" }, T1 + "thesis.chrome", LEAD2),
  B("make this a no-brainer", "next", "sidepanel", 1, "thesis",
    { eyebrow: "YOU JOINED AIS LIVE", headline: "A <em>NO-BRAINER</em>", sub: "So here is the deal" }, T1 + "thesis.chrome", LEAD2),
  B("799 per year", "next", "takeover", 1, "stat",
    { kicker: "ON THIS PAGE ONLY", stat: "$$799", unit: "/YR", sub: "ABOUT $$67 A MONTH" }, T1 + "stat.countup", 1.4),
  B("749 compared", "next", "takeover", 1, "stat",
    { kicker: "YOU SAVE", stat: "$$749", unit: "", sub: "VS THE MONTHLY PLAN" }, T1 + "stat.countup", 1.4),
  B("locked in for life", "next", "sidepanel", 1, "thesis",
    { eyebrow: "THE BEST PART", headline: "LOCKED IN<br><em>FOR LIFE</em>", sub: "Your price will literally never go up" }, T1 + "thesis.chrome", 0.9),
  B("No matter how many new courses", "next", "sidepanel", 1, "thesis",
    { eyebrow: "NO MATTER WHAT WE ADD", headline: "SAME PRICE<br><em>FOREVER</em>", sub: "New courses, new events, still $$799 a year" }, T1 + "thesis.chrome", LEAD2),
  // 4:05 nothing to wait for
  B("You don't have to wait for AIS Live", "next", "sidepanel", 1, "thesis",
    { eyebrow: "WHAT I LOVE MOST", headline: "NO WAITING FOR<br><em>AIS LIVE</em>", sub: "" }, T1 + "thesis.chrome", LEAD2),
  B("every single course unlocks", "next", "sidepanel", 1, "thesis",
    { eyebrow: "THE MOMENT YOU JOIN", headline: "EVERYTHING<br><em>UNLOCKS</em>", sub: "No timers. No 30-day waits." }, T1 + "thesis.chrome", LEAD2),
  B("You get the Claude Code builds", "next", "sidepanel", 1, "overview",
    { eyebrow: "SIX MODULES, TONIGHT", caption: "" }, T1 + "overview.checklist", LEAD2),
  B("not starting from zero", "next", "sidepanel", 1, "thesis",
    { eyebrow: "WHEN AIS LIVE STARTS", headline: "NOT STARTING<br>FROM <em>ZERO</em>", sub: "" }, T1 + "thesis.chrome", LEAD2),
  B("reps already logged", ["until", "on YouTube"], "sidepanel", 1, "thesis", // NOT FROM ZERO holds through "skills already built"
    { eyebrow: "YOU WALK IN WITH", headline: "SKILLS BUILT.<br>REPS <em>LOGGED.</em>", sub: "Questions that come from doing the work" }, T1 + "thesis.chrome", LEAD2),
  // 4:31 every future event: lower-third chips on a full-frame Nate
  B("every future AIS Live event is yours", ["until", "another ticket"], "overlay", 2, "label", {}, T2 + "label.iconpop"),
  // 4:37 WHAT / WHO / HOW chain (the HOW THEY WORK TOGETHER flash was cut 9/2 — Aidan: "remove this from the comp")
  B("AIS Live tells you the what", "next", "sidepanel", 1, "thesis",
    { eyebrow: "AIS LIVE", headline: "TELLS YOU<br>THE <em>WHAT</em>", sub: "What an AI OS looks like. What to automate first. What to build." }, T1 + "thesis.chrome", LEAD2),
  B("walk away with the first working draft", "next", "sidepanel", 1, "thesis",
    { eyebrow: "YOU WALK AWAY WITH", headline: "THE FIRST DRAFT<br>OF YOUR <em>AI OS</em>", sub: "And exactly what to focus on" }, T1 + "thesis.chrome", LEAD2),
  B("gives you the who and the how", "next", "sidepanel", 1, "thesis",
    { eyebrow: "AIS+", headline: "THE <em>WHO</em><br>AND THE <em>HOW</em>", sub: "" }, T1 + "thesis.chrome", LEAD2),
  B("over 3,000 builders, business owners", "next", "sidepanel", 1, "overview",
    { eyebrow: "THE WHO: COMMUNITY", caption: "You never get stuck" }, T1 + "overview.agenda", 0.9, 290), // the 1:19 stat card says the same words
  B("the how is the step-by-step training", ["until", "of your business"], "sidepanel", 1, "diagram",
    { eyebrow: "THE HOW", caption: "The structured path, start to finish" }, T1 + "diagram.ladder", LEAD2),
  // 5:30 unlocks tonight -> what you do tonight -> the audience beats
  B("the moment you click the button below", "next", "sidepanel", 1, "thesis",
    { eyebrow: "NOTHING TO WAIT FOR", headline: "IT ALL UNLOCKS<br><em>TONIGHT</em>", sub: "" }, T1 + "thesis.chrome", LEAD2),
  B("going through the courses", "next", "sidepanel", 1, "overview",
    { eyebrow: "START TONIGHT", caption: "" }, T1 + "overview.agenda", 0.9),
  B("not sitting in the audience", "next", "sidepanel", 1, "thesis",
    { eyebrow: "AIS LIVE KICKS OFF", headline: "NOT <em>WONDERING</em><br>HOW TO START", sub: "" }, T1 + "thesis.chrome", 0.9),
  B("skills already built", "next", "sidepanel", 1, "thesis",
    { eyebrow: "IN THE AUDIENCE WITH", headline: "SKILLS ALREADY<br><em>BUILT</em>", sub: "Better questions. Ready to act the very next day." }, T1 + "thesis.chrome", LEAD2, 300),
  // 5:49 guarantee -> join today -> every dollar back -> the callback -> keep extending -> CTA
  B("seven-day money-back guarantee", "next", "takeover", 1, "thesis",
    { eyebrow: "ZERO RISK", headline: "7-DAY <em>GUARANTEE</em>", sub: "Every dollar back. No questions asked." }, T1 + "thesis.hero", 1.15),
  B("you explore everything", "next", "sidepanel", 1, "overview",
    { eyebrow: "SO YOU JOIN TODAY", caption: "" }, T1 + "overview.checklist", LEAD2),
  B("feel like it's worth it", "next", "sidepanel", 1, "thesis", // eyebrow lands on "not worth it", headline on "every dollar back"
    { eyebrow: "IF IT IS NOT WORTH IT", headline: "EVERY DOLLAR<br><em>BACK</em>", sub: "No questions asked" }, T1 + "thesis.chrome", LEAD2),
  B("avoiding one unnecessary hire", "next", "sidepanel", 1, "thesis",
    { eyebrow: "AGAIN", headline: "ONE HIRE AVOIDED<br><em>PAYS THE YEAR</em>", sub: "Or one client project. Your entire year of AIS+." }, T1 + "thesis.chrome", LEAD, 300), // enters on "Again,"
  B("between the training, the community", "next", "sidepanel", 1, "thesis",
    { eyebrow: "EVERYTHING YOU NEED", headline: "KEEP <em>EXTENDING</em><br>YOUR AI OS", sub: "Automate more of your business, and your life" }, T1 + "thesis.chrome", LEAD),
  B("click the button below, lock in", "end", "takeover", 1, "cta",
    { eyebrow: "AIS+ ANNUAL", headline: "LOCK IN <em>$$799/YR</em>", badge1: "LOCKED FOR LIFE", badge2: "7-DAY GUARANTEE", cta: "CLICK BELOW", sub: "Every future AIS Live event included" }, T1 + "cta.date", 0.9),
];

// A literal "$" in a slot value is a String.replace backreference in build-beats
// and silently corrupts the card markup (every later beat nests inside it).
// Always write "$$"; this catches a lone one before it reaches the build.
beats.forEach((b) => {
  for (const [k, v] of Object.entries(b.slots || {})) {
    if (typeof v !== "string") continue;
    if (/(^|[^$])\$([^$]|$)/.test(v.replace(/\$\$/g, ""))) {
      throw new Error(`slot ${k} on "${b.anchor}" has a lone $ — write $$ instead: ${v}`);
    }
  }
});

// starts must be monotonic — a mis-resolved anchor shows up here, not as a silent overlap
beats.forEach((b, i) => { if (i && b.start <= beats[i - 1].start) throw new Error(`beat order: "${b.anchor}" (${b.start}) starts before "${beats[i - 1].anchor}" (${beats[i - 1].start})`); });

// ---- resolve "when does it end" -------------------------------------------
beats.forEach((b, i) => {
  const n = beats[i + 1];
  if (typeof b.duration === "number") return;
  let end;
  if (b.duration === "next") {
    if (!n) throw new Error(`"next" on the last beat: ${b.anchor}`);
    end = n.start;
    if (COVER.has(b.mode) && n.mode === "sidepanel") end -= COVER_TO_PANEL_GAP;
  } else if (b.duration === "end") {
    end = VIDEO_END;
  } else if (Array.isArray(b.duration) && b.duration[0] === "until") {
    const a = findAnchor(b.duration[1], idxAfter(b.start));
    if (!a) throw new Error(`until-phrase not found after ${b.start}: ${b.duration[1]}`);
    end = a.end + TAIL;
    b.until = b.duration[1];
  } else throw new Error(`bad duration on ${b.anchor}: ${JSON.stringify(b.duration)}`);
  b.duration = +(end - b.start).toFixed(2);
  console.log(`${String(b.mode).padEnd(9)} ${b.start.toFixed(2)} -> ${end.toFixed(2)}  (${b.duration}s)  ${b.anchor}`);
});

// clamp any beat that would run into the next one (same track cannot overlap)
beats.forEach((b, i) => {
  const n = beats[i + 1];
  if (!n) return;
  const over = b.start + b.duration - (n.start - 0.02);
  if (over > 0) {
    b.duration = +(b.duration - over).toFixed(2);
    if (over > 0.03) console.log(`clamped "${b.anchor}" by ${over.toFixed(2)}s -> ${b.duration}s`);
    if (b.duration < 1.5) throw new Error(`beat too short after clamp: ${b.anchor}`);
  }
});

const plan = {
  style: "ais-live-v2",
  video: "assets/clean.mp4",
  width: 1920, height: 1080, fps: 30,
  seed: "ais-plus-annual-upsell",
  beats,
};
writeFileSync("assets/beat-plan.json", JSON.stringify(plan, null, 2));
console.log(`${beats.length} beats · last ends ${(beats.at(-1).start + beats.at(-1).duration).toFixed(2)}`);
