# 12 · Sanji Style — design spec

Distilled from Sanji Nai-Chien, *"How I Make $880/Day with AI Motion Design (Claude Motion)"* (YouTube `D5qpBbEWTxo`, 19:55, **25 fps native**). Analysis: per-frame scene scoring across all 29,872 frames (111 hard cuts total; everything else is a designed transition), a 1-per-2s map of the whole video, and **every frame at 25fps** of the cold open (0:00-0:16, 400 frames) plus full-rate passes on every major graphic (chapter cards, glass tree, curve card, math card, VS, split panel, captions, slide-up plate, halftone iris). Curated stills + full-rate frame strips are in `references/` (`references/framestrips/` = the 25fps sheets, frame numbers burned in).

**The feeling:** premium SaaS launch film. Calm, expensive, very legible. Nothing pops hard and nothing moves linearly. Everything **resolves out of blur**. Lots of empty space; one idea per frame.

---

## 1. Three canvases (pick one per card, never mix inside a card) + SYSTEM (section 10)

| Canvas | Ground | Type | Where it showed up |
|---|---|---|---|
| **PAPER** | pure white `--paper` | near-black `--ink`, arrives `--ink-pre` light grey | cold open sentence ("People are making over") |
| **EMBER** | true black `--void` + orange light pooling in from corners (`--ember-corners`), optional blue dot-halftone grid | warm white; hot glow letters that cool down | `$500` particles, "selling motion design", Claude serif wordmark, chips row, the chatbot box, code stream |
| **COBALT** | flat electric blue `--cobalt #2042EE` + slow sonar rings, or `--cobalt-wash` (cyan blobs + faint 64px grid) for chapter cards | white; dormant items fade to `--dormant #A6A3B4` | every explainer diagram: tiles, glass tree, curve card, math card, VS, split panel, chapter strips |

Plus **NATURE**: a real landscape photo (`assets/nature/*.jpg`) under a tinted liquid-glass pill or plate. The pill takes the landscape's own color (olive over grass) because it's translucent.

## 2. Typography

- **Inter Tight 800, ALL CAPS, tracking -0.035em, line-height ~0.9.** Section titles, pill labels, kinetic captions, card titles. Two-line titles stack tight ("THE / STORY").
- **Inter 600/700 sentence case, tracking -0.012em.** Text inside glass cards ("Nothing moves linearly", "The math", "Client paid").
- **JetBrains Mono** for file names (`SKILL.md`), code, tiny axis ticks.
- **Source Serif 4 600** for the single editorial serif wordmark moment, on EMBER only.
- Numerals are Inter/Inter Tight 800, white, with a soft halo on the hero number (`text-shadow` or a radial glow div behind, NOT gradient-clip when more than one number is on screen).
- No em dashes in any placeholder copy.

## 3. Color rules

- COBALT cards: white + glass + `--dormant` only. Accents come from **light** (active glow), not from a second hue. The one exception: a small ember/coral asterisk-spark accent icon (the `<1 DAY / $20` split panel).
- EMBER cards: `--ember` is the only accent. Glow type uses `--volt` blue on black for the "motion design" style letter glow, ember for the code stream and chips. Never both blue and orange glow on the same card.
- `--alert` red exists only as the tiny "no" dot on VS tags.

## 4. Liquid glass (COBALT)

Measured from the tree / curve / math frames:

- Fill: white sheen top-left to deep cobalt pool bottom-right (`--glass-fill`). Rim: 1.5px `--glass-rim` (brighter on top edge reads naturally from the gradient). Shadow: `--glass-shadow` (soft deep-blue drop + inner top highlight + inner bottom pool).
- **Squircle tiles** radius ~46px at 380px; big cards ~56px; pills fully round.
- **Icon badge** = glass circle (`--badge-fill`, 1.5px `--badge-rim`) holding a solid white glyph.
- **ACTIVE vs DORMANT (focus shift):** build each glass element as `.g > .fill + .lit + .in`. `.lit` carries `--glass-fill-active` + `--glass-shadow-active` and is tweened by opacity (you cannot tween gradients). When the next item lights, the previous one: `.lit` opacity to 0, text color to `--dormant`, badge opacity 0.6, connectors to 0.45 opacity, scale back to 1. Active item scales to ~1.04.
- Connectors: 3px white lines / beziers, drawn on with stroke-dashoffset, white node dots (7-9px) with a faint 16-20px halo at every joint.
- Sonar rings behind the system: 4-5 concentric 1800px circles, 2px `rgba(255,255,255,.07)` border, each one scaling 0.25 to 1.05 while fading in then out, ~4.2s period, staggered. **Repeats must be finite and must end before the card's last `tl.set({}, {}, END)`**: per ring, `if (st + PER > END) return;` then `repeat: Math.floor((END - st) / PER) - 1` (otherwise the card's duration balloons; see `t1-glass-tree.html`).
- Don't use `backdrop-filter` over flat blue (no visual gain, costs render time). Only use it over NATURE photos or footage.

## 5. EMBER details

- Corner light: `--ember-corners` (top-right + bottom-left pools). It breathes (opacity 0.55 to 1 over the card).
- Dark chat UI: `--chat-fill`, 1.5px `--chat-rim` (the rim catches the orange), radius 44px. Toolbar glyphs are thin white strokes; the **send button** is a solid `--ember` rounded square.
- **Comet streak**: a long thin elongated gradient (transparent to ember to white-hot tip) rotated ~33°, blurred 9px, tip touching the top rim of the box.
- **Glow chips** (Create / Write / Learn row): dark pills with `--chip-glow` when they arrive, cooling to plain `--chip-rim` after ~0.6s.
- **Hot to cool** is the EMBER signature: things arrive glowing (letters, code, chips) and settle. Code lines arrive `--code-hot` with a heavy orange text-shadow, then cool to syntax colors (`--code-tag`, `--code-attr`, `--code-str`, `--code-text`) over ~0.5s.
- Dot halftone grid (`--dot-grid-blue`) with a dark vignette mask, visible only at the frame edges, behind glow-type cards.
- Grain overlay (`--grain`, overlay blend, ~0.6 opacity) on EMBER only.

## 6. Motion grammar (measured at 25fps)

| Move | Frames | Recipe |
|---|---|---|
| **Word resolve** (THE signature) | 5 (0.20s) | `fromTo(w, {autoAlpha:0, filter:"blur(12px)", color:PRE, y:10}, {autoAlpha:1, filter:"blur(0px)", color:INK, y:0, duration:.22, ease:"expo.out"})`, cadence ~0.24s/word (speech paced) |
| Line re-center | ongoing | single centered line slides left as words add. Shift line by `(fullWidth - rightEdgeOfWordK)/2` with function-based x values (lazy, evaluated after fonts). See `t1-paper-resolve.html` |
| **Hero dolly** | 7 + 4 | first word enters at 3.1x, light grey, blur 10px, drifts to 2.6x while sharpening + inking (0.3s sine.out), then the camera pulls back to 1x in 0.16s `power3.in` |
| Letter type | ~1.5 frames/char | each char 0.16-0.28s blur 4-8px to 0, from tinted/dim to settled. Chars `display:none` until typed so a caret can ride the end |
| Glow cool-down | 10-14 (0.5s) | type arrives in glow color with big text-shadow, tweens to white / syntax colors |
| **Glass pop** | 8-10 (0.38s) | `fromTo(el,{autoAlpha:0, scale:.9, filter:"blur(10px)"},{autoAlpha:1, scale:1, filter:"blur(0px)", duration:.38, ease:"back.out(1.25)"})`. Overshoot is a whisper, never a bounce |
| Content blur-in | 0.3s | `{autoAlpha:0, y:8, filter:"blur(8px)"}` to sharp, `expo.out`, stagger 0.06-0.08 |
| Focus shift | 0.35s | see §4 |
| Count-up | 0.6-1.0s | numbers tick with `power2.out`, final value lands with a soft glow bloom behind it. Use `fromTo` on a proxy object (the `.to` trap leaves the number stuck) |
| **Chapter whip** | 5 (0.20s) | five numbered hairline columns; the strip slides left ~1/5 frame width with horizontal smear (blur + scaleX 1.04) leaving column N framed by two hairlines; dashed baseline draws L to R |
| **Plate slide-up** | 7 (0.28s) | white rounded plate (+ the blue squircle-grid ground) rises from below the frame with vertical motion blur (`filter: blur(0 14px)` is not valid: fake it with `blur(10px)` + `scaleY(1.08)` during the move), `expo.out`, then keeps drifting up ~20px + scale 1.02 over the hold |
| **Halftone iris** | 16 (0.64s) | amber dot-matrix disc grows from a point (code orange glow), bloom ring of dots at its edge, footage visible inside the clear center |
| Dither wipe | ~10 frames | pixel/dither blue band sweeps across a photo, revealing it from a dithered blue state |
| Exit | 0.6x entry | dissolve: opacity to 0 + blur 6-10px, or grey back to `--ink-pre`. Exits never bounce |
| Ambient | whole card | rings pulse, corner light breathes, plates drift. The TEXT layer never scales during holds (keeps type sharp) |

Easing vocabulary: `expo.out` (resolves), `back.out(1.25)` (glass pops only), `power3.inOut` / `power2.inOut` (camera, connectors), `sine.inOut` (ambient). Never `linear` on anything visible except ticker/drift.

## 7. What NOT to do

- No hard pops, no `back.out` above 1.4, no elastic, no shake.
- No neon multi-color gradients. Cobalt cards get their richness from glass light, not hue.
- No gradient-clipped text when 2+ numbers share a frame (renders as slabs). Single hero title gradient is OK ("Two Options" style white-to-sky).
- No `will-change` on clip-text elements.
- No `display:flex` on mixed text + `<em>` containers.
- No unseeded randomness: particles / dither / halftone use a seeded LCG.
- No network images: nature photos are local in `assets/nature/` (Pexels license, see CREDITS.md).
- Don't recreate anyone's brand mark. The spark glyph is a generic 8-ray asterisk; product names in slots are placeholders.

## 8. Card contract specifics for this style

- Composition ids are dash-prefixed `sanji-<file-stem>`; CSS is scoped under `#sanji-...`; scripts query from `ROOT`, wrapped in an IIFE. Self-scoping so inline assembly needs no rewriting.
- tier1 = opaque canvas. tier2 = transparent everywhere except the element (verify over the footage-gray backdrop). Transitions (`cards/transitions/`) render a demo "scene A / scene B" with stand-in plates; real footage replaces them at assembly.
- Every timeline ends with `tl.set({}, {}, END)` and has a measurable finite duration.
- Gold references: `cards/tier1/t1-paper-resolve.html` (PAPER word resolve + re-center + dolly), `cards/tier1/t1-ember-chatbox.html` (EMBER chat UI, typing, pull-back, send press), `cards/tier1/t1-glass-tree.html` (COBALT glass, rings, connectors, focus shift).

## 9. Pre-flight (run before calling a card done)

1. Seek screenshots at 4+ moments read as the reference frame for that move.
2. Text never clips; longest slot value at maxChars still fits.
3. Duration is finite and sensible (`tl.duration()` printed).
4. No console errors besides the favicon 404.
5. No em dashes in slot copy.

---

## 10. SYSTEM canvas (blue-screen terminal + ASCII render)

Added 11/3 from the BUCK x Isle of Any blue-screen campaign ("An update is required...", "The financial system is out of date.", "System Update"). BUCK built it by feeding grayscale animation (cel + 3D renders) through a custom image-to-glyph mapping + particle sim in Houdini / C4D / Cavalry / AE. Analysis: every frame at native 23.976fps of the 30s spot (720 frames, `references/system/framestrips/`), 4fps overviews of the 49s and 42s cuts, full-res crops for type + glyph metrics. Curated stills: `references/system/s01-s34`. We take the motion language, never their brand: no coin logos, no wordmark, no token tickers; coin faces use a slot glyph.

**The feeling:** a real crash that turns into a party. It opens as a genuine blue screen (dead, long hold, then a log flood), then the code itself comes alive. Everything on screen is a character on one grid. Flat, bright, irreverent, technical.

### Ground + type
- Ground: flat `--sys-blue #0F18FB` (97% of pixels in end frames). No gradients, no vignette. Faint vertical scan streaks (`--sys-scan` + a few seeded 1-3px bright columns) fade up just before the log floods.
- Type: `--font-term` (IBM Plex Mono 600, closest open match to the spot's wide mono), `--term-size` 30px, 19.6px advance, 36px line pitch, white `--sys-ink` with a soft phosphor bloom (`--sys-bloom` on DOM, `filter: drop-shadow(0 0 4-5px rgba(225,232,255,.45-.5))` on canvases).
- **Inverse-video chip** = the accent: white rect, blue text (`--sys-chip-bg/ink`). Used for the one word that matters ("Activating: **295+ Assets**", "System > **Updated**"). It is the only "highlight" in this canvas; never add a second color.
- Layout is left-anchored terminal (x=46 for logs) or a single line placed just right of center (x~1000, y~522) for statements. Lists hang under the statement, offset right.

### The ASCII engine (`lib/ascii-engine.js`)
Every image is a grayscale paint mapped to a density ramp `--ascii-ramp` (" .,:-~>*+cC%#$") on a fixed glyph grid (15x22 default, 12x18 for detailed objects). Cards paint white-on-black shapes with normal canvas 2D (ellipses, gradients, text, Lucide paths, photos) and the engine converts to glyphs, adds text overrides, inverse cells and seeded per-frame flicker (`flicker` 0.08-0.3: the field shimmers like the ref). Cards carry an inlined copy between `/* @ascii-engine:start */` markers; edit `lib/ascii-engine.js` then run `node scripts/style-library/sync-ascii-engine.mjs`. Helpers: `field, paint, fn, text, textAt, render, scramble, noiseStr, coin, dot, word, icon, fbm, hash, lcg, frame`.

### Motion grammar (measured at 24fps)
| Move | Frames | Recipe |
|---|---|---|
| **Dead-screen hold** | 4 empty + ~30 held | open on pure blue, 4 frames; first line, then a long hold before anything else moves. Sells the "real crash" |
| **Scramble resolve** (THE text signature) | 3 | resolved prefix + 2-3 noise glyphs riding the edge, noise re-rolls every frame (`SYS.scramble`). No blur, no fade: glyphs, not opacity |
| **Log flood** | 1-2 lines/frame | lines append whole, terminal scrolls 1 row per line, right column `[ OK ]` / `[ RUN ]` at x~1700 |
| **Text lets go** | ~36 | each glyph releases on a ragged front, rides an fbm flow field, decays `letter > : > .`, while advected glyph clouds rise (light end of the ramp) |
| **Glyph object** | continuous | 3D-ish objects (coins, globes, hands) are luminance paints: bright rim, mid face, lighter diagonal bands, bright glyph. Spins read through the edge-on sliver |
| **Noise flash** | 2 | full-screen dense random glyphs for exactly 2 frames between scenes |
| **Chip scramble** | ~11 | starts as one lone white cell, grows left to right as the word scrambles in |
| **Chip handoff** | ~10 | label drops its chip and gains ":", value scrambles in inside a new chip after it |
| **Chip flicker** | 12 | inverse toggles on/off every 2 frames, then holds on |
| **Ticker columns** | 2 rows/frame | `>NAME` columns type down the sides, staggered 3 rows per column |
| **Tag wall** | ~30 | inverse chips (one-word tags) fill the frame row by row, jitter, then part from the center to reveal the next scene |
| **Flow tunnel** | continuous | horizontal streamlines of glyphs bending around an empty ellipse; labels ride the stream; an object travels the tunnel |
| **Doodles** | continuous | 2-6 glyph clusters scattered in the empty space, stepping on the grid every 3-6 frames |
| **List type** | 1 item / 0.25s | each item scrambles in over 2 frames |
| **Cursor outro** | 0.5s blink | wordmark + `_` cursor blinking on the beat, 3s hold |
| Macroblock glitch | 2-4 | rectangular blocks of inverse word fragments at mixed sizes punch across the frame (transition) |

Timing: scene changes sit on a 0.5s grid (2s bars). The ASCII layer ticks on frames (24fps hashes via `SYS.frame`) so it feels stepped, while camera / chip moves stay smooth.

### SYSTEM do / don't
- DO keep exactly one canvas color (blue) + one ink (white). Brightness = glyph density + alpha, never a new hue.
- DO let things be glyphs: objects, transitions, particles, maps, photos.
- DON'T blur type on this canvas (scramble replaces blur-resolve). Bloom only.
- DON'T use liquid glass, rounded cards or ember light here; the only box is the inverse chip (square corners) or box-drawing characters.
- DON'T copy their brand: no coin logos, no exchange names, no their wordmark, no ticker symbols of real tokens.

---

## 11. TEXT PRESET "uppit-reveal" (default for all text)

Saved 11/3 at Aidan's request from uppitai.com ("look how smooth they are, apply this to pretty much all the text"). Lifted straight from the site's source (`RevealText`, `.rt-word` / `.reveal`), then rebuilt as timeline tweens so it renders deterministically. Source: `lib/text-preset.js`; cards carry an inlined copy between `/* @text-preset:start */` markers (restamp with `node scripts/style-library/sync-text-preset.mjs`). Reference card: `cards/tier1/t1-text-preset.html`.

| Piece | Recipe |
|---|---|
| **Word reveal** `TXT.reveal(tl, el, at)` | every word: opacity 0 to 1, `blur(6px)` to 0, `translateY(0.3em)` to 0, **0.7s**, `cubic-bezier(.23,1,.32,1)`, **40ms** stagger |
| Block reveal `TXT.block(tl, el, at)` | whole element (pill, chip, icon, button, card): opacity + 18px rise, 0.7s, same curve, 80ms stagger between blocks |
| Exit `TXT.exit` / `TXT.blockExit` | words: fade + 6px blur + 0.18em lift, 0.42s, 20ms stagger, power2.in; blocks: fade + 10px lift |

**Why it's smooth:** the long quint-out tail (most of the move happens in the first 0.2s, the last 0.5s is a soft settle) and the tiny 40ms stagger, so a 3-line headline is one continuous wave, never a word-by-word pop.

**Rules**
- This replaces the older 0.22s word resolve (section 6) as the default for any DOM text entrance: headlines, sub lines, labels, list items, captions, numbers that don't count.
- Chain beats off the return value: `const t = TXT.reveal(tl, head, 0.3); TXT.reveal(tl, sub, t - 0.45)` (overlap the tail, don't wait for it).
- Keep the signature moves on top of it where a card is *about* that move: hero dolly, letter typing in chat boxes, count-ups, and the SYSTEM canvas scramble (SYSTEM DOM text uses the preset with `blur: 0` + scramble, or the scramble alone on canvas glyphs).
- Words become `inline-block`, so gradient-clip text must be clipped per word (or skip the preset on that element). Don't put `will-change` on clip text.
- Exits happen at 0.6x the entry duration, never bounce.

---

## 12. CAMERA (screen-cam)

Camera moves over screenshots and screen recordings live in their own bible: **`CAMERA.md`**, measured on every frame of a 30fps screen-recording tutorial. Code: `lib/camera.js` (`CAM.rig(stage)` then `push / pull / pan / crash / creep / punch`), restamped with `node scripts/style-library/sync-camera.mjs [files]`. Reference card: `cards/tier1/t1-camera-screen.html`. Short version: punch in on one thing in 0.52s on `cubic-bezier(.42,.16,.2,.96)` with motion blur at peak speed, hold 0.8 to 1.5s while creeping ~1.1%/s, punch back out.

