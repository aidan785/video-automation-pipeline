# Block 4 — End of Day 1 (lobby loop after Nate's close, ~5:45 PM Day 1)

4:52.8 build (292.8s) that LOOPS on the lobby after the Day 1 close. Assembled
in the production order: wrap open → AIS Certification → AIS+ membership →
Day 1 recap → overnight challenge tease → see you tomorrow / doors 8:30 AM.

**Status:** RENDERED + DELIVERED 2026-07-08. `renders/day1-close-fill-final.mp4`
(4:52.8, 50.9 MB, standard 1080p30, fast pipeline 2m38s) uploaded to Drive
"Block 4 Asserts" (folder `1rpFus0UeWtCANM5_C9jPz_yMlbEWRVUQ`) as
"AIS LIVE - Block 4 - End of Day 1 Loop (4 min 53 sec).mp4"
(file `1bmV44NDJghK_ULxYoxAzlLFGuZp_UFMQ`). Rendered-file spot checks passed:
frames (wrap open, CAIC mid, membership testimonial, recap agenda w/ "Get AIS
Certified", 8:30 doors card) + audio (cert -26 dB voice, membership -38 dB
voice, authored sections silent). Cert naming corrected to "AIS Certified"
(NOT AIS+) per Aidan before render.

## Structure — single sequence, 19 beats, calm loop seam

1. **Wrap open** — "That's a wrap on Build Day." + "You showed up. You built."
   + 1300+ builders stat (verified number, end-of-day labels).
2. **AIS Certification** — intro tagline ("Launched today, main stage, 5:05 PM",
   verified facts) + the MOUNTED cert video (56.64s, voice audio): the CAIC
   (Certified AI Consultant) piece, source
   `~/Downloads/AIS Live Videos/CAIC Video/caic-booth_completed.mp4`, copied to
   `assets/video/cert-launch.mp4` (1080p30 H.264+AAC, used as-is) with
   poster/lastframe brackets. If a newer cut lands: replace the mp4, re-extract
   brackets, re-run `node _gen.mjs --set` (duration recomputes; the earlier
   dashed-placeholder path still exists in the generator if the mp4 is removed).
3. **AIS+ membership** — lead-in ("Built all day? Get paid next.", copy
   deliberately differs from the ad's own opening line) + the mounted 66s ad
   (current version, Nate slot removed, voice audio) copied from Block 3.
4. **Day 1 recap** — "Look at what we covered." + 10-row recap agenda (v7.1
   verbatim titles/times, 10:15 Welcome → 5:20 Closing Remarks) + Duy Nguyen /
   Amy Simpson / Tonia Hardeman quotes + 100K+ automations stat (verified sets).
5. **Overnight challenge tease** — GENERIC by design (Nate set the specifics
   live at the close; nothing invented): "The overnight challenge is on." /
   "Build tonight. Bring it tomorrow." / "What you ship tonight starts Day 2."
6. **See you tomorrow** — "Build day is done. Now let's get paid." (Day 2 Earn
   Day callback) + big 8:30 doors card (AM Central · Sunday, July 12) +
   settling markflash "See you tomorrow. Doors open 8:30 AM Central."

## Loop seam (doors-open-loop pattern)

- Final markflash settles out fully ~0.1s before D; the wrap lands on calm
  background as the open's entrance rises. No whip at the seam.
- D padded to a multiple of 1.6s (161 cycles) so the live-dot pulse + ring tile;
  yoyo ambients use even segment counts (start AND end at rest); grid scroll is
  1716px = 26 × 66px so it tiles.

## Audio

Mounted pieces (AIS+ ad; cert video when it lands) keep voice audio (muted
`<video>` + sibling `<audio>`, data-volume 1). Authored cards silent — lobby
music bed underneath at playback.

## Build / preview / verify

```
node _gen.mjs --set          # regenerate index.html (picks up cert-launch.mp4)
npx hyperframes lint         # 0 errors; 1 accepted warning (single-file size)
npx hyperframes preview      # Studio (took :3009 this session)
node _shots.mjs --port 3009 <t> <t> ...   # Playwright frames via live player -> frames/
```

## Sources

- Day 1 program: Agenda v7.1 (doc 1TnnCp3zNzf2JgP5I2_iL347rDH2Raa5fV1DcSMKTL18),
  recap rows verbatim from ais-live-day1-agenda/_gen-agenda.mjs
- Doors 8:30 AM: Day 2 "Virtual Doors Open + Expo, 8:30a" (doors-open loop +
  day2 cards), confirmed by Aidan in the Block 4 brief
- Mounted render: ais-plus-membership.mp4 + brackets copied from Block 3
- Quotes/stats: the verified doors-open-loop set (face-checked shortlist)
- Engine: forked from ais-live-lunch-fill/_gen.mjs (command-deck style); no
  sponsor/rooms/worksplit beats needed here, so those renderers were dropped
