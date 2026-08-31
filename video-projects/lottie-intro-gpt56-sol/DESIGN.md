# DESIGN — lottie-intro-gpt56-sol

Test build for the LottieFiles motion-design skill. Archetype: **Energetic**.

## Style Prompt
Bold, fast, competitive. Slammed uppercase type, light-streak whips, hard
solar-amber accents over dark Blender UI. Motion says "this is a race and
Sol is winning." Everything hits fast and settles with visible overshoot.

## Motion constants (from lottie-motion-design, Energetic archetype)
- Signature easing: ease-out-expo → GSAP `expo.out` entrances; overshoot moments use `back.out(2.2)` (~20-30%)
- Duration palette: quick 120ms / standard 200ms / slow 250ms
- Exits: `expo.in` / `power2.in`, 120-180ms
- Stagger: 50-70ms, total < 300ms
- Three layers: primary slam type, secondary (streak + underline snap), ambient (vignette + grain drift)

## Colors
- `#0A0B0C` ink panel ground
- chrome white `#fff -> #b9bec4` (voice)
- `#FFB224` solar amber (Sol — the challenger, the highlight)
- `#A155FF` magenta-violet (speed/energy, streaks only)
- nothing else.

## Typography
- Archivo 900 uppercase, tight tracking (slams)
- Archivo 400/700 (labels, +0.14em tracking)

## What NOT to do
- Nothing slower than 300ms except holds.
- No serif, no soft glass elegance (that's Premium).
- No card in the bottom-right 420x330 corner (webcam bubble).
- Amber owns Sol; violet owns motion streaks. Never swap.
