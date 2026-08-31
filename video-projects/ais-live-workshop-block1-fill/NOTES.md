# Block 2 — Workshop Block 1 Fill (main stage, Day 1 · 12:45–2:00 CT)

75-min fill that plays on the main stage while Workshop Block 1 runs in the rooms.
One ~12.9 min build (≈14.6 min once the HyperAgent 60s spot lands), loops across the
window. Program per production direction, in order: directing (pick + join your room)
→ AIS+ membership → community testimonials → sponsor reel → expo/networking prompt → loop.

**Status:** draft built + frame-verified in the live player. NOT rendered — Gate 1
(Studio preview sign-off) pending.

## Structure — two varied rotations (pass A / pass B)

Each pass runs the full sequence; copy, testimonial reel, and the "what's next" block
alternate so back-to-back loops don't read identical:

| Act | Pass A | Pass B |
| --- | --- | --- |
| 1 · Directing | "Workshops are live." + 12:45 worksplit card (48s + 36s holds) + how-to-pick (Foundation=Liberty White / Advanced=Dave Ebbelaar, Agenda v7.1) | same skeleton, varied copy |
| 2 · AIS+ | "Every workshop template is saved for members." → **ais-plus-membership.mp4 (66s, voice)** | same |
| 3 · Testimonials | **testi-building.mp4 (64s, voice)** | **testi-earning.mp4 (70s, voice)** |
| 4 · Sponsors | HyperAgent (presenting) + Glaido logo beats (Clay removed per Aidan 2026-07-07) | same |
| 5 · Expo | Visit the Expo / Jump into Networking / "work the floor" | "make one connection" variant |
| 6 · What's next | afternoon agenda card | WB2 3:10 worksplit tease (Sabrina / Samin) |
| 7 · Proof + reset | stats (400K+/1300+) + quotes + "until 2:00" + markflash | stats (100K+/40M+) + other quotes |

## HyperAgent 60s spot (sponsor-provided, pending)

Drop the file at `assets/video/hyperagent-60.mp4` and re-run `node _gen.mjs --set` —
the generator probes its duration and mounts it full-screen (with audio) in BOTH
passes, replacing the HyperAgent logo beat. Until then the slot renders as a
finished-looking logo beat (never a dashed placeholder — this loops on stage).

## Audio

Mounted pieces (AIS+ ad, testimonial reels, HyperAgent spot) keep their voice audio
(muted `<video>` + sibling `<audio>`, data-volume 1). All authored cards are silent —
venue runs a music bed underneath at playback.

## Mounted-video pattern (`mount` beat type)

Finished mp4s live in `assets/video/` with `-poster.jpg` / `-lastframe.jpg` brackets
(ffmpeg-extracted) so there's no startup flicker or tail black-frame; beat duration =
source duration + 0.4s lastframe hold that the exit whip rides on. Mount stages sit at
root level (z-index 20) above #camera — they also cover the corner mark, which avoids
a double AIS LIVE bug since the reels carry their own.

## Build / preview / verify

```
node _gen.mjs --set          # regenerate index.html (also picks up hyperagent-60.mp4)
npx hyperframes lint         # 0 errors; 2 accepted warnings (dup poster img via double
                             # membership mount; single-file size — established loop pattern)
npx hyperframes preview      # Studio (took :3012 — stale servers from old sessions hold 3002-3011)
node _shots.mjs <t> <t> ...  # Playwright frame shots via the live player
                             # (window.__player.seek on /api/projects/<slug>/preview) -> frames/
```

## Sources

- Workshop data: Agenda v7.1 (doc 1TnnCp3zNzf2JgP5I2_iL347rDH2Raa5fV1DcSMKTL18)
- Mounted renders: ais-plus-membership + ais-live-testimonials (current Mike→Miguel-swap reels)
- Logos: hyperagent-white-big (from sponsor-stings, white lockup), glaido-white
- Quotes/stats: the verified doors-open-loop set (no unconfirmed future-event content)
