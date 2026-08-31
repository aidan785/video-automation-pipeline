# DESIGN — lottie-intro-opus5-blender

Test build for the LottieFiles motion-design skill. Archetype: **Premium**.

## Style Prompt
Elegant, minimal, luxury-tech. Dark charcoal glass cards floating over a light
screen-recording. Chrome-gradient serif headlines, zero overshoot, unhurried
deceleration. The motion says "measured confidence," never bounce.

## Motion constants (from lottie-motion-design, Premium archetype)
- Signature easing: cubic-bezier(0.4, 0, 0.2, 1) → GSAP `power2.out` entrances, `power2.in` exits
- Duration palette: quick 350ms / standard 500ms / slow 600ms (counters 1200ms)
- Overshoot: 0%. Never back/elastic.
- Entrances 30-50% longer than exits. Entrance = decelerate, exit = accelerate.
- Stagger budget: 80-100ms per element, total < 400ms.
- Three layers: primary card, secondary (accent rule + counter), ambient (vignette + grain).

## Colors
- `#101214` ink glass (card ground, 0.82 alpha + blur)
- chrome text `#fff -> #b9bec4` (brand voice)
- `#D97757` coral (Opus 5 — the new number)
- `#8A97A0` slate (Opus 4.8 — the old number)
- nothing else.

## Typography
- Fraunces 300/900 (display, statements)
- Archivo 400/700 (labels, uppercase, +0.12em tracking)

## What NOT to do
- No bounce, no jitter, no rotation wobble (that's Playful/Energetic).
- No pure-white flat text; headlines get the chrome gradient.
- No card in the bottom-right 420x330 corner (webcam bubble).
- No more than one overlay visible at a time after the cold open.
