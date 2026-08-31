# Editing OS tutorial

YouTube cut of the Editing OS walkthrough. No silence cutting, no mistake cutting, no
verify passes. The edit runs the full uncut 17:50 (1070.37s).

## SHIPPED BUILD — plain, no motion graphics

`index.html` is built from **`plain-plan.json`** (zero beats, PIP at 380px). Composition is
3 elements: bg video, audio, PIP. Lints 0/0.

**Delivered:** `~/Projects/Adobe Transfer Folder/editing OS final.mp4`, rendered at
`--quality standard` (CRF 18, visually lossless 1080p).

Two motion-graphic passes were built and then dropped, both preserved on disk:

1. **`beat-plan.json` / `beat-plan.cards.json`** — 43 beats using library cards positioned
   around the frame (upper-right panels, lower-left pills, 5 full-screen takeovers).
   Rejected: the graphics covered screen-recording content Aidan needed visible.
2. **`band-plan.json` + `_gen.mjs`** — the same 43 beats re-cut as a **bottom band** locked
   to `left 80 · bottom 44 · width 1360`, which clears the PIP by 56px and never touches the
   working area of the screen. Nine custom band treatments with their own entrance
   choreography (section bar wipe, masked word rise, count-up + rule fill, stepped columns,
   chip pop-and-flip, typed command bar, den pill, blurred char slam, sheared kinetic
   lines). Built, frame-verified, then dropped when Aidan called for the plain cut.

`node _gen.mjs` regenerates the band version into `index.html` if it is ever wanted. Two
known polish items were mid-fix when it was dropped: section and prompt boxes stretch the
full 1360 rather than hugging their content (the `inline-flex` / `inline-block` + ghost
sizer fix is already in `_gen.mjs`), and bare-text treatments (kinetic, slam, thesis) still
need a soft scrim behind them to stay legible over light or busy screens.

## Sources

Both recordings are 1920×1080 @ 30fps and exactly 1070.366667s long, so they line up
frame-for-frame with no offset.

| Source | Role |
| --- | --- |
| `Adobe Transfer Folder/Screen Recording.mp4` | background, full frame → `assets/screen.mp4` (copied as-is) |
| `Adobe Transfer Folder/Talking head.mp4` | speaker PIP → `assets/talkinghead-square.mp4` |
| (talking head audio) | the only audio → `assets/narration.m4a` |

**Audio:** the screen recording is silent end-to-end (-91 dB at every probe, including the
stretch where he says he is unmuting his computer — that demo audio comes back through his
mic). So the talking-head track carries everything and is the sole audio source.

**PIP crop:** `crop=900:900:550:0` then scaled to 720×720. Verified against a 12-point
contact sheet across the full runtime — the head never clips at the top and stays centred.
Mounted at 440×440, 44px margins, 36px radius, bottom-right, `z-index: 30` so the speaker
stays visible **through** the tier-1 takeovers.

## Style

`09-higgsfield` (lime `#D6FD03` on navy). 43 beats.

Section chrome is deliberately **consistent**, not rotated: every section marker is
`t2.label.glass-step` (upper-right frosted panel, kicker / title / sub) and every phase
chip is `t2.lower-third.pill` (bottom-left). Recurring chrome reads as a design system in a
long tutorial; the *supporting* beats rotate across ~12 distinct treatments.

**Takeovers are rationed to 5** across 17:50, and none of them exists just to announce a
section — each carries real content:

| Time | Card | Content |
| --- | --- | --- |
| 59.4 | thesis | AN **OPERATING SYSTEM** FOR YOUR VIDEOS |
| 186.5 | overview | THE PIPELINE — cut / verify / motion |
| 808.0 | stat | **1,136** Higgsfield cards |
| 888.2 | stat | **3:35**, down from 7:15 |
| 988.2 | thesis | A FULL EDIT TEAM, **INSIDE YOUR TERMINAL** |

Nine section markers (`SECTION 01`–`09`), five phase chips, seven "prompt cards"
(`t2.media.paper`, one per prompt he types), plus lists, kinetic floats and slams.

## Verification

- Transcript: local whisper.cpp (`large-v3-turbo` + Silero VAD) — ElevenLabs Scribe is out
  of quota. Word timings in `assets/transcript-words.json`.
- **Sync:** all 43 beats land within the −0.2s / +1.8s window against their verbatim anchor
  phrase. 0 failures.
- **Frames:** all 43 beats screenshot at their hero moment via `_shots.mjs` and reviewed.
- `compositions` resolves 1070.4s · 1920×1080 · 46 elements.

The `gsap_timeline_not_registered` lint error is a **false positive** — it fires on the 43
child card timelines that register on the private `window.__beatTimelines`. The master
timeline is correctly on `window.__timelines["editing-os-tutorial"]`.

## Bug found and fixed in the shared assembler

`build-beats.mjs` emitted each card's timeline into its own bare `<script>`. Classic
scripts share one global scope, and every Higgsfield card declares `const root` at top
level — so **42 of 43 beats died** on `Identifier 'root' has already been declared` and
their animations never ran. The DOM still rendered, so it looked like a styling problem
(text stuck in its grey pre-flip state, no lime emphasis anywhere) rather than 42 dead
scripts. Fixed by wrapping each card script in an IIFE. This affected every multi-beat
build, not just this project.

Also added to `build-beats.mjs`: an optional `plan.stage` block for screen-recording +
speaker-PIP layouts (bg video, PIP square, separate audio), and a track-index default that
steps clear of the PIP's track.

## Per-beat fixes from the frame review

- beat 4 `list.v001` → `list.v020` — the bare-text list layout overlapped its number
  markers with long item text.
- beat 13 `label.tags` → `list.v050` — the tags card pins its third tag to the right edge,
  which put it under the PIP.
- beat 29 "STUMBLE. PAUSE. REPEAT." → "STUMBLES + SILENCES" — original ran under the PIP.
- beat 42 `lower-third.v005` → `lower-third.v007` — the translucent glass pill vanished
  against the light style-library contact sheet; v007 is the dark den tone.

## Rebuilding

```bash
# the current PLAIN build (no graphics) — after editing plain-plan.json
node .claude/skills/motion-graphics/scripts/build-beats.mjs \
  video-projects/editing-os-tutorial/plain-plan.json \
  --out video-projects/editing-os-tutorial/index.html
```

```bash
# to put the 43 motion-graphic beats BACK, from the workspace root
node .claude/skills/motion-graphics/scripts/select-cards.mjs \
  video-projects/editing-os-tutorial/beat-plan.json \
  --registry style-library/registry.json \
  --out video-projects/editing-os-tutorial/beat-plan.cards.json
node .claude/skills/motion-graphics/scripts/build-beats.mjs \
  video-projects/editing-os-tutorial/beat-plan.cards.json \
  --out video-projects/editing-os-tutorial/index.html
```

Track indices are assigned by a greedy non-overlap pass after `select-cards`; no two beats
currently overlap, so everything sits on track 3.

Frame check (needs `npx serve . -p 8099 -n` running in this folder):

```bash
node _shots.mjs --url http://localhost:8099/ --offset 3.0 [--only 4,13]
```

## Status

Gate 1 pending — Studio preview on **http://localhost:3021**. Not rendered.
