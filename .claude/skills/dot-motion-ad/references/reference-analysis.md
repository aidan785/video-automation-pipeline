# The ChatGPT "Intelligence Age" ad, frame-by-frame breakdown

Source: raw-media/hp-teaser-signal/refs/chatgpt.mp4 (first 62s). Transition strips T01-T32 (24fps, labelled) live in video-projects/hp-teaser-translated/_research/chatgpt-strips/, per-frame luma/diff in series.tsv. Frame numbers below are the AD's 24fps frames, not Studio's 30fps.

## Measured easing
- 0.083-0.833s (18f): single dot breathes r 90 -> 140. Normalized progress per frame:
  .02 .05 .07 .12 .19 .28 .39 .52 .63 .73 .79 .86 .90 .94 .96 .98 .99 1  -> S-curve, midpoint at u=.44,
  ~ cubic-bezier(.5,0,.3,1) (AE easy-ease, slightly front-loaded). Hold 4f at 140.
- 1.0-1.92s (22f): breathes back 140 -> 88, same curve mirrored. Hold 3f.
- 2.04-2.17s (3f): POP 88 -> 148 (snap, no ease-in), then jelly wobble 137<->148, period ~0.25-0.3s, until 3.9 (dot "vibrates" on the beat).
- 3.9-4.12s (~5f): dot pinches/stretches and splits (mitosis, gooey neck) into 2.
- 4.125-4.375s (6f): the halves fly apart 718 -> 607 / 1186 -> 1271 (fast ease-out), then drift back ~60px over 0.45s (soft overshoot-settle).
- 4.875-5.2: each half splits again (gooey) -> 4; 5.5 -> 8; 6.08-6.5 -> 12, 35, 72, 120 dots: an explosion into small dots (r ~16) that settle into the first dot-figures (cave hunters) by ~6.5.
- 6.5-9.17: ~110-125 dots of r~16 animate as figures (stepped cel animation).
- 9.2-9.6: a GIANT dot (r 475+) sweeps in from the right and covers frame -> ground reads black (9.25) -> giant shape exits left, leaving white dots on black (scale-through / wipe with a dot).

## Summary
- **Few hard cuts.** Only about 10 of the ~40 transitions are plain cuts, and nearly all of those are in the archival TV section (38.5–46s). Everything else carries a dot's shape, position, or "the whole black frame was a dot" across the edit.
- **Signature move: scale-through a dot.** A dot grows until it becomes the new background (ground flips black/white), or the background pulls back into a dot. Entering is fast (about 5 frames, ease-out). Exiting is very ease-in: about 12 frames of slow reveal, then 6 frames racing to small, landing with a spring undershoot.
- **Invert match cuts.** The dot keeps its exact position and size while ground and dot colour flip in 1 frame. This happens at 11.71, 21.875 and 54.62, always on a beat.
- **Two tempos.** Snaps of 1–5 frames on the beat (splits, bursts, inverts), and slow 12–18 frame ease-in builds into big scale changes. Almost nothing moves linearly except drifts and spins.
- **Music.** About 118 BPM (one beat ≈ 12.2 frames), entering at about 4.5s. Most major transitions land within 1–2 frames of a beat.
- **Dot grammar.** Perfect circles on a strict square grid, dot diameter about 85–90% of the spacing. Spacing is ~20px for the cave people, ~30px for fire, horses and corn, ~34px for the plane. Archival footage is a true halftone at ~18–19px, white on black.
- **Colour.** Black and white only until the blue orb at 55.12. Text is a 4-frame fade in and 8-frame fade out ("All progress…"), and the ChatGPT wordmark types on at about 1.4 frames per character.

## Shot table (frames, 24fps; radii are 1080p px)
| # | Frames / s | On screen | Ground | Motion |
|---|---|---|---|---|
|1|0–93 / 0–3.88|One dot, r≈90|white|Breathes: grows to 140 over 14f (ease-in-out), holds 8f, back to 88 over 16f. Pops to 148 in 2f (f50–52), then a decaying ±5px jiggle. Near-silent.|
|2|94–131 / 3.92–5.46|Dot splits 1→2, then 2→4|white|Neck pinches over 7f, halves drift apart (ease-out, 5f). Squashes vertically for 4f before splitting again.|
|3|132–146 / 5.50–6.08|4→8 scatter|white|Breaks apart in 1f on the beat, stretched pieces round up over 8f|
|4|147–155 / 6.12–6.46|Explosion → dot figure|white|Dots blast out for 2f while more stream in, then converge and snap to the grid in about 5f|
|5|156–220 / 6.50–9.17|Cave hunters with spear (~20px grid)|white|Run cycle animated on every frame, camera tracks. Wind-up f203–215, throw f216.|
|6|221–247 / 9.21–10.29|Inside a giant dot: 2 stones strike|black|Collide at f235 (beat 9.79), sparks fly, shrink to embers|
|7|248–280 / 10.33–11.67|Fire builds dot by dot (30px)|black|Ease-out build, then flicker|
|8|281–319 / 11.71–13.29|Coin with square hole|white|Fire curl coils into the coin over 5f. A dot cloud pulls away up-left, coin rocks ±15°.|
|9|320–339 / 13.33–14.12|Spoked wheel, same outline as the coin|white|Spins, then fills solid over f338–339|
|10|340–353 / 14.17–14.71|Solid dot → horse|white|Shrinks r 261→112 (ease-in, 8f), bursts, zooms out into the rider (6f, ease-out)|
|11|354–430 / 14.75–17.92|Galloping riders|white|Dotted hill rises from bottom-left as riders exit right, then sinks out the bottom. f431 is one blank frame.|
|12|432–461 / 18.00–19.21|Corn sprouts from a seed|white|Main stalk grows over 9f (ease-out), then two flanking stalks (rule of three)|
|13|462–524 / 19.25–21.83|Corn morphs into perspective crop rows; black sun rises|white|Camera tilts. Sun rises with ease-out, then drifts up slowly.|
|14|525–536 / 21.875–22.33|White moon in the sun's position|black|Drifts down 7px/frame, then free-falls at 54→82→120→177→193 px/frame while shrinking|
|15|537–555 / 22.38–23.12|Splash ripple of dots|black|Ripple expands with ease-out over 11f|
|16|556–591 / 23.17–24.62|Halftone ocean wave|black|Push-in, wave crashes and whitewash fills the frame over 8f|
|17|592–648 / 24.67–27.00|Ship in a storm, halftone|black|Slow sway|
|18|649–678 / 27.04–28.25|Wide ship|black→white|Black frame pulls back into a dot (see T18)|
|19|679–727 / 28.29–30.29|Dots drop in one per beat|white|Spring settle (r 67→50→79). New dots arrive as streak, then teardrop, then round.|
|20|728–746 / 30.33–31.08|Dots orbit and merge into goo|white→black|Merge into a blob, which grows to fill the frame (ease-in)|
|21|747–778 / 31.12–32.42|Steam train charges at camera|black|Accelerating push-in, steam fills frame, 3f fade, then a 6f black hold|
|22|779–812 / 32.46–33.83|Moth circles a lightbulb that glows on|black|White flash over 3f (f810–812)|
|23|813–835 / 33.88–34.79|X-ray skeleton waving|strobe|5 frames of alternating negative/positive|
|24|836–857 / 34.83–35.71|Push into halftone → plane|black→white|Dots grow over 8f, invert cut at f845, big dots regroup fast (ease-out)|
|25|857–884 / 35.71–36.83|Plane flies overhead|white|Exits top, then 2 empty frames|
|26|885–907 / 36.88–37.79|DNA close, then jump-cut wide|white|Pull back, helix rotates|
|27|908–923 / 37.83–38.46|Radial halftone edge|b/w|Slow 16f creep|
|28|924–984 / 38.50–41.00|CRT static, cartoon, static, news anchor, static|black|Static bursts of 6–8f, resolving to the image through 3f of sparse noise|
|29|985–1036 / 41.04–43.17|Astronaut on the Moon, full frame|black|Slow walk|
|30|1037–1083 / 43.21–45.12|Vintage Mac window: globe ↔ computer|black|Fully static. Dotted link adds a dot about every 6f.|
|31|1084–1121 / 45.17–46.71|Circuit traces grow, then push into the chip|black|Chip centre becomes the ground (9f ease-in) and 4 dots are born inside|
|32|1121–1195 / 46.71–49.79|ChatGPT voice indicator (4 dots)|black|Dots stretch into pills on the voiced prompts, then multiply into a row and extrude into dotted columns|
|33|1196–1262 / 49.83–52.58|Radial dotted field lines + "All progress has a starting point."|black|Text fades in 4f (f1208–1212), out 8f (f1256–1263)|
|34|1263–1310 / 52.62–54.58|Starfield gathers into a sphere, which collapses to a white dot|black|Gather is ease-in. Collapse overshoots to r 259, then 176→124→…→92.|
|35|1311–1322 / 54.62–55.08|Black dot, r 89|white|Invert match cut, dead still for 10f, swells over 2f|
|36|1323–1369 / 55.12–57.04|Blue orb|white|Grows r 142→179 over about 25f (ease-out)|
|37|1370–1419 / 57.08–59.12|"ChatGPT" types on|white|About 1.4f per character, centre-aligned|
|38|1420–1434 / 59.17–59.79|OpenAI logo|white|Static|

## Transition table
| T | Frame / s | From → to | Type | Carried element | Frames | Easing |
|---|---|---|---|---|---|---|
|01–03|f94, f115, f132|1→2→4→8 dots|Dot split|the dot|7+5f, ~10f, 1+8f|Squash first, ease-out separation|
|04|f147 / 6.12|dots → hunter|Explode and assemble|dots|9f|Snappy, snaps to grid|
|05|f221 / 9.21|hunter → black ground|Scale-through dot, ground inverts|spear tip hits the dot|5f|Fills .34→.58→.71→.83→.93→.96 of frame, strong ease-out|
|06|f235–248|stones → sparks → fire|Narrative morph|white dots|~13f|Collision on the beat|
|07|f281 / 11.71|fire → coin|Invert cut + shape morph|fire curl becomes the ring|1+5f|Hard colour flip, shape keeps moving|
|08|f320|coin → wheel|Silhouette swap|identical outline|1f|—|
|10|f340–353|wheel → dot → horse|Fill, shrink, burst, zoom-out|the dot|2+8+6f|Ease-in, then ease-out|
|11|f418–432|horses → corn|Terrain wipe|dotted hill|~14f|—|
|12|f462–478|corn → rows|Morph + camera tilt|dot mass|17f|Continuous|
|13|f525 / 21.875|sun → moon|Invert match cut|same position and size|1f|—|
|14|f530–548|moon → ripple|Gravity drop + splash|the dot|6+11f|Ease-in fall, ease-out ripple|
|15|f556|ripple → wave|Texture-matched cut|halftone band|1f|—|
|16|f592|wave → ship|Crash-cover cut|whitewash|8f|—|
|18|f661–679 / 27.5–28.3|ship → dot|Reverse scale-through|black frame becomes a dot|18f|Exponential ease-in, lands with a 7f spring undershoot|
|19|f728–746|bounce dots → train|Orbit, goo merge, scale-through|blob|18f|Ease-in|
|20|f767–778|train → bulb|Steam cover, fade, black hold|—|3+3+6f|The spot's only black breath|
|21|f810–818|bulb → skeleton|Flash + strobe|light|3+5f|—|
|22–23|f836–857|skeleton → plane|Push into halftone, invert, regroup|dot grid|8+1+12f|Ease-out regroup|
|24–27|f883, f896, f908, f924|plane → DNA → halftone → TV|Pass-over wipe, jump cut, hard cuts|—|1f each|—|
|28–32|39.8–45.2s|TV clips, astronaut, Mac, circuit|Static channel flips, hard cuts|—|6–8f static|—|
|33|f1113–1121|chip → voice dots|Scale-through the chip|chip becomes ground|9f|Ease-in|
|34–35|f1176–1300|dots → lines → stars → sphere|Multiply, extrude, scatter, gather|particles|20f / 38f|Gather is ease-in|
|36|f1301|sphere → dot|Collapse snap|—|2+8f|Overshoot, then ease-out|
|37|f1311 / 54.62|white dot → black dot|Invert match cut|the dot|1f|—|
|38|f1323 / 55.12|dot → blue orb|Colour match cut|the dot|2f pre-swell|25f ease-out growth|
|39–40|f1370, f1420|orb → type → logo|Hard cuts|—|10f type-on|—|

## Grammar (moves to rebuild, with timings)
1. **Breathing dot, then a pop.** Grow over 14f, hold 8f, shrink over 16f, then a 2-frame +60px pop with a jiggle that decays over about 40f. Silence underneath.
2. **Metaball split.** Squash 4f, neck pinches over 7f, halves ease out over 5f. The splits get closer together each time (about 0.9s, then 0.7s, then 0.6s apart).
3. **Explode and assemble into a figure.** 2f blast, 4–5f converge, snap to grid. 9f total, on a beat.
4. **Scale-through a dot.** 5f ease-out (fast version), or 5–9f ease-in after a goo merge or chip push-in. The ground always inverts.
5. **Reverse scale-through.** About 12f of slow edge reveal, 6f exponential pull to small, then a −25% undershoot spring settling over 7f.
6. **Invert match cut.** Same dot position and size, everything flips in 1 frame, on a beat.
7. **Silhouette swap or fill.** Keep the outline and swap the inside in 1f, or fill the silhouette to a solid dot over 2f.
8. **Shrink, burst, zoom-out.** About 8f ease-in shrink, then about 6f ease-out zoom-out from an over-scaled grid into the figure.
9. **Gravity drop.** Speed multiplies about 1.5× per frame while the dot shrinks to 30%, then a row-of-4 splash becomes a ripple over 11f.
10. **Bounce-in dots.** Each new dot arrives as streak → teardrop → round over 3f, one per beat.
11. **Push into halftone.** Dots grow to giant circles over 8f, then an invert cut and regroup.
12. **Cover wipes.** Wave or steam fills the frame for 3–8f.
13. **Flash and strobe.** 3f flash up to white, then 5f alternating negative/positive.
14. **CRT static flips.** 6–8f of static between clips, resolving through 3f of sparse noise.
15. **Particle gather and collapse.** The gather is ease-in. The collapse overshoots to +180% for 1f, then settles over 8f.
16. **Colour reveal at the end.** 2f pre-swell into the orb, then +26% growth over 25f (ease-out).
17. **Type-on.** About 1.4f per character, centre-aligned, then a 1.6s hold.

## Story arc and sound
- **Act 0 (0–4s): the starting point.** One dot breathes in near-silence and pops. This sets up the payoff line at the end.
- **Act 1 (4–22s): life to agriculture.** The dot divides like a cell, then becomes hunters, fire (ground flips black), the coin, the wheel, horses, corn, and sun/moon. Music enters at 4.5s and the transitions land on beats.
- **Act 2 (22–33s): exploration and industry.** Moon drops into the sea, then the wave, the ship, a pull-back to a single dot, playful bouncing dots, the steam train, a black breath, and the lightbulb. The look shifts from graphic dot grids to halftoned photos.
- **Act 3 (34–46s): science and media.** X-ray, plane, DNA, then TV: cartoon ("We are live on the TV, Bob", 39.0), news anchor, astronaut ("That's one small step", 41.5), the Mac/network, the microchip. Cuts get harder and faster, and the music thins out around 43.5–47s.
- **Act 4 (46.7–60s): ChatGPT.**
  - The push into the chip reveals the voice dots, with the voiced prompts from 47.4s to about 53s.
  - The dots spread into radiating field lines under "All progress has a starting point." (50.4–52.6).
  - Stars gather into a dot, which inverts back to the opening black dot (callback to frame 1).
  - The dot becomes the blue orb ("What do you wanna create next?", 55.6), the first colour in the ad.
  - Wordmark at 57.1, logo at 59.2. The music hits every beat from 55.6s to the end.
