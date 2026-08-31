# Eisenberg Paper — Design Spec

**FORMAT: vertical short-form, 1080x1920 (Reels / TikTok / Shorts).** This style deviates
from the library's 1920x1080 default on purpose — the source material is vertical and the
cards are composed for a phone. Landscape variants are a follow-up if ever needed.

> Source of truth: the reference frames in `references/` (pulled from five Greg Isenberg
> Instagram reels, analyzed frame-by-frame 8/18). Everything below is derived from them.
> The bar: a viewer should think the card came out of an actual Greg Isenberg video.

## Style Prompt (the baked-in spec — quote this when directing the style)

Tactile paper editorial style: warm off-white paper canvas with faint graph grid fading at
edges, subtle film grain, soft vignette plus gaussian edge defocus (center sharp, edges
blurred like a macro lens). All elements are physical matte cards: charcoal rounded-28px
terminal windows with three-dot chrome, mono type, and dual shadows (tight contact + wide
soft ambient, offset down-right) plus a 1px top bevel highlight. Headlines in chunky serif,
words stacked with ragged offsets, mixing roman and italic, emphasis words in coral or
sage. Terminal/pill text in IBM Plex Mono uppercase. Motion: every element drifts
constantly (5px sine float, independent phases), text builds word by word synced to VO,
cards slide up from bottom with motion blur and back.out settle, outgoing elements blur
and ghost to 20% opacity instead of disappearing, focus pulls between layers. Beats every
1.5-2.5s, no hard cuts.

## Colors

- Paper canvas: `#E2DDD6` falling to `#C9C3BC` at the vignette edges
- Ink / charcoal cards: `#1B1A19` / `#1C1B1A` (never pure black)
- White paper tags: `#F6F4F0`
- Coral (hot emphasis): `#DF6B4F`
- Sage (calm emphasis): `#93BFA7` — brighter `#9FD6B4` mint for highlighted mono inside dark cards
- Lime `#A8E05F` exists ONLY as an icon-sticker accent, never for type

These must match `tokens.css`.

## Typography

- Display / headline: `DM Serif Display` — the only headline voice. Words stack vertically
  with ragged left offsets (each word indented differently, like a typesetter's proof).
  Roman and italic MIX inside one phrase; italic marks the emotional word. Emphasis words
  take coral or sage. `Instrument Serif` is the approved lighter alternate.
- Mono / everything-on-a-card: `IBM Plex Mono` — terminal output, pills, tags, numbered
  lists. Pills and tags are UPPERCASE with 0.08em tracking and a `> ` prompt prefix.
- There is no sans-serif anywhere in this style.

## Texture & light (half the identity — never skip these layers)

1. **Graph grid** on the paper, 88px cells, fading out toward the edges (radial mask).
2. **Film grain** — seeded SVG turbulence at ~5%, multiply.
3. **Vignette** — soft warm darkening at edges.
4. **Edge defocus** — a radial-masked `backdrop-filter: blur(5px)` ring: center tack
   sharp, edges melt like a macro lens. This is the "shot on a desk" tell.
5. **Dual shadows** on every physical element: tight contact shadow + wide soft ambient
   offset down-right (+ far spill on big cards). Dark cards also get a 1px top bevel
   highlight (`--card-hi`). Shadows are warm-toned, never grey.

## Motion

**Brand Motion Identity (per the LottieFiles motion-design framework, adopted 8/19):**
personality = Premium x paper material. Signature entrance ease `back.out(0.9)` (~4%
overshoot, paper's 3-5% budget); pops `back.out(1.0)`-`(1.05)`; text `power3.out`; exits
`power2.in` at ~65% of entrance duration. Duration palette: quick 0.35s / standard 0.55s /
slow 0.9s. Entrance pattern: slide-up ~780px (1/3-rule compliant, NOT full-screen) with
fade-in, a -22px lateral arc, and blur 10px→0. Stagger budgets: decorative cascades total
<500ms (0.14-0.15s steps); only VO-paced narrative staggers may exceed. Follow-through:
card chrome + mascot trail the card landing by ~80ms. Keycap press keeps its spring
(interactive feedback exemption).


- CAMERA (the realism layer v1 lacked): the whole scene INCLUDING the paper slowly
  pushes in ~5% over the card (linear, `.ep-cam` wrapper, origin 50% 42%) plus a
  handheld sine drift of ±6px / ±0.25°. Paper overscans -60px so edges never show.
- Entrance feel: physical. Cards slide up ~780px with fade-in, lateral arc, and motion
  blur (10px → 0), settling with the signature `back.out(0.9)` in 0.9s. Icon stickers
  scale-pop (0.6 → ~1.04 → 1). Words build one by one: stagger ~0.13s, each from
  blur(5px) / +14px / 96% scale to sharp ink.
- Exit feel: GHOST, don't cut. Outgoing groups blur to 5px and fade to 20% opacity
  (a rack-focus pull), sit one beat, then leave. Never `autoAlpha: 0` an element in
  a single hop while a new one enters.
- Imperfection: every element carries a BAKED static rotation of 0.3-1° in CSS (on the
  inner .mover, never the animated .drift wrapper) and sits off-grid. Nothing is
  perfectly straight or centered.
- Ambient: EVERYTHING drifts, always — ±4px x/y sine float + ~0.35° rotation, periods
  2.8-4.2s, phases seeded per element (mulberry32, fixed seed). A still frame should
  never repeat.
- Timing: a beat every 1.5-2.5s inside the card; cards run 5-8s (tier1) / 4-6s (tier2)
  and end on a breathing hold (drift continues, nothing new enters).

## Card kinds in this style

- tier1 takeovers: `thesis` (stacked kinetic serif), `stat` (white price tag + count-up
  over a mini terminal), `section` (icon sticker + italic serif label), `quote`
  (stacked serif + white attribution tag), `overview` (terminal window + pill badges).
- tier2 overlays (transparent, speaker stays visible): `label` (single white paper tag,
  dashed connector stub), `list` (numbered mono pills stacking in), `lower-third`
  (pill pair sliding up bottom-left).
- innovations: `custom/icon-connect` — app-icon sticker wired to a mini terminal card
  by a dashed connector that draws on (the "plugin diagram" from the reels).

## What NOT to do

- No pure black, no pure white, no cool greys — every neutral is warm.
- No sans-serif type. No drop-caps. (Bold 600 mono IS correct on pills/tags — the
  reference zoom proves it — but terminal body text stays regular weight.)
- Never leave an element static — a card with no drift breaks the illusion instantly.
- Never hard-cut an element away; ghost it (blur + 20% opacity) first.
- Never animate filter-blur on gradient-clipped text (workspace descender-chop bug);
  blur lives on wrapper divs only.
- Don't stack more than one coral AND one sage emphasis in the same phrase; the
  reference uses at most two colored words per screen.
- No glassmorphism, no gradients on type, no glow — light is matte and photographic.
- Don't skip the lens/grain/vignette layers on tier1 "to keep it clean" — the texture
  stack IS the style.
