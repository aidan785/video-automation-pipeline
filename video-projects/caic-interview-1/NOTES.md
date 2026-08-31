# CAIC — Expert Interview 01: AI Governance for Builders

Russ Henneberry interviewing Katharina Koerner (Sr. Principal Consultant, AI Governance, Trace3).
Recorded 2026-08-21 on Zoom. Edited 2026-08-26.

## v3 — CURRENT DELIVERY (read this first)

**Aidan cut both interviews himself and asked for the intro card only.** So the pipeline below
(transcript -> cut list -> apply-cuts -> verify) is now **history, not the live path**. Nothing
in this project cuts anything any more.

- Base video: `/Volumes/Extreme SSD/Uppit AI/Projects/CAIC/Interviews/Editing /Raw interview 1.mp4`
  — his own manual trim, 54:28.8, 640x360/25. It happens to match a head+tail-only version of the
  original almost exactly (his trims land within 0.2s of the ones derived in v1/v2).
- `_composite.mjs` points at it, upscales to 1280x720 for the card, prepends the 2s black lead
  and lays the title on. **No cuts, no crop, no reframe.**
- Output: `Interview 1 - AI Governance for Builders - EDITED.mp4`, written into that same
  `Editing ` folder (note the trailing space in the folder name) so it sits beside the raw.
- The `_work/` cut artefacts under `Interviews/Interview 1/` are from the superseded v2 pass.

Everything below still describes how the card itself is built, which is unchanged.

## Source

`/Volumes/Extreme SSD/Uppit AI/Projects/CAIC/Interviews/Interview 1/GMT20260821-180307_Recording_640x360.mp4`
55:20 · 640x360 · 25 fps · Zoom active-speaker view with burnt-in name tags bottom-left.

## The edit — "light cuts only"

Aidan asked for a light pass: trim the top and tail, take out obvious dead air, leave the
conversational rhythm alone. 38 cuts total, 55:20 -> 53:20.

| Cut | Why |
| --- | --- |
| 0 -> 0:39.9 | Pre-roll: mic check, "if we gotta start over I've got an editor", "are you ready" |
| 55:08.9 -> end | Post-roll after "Bye-bye" ("that was awesome"). Originally cut at 55:09.4, tightened on Aidan's note that the ending read as a frozen frame — per-frame diffing showed no actual freeze, just ~2s of Russ holding a smile after the goodbyes. It now ends on the wave. |
| 35:01.0 -> 35:19.2 (source) | Russ's AirPods die mid-answer; 18s of "sorry Katarina, what were you saying". Rejoins on "And also, in general, we often see that AI governance..." |
| 35 x pauses >= 1.5s | Trimmed to 0.55s, with 0.275s margin either side of the neighbouring words so no onset gets clipped |

Threshold was deliberately conservative — at 1.0s it would have recovered 2min but started
eating the natural beats of a conversation.

### Verification

The rendered cut was re-transcribed with ElevenLabs Scribe and diffed against the expected
re-timed transcript: 9216 expected words vs 9219 rendered. Every discrepancy was Scribe
re-tokenisation ("hands down" vs "hands-down", "mm"/"mm-hmm", filler "uh") — no content lost.

## The graphics — v2: title card only

v1 shipped a title card, two lower thirds and nine term popups. Aidan cut all of it back to
**just the title card**, and later dropped "Trace3" from the credit line ("I don't know what that is"): the popups were more than he wanted, and Zoom already burns both
speakers' names into the recording, so branded lower thirds were redundant.

`_plan.json` is now a single graphic. `_gen.mjs` still carries the tier-2 position overrides
and `_composite.mjs` still loops the plan, so adding beats back is a matter of re-listing them.

### The title card

Built on `kallaway.t1.section.chaptercard` — its bloom, dot grid, vignette and grain are kept;
its `.stage` is replaced wholesale with one centred stack:

    CAIC / CERTIFIED AI CONSULTANT   (wordmark, hexagon cropped off)
    [ EXPERT INTERVIEW 01 ]          (flat pill, no glow)
    AI Governance for Builders
    Katharina Koerner · Sr. Principal Consultant, AI Governance

- `assets/caic-wordmark.png` is `caic-logo.png` cropped to x 350-810 — the AIS hexagon lives at
  x 165-304 and Aidan wanted it gone. **Cropping alone leaves the mark visibly off-centre:** in
  the source lockup "CAIC" and "CERTIFIED AI CONSULTANT" are both left-aligned against the
  hexagon, so the wordmark's centre sits 70px left of the tagline's (37px on a 1280-wide frame,
  which is what Aidan spotted). The asset is rebuilt with the CAIC line shifted +70px so both
  lines share centre x=229.
- The pill is flattened: `box-shadow: none`, `::before`/`::after` set to `content: none`, and
  the card's own glow-pulse tween is stripped by the generator. Aidan asked for "just a little
  button", no side glows.
- **The v1 centering bug:** `.stage` is `left:50% top:50% transform: translate(-50%,-50%)`.
  v1 overrode it with `transform: translateY(90px)`, which dropped the translate and pushed the
  pill + headline right and down while the separately-positioned logo stayed centred. Any
  override touching `.stage`'s transform must repeat the translate — or, as now, not set it.
- Centring is verified by measuring, not by eye: extract a frame, threshold it, group the
  content rows into bands and print each band's centre. Every band should land within ~2px of
  `width/2`. Both centring bugs were invisible in a glance at a thumbnail.

### Timing

`titleLead` is 2.0s of black before the interview; the card runs 6.5s (solid to 5.0, then a
1.5s dissolve). So Russ starts speaking at 2.5s with the card still fully up and the reveal
lands mid-sentence, which is what Aidan asked for.

### The card is NOT opaque in the MOV

HyperFrames' `--format mov` path captures on a transparent page, and the card's opaque
`background: var(--canvas)` does not survive it — sampled alpha in `title.mov` is ~12/255, so
the interview ghosts straight through the title. This never showed in v1 only because the
black `tpad` happened to sit under the card for its whole hold.

The fix lives in `_composite.mjs`: for `kind: "title"` the card is overlaid onto its own
opaque black plate, and *that plate* is alpha-faded out. `_gen.mjs` correspondingly gives the
title no internal fade (`fade = 0`) so the two don't double up.

## Build

```bash
node _gen.mjs                    # _plan.json -> g/<id>/index.html  (one mini-project per graphic)
node _composite.mjs --preview 0 22   # eyeball a window
node _composite.mjs              # full render -> _work/final-1280x720.mp4
```

`_gen.mjs` copies each library card, inlines `tokens.css`, vendors GSAP, fills the slots,
re-anchors the card with a CSS override block (which must land **after** the card's own
`<style>`, since tokens.css is inlined before it), and re-times the tail with a fade-out.
Each graphic becomes its own project dir because the CLI lints/renders a DIR containing
`index.html` and serves that dir as the web root — assets have to live inside it.

Graphics render to ProRes 4444 alpha MOVs (`--format mov`; note `--format webm` gives
yuv420p, **no alpha**), then `_composite.mjs` upscales the 640x360 source to 1280x720 with
lanczos and overlays them in one ffmpeg pass.

The whole 53-minute video was deliberately **not** rendered through HyperFrames — that would
push the source through Chrome for no gain. The overlay-plus-ffmpeg route composites at ~19x
realtime.

## Output

`_work/final-1280x720.mp4` — 53:21, 1280x720, 25 fps, CRF 20, ~530 MB.
Delivered next to the source as `Interview 1 - AI Governance for Builders - EDITED.mp4`.

The upscale is for the graphics: 1920x1080-authored cards stay crisp at 720p. The video
itself is as soft as the 360p source — the upscale doesn't make it worse.
