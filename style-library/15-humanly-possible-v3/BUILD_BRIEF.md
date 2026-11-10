# HP V3 "Field Glass" · builder brief

You're porting a group of cards from `style-library/12-sanji` into `style-library/15-humanly-possible-v3`. Each Sanji card becomes a V3 card that does the **same job** (same purpose, same beat structure, same slots where they still make sense) in the **V3 language**. It must look like Humanly Possible, warm, outdoor and human, not like Sanji in new colors. A previous attempt that only recolored Sanji was rejected ("that did not work").

Your group (list of Sanji source, new stem, id, category, V3 canvas) is in `_meta/groups.json` under your group key.

## Read first (in this order)

1. `DESIGN.md` (whole file). The laws in section 0 are non-negotiable.
2. `tokens.css` (vars + FIELD GLASS utility classes), `lib/text-preset.js`, `lib/field-glass.js` (and `lib/ascii-engine.js` for SIGNAL groups).
3. The four gold cards, all the way through: `cards/instructional/t1-toggle-settings.html`, `cards/text/t1-glass-title.html`, `cards/motion/t1-window-stat.html`, `cards/transition/tr-burn-dither.html`. Copy their structure: head, scoped CSS, slots, IIFE, lib markers, timeline shape.
4. Each Sanji source card in your group, for what it does and when. Do NOT copy its look (cobalt, white rims, caps titles, sonar rings, back.out pops, badge circles, glow text).
5. `style-library/12-sanji/DESIGN.md` section 6 (motion grammar) and section 10 if your group is SIGNAL.

Never edit anything in 12-sanji, 13-humanly-possible or 14-humanly-possible-v2.

## Aidan's feedback so far (11/3)

- "You're on the right path."
- He's a **huge fan of the window stat**: the big "6" with the sunlit photo showing through the type, leading into the text beside it. Keep that move and use it as a library-wide motif. **Window type** (`background-clip:text` with the same photo pinned to the ground geometry, gold-warmed, wiped clear through frost) is the hero treatment for big numbers and single hero words. Use it in every card of yours where a big number or one hero word is the point. Don't force it into cards where it doesn't fit.
- **No notches or tabs on glass.** Panes are plain rounded rectangles (42 hero, 28 cards and rows, 14 chips). No logo-shaped cut-outs.
- From the earlier HP feedback, still banned: accent stripes on box edges, outline/keyline boxes, flat offset drop shadows, anything that reads template or AI. Depth comes from glass, light, parallax and real photography.

## Not everything is nature (Aidan 11/3)

Aidan: "not everything needs to have the nature background, we can change some things up, I just want some of them to have that." So aim for **about half your group on nature photos** and the rest on the brand grounds in DESIGN.md section 1b: **burn** (`.fg-burn`, the gradient as moving sunlight), **wash** (`.fg-wash` + blurred palette blobs, glass looks great over it), **flat** oxblood/brick/deep (type-only, no glass) and **cream** (light mode, no glass). Pick what serves the card: nature for warm human beats and hero moments, wash for diagrams and UI, flat or cream for pure type. The canvas column below says how the Sanji look translates, and the ground choice is yours within that (e.g. a FIELD diagram can sit on a wash, a DUSK card can sit on a dimmed burn). SIGNAL cards can render the burn or the wash as glyphs instead of a photo.

## Canvas mapping (Sanji to V3)

| Sanji | V3 | Ground | Glass + type |
|---|---|---|---|
| COBALT, NATURE | **FIELD** | graded nature photo (`assets/nature`), sunrise in, wind sway, dapple on panes | smoked oxblood glass (`.fg-glass`), cream type, one orange, one gold |
| PAPER | **DAYLIGHT** | a bright, high-key photo (grass-sunset, field-sunset, misty-hills sky, wheat-dusk, mesa-dusk sky), lifted with a cream wash so it's airy | **cream frost**: override `.fg-tint` to `linear-gradient(158deg, rgba(255,240,230,.62), rgba(255,240,230,.42))` + `brightness(1.05)` on the backdrop. Ink = oxblood `#4B1526`, secondary oxblood 70%. Orange/gold only as SHAPES on cream (contrast rules), never text |
| EMBER | **DUSK** | photo almost fully in night: run the sunrise only to `--sr` ~45-60 so just the burn corner glows; flare stays warm; grain on | dark smoked glass (tint deeper, brightness .7). "Hot to cool" becomes **warm to settled**: type arrives gold or orange-tinted and settles to cream over ~0.5s (color tween, NO text-shadow). The EMBER serif moment becomes Bricolage 600 at opsz 12 |
| SYSTEM | **SIGNAL** | `--hp-deep` ground; the image is a **nature photo rendered as glyphs** with `lib/ascii-engine.js` (`F.paint` draws the graded photo + shapes in grayscale). After `F.render`, tint the glyphs with the burn: `ctx.globalCompositeOperation = "source-atop"`, fill `var(--burn)`-equivalent radial (gold at 8%/100% to cream-oxblood at the far corner), reset to `source-over` | mono = `ui-monospace, Menlo` 500-600 cream (per HP spec), scramble resolve stays (no blur on SIGNAL type), the inverse chip = cream cell with oxblood text, square-ish (radius 4 max). One color family = the burn. No blue anywhere, no coin/exchange iconography |
| overlay (tier-2) | **FIELD over footage** | transparent root, the real video is the ground | small glass panes over the footage (backdrop-filter works over the video at assembly). Verify over `assets/demo/*.jpg` |

Each card commits to ONE V3 canvas. Use the one in your manifest. Transitions may go between two (e.g. `tr-daylight-to-dusk`).

## Card contract (exactly like the gold cards)

- File: `cards/<category>/<stem>.html`, category from your manifest (text, popup, motion, instructional, transition). tier-2 cards go in `cards/popup` unless the manifest says text/instructional, then they go there. Root `<div id="hp3-<stem>" data-composition-id="hp3-<stem>" data-start="0" data-width="1920" data-height="1080">`, CSS scoped under `#hp3-<stem>`.
- `<link rel="stylesheet" href="../../tokens.css" />`, GSAP 3.14.2 from the same jsdelivr URL as the gold cards.
- Script: `window.__timelines = window.__timelines || {};` then an IIFE that starts with the lib markers, exactly:
  ```
  /* @text-preset:start */ /* @text-preset:end */
  /* @field-glass:start */ /* @field-glass:end */
  /* @ascii-engine:start */ /* @ascii-engine:end */   (SIGNAL cards only)
  ```
  then run `node scripts/style-library/sync-hp3-libs.mjs <your card paths>` to stamp them in. Never hand-edit inside the markers.
- One paused timeline, `window.__timelines["hp3-<stem>"] = tl`, ending with `tl.set({}, {}, END)`, finite END (most tier-1 cards 4-8s, tier-2 3-6s, transitions 1.5-3s).
- Deterministic: no `Math.random`, no `Date.now`, no rAF, no network images. Canvases draw from the timeline clock (`P.t` proxy + `onUpdate`) and redraw on image load (see tr-burn-dither).
- Photo slot: hidden `<span class="slot-photo" data-slot="photo">stem</span>`, src = `"../../assets/nature/" + stem + ".jpg"`. Use the photos that exist (see the DESIGN.md section 1 casting notes, `ls assets/nature`). Vary photos across your group, don't use one photo for everything.
- Layout that depends on glyph widths: measure in a `place()` function, call it now and on `document.fonts.ready`.
- Comment header like the gold cards: what it is, the beat, slots with maxChars.
- Copy: HP voice, concrete real-people outcomes (dog groomer Dana, a teacher, a nurse, a contractor), plain words, sentence case, no hype words, **no em dashes**. Don't keep Sanji's motion-design-tutorial copy.
- Icons: Lucide-style line icons, stroke `#FFF0E6` width 2, in 72px rounded-square wells (cream 10%). No glass circles.

## Motion rules

- Text: `TXT.reveal` for every DOM text entrance, `TXT.block` for elements. Exceptions only where the card's signature IS the text move (typing, scramble, count-up, letter cascade, word morph), and even then the surrounding text uses the preset.
- Arrivals: `FG.POP`. Text/glass: `FG.SETTLE`. Light, wind, camera: `FG.GLIDE`. Exits: `power2.in`, 0.6x entry. **Never `back.out`, elastic, bounce** (lint fails it). Sanji's overshoot pops become POP with a 2-4% squash at most.
- Glass enters with `FG.condense` (origin = burn corner, or the nearest corner for right-side panes), exits with `FG.clear`. Never scale-pop glass.
- Emphasis: `FG.beat` (lub-dub). Replaces every Sanji bloom ring, pulse ring, sonar, ring ripple. (`tr-ring-ripple` becomes ripples in water or a heartbeat ripple, your call, but no generic UI rings.)
- Focus shift (active vs dormant): active row gets `--row-lit` wash + cream text, dormant goes to `--hp-cream-dim`, icon wells .55. Same timing as Sanji (0.35s).
- Connectors/diagrams: lines are cream 60% 2.5px, drawn with stroke-dashoffset, `FG.GLIDE`. Make them feel grown, slightly organic curves (like stems), never ruler-straight circuit lines. Joints get small cream dots, no halos.
- Ambient: `FG.sway` on photo grounds (except under window type, which needs a still ground), `FG.dapple` on panes up to half the frame, one sun glint (`.fg-sheen`) per hold. The text layer never scales during holds.
- **Never put `filter` on a `.fg-glass` or any of its ancestors** (kills the backdrop blur). Blur words and photos freely.
- Glass only over a photo, footage, the burn or the wash, never over a flat fill or cream.

## Color discipline (check every settled frame)

- Max ONE orange and ONE gold per frame. Orange = the single accent (payoff toggle, one word, one bar). Gold = the single key number or word. Window type counts as the gold.
- No blues, no greens, no purples in UI. Dataviz series: cream at 3 opacities (1, .6, .32) + the one orange highlight. Bars and charts are glass or cream fills, never multi-hue.
- Contrast: never orange or gold TEXT on cream (DAYLIGHT); there they're shapes only.

## Verify every card (the PNG you Read is the gate)

1. `node scripts/style-library/lint-hp-tells.mjs <card>` clean. `node scripts/style-library/sync-hp3-libs.mjs --check <card>` clean.
2. `node scripts/style-library/_hp3-shot.mjs <card> <scratch>/<stem> t1,t2,t3,t4[,..] [assets/demo/groom_6131725.jpg for tier-2]`: run it from the workspace root (it needs `playwright` from the workspace node_modules). Pick 4-6 times: mid-sunrise or mid-condense, content settled, the payoff, the hold. **Read the sheet.** It prints the timeline duration (must be finite and match your END) and console errors (must be none).
3. Fix and reshoot until: text never clips at max slot length, nothing overlaps, at most one orange + one gold, the frame reads warm and outdoor, not like a UI kit.
4. Poster: write `preview/<stem>.jpg` (960x540, quality 84) from the hero moment: `magick <png> -resize 960x540 -quality 84 style-library/15-humanly-possible-v3/preview/<stem>.jpg`.
5. Put scratch files in your scratchpad (or `/private/tmp/...`), never inside the library. Don't leave `_*.html` files in `cards/`.

## Hand back

- Write `_meta/<GROUP>.json`: an array of card entries, same shape as the cards in `style.json` (id `humanly-possible-v3.<tier>.<purpose>.<treatment>`, tier, purpose, treatment, category, canvas, file, slots with maxChars, duration {min,max}, notes, poster). Keep purposes close to the Sanji card's purpose.
- Don't edit `style.json`, `tokens.css`, `DESIGN.md`, `lib/*`, the gold cards, or another group's cards. If you need a new token or helper, scope it in your card's CSS/JS and mention it in your report.
- Need a photo that isn't there? Pull from Pexels (`PEXELS_API_KEY` in the workspace `.env`), grade with DESIGN.md section 9, save it as `assets/nature/<name>.jpg` (check the name is free) and return the credit line (file, photographer, URL) in your report. Don't edit CREDITS.md.
- No git commits, no MP4 renders, no servers left running.
- Final report (text, not a file): every card with its stem, duration, the moment you're proudest of, anything you couldn't make work, and any new photos with credits.
