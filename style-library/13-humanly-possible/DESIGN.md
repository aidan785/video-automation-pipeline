# Humanly Possible: motion design spec

The card library for **Humanly Possible**, the AIS Media interview show about everyday people and one real way they use AI. Host Jillian Wolf, remote guests, lots of screen shares.

Read this whole file before building or editing a card. It sits on top of the brand spec (`references/brand/brand-DESIGN.md`, copied from the HP design system). When the two disagree, the brand spec wins on color, type, logo and shape; this file wins on motion and on-screen layout.

## The look in one line

Warm, dark and flat: cream type on oxblood, one orange accent and one gold spark per frame, Bricolage Grotesque 800 headlines, film grain over everything. Graphics pop in, settle, and then hold perfectly still while the world behind them drifts. It should feel edited by a person who cares, never like a template.

## Sources

Brand: the HP design system + brand site artifact (`references/brand/`). The gradients in `tokens.css` are transcribed from the artifact's own SVG code.

Motion: eight reference videos analyzed on 2026-11-03 (`references/analysis/<video>.md`, hero frames in `references/frames/`):

| Video | What we took |
|---|---|
| Patriot Act (Netflix) | Redaction-bar titles, per-character stats + source tab, mosaic plate swap, screenshot pop beside the host |
| Hot Ones | "Animate the light, not the layout", the aside field (every aside cuts to one flat color), the recurring ritual card |
| The Diary Of A CEO | Pre-composed stacked lockups revealed word by word, text carried across a cut, persistent chapter counter, flat collage name card |
| Colin and Samir | The "graphics room" (flat page where screens live), number on a highlighter block, highlighter swipe on quoted text |
| Ali Abdaal (AI tools) | Phone docked beside the speaker for whole demos, magnifier on one AI line, isolate-and-blur UI, ink-fill quote, pill that morphs into a frame |
| Apple, Mac Students | UI macro instead of a screen card, version-name ticker, click as the climax, one small centered super |
| Great Big Story (x2) | Title box born from a line and collapsing back to one, three-step super with a short dash, rolling counter over action, number as a picture, acronym that edits itself down, bug yields to titles |

## Color in motion

Palette and contrast rules are the brand's (see `tokens.css`). On video:

- **Ground:** tier-1 cards sit on oxblood `--hp-oxblood` with grain. Brick `--hp-brick` is the **aside field** and feature surfaces (chapter cards, plates, tiles). Deep is only for scrims and shadows.
- **One orange per frame.** A stripe, a dash, a rule, a ring, a dot, an icon. Count it in every card. If a card needs two accents, the second is cream.
- **One gold per frame.** The number, or the one word. Never a fill larger than a highlighter block behind one number or line.
- **Gradients** (all in `tokens.css`):
  - `--hp-burn` (and the `-br` / `-low` re-anchors): the only full-field gradient. Episode title, chapter takeovers, end card, the big hero stat. Always grained, type in the dark two thirds.
  - `--hp-noise-fill`: cream to orange to gold. Clip-text fill for ONE hero word or number per card, never two clip-text elements side by side (the slab bug).
  - `--hp-flow`: the noise fill as a slow moving sweep (background-position, 5 s loop). For the hero word on a held title only.
  - `--hp-pass`: a one-time light pass across a shape or word, rotated about 28 deg. This is our "ignite": the light moves, the layout doesn't.
  - `--hp-wash`: blurred palette blobs. Behind the mark finishes and as a soft ground for glass-mark moments.
  - `--hp-embers`: two soft lights on black. Cold-open and sting grounds.
  - `--hp-rim`: the glass rim. Logo finishes only.
- **Grain** is on every tier-1 card (inline SVG feTurbulence filter or the `--hp-grain-url` overlay at `--hp-grain-opacity`), animated by stepping the seed or the background offset at 12 fps, deterministic.

## Type in motion

- Display: Bricolage Grotesque 800, `font-variation-settings: "opsz" 96`, tracking -0.03em (-0.04em above 160 px), line height 0.92 to 1.0. Sentence case. Caps only for redaction titles and tracked labels.
- Text: Inter Tight 500 to 700. Labels: Inter Tight 600 to 700 uppercase, +0.1em to +0.2em.
- No mono font in the brand. Prompts and AI output are Inter Tight 500 on a cream or brick card.
- Text reveals, in order of preference:
  1. **Word on the word:** the full lockup is laid out first in its final shape, and each word pops on at its spoken time (`data-at`). Early words never shift when later ones land.
  2. **Ink fill:** every word already sits at 0, turns on at 25% when spoken, fills to 100% over 0.3 s.
  3. **Per line:** labels, roles, list items.
  4. **Per character:** only for a hero number.
- Never letter-by-letter typing on headlines, never per-letter on lower thirds.

## Motion grammar

1. **Pop and settle.** Entrances use `--ease-pop` (cubic-bezier(.2,.9,.25,1)), 0.18 to 0.45 s. Scale from 0.92 to 0.96 (never from 0), up to 12 px of rise. No bounce, no overshoot, no spins, no long fades. GSAP: `ease: "hpPop"` (registered with CustomEase from the token) or `power3.out` as the fallback.
2. **Type holds still. The world drifts.** Once landed, type and cards never move. The ground under them (plate, photo, burn, grain) keeps a slow drift of 2 to 6% over the hold so the frame is never dead. Drift lives on the background layer only; the text layer never scales (it softens type).
3. **Animate the light, not the layout.** Emphasis comes from light changing on a still layout: a `--hp-pass` sweep across a word, an icon flipping from cream outline to orange fill, a number flipping cream to gold on its landing frame.
4. **Born from a line, back to a line.** Boxes and bars grow from a 3 px line and collapse back to one on exit. Open and close mirror each other.
5. **One element, two states.** Prefer morphs to separate in/out pairs: a pill grows into the frame around the next shot, a landscape card reshapes into a phone card.
6. **Graphics belong to the edit.** Supers and side cards can ride across a cut within the same speaker or chapter. Most exits happen on a cut, not as an animation. Animated exits are 0.25 to 0.3 s and mirror the entrance.
7. **Screens never go on air raw.** A screen recording is always framed (10 to 14 px radius) on oxblood or brick, cropped to the part that matters, with the one line or button lifted, magnified or highlighted. The guest stays visible in an inset or split when possible.
8. **Asides are a page turn.** Old photos, screenshots, customer messages: hard cut to the brick aside field, media slides in from the left over 6 frames and stops dead, hard cut back.
9. **The bug yields.** The corner mark hides whenever a tier-1 card owns the frame.
10. **Rhythm.** Tier-1 takeovers hold 2.5 to 6 s. Tier-2 supers hold 3 to 5 s. Roughly one graphic every 20 to 40 s of conversation; captions on punchlines only.

## Layout

- 1920x1080. Safe margin 116 px horizontal, 65 px vertical (6%).
- Left-align everything except the logo alone and single-line title cards.
- Tier-2 never covers the speaker's face: side cards go on the empty side of the frame, lower thirds bottom-left.
- Radii: 6 px chips and tags, 10 px cards and frames, 14 px large panels and video frames. Bars on redaction titles are square.
- Flat surfaces. Separate layers with deep or a 1 px `--hp-hairline`. A flat 0 8px 0 deep offset is the only allowed "shadow", for cards that sit on footage.

## Card plan (v1 pool)

Cards cover all six editing styles from the October 15 research (edge to edge, framed on the field, clean canvas, full frame, proof forward, chapter rail). Ids are `humanly-possible.<tier>.<purpose>.<treatment>`.

**Tier 1 (takeovers)**

| Purpose | Treatment | From |
|---|---|---|
| title | line-box (mark seeds a line that opens into the title box) | Great Big Story |
| title | burn (episode title on the burn with flow fill on one word) | brand |
| name | collage (brick name card + tilted flat photos) | DOAC |
| name | full (full-screen name card for the cold open) | DOAC, research "full frame" |
| chapter | redaction (bars reveal a justified caps block) | Patriot Act |
| chapter | brick-number (gold number, cream title, orange rule) | brand |
| stat | highlighter (number counts up on a gold block) | Colin and Samir |
| stat | assemble (per-character number + source tab) | Patriot Act |
| stat | multiply (one object becomes a grid of N) | Great Big Story |
| stat | burn-hero (giant noise-fill number on the burn) | brand |
| quote | ink-fill | Ali Abdaal |
| quote | mark (large orange quote mark, brand quote card) | brand |
| list | build (numbered list builds line by line beside a framed clip) | Ali Abdaal |
| compare | before-after (two columns, the after value lands in gold) | research "proof forward" |
| diagram | how-wired (tool tiles joined by drawn dashed lines) | Ali Abdaal |
| prompt | ticker (version-name / prompt-draft ticker) | Apple |
| define | acronym (long phrase edits itself down to the tool's name) | Great Big Story |
| aside | field (brick field, media slides in) | Hot Ones |
| screen | room (framed screen recording on oxblood with an info row) | Colin and Samir |
| screen | isolate (screen blurred and tinted, one panel lifted sharp) | Ali Abdaal |
| photo | archive (personal photo centered on oxblood) | Great Big Story |

**Tier 2 (overlays)**

| Purpose | Treatment | From |
|---|---|---|
| lower-third | bar (oxblood bar, orange stripe: the brand's canonical) | brand |
| lower-third | three-step (name, role, orange dash, 1-frame stagger) | Great Big Story |
| lower-third | result (name + the result line ending on a gold number) | research (Ramsey) |
| lower-third | ignite (brick box, tool icon ignites after the box lands) | Hot Ones |
| caption | stack (pre-composed stacked lockup beside the face, word on the word) | DOAC |
| caption | punchline (one line, per word, one gold word) | Colin and Samir |
| chapter-rail | counter (persistent "01" top-right with an orange dot) | DOAC, research "chapter rail" |
| counter | running (pinned running total that ticks on each mention) | research "proof forward" |
| stat | over-action (huge numeral counts over a locked shot, lands gold) | Great Big Story |
| screen | side-card (screenshot or chat pops beside the host, 42% width) | Patriot Act |
| screen | phone-dock (phone frame docked for the whole demo) | Ali Abdaal |
| screen | magnifier (one AI line lifted and enlarged) | Ali Abdaal |
| screen | highlight (gold band wipes behind the key line of a prompt) | Colin and Samir |
| screen | click (cursor travels to the button, press, label swaps) | Apple |
| label | source-tab (brick chip, orange left bar, top-left) | Patriot Act |
| bug | mark (corner mark, hides under tier-1) | Great Big Story |

**Layouts and transitions (custom)**

| Purpose | Treatment |
|---|---|
| layout | edge-to-edge (two webcams 50/50 at matched eye height, cream seam) |
| layout | framed-field (two keylined frames on flat oxblood, names under) |
| layout | proof-split (one third / two thirds, result side gets the counter) |
| layout | screen-inset (screen card big, both cameras stacked beside it) |
| transition | line-collapse (a card squashes to a line and the line exits) |
| transition | mosaic (seeded flat blocks swap the plate on a camera cut) |
| transition | pill-morph (a label pill grows into the frame of the next shot) |
| sting | mark (HP intro beats: H pops, box pops, stem drops, heartbeat) |

## What not to do

- No glassmorphism, glow, neon, blur halos or drop shadows on cards or type (the logo finishes are the only glass).
- No second orange, no second gold, no new hues, no AIS blue.
- No bounce (`back.out`, `elastic`), no spins, no fades longer than 0.3 s on graphics.
- No letter-by-letter typing on headlines; no animated text on lower thirds beyond per line.
- No screens on air raw, no browser chrome, no YouTube UI replicas.
- No hand-drawn arrows, no random scribbles. The one hand-made mark allowed is a single orange ring written on around the one detail that matters.
- No em dashes in any slot copy.
- Never type the show name as a logo; use the mark/lockup SVGs in `assets/logo/`.

## Card contract notes (this style)

- Self-scoping like 11-ais-live-v2: composition id and every CSS selector prefixed `#hp-<tier>-<purpose>-<treatment>`, all queries through `ROOT`, so cards inline into a video without rewriting.
- Word timing: elements carry `data-at` (seconds from beat start). Missing `data-at` falls back to an even stagger.
- Fonts load from Google Fonts in each card (Bricolage Grotesque opsz 12..96 wght 600..800, Inter Tight 400..700). Build and register the timeline synchronously; never block registration on `document.fonts.ready` (it can hang a render). Layouts must not depend on measured text widths.
- Grain is deterministic: seed stepped by frame index, never `Math.random()`.
