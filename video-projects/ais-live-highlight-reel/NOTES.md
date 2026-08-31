# #23 Post-Event Highlight Reel — SCAFFOLD (placeholder-heavy)

HEAVY. Released 3-5 days post-event. The best moments from both days; drives word-of-mouth
and sets up what's next. **Majority placeholder** — production happens during/after the event;
real footage/numbers get dropped in later.

- Duration **105s** (target 90-120), 1920x1080, 30fps. Lints 0/0.
- Style: AIS LIVE command-deck (style-library `03-ais-live`), latest motion: background-only
  camera (text pin-sharp), fast whip cuts + streak that OVERLAP (no fade-to-black), all-white
  AIS+ mark component available.

## Beats (10)
1. S1 Title open (0-6) — AIS LIVE mark flash + "2026 · THE HIGHLIGHTS".
2. S2 Hook (6-13) — "Two days. One community."
3. S3 Day 1 montage grid (13-27) — 6 dashed footage slots (Build Day).
4. S4 Big-moment stat (27-35) — count-up. **Placeholder stat.**
5. S5 Day 2 montage grid (35-49) — 6 dashed footage slots (Earn Day).
6. S6 Reaction full-bleed (49-61) — clip placeholder (`#s6frame`).
7. S7 Numbers recap trio (61-71) — ATTENDEES / SESSIONS / DEALS count-ups. **Placeholder numbers.**
8. S8 Member quote (71-81) — placeholder.
9. S9 Forward-looking — **NEUTRAL, no September naming** ("This is just the beginning." + `[ TBC ]`).
10. S10 Outro AIS LIVE mark hold (91-105) — "See you soon."

## What to swap post-event
- S3/S5 grids: replace each `.slot` with a real photo/`<video>`.
- S4 `#bignum` + S7 `#n1/#n2/#n3` targets (in the JS `countUp` calls).
- S6 `#s6frame` `.slot`: drop a root-level `<video muted playsinline data-has-audio="false">` +
  sibling `<audio>` (see AIS+ membership project for the exact pattern); 1200x675.
- S8 quote/clip; S9 forward beat copy once specifics are confirmed.

## Build / preview / render
```
cd video-projects/ais-live-highlight-reel
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js lint
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js snapshot . --at <secs> --output snapshots/x.png
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js render --quality standard --fps 30 --output renders/highlight-reel.mp4
```
