# The Diary Of A CEO (Mark Cuban), first 6:00: motion-graphics analysis

Source: `video/doac.mp4` (720p, 6:00). Note: `frames/doac/scene_times.txt` and `scene.log` were empty, so scene times below come from a fresh `select='gt(scene,0.3)'` pass printed to stdout (81 cuts, matching the 81 scene frames).

## One-paragraph read

DOAC's graphics language is almost entirely **kinetic typography living in the negative space beside the speaker**, plus a handful of **physical, photographed paper worlds** (collage, cutout dioramas, deal memos) that stand in for b-roll. Type is a heavy grotesk in ALL CAPS, stacked in 2 to 4 lines of wildly different sizes (a tiny "of its" sits under a huge "CONSEQUENCES"), set flush to an invisible column right or left of the face. Each word lands on the spoken word with a hard cut-on (no slide), and the emphasis word gets a different treatment: red, italic, a bigger size, a contrasting serif ("ETHICS", "nice"), or a blur-to-sharp focus pull. Speaker color is the system: guest (Mark) is white with red emphasis, host (Steven) is golden yellow. A persistent "#1 / #2 / #3" chapter counter sits top right across many cuts. Everything is grounded by cinematic grade, vignette, gate-weave flicker and grain, so even the flat text feels shot rather than typed. The cold open (0:00 to 1:40) is dense with graphics; after the DOAC table stinger (2:06) graphics nearly vanish and the show runs clean, with only archival photos and a mono caption.

## Inventory

| Time | Type | Layout (1920x1080) | Type treatment | Color | Surface | Enter | Exit | On screen |
|---|---|---|---|---|---|---|---|---|
| 0:00 to 0:01.2 | Kinetic quote "AI IS NOT SMART" | Lower-left over chest, block ~620x200, x 130 to 750, y 600 to 800 (~20% of frame) | Heavy grotesk caps, "AI" ~150px italic, "IS NOT" ~45px, "SMART" ~110px; tight leading, stacked | White, "NOT" red #D0202F-ish | Flat over footage | Per word, hard cut-on, 1 word every 2 to 3 frames at 24fps | Hard cut with shot | 1.2s |
| 0:01.2 to 0:03.6 | Kinetic quote "AI DOESN'T KNOW THE CONSEQUENCES OF ITS ACTIONS" | Upper right, x 1080 to 1650, y 130 to 330 | Same; "CONSEQUENCES" italic, "of its" tiny | White + red "DOESN'T" | Flat | Per word cut-on | Cut | 2.4s |
| 0:03.6 to 0:05.4 | Carry-over plus payoff "IT DOESN'T HAVE INHERENT / ETHICS" | Host shot: lower left. Carries across the cut to guest shot, now defocused left; "ETHICS" sharp upper right x 1300 to 1800, y 120 | Payoff word in a light high-contrast serif, caps, ~110px | White | Flat, gaussian blur ~12px on carried text | Per word, then carried text blurs over 2 frames as "ETHICS" cuts on | Cut | 1.8s |
| 0:05.4 to 0:11 | Subtitle on b-roll (servers) | Bottom center, y ~880 | Small sentence-case sans ~32px, 2 lines | White | Flat | Cut | Cut | per line |
| 0:11 to 0:15 | Kinetic quote "BUT THEY'RE BORROWING MORE THAN THEY'RE MAKING" then "WE LITERALLY COULD GET INTO A DEBT BUBBLE" | Right column x 1150 to 1700, y 80 to 340 | Small caps lines ~50px build down, payoff "DEBT BUBBLE" ~120px bold italic | White, "MORE" red | Flat | Per word, each new line appends below, ~3 to 5 frames apart | Cut | ~2.5s each |
| 0:15 to 0:16 | Host question "YOU DO THINK WE'RE IN A BUBBLE DON'T YOU?" | Lower left, x 110 to 700 | Same stack grammar | Golden yellow #F2B630 | Flat | Per word | Cut | 1s |
| 0:16.3 to 0:18 | Focus-pull word "what causes it to burst?" | Right of face, x 1150 to 1750, y 100 to 420 | lowercase, "burst?" bold italic large | White | Flat, blur 20px to 0 | Words appear blurred and sharpen over ~5 to 6 frames | Cut | 1.7s |
| 0:19.3 to 0:29 | Collage world: guest name card | Full frame. Paper "ticket" card centered ~700x420 (grows to ~1100x660 during push) | Condensed heavy grotesk "MARK CUBAN" black, red sub "BILLIONAIRE ENTREPRENEUR & FORMER SHARK", mono form labels ("REC. 0001 SUBJ: CUBAN, MARK") | Cream card, black, red, wood brown ground | Photographed paper on wood table, cutout photos with white borders, checks, logos; shallow DOF, vignette | Hard cut in, then constant slow camera push-in and slight clockwise drift for ~9s | Cut | ~9.5s |
| 0:29.3 to 0:38 | Paper diorama b-roll (garbage-bag wagon, houses) | Full frame | Cardboard box labels "GARBAGE BAGS", price tag "$3 $6" | Red wagon, cream boxes, grey | Stop-motion paper craft, real light | Cut, slow pan right, wagon trucks across | Cut | ~8s |
| 0:38 to 0:43 | Shark Tank deal memo "SOLD" | Full frame paper world; memo ~700x480 center | Stencil heavy "SHARK TANK", typewriter fields, red rubber "SOLD" stamp | Cream, blue, red | Paper on blue paper "sea" with shark-fin cutout | Speaker footage is composited into the paper world; paper waves rise and the camera tilts up off him onto the memo over ~1.5s | Cut | ~5s |
| 0:47 to 1:13 | Chapter counter "#1", "#2", "#3" | Top right, x ~1780, y ~70, ~70px | Bold italic serif-ish numeral with hash | White; dims to ~50% grey when a big quote is on screen | Flat | Hard cut on with the chapter line | Persists across 10+ cuts and onto b-roll; swaps number on new chapter | ~10s per number |
| 0:47 | Kinetic "YOU GOTTA FIND ONE THING AND BE [blurred]" | Center-left lower third y 560 to 700 | Stack, last word held blurred/green-tinted as a tease | White | Flat | Per word | Cut | 2s |
| 0:53 to 0:59 | Paper race: ribbons + toy TV on ruled yellow pad | Full frame | None (subtitle only) | Red, blue, grey paper strips, teal TV | Paper craft top-down, vignette | Strips retract out of frame, TV slides in from left, strips re-enter as racing lanes | Cut | ~6s |
| 1:04 to 1:06 | Quote with blur-in "what do i SUCK at?" | Right column | lowercase small + caps payoff | White | Flat | Payoff word starts blurred and scaled ~105%, resolves in ~4 frames | Cut | 1.5s |
| 1:06 | DOAC logo bug glitch | Center upper third, ~160x50 | Black on white label | Black/white | Flat | 4 frames of RGB-split/slice glitch, resolves to clean label | Hard cut 2 frames later | ~0.6s |
| 1:08 | "AND ONE OF THE BIGGEST MISTAKES" | Lower left | Stack, "MISTAKES" red, glow-blurred (heavy blur at ~40%) | White, red | Flat | Per word | Cut | 2s |
| 1:13 | "and i found that i got a lot further by being nice" | Lower center-left, x 280 to 900, y 560 to 820 | Lowercase sans builds line by line, payoff "nice" in a serif ~1.6x size | White | Flat | Per word, ~2 frames per word | Cut | 2.5s |
| 1:16 to 1:20 | Newspaper clippings (Hollywood Reporter, CNBC) | Full frame, tilted page, macro | Real headline typography | Paper white | Photographed print, film vignette, flicker | Cut, slow push and slide | Cut | ~4s |
| 1:20 to 1:24 | "YEAH I'LL TELL YOU THIS", "THAT TELLS YOU ALL YOU NEED TO KNOW" | Right column / lower left | Stacked caps | White | Flat | Per word | Cut | ~2s each |
| 2:00 to 2:06 | Host to-camera intro | Clean, no graphics | | | | | | |
| 2:06 to 2:10 | Show stinger "DOAC / A FLIGHTSTORY SHOW" | Center, logo ~330x90 above a lit round table, sub line ~14px | Heavy grotesk caps, white with soft light falloff | White on near-black set | Photographed / CG set with top-down pool light | Black for 3 frames, table fades up ~4 frames, logo letters resolve left to right out of a horizontal blur over ~6 frames | Cut | ~4s |
| 2:08 to 2:20 | "click to play in your language" feature pill | Right edge, x 1640 to 1900, y 520 to 1020, tall rounded rect r ~60 | Tiny UI sans | Black glass, white text | Glassy device mock | Slides in from right edge ~5 frames, list populates | Slides out right | ~12s |
| 3:30 | Archival photo caption "MARK (RIGHT), WITH HIS PARENTS AND TWO BROTHERS" | Lower left, x 100 to 1360, y ~935, on a 30% dark band | Monospace caps, tracking ~+300, ~30px, short red dash leader | White, red dash | Flat over grainy photo with chromatic fringe | Photo fades up from black ~4 frames, caption already on | Cut | ~6s |
| 3:30 to 5:00 | Archival photos, baseball card macro inserts | Full frame | | | Photo, slow push | Cut or dip | Cut | 2 to 8s |

## Motion grammar

- **Easing feel:** snappy and percussive. Words do not slide or scale in; they hard-cut on at 100% on the spoken syllable. The only eased motion is (a) blur-to-sharp focus pulls on payoff words (~4 to 6 frames, ease-out), and (b) slow continuous camera drift in the paper worlds (linear-ish, runs the whole shot).
- **Entrance duration:** 0 frames for normal words (cut-on), 4 to 6 frames for focus-pull payoffs, ~4 frames for the stinger fade, ~5 frames for the language pill slide.
- **What moves vs holds:** type holds dead still once on; the frame never shakes. Motion comes from the paper-world camera (push, drift, tilt), not from the text.
- **Text reveal:** strictly per word, synced to speech, appending into a fixed stacked lockup that is pre-composed for its final shape (so early words already sit in their final position and size). Lines build top to bottom.
- **Relation to cuts:** a phrase can **survive a cut** and become the defocused background for the next speaker's payoff word (0:03.6 "IT DOESN'T HAVE INHERENT" carried from host to guest, blurred, while "ETHICS" lands sharp). The chapter counter persists across all cuts in its chapter, including onto paper b-roll. Otherwise text dies with the shot it lives on.
- **Speaker coding:** guest = white + red emphasis, host = golden yellow; the same subtitle colors on b-roll (yellow when the host is speaking over b-roll).
- **Texture:** every frame has vignette, gate flicker and grain, so the type sits "in" the image.

## Signature moves

1. **Pre-composed stacked lockup, word-by-word cut-on.**
   Build the final lockup first (e.g. 3 lines: 44px / 120px / 32px, line-height 0.92, left aligned), place it in the face's negative space (right column x 1150 to 1750 or lower-left x 110 to 760), then `tl.set(word, {opacity:1}, wordStart)` for every word with zero tween. Emphasis word in a contrasting treatment (italic, bigger, color). Text block width ~30% of frame, never crossing the face.
2. **Focus-pull payoff word.**
   Payoff word starts at `filter: blur(18px); opacity:.6; scale:1.04`, resolves to `blur(0); opacity:1; scale:1` over 0.2 to 0.25s ending on the stressed syllable. Supporting words around it are already sharp.
3. **Carry-over defocus across a cut.**
   The lockup from shot A stays on through the cut to shot B, drops to `blur(10px) opacity:.55` in 2 frames at the cut, and a single new payoff word (different face: light serif caps ~110px) lands sharp in the opposite column. Reads as one thought spanning two speakers.
4. **Persistent chapter counter.**
   "#1" ~70px bold, top right (right 80px, top 50px), cut on with the chapter-start line, holds through every cut and b-roll in that chapter, dims to 50% when a large quote is on screen, hard-swaps to the next number.
5. **Photographed paper world with slow push.**
   Full-frame tabletop collage: guest name on a cream index/ticket card, cutout photos with white borders, form labels in mono. Camera pushes ~15% over 6 to 9s with ~2 degree rotation and shallow depth of field. In HTML: layered PNG cutouts with drop shadows, parent `scale 1 to 1.15`, `rotate 0 to 2deg`, linear, plus a CSS blur ring on outer layers and a vignette.
6. **Archival caption in tracked mono.**
   Lower-left, short 24px accent dash + mono caps, tracking 0.3em, ~28px, on a 30% dark band; photo fades up 4 frames, caption already present.

## Fit for Humanly Possible

1. **Stacked lockup, per-word cut-on: strong fit.** Bricolage Grotesque 800 for the big words, Inter Tight 600 caps for the small connective words. Cream #FFF0E6 type, the single emphasis word in gold #FFC145 (that is our one-word gold). Our "pop-and-settle" can replace the zero-frame cut-on: each word `scale .92 to 1, y 8 to 0` over 0.18s with cubic-bezier(.2,.9,.25,1). Keep it in the negative space beside the face. Swap DOAC's red for nothing; one gold word is enough.
2. **Focus-pull payoff: partial fit.** Blur reads as soft and cinematic; we are flat and quick. Keep the idea (payoff word arrives differently than the rest) but do it as a quicker pop: payoff word 1.15 to 1 scale with a 0.1s delay after the line, gold. If we keep any blur, cap it at 6px and 0.15s. Do not use the long glow-blur on "MISTAKES": that is a glow and is out.
3. **Carry-over across a cut: good fit, use sparingly.** Great for interviewer question to guest answer. Carried text drops to cream at 35% opacity (no blur, we are flat), payoff word pops in on the other side. One per episode at most.
4. **Chapter counter: strong fit.** "01", "02", "03" in Bricolage 800 ~64px cream, top right, with an orange #FF8A4C dot or underline as the frame's one orange. Persist across cuts. This maps directly onto "one real way they use AI" if the episode has steps.
5. **Paper world collage name card: fits in spirit, not in surface.** Our surfaces are flat, so do a flat collage: brick #7A1E1E card (6px radius) with the guest name in Bricolage 800 cream, role line in Inter Tight, 2 or 3 flat-cut photo rectangles (10px radius) tilted -4 to 6 degrees on the oxblood ground, film grain on top. Keep the slow push (scale 1 to 1.06 over the hold) and enter each piece with a quick pop-and-settle, staggered 0.06s. No photographed wood, no DOF blur, no drop shadows heavier than a flat offset.
6. **Tracked mono caption: good fit.** Use Inter Tight 600 caps at +0.2em tracking (we have no mono), a 24px orange dash leader, cream text, oxblood band at 70%. Ideal for "where/when" context on b-roll or archival photos.
- **Does not fit:** the DOAC glitch logo bug (RGB-split glitch), the glassy "play in your language" device pill (glass UI is banned), heavy glow-blur emphasis, and the red/yellow two-speaker color coding (we only get one gold and one orange per frame; code speakers by side of frame instead).

## Picks

- `picks/doac_ai-not-smart.jpg`: 0:01 stacked cold-open lockup, white caps with red "NOT", lower left over the guest.
- `picks/doac_ethics-carryover.jpg`: 0:04.9 carried host line defocused left while serif "ETHICS" lands sharp right.
- `picks/doac_debt-bubble.jpg`: 0:14.9 right-column build: small caps lines over a huge italic "DEBT BUBBLE" payoff.
- `picks/doac_burst-deblur.jpg`: 0:17.3 focus-pull mid-transition, "what causes" sharp, "it to burst?" still blurred.
- `picks/doac_namecard.jpg`: 0:25 paper ticket guest name card in the tabletop collage, mid push-in.
- `picks/doac_sold-stamp.jpg`: 0:41.9 Shark Tank deal memo paper world with red SOLD stamp and subtitle.
- `picks/doac_counter-1.jpg`: 0:48.3 "#1" chapter counter top right with the chapter's lockup and blurred tease word.
- `picks/doac_nice-serif.jpg`: 1:14.7 lowercase build ending on serif payoff "nice", "#3" counter persists.
- `picks/doac_stinger.jpg`: 2:08.8 DOAC show stinger over the lit round table on black.
- `picks/doac_photo-caption.jpg`: 3:31.5 archival photo with red dash plus tracked mono caps caption.
