# Identity + ending

## Humanly Possible palette and type

- **Colours:**
  - Ground maroon / oxblood `#4B1526` (OX)
  - Cream `#FFF0E6` (CR)
  - Gold accent `#FFC145`
  - Burn gradient stops: `#FFC145 0`, `#FF8A4C .28`, `#7A1E1E .54`, `#4B1526 .76`, `#2C0B16 1`
- **The reference uses black and white; we use maroon and cream.** The opening is a maroon dot on cream. A scale-through flips to cream-on-maroon, and inverts flip back.
- **Headline type:** Bricolage Grotesque 800, loaded via Google Fonts `<link>` + a hidden `.fontwarm` span. It's drawn on the `out` canvas after the blur, so it stays crisp.
- **Logo:** `assets/logo/hp-horizontal-cream.svg` is the white horizontal lockup with its fill set to `#FFF0E6`. The library brand source is `style-library/13-humanly-possible` / the Executive Assistant brand spec.

## Uppit text reveal (Aidan's default text animation)

- Per word: blur 6→0px, rise 0.3em, opacity 0→1.
- Ease cubic-bezier(.23,1,.32,1), 0.7s (21 frames).
- About 40ms stagger (1.2 frames).
- Canvas version: `out.filter = blur(${6*(1-u)}px)`, `fillText(w, x, y + 0.3*size*(1-u))`.
- Exit is a quick IN fade over 8 frames as the rays implode.

## SIGNAL corner code (from the HP v3 SIGNAL kit; Aidan: "perfect in the intro")

- Mono glyphs (Menlo, 14x20 cells):
  - ramp `.,:-~>*+cC%#$`
  - noise `#$%&*+-/<=>?@[]^_{|}~0123456789ABCDEFxz`
- They bloom in from the 4 corners along an organic noise front, flicker on the frame clock, and recede.
- **`SG_PULSES`** = [time, reach, rise, fall], set on:
  - the music's tense hits
  - our separations (splits, explosion = biggest)
  - the ball beats
  - the bulb taps
  - the skeleton strobe and music hits
- Each corner has its own strength and a few frames of lag, so the corners never mirror each other.
- A low "breath" during tense builds and through the X-ray.
- Glyphs turn cream when the ground is maroon (`sgOnOx`).
- **Only in the corners, and brief.** It's a tension accent. Never sprinkle glyphs on objects.

## Ending (final v1, Studio frames)

1. **f1420–1540: VO pills.** Four capsules stretch up and down with Jillian's voice.
2. **f1540 row.** E_ROW bz(.45,0,.2,1) over 8f:
   - the 4 pills spread into a row of 10 dots (x from pill k → `colX(c)=96+c*192`)
   - r 46→20
   - a wave bob that peaks mid-move
3. **f1545 columns.** E_COL bz(.4,0,.55,1) over 9f, starting before the row settles:
   - each dot shoots up AND down into an 80-dot column
   - r → 3.4
   - the columns ripple sideways as they grow (`26*sin(j*.17 - t*.55 + c*.7)`)
4. **f1550 explode.** E_EXP bz(.25,.55,.2,1) over 13f, staggered outer-first by up to 3f:
   - the top half of column c → upper ray c, the bottom half → lower ray c (same side; mirroring them crossed the frame into a V)
   - 20 rays, each curling like a tentacle
   - travelling waves along each ray (amplitude grows with distance)
   - dots grow with distance (depth: r 1.3 → 16)
   - ray origins sit on an ellipse (640 x 120) so the centre pocket stays clear for the text
5. **f1556+ endless stream.** Dots flow outward along the rays forever:
   - `flow = 0.42*(ft - 9 + 9e^{-ft/9})` eases in, `k_eff = (k+flow) mod 40`, wrapping back in at the centre
   - the rays extend 1.45× off frame, with depth size scaled so the big dots stay on screen
   - path smear along the stream only, 1.25 frames, so they read as dashes; a smear across the wrap is skipped
   - `S.soft` 2.2px blur on the dot layer, eased in and out
6. **f1566 headline** "New stories every single week." 84px, uppit reveal; "every single week." in gold, the rest cream. NOT FINAL (Aidan isn't set on it).
7. **f1640 implode.** E_IMP, staggered:
   - every dot swirls (±1.1 rad, opposite per half) into the centre and shrinks with `sqrt(imp)`
   - the headline exits
   - a centre dot appears at f1650 with a wobble
8. **f1652 end card.**
   - a circular reveal from the dot (OUT 14f, R to 2300)
   - a burn radial gradient from the bottom-left (gold → orange → red → maroon), drifting 220px over 3s
   - the cream horizontal HP lockup, 620px wide, centred, uppit-ish reveal
   - 16% grain
9. **f1666** Jillian: "and we'd love to hear where it's taking you." Music fades out 57.6–59s. END = 59s (f1770).

## Ending history (what each round fixed)

- **v1:** 48 slowly turning radiating rays with "New stories every week."
- **v2** (Aidan's ask): capsule pills, a row of linear dots, columns that "shoot up and create this grid", then "explodes", "lines with the depth", text in the middle, wrap up the audio, logo + text centred, smallish, with the noise gradient.
- **v3** ("quicker, choppy, easy ease, motion blur, more waves"):
  - one continuous path per dot (`endDot`) with overlapping eases
  - path smears
  - waves at every stage
  - fixed: no blur after f912
- **v4** ("extend those dots out more and then blur them so it looks like they are ever going"): the endless stream, the extension and the soft blur.
