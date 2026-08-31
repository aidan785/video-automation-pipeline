# Doors-Open Loop (#1) — long-form energy montage

The production brief for #1 is a 3-5 min energy-building montage that plays 6-8x
across the 30-min doors-open window (one version, both days). The original
`doors-open` card was a single 16s welcome slate meant to be tiled by playback
software — technically fills the window but reads as a static hold. This replaces
it with one ~3.5 min composition that rotates through ~34 distinct beats so each
loop feels like a show.

**Status:** draft scaffold. Look + copy + timing + motion locked; photo / headshot /
logo / quote slots are dashed placeholders.

- Duration ~179s (2.99 min), 35 beats, 1920x1080, 30fps. Padded to a 1.6s multiple so
  the ambient (live-dot / ring / grid) tiles seamlessly at the loop point.
- Reworked 2026-07-03 for MORE energy: faster whip cuts (whipOut .26s, word stagger
  .05, tighter entrances), shorter beats (heroes 4s / taglines 5s / stats 5s), more
  beats = more to look at. Descender padding hardened (`.wd` bottom .32em, `.num` .26em)
  so italic-900 y/g/comma tails never clip.
- Seamless loop: ends on a welcome beat so the seam returns home gracefully.
- Brand: AIS LIVE command-deck (onyx, blue #37bdf8, coral accents, grid + glow +
  vignette + grain, persistent AIS/LIVE corner mark with pulsing red dot).

## Structure (6 acts, 36 beats, 192s)
1. Arrival / welcome — "You made it. Grab a seat." / "Doors are open."
2. The community (PROOF) — largest global AI automation community; 400K+ members,
   40M+ views, 100K+ automations shipped, $X revenue (placeholder); "A movement."
3. What this is — Build Day -> Earn Day, 2 days / July 11-12, 25+ speakers, 30+ sessions
4. Who's here — 3 real speaker pages (12 cards), **VIDEO TESTIMONIAL block** (4 real
   muted clips: Glenn $60K / Mike $6K / Aidan $14K / Latoya $24K, split stat+clip
   Glenn-format w/ side-swipe match cuts), 2 text testimonial quotes, sponsors
5. What's coming — FULL schedule, every session (from Agenda v7.1, doc
   1TnnCp3zNzf2JgP5I2_iL347rDH2Raa5fV1DcSMKTL18), then "Start building" / "Let's get to work".

## Full schedule cards (added 2026-07-07)
Every Day 1 (24) + Day 2 (25) session is listed. Edit the `DAY1_SCHED` / `DAY2_SCHED` arrays
in the generator; `scheduleBeats()` auto-splits into compact agenda cards with "1/3" counters
(Day 1 = 8 per card -> 3 cards; Day 2 = 7 per card -> 4 cards). Agenda CSS is compact (40px
rows) to fit ~8 rows/card. This is why the loop is now ~4.4 min. NOTE: the Day 2 list includes
"Clay Working Lunch Session" (it's on the official agenda) even though the CLAY sponsor logo was
removed from the sponsor beat earlier — remove that one row if it shouldn't appear.
6. Proof + reset — "You're next.", "right room" close, mark flash, welcome (loop seam)

## Member win cards (added 2026-07-08, Block 1 style)
`type: "win"` beats = split card (MEMBER WIN eyebrow + gradient headline + summary + name
LEFT, Skool "Wins" post screenshot RIGHT in a rounded frame). Ported from
`ais-live-block1-opening` (winwrap/wintext/winhead/winsub/winname/winshot CSS + shotIn).
5 added, distributed: David Kim $385K (Act 2), Jacob West / Tyler Capps (Act 4 w/ the
testimonials), Mohammad Sallam / Joe Scott (Act 6). Screenshots at `assets/wins/*.png`
COPIED FROM block1-opening's VERIFIED set (the raw Downloads folder auto-mapping was
unreliable — filenames use U+202F before AM/PM and the OCR agent mis-attributed which post
was in which file; always verify a win screenshot by Reading it before shipping $ claims).
To add more: copy a verified screenshot to assets/wins/ and add a `{type:"win", img, name,
pre, accent, sub}` beat. Non-Block1 fresh wins available if wanted (Abel Alvarado $3K paid-
in-an-hour, Maciej Wesolowski, James Joens) but need per-file verification.

## Action cards (added 2026-07-07)
`type: "action"` beats = doors-open directives (renders like a tagline: eyebrow + headline +
sub, blue/coral accent). 5 distributed across the loop so a different one rotates in each pass:
Build your agenda / Complete your profile / Visit the Expo / Jump into Networking / VIP Q&A at
9:30. Edit copy in the BEATS array. "action" is grouped with welcome/tagline/hero in sceneBody
+ the words() entrance.

## Video testimonials (added 2026-07-03)
Root-level `#teststage` (outside #camera so it stays pin-sharp), ported from the AIS+
membership ad but SILENT — muted `<video>` (`data-has-audio="false"`), NO `<audio>`
siblings. 4 clips staged at `assets/testimonials/*.mp4` (+ `glenn-poster.jpg`). Config
lives in the `TESTI` object in `_gen-doors-loop.mjs` (name / unit / $ figure / per-clip
dur). Swipe engine: `swipeCut` + `tset` + `countUpDollarK` + `riseSlot` helpers. Videos
on tracks 90-93. To add/swap a member: edit `TESTI.members` and drop the mp4 in.

NOTE: no unverified future-event content (no September / Austin / in-person tease) —
per direction, never reference future events that aren't confirmed.

## Generator
`node _gen-doors-loop.mjs --set` regenerates `cards/doors-open-loop.html` (SILENT) and
copies it to `index.html`. Add `--sfx` to layer in the soft audio kit -> writes a
separate `cards/doors-open-loop-sfx.html` and (with `--set`) points index.html at it.
Edit the `BEATS` array to change the program; durations auto-pad to a seamless 1.6s
multiple.

## Sound (added 2026-07-03, soft, toggleable)
`--sfx` mixes a synthesized soft audio kit (ffmpeg-generated, in `assets/sfx/`):
- `bed.wav` — warm A-major ambient pad under the whole loop (data-volume .16)
- `whoosh.wav` — soft airy swell on every whip cut (.20)
- `impact.wav` — soft low thump on stat pops / mark flash / testimonial swipes (.22-.30)
- `riser.wav` — soft swell under each count-up (.14-.15)
Regenerate the kit: see the ffmpeg block in session history (anoisesrc/sine/aevalsrc).
Tune levels via the `data-volume` args in the `audio(...)` calls in the generator.
**SILENT FALLBACK:** `node _gen-doors-loop.mjs --set` (no `--sfx`) instantly reverts
index.html to the no-audio version. Both cards are always kept on disk.
NOTE: Studio only plays audio on PLAY, not while scrubbing. Assets resolve relative to
the composition page (a raw `/assets/...` HTTP probe 404s but playback is fine).

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
3. Sponsor logos — HyperAgent (presenting) + Glaido, both real. To add another sponsor:
   drop `assets/sponsors/<name>-white.png` and add `{ src: "<name>-white", w: 1100, role: "SPONSOR" }`
   to the sponsor beat. Placeholder support exists too: `{ ph: true, name: "NAME", role: "SPONSOR" }`
   renders a dashed on-brand wordmark until real logo art arrives.
4. Two testimonial quotes + attributions (real member wins).
5. Real numbers — the community block is 400K+ members / 40M+ views / 100K+ automations
   (treated as confirmed leverage stats). The old "$X IN NEW REVENUE" placeholder was
   REMOVED 2026-07-03 (unknown figure). Confirm exact figures with Aidan before final.
   Text-quote attributions (Tonia/Griffin/Duy/Pedro/Nick + Abdurrahman/Amy) are verbatim
   from testimonial-soundbites.md but some Descript projects were mislabeled -> face-check
   names before final render.
6. Agenda — confirm the three rows + framing against the current Schedule v6.1
   (it's a both-days loop, so keep the agenda generic or split per day).
7. Music bed — the loop is silent by design; add a licensed track at playback or
   bake one into the standard render.

## After Effects handoff (layered footage, added 2026-07-03)
`--layer=<bg|fg|mark|whip>` emits an isolation pass (everything hidden except that layer,
transparent stage) -> `cards/layer-<x>.html`. Rendered to `renders/ae/`:
`background.mp4` (opaque) + `graphics-alpha.mov` / `mark-alpha.mov` / `whip-alpha.mov`
(ProRes 4444, yuva444p12le true alpha) + `source-clips/` + `audio-stems/` + README.
~6.9 GB total (ProRes is heavy). To shrink: re-export the alpha layers as VP9 WebM
(`--format webm`) or PNG sequences. `renders/` is gitignored, so this is a local/Drive
deliverable only. Render cmd: `hyperframes render -c cards/layer-fg.html --format mov --fps 30 -o renders/ae/graphics-alpha.mov`.

## Build / preview / render
```
cd video-projects/ais-live-loops
node _gen-doors-loop.mjs --set
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js lint
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js preview   # studio :3002
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js render --quality draft  --fps 30 --output renders/doors-open-loop-draft.mp4
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js render --quality standard --fps 30 --output renders/doors-open-loop.mp4
```
