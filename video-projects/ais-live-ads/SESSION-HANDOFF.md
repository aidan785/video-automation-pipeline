# Session Handoff — AIS Live paid ads: built the shared body + CTA ending (16x9)

## Where it started
User is producing 8 ads for AIS Live: four 16:9 (YouTube) + four 9:16 (social). Every ad = a different **intro** (hooks Ad 1–4) + the **same body**, and the body ends on a shared **CTA brand card** that every video reuses. This session pulled the body transcript and built the full motion-graphics pass over the body (16:9) using the bespoke AIS Live brand. Intros are next; 9:16 comes after 16:9.

## Decisions locked + what shipped
- Project scaffolded: `/Users/aidanstanik/Projects/Video Automation/video-projects/ais-live-ads/`
- Body transcript via ElevenLabs Scribe → `/Users/aidanstanik/Projects/Video Automation/video-projects/ais-live-ads/assets/body-source.json` (107 words, 25.69s, clean single take — no silence/mistake cuts needed). This is the timing source of truth.
- No AIS card pool exists in `style-library/` (only vox-explainer + kallaway), so the body was **hand-authored** in `index.html` with ONE master GSAP timeline `window.__timelines["ais-live-body"]`. Bg video = track 0, audio = track 1, beats = full-frame `.clip` layers tracks 2–6.
- **5 beats** (all overlays except the CTA): (1) top-left **AIS LIVE** logo bug + pulsing live-dot (1.1–20.6s); (2) left **"What you'll learn"** value card, 3 rows reveal on anchors (3–10.8s); (3) credibility = **two** stacked sections "Real practitioners" / "Real numbers" (11.2–15.5s); (4) boxed yellow **GET PAID** payoff (17.6–20.5s); (5) full-screen onyx **CTA card** = mark + "Real Projects. Real Revenue." + pill "Click to see what's covered" (20.85s→end). **Beat 5 is the shared ending for all 8 videos.**
- User layout rules (locked): **NO lower-thirds — all graphics middle-left.** Speaker reframed right + down via `#bg-wrap { transform: translate(400px,238px) scale(1.45) }` so left half is clear and his head isn't cropped.
- Mark is **vector CSS text** (Montserrat 900 italic), gradient fills (chrome white→silver AIS, depth-blue LIVE), per user request (overrides brand's "no gradient on mark").
- **Two clipping gotchas fixed** (see memory): (a) `.clip` layers must be full-frame 1920x1080 with content in an inner wrapper, else the player chops the layer; (b) `background-clip:text` + italic clips the edge glyphs — fixed by adding horizontal padding to `.ais`/`.live`.
- **Fonts self-hosted** → `assets/fonts/fonts.css` + 30 woff2 (Montserrat/Inter/JetBrains Mono). Google `<link>` removed so the render is offline/deterministic.
- Rendering now to `renders/ais-live-body-16x9.mp4` (standard quality, 30fps).

## Key files for next session
- `/Users/aidanstanik/Projects/Video Automation/video-projects/ais-live-ads/index.html` — the body composition. The shared CTA ending is beat 5 (`#cta`). Read first.
- `/Users/aidanstanik/Projects/Video Automation/video-projects/ais-live-ads/assets/body-source.json` — word-level transcript (anchor timings).
- `/Users/aidanstanik/Projects/Video Automation/video-projects/ais-live-ads/ad-scripts.md` — the 4 hook scripts (Ad 1–4) + standard body.
- `/Users/aidanstanik/Projects/Video Automation/video-projects/ais-live-ads/brand/handoff/AIS-LIVE-BRAND.md` — brand source of truth (tokens, mark spec, motion brief).
- `/Users/aidanstanik/Projects/Video Automation/video-projects/ais-live-ads/assets/body-source.mp4` (60fps source) + `assets/body-audio.m4a` (mixer audio).
- Verification harnesses: `_shot_studio.mjs` (screenshot the live player), `_shot.mjs`, `_inspect.mjs`, `_fonts.mjs`.
- Memory touched: `/Users/aidanstanik/.claude/projects/-Users-aidanstanik-Projects-Video-Automation/memory/ais-live-mark-gradient-clip.md`

## Running state
- Background process: preview server shell `bfnlku3tw` — `hyperframes preview` on **http://localhost:3002**. Kill with `kill` on its PID or stop the background task `bfnlku3tw`.
- Background process: render shell `bkgvhnoh7` — the `render --quality standard --fps 30` writing `renders/ais-live-body-16x9.mp4`. Should be done by the time you read this; confirm the file exists.
- Dev server / port: http://localhost:3002 (Studio). Preview iframe is `http://localhost:3002/api/projects/ais-live-ads/preview`.
- Open worktrees / branches: none (on `main`, nothing committed this session).

## Verification — how to confirm things still work
- `cd /Users/aidanstanik/Projects/Video Automation/video-projects/ais-live-ads && node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js lint` → expect "0 errors, 0 warnings". (Use this cached 0.4.32 binary; the published CLI fails to install on Node 25 — sharp build.)
- Visual check the player (NOT raw file://, which can't reproduce player clipping): `node _shot_studio.mjs` → writes `assets/shots/studio_1_6.png`; `Read` it. Mark must be complete (no side clipping), Montserrat loaded.
- After render: `ls -la renders/ais-live-body-16x9.mp4`, then extract + `Read` one frame per beat (e.g. `ffmpeg -ss 9 -i renders/ais-live-body-16x9.mp4 -frames:v 1 /tmp/f9.png`) to confirm fonts/marks/beats in the actual MP4.

## Deferred + open questions
- Deferred: the **four intros** (Ad 1–4 hooks). Each is a different hook that leads into this shared body+CTA. Intro footage will be provided by the user per ad.
- Deferred: the **four 9:16 versions** — do all 16:9 first, then port to 9:16 (will need re-layout: graphics can't stay middle-left in vertical).
- Open: render **fps = 30** was chosen; brand brief suggests 60fps internal. Confirm 30 is fine for delivery or re-render at 60.
- Open: credibility kicker wording "WHO YOU LEARN FROM" / "WHAT THEY SHOW" is tentative — user hasn't explicitly approved.
- Open: whether intros are separate clips concatenated before the body, or one combined recording per ad — confirm with user before building intro 1.

## Pick up here
Confirm `renders/ais-live-body-16x9.mp4` rendered correctly (frame-check), then start **Ad 1 intro (16:9)** from `ad-scripts.md`, leading into the existing shared body + CTA ending.
