# #12 Event Closing Sizzle — SCAFFOLD (placeholder-heavy)

HEAVY. Plays after Nate's Close (Day 2 ~6:05pm). The "thank you and see you" moment:
recap of two days' wins, audience reactions, community moments, a forward beat, sticks
the landing. **Majority placeholder** — real footage/numbers get dropped in post-event.

- Duration **75s** (target 60-90), 1920x1080, 30fps. Lints 0/0.
- Style: AIS LIVE command-deck (style-library `03-ais-live`), with the latest motion:
  background-only camera (text pin-sharp), fast whip cuts + streak that OVERLAP so no
  fade-to-black, all-white AIS+ mark component available.

## Beats (8)
1. S1 Cold open (0-5) — "That's a wrap."
2. S2 Recap stat trio (5-14) — SESSIONS / BUILDERS / DEALS count-ups. **Placeholder numbers.**
3. S3 Two-days montage grid (14-26) — 6 dashed footage slots (keynote, workshop, panel, etc.).
4. S4 Audience reaction (26-36) — full-bleed clip placeholder (`#s4frame`).
5. S5 Member moment (36-46) — placeholder soundbite / pull-quote.
6. S6 Thank you (46-54).
7. S7 Forward-looking — **NEUTRAL, no September naming** ("The journey continues." + `[ TBC ]`).
8. S8 Outro AIS LIVE mark hold (63-75) — "See you soon."

## What to swap post-event
- S2 stat numbers (`#n1/#n2/#n3` targets in the JS `countUp` calls).
- S3 grid: replace each `.slot` with a real photo/`<video>` (keep the 6-up grid or reduce).
- S4 `#s4frame` `.slot`: drop a root-level `<video muted playsinline data-has-audio="false">` +
  sibling `<audio>` (see AIS+ membership project for the exact pattern); 1200x675 or 784x441.
- S5 quote/clip; S7 forward beat copy once specifics are confirmed.

## Build / preview / render
```
cd video-projects/ais-live-closing-sizzle
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js lint
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js snapshot . --at <secs> --output snapshots/x.png
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js render --quality standard --fps 30 --output renders/closing-sizzle.mp4
```
