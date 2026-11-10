# HP V3 · retrofit pass 2 (Aidan's notes, 11/3)

Read this whole file, then retrofit EVERY card in your group (same group key, same card list as pass 1: `_meta/groups.json` + your `_meta/<GROUP>.json`). BUILD_BRIEF.md still applies except where this file overrides it.

## What Aidan said

> "A lot of these have that bottom-left glow transition in. Not all of them should have that. You can keep all of those, but try to recreate a lot of the Sanji graphics and how they look, just with the Humanly Possible branding: some with noise, some without noise, and some with absolutely no background at all. We don't need all of those to have nature; get rid of the dog ones. These are going to be different examples, so I want to be able to see it on a blank screen. Get rid of the seed dissolve one. For the blur pullback, we don't need that highlight in the bottom left, so reanalyze a lot of these."

So:
1. **The bottom-left glow (sunrise + flare + night veil + burn-corner bloom) comes OFF almost everywhere.** It stays on only where it IS the idea (the gold cards, light-concept transitions like daylight-to-dusk / dusk-sweep / burn-dither) and on at most **2 hero cards per group** that you pick. Everything else: light off. That includes ad-hoc corner glows you painted yourself (radial gold/orange blooms at bottom-left, burn-corner gradients on photos, warm corner pools). Those go too unless the card is one of your 2.
2. **Not everything is nature.** Target per group: about **1/3 photo**, **1/3 flat brand ground** (oxblood, deep, brick or cream), **1/3 no background at all** (`none`, transparent, for footage or a blank screen). Burn/wash count as flat-ish, use them sparingly (they carry the corner glow look).
3. **Recreate the Sanji look.** For every card whose new default is flat or none, open the Sanji source card AND its poster (`style-library/12-sanji/preview/<sanji-stem>.jpg`) and match its composition closely: layout, scale, spacing, tile shapes and sizes, connectors, icon treatment, the clean premium calm. Same graphic, HP branding: HP colors (oxblood/deep/brick/cream grounds where Sanji had cobalt/paper/ember), Bricolage 800 sentence case + Inter Tight, one orange, one gold, uppit text, HP pop (no overshoot). Subtle Sanji ambient (sonar rings at very low opacity, connector node dots) is allowed back on flat grounds.
4. **Grain:** on for about half the cards that have a background, off for the others. `none` cards: grain off.
5. **No dog imagery anywhere** (the groomer footage stills are deleted; `assets/demo` now has phone_6963836, phone_8142388, field_5805200, dusk_5941610, prairie_13975529). Copy can still mention Dana.
6. **Seed dissolve (`tr-dot-dissolve`) is deleted.** Don't rebuild it.
7. **Blur pullback** (group F): no bottom-left highlight. Re-check every transition for the same thing.

## The ground switches (already in lib/field-glass.js v3 + tokens.css; read both)

Every card now carries three hidden slots, placed right after the root div opens (before any other slot):
```html
<span class="fg-slot" data-slot="ground">oxblood</span><span class="fg-slot" data-slot="grain">off</span><span class="fg-slot" data-slot="light">off</span>
```
and calls, as the first line after `const ROOT = ...`:
```js
FG.ground(ROOT, { ground: "oxblood", grain: "off", light: "off" });   // same values as the slots
```
`ground`: `photo | oxblood | deep | brick | cream | burn | wash | none`. FG.ground writes `data-ground / data-grain / data-light` on the root and tokens.css then:
- hides `.fg-photo`/`.fg-shade`/`.fg-dapple` unless ground = photo; paints `.fg-ground` with the flat color / burn / wash (wash blobs are injected);
- hides `.fg-night` + `.fg-flare` when light = off (FG.sunrise also becomes a no-op), hides `.fg-grain` when grain = off;
- `none`: root + `.fg-ground` + `.fg-depth` transparent/hidden;
- on oxblood/deep/brick, `.fg-glass > .fg-tint` becomes **solid glass** (Sanji-style painted fill, light catch top-left, soft ambient pool), since there's nothing to blur. On `none` the tint gets more body for legibility over unknown footage.
- `FG.sway` is ground-aware (photo wind, wash blob drift, burn sun drift, nothing on flat).

**Your job per card:**
- Add the slots + the `FG.ground` call with the card's new defaults.
- Make the card's markup use `.fg-ground` (with the `.fg-photo` img inside) for its background so the switches work. If your card paints its ground somewhere else (scoped CSS background on the root, a custom canvas, a custom photo element), restructure so the switches control it: read `ROOT.dataset.ground/grain/light` in your script after `FG.ground` where needed (SIGNAL canvases especially: ground none = transparent canvas background; light off = glyphs in plain cream/cream-muted with no burn-ramp tint, only the inverse chip and the one orange/gold accent carry color).
- Any custom grain element: use class `fg-grain` so the switch hides it. Any custom corner glow: class `fg-flare` (so light=off hides it), or delete it.
- **Every card must look right on: its default, AND `none` over a blank screen** (`#1c1c1c`), AND (dark-ink cards) on `oxblood`. Cream/daylight cards with oxblood ink can't sit on a dark blank: their allowed grounds are cream / photo / none-over-light; note it in meta (`grounds`). Check legibility on each allowed ground.
- Transitions: the switches apply to grain and light; vary the scene stand-ins so at least half of your transitions use a flat brand scene (Sanji-style flat canvas with HP type) on one or both sides instead of two photos. `ground` for a transition = its scene-B default; use `none` only if the transition genuinely works as an overlay wipe.
- Tier-2 / popup cards: default `none` (they ride on footage). Verify over `#1c1c1c` AND one `assets/demo/*.jpg` (no dog).

## Verify (same gate as pass 1, plus grounds)

- `node scripts/style-library/_hp3-shot.mjs <card> <scratch>/<stem> t1,t2,t3,t4 [#1c1c1c | assets/demo/x.jpg]` from the workspace root. For each card shoot the default look, plus `none` over `#1c1c1c` (make a temp copy with the slot changed, in the SAME folder as the card so relative paths resolve, named `_tmp-<stem>-<ground>.html`, and DELETE it right after). Read the sheets.
- `node scripts/style-library/lint-hp-tells.mjs <card>` clean; `node scripts/style-library/sync-hp3-libs.mjs <card>` then `--check`.
- **The disk is nearly full.** Delete your scratch PNGs after reading each sheet (keep only small JPG sheets), and never leave `_tmp-*` files in `cards/`. Use `"${VAR:?}"/...` or literal paths in any rm.
- Re-shoot the poster at the new default (`preview/<stem>.jpg`, 960x540 q84). For `none` defaults, shoot the poster over `#1c1c1c`.

## Hand back

Rewrite your `_meta/<GROUP>.json` (slots MUST be arrays of `{name, type, maxChars, ...}`), and add to each card: `"ground"` (default), `"grounds"` (allowed list), `"grain"`, `"light"`, and update `canvas` if it changed (`field`, `daylight`, `dusk`, `signal`, `overlay`, or `flat` for Sanji-style flat cards). Update `notes` to describe the new default look.

Final reply: a table of every card with old look -> new default (ground/grain/light), which 2 kept the light and why, anything that didn't survive the `none` test, and confirmation that no `_tmp`/`_shot` files remain. Plain text, no em dashes.
