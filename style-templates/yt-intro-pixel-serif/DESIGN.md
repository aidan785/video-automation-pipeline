# YT Intro: Pixel Serif

Aidan's YouTube intro look. Deconstructed from the first 60s of kaye.creatives,
"How I Get Perfect AI Realism on the First Try in 2026" (youtube.com/watch?v=w0R29uK3Hfk).
Aidan's direction: "Pay attention to the text format. That's the exact text I want."

This look overrides the MOTION_PHILOSOPHY.md palette and texture (no black canvas,
no grid, no chrome type). The discipline stays: one idea per beat, the visual leads
the word, nothing sits on screen without a reason.

## Style Prompt

Warm, lived-in talking head with almost nothing on screen. Text shows up only on the
phrase that matters, set as a quiet light sans line that types on like someone is
writing it, followed by a loud pixel-serif punch line in lemon yellow that pops up
word by word. The pixel serif is the one expressive voice. Everything else recedes.
No boxes, no strokes, no shadows, no lower-thirds, no full captions.

## Colors

| Role | Hex | Use |
|---|---|---|
| Punch yellow | `#FEFF5E` | Big pixel-serif line (default), small notes |
| Warm white | `#FFFBF8` | Small setup line (default), big line in the inverted variant |
| Film black | `#000000` | Surround of the 4:3 cold open frame |
| Card white | `#FFFFFF` | Wall card behind the speaker |

Two text colors, never a third. A beat is either yellow-big / white-small (default)
or white-big / yellow-small (inverted, use about one beat in four).

## Typography (measured at 1920x1080)

| Voice | Font | Size | Notes |
|---|---|---|---|
| Punch | Redaction 35 Bold | 118px | `scaleX(0.787)`, line-height 1.12, lowercase, no tracking |
| Setup | Lexend Light (300) | 38.5px | sentence case as spoken, no end punctuation |
| Note | Lexend Light, oblique | 35px | yellow, `skewX(-11deg)` (Lexend has no italic), can end in `!` or `~` |
| Cold open caption | Inter Medium (500) | 49px | white, bottom center, key word in italic |

Setup sits directly above the punch line, 14px gap. Stack is centered on itself
(left-aligned when it hugs the left third of frame). A beat can take `scale` (the
reference drops to about 0.78 on wider shots) but the 118 : 38.5 ratio never changes.

## Motion

- **Setup line types on**, one character at a time, starting on the first spoken word
  of the phrase and finishing about 0.35s before the phrase ends (never slower than 22 chars/s).
- **Punch words rise** from 150px below with a small overshoot (`back.out(1.5)`, 0.26s),
  cascading 0.14s apart. The first word lands 0.2s before it is spoken.
- **Punch words resolve digitally** while they rise: each word starts as chunky pixels and
  sharpens over about 6 frames (Redaction 100, 70, 50, then 35, two frames each). This is the
  "digital text animation" and it is not optional.
- **Swap**: a punch word can be replaced in the same slot ("completely" then "backwards").
  Old word cuts off, new word rises 3 frames later.
- **Exit**: the whole stack is gone in about 3 frames (0.12s), finishing no later than 0.3s
  after the next beat starts. Back-to-back beats sit in different spots so they never collide.
- **Hold**: about 1.5 to 2s after the last punch word lands.
- **Cold open captions** hard-swap on the word. No animation at all.
- **Camera**: a few **smooth zooms**, nothing else. Measured frame by frame off the reference
  (all 11 minutes): an animated zoom runs 0.42 to 0.54s, x1.10 to x1.19, quick off the mark with a
  long soft landing (very close to CSS `ease`, `cubic-bezier(.25,.1,.25,1)`; half the travel is done
  by 30% of the time). She uses about **2 in the first two minutes** and about 14 in the whole video.
  Budget: three or four a minute at most.
  - A zoom starts as the previous text beat **exits**, into a stretch with nothing else on screen.
    Never zoom while a card or a stack is landing.
  - Get back out with a **hard cut on a jump cut** (a silence or retake join in the edit, or a
    cutaway). The join hides it. Now and then a smooth zoom out (x0.83 over 0.54s) is fine too.
  - No snap zooms (2 to 4 frames) and no slow pushes. Aidan rejected both: slow ones "glitchy" (v1),
    24 snaps in 51s "too much" (v2, 10/7).

## Density (Aidan, 10/7, on v2: "the motion graphics are too much... we don't need motion graphics for every single second")

- **One idea per sentence at most**, and some sentences get nothing. Leave 3 to 5s stretches of
  plain talking head. Those stretches are what make the next thing land.
- The **text stack is the main graphic**. About one stack per sentence that matters (10 to 12 in a
  50s talking section).
- **Three or four things behind the speaker** in the whole intro, one at a time: a card, a few
  photos piling up, the clips playing. Each one leaves before the next sentence.
- **One cutaway** (full-frame montage of the real clips) placed between two jump cuts.
- v1 (text and a few punch-ins only) read as under-edited. v2 (a scene on every phrase, six type
  voices, 24 camera moves) read as too much. v3 sits between them. When in doubt, cut a graphic.

## Rotoscope layer

Stack inside the camera: dimmed background plate, things behind the speaker, cutout of the speaker
on top. Pop-ups go behind the speaker so they read as being in the room.

Getting the cutout right (all three bit us on the first test):

1. **Frame lock.** `hyperframes remove-background` reads the source at a constant frame rate and
   writes the matte at a slightly different one (29.93 against 30 here), so the cutout slides behind
   the background by up to 6 frames over a minute. Re-time both to exactly the composition fps with
   the same frame count: background `fps=30`, matte `select=gte(n,1),setpts=N/30/TB`. Check by frame
   index (`select=eq(n,K)` on both files), not by `-ss` time.
2. **Halo.** The matte boils: on some frames it sits 8 to 10px loose and carries bright wall around
   the hair. Do not trust erosion alone. Build the cutout colour as *source inside a tight feathered
   mask, dimmed source outside it* (matte eroded 8px, blurred 4px, `maskedmerge` in yuv444), and keep
   the normal matte (eroded 2px, blurred 1.3) as alpha. A loose frame then shows dim wall on dim
   wall, which is invisible.
3. **Dim in YUV** (`lutyuv`, luma x0.52, chroma x0.468) so the plate and the cutout edge match
   exactly and nothing round-trips through RGB.
4. **Pair matte and colour on an exact 1/30 timebase** (`fps=30` after the `setpts`), or the matte's
   millisecond timestamps make every third frame pair with its neighbour. Write the WebM with
   floor-rounded millisecond timestamps (`settb=1/1000,setpts=floor(N*1000/30)` plus
   `-enc_time_base filter -fps_mode passthrough`) so a lookup at k/30 always lands on frame k.
5. **Tag the cutout `colorspace=bt709` only.** Adding `color_trc` / `color_primaries` makes the
   renderer crush the speaker's shadows (sweater 38 came out 26) while the background stays right.
6. **Prove it on the render**, not the snapshot: for a handful of frames, find which source frame the
   background shows just outside the cutout and which one the speaker shows inside it. They must match.

## Behind-the-speaker vocabulary (pick three or four, never all)

- a white card on the wall (the cold open contact sheet lands there on the match cut)
- photos piling up one per clause, plain white border, slight tilt (the bad-take gag)
- the real clips as tilted video cards, playing
- full-frame montage cutaway of the real clips, with a text stack bottom left over a soft dark corner

Shelved after v2 (kept in the project under `versions/v2/` if a later video wants one): full-screen
yellow cards, prompt-box UI over the blurred shot, status pills, pixel caps labels (Pixelify Sans),
comic titles (Bangers), giant numeral, node flow, slot machine.

## Structure of the intro

1. Cold open, 15 to 25s: AI clips, about 2s each, inside a rounded 4:3 film frame on black. Voice over only.
2. Match cut: the film frame shrinks into a white card on the wall behind the speaker while the shot racks into focus.
3. Hook, 30 to 35s: a text stack on the sentences that matter, two or three things behind the
   speaker, one or two smooth zooms. Some sentences get nothing.
4. Welcome and roadmap: name line, one cutaway of the clips, the list as a punch-word swap in one slot.
5. Last line: "let's get into / step one", then straight into the video.

## What NOT to Do

- No full captions. Only the key phrase of a sentence gets text.
- No graphic on every phrase and no stacking (a card and a label and a pill and a zoom at once).
  One idea per sentence at most. See Density.
- No more than three or four camera zooms a minute, and no snap zooms.
- No background boxes, strokes, drop shadows or glows on text.
- No third text color in the type and no accent blue. This is not the AIS look.
- No uppercase punch lines. The pixel serif is always lowercase (except "AI" and names).
- No text over the face or hands. Text lives in the empty wall next to the speaker.
- Never let a beat enter after its word. Punch leads by 0.2s.
