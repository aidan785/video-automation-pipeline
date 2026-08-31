# Block 5 — Day 2 Opening (8:30-9:45 AM Day 2, main stage / stream)

Exactly 75:00.0 (4500s) build that PLAYS ONCE, 8:30 -> 9:45 — this replaces the
separate morning-fill block (no dead gap).
Outro lands exactly on the 9:45 handoff ("Nate takes the stage now").

**Status (rev. 2026-07-11):** HyperAgent keynote REMOVED + Day 1 recap session
clips ADDED (Aidan 7/11). Regenerated, lint 0 errors, frame-verified on the
live player :3013. Gate 1 Studio sign-off pending. NOT rendered (render only
on approval). NOTE: the 7/9 render delivered to Drive Block 5 Assets is now
STALE (contains the keynote, no recap clips).

## The 2026-07-11 revisions (Aidan)

1. **HyperAgent 18:25 keynote is OUT** — every pass now runs the 60s spotlight
   sponsor slot (real 60s spot still swaps 1:1 when it lands).
   `assets/video/hyperagent-keynote.mp4` stays on disk (Block 1 standalone).
   With the keynote gone the build could loop again, but stays single-play 75:00.
2. **DAY 1 RECAP session clips** — 27 word-accurate clips (~13:05 total; 19 in
   the first batch + 8 Sabrina Ramonov "AI Content Engine" clips added later
   7/11) cut from the real Day 1 recordings on the Extreme SSD (Liberty White
   Foundation workshop, Dave Ebbelaar Advanced workshop, Scope-to-Ship VIP
   session, Sabrina's Workshop Block 2),
   presented in the community-testimonial format: rounded 16:9 slot left,
   name/role/quote right, voice audio on. 3-4 clips per pass in section 1b,
   right after the recap agenda/quotes. Assets: `assets/recap/recap-*.mp4`
   (+`-poster.jpg`/`-lastframe.jpg`). Cutter + shortlist live in
   `video-projects/ais-live-day2-sizzle-clips/` (`_cut-recap.mjs`,
   `CLIP-CANDIDATES.md`) — more Day 1 footage is still landing; re-run the
   cutter + extend RECAPS/RECAP_DEAL in `_gen.mjs` to add clips.
   - VIP clips are single-speaker 16:9 crops (two-cam layout, name chips crop out)
   - Liberty clips are her full-frame Q&A camera (59:00-1:07:20 window only —
     the rest of her session is slide-share with a cut-off cam strip)
   - Dave clips are the full frame (dark slides + corner cam; the white
     RingCentral page shows around the slide — flag for Gate 1)
   - Sabrina clips are full frame (slides layouts pair with the audio — the
     intro clip shows her 3M+/30M+ slide as she says it; hyperframes clip is
     her full camera, which is only clean 1:11:52-1:17:40 in that recording)
   - RENDER GOTCHA solved: a timed <video> nested in a timed element FREEZES in
     renders (lint error). Recap cards therefore sit at STAGE ROOT (outside
     #camera, no camera drift): card section + non-timed .rclip media wrapper
     ride identical tweens to stay registered.

## Structure — 6 varied passes of the production order, 297 beats

Each pass (~12.5 min): morning open → **Day 1 recap** (v7.1 verbatim 10-row
agenda + rotating verified quotes/stats + **3-4 Day 1 session clips**) →
**today / Day 2 agenda** (Nate 9:45 + 2x10-row v7.1 cards + HyperAgent 10:00
tease) → **get set up** (3 steps, approved Block 1 copy) → **AIS+ membership**
(mounted 66s ad, voice) → **AIS certification** → **sponsor reel** →
**community testimonials** (mounted reel, strict building/earning alternation)
+ **4 member-win cards** → wayfinding reset → markflash pass seam. 40 fillers
dealt in consecutive-chunk runs (was 67 pre-Sabrina, 20 pre-rebuild — the freed
keynote time not consumed by recap clips absorbs here; if the filler runs read
long at Gate 1, lengthen/add recap clips from the shortlist).

## The three 2026-07-08 pm revisions (Aidan) — keynote item SUPERSEDED 7/11

1. ~~HyperAgent 18:25 keynote plays ONCE in pass 3's sponsor slot~~ — REMOVED
   2026-07-11, see above.
2. **Member wins**: 24 win-card placements (4 per pass, right after the
   testimonial reel — Block 1's winwrap card: summary left, real post screenshot
   right). All 16 verified Block 1 wins shown at least once, the first 8 twice.
   Screenshots cloned to `assets/wins/`. Gotcha: the `.winhead .wd` padding CSS
   is what provides inter-word gaps — omit it and headlines render jammed.
3. **AIS cert video**: Block 4's `cert-launch.mp4` (CAIC video, 56.6s) mounted
   on alternating passes (1/3/5) with authored verified-facts beats between.
   Naming is "Get AIS Certified" — NOT AIS+ (Aidan 2026-07-08, matches Block 4).

## Content decisions (Aidan, 2026-07-08)

- **Clay is OUT** of the sponsor reel (consistent with the 7/7 event-wide
  removal — confirmed despite the brief listing Clay). Stale "Clay Working
  Lunch Session" agenda row dropped too.
- Day 2 agenda rows: v7.1 verbatim (doors-loop DAY2_SCHED), 5 VIP 1:35 rooms
  collapsed to one row, split 10+10 across two cards.

## Drop-in still pending (1:1, re-run `node _gen.mjs --set` after)

- **HyperAgent 60s spot** (NOT delivered): `assets/video/hyperagent-60.mp4`
  (+ `-poster.jpg`/`-lastframe.jpg`) — replaces the 60s logo spotlight in the
  5 non-keynote passes. Total self-retunes to exactly 4500s.

## Audio

Mounted pieces (AIS+ ad, testimonial reels, keynote, cert video) keep voice
audio (muted video + sibling audio, volume 1). Authored cards silent — venue
music bed underneath.

## Text-clip fix (2026-07-08 pm, Aidan's report)

Descenders (y/p/g) were rendering chopped flat on all gradient text. Root
cause: layer-promoting a `background-clip:text` element under the
always-animating `#camera` transform → Chromium rasterizes it with a
truncated mask. TWO-part fix (both required):
1. REMOVED will-change from `.ln .wd` / `.num` / `.stepnum` / `.winhead .wd`
   (fixes the at-rest raster; zero perf cost).
2. `force3D:false` on words()/pop() (7/9) — GSAP's default translate3d
   3D-promotes the spans DURING the entrance tween, which kept Studio
   playback showing the chop even after fix 1 (renders were already clean).
Verified through the GPU render path AND the preview with the
`video-projects/_cliptest/` matrix harness. NOTE: every other block engine
still carries this bug (the delivered Block 4 render visibly clips "up.") —
apply both parts before any re-render of those.

## Build / preview / verify

```
node _gen.mjs --set          # regenerate index.html (picks up drop-ins)
npx hyperframes lint         # 0 errors; 6 accepted warnings (dup imgs / file size)
npx hyperframes preview      # Studio (:3013 this session; 3002-3012 = other sessions, don't kill)
node _shots.mjs --port 3013 <t> <t> ...   # Playwright frames -> frames/
```

Verification gotcha: seeking the live player into the 852MB keynote needs a
LONG settle (~9s) before the media element lands on the right frame — the
default 1.1s wait screenshots a stale early frame. Render is unaffected (the
render pipeline drives currentTime + waits for seeked).

## Sources

- Day 1 recap rows + quotes/stats: the verified Block 4 / doors-open-loop set
- Day 2 schedule: Agenda v7.1 via ais-live-loops/_gen-doors-loop.mjs DAY2_SCHED
  (Clay row dropped; VIP rooms collapsed) — cross-checked against the
  RingCentral #14 rebuild
- Get-set-up copy: ais-live-get-setup (approved + delivered 2026-07-07)
- Member wins: Block 1's verified WINS set (numbers verbatim from the posts)
- Mounted renders: ais-plus-membership.mp4 + testi reels (Block 2/3 assets),
  hyperagent-keynote.mp4 (Block 1), cert-launch.mp4 (Block 4)
- Engine: forked from ais-live-day1-close-fill/_gen.mjs + sponsor/step/rows
  renderers from ais-live-lunch-fill + ais-live-get-setup + win card from
  ais-live-block1-opening
