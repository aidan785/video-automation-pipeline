# Block 8 — Closing Stage Loop (End of Day 2 / After-Party hour, 6:10-7:10 PM)

~8 min build that LOOPS in the general room while the VIP After-Party runs.
Assembled in the production order from Aidan's Block 8 brief:
wrap open -> AIS+ membership (welcome new members) -> sponsor thank-you ->
event highlights / testimonials -> calm loop seam.

The **Closing Sizzle is separate** — it plays once at the very end of Nate's
close (6:08), not in this loop.

**Status:** built + frame-verified 2026-07-08 (8:12.8 / 492.8s, 28 beats).
RENDERED + delivered to Drive Block 8 Assets 2026-07-09.
**UPDATED 2026-07-11:** +4 real Day 1 session-highlight clips ("FROM THE STAGE"
run after the recap agenda, same card as the community voices but with the
session tag as the label) + 1300+ builders stat bumped to 1600+. Now 33 beats,
598.4s (9:58 loop, still inside the 8-10 brief). Lint 0 errors, new cards
frame-verified via the live player. RENDERED same day on Aidan's go (fast
pipeline, 5m35s, 96MB) + rendered-MP4 frames re-verified; DELIVERED to
`/Volumes/Extreme SSD/AIS LIVE Assets/Block 8/AIS LIVE - Block 8 - Closing
Stage Loop.mp4`. The 7/9 Drive "Block 8 Assets" render remains STALE.

**Descript gotchas hit this build:** published DELETE-ME comps can carry baked
fade-in/out transitions (black first/lastframe) — fix by prompting the project
agent to remove transitions on that comp, then republish. And one source
recording (Nick Mohler) was mirrored — caught via backwards background logo,
fixed with ffmpeg hflip.

## Structure

1. **Wrap open** — "That's a wrap on AIS LIVE." + two days/one community +
   1300+ builders stat (verified set, end-of-event tense).
2. **AIS+ membership** — NEW-MEMBER welcome lead-in ("Just joined? Welcome
   home.", copy deliberately differs from the ad's own opening line) + the
   mounted 66s ad (current Nate-removed render, voice audio).
3. **Sponsor thank-you** — HyperAgent (PRESENTING SPONSOR) 60s slot + Glaido.
   **NO Clay** — removed as sponsor 2026-07-07 event-wide, reconfirmed by Aidan
   for Block 8 on 2026-07-08 (his brief predated the removal).
   **HyperAgent's real 60s spot is still not delivered** — drop it at
   `assets/video/hyperagent-60.mp4` + re-run `node _gen.mjs --set` and it
   mounts 1:1; until then a finished-looking logo spotlight holds the full 60s.
4. **Highlights / testimonials** —
   - two-day recap agenda: verbatim session titles, deliberately NO times
     (Day 2 times not re-verified against the latest agenda revision)
   - **4 Day 1 session-highlight clips** (added 2026-07-11): Dave Ebbelaar
     "no code in six months" (30.1s), Liberty White "your tribe will find you"
     (36.9s), Sabrina Ramonov "zero edits, going viral" (13.3s), Mustafa Tawfiq
     "the value you deliver" (13.4s). Real footage cloned from Block 5's
     word-accurate recap cuts into `assets/recap/` (cutter:
     ais-live-day2-sizzle-clips/_cut-recap.mjs). Same voice-card layout; the
     `dir`/`tag`/`role` fields on a voice def switch the card into highlight
     mode. Missing clips are skipped at gen time with a warning.
   - both testimonial reels mounted (testi-building 63.96s + testi-earning 69.93s,
     current renders incl. the Miguel Zamarripa swap). 2026-07-09: swapped in the
     7/8 16:13 re-renders — the earlier copies had the clipped 'y' in "What They
     Built/Earned" baked in (and yellow "Earned"); fresh renders have the fixed
     descender padding + all-blue accent. Brackets regenerated, durations
     re-probed, mounted titles + exit seams frame-verified via the live player.
   - **6 fresh "community voices" clips** (native beats, rounded 16:9 box left +
     name/quote right, voice audio): Tonia Hardeman, Marvin Martinez, Jan
     Goergen Makinson, Usman Mohammed, Nick Mohler, Maria Somana — members NOT
     in either mounted reel. Extracted non-destructively from Descript
     (AFTERPARTY CLIP DELETE-ME comps, standard crop). Clips live at
     `assets/voices/<slug>.mp4` + `-poster.jpg`/`-lastframe.jpg`; missing clips
     are skipped at gen time with a warning.
   - text quotes: Duy Nguyen (clip uncroppable — text only) + Lutfiya Miller
     (swapped out of the building reel, so unused elsewhere)
5. **Close / loop seam** — "This is just the beginning." (neutral, no September
   event per standing directive) -> settling markflash. Doors-open-loop seam:
   D padded to a 1.6s multiple, even yoyo segment counts, grid scroll tiles.

## Audio

Mounted pieces + voice clips keep voice audio (muted `<video>` + sibling
`<audio>`, data-volume 1). Authored cards silent — room music bed underneath.

## Build / preview / verify

```
node _gen.mjs --set          # regenerate index.html (picks up hyperagent-60 + voice clips)
npx hyperframes lint
npx hyperframes preview
node _shots.mjs --port <p> <t> <t> ...   # Playwright frames via live player -> frames/
```

## Sources

- Engine: forked from ais-live-day1-close-fill/_gen.mjs (+ sponsor renderer /
  glowIn from ais-live-lunch-fill; new `voice` beat type)
- Mounted renders: membership from Block 4 copy; testi reels from Block 3 copy
  (verified same durations as canonical ais-live-testimonials/renders)
- Highlight titles: Day 1 verbatim v7.1 recap set; Day 2 verbatim from the
  doors-open schedule set (titles only, no times)
- Quotes/stats: verified testimonial-soundbites shortlist + doors-open stat set
  (1300+ / 100K+ / 25+ speakers)
- After-party window: "6:10p VIP After-Party with Nate" (schedule set)
