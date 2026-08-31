# DESIGN — lottie-intro-seedance25

Test build for the LottieFiles motion-design skill. Archetype: **Playful**.

## Style Prompt
Bouncy, friendly, toy-like. Rounded chips that pop in with squash-and-settle,
gentle rotation wobbles, a growing "what's new" checklist that accumulates as
each stat is spoken. The source video already carries dark produced slides, so
overlays COMPLEMENT (progress checklist, celebration trio), never duplicate
the on-screen numbers.

## Motion constants (from lottie-motion-design, Playful archetype)
- Signature easing: ease-out-back → GSAP `back.out(1.7)` entrances (~10-20% overshoot)
- Duration palette: quick 150ms / standard 240ms / slow 300ms
- Exits: `power2.in`, 150-200ms
- Stagger: 60-90ms, total < 400ms
- Idle life: tiny rotation wobble via sine, ±0.6deg
- Three layers: primary chips, secondary (check icon draw + tick pulse), ambient (vignette + grain)

## Colors
- `#101214` ink chip ground
- `#33D4C8` teal (Seedance — the brand carrier)
- `#FFD84A` sun yellow (the "new" celebration accent)
- white text
- nothing else.

## Typography
- Archivo 900 (titles), Archivo 700 (chips)
- Caveat 700 (handwritten "new!" accents only)

## What NOT to do
- No chrome-serif elegance, no expo slams.
- Never restate a number the on-screen slide is already showing full-size;
  the checklist row uses the short label only.
- No card in the bottom-right 420x330 corner (webcam bubble).
- Wobble stays under 1deg; playful, not sloppy.
