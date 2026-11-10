# 15 · Humanly Possible V3 · "Field Glass"

Sanji's motion craft (liquid glass, toggles, nature under clear frosted glass, the uppit text pour, dither / dot / grid transitions) rebuilt as its own Humanly Possible language. It's not "Sanji recolored". The big idea comes from the HP brand itself: **the brand gradient is low sun.** The burn that rises from the bottom-left corner (gold core, orange, brick, oxblood, deep) is treated as real light falling on real nature, and everything in a v3 frame behaves like it's outside at golden hour.

Self-contained: own tokens, own libs (`lib/text-preset.js` copied from 12-sanji, `lib/field-glass.js`), own graded photos (`assets/nature`), light plates (`assets/light`), logo files (`assets/logo`). Nothing here reads from 12, 13 or 14.

Sources: HP brand spec (`~/Projects/Executive Assistant/projects/ais-media/brand/humanly-possible-design-system/DESIGN.md`), 12-sanji DESIGN.md sections 4, 6 and 11, Aidan's HP feedback (no stripes, no keylines, no flat shadows, nothing template-y), and the rejected 15-sanji-hp attempt. Learn from that one: it recolored Sanji cards, so this library gives HP its own moves.

---

## 0. The laws (re-read every card)

1. **Light comes from the bottom-left, but only on a few cards.** The burn origin (8%, 100%) is the sun. The sunrise / flare / corner glow is a hero move: the gold cards, light-concept transitions and about 2 cards per group. Everything else has light OFF (Aidan 11/3: "not all of them should have that"). Glass condensation can still start from a corner.
2. **Nature on about half the cards, not all** (Aidan 11/3). Photo grounds carry the warmth; the rest use the brand's own grounds (section 1b) so the library has range. Glass only goes over something with light in it: a photo, footage, the burn or the wash, never a flat fill.
3. **Glass forms like breath, it doesn't pop.** Panels CONDENSE from clear to frosted, spreading from a point. Exits CLEAR (the frost evaporates). Nothing scales in from 0.9 with blur, which is the Sanji glass pop.
4. **HP pops, no overshoot.** `cubic-bezier(.2,.9,.25,1)` for every arrival. No `back.out`, no elastic, no spins.
5. **The heartbeat is the emphasis.** When something matters (the last toggle, the stat landing) it takes the logo's lub-dub: 1.07, back, 1.045, back. No bloom rings, no sonar.
6. **One orange, one gold per frame.** Orange = the single accent (the payoff toggle, one headline word). Gold = the single key number or word. A frame can have neither.
7. **Mark B shapes.** Radii come from the mark's 14-unit construction (14 / 28 / 42). Glass panes are plain rounded rectangles: **no notch, no tab, no cut-out silhouettes** (Aidan 11/3). Toggles are rounded rectangles with a rounded-square knob, never full pills.
8. **All text uses the uppit pour** (`TXT.reveal`), Bricolage 800 sentence case for display. No all-caps headlines (Sanji's caps are not ours), only the small tracked labels go uppercase.
9. **Depth from glass, light and real photography.** Never stripes, keylines, outline boxes or offset shadows (section 7).

## 1. Canvas: FIELD (the only one)

| Layer (back to front) | What | Class |
|---|---|---|
| ground | graded nature photo, 2112x1188 (10% overscan for wind) | `.fg-ground > .fg-photo` |
| shade | top haze + edge vignette in deep | `.fg-shade` |
| flare | gold to orange bloom at the burn origin, screen blend | `.fg-flare` |
| night | deep veil with a hole growing from the burn origin (sunrise) | `.fg-night` |
| depth | soft ambient pool under a pane (blur 140, never offset-flat) | `.fg-depth` |
| glass | smoked oxblood glass: `.fg-tint`, `.fg-dapple` (leaf shadow), `.fg-sheen` (sun glint) | `.fg-glass` |
| grain | fine warm film grain, overlay | `.fg-grain` |

**Photos** (`assets/nature`, Pexels license, credits in `assets/CREDITS.md`): every photo is pre-graded with the HP gradient map (`_hp-grade-clut.png`: deep, oxblood, brick, orange, gold, cream mapped to luminance, blended 55% over the original, saturation 92). Shadows land in oxblood, highlights in cream, so the photo's own color still reads but sits inside the palette. Grade any new photo or footage the same way (recipe in section 9). Casting notes:
- **Backlit / sun in frame** (grass-sunset, fern-backlit, meadow-sunrise, sun-reeds, field-sunset): glass panels look best sitting over the sun, it glows through.
- **Red rock** (red-cliffs, rock-arch, mesa-dusk): the palette is native here, use for chapter and transition grounds.
- **Mist / horizon** (misty-sunrise, misty-hills, sea-dusk, dunes): calm, for quotes and holds. Darker, so avoid them under full-bleed frost.
- **Close nature** (autumn-leaves, dandelion, grass-dusk): small details, for tier-2 grounds and stats.
- `assets/light/leaf-shadow.jpg`: grayscale leaf-shadow plate for dappled light (multiply, blurred 7px, 11%). `leaf-shadow-warm.jpg` has a hard black bar at the top, so crop it before use.

## 1a. Ground switches (Aidan 11/3)

Every card carries three hidden slots and calls `FG.ground(ROOT, defaults)`: **ground** (`photo | oxblood | deep | brick | cream | burn | wash | none`), **grain** (`on | off`), **light** (`on | off`). tokens.css does the rest: flat grounds paint `.fg-ground` and switch glass to the **solid Sanji-style fill**; `none` makes the card transparent so it sits on footage or a blank screen; light off hides the night veil + flare; grain off hides grain. Target mix: about a third photo, a third flat brand ground (recreating the Sanji graphic closely in HP branding), a third no background. Grain on about half. No dog footage anywhere. The review app's player switches any card's ground / grain / light live, and the Backdrop chips set what sits behind transparent cards.

## 1b. Non-photo grounds (tokens.css, NON-PHOTO GROUNDS)

| Ground | Class | Use |
|---|---|---|
| **Burn** | `.fg-burn` (tween `--bx`/`--by` to move the sun) | hero moments, chapter cards, end cards, stats. Type in the upper-right two thirds, where it's dark |
| **Wash** | `.fg-wash` + 3-5 `.fg-blob` (gold/orange/brick/deep), drifting slowly | glass diagrams, UI, settings: the brand's "glass over a blurred wash" finish |
| **Flat** | `.fg-flat` (`.brick`, `.deep`) | type-only cards: quotes, kinetic text, definitions. No glass |
| **Cream** | `.fg-cream` | light mode: oxblood type, orange/gold as shapes only. No glass |

The sunrise still works on burn and wash: put a `.fg-night` over them. Grain goes on every ground.

## 2. Type

| Role | Face | Spec |
|---|---|---|
| Display | Bricolage Grotesque 800, opsz 96 | sentence case, -0.03em, line-height 0.95. 132 title / 112 chapter / 84 head / 76 panel |
| UI rows | Inter Tight 600 | 42-44px, -0.01em |
| Labels | Inter Tight 700 uppercase | 24px, +0.1em, cream 72% |
| Hero numeral | Bricolage 800 | 600-720px, -0.05em, as a WINDOW (section 5) or solid gold |

Highlight at most one word: `<em>` is gold by default (`.fg-display em`). When a frame's gold is spent elsewhere (a number), the `<em>` goes orange instead.

## 3. Color

HP's six, no others: oxblood `#4B1526`, cream `#FFF0E6`, brick `#7A1E1E`, orange `#FF8A4C`, gold `#FFC145`, deep `#2C0B16`. Glass light is cream (white only for the white logo file).

- Glass tint = cream sheen top-left, brick in the middle, deep pool bottom-right (`--glass-tint`).
- Toggle ON = cream track + oxblood knob. The payoff toggle = orange track + cream knob.
- Dormant rows: label to cream 46%, icon well to 55% opacity.
- No blue, no green UI accents. Greens in the photography survive at low saturation because of the grade, which is fine, they're nature.

## 4. Field Glass (adapted from Sanji section 4)

| | Sanji (COBALT / NATURE) | HP V3 (FIELD GLASS) |
|---|---|---|
| tint | white sheen to cobalt pool | cream sheen, brick, deep pool (smoked oxblood) |
| backdrop | blur 30 saturate 1.35 brightness .86 | blur 28 saturate 1.3 brightness .84 |
| rim | 1.5px white border | light catch only: inset 1.5px cream top-left fading out, strongest top-left (the brand's glass-mark finish) |
| depth | blue drop shadow | soft deep pool, blur 140, `.fg-depth` |
| radius | 46-56px squircles, full pills | 14 / 28 / 42 (Mark B), knobs 10 |
| entrance | glass pop (scale .9 + blur, back.out) | CONDENSE from a point (frost spreads, blur 0 to 28, tint rises) |
| emphasis | bloom ring, sonar | heartbeat (lub-dub) |
| ambient | sonar rings | wind sway on the photo, leaf-shadow dapple drifting, one sun glint per hold |
| icons | white glyph in glass circle | cream line icon (Lucide weight 2) in a 72px rounded-square well, cream 10% |

**Never put `filter` on a `.fg-glass` or any ancestor** (it flattens the backdrop blur). Blur children (words) freely.

**Pane shape:** plain rounded rectangle, radius 42 for hero panes, 28 for cards and rows, 14 for chips. No notches, tabs or logo-shaped cut-outs (tried a Mark B nub tab, Aidan rejected it 11/3). The chapter number or the small mark lives inside the pane: number in gold before the eyebrow, mark small at the top-right on the eyebrow line.

## 5. Signature moves

| Move | Recipe (lib/field-glass.js) | Use |
|---|---|---|
| **Sunrise** | `FG.sunrise(tl, ROOT, at, {dur:1.4})`: `--sr` 0 to 150 on `.fg-night` (GLIDE), flare peaks at 45% then settles to .38 | every card that opens on its own ground. 1.2-1.6s |
| **Rack focus** | `.fg-photo` blur 16 to 0 over 1.5s (SETTLE) during the sunrise | titles and openers |
| **Condense** | `FG.condense(tl, pane, at, {dur:.9, x, y})`: mask `--fm` 0 to 170 from (x,y), `--fb` 0 to 28, tint 0 to 1 | every glass pane. Origin = the burn corner unless the pane is far right |
| **Clear** | `FG.clear(tl, pane, at)`: blur to 0 and fade, 0.55s | pane exits |
| **Heartbeat** | `FG.beat(tl, el, at, {amp})`: 1.07 / 1 / 1.045 / 1 over 0.62s, sine.inOut | the payoff (last toggle, stat landing, logo) |
| **Window wipe** | numeral with `background-clip:text` of the SAME photo pinned to the ground geometry, gold-warmed, `brightness 1.5`; mask `--w` -30 to 110 at hand speed (0.95s, power2.inOut) | hero numbers and one-word reveals over full-bleed frost |
| **Wind** | `FG.sway(tl, ROOT, 0, END)`: scale 1.1 to 1.03, x -18 to 14, rotation -0.25 to 0.2 deg, sine | every photo ground (not under a window wipe, which needs a still ground) |
| **Dapple** | `FG.dapple(tl, pane, 0, END)`: leaf-shadow plate drifts x -60 to 60 inside the pane | panes up to about 1/2 frame. Never full-bleed (reads as camo) |
| **Sun glint** | `.fg-sheen` background-position 120% to -20% over 1.3-1.6s, once per hold | after the payoff |
| **Toggle** | knob x +64 (POP .42s) with squash scaleX 1.16 / scaleY .92 then SETTLE; `.on` fades in; previous row goes dormant at the same instant | settings, checklists, "turn this on" |

**Text:** `TXT.reveal` (0.7s per word, 40ms stagger, blur 6, 0.3em rise, `cubic-bezier(.23,1,.32,1)`) for every DOM text entrance. `TXT.block` for icons, wells, toggles, logo. Chain beats on the tail: `const t = TXT.reveal(tl, a, 0.8); TXT.reveal(tl, b, t - 0.5)`.

**Easings:** `FG.POP` arrivals, `FG.SETTLE` text and glass, `FG.GLIDE` light, wind and camera, `power2.in` exits. Exits at 0.6x entry. Never `linear` on anything visible except the canvas clock.

## 6. Transitions

| Transition | Idea | Status |
|---|---|---|
| **Burn dither** (`tr-burn-dither`) | light rising from the burn origin as an 8x8 Bayer-dithered front; each cell passes gold, orange, brick, oxblood, deep, then opens onto scene B. Threshold = distance from the sun x0.8 + a slow wave + Bayer x0.16, 12px cells, bloom copy on the gold/orange cells | gold |
| Seed dissolve | Sanji's dot dissolve as dandelion seeds: soft cream/gold discs drift up-right on the wind (seeded), thicken into a field, and blow away to reveal B | planned |
| Field flip | Sanji's grid flip as a gust through grass: Mark B rounded-square tiles flip in a wave along the wind direction, phase-offset by a seeded wind field | planned |
| Frost wipe | B appears behind glass that fogs over A from the corner and then clears | planned |
| Sunset cut | A sinks to night (`--sr` reversed), B rises in a sunrise | planned |

Canvas transitions draw from the timeline clock (`P.t` proxy with `onUpdate`), seeded, no rAF, and redraw on image load.

## 7. Banned (lint-hp-tells.mjs enforces most of this)

- Accent stripes on box edges, keylines, outline boxes, 1px borders as decoration (`border: ... solid` fails lint).
- Flat offset drop shadows. v3 lint allows box-shadow only as inset light or a soft ambient pool (blur >= 40px and >= 2x the offset). `text-shadow` and `drop-shadow()` are banned outright.
- Glow halos on type, neon, chrome text.
- `back.out`, elastic, bounce, spins.
- All-caps headlines, more than one orange or gold per frame, blues or greens in UI.
- Glass over flat color (no visual gain). Glass needs a photo or footage under it.
- Simulated texture standing in for real material (procedural "paper", fake film burns). Grain is OK at 0.55 overlay. Light and leaves come from real photographed plates.
- Sanji tells: sonar rings, cobalt anything, white glass rims, badge circles, caps titles, the 0.38s glass pop.
- Em dashes in copy. Unseeded randomness, `Date.now()`, network images.

## 8. Card contract

- Folders: `cards/text`, `cards/popup` (tier-2 over footage), `cards/motion` (stats, data, kinetic), `cards/instructional` (steps, settings, checklists, UI), `cards/transition`.
- Root `<div id="hp3-<stem>" data-composition-id="hp3-<stem>" data-start="0" data-width="1920" data-height="1080">`, CSS scoped under `#hp3-<stem>`, script in an IIFE, queries from `ROOT`.
- Exactly one paused GSAP timeline on `window.__timelines["hp3-<stem>"]`, ending `tl.set({}, {}, END)` with a finite END.
- Inline libs between markers: `/* @text-preset:start */ /* @text-preset:end */` and `/* @field-glass:start */ /* @field-glass:end */`, then run `node scripts/style-library/sync-hp3-libs.mjs` to stamp them (`--check` in CI).
- Slots: `data-slot` on the editable element. Photo slot = hidden `<span class="slot-photo" data-slot="photo">stem</span>`, path built as `../../assets/nature/<stem>.jpg`.
- Text measured lazily or re-placed on `document.fonts.ready` when layout depends on glyph widths.
- tier-2 (popup) cards: transparent root, glass over the real footage, verified over a footage still, not a flat backdrop.

## 9. Grade recipe (new photos or footage)

```bash
CLUT=style-library/15-humanly-possible-v3/assets/nature/_hp-grade-clut.png
magick in.jpg -resize 2304x1296^ -gravity center -extent 2304x1296 \
  \( +clone -colorspace gray -sigmoidal-contrast 3x50% $CLUT -clut \) \
  -compose blend -define compose:args=55 -composite -modulate 100,92 -quality 86 out.jpg
```

Footage isn't scripted yet. Grade it in Premiere or Resolve with the same 6-stop map (deep, oxblood, brick, orange, gold, cream across luminance, about 55% mix).

## 10. Pre-flight (before calling a card done)

1. `node scripts/style-library/lint-hp-tells.mjs <card>` is clean, and `sync-hp3-libs.mjs --check` passes.
2. Seek screenshots at 4+ moments (`scripts/style-library/_hp3-shot.mjs <card> <out> t1,t2,...`): sunrise mid, condense mid, content settled, payoff.
3. Count the orange and the gold in the settled frame: at most one each.
4. Text never clips at the longest slot value. Duration is finite.
5. Does it read as warm, outdoor, human, or as a UI kit? If it looks like a SaaS dashboard, add more nature and less chrome.
