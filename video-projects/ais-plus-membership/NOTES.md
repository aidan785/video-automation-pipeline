# AIS+ Membership Video (#6) — conversion ad

The most important video financially. Plays Day 1 3:55pm break, Day 2 4:40pm Final Push,
and the Welcome Lounge (loops at conversion moments per the AIS+ Architecture). It's an
ad for AIS+, dressed as a story: what AIS+ is, why members joined, what's unlocked.

**Status:** v2 rebuilt on the AIS LIVE command-deck style (2026-07-02). Look + copy +
timing + motion locked and frame-verified. Two footage slots are dashed placeholders.

- Duration 64s (~1:04), 1920x1080, 30fps. Tight cut per direction.
- Style: AIS LIVE command-deck (onyx + perspective-grid tunnel + beam + blue/coral glow +
  vignette/grain + AIS/LIVE corner mark w/ live-dot; chrome-gradient italic-900 headlines
  revealed word-by-word; motion-blur whip on every cut). See `style-library/03-ais-live/`.
- Silent + text-driven for review. Copy grounded in the AIS+ Upsell Module
  (Drive 1z5r7QgeBFj-jGdAwQcGLANUE6BaXsYgL) + AIS+ Success Stories.

## Beats (8)
1. S1 Bridge (0-7) — "You learned to build. Here's how you get paid."
2. S2 What AIS+ is + **Nate talking-head slot** (7-17) — free community builds, AIS+ earns.
3. S3 Two courses (17-26) — Get Your First Client · Scale to $10K+ (3D-flip cards).
4. S4 Hero proof (26-34) — Glenn Marcus **$60K** count-up, 5 days in + **member b-roll slot**.
5. S5 Member wins (34-43) — $14K Aidan Finnegan · $6K Mike Aheirwe · $500 Jose M. Lopes.
6. S6 What's unlocked (43-49) — live calls w/ Nate · earning community · templates + 90-day planner.
7. S7 The math (49-55) — skills worth $1K-$10K+ per client; one client pays for AIS+ many times over.
8. S8 CTA (55-64) — Join AIS+ · Become a member · "check your email for your code."

## v6 update (2026-07-02) — ALL testimonials on Glenn's format + side-swipe match cuts
- The old S5 montage (big centered clip + small caption pill) is GONE. All 4 testimonials now
  share **Glenn's exact S4 format**: name kicker top-left, big blue **count-up $ number**, unit
  line, testimonial clip framed on the right. One persistent frame (`#teststage`/`#testswipe`).
- Transitions between members = **side-swipe match cuts** (`swipeCut()`): the whole block
  punch-blurs + swipes left, content swaps while blurred, next member swipes in from the right.
  Each swipe (0.39s) is timed so the glide-back lands SHARP + FULL exactly at the next clip's
  media start (`swipeStart = clipStart − 0.39`) — no empty/black frame on the landing.
- Order: Glenn $60K → Mike $6K → Aidan $14K → Latoya $24K, each with its own count-up + unit
  ("FIRST CONTRACT · 5 DAYS IN" / "FIRST PAID CLIENT" / "SIGNED IN WEEKS" / "AND STILL CLIMBING").
- Latoya's source had a 0.167s black head → her clip starts 0.17s early so the black plays under
  the blurred swipe and real content lands on the sharp frame (audio shifted with it, stays synced).
- Testimonial block 23.8–43.3; S6/S7 nudged earlier (43.3 / 49.9), S8 unchanged. Duration 66s.
- Lint: 0 errors, 1 warning (`duplicate_media_discovery_risk` — the standard muted-`<video>` +
  sibling-`<audio>` same-file mixer pattern; video is `data-has-audio="false"` so no double audio).

## v5 update (2026-07-02) — match-cut montage + freeze fix
- Montage clips now share ONE `#montstage` wrapper. Between each testimonial: a **match cut** —
  a quick blur+scale punch on the frame (`matchcut()`) masks the swap (quick, consistent).
- **Freeze fixed**: each clip now exits the instant it finishes (Glenn exits ~0.37s after his line;
  montage exits right as Latoya ends) — no more play-then-hold-then-cut.
- Retimed tighter: duration now **66s**. All 4 testimonials keep identical framing + caption format.

## v4 update (2026-07-02) — accurate curriculum + testimonial montage + smoother motion
- **S3 now shows the 6 REAL AIS+ modules** (from the classroom): Start Here · The AI Partner
  Model · Build Your Portfolio · Claude Code · Get Your First Clients · Scale. (Replaced the
  earlier 2-course version.) 3D tilt-up grid.
- **S5 is now a testimonial montage** — 3 more real member clips with their voices, ascending:
  Mike Aheirwe $6K → Aidan Finnegan $14K → Latoya Robinson $24K (caption swaps per clip).
  Reused from `ais-live-testimonials/assets/earning/`. Plus Glenn $60K (S4) = 4 real testimonials.
- **Motion smoothed** (no spring overshoot, long power3 glides) + **camera motion** (continuous
  push-in + drift + per-beat ken-burns). **Transitions faster** (soft blur dissolve ~0.38s).
- Duration now **70s**. All testimonial clips carry real audio (Aidan's choice).

## Footage wired (2026-07-02 v3)
- **S4 hero — Glenn Marcus $60K testimonial (REAL, with his voice)**: `assets/testimonials/glenn-marcus.mp4`
  (reused from `ais-live-testimonials/assets/earning/`, already trimmed + face-checked; 3.23s, 1080p).
  Root-level `<video muted data-has-audio="false">` + sibling `<audio id="glenn-aud" data-volume="1">`
  play 27.4-30.63s over a fixed frame, bracketed by poster/lastframe imgs (no black frame). Per Aidan:
  testimonial clips carry their real voices.

## Pending inputs to reach final
1. **Nate talking-head clip** → S2 `.slot.th` (still a placeholder — no Nate clip exists in the
   member-testimonial set; needs a real Nate direct-to-camera recording).
2. VO + music bed for the non-testimonial beats (currently silent except Glenn's clip).
3. Green-light on named member numbers (all confirmed in the AIS+ source docs):
   Glenn Marcus $60K/5 days · Aidan Finnegan $14K · Mike Aheirwe $6K · Jose M. Lopes $500.
   (Note: the earning-reel labeled Jose at $12K; this ad uses the Upsell Module's $500 audit figure.)

## Build / preview / render
```
cd video-projects/ais-plus-membership
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js lint
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js preview   # studio
node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js render --quality standard --fps 30 --output renders/ais-plus-membership.mp4
```
