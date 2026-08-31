# Aft Block — Day 2 Afternoon Loop (plays after the Day 2 lunch break, ~2:10 PM)

Exactly 10:00 (600s = 375 x 1.6s ambient beats, loop-clean) that LOOPS after
lunch on Day 2. Per Aidan's brief (2026-07-11): "afternoon schedule with some
testimonials, notes from our thinking, and our sponsors... the main thing is
the schedule."

**Status:** built + frame-verified 2026-07-11 (35 beats, lint 0 errors).
Gate 1 Studio sign-off pending (:3015). NOT rendered (render only on approval).

## Structure

1. **Welcome back** — "Lunch is done. Back to earning." + 1600+ builders stat.
2. **The afternoon (the star)** — full Day 2 afternoon schedule from 2:10 PM
   (verbatim v7.1 set, same rows as Block 5's Day 2 agenda: Clay dropped, VIP
   1:35 rooms collapsed; here from the post-lunch restart onward, 11 rows) +
   "Up next: pricing." pointer at the 2:10/2:25 run.
3. **Notes from the stage** — 3 Earn-Day-themed Day 1 session clips (same
   voice-card layout, session tag as label): Kodi Zene value-based pricing
   (37.5s), Dave Ebbelaar ditching hourly (33.7s), Mustafa Tawfiq scoping
   (37.3s) + Amy Simpson / Abdurrahman quote cards. Clips cloned from Block 5's
   recap cuts (`assets/recap/`).
4. **Testimonials** — both mounted reels (building 63.93s + earning 69.9s,
   current fixed renders) + all 6 community-voice clips (Tonia/Marvin/Jan after
   building, Usman/Nick/Maria after earning) + Duy/Griffin quotes + 100K+ and
   400K+ stats.
5. **Sponsors** — HyperAgent 60s slot (drop the real spot at
   `assets/video/hyperagent-60.mp4` + re-run `node _gen.mjs --set` for a 1:1
   mount; logo spotlight holds until then) + Glaido 12s + Pedro quote. NO Clay.
6. **Schedule reprise** — the afternoon lineup once more (main thing).
7. **Close / loop seam** — "Let's finish strong." -> settling markflash.

## Duration tuning

TARGET=600; remainder after fixed beats goes to the two agenda holds (up to
+8s each — more schedule read time) then the final markflash. Current build:
both agendas absorbed the full +8s, pad 0 on the markflash.

## Build / preview / verify

```
node _gen.mjs --set
npx hyperframes lint
node _shots.mjs --port <p> <t> <t> ...   # Playwright frames via live player -> frames/
```

Render (fast pipeline): pinned .hf-cli 0.7.42 cli.js, `--quality standard
--workers auto --gpu --video-frame-format jpg`.

## Sources

- Engine: forked from ais-live-day2-close-fill/_gen.mjs (voice cards double as
  highlight cards via dir/tag/role fields)
- Schedule rows: Block 5 (_gen.mjs DAY2 v7.1 set), 2:10 PM onward
- Quotes/stats: verified Block 5 sets (money-themed picks; Tonia/Nick quote
  lines excluded — they have voice cards here)
- Reels + voices: cloned from Block 8 assets (current fixed renders)
- Highlight clips: Block 5 assets/recap (cutter: ais-live-day2-sizzle-clips)
