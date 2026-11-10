# Humanly Possible Design System

The visual identity for **Humanly Possible**, the AIS Media show that asks "What is humanly possible with AI?" Palette: **Pulse Combined** (October 13, 2026; replaces Pulse). Logo: **Mark B** (chosen October 9, 2026).

Read this whole file before designing anything for the show. When this file and a general design habit disagree, this file wins. When the person you're working for asks for something specific, their request wins.

## The look in one paragraph

Warm and dark. Screens sit on purplish oxblood with cream type; physical surfaces like the studio wall and merch go brick red. A single orange accent shows up once per surface, and gold is the spark: an episode number, one highlighted word. Headlines are heavy, tightly tracked Bricolage Grotesque; reading text is Inter Tight. Corners are softly rounded (6 to 14 px), surfaces are flat, and the only gradient is the grainy "burn" that rises from the bottom-left corner on banners. It should feel like a late-night conversation with someone sharp, not like a tech product.

## Color

Five primaries and one support shade. Oxblood, cream and gold come from the original Pulse palette; brick and orange come from Pulse Ember. Nothing else.

| Token | Hex | Role | Rough share |
|---|---|---|---|
| `--hp-oxblood` | `#4B1526` | **Primary.** The default background on every screen: YouTube, X, Instagram, web, dark slides, avatars. | 58% |
| `--hp-cream` | `#FFF0E6` | **Primary.** All type, the logo, and paper for light mode. | 20% |
| `--hp-brick` | `#7A1E1E` | **Primary.** Physical and feature surfaces: the studio feature wall, merch garments, chapter cards, business cards, the occasional feature post. | 12% |
| `--hp-orange` | `#FF8A4C` | **Primary.** The one accent per surface: an accent word on oxblood, a button, the studio LED strip, a pin, a rule. | 6% |
| `--hp-gold` | `#FFC145` | **Primary.** The spark: episode numbers, the single most important word, embroidery, the gradient's core. | 4% |
| `--hp-deep` | `#2C0B16` | **Support shade.** A darker oxblood for shadows, overlays, the studio floor, the darkest UI and merch backdrops. | |
| `--hp-cream-muted` | `rgba(255,240,230,.72)` | Secondary text and captions. Cream at 72% opacity, not a new color. | |

Dropped from the earlier palettes: coral, blush, peach, butter gold, the stage shade and the second cream.

### Contrast (WCAG)

| Pair | Ratio | Use |
|---|---|---|
| Cream on oxblood | 13.2 | Any text |
| Cream on deep | 16.2 | Any text |
| Cream on brick | 9.3 | Any text |
| Gold on oxblood | 9.0 | Any text |
| Gold on brick | 6.4 | Any text |
| Orange on oxblood | 6.3 | Any text, but keep it to short accents |
| Orange on deep | 7.7 | Any text |
| Orange on brick | 4.4 | **Large headline words or shapes only** |
| Oxblood on cream | 13.2 | Any text (the light "paper" mode) |
| Orange on cream | 2.1 | **Never for text.** Shapes only |
| Gold on cream | 1.5 | **Never** |

### Color rules

| Color | Use it for | Never |
|---|---|---|
| Oxblood | The default background on every screen. | Never swap it for brick on digital profile art; oxblood is the recognizable color. |
| Cream | All type, the logo, light-mode paper. Secondary text is cream at 72%. | Never tint it pink or add a second cream. |
| Brick | Studio feature wall, merch, chapter cards, business cards, the occasional feature post. | Never as text, and never right against oxblood without a clear edge between them. |
| Orange | One accent per surface: one word on oxblood, a button, the LED strip, a pin, a rule. | Never twice on one surface. On brick, only as a shape or a large headline word. |
| Gold | Episode numbers, the single most important word, embroidery, the gradient core. | Never for body text or large fills. Rarer than orange. |
| Deep | Shadows, overlays, the studio floor, the darkest UI. | Never as a brand color on its own. |

- No other hues. No blues, greens or purples beyond oxblood, and nothing from the old AIS blue palette.
- The light mode (for documents, slides and print) is oxblood type on cream. Orange and gold only appear there as non-text shapes.

### The gradient

The only gradient in the system. It burns up from the bottom-left corner: gold at the core, orange, brick, oxblood, then deep. On banners and headers it carries a fine film grain.

```css
background: radial-gradient(115% 115% at 8% 100%, #FFC145 0%, #FF8A4C 28%, #7A1E1E 54%, #4B1526 76%, #2C0B16 100%);
```

Use it for YouTube banners, the X header, end cards and hero moments. Put white or cream type on it, kept in the upper-right two thirds where the ground is dark. Never use it behind body text, and never as a button or card fill.

## Type

Load both from Google Fonts:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Inter+Tight:wght@400;500;600;700&display=swap">
```

| Role | Family | Weight | Tracking | Line height |
|---|---|---|---|---|
| Display (titles, thumbnails, chapter cards, quotes) | Bricolage Grotesque, optical size 96 | 800 (600 for subheads) | -0.02em to -0.04em | 0.9 to 1.05 |
| Text (body, captions, UI, names) | Inter Tight | 400 to 700 | 0 to -0.01em | 1.4 to 1.6 |
| Labels (small caps-style eyebrows) | Inter Tight | 600 to 700, uppercase | +0.06em to +0.12em | 1 |
| Data and code | ui-monospace, Menlo | 500 | 0 | 1.4 |

Fallbacks: `"Bricolage Grotesque", "Avenir Next", "Segoe UI", sans-serif` and `"Inter Tight", "Helvetica Neue", Arial, sans-serif`.

- Headlines are short, heavy and sentence case. Never all caps for headlines.
- Highlight at most one word per headline, in gold (on thumbnails) or orange (elsewhere, on oxblood only).
- Never set the show name in live type as a logo. Use the outlined logo files; the wordmark is drawn, not typed.

## Logo

Mark B: a P outline wrapped around an H. The H's left leg runs down into the P's nub, so the two letters share one stem. It reads as HP, and a little like a human head.

<!-- MARK -->
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="231 201 426 486" aria-label="Humanly Possible" role="img"><g fill="#FFF0E6"><path fill-rule="evenodd" d="M231,215 A14,14 0 0 1 245,201 L643,201 A14,14 0 0 1 657,215 L657,613 A14,14 0 0 1 643,627 L481,627 A14,14 0 0 0 467,641 L467,673 A14,14 0 0 1 453,687 L245,687 A14,14 0 0 1 231,673 Z M275,259 A14,14 0 0 1 289,245 L599,245 A14,14 0 0 1 613,259 L613,569 A14,14 0 0 1 599,583 L437,583 A14,14 0 0 0 423,597 L423,629 A14,14 0 0 1 409,643 L289,643 A14,14 0 0 1 275,629 Z"/><path d="M303,287 A14,14 0 0 1 317,273 L381,273 A14,14 0 0 1 395,287 L395,359 A14,14 0 0 0 409,373 L479,373 A14,14 0 0 0 493,359 L493,287 A14,14 0 0 1 507,273 L571,273 A14,14 0 0 1 585,287 L585,541 A14,14 0 0 1 571,555 L507,555 A14,14 0 0 1 493,541 L493,466 A14,14 0 0 0 479,452 L409,452 A14,14 0 0 0 395,466 L395,601 A14,14 0 0 1 381,615 L317,615 A14,14 0 0 1 303,601 Z"/></g></svg>
```
<!-- /MARK -->

That inline SVG is the exact mark in cream. Change the `fill` to recolor it. For every other version, use the files in `assets/logo/svg/` (type is outlined, so no fonts are needed).

| File | Use |
|---|---|
| `hp-horizontal-*.svg` | **Default.** Mark left, name right. |
| `hp-horizontal-tagline-*.svg` | Banners and end cards only. |
| `hp-stacked-*.svg` | Where width is tight. Humanly over Possible. |
| `hp-vertical-*.svg` | Square and tall spaces. Mark above the name. |
| `hp-mark-*.svg` | The mark alone, once the show is known: avatars, bugs, watermarks. |
| `hp-solid-*.svg` | Only below 32 px, where the outline would close up. |
| `hp-card-*.svg` | Card wordmark: words only, "Possible" knocked out of a rounded card so the ground shows through. Set in Sora 800 from the original show look. |

Colorways: `-pulse` (oxblood ink, for cream or white grounds), `-white` (for dark grounds and photos), `-black` (one-color print). For the cream mark on oxblood, use `hp-mark-cream.svg` or set `fill="#FFF0E6"` on the white files.

### Logo rules

- The mark always sits left of or above the words. Never to the right.
- Clear space: one fifth of the mark's width on every side.
- Minimums: mark 32 px (solid mark from 16 to 31 px), horizontal lockup 160 px wide, stacked 96 px wide, print 10 mm.
- The mark is always a filled shape. No outline-only versions, no strokes, glows, drop shadows, bevels or outer outlines, except the approved finishes below.
- Never stretch, rotate, recolor outside the palette, or retype the name in a font.
- Never close the join between the H's leg and the P's nub. That shared stem is the idea.
- Construction (for redraws only): 888-unit grid, 44-unit band, 14-unit corner radius everywhere, 28-unit gap between the H and the band.

### Logo finishes

For banners, social art, title cards and hero moments only. Everyday use stays flat.

- **Noise gradient field:** the flat cream or white mark on the grainy gradient burn.
- **Grain with mark grid:** the grainy burn with a quiet grid of small white marks at about 16% opacity, fading out around the lockup. The default YouTube banner and X header.
- **Noise gradient mark:** the mark itself filled with a cream, orange and gold gradient, with hard film grain, on oxblood or black.
- **Liquid and frosted glass:** the mark itself as glass over a blurred wash of the palette, over black, or over studio footage, with a bright rim strongest at the top-left. Never a glass card or tile behind the mark.

Every finish uses only the six palette colors plus white. The branding sheet shows each one.

## Layout and shape

- Corner radius: 6 px for small things (chips, tags), 10 px for cards and frames, 14 px for large panels and video frames. Never fully round pills on rectangles. Circles are fine for avatars.
- Surfaces are flat. Separate layers with deep, or a 1 px line at 6 to 10% cream, not with shadows.
- No glows, neon, glassmorphism or blur halos on interface elements, cards or text. The logo finishes below are the only exception.
- Left-align text. Center only the logo on its own and single-line title cards.
- Generous margins: at least 6% of the frame width on video graphics and 16 px on mobile screens.

## Components

These are the show's recurring pieces. The exact CSS is in `examples/components.html`.

**Thumbnail (16:9).** Oxblood ground. Title on the left half in Bricolage 800, three to six words, one word in gold. Guest photo fills the right 46%, full height. Small cream mark in the top-left corner.

**Lower third.** An oxblood bar at the bottom-left of the frame with an orange stripe down its left edge. Name in Bricolage 800 cream, role in Inter Tight 600 cream at 72% underneath. Radius 10 px.

**Chapter card (16:9).** Brick ground. A big chapter number in gold (Bricolage 800), the chapter title in cream below it, then a short orange rule.

**Quote card (1:1).** Oxblood ground. A large orange opening quote mark, the quote in Bricolage 800 cream, the speaker and episode in cream at 72%, and the mark small in the bottom-right corner.

**End card and banner.** The gradient, with the horizontal lockup with tagline in white or cream. The default YouTube banner and X header add a quiet grid of small white marks at 16% that fades out around the lockup (`assets/social/*-grid-*.png`).

**Studio.** Brick feature wall behind the lit cream mark, oxblood slat panels on either side, an orange LED strip at the floor line, cream chairs, gold brass, a deep floor.

**Merch.** Brick or oxblood garments with cream prints, cream mugs with oxblood marks, gold embroidery on black caps, orange enamel pins.

**Profile picture.** The cream mark centered on oxblood, mark height half the canvas. It crops to a circle cleanly.

## Motion

The intro (`assets/motion/hp-intro-on-pulse.mp4`, about 4.5 seconds):

1. **0.05 s** the H pops in (scale 0 to 1).
2. **0.50 s** a closed box pops around it (scale 0.6 to 1).
3. **1.20 to 2.16 s** the box's corner falls open and the H's leg grows down with it, forming the nub.
4. **2.55 s and 3.50 s** a heartbeat: lub-dub, twice (scale 1.07, back, 1.045, back).

Ease for pops: `cubic-bezier(.2, .9, .25, 1)`. Heartbeats use ease-in-out. Everything else in the brand moves the same way: quick pops and settles, no bounces, no spins, no long fades. Respect `prefers-reduced-motion` and show the end state.

## Voice

- The show's question: "What is humanly possible with AI?"
- Titles are concrete outcomes from real people: "She automated her whole front desk," not "How AI is transforming small business."
- Plain words, short sentences, sentence case. No hype words (game-changer, revolutionary, unlock, supercharge), no emojis, no em dashes.

## Quick start for an AI agent

1. Load `tokens/tokens.css` (or copy the `:root` block from it) and the Google Fonts link above.
2. Put the page on `var(--hp-oxblood)` with `var(--hp-cream)` text.
3. Headlines: `font: 800 clamp(2.5rem, 6vw, 4.5rem)/0.95 var(--hp-font-display); letter-spacing: -0.03em;`
4. Use orange once. Use gold for one number or one word. Brick only on physical and feature surfaces.
5. Place the logo from `assets/logo/svg/` or the inline mark above. Never type the name as a logo.
6. Check every text color against the contrast table.
