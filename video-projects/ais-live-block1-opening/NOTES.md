# AIS LIVE — Block 1: Opening (45:00)

The 45-minute opening program for the general room, 9:30-10:15 AM CT Day 1
(plays once while the VIP Q&A runs in the VIP room; no loop). Assembled per
Aidan's 2026-07-08 spec, in order, soft-looping back to the welcome until the
window fills, then a fixed "Welcome to AIS Live, starting now" outro lands as
the main stage opens at 10:15.

## Program (one pass, repeats with rotation)

1. Welcome title / hype open — **PLACEHOLDER BOX** (Aidan's own asset)
2. Day 1 agenda walkthrough (3:00, mounted render)
3. Get set up: agenda / booths / networking (1:01, mounted)
4. VIP prompt: Q&A with Nate live now (0:34, mounted)
5. What's coming today, session teasers (1:24, mounted; multi-speaker beats use circle medallions)
5b. Speaker spotlights — 34 portrait cards, 9 fresh per pass (Day 1 passes 1-2,
    Day 2 "TOMORROW" passes 3-4); solo cutouts fill top-to-bottom (4:5 at 96%,
    squarish at 88%), 2+ speakers use the circle-medallion column
6. Community testimonials — reels rotate per pass (#4 building / #5 earning,
    voice audio) + 4 MEMBER WIN cards per pass (real community post screenshot
    right, loose summary left; pool of 16 in assets/wins/)
7. Sponsor reel — HyperAgent KEYNOTE (Alex McDonnell, 18:25, plays ONCE in pass
    1's slot, voice audio; logo card holds the slot in later passes) + Glaido
    logo card (real green-G + wordmark). Clay REMOVED (not a sponsor).
8. AIS+ membership pitch (1:06 mounted ad, voice audio)
9. Markflash seam -> soft loop back to 1

2 full passes + a partial pass + alternating speaker/win filler + outro =
exactly 2700s. Total recomputes automatically when drop-ins land.

## Drop-in slots (dashed placeholder boxes until the file exists)

Drop the file, re-run `node _gen.mjs --set`, re-render. Each mounts 1:1:

- `assets/video/welcome-open.mp4` — Welcome title / hype open (60s slot).
  The HyperAgent keynote is already mounted from
  `assets/video/hyperagent-keynote.mp4` (remuxed from Aidan's Downloads .mov).

## Build / verify / render

```bash
node _gen.mjs --set     # cards/block1-opening.html -> index.html (probes assets/video)
npx hyperframes lint    # 0 errors (poster-jpg duplicate + file-size warnings accepted)
node _shots.mjs         # authored-beat frames (raw seek can't drive <video> mounts)
npx hyperframes render --quality standard --workers auto --browser-gpu --gpu --output renders/block1-opening-final.mp4
# verify mounts from the RENDERED mp4 (ffmpeg frame extraction at _seams.json times)
```

Audio: testimonial reels + AIS+ ad carry their voice audio; everything else is
silent (venue music bed underneath).

Engine forked from `ais-live-lunch-fill/_gen.mjs` (poster/lastframe-bracketed
mounts, exact-landing pad math). Sources mounted from the sibling projects'
renders (day1-agenda, get-setup, vip-qa-live-now, day1-teasers, testimonials,
ais-plus-membership, sponsor-stings/glaido).

Note: Clay was listed as removed for Block 3 (2026-07-07) but Aidan's Block 1
spec (2026-07-08) includes a Clay sponsor slot, so the placeholder stays until
told otherwise.

## Status

- Built, revised (speaker spotlights + circle format + wins + keynote), rendered
  standard 2026-07-08 (45:00.0, 542 MB, 25m36s render) and DELIVERED to Drive
  Event Assets/Block 1 Assets as "AIS LIVE - Block 1 Opening (45 min).mp4"
  (file 13CP90S2I1uMhkd58Iu_JS3lDJCMPfP2w).
- Remaining drop-in: Aidan's welcome-open.mp4 (placeholder box plays in its slot).
  When it lands: drop file, node _gen.mjs --set, re-render, re-upload.
