import fs from "fs";
import path from "path";

const ROOT = path.resolve(".");
const DURATION = 1514.37;
const SOURCE_MEDIA = "assets/edited-clean-render.mp4";

const beats = [
  {
    id: "b001",
    type: "paper",
    start: 5.45,
    duration: 6.55,
    label: "Starting from zero",
    title: "Sell hours first.",
    lines: ["Projects and retainers come later."],
  },
  {
    id: "b002",
    type: "glass",
    start: 18.6,
    duration: 9.4,
    label: "Today's map",
    title: "Three things",
    lines: ["The offer", "What the hour looks like", "Your first 10 clients"],
  },
  {
    id: "b003",
    type: "glass",
    start: 38.2,
    duration: 14.0,
    label: "Common advice",
    title: "Audits -> projects -> retainers",
    lines: ["Directionally right, but too high to start."],
  },
  {
    id: "b004",
    type: "glass",
    start: 56.1,
    duration: 10.9,
    label: "The missing rung",
    title: "Rung 0 is the doorway",
    lines: ["Start where proof and confidence are still small."],
  },
  {
    id: "b005",
    type: "paper",
    start: 75.1,
    duration: 9.6,
    label: "The core offer",
    title: "Just start by selling hours.",
    lines: ["One-on-one AI OS setup with a business owner."],
  },
  {
    id: "b005a",
    type: "glass",
    start: 92.55,
    duration: 8.6,
    label: "Why this lens",
    title: "Operator to educator",
    lines: ["Built and exited a $100k/mo agency", "Now teaching 375k+ AI learners"],
  },
  {
    id: "b005b",
    type: "glass",
    start: 101.35,
    duration: 10.45,
    label: "Two-sided view",
    title: "Owners ask. Builders get stuck.",
    lines: ["Demand from business owners", "Friction from new consultants"],
  },
  {
    id: "b006",
    type: "paper",
    start: 112.3,
    duration: 8.9,
    label: "Rung 0",
    title: "Sell hours.",
    lines: ["$100-$500 sessions. Build the relationship."],
  },
  {
    id: "b006a",
    type: "paper",
    start: 126.7,
    duration: 8.4,
    label: "Rung 1",
    title: "Paid audit.",
    lines: ["Map the workflows. Scope the first real build."],
  },
  {
    id: "b006b",
    type: "paper",
    start: 139.9,
    duration: 11.8,
    label: "Rung 2",
    title: "Focused project.",
    lines: ["Ship one workflow end to end and prove ROI."],
  },
  {
    id: "b006c",
    type: "paper",
    start: 152.7,
    duration: 11.3,
    label: "Rung 3",
    title: "Retainer.",
    lines: ["Ongoing work comes after trust and results."],
  },
  {
    id: "b007",
    type: "glass",
    start: 165.0,
    duration: 26.0,
    label: "Why people freeze",
    title: "They try to skip rungs",
    lines: ["No proof. No relationship. Too much pressure."],
  },
  {
    id: "b008",
    type: "glass",
    start: 197.1,
    duration: 7.4,
    label: "Starting line",
    title: "Rung 0 builds the base",
    lines: ["Earn the next conversation before the big offer."],
  },
  {
    id: "b009",
    type: "paper",
    start: 205.0,
    duration: 8.4,
    label: "Reason 1",
    title: "Mini sales call. Mini audit.",
    lines: ["The hour turns a cold lead into a working relationship."],
  },
  {
    id: "b010",
    type: "glass",
    start: 221.8,
    duration: 19.2,
    label: "Trust",
    title: "You are already inside the business",
    lines: ["The relationship starts with collaboration."],
  },
  {
    id: "b011",
    type: "glass",
    start: 253.5,
    duration: 25.3,
    label: "Smaller ask",
    title: "A few hundred beats five grand",
    lines: ["Low proof requirement. Real-time answers. Less risk."],
  },
  {
    id: "b012",
    type: "paper",
    start: 285.7,
    duration: 8.9,
    label: "Reason 2",
    title: "Get paid to scope.",
    lines: ["Discovery work becomes billable from the first hour."],
  },
  {
    id: "b013",
    type: "glass",
    start: 300.2,
    duration: 22.2,
    label: "Discovery data",
    title: "You see the real workflow",
    lines: ["Data sources", "Team friction", "Automation targets"],
  },
  {
    id: "b014",
    type: "paper",
    start: 323.0,
    duration: 8.0,
    label: "Reason 3",
    title: "Switching gets harder.",
    lines: ["Every session makes you harder to replace."],
  },
  {
    id: "b015",
    type: "glass",
    start: 331.2,
    duration: 18.8,
    label: "Vendor stickiness",
    title: "You know the context",
    lines: ["Team", "Data", "Workflows", "Priorities"],
  },
  {
    id: "b016",
    type: "glass",
    start: 352.6,
    duration: 13.2,
    label: "Next engagement",
    title: "You become the obvious choice",
    lines: ["They have seen the power and already trust you."],
  },
  {
    id: "b017",
    type: "glass",
    start: 391.0,
    duration: 30.0,
    label: "Old mistake",
    title: "Do not silo consulting calls",
    lines: ["The hour should feed the project path."],
  },
  {
    id: "b018",
    type: "paper",
    start: 445.5,
    duration: 8.8,
    label: "Mindset shift",
    title: "The hour is not tech support.",
    lines: ["It is the first deposit into a long-term partnership."],
  },
  {
    id: "b019",
    type: "glass",
    start: 454.5,
    duration: 12.0,
    label: "Why now",
    title: "The market is ready in 2026",
    lines: ["The gap is showing up inside real companies."],
  },
  {
    id: "b020",
    type: "paper",
    start: 468.4,
    duration: 8.8,
    label: "IBM CEO study",
    title: "2,000 CEOs. Two stats.",
    lines: ["The adoption problem is already visible."],
  },
  {
    id: "b021",
    type: "paper",
    start: 478.0,
    duration: 17.5,
    label: "The gap",
    title: "A 61-point adoption gap.",
    lines: ["Employees have skills. They are not using them."],
  },
  {
    id: "b022",
    type: "glass",
    start: 500.1,
    duration: 19.0,
    label: "Leadership pressure",
    title: "AI fluency is becoming table stakes",
    lines: ["Managers who cannot lead AI-native teams are exposed."],
  },
  {
    id: "b023",
    type: "paper",
    start: 526.0,
    duration: 12.0,
    label: "The answer",
    title: "Not a 30k strategy deck.",
    lines: ["One workflow. One manager. One employee at a time."],
  },
  {
    id: "b024",
    type: "glass",
    start: 544.8,
    duration: 24.0,
    label: "Offer reframe",
    title: "This is not a ChatGPT tutorial",
    lines: ["The hour sets up an AI operating system."],
  },
  {
    id: "b025",
    type: "paper",
    start: 576.9,
    duration: 8.8,
    label: "Pause and define it",
    title: "AI operating system",
    lines: ["The place your business data, workflows, and context live."],
  },
  {
    id: "b026",
    type: "glass",
    start: 585.7,
    duration: 17.3,
    label: "AI OS",
    title: "Data + expertise + workflows",
    lines: ["The system reduces the bottleneck around the owner."],
  },
  {
    id: "b027",
    type: "glass",
    start: 604.0,
    duration: 18.1,
    label: "Builder note",
    title: "You do not need to be an engineer",
    lines: ["Use the framework, then teach the framework."],
  },
  {
    id: "b028",
    type: "glass",
    start: 622.3,
    duration: 18.0,
    label: "Playbook",
    title: "Learn it once. Sell it many times.",
    lines: ["Your own AI OS becomes the client framework."],
  },
  {
    id: "b029",
    type: "paper",
    start: 646.9,
    duration: 18.1,
    label: "The pitch",
    title: "Set up your AI operating system.",
    lines: ["Connect the business data. Capture the expertise. Reduce key-man risk."],
  },
  {
    id: "b030",
    type: "glass",
    start: 675.5,
    duration: 9.0,
    label: "Positioning",
    title: "Offer an operating system",
    lines: ["Not an AI tutorial."],
  },
  {
    id: "b031",
    type: "paper",
    start: 684.7,
    duration: 14.0,
    label: "Client expertise",
    title: "The owner has to build the right system.",
    lines: ["You make their expertise dangerous with the tool."],
  },
  {
    id: "b032",
    type: "glass",
    start: 705.8,
    duration: 14.0,
    label: "The exchange",
    title: "Tool fluency -> domain fluency",
    lines: ["Your tool skill meets their business context."],
  },
  {
    id: "b033",
    type: "paper",
    start: 720.8,
    duration: 7.6,
    label: "Inside the hour",
    title: "Give the session a flow.",
    lines: ["Background, tools, data sources, then the next session."],
  },
  {
    id: "b034",
    type: "glass",
    start: 728.6,
    duration: 25.0,
    label: "Session flow",
    title: "Make them tool fluent",
    lines: ["Desktop app vs extension", "Project folder context", "Data source setup"],
  },
  {
    id: "b035",
    type: "paper",
    start: 771.2,
    duration: 9.2,
    label: "Real job",
    title: "Manage overwhelm.",
    lines: ["Keep the pace low enough that they book the next session."],
  },
  {
    id: "b036",
    type: "glass",
    start: 780.6,
    duration: 25.4,
    label: "Facilitation",
    title: "Slow down when they lose the thread",
    lines: ["Patience keeps the relationship moving."],
  },
  {
    id: "b037",
    type: "paper",
    start: 820.6,
    duration: 9.5,
    label: "When you do not know",
    title: "Say it cleanly.",
    lines: ["I do not know. Let's figure it out together."],
  },
  {
    id: "b038",
    type: "glass",
    start: 844.4,
    duration: 16.0,
    label: "Follow-through",
    title: "Research. Test. Return with the answer.",
    lines: ["That is problem solving, not weakness."],
  },
  {
    id: "b039",
    type: "glass",
    start: 868.2,
    duration: 22.0,
    label: "Role clarity",
    title: "You are the complexity barrier",
    lines: ["They do not need Google. They need a problem solver."],
  },
  {
    id: "b040",
    type: "paper",
    start: 894.6,
    duration: 9.8,
    label: "Early priority",
    title: "Optimize for reps and experience.",
    lines: ["The cash comes after confidence."],
  },
  {
    id: "b041",
    type: "glass",
    start: 909.6,
    duration: 16.5,
    label: "Overdeliver",
    title: "Stay useful after the call",
    lines: ["Extra minutes. Follow-up email. Two or three next steps."],
  },
  {
    id: "b042",
    type: "paper",
    start: 938.5,
    duration: 4.0,
    label: "First clients",
    title: "Seven steps to get conversations.",
    lines: ["Each layer builds off the one before it."],
  },
  {
    id: "b043",
    type: "glass",
    start: 942.7,
    duration: 18.0,
    label: "Step 1",
    title: "Teach friends first",
    lines: ["Low stakes reps before business-owner pressure."],
  },
  {
    id: "b044",
    type: "glass",
    start: 971.2,
    duration: 25.0,
    label: "Practice loop",
    title: "Notice what people ask repeatedly",
    lines: ["Your rough explanations become the next version."],
  },
  {
    id: "b045",
    type: "glass",
    start: 1004.0,
    duration: 16.0,
    label: "Step 2",
    title: "Text warm business owners",
    lines: ["Offer the hour for reps, not pressure."],
  },
  {
    id: "b046",
    type: "glass",
    start: 1030.9,
    duration: 16.8,
    label: "Step 3",
    title: "Ask for the next warm intro",
    lines: ["Every session ends with one referral question."],
  },
  {
    id: "b047",
    type: "glass",
    start: 1052.8,
    duration: 26.5,
    label: "Step 4",
    title: "Be useful in communities",
    lines: ["Support threads can become calls, partners, and jobs."],
  },
  {
    id: "b048",
    type: "glass",
    start: 1084.0,
    duration: 24.5,
    label: "Step 5",
    title: "Build a visible proof trail",
    lines: ["LinkedIn posts", "Short case studies", "A simple portfolio"],
  },
  {
    id: "b049",
    type: "glass",
    start: 1110.8,
    duration: 24.8,
    label: "Step 6",
    title: "Keep delivering",
    lines: ["At some point, the project conversation becomes natural."],
  },
  {
    id: "b050",
    type: "paper",
    start: 1136.0,
    duration: 14.0,
    label: "Step 7",
    title: "Use proof before cold local outreach.",
    lines: ["Local businesses work better after you have receipts."],
  },
  {
    id: "b051",
    type: "glass",
    start: 1165.6,
    duration: 29.0,
    label: "Example",
    title: "Consulting calls opened the door",
    lines: ["Screen share, build together, explain the system."],
  },
  {
    id: "b052",
    type: "paper",
    start: 1208.8,
    duration: 9.8,
    label: "The moment",
    title: "Could I just have you build this?",
    lines: ["No pitch. The trust created the ask."],
  },
  {
    id: "b053",
    type: "glass",
    start: 1228.0,
    duration: 31.0,
    label: "Turning the corner",
    title: "Now you can propose real work",
    lines: ["Tie the workflow to a problem you have already seen."],
  },
  {
    id: "b054",
    type: "paper",
    start: 1272.5,
    duration: 8.5,
    label: "The ladder returns",
    title: "Hours are the on-ramp.",
    lines: ["Rung 0 -> audit -> project -> retainer"],
  },
  {
    id: "b055",
    type: "glass",
    start: 1283.5,
    duration: 16.0,
    label: "Fit check",
    title: "What do you actually enjoy?",
    lines: ["Sales, building, teaching, or partnering?"],
  },
  {
    id: "b056",
    type: "glass",
    start: 1300.8,
    duration: 31.2,
    label: "Other paths",
    title: "Entrepreneurship is not the only route",
    lines: ["Partner up or become the internal AI educator."],
  },
  {
    id: "b057",
    type: "paper",
    start: 1336.8,
    duration: 10.5,
    label: "IBM study",
    title: "57% of chief AI officers were promoted internally.",
    lines: ["The internal path is real."],
  },
  {
    id: "b058",
    type: "glass",
    start: 1350.5,
    duration: 15.0,
    label: "Safe pivot",
    title: "Do not make reckless jumps",
    lines: ["Build the bridge before you leave the shore."],
  },
  {
    id: "b059",
    type: "paper",
    start: 1368.7,
    duration: 13.0,
    label: "If they are not ready",
    title: "Do not push.",
    lines: ["Leave it clean. No pressure. No bad taste."],
  },
  {
    id: "b060",
    type: "glass",
    start: 1383.2,
    duration: 26.0,
    label: "Buyer fit",
    title: "Do not drag in an unconvinced buyer",
    lines: ["You want excitement and willingness to meet halfway."],
  },
  {
    id: "b061",
    type: "paper",
    start: 1415.7,
    duration: 10.8,
    label: "Partnership energy",
    title: "No worries. I am your guy when you need me.",
    lines: ["Keep the relationship open."],
  },
  {
    id: "b062",
    type: "paper",
    start: 1444.4,
    duration: 17.0,
    label: "Takeaway",
    title: "Imposter syndrome is a rungs problem.",
    lines: ["Step down, build proof, then climb."],
  },
  {
    id: "b063",
    type: "glass",
    start: 1477.0,
    duration: 17.5,
    label: "Final reminder",
    title: "Reps show up before confidence does",
    lines: ["The client can feel the hours under your belt."],
  },
  {
    id: "b064",
    type: "glass",
    start: 1494.7,
    duration: 18.6,
    label: "Start here",
    title: "Build your own AI OS first",
    lines: ["Then teach the exact framework to someone else."],
  },
];

const byId = new Set();
for (const beat of beats) {
  if (byId.has(beat.id)) throw new Error(`Duplicate beat id: ${beat.id}`);
  byId.add(beat.id);
  if (beat.start < 0 || beat.duration <= 0) throw new Error(`Invalid timing for ${beat.id}`);
  if (beat.start + beat.duration > DURATION + 0.1) throw new Error(`Beat exceeds duration: ${beat.id}`);
}

const sorted = [...beats].sort((a, b) => a.start - b.start);
const gaps = [];
let cursor = 0;
for (const beat of sorted) {
  if (beat.start - cursor > 30) gaps.push({ start: cursor, end: beat.start, gap: beat.start - cursor });
  cursor = Math.max(cursor, beat.start + beat.duration);
}
if (DURATION - cursor > 30) gaps.push({ start: cursor, end: DURATION, gap: DURATION - cursor });

function seconds(value) {
  return Number(value).toFixed(2);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function richText(value) {
  return escapeHtml(value).replace(/\b(\d+%|\d+-point|Rung 0|rung 0|30k)\b/g, '<span class="accent">$1</span>');
}

function renderPaper(beat, index) {
  const lines = (beat.lines || []).map((line) => `<p>${richText(line)}</p>`).join("");
  return `      <section id="${beat.id}" class="clip beat-layer paper-beat" data-start="${seconds(beat.start)}" data-duration="${seconds(beat.duration)}" data-track-index="${20 + index}"><div class="paper-fiber paper-fiber-a"></div><div class="paper-fiber paper-fiber-b"></div><div class="paper-grid"></div><div class="paper-perspective"></div><div class="paper-scan"></div><div class="paper-vignette"></div><div class="paper-content"><div class="paper-label">${escapeHtml(beat.label)}</div><h1>${richText(beat.title)}</h1><div class="paper-lines">${lines}</div></div></section>`;
}

function renderGlass(beat, index) {
  const list = (beat.lines || []).map((line) => `<div class="glass-line">${escapeHtml(line)}</div>`).join("");
  return `      <section id="${beat.id}" class="clip beat-layer left-glass-beat" data-start="${seconds(beat.start)}" data-duration="${seconds(beat.duration)}" data-track-index="${20 + index}"><div class="glass-card left-popout"><div class="glass-sheen"><div class="glass-shine-bar"></div></div><div class="glass-content"><div class="glass-tag">${escapeHtml(beat.label)}</div><h2>${escapeHtml(beat.title)}</h2><div class="glass-lines">${list}</div></div></div></section>`;
}

const beatMarkup = sorted.map((beat, index) => (beat.type === "paper" ? renderPaper(beat, index) : renderGlass(beat, index))).join("\n");
const leftAnim = JSON.stringify(
  sorted.filter((beat) => beat.type === "glass").map(({ id, start, duration }) => ({ id, start, duration })),
);
const paperAnim = JSON.stringify(
  sorted.filter((beat) => beat.type === "paper").map(({ id, start, duration }) => ({ id, start, duration })),
);

function compactStyleBlocks(value) {
  return value.replace(/<style>([\s\S]*?)<\/style>/g, (_match, css) => {
    const compactCss = css.replace(/\s+/g, " ").replace(/\s*([{}:;,>])\s*/g, "$1").trim();
    return `<style>${compactCss}</style>`;
  });
}

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <title>Selling AI Education</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html,
      body {
        width: 1920px;
        height: 1080px;
        overflow: hidden;
        background: #030507;
        color: #f8fbff;
        font-family: "Inter", "Segoe UI", Arial, sans-serif;
      }

      #root {
        position: relative;
        width: 1920px;
        height: 1080px;
        overflow: hidden;
        background: #030507;
        isolation: isolate;
      }

      #video-stage {
        position: absolute;
        inset: 0;
        width: 1920px;
        height: 1080px;
        overflow: hidden;
        transform-origin: 0% 0%;
        will-change: transform;
        z-index: 0;
      }

      #main-video {
        position: absolute;
        inset: 0;
        width: 1920px;
        height: 1080px;
        object-fit: cover;
        display: block;
      }

      .beat-layer {
        position: absolute;
        inset: 0;
        width: 1920px;
        height: 1080px;
        pointer-events: none;
        overflow: hidden;
        opacity: 0;
      }

      .left-glass-beat {
        z-index: 5;
      }

      .glass-card.left-popout {
        position: absolute;
        left: 72px;
        top: 50%;
        width: 690px;
        max-width: 690px;
        min-height: 246px;
        padding: 42px 48px 44px;
        border-radius: 26px;
        transform: translateY(-50%);
        text-align: left;
        background:
          linear-gradient(135deg, rgba(12, 24, 36, 0.78), rgba(7, 15, 24, 0.58)),
          radial-gradient(circle at 18% 0%, rgba(134, 224, 255, 0.18), transparent 38%);
        border: 1px solid rgba(168, 230, 255, 0.34);
        box-shadow:
          0 28px 92px rgba(0, 0, 0, 0.48),
          inset 0 1px 0 rgba(255, 255, 255, 0.20),
          inset 0 -1px 0 rgba(125, 211, 252, 0.10);
        backdrop-filter: blur(22px) saturate(1.25);
        -webkit-backdrop-filter: blur(22px) saturate(1.25);
        overflow: hidden;
        will-change: transform, opacity;
      }

      .glass-sheen {
        position: absolute;
        inset: 0;
        opacity: 0.58;
        mix-blend-mode: screen;
      }

      .glass-shine-bar {
        position: absolute;
        left: -34%;
        top: -18%;
        width: 42%;
        height: 140%;
        transform: rotate(17deg);
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.20), transparent);
        filter: blur(8px);
      }

      .glass-content {
        position: relative;
        z-index: 1;
      }

      .glass-tag {
        display: inline-flex;
        align-items: center;
        min-height: 34px;
        padding: 7px 13px;
        margin-bottom: 18px;
        border-radius: 999px;
        color: #9be7ff;
        background: rgba(103, 232, 249, 0.12);
        border: 1px solid rgba(125, 211, 252, 0.22);
        font-size: 18px;
        line-height: 1;
        font-weight: 700;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .glass-card h2 {
        max-width: 590px;
        color: #ffffff;
        font-size: 46px;
        line-height: 1.04;
        font-weight: 760;
        letter-spacing: 0;
        text-wrap: balance;
      }

      .glass-lines {
        margin-top: 22px;
        display: grid;
        gap: 10px;
      }

      .glass-line {
        color: rgba(238, 248, 255, 0.88);
        font-size: 28px;
        line-height: 1.18;
        font-weight: 560;
        letter-spacing: 0;
        text-wrap: balance;
      }

      .paper-beat {
        z-index: 9;
        color: #f7fbff;
        background:
          radial-gradient(ellipse 940px 620px at 74% 24%, rgba(125, 211, 252, 0.14), transparent 68%),
          radial-gradient(ellipse 780px 520px at 22% 72%, rgba(110, 231, 183, 0.10), transparent 62%),
          radial-gradient(ellipse 500px 360px at 48% 50%, rgba(246, 193, 119, 0.035), transparent 66%),
          linear-gradient(180deg, #081118 0%, #030507 58%, #020304 100%);
        will-change: transform, opacity;
      }

      .paper-fiber,
      .paper-grid,
      .paper-perspective,
      .paper-scan,
      .paper-vignette {
        position: absolute;
        pointer-events: none;
      }

      .paper-fiber {
        inset: -6%;
        width: 112%;
        height: 112%;
        mix-blend-mode: screen;
        will-change: transform, opacity;
      }

      .paper-fiber-a {
        opacity: 0.18;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='480' height='480'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' seed='31'/><feColorMatrix values='0 0 0 0 0.12  0 0 0 0 0.55  0 0 0 0 0.70  0 0 0 0.34 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        background-size: 480px 480px;
      }

      .paper-fiber-b {
        opacity: 0.10;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='n'><feTurbulence type='turbulence' baseFrequency='0.026 0.12' numOctaves='3' seed='17'/><feColorMatrix values='0 0 0 0 0.44  0 0 0 0 0.90  0 0 0 0 0.72  0 0 0 0.32 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        background-size: 360px 360px;
      }

      .paper-grid {
        inset: 0;
        opacity: 0.72;
        background-image:
          linear-gradient(rgba(103, 232, 249, 0.18) 1px, transparent 1px),
          linear-gradient(90deg, rgba(103, 232, 249, 0.18) 1px, transparent 1px),
          linear-gradient(rgba(110, 231, 183, 0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(110, 231, 183, 0.15) 1px, transparent 1px);
        background-size: 48px 48px, 48px 48px, 240px 240px, 240px 240px;
        box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.78);
        will-change: background-position, opacity;
      }

      .paper-perspective {
        left: 0;
        right: 0;
        top: 210px;
        height: 1100px;
        opacity: 0.24;
        transform-origin: 50% 72%;
        transform: perspective(920px) rotateX(58deg) translateY(86px) scale(1.18);
        background:
          repeating-linear-gradient(0deg, rgba(125, 211, 252, 0.15) 0 1px, transparent 1px 86px),
          repeating-linear-gradient(90deg, rgba(125, 211, 252, 0.12) 0 1px, transparent 1px 86px);
        mask-image: linear-gradient(to bottom, transparent 0%, black 18%, black 86%, transparent 100%);
        will-change: background-position, opacity;
      }

      .paper-scan {
        left: 0;
        right: 0;
        top: -22%;
        height: 420px;
        opacity: 0.22;
        background: linear-gradient(
          180deg,
          transparent 0%,
          rgba(125, 211, 252, 0.00) 20%,
          rgba(125, 211, 252, 0.055) 48%,
          rgba(110, 231, 183, 0.028) 54%,
          transparent 100%
        );
        filter: blur(24px);
        mix-blend-mode: screen;
        will-change: transform, opacity;
      }

      .paper-vignette {
        inset: 0;
        background:
          radial-gradient(ellipse at center, transparent 34%, rgba(0, 0, 0, 0.72) 82%, rgba(0, 0, 0, 0.94) 100%),
          linear-gradient(180deg, rgba(0, 0, 0, 0.28), transparent 38%, rgba(0, 0, 0, 0.36));
        opacity: 0.88;
      }

      .paper-content {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        padding: 116px 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 30px;
        text-align: center;
        z-index: 2;
      }

      .paper-label {
        width: fit-content;
        max-width: 840px;
        padding: 9px 15px 10px;
        border: 1px solid rgba(125, 211, 252, 0.30);
        border-radius: 999px;
        background: rgba(6, 18, 28, 0.68);
        color: #8ee8ff;
        font-size: 22px;
        line-height: 1;
        font-weight: 750;
        letter-spacing: 0;
        text-transform: uppercase;
      }

      .paper-content h1 {
        max-width: 1500px;
        color: #ffffff;
        font-size: 104px;
        line-height: 0.98;
        font-weight: 820;
        letter-spacing: 0;
        text-wrap: balance;
        text-shadow: 0 24px 72px rgba(0, 0, 0, 0.55);
      }

      .paper-lines {
        max-width: 1240px;
        display: grid;
        gap: 14px;
      }

      .paper-lines p {
        color: rgba(237, 250, 255, 0.88);
        font-size: 46px;
        line-height: 1.12;
        font-weight: 560;
        letter-spacing: 0;
        text-wrap: balance;
      }

      .accent {
        color: #7dd3fc;
      }
    </style>
  </head>
  <body>
    <main
      id="root"
      data-composition-id="selling-ai-education"
      data-start="0"
      data-duration="${seconds(DURATION)}"
      data-width="1920"
      data-height="1080"
    >
      <div id="video-stage">
        <video
          id="main-video"
          class="clip"
          data-start="0"
          data-duration="${seconds(DURATION)}"
          data-track-index="0"
          src="${SOURCE_MEDIA}"
          muted
          playsinline
        ></video>
      </div>

      <audio
        id="main-audio"
        data-start="0"
        data-duration="${seconds(DURATION)}"
        data-track-index="1"
        data-volume="1"
        src="${SOURCE_MEDIA}"
      ></audio>

${beatMarkup}
    </main>

    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });
      const leftBeats = ${leftAnim};
      const paperBeats = ${paperAnim};

      gsap.set("#video-stage", { scale: 1, x: 0, y: 0, transformOrigin: "0% 0%" });

      for (const beat of leftBeats) {
        const layer = "#" + beat.id;
        const card = layer + " .glass-card";
        const content = layer + " .glass-content > *";
        const shine = layer + " .glass-shine-bar";
        const start = beat.start;
        const duration = beat.duration;

        tl.set(layer, { opacity: 1 }, start);
        tl.fromTo(card, { opacity: 0, x: -92 }, { opacity: 1, x: 0, duration: 0.52, ease: "power3.out" }, start + 0.14);
        tl.fromTo(content, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.42, ease: "power3.out", stagger: 0.06 }, start + 0.28);
        tl.fromTo(shine, { x: 0 }, { x: 1040, duration: Math.min(1.4, Math.max(0.8, duration - 1.2)), ease: "power2.out" }, start + 0.34);
        tl.to("#video-stage", { scale: 1.30, duration: 0.82, ease: "power3.inOut", overwrite: "auto" }, start);
        tl.to(content, { opacity: 0, y: -8, duration: 0.26, ease: "power2.in", stagger: 0.025 }, start + duration - 0.64);
        tl.to(card, { opacity: 0, x: -60, duration: 0.34, ease: "power2.in" }, start + duration - 0.38);
        tl.to(layer, { opacity: 0, duration: 0.01, ease: "none" }, start + duration - 0.02);
        tl.to("#video-stage", { scale: 1, duration: 0.78, ease: "power3.inOut", overwrite: "auto" }, start + duration);
      }

      for (const beat of paperBeats) {
        const layer = "#" + beat.id;
        const start = beat.start;
        const duration = beat.duration;
        const content = layer + " .paper-content > *";

        tl.fromTo(layer, { opacity: 0, scale: 1.012 }, { opacity: 1, scale: 1, duration: 0.42, ease: "power2.out" }, start);
        tl.fromTo(content, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.52, ease: "power3.out", stagger: 0.08 }, start + 0.16);
        tl.fromTo(layer + " .paper-grid", { backgroundPosition: "0px 0px, 0px 0px, 0px 0px, 0px 0px" }, { backgroundPosition: "48px 48px, 48px 48px, 240px 240px, 240px 240px", duration, ease: "none" }, start);
        tl.fromTo(layer + " .paper-perspective", { backgroundPositionY: "0px", opacity: 0.22 }, { backgroundPositionY: "-172px", opacity: 0.32, duration, ease: "none" }, start);
        tl.fromTo(layer + " .paper-scan", { y: -150, skewY: -5, opacity: 0.18 }, { y: 170, skewY: -5, opacity: 0.08, duration: Math.max(3, duration - 0.4), ease: "sine.inOut" }, start + 0.1);
        tl.fromTo(layer + " .paper-fiber-a", { opacity: 0.18, x: -18, y: 10 }, { opacity: 0.12, x: 24, y: -16, duration, ease: "sine.inOut" }, start);
        tl.fromTo(layer + " .paper-fiber-b", { opacity: 0.10, x: 22, y: -12 }, { opacity: 0.16, x: -20, y: 18, duration, ease: "sine.inOut" }, start);
        tl.to(content, { opacity: 0, y: -18, duration: 0.28, ease: "power2.in", stagger: 0.04 }, start + duration - 0.62);
        tl.to(layer, { opacity: 0, scale: 0.998, duration: 0.42, ease: "power2.in" }, start + duration - 0.42);
      }

      window.__timelines["selling-ai-education"] = tl;
    </script>
  </body>
</html>
`;

const design = `# Selling AI Education Visual Design

## Style Prompt

Long-form talking-head edit with serious AI consulting visuals. The base video remains full frame. Major thesis, stat, section, ladder-rung, and step moments use a full-screen dark graph-paper takeover with centered white professional type, faint cyan and green grid lines, subtle paper/noise texture, and restrained motion. Supporting beats use the saved "left glass pop out" style: the video wrapper zooms to 1.30 from the top-left edge, a dark frosted card slides in on the left, concise white text appears, the card exits, then the video zooms back to the original full frame.

## Colors

- Matte black: #030507
- Deep navy: #081118
- White text: #ffffff
- Soft text: #edfaff
- Cyan accent: #7dd3fc
- Green grid accent: #6ee7b7

## Typography

- Primary: Inter, Segoe UI, Arial, sans-serif
- Use bold professional display weight for takeovers and compact medium weight for supporting lines.

## Motion

- Left glass pop out uses scale 1.30, transform origin 0% 0%, card in after 0.14s, and zoom out only after the card clears.
- Paper takeovers fade and settle in quickly, use centered larger type, then keep text readable for most of the beat.
- No overlapping beat text, no decorative blobs, no overly wordy cards.
`;

const hyperframes = {
  $schema: "https://hyperframes.heygen.com/schema/hyperframes.json",
  registry: "https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry",
  paths: {
    blocks: "compositions",
    components: "compositions/components",
    assets: "assets",
  },
};

const meta = {
  id: "selling-ai-education",
  name: "Selling AI Education",
  createdAt: "2026-05-21T00:00:00.000Z",
  width: 1920,
  height: 1080,
  fps: 30,
};

fs.writeFileSync(path.join(ROOT, "index.html"), compactStyleBlocks(html));
fs.writeFileSync(path.join(ROOT, "DESIGN.md"), design);
fs.writeFileSync(path.join(ROOT, "hyperframes.json"), `${JSON.stringify(hyperframes, null, 2)}\n`);
fs.writeFileSync(path.join(ROOT, "meta.json"), `${JSON.stringify(meta, null, 2)}\n`);
fs.writeFileSync(path.join(ROOT, "assets", "analysis", "beat-plan.json"), `${JSON.stringify({ duration: DURATION, maxGapSeconds: 30, gaps, beats }, null, 2)}\n`);

console.log(`Generated ${beats.length} beats`);
console.log(`Coverage gaps over 30s: ${gaps.length}`);
for (const gap of gaps) {
  console.log(`gap ${seconds(gap.start)}-${seconds(gap.end)} (${seconds(gap.gap)}s)`);
}
