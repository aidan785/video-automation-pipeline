# DESIGN — lottie-skill-showcase

60-second self-demonstrating showcase of the LottieFiles motion-design skill.
Every section animates IN the style it narrates. MOTION_PHILOSOPHY canvas
language (black, grid, crosshairs, vignette, grain, whip transitions, chrome
type) fused with the skill's own tables.

## Style Prompt
Cinematic dark motion piece. 90% black frame, perspective grid floor,
chrome-gradient headlines with halo glow, motion-blurred vertical whips
between every scene. Type is the main character.

## Colors (5, symbolic)
- Black canvas + chrome white->gray `#fff -> #999` (the voice)
- `#33D4C8` teal (the skill / the solution — orb, accents, terminal)
- `#FFB224` amber (personality / emphasis moments)
- `#A155FF` violet (motion itself — streaks, whips)

## Typography
- Archivo 900 (slams, labels) / Archivo 400 (support)
- Fraunces 300/900 (the "Premium" personality moment only)
- JetBrains Mono (ms values, constants, terminal)

## Scene map (VO offset +0.5s)
1. 0-6.6    "Motion is a language" — word reveal, dolly
2. 6.4-14.6 Three pillars — cards stagger on their spoken words
3. 14.4-26.6 Four personalities — SAME orb, four souls, constants shown
4. 26.4-35.6 Timing tables — bars fill at their literal durations
5. 35.4-40.2 Choreography — dashboard assembles, hero first, <500ms
6. 40.0-48.9 Rules — kinetic slams + linear-vs-eased dot race
7. 48.7-62   Outro — lockup + `npx skills add LottieFiles/motion-design-skill`, 5s+ hold

## Rules applied
- Every transition is a motion (cut-the-curve vertical whip + violet streak)
- One idea per beat, scene avg < 2s in mid-section
- Palette capped at 5 meanings, grid+vignette+grain on every scene
- Callback: the teal orb returns in the outro as the lockup mark
- Timeline Law #11 anchor, deterministic (no Math.random/Date.now)
