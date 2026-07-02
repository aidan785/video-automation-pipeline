# Doors-Open Loop (#1) — long-form energy montage

The production brief for #1 is a 3-5 min energy-building montage that plays 6-8x
across the 30-min doors-open window (one version, both days). The original
`doors-open` card was a single 16s welcome slate meant to be tiled by playback
software — technically fills the window but reads as a static hold. This replaces
it with one ~3.5 min composition that rotates through ~34 distinct beats so each
loop feels like a show.

**Status:** draft scaffold. Look + copy + timing + motion locked; photo / headshot /
logo / quote slots are dashed placeholders.

- Duration ~208s (3.47 min), 1920x1080, 30fps. Padded to a 1.6s multiple so the
  ambient (live-dot / ring / grid) tiles seamlessly at the loop point.
- Seamless loop: ends on a welcome beat so the seam returns home gracefully.
- Brand: AIS LIVE command-deck (onyx, blue #37bdf8, coral accents, grid + glow +
  vignette + grain, persistent AIS/LIVE corner mark with pulsing red dot).

## Structure (5 acts)
1. Arrival / welcome — "You made it. Grab a seat." + room photos
2. What this is — Build Day -> Earn Day, 2 days / July 11-12, headcount stat
3. Who's here — speaker pages (8 headshot slots), 2 testimonial-quote slots, sponsor
4. What's coming — agenda, "1 agent shipped", earnings stat, "Start building"
5. Energy + reset — energy photos, "right room" close, mark flash, welcome

NOTE: no unverified future-event content (no September / Austin / in-person tease) —
per direction, never reference future events that aren't confirmed.

## Generator
`node _gen-doors-loop.mjs --set` regenerates `cards/doors-open-loop.html` and copies
it to `index.html` (active for preview/render). Edit the `BEATS` array to change the
program; durations auto-pad to a seamless 1.6s multiple.

## Integrated real assets (2026-07-02)
- **Speaker cards** — 12 real 4:5 branded speaker cards in 3 beats (from Drive folder 19iqPsZcjf...): Nate Herk, Matt Wolfe, Jonathan Stark, Devin Kearns, Dave Ebbelaar, Jon Morrow, Cole Medin, Sabrina Ramonov, Kacper Rutkiewicz, Alex McDonnell, Amy Simpson, Aidan Finnegan. Staged at `assets/speakers/*.jpg`. Folder has 20 total — 8 more available (Russ, Glenn Marcus, Wyatt, Samin, Pat Blakely, Anne-Marie, Tangy, Liberty).
- **Sponsors** — HyperAgent (presenting) + Glaido (sponsor), white-on-transparent logos at `assets/sponsors/*-white.png`. Only these two per Aidan.
- **Testimonials** (from Descript) — Glenn Marcus "$60,000 contract" + Amy Simpson "nearly $20,000 / sky's the limit". Both HIGH attribution confidence. Backups available (Abdurrahman Ibrahim $8K, Latoya Robinson $24K, Griffin Maklansky layoff-to-job).
- **Agenda** — real two-day schedule (Build Day July 11 / Earn Day July 12) from the updated agenda doc (1gjPAKUiDL36...). All times Central.

## Pending inputs to reach final
1. Photos — arrival / room-fill / community / prior-event / build-in-progress / crowd.
   Four dashed `.tile` strips. Swap each `<div class="tile">` for `<img>` (cover-fit)
   or a muted `<video>`.
2. Speaker headshots + real names/titles — 8 `.face` slots across two pages.
3. Sponsor logo(s) — HyperAgent slot (+ room for more). Swap `.logo` inner for `<img>`.
4. Two testimonial quotes + attributions (real member wins).
5. Real numbers — headcount (`00` placeholder) and earnings (`10K+` placeholder, ph).
6. Agenda — confirm the three rows + framing against the current Schedule v6.1
   (it's a both-days loop, so keep the agenda generic or split per day).
7. Music bed — the loop is silent by design; add a licensed track at playback or
   bake one into the standard render.

## Build / preview / render
```
cd video-projects/ais-live-loops
node _gen-doors-loop.mjs --set
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js lint
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js preview   # studio :3002
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js render --quality draft  --fps 30 --output renders/doors-open-loop-draft.mp4
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js render --quality standard --fps 30 --output renders/doors-open-loop.mp4
```
