# CAIC — Expert Interview 02: How AI Rules Get Enforced

Russ Henneberry interviewing Aaron Alva (Alva Strategy Center; a decade at the FTC as lead
technology advisor and the first technologist to serve as counsel to the Director of Consumer
Protection; fellow at Harvard's Berkman Klein Center). Recorded and edited 2026-08-26.

Second in the governance series. Russ frames the three interviews himself at the end of the
call: Katharina is the advisor's view, Aaron is the **enforcement** view, and a third guest is
the in-house view. That's where the title came from.

## v2 — CURRENT DELIVERY (read this first)

**Aidan cut both interviews himself and asked for the intro card only.** So the pipeline below
(transcript -> cut list -> apply-cuts -> verify) is now **history, not the live path**. Nothing
in this project cuts anything any more.

He also supplied a **completely different and much better master** for this one:

- Base video: `/Volumes/Extreme SSD/Uppit AI/Projects/CAIC/Interviews/Editing /Raw Interview 2.mp4`
  — 44:55.2, **1920x1080 @ 23.976**, 5.0 GB. Zoom gallery view with rounded tiles, big faces,
  **no letterbox bars and no burnt-in wall clock**. This is not the `gvo` cloud recording the
  first pass used, so the crop/pad clock-removal trick is gone from `_composite.mjs` and there
  is no upscale — the 1920x1080 authored card lands 1:1.
- Frame rate is preserved exactly (`-r 24000/1001`); the card MOV renders at 24 and the ~0.1%
  difference over its 6.5s is under one frame.
- Output: `Interview 2 - How AI Rules Get Enforced - EDITED.mp4`, written into that same
  `Editing ` folder (note the trailing space in the folder name) so it sits beside the raw.
- The `_work/` cut artefacts under `Interviews/Interview 2/` are from the superseded v1 pass,
  and they describe the *old* 1280x720 Zoom-cloud source, not this master.

Everything below still describes how the card itself is built, which is unchanged.

## Source

`/Volumes/Extreme SSD/Uppit AI/Projects/CAIC/Interviews/Interview 2/GMT20260826-182721_Recording_gvo_1280x720.mp4`
54:11 · 1280x720 · 25 fps.

**This one is Zoom GALLERY view, not active-speaker** — a different shape from Interview 01:

- Two 640x360 tiles side by side occupying **y = 180..539 exactly**, pure black bars above and
  below (measured max luma 0 across the whole runtime).
- Zoom burns each speaker's name into their own tile's bottom-left, so the name tags sit
  *inside* the picture strip, not in the bars.
- A burnt-in **wall clock** ("2026-08-26 13:37:21") ticks in the bottom-right of the lower bar,
  at roughly y 660-700 / x 1010-1270.

## The edit — "light cuts only"

Same treatment Aidan settled on for Interview 01. 31 cuts, 54:11 -> 42:49.

| Cut | Why |
| --- | --- |
| 0 -> 9:16.3 | Pre-roll. Nine minutes of it: Aaron and Russ catching up on the Meta settlement, then a real business conversation about hiring Aaron to draft an MSA for the membership, then Russ rehearsing the intro. Russ says on tape at 4:09 "I'm already recording, but this will be cut out in editing." The body starts on "All right, guys. I'm super excited today." |
| 52:41.6 -> end | Post-roll. Aaron's "See ya. Bye." at 52:41.3 is the last thing in the cut. Everything after is debrief, Russ describing the other two interviews, and scheduling a Q&A call — ending with "I'll shut off the recording so that my editor doesn't have to listen to all that stuff." |
| 29 x pauses >= 1.5s | Trimmed to 0.55s, with 0.275s margin either side of the neighbouring words so no onset gets clipped |

The conversation is genuinely tight — only 36s of dead air recoverable at the 1.5s threshold
(1.7 min even at 0.8s). Threshold kept at 1.5s to match Interview 01 so the series feels
consistent.

**No mistake/retake surgery.** This is a two-person conversation, not a scripted read, and a
scan of the body for technical failures (the kind of thing that forced the AirPods cut in
Interview 01) came back empty.

### Verification

The clean cut was re-transcribed with ElevenLabs Scribe and diffed against the expected re-timed
transcript: **6954 expected words vs 6968 rendered**, 130 diff sites, every one of them Scribe
re-tokenising filler or crosstalk — "kinda"/"kind of", "dataset"/"data set", "unfa-"/"unfair-",
"hard to prove"/"hard-to-prove". The six sites where three or more words differ are all short
overlaps where both men talk at once. No content lost. Head lands exactly on "All right, guys,"
tail on "See ya. Bye."

## Framing — native, clock deleted

Aidan chose to **keep the recording's own framing**: 1280x720, 1:1 pixels, black bars top and
bottom. The alternative was cropping the strip and blowing it up 1.5x into 1080p for bigger
faces, but the tiles are natively 640x360 — upscaling only softens them.

So the only reframe is deleting the clock, done losslessly:

```
crop=1280:540:0:0,pad=1280:720:0:0:black
```

The picture strip ends at y=539, so cropping at 540 keeps every picture pixel including both
Zoom name tags, and the pad rebuilds the lower bar as clean black. Verified after the fact:
max luma 0 in the old clock region, picture still at rows 180-539.

## The graphics — title card only

Carried straight over from Interview 01, where Aidan cut v1's popups and lower thirds. Zoom
already burns both names into the tiles, so branded lower thirds would be redundant here too.

Built on `kallaway.t1.section.chaptercard` — bloom, dot grid, vignette and grain kept, `.stage`
replaced wholesale with one centred stack:

    CAIC / CERTIFIED AI CONSULTANT   (wordmark, AIS hexagon cropped off)
    [ EXPERT INTERVIEW 02 ]          (flat pill, no glow)
    How AI Rules Get Enforced
    Aaron Alva · Alva Strategy Center · Formerly FTC

Centring measured, not eyeballed: every content band lands within 1.5px of x=960.

`_plan.json` is a single graphic. `_gen.mjs` still carries the tier-2 position overrides and
`_composite.mjs` still loops the plan, so adding beats back is a matter of re-listing them.

### Timing

`titleLead` is 2.0s of black before the interview; the card runs 6.5s (solid to 5.0, then a
1.5s dissolve). Russ starts "All right, guys, I'm super excited today" at 2.0s with the card
still fully up, and the reveal lands mid-sentence — what Aidan asked for on Interview 01.

### The card is NOT opaque in the MOV

Carried over from Interview 01 and still true: HyperFrames' `--format mov` path captures on a
transparent page, and the card's opaque `background: var(--canvas)` does not survive it. So
`_composite.mjs` overlays the card onto its own opaque black plate and alpha-fades *that plate*;
`_gen.mjs` gives the title no internal fade (`fade = 0`) so the two don't double up.

## Build

```bash
node _gen.mjs                        # _plan.json -> g/<id>/index.html
HF=~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js
node $HF lint g/title                # expect 0 errors, 1 google-fonts warning
node $HF render g/title --format mov --fps 25 --quality high --workers auto \
  --output "/Volumes/Extreme SSD/Uppit AI/Projects/CAIC/Interviews/Interview 2/_work/gfx/title.mov"
node _composite.mjs --preview 0 14   # eyeball the intro
node _composite.mjs                  # full render -> _work/final-1280x720.mp4
```

Graphics render to ProRes 4444 alpha MOVs (`--format mov`; `--format webm` gives yuv420p,
**no alpha**). The 42-minute video is deliberately **not** rendered through HyperFrames — that
would push the source through Chrome for no gain. The overlay-plus-ffmpeg route composites at
roughly 20x realtime.

## Output

`_work/final-1280x720.mp4` — 42:51, 1280x720, 25 fps, CRF 20.
Delivered next to the source as `Interview 2 - How AI Rules Get Enforced - EDITED.mp4`.
