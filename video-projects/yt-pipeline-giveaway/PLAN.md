# YouTube Giveaway Video: "I Hired Five 8-Bit Employees To Edit This Video"

Plan of record. Angle locked, format locked, giveaway scope locked.

- **Angle:** Meet my five employees. The 8-bit studio is the spine, the agents are a cast.
- **Format:** 12 to 18 min flagship, single video.
- **Giveaway:** clean public starter repo. No client work, no secrets, no 27GB.

---

## 1. Why this angle wins

Every other video in this space is a screen recording of a chat window. Ours has
characters with names, desks, and a chair each. That is the whole edge.

The five already exist in `editing-os/public/studio.js`:

| Agent | Role | Skill | Accent |
| --- | --- | --- | --- |
| Snip | Silence Editor | `cut-silences` | green |
| Redo | Mistake Editor | `cut-mistakes` | amber |
| Vera | Verifier | `verify-cuts` | purple |
| Mo | Motion Designer | `motion-graphics` | blue |
| Scout | B-roll Scout | `insert-broll` | orange |

**The mechanic that makes it more than a gimmick:** the dashboard is not a mockup.
It reads real file mtimes off disk. So when we run the pipeline on the raw take of
THIS video, the agents genuinely light up, sit down, and start typing, with a floating
tag showing the project slug. We screen-record that live. The office footage in the
finished video is a status readout of the video you are watching being made.

That is the closing reveal, and it is true, which is why it will land.

---

## 2. Beat sheet (15:00 target)

| Time | Beat | On screen |
| --- | --- | --- |
| 0:00-0:45 | **Cold open.** "These are my five employees. They edited this video. None of them are real." | Full-screen office, agents strolling. Snip walks to desk and sits mid-line. Tag pops. |
| 0:45-1:30 | **Promise + who it's for.** Free, link in description, runs local, no subscription. | Repo page, star count, quick file-tree flythrough |
| 1:30-3:00 | **The input.** Play the genuinely ugly raw take. Stumbles, dead air, three attempts at one sentence. Do not clean this up. | Raw footage, timer running, waveform showing the gaps |
| 3:00-4:30 | **Snip / cut-silences.** Transcript-driven, word-level timestamps, not volume gating. | Snip's desk. Transcript scrolling, silence EDL, before/after A-B |
| 4:30-6:00 | **Redo / cut-mistakes.** The retake read is the sell: it reads the whole transcript editorially and picks your best take of a re-recorded line. Detector alone catches ~3 of 60. | Redo's desk. Review gate UI, side-by-side takes, you approving |
| 6:00-7:15 | **Vera / verify-cuts.** The trust beat. Re-transcribes the render and makes three full passes to prove every cut landed. This is the thing no competitor has. | Vera's desk. PASS/FAIL output, a deliberate FAIL routed back |
| 7:15-9:00 | **Mo / motion-graphics.** Nine style libraries, tier-1 takeovers vs tier-2 lower thirds, beat plan from transcript. | Mo's desk. Style browser, cards animating, beats snapping to words |
| 9:00-10:15 | **Scout / insert-broll.** Asset library plus free providers, cutaways vs overlays. | Scout's desk. Asset grid, comp'd result |
| 10:15-11:15 | **The reveal.** Pull back to the full office. "Everything you just watched went through all five of them." Raw 38:56 to finished. | Dashboard, real timestamps matching today, A-B of this video's own footage |
| 11:15-14:00 | **Setup.** Clone, `npm install`, one API key, `npx hyperframes doctor`, first run on their own footage. Real time, no cuts on the install. | Terminal, empty folder to working pipeline |
| 14:00-15:00 | **CTA.** What to build with it, star the repo, what's coming next. | Office, lights, end card |

**Chapter transitions:** the agent for the next chapter walks across the office and sits
down. That is your wipe. No hard cuts between chapters. (`MOTION_PHILOSOPHY.md` rule:
motion lives in the transitions.)

---

## 3. Build list before filming

Ordered. Nothing here is optional if the reveal is going to be honest.

### A. Ship the dashboard to main
`editing-os/` currently exists only on the `editing-os` branch (12 tracked files) and is
untracked on `add-testimonial-reels`. Merge it forward. It is the hero visual, it cannot
live on a side branch.

### B. Build the clean starter repo
New public repo. Include:

- `.claude/skills/` all 11 (5 pipeline agents, 4 hyperframes, gsap, hyperframes-to-ae)
- `editing-os/` the dashboard, including `_verify/` screenshots as proof it renders
- `style-library/` all 9 styles plus `registry.json` and `GUIDE.md`
- `asset-library/` structure and registry, no cached client assets
- `scripts/` transcribe, validate-beat-sync, preflight, build-edl-review
- `CLAUDE.md`, `MOTION_PHILOSOPHY.md`, `.env.example`, `package.json`
- **One** demo project: `video-projects/demo/` with a short clip you own outright

Exclude: all 7 tracked AIS Live projects, `reference/selling-ai-education`, `raw-media/`,
`_shot-*.mjs` and `_shots-*/` debris at the repo root, `hyperframes-video-kit.zip`, `.env`.

Rewrite `CLAUDE.md` for a stranger. It currently reads as your internal notes (references
Nate, your SSD paths, Drive folders). A viewer's first impression of the repo is that file.

Add a `README.md` that opens with the office screenshot and a 4-line quickstart.

### C. Make the demo project the only fresh thing on disk
The dashboard attributes each agent the newest evidence mtime **across all projects**. So
during filming week, do not touch other projects, or Snip's tag will read `caic-vsl` on
camera. Park the other work.

### D. Rehearse the capture with `?force=`
The studio has a dev override built in:

```
http://localhost:4200/#/studio?force=silences:working,motion:working
http://localhost:4200/#/studio?fixture=1            # standalone, no server
http://localhost:4200/#/studio?fixture=1&lights=off # after-hours mood
```

Use `?force=` to block and rehearse every office shot before you need the real thing.
Use the real run only for the reveal.

### E. Solve the timing trap
Status tiers are working (15 min), winding-down (2 h), idle. The "working" window is
**15 minutes**. You cannot run the pipeline and then film the dashboard. You have to
screen-record the dashboard concurrently with the pipeline run, in a second window, or
the agents will already have gone back to strolling.

Plan: two screen recordings running at once, or a second machine/display pointed at
`localhost:4200`.

---

## 4. Production order

1. Merge `editing-os` to main
2. Build and push the clean starter repo (private first, flip public on upload day)
3. Write the script against the beat sheet above
4. **Record the raw take badly on purpose.** Do not do a clean read. The stumbles are
   the raw material Redo needs, and the before/after has no punch without them
5. Run the real pipeline on that take, screen-recording the dashboard the whole time
6. Capture the rest: terminal, repo, style browser, `?force=` office shots
7. Edit with the pipeline itself. Cut silences, cut mistakes, verify, then Mo for the
   chapter cards and Scout for the tool logos
8. Thumbnail and title
9. Publish, flip repo public, pin a comment with the link

---

## 5. Title and thumbnail direction

Titles, best first:

- I Gave 5 AI Agents A Job Editing My Videos (And They're Free)
- These 5 AI Agents Edit My YouTube Videos While I Sleep
- I Built An AI Editing Team. You Can Have It.

Thumbnail: the 8-bit office, cropped tight on the desk row so the five characters read at
phone size, your face bottom-left reacting. The pixel art is the differentiator, put it in
the thumbnail. No competing video has an image like this.

---

## 6. Risks

| Risk | Fix |
| --- | --- |
| 15-minute working window closes mid-shot | Concurrent recording, rehearse with `?force=` first |
| Wrong project slug on the floating tag | Freeze all other project work during filming week |
| Repo too heavy to clone | Starter repo only, demo footage under ~100MB or hosted separately |
| Viewer can't run it (needs Node, FFmpeg, Chrome, an ElevenLabs key) | `npx hyperframes doctor` on camera during setup, and a prerequisites block at the top of the README |
| Scout has never completed a real b-roll pass on any project | Either run one on the demo project before filming, or frame that chapter as "the newest one" honestly |
| Client work leaking into the giveaway | Explicit include-list when building the repo, not an exclude-list |

---

## 7. Open items

- Which footage becomes the demo project (needs to be yours, no client, short)
- Whether Scout gets a full chapter or a shorter "and here's what's next" treatment
- Repo name and whether it goes under your personal GitHub or a channel org
