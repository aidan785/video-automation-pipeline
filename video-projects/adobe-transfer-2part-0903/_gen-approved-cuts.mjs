// Locate editorial cut phrases in the silenced transcript and emit approved-cuts.json.
// Spec forms:
//   { cut: "words to remove", before: "words that must follow", reason }
//   { from: "first words of span", to: "last words of span", before: "...", reason }   (long spans)
//   add fromStart: true to extend the cut back to t=0 (drop the video head)
// Boundaries: start = prev kept word end + 0.02 (onset-sliver rule), end = next kept word start - 0.06.
import fs from 'node:fs';

const tPath = process.argv[2] ?? 'assets/source.silence-transcript.json';
const outPath = process.argv[3] ?? 'assets/approved-cuts.json';
const t = JSON.parse(fs.readFileSync(tPath, 'utf8'));
const words = t.words.filter(w => w.type !== 'spacing' && /\S/.test(w.text));
const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]+/g, '').replace(/\s+/g, ' ').trim();
const toks = words.map(w => norm(w.text)).map(x => x === '' ? null : x);

const SPECS = [
  // ---- intro (1.mov) ----
  { fromStart: true, from: "What if I told you-- Oh, shit.", to: "I connected, I connected Fable--", before: "I connected Claude Fable 5.1 to Unreal Engine and created", reason: "retake x4: abandoned 'What if I told you' hook attempts + 'Oh, shit' / 'Oh, my God'; keep final 'I connected Claude Fable 5.1...' open" },
  { cut: "My computer is l--", before: "My computer is about to explode", reason: "false start" },
  { cut: "I did not, I did not,", before: "I did not place a single texture", reason: "stutter x2" },
  { cut: "Built it all for me.", before: "I've been testing out...", reason: "retake fragment: repeated tail after 'Claude Fable 5.1 built it all for me.' (judgment call)" },
  { cut: "I've been testing out...", before: "I've been testing out a bunch of workflows with 3D pl--", reason: "false start" },
  { cut: "I've been testing out a bunch of workflows with 3D pl--", before: "I've been testing a bunch of workflows with 3D softwares", reason: "retake: restarted line" },
  { cut: "I built a full workflow that help--", before: "I built a full workflow utilizing the Unreal MCP", reason: "retake: restarted line" },
  { cut: "connected it c- connected to Cla-", before: "connected it to Claude, and was able", reason: "stutter x2" },
  { cut: "in literally,", before: "in a very short period of time", reason: "self-correction" },
  { cut: "I also built this cathedral.", before: "I also built this cathedral scene inside of Unreal Engine", reason: "retake: first cathedral line (stretched over the 50s scene load), keep full second take" },
  { cut: "with Claude Fable p-", before: "with Claude Fable 5.1 and connect it to Unreal Engine", reason: "stutter" },
  { cut: "and it's a--", before: "and it's something that I'm a lot more unfamiliar with", reason: "false start" },
  { cut: "was another 3D platform,", before: "was another platform where you could connect Claude", reason: "self-correction, keep second phrasing" },
  { cut: "And then again, just-- And then going over just... And the reason why Fable--", before: "And the reason why I want to test Fable 5.1", reason: "abandoned sentence x2 + false start" },
  { cut: "and,", before: "and Fable 5.1 is cheaper", reason: "stutter: doubled 'and' (c002)" },
  { cut: "like the high--", before: "Fable 5.1 on high effort is cheaper", reason: "false start" },
  { cut: "And then another thing that I always har--", before: "And then another thing that I always talk about", reason: "retake: restarted line" },
  { cut: "atmosphere,", before: "atmosphere, procedural generations", reason: "stutter: doubled 'atmosphere' (c003)" },
  { cut: "And then again, and then again, and then again, kind of like that bar.", before: "And then again, kind of like that line graph", reason: "retake: stuttered line, keep clean second take" },
  { cut: "And because-- And so while it's writing--", before: "And so while Fable 5.1 is writing these scripts", reason: "false start x2" },
  { cut: "the coding is-- the coding in,", before: "the coding in theory is better", reason: "stutter x2" },
  // ---- tutorial setup ----
  { cut: "I'm gonna give you a free skill.", before: "I'm gonna give you a free skill that you can install", reason: "retake: restarted line" },
  { cut: "to help you set it, to help you set this up is as efficient--", before: "to help you set this up as efficiently as possible", reason: "stutter x2" },
  { cut: "But firstly, we need to have a Claude-- But firstly, you need to have a Claude Code subscription. You need--", before: "But firstly, you need to have a Claude subscription.", reason: "retake x2: corrected to 'Claude subscription'" },
  { cut: "To run Claude Code, you do need access to...", before: "You do need to pay for the subscription", reason: "abandoned sentence" },
  { cut: "Oh my God.", before: "The next thing you're going to need is obviously Unreal Engine", reason: "meta: reaction after the 69s Claude-app fumble" },
  { cut: "is I t-", before: "is I've taken all of this context", reason: "stutter" },
  { cut: "where your Claude session,", before: "where your Claude session could take over", reason: "stutter: doubled phrase" },
  { cut: "And it,", before: "and if you're running this on Mac", reason: "false start" },
  { cut: "It's just how it processes the C, the C+, the-- It's just", before: "So instead of in--", reason: "abandoned sentence (Xcode/C++ aside)" },
  { cut: "So instead of in--", before: "so instead of scouring the internet", reason: "false start" },
  { cut: "uh,", before: "my free school community, where if you go into the Classroom tab", reason: "filler" },
  { cut: "And then you have the skill, this obviously is optional, downloaded.", before: "We need to upload everything into a Unreal Engine project folder", reason: "retake: repeats 'skill downloaded if you want' (keep first, cleaner)" },
  // ---- THE CLAUDE DESKTOP DETOUR (Aidan's explicit ask) ----
  { from: "So when you're in Claude Code, you will see we can open up a new folder.", to: "And so now I'm gonna open up VS Code which... Also, also inside of this,", before: "also inside of this tutorial, I am going to be using VS Code", reason: "DETOUR: whole Claude Desktop App attempt (open folder -> bypass permissions -> /MCP fails -> 3.5min gap -> 'open up a Claude session' -> 'open up VS Code which...'); jump straight to the VS Code section" },
  // ---- VS Code section ----
  { cut: "So this is what VS Code looks like.", before: "So this is what VS Code looks like, and all I need to do", reason: "retake: restarted line" },
  { cut: "and I right--", before: "And right here, I have this Unreal Engine MCP", reason: "false start" },
  { cut: "Now that I'm inside of my Unreal Engine MCP, I can...", before: "This MCP sandbox is the actual MCP server", reason: "abandoned sentence before 13s fumble" },
  { cut: "my overall--", before: "my parent Unreal Engine folder", reason: "self-correction" },
  { cut: "What is going on? So, so I've opened the Unreal Engine...", before: "So I've opened the Unreal Engine folder that I, I have", reason: "meta ('What is going on?' over 39s fumble) + false start (incl c005)" },
  { cut: "I'm gonna--", before: "If you're watching this video, I'm assuming", reason: "false start" },
  { cut: "I'm going to take this folder that--", before: "I'm going to take this skill folder that you have just downloaded", reason: "retake: restarted line" },
  { cut: "And now we have--", before: "And now in that zip file, we have the references", reason: "false start" },
  { cut: "So exact-", before: "so exactly that", reason: "stutter" },
  { cut: "Can you set up the MCP... Can you set up the...", before: "Can you set up the Unreal Engine MCP connection via", reason: "retake x2: prompt narration restarts, keep full third" },
  { cut: "Okay.", before: "Okay. So once you've got that set up", reason: "stutter: doubled 'Okay' (c007)" },
  { cut: "But if you notice--", before: "But if you notice, if we want to run MCP", reason: "retake: restarted line" },
  { cut: "So we s--", before: "It says nineteen MCP servers", reason: "false start" },
  { cut: "to,", before: "to Unreal Engine, we need to open up our terminal", reason: "stutter: doubled 'to' (c008)" },
  { cut: "the R-", before: "the Unreal MCP connected", reason: "stutter" },
  { cut: "Now we can go back in and just verify. You could also do--", before: "And now we can go back in and just verify", reason: "retake: restarted line + false start" },
  { cut: "It will verify with you and it will--", before: "it will verify it for you", reason: "false start" },
  { cut: "But now,", before: "but now I wanna teach you", reason: "stutter: doubled 'but now'" },
  // ---- YouTube training section ----
  { cut: "Go from a newbie to a seasoned pro in minutes with GoDaddy Airo AI builder. Just as- What's up, guys? Welcome to-", before: "So I can go into this video, and I will copy this link", reason: "YouTube pre-roll ad audio + the tutorial's own intro audio + Aidan's 'Just as-' false start" },
  { cut: "You need to make sure,", before: "you need to make sure that the video has a lot of content", reason: "stutter: doubled phrase" },
  { cut: "and there is a... And then there's,", before: "and then there's some walkthroughs", reason: "abandoned tail + stutter" },
  { cut: "and get a gr-- get a, and get an un--", before: "and gain an understanding of how to utilize", reason: "stutter x3" },
  { cut: "I then want you to execute this,", before: "I then want you to execute this scene inside of", reason: "stutter: doubled phrase" },
  { cut: "and it can... You'll come back, and you'll have an empty scene.", before: "You'll come back, and you'll have a full scene", reason: "abandoned tail + misspoke 'empty scene' (corrected to 'full scene')" },
  { cut: "Now, I'm not gonna sit through this whole process because I'm gonna go over some of the costs of the two. Now I'm not gonna s--", before: "Now I'm not gonna sit through this full process because I've already done two generations", reason: "retake x2: restarted line, keep full second take" },
  { cut: "Took me almost an hour and thirty minutes to build.", before: "It took Claude almost an hour and thirty minutes to build", reason: "misspoke ('me' -> 'Claude'), keep corrected take" },
  { cut: "And it spent about, and it spent about,", before: "and it spent about twenty-five dollars", reason: "stutter x2" },
  { cut: "which is i-", before: "which translated to tokens is about", reason: "false start" },
  { cut: "So not insane, but-- So not insane, and, and I'll...", before: "So not insane, and I'm gonna give my final thoughts", reason: "retake x2: restarted line" },
  { cut: "But if you were curious about the outputs,", before: "but if you were curious about the output price", reason: "retake: restarted line" },
  { cut: "that is, that is kind of what,", before: "that is kind of what you will be dealing with", reason: "stutter x2" },
  { cut: "and it--", before: "I tried to go for as much realism as possible", reason: "false start" },
  // ---- review / outro ----
  { cut: "um,", before: "of like it got the idea", reason: "filler" },
  { cut: "And that--", before: "And I just don't think that Fable 5 is capable enough", reason: "false start" },
  { cut: "But,", before: "but for now, I think it's still in that intermediate phase", reason: "stutter: doubled 'but'" },
  { cut: "a- that go--", before: "and different lighting that goes into this scene", reason: "false start" },
  { cut: "It's definitely...", before: "It's not awesome, and it's not perfect", reason: "false start" },
  { cut: "So, so if you're curio-", before: "So that is how you generate scenes inside of Unreal Engine", reason: "false start x2" },
  { cut: "Again, the free school-- the free...", before: "Again, the free skill is in my free school community", reason: "retake: restarted line" },
];

function matchAt(i, seqToks) {
  // try to match seqToks starting at toks[i]; returns end index (exclusive) or -1
  let k = i;
  for (const st of seqToks) {
    if (toks[k] === st) { k++; continue; }
    let joined = toks[k] ?? '';
    let kk = k + 1;
    while (joined.length < st.length && kk < toks.length) { joined += toks[kk] ?? ''; kk++; }
    if (joined === st) { k = kk; continue; }
    return -1;
  }
  return k;
}
function findSeq(seqToks, startAt = 0) {
  const hits = [];
  for (let i = startAt; i <= toks.length - seqToks.length; i++) {
    const e = matchAt(i, seqToks);
    if (e > 0) hits.push({ start: i, end: e });
  }
  return hits;
}
function beforeOk(endIdx, befToks) {
  for (let off = 0; off <= 1; off++) {
    if (matchAt(endIdx + off, befToks) > 0) return true;
  }
  return false;
}

const cuts = [];
let fail = 0;
for (const spec of SPECS) {
  const befToks = norm(spec.before).split(' ').filter(Boolean).slice(0, 6);
  let cands;
  if (spec.from) {
    const fromToks = norm(spec.from).split(' ').filter(Boolean);
    const toToks = norm(spec.to).split(' ').filter(Boolean);
    const starts = findSeq(fromToks);
    cands = [];
    for (const s of starts) {
      const ends = findSeq(toToks, s.end).filter(e => beforeOk(e.end, befToks));
      if (ends.length) cands.push({ start: s.start, end: ends[0].end });
    }
  } else {
    const cutToks = norm(spec.cut).split(' ').filter(Boolean);
    cands = findSeq(cutToks).filter(h => beforeOk(h.end, befToks));
  }
  if (cands.length !== 1) {
    console.error(`FAIL (${cands.length} matches): ${spec.cut ?? spec.from + ' ... ' + spec.to} | before="${spec.before}"`);
    fail++;
    continue;
  }
  const h = cands[0];
  const first = words[h.start], last = words[h.end - 1];
  const prev = words[h.start - 1], next = words[h.end];
  let start = prev ? Math.min(prev.end + 0.02, first.start) : Math.max(0, first.start - 0.02);
  if (first.start - start > 0.35) start = first.start - 0.35; // big gap before = kept pause / protected clip: don't eat it
  if (spec.fromStart) start = 0;
  let end = next ? Math.max(last.end + 0.01, next.start - 0.06) : last.end + 0.05;
  if (end - last.end > 0.5) end = last.end + 0.5; // same guard on the far side
  if (spec.fromStart && next) end = Math.max(last.end + 0.01, next.start - 0.15); // leave a little pre-roll at the new head
  const label = spec.cut ?? `${spec.from} ... ${spec.to}`;
  cuts.push({
    start: +start.toFixed(3), end: +end.toFixed(3), reason: spec.reason,
    removes: label, keepsNext: spec.before,
    _ctx: words.slice(Math.max(0, h.start - 6), Math.min(words.length, h.end + 6)).map(w => w.text).join(' '),
  });
  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, '0')}`;
  console.log(`OK ${fmt(start)}-${fmt(end)} (${(end - start).toFixed(2)}s) [${(first.start - start).toFixed(2)}/${(end - last.end).toFixed(2)}] ${label.slice(0, 70)}`);
}
if (fail) { console.error(`${fail} specs failed to locate — nothing written`); process.exit(1); }
cuts.sort((a, b) => a.start - b.start);
for (let i = 1; i < cuts.length; i++) if (cuts[i].start < cuts[i - 1].end) console.error(`OVERLAP: ${cuts[i - 1].removes.slice(0, 40)} / ${cuts[i].removes.slice(0, 40)}`);
fs.writeFileSync(outPath, JSON.stringify({ cuts }, null, 2));
console.log(`\n${cuts.length} cuts -> ${outPath} (total ${cuts.reduce((t, c) => t + c.end - c.start, 0).toFixed(1)}s)`);
