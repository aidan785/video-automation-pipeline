# Scene cookbook (every scene built for the HP teaser, in order)

Frames are Studio 30fps frames. "Archive" names a file in `video-projects/_hp-teaser-cg-proof-archive/` that holds that version.

## 0. Opening dot + splits (their 0–6s)

- **Breathing dot.**
  - Grows r 90→140 on BREATHE (.5,0,.3,1) over 0.75s, holds, shrinks back, then POPs 88→148 in 2 frames.
  - After the pop: a decaying wobble of ±5px at a 0.25–0.3s period.
- **Gooey splits** 1→2→4→8, as ONE continuous 8-leaf blob tree. Coincident leaves mean no pops.
  - Each split: squash 4f, neck pinch 7f, halves ease out 5f.
  - The cluster keeps turning (`spin(t)`).
  - Splits get closer together: about 0.9s, then 0.7s, then 0.6s apart.
- **SIGNAL corner code** pulses on the music's tense hits and on our separations (see identity-and-ending.md).

## 1. Hunters + spear (T_EX 6.08 → T_DOT 9.17)

- **Explode + assemble** into two rigged stick-figure hunters on a 14px grid. No footage (the dancer footage was rejected: "it's supposed to be a guy with a spear").
- **Rig pose at the burst.** The rigs run from the burst (T_EX), and particles chase anchors on the live primitives, snapping to the grid as they land. No freeze.
- **Throw.** The chaser falls away, the hunter plants and winds up (T_WIND 8.4), and throws (T_REL 9.03).
- **Spear flight.** Gravity arc (SP_VX 1000, SP_VY -560, G 2700), sticks and quivers; the camera pans with it (`panX`).
- **The dive.** The camera dives into the spearhead tip dot: an exp ease-in zoom with a short shutter at the end. The dot becomes the maroon ground.
  - The zoom starts BEFORE the landing (Z_DELAY -0.32, Z_DUR 0.98).

## 2. Stones → fire (late 8.95 → 11.42)

- **Stones.** Two cream stones carry the dive momentum: they shoot out (OUT 0.45s), settle, drift back slowly (`backP` = IN), then accelerate into the smack on the beat. Sparks, then embers.
  - REJECTED: any glitch on the rocks (zoom jumps and glyph flecks read as bugs).
- **Fire** made of OUR symbols:
  - `FIRE_SYM` glyphs, bold, full cream, on a 30px grid (PG 30, shape maths in 16px units via PGR).
  - Shape matches their fire: chunky solid body, flat base, one tall tongue, side curls, a few loose cells.
  - Evolution: v1 symmetric code fire, then an asymmetric bonfire (9 tongues, wind lean, logs, licks, sparks), then "fatter, tapers at bottom", then the ChatGPT-like fat shape.
- **Timing squeeze.** The smack→spin stretch is compressed by `CFIRE` so everything from T_RESYNC 11.42 on is back on the music.

## 3. Fire → coin → wheel → dot → horse (one spin)

- **Fire into the ring.** Every fire cell maps to a ring slot (none vanish) and spirals in (one extra turn), peeling off in order by angle so a spiral arm reads. Random delays looked like noise.
- **Invert lands mid-swirl.** The ring rotates as one frame (`spinA`), and each dot's spiral rides on top of it.
- **Coin.** RO 330, 30px grid, hole 122 (thin so it "pops open"). It keeps spinning and decelerates: D_DEC 0.8 with a 2 rad/s residual (OMR).
- **Wheel.** Coin dots migrate to the nearest wheel cells while turning (no swap). The wheel fills hub-out into a solid dot (grid dots swell until they merge).
- **Dot to horse.** The dot shrinks on an ease-in (8f), then an over-scaled grid bursts and zooms out on an ease-out (6f) into a rigged horse + rider (30px). Use a shorter shutter on the burst.
- 180° streak blur on spinning dots.

## 4. Horse over hills → corn → field (f~440–655)

- **REJECTED first:**
  - horses driving by, dust, then corn
  - corn sucked into rows, sea, ship rigs ("CapCut effects", "not acceptable")
  - Archives: `first30-corn-ship.html`, `field-wave-corn.html`
- **Built:**
  - The dot bursts into ONE horse plus hilly dot ground.
  - The camera follows: the ground scrolls at 420px/s, the horse rides the surface (pitch clamped ±0.45), and the camera follows the hills (`camOff`).
  - The land slopes away (`ramp`) and the ground drops (`gDrop`, IN).
  - The falling ground dots pop up as **3 corn cobs** traced from his reference frames (`CORN` polygons, 30px), staggered 0 / 0.14 / 0.26s.
- **Corn → rolling field + sun.**
  - The side cobs fall (FALLE) into the near field rows (`landMap`, ranked by x).
  - The field reveals outward from bottom-centre.
  - The centre cob collapses to a dot at the horizon and rises as the sun (SUNE (.12,.62,.22,1), 2.5s, clipped above HY 400).
- **Field geometry.**
  - Furrow rows with z = 0.86·1.033^j, 128 deep; dot r = 25/z^1.1.
  - Two sine waves, flowing toward camera at 0.9 idx/s.
  - **Hump:** a gaussian mound on lateral u = ±0.85 with a depth envelope (0 at the camera, peaking mid-depth). The left grows on SUNE, then hands over to a right mound.
  - NOT a flat x-axis tilt ("it needs to actually have a rise on the left side like an actual hump").

## 5. Invert + moon fall + ripple (f655–709)

- f655: everything goes maroon, the sun stays cream and falls (MFALL ease-in), and lands at f674 at y 905.
- 5 perspective ripple rings of cream dots (OUT expansion, fading).
- Ripples fade out as the wave rises.

## 6. Wave (f709–765)

- Footage: Pexels 35257509 (wave crashing on rocks). See footage-to-dots.md for the v2 readability rebuild.
- Revealed upward from the water line (`line` sweeps up on OUT 0.7s).
- REJECTED: the procedural noise wave ("needs to look more realistic, use an actual video of a wave").

## 7. Ship (f765–852)

- REJECTED: the brigantine Pexels clip ("looks really bad"). The Getty galleon reference was licensed, so it couldn't be used.
- Aidan generated a galleon in Higgsfield from `_research-ship-prompt.md` (`assets/galleon-src.mp4`).
- **v2:** tracked + enlarged crop. **v3:** a water texture layer (footage-to-dots.md).
- **Camera.** `SHIPCAM` push Z 1.25→1.04 with a pan, plus roll and heave. It cross-dissolves from the wave on the SAME 12px grid (`xf` lerp).

## 8. Mask ball + beats (f852–912)

- **Gather.** The whole maroon frame, ship inside, shrinks as a rounded rect, then a circle, into the first maroon ball (lands f852).
  - `S.mask = [w, h, radius]`: `destination-in`, with cream behind.
  - Use a short shutter (0.15) during the close, or it leaves stepped rings.
- **Beats** at f868 / 882 / 898: the row shifts left into n-wide centred slots and a new ball pops in top / bottom / top (BRAD 58, spacing 200).
  - Squash/stretch ellipses, a hop on the shifts, then a wave bob (11–16px, phase per ball).
- Three misreads before getting the mask right (see rules #29).

## 9. Spin → swirl → merge → freight train (f912–980)

- **f912.** The balls spin up from slow (cubic omega, OMS 26) and shrink while spinning.
  - REJECTED: a ring ("don't create that little circle").
- **Final build.**
  - Each ball becomes a metaball chain (6 circles, field-normalised).
  - The chains float out to a wide swirl, stretch into gooey arcs, spiral into a point on the LEFT (TR_M 560,560), and the merged blob swells into the maroon background.
  - Everything is done by **f935** (hard target).
- **Train video:** REJECTED ("barely see the train outline").
- **Train built as dots.**
  - A mask canvas (3000x460) of a 2-8-0 steam loco + tender + boxcar / hopper / tank / boxcar, sampled on a 12px grid.
  - Wheels are analytic with turning spokes.
  - Rail-joint jolt per car, and camera shake scaled by speed.
  - Smoke = SIGNAL glyph puffs swept back.
  - It brakes (BRK) to a stop exactly at **f980**.
- **f950–980.** The camera locks onto the cab window and pushes in (exp ×34, ease-in) while the train still rolls. The window's cream fills the frame.

## 10. Lightbulb (f977–1018)

- REJECTED: the Tesla coil with a tapping person.
- **Opening.** The seed dot appears at screen centre at f977 (`S.post`, over the closing zoom) and OPENS into the bulb: exp scale over 9 frames, solid until scale 0.22, then halftone.
- **Bulb.** A halftone glass shell + hot filament knot + flared neck + slotted base (BULB 960,531, BR0 330), with the base on the bottom edge of frame.
- **Taps.** EXACTLY two (BTAPS [986, 995]).
  - Tap 1 flashes on and decays off; tap 2 turns it on and it stays lit with a slight shimmer.
  - Each tap sends a burst of about 18 small dots from the hit point, gone in 0.4s.
- **Moth dot.** It zips with a short smear and leaves frame after tap 2.
- REJECTED: light rings ("organic, not these waves").

## 11. X-ray skeleton (f1018–1055)

- **Strobe.** 6 two-frame steps alternating maroon/cream ground with inverted dots (`skPhase`, no blur across steps via `gAt`), settling to maroon with cream dots.
- **Footage.** Aidan's Higgsfield clip (`skeleton-hf-src.mp4`, front-facing, waving on black) → 97-frame sprite at 300x300, ping-ponged for a seamless loop.
- **X-ray.** A blurred copy of the sprite (blur 16px) as a soft dot halo, plus a scan band sweeping down every 2.4s.
- **No square box:** feather the sprite tile edges. The SIGNAL corner code runs through it and turns cream on maroon.

## 12. Plane (f1055–1113)

- Hard cut to cream with one centre maroon dot.
- The dot fans out (f1060–1070) into a **bird's-eye** dot plane: nose up, tapered nose, swept wings, engine pods, tailplane. Bigger (Sx up to 20).
- Propulsion = SIGNAL code glyphs streaming from the 4 engines; plume length grows with thrust, and glyphs shrink and fade down the plume.
- f1092–1106: it punches forward, up out of frame, with vertical speed streaks.

## 13. DNA (f1113–1142)

- ONE strand, close (zoom 3.4), with a fast pull-back:
  - ZC bz(.35,0,.12,1) over about 16 frames to 0.95
  - it ends corner to corner, bottom-left to top-right (tilt about 1.08)
- **Anatomy.** Backbones = big beads (27·sc, mild depth size); base pairs = 5 small dots every other step. It spins up.
- **Zoom blur.** Each dot streaks from its position 0.9 frames earlier, capped at 4 radii (a 2.2-frame window smeared it into a blob).
- REJECTED: the multi-strand swarm, and the thin "bleh" helix.

## 14. Old TV (f1142–1298)

- **The set.** A rounded-rect screen (1140x855, r170) of fine raster dots on maroon, with tube flicker and a slow push.
- **Popeye** f1142–1154: 1936 Fleischer "Popeye the Sailor Meets Sindbad", archive.org, public domain, 2.5s from 4:19.5. Threshold curve (L-.52)/.42 on a 12px grid.
- **Channel glitches** f1154–1170 and f1228–1235: dot static snow, a rolling bar, torn picture slices jumping sideways.
- **Reporter** f1170–1228: a MAN (Pexels 6952251, suit, mics held up), muted.
- **Apollo 11** f1235–1298: NASA restored moonwalk on archive.org, about 49:02 in, the flag planting.

## 15. Network window (f1298–1360)

- A dotted vintage OS window draws on in 6f: striped title bar + close box.
- A rotating dot globe on the left (900 fibonacci points; noise continents = bigger dots) and a classic all-in-one computer on the right.
- The link grows one dot per 4 frames from f1312, then data pulses race along it. Slow push.

## 16. Chip (f1360–1420)

- A 3-ring dotted square frame around an OPEN centre.
- 52 traces (13 per side: straight, 45° jog, long straight, end pad) grow dot by dot at 55px/frame.
- f1395: exp ease-in dive (×16 over 12f) into the open core, which becomes the full maroon frame.

## 17. Voice dots (f1407–1540)

- Four cream dots are born at the centre inside the chip and pop out into a row (spacing 150, r 46).
- On Jillian's VO (f1420) they stretch UP AND DOWN into capsules, driven by `VOENV` (the baked 30fps RMS of the VO clip), each one a frame behind the last.

## 18. Ending (f1540–1652)

See identity-and-ending.md for the full spec. In order:

1. row
2. columns
3. explode into curling depth rays with travelling waves
4. endless outward stream + soft blur under the headline
5. swirl implode to the centre dot
6. the end card opens out of the dot

## 17b. Tools -> humans -> depth rays (v3, approved 11/6 "render this and save")

Insert `templates/v1-voiced/patches/tools_story.js` over vo-n2a "But it was never really about the tool." (47.55) and vo-n2b "It was always about what humans do with it." (49.45). Window INS_X 48.5, INS_G 3.9, INS_S 0.718 (engine A slowed; shift +1.1 s), then the insert keeps drawing past the window until engine cf T_EXP+16 and hands off to the ending.

1. **Pills talk, then wind up** (48.62 -> 48.98): they go quiet, shrink 62% and pull in; camera pushes 1.06.
2. **Burst on "tool"** (48.98, word at 49.03): each pill bursts into its tool with a BACK overshoot, inner dots first: spear (floating, swaying), wheel (already spinning), light bulb, laptop on a desk (cursor blinking). Row SX = [470, 820, 1160, 1550], ground GY 872 (not drawn).
3. **People form out of their tool on "humans"** (50.42, word 50.77), already reaching (SRC=tool):
   - hunter, side-on, cocks the spear above and BEHIND his head, free arm aims ahead, wide stance
   - woman in a dress rolls the wheel ~28 px
   - a side-on person holds the bulb up and forward at arm's length; it lights with a 0.4 s dot burst, other arm swings out wide
   - a typist sits on a dotted chair left of the desk, hands on the keys, code types onto the screen
4. **"do with it" / "Every week"** (51.0 -> 52.6): actions land (T_GRAB 51.0), then a slow ease-in draw toward the centre (8% over 19 frames from T_EXP-16).
5. **Explode into the ending's depth rays** (engine T_EXP, root ~52.8 -> 53.3): every scene dot is paired to a ray dot (upper half of the scene -> upper rays, lower -> lower, by x rank, many-to-one so every ray dot is covered), lerps on the ray's own E_EXP stagger, and is drawn as `S.ddots [x, y, r, 1-e]` so it goes sharp -> depth of field as it flies. At T_EXP+16 the insert returns false and `ending()` draws the same dots: no pop (frame-to-frame RMSE flat across the handoff). The engine exports `window.__END = { T_EXP, ENC, ENJ, ray, e, soft }` (patch in build.py).

Rejected on the way: r14 "dots become tools" (looked terrible, broke the dot rules); ground line under the people; people rising feet first from the ground; front-facing kid under the bulb (lamppost); standing typist (merged with the monitor); spear over the head; swirl back to the four pills; pan camera (empty frames); the 15-variant pass (01-15 on Drive) mostly read the same.
