// Beat plan generator for the AIS+ Annual Upsell.
// Anchors are verbatim phrases; starts are resolved from assets/transcript.json
// so every beat enters LEAD seconds before its word (Gate 0 window -0.2..1.8).
import { writeFileSync } from "node:fs";
import { findAnchor } from "./_anchors.mjs";

const LEAD = 0.3;
const B = (anchor, duration, mode, tier, purpose, slots = {}, cardId = null, lead = LEAD) => {
  const a = findAnchor(anchor);
  if (!a) throw new Error(`anchor not found: ${anchor}`);
  const beat = { tier, purpose, mode, start: +(a.start - lead).toFixed(2), duration, anchor, slots };
  if (cardId) beat.cardId = cardId;
  return beat;
};
const T1 = "ais-live-v2.t1.", T2 = "ais-live-v2.t2.";

const beats = [
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
  B("every AIS Live event is included", 5.8, "sidepanel", 1, "thesis",
    { eyebrow: "ON THE ANNUAL PLAN", headline: "EVERY EVENT<br><em>INCLUDED</em>", sub: "You never buy another ticket" }, T1 + "thesis.chrome"),
  B("free events are just the beginning", 5.4, "sidepanel", 1, "thesis",
    { eyebrow: "BUT THAT IS THE FLOOR", headline: "THE EVENT IS<br>THE <em>FIRST DRAFT</em>", sub: "AIS+ is how far you take it" }, T1 + "thesis.chrome"),
  B("how far can you actually take it", 9.5, "sidepanel", 1, "overview",
    { eyebrow: "THE QUESTION AFTER THE EVENT", caption: "" }, T1 + "overview.checklist"),
  B("four Claude Code build courses", 8.6, "sidepanel", 1, "diagram",
    { eyebrow: "INSIDE THE BUILD MODULES", caption: "Hands-on, step by step" }, T1 + "diagram.ladder"),
  B("Get Your First Client", 5.6, "sidepanel", 1, "thesis",
    { eyebrow: "MODULE 05", headline: "GET YOUR<br><em>FIRST CLIENTS</em>", sub: "Step by step, exactly how to land them" }, T1 + "thesis.chrome", 1.8), // 2:13.0
  B("the AI partner model", 3.5, "sidepanel", 1, "thesis",
    { eyebrow: "MODULE 02", headline: "THE AI<br><em>PARTNER MODEL</em>", sub: "" }, T1 + "thesis.chrome", 0.74), // 2:22.9 "Then there's"; the $100K/mo stat is a bullet on this card (post-build)
  B("live Q&As", 13.42, "sidepanel", 1, "icons", // holds to 2:49.3, the end of "...questions live." (Aidan 9/2)
    { eyebrow: "EVERY SINGLE WEEK", headline: "LIVE <em>Q&amp;AS</em>", sub: "Show up, ask, get unstuck in real time" }, T1 + "icons.row", 0.7), // 2:35.9
  B("unlimited tech support", 6.4, "overlay", 2, "label", {}, T2 + "label.iconpop"),
  B("3 million in exclusive tool deals", 5.4, "takeover", 1, "stat",
    { kicker: "EXCLUSIVE TOOL DEALS", stat: "$$3M", unit: "+", sub: "ANNUAL MEMBER EXCLUSIVE" }, T1 + "stat.countup"),
  B("people who are ahead of you", 7.4, "pip", 1, "icons",
    { eyebrow: "THE ROOM YOU JOIN", headline: "3,000 <em>BUILDERS</em>", sub: "" }, T1 + "icons.row"),
  B("129 bucks per month", 5.2, "sidepanel", 1, "thesis",
    { eyebrow: "NORMALLY", headline: "$$129<em>/MONTH</em>", sub: "That is $$1,548 a year" }, T1 + "thesis.chrome"),
  B("avoiding one unnecessary hire or landing", 5.4, "sidepanel", 1, "thesis",
    { eyebrow: "WORTH EVERY PENNY", headline: "ONE HIRE AVOIDED<br><em>PAYS THE YEAR</em>", sub: "" }, T1 + "thesis.chrome"),
  B("the annual plan for just", 4.6, "takeover", 1, "stat",
    { kicker: "ON THIS PAGE ONLY", stat: "$$799", unit: "/YR", sub: "ABOUT $$67 A MONTH" }, T1 + "stat.countup"),
  B("you save", 4.4, "takeover", 1, "stat",
    { kicker: "YOU SAVE", stat: "$$749", unit: "", sub: "VS THE MONTHLY PLAN" }, T1 + "stat.countup"),
  B("that rate is locked in for life", 5.0, "takeover", 1, "thesis",
    { eyebrow: "AND IT NEVER MOVES", headline: "LOCKED IN <em>FOR LIFE</em>", sub: "" }, T1 + "thesis.hero"),
  B("every single course unlocks", 4.4, "sidepanel", 1, "thesis",
    { eyebrow: "THE MOMENT YOU JOIN", headline: "EVERYTHING<br><em>UNLOCKS</em>", sub: "No timers. No 30-day waits." }, T1 + "thesis.chrome"),
  B("You get the Claude Code builds", 8.4, "sidepanel", 1, "overview",
    { eyebrow: "ALL SIX MODULES, TONIGHT", caption: "" }, T1 + "overview.checklist"),
  B("every future AIS Live event is yours", 5.6, "overlay", 2, "label", {}, T2 + "label.iconpop"),
  B("tells you the what", 6.8, "sidepanel", 1, "thesis",
    { eyebrow: "AIS LIVE", headline: "TELLS YOU<br>THE <em>WHAT</em>", sub: "What an AI OS is. What to automate first." }, T1 + "thesis.chrome"),
  B("gives you the who and the how", 6.2, "sidepanel", 1, "thesis",
    { eyebrow: "AIS+", headline: "THE <em>WHO</em><br>AND THE <em>HOW</em>", sub: "" }, T1 + "thesis.chrome"),
  B("weekly live access to me", 7.6, "overlay", 2, "label", {}, T2 + "label.iconpop"),
  B("the how is the step-by-step training", 8.2, "sidepanel", 1, "diagram",
    { eyebrow: "THE HOW", caption: "The structured path, start to finish" }, T1 + "diagram.ladder"),
  B("the moment you click the button below", 5.6, "sidepanel", 1, "thesis",
    { eyebrow: "NOTHING TO WAIT FOR", headline: "IT ALL UNLOCKS<br><em>TONIGHT</em>", sub: "" }, T1 + "thesis.chrome"),
  B("not sitting in the audience", 6.6, "sidepanel", 1, "thesis",
    { eyebrow: "BY THE TIME AIS LIVE STARTS", headline: "SKILLS ALREADY<br><em>BUILT</em>", sub: "Better questions. Ready to act the next day." }, T1 + "thesis.chrome"),
  B("seven-day money-back guarantee", 5.2, "takeover", 1, "thesis",
    { eyebrow: "ZERO RISK", headline: "7-DAY <em>GUARANTEE</em>", sub: "Every dollar back. No questions asked." }, T1 + "thesis.hero"),
  B("no questions asked", 5.4, "overlay", 2, "label", {}, T2 + "label.iconpop"),
  B("between the training, the community", 5.6, "sidepanel", 1, "thesis",
    { eyebrow: "TRAINING · COMMUNITY · EVENTS", headline: "KEEP <em>EXTENDING</em><br>YOUR AI OS", sub: "" }, T1 + "thesis.chrome"),
  B("click the button below, lock in", 6.2, "takeover", 1, "cta",
    { eyebrow: "AIS+ ANNUAL", headline: "LOCK IN <em>$$799/YR</em>", badge1: "LOCKED FOR LIFE", badge2: "7-DAY GUARANTEE", cta: "CLICK BELOW", sub: "Every future AIS Live event included" }, T1 + "cta.date"),
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

// HOLD (Aidan 9/2): from 1:31 to the Q&A card every sidepanel card stays up until the
// next one enters, so the zoom goes in ONCE and the scrim never drops between cards
// ("keep the zoom of Nate's face, it's going in and out a lot; have those motion
// graphics stay until he starts talking about the next section").
const HOLD_UNTIL_NEXT = new Set([
  "every AIS Live event is included", "free events are just the beginning",
  "how far can you actually take it", "four Claude Code build courses",
  "Get Your First Client", "the AI partner model",
]);
beats.forEach((b, i) => {
  const n = beats[i + 1];
  if (!n || !HOLD_UNTIL_NEXT.has(b.anchor)) return;
  b.duration = +(n.start - b.start).toFixed(2);
  console.log(`hold "${b.anchor}" -> ${b.duration}s (until ${n.start})`);
});

// clamp any beat that would run into the next one (same track cannot overlap)
beats.forEach((b, i) => {
  const n = beats[i + 1];
  if (!n) return;
  const over = b.start + b.duration - (n.start - 0.02);
  if (over > 0) {
    b.duration = +(b.duration - over).toFixed(2);
    console.log(`clamped "${b.anchor}" by ${over.toFixed(2)}s -> ${b.duration}s`);
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
