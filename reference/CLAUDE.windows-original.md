# Hyperframes Editor — Workspace Guide

HTML-native video workspace built on [Hyperframes](https://hyperframes.heygen.com). Not a Remotion project — this is the other pipeline.

**This workspace hosts multiple video projects, one folder each, all under `video-projects/`.** The workspace root holds shared tooling and docs (`node_modules/`, `package.json`, `.claude/`, `CLAUDE.md`, `DESIGN.ais-example.md`, `MOTION_PHILOSOPHY.md`, shared `assets/`). Never put `index.html`, `compositions/`, or `renders/` at the root. Always work from inside a project subfolder.

## MOTION_PHILOSOPHY.md — read before brainstorming

`MOTION_PHILOSOPHY.md` at the workspace root is the canonical motion-graphics aesthetic — the deconstructed Infinite Global Payments 30s spot, our gold standard.

**Read the full file at the start of any creative session** (composition, scene, storyboard, palette, transitions, kinetic typography, logo reveal). Re-read sections 0 (11 Laws) and 4 (pre-flight checklist) every iteration. Run the pre-flight checklist before claiming any motion piece is done.

Defaults: ~1.5s avg scene length, black canvas + perspective grid + crosshairs + vignette + grain, chrome-gradient text with halo glow, motion-blurred whip transitions (never hard cuts), ≤5 symbolic colors, 4–6s outro hold, rule of threes. Section 3 has copy-pasteable HyperFrames recipes.

**Exception:** when a brand brief demands a different aesthetic (e.g. AIS Shorts use the bright AIS palette + Roboto Mono/Montserrat — see `DESIGN.ais-example.md`), keep the *discipline* (one idea per beat, motion in transitions, breathing outros, callbacks) but adapt the palette/texture.

If `MOTION_PHILOSOPHY.md` is missing, stop and ask Nate.

## Skills — use these first

Always invoke the matching skill before writing or modifying compositions. Skills encode framework-specific patterns (`window.__timelines` registration, `data-*` attribute semantics, shader-compatible CSS, relative-timing syntax) that are NOT in generic web docs. Skipping them produces broken compositions.

| Skill                    | When to use                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| `/hyperframes`           | Authoring/editing compositions, captions, TTS, audio-reactive animation, transitions      |
| `/hyperframes-cli`       | CLI commands: `init`, `add`, `lint`, `preview`, `render`, `transcribe`, `tts`, `doctor`   |
| `/gsap`                  | GSAP animation — timelines, easing, stagger, ScrollTrigger, plugins, performance          |
| `/hyperframes-registry`  | Installing catalog blocks/components via `npx hyperframes add <name>`                     |
| `/website-to-hyperframes`| Turning a URL into a composition (7-step capture-to-video pipeline)                       |

Not present? `npx skills add heygen-com/hyperframes --yes` then reopen.

## Commands

```bash
# Authoring loop (run from inside a project folder)
npx hyperframes preview                          # Studio with hot reload (port 3002)
npx hyperframes lint                             # static HTML check — always run before rendering
npx hyperframes compositions                     # list comp IDs + resolved durations
npx hyperframes render --quality draft  --output renders/draft.mp4
npx hyperframes render --quality standard --output renders/final.mp4   # visually lossless 1080p

# Catalog & install
npx hyperframes catalog --type block             # browse 38 blocks
npx hyperframes catalog --type component         # browse 3 components
npx hyperframes add <name>                       # install into compositions/

# Media pipeline
# Transcription: default to ElevenLabs Scribe API (see "Ad-hoc transcription" below).
# `npx hyperframes transcribe` needs whisper-cpp built locally and is NOT the default here.
node scripts/transcribe-elevenlabs.mjs <video-or-audio>   # word-level timestamps → <stem>.json next to input
npx hyperframes tts "text" --voice am_adam --output narration.wav   # on-device Kokoro-82M

# Diagnostics
npx hyperframes doctor                           # env check (Node, FFmpeg, Chrome, Docker)
npx hyperframes info --json
npx hyperframes benchmark
npx hyperframes docs <topic>                     # data-attributes, gsap, rendering, examples, troubleshooting, compositions
```

**Render flags:** `--quality draft|standard|high` (CRF 28 / 18 / 15) · `--fps 24|30|60` · `--format mp4|mov|webm` (`mov` = ProRes 4444 + alpha, `webm` = VP9 alpha, Chromium only) · `--workers <n>` · `--gpu` · `--docker` · `--crf <n>` · `--video-bitrate 10M` · `--max-concurrent-renders <n>` (producer server).

## Workspace Layout

```
Hyperframes Editor/
├── CLAUDE.md, AGENTS.md, DESIGN.ais-example.md, MOTION_PHILOSOPHY.md   ← workspace docs
├── package.json, node_modules/, .claude/, skills-lock.json             ← tooling
├── assets/                                                              ← shared brand source-of-truth (AIS logo, brand-tokens.css)
├── raw-media/                                                           ← gitignored stash for unassigned source recordings
└── video-projects/<name>/                                               ← one folder per video
```

Each project under `video-projects/<name>/` is self-contained:

- `index.html` — root composition entry point
- `compositions/` — sub-compositions loaded via `data-composition-src`
  - `compositions/components/` — shared snippets installed by `npx hyperframes add <component>`
- `assets/` — media for this project. Brand assets needed by multiple projects are duplicated per-project (not symlinked) — keeps each project portable.
- `renders/` — render outputs (gitignored)
- `hyperframes.json`, `meta.json` — CLI config + project metadata
- (optional) `STORYBOARD.md`, `scripts/`, etc.

### Always run the CLI from inside the project folder

```bash
cd video-projects/may-shorts-19
npx hyperframes lint
npx hyperframes preview
npx hyperframes render --quality standard --output renders/final.mp4
```

The CLI reads `hyperframes.json`/`meta.json` from CWD and resolves `assets/`, `compositions/`, `renders/` relative to it. Running from the workspace root will fail or scan the wrong files.

### Adding a new video project

1. `mkdir video-projects/<new-project-slug>` (kebab-case, e.g. `q3-launch-promo`)
2. `cd video-projects/<new-project-slug>`
3. `npx hyperframes init`, OR copy `hyperframes.json`/`meta.json` from a sibling and edit `meta.json` for the new id/name/dimensions, then create empty `index.html`, `compositions/`, `assets/`, `renders/`
4. Copy any shared brand assets the project needs (e.g. `cp ../../assets/brand-tokens.css ../../assets/AIS\ Logo\ PNG.png assets/`)
5. Build the composition; lint + render from inside this folder

## Render Contract (must-dos and must-not-dos)

1. Root `<div>` needs `id`, `data-composition-id`, `data-start="0"`, `data-width`, `data-height`.
2. Timed visible elements need `class="clip"` — **except** `<video>` and `<audio>` (adding `class="clip"` to `<video>` breaks it).
3. Every timed element needs `data-start`, `data-duration`, `data-track-index`.
4. `data-start` can reference another clip's id: `data-start="intro"`, `data-start="intro + 2"`, `data-start="intro - 0.5"`. Same-track clips cannot overlap — use different `data-track-index` values.
5. `<video>` must be `muted`; audio belongs in sibling `<audio>` elements for the mixer. `data-has-audio="true"` only when the video's own audio should feed the mix.
6. Every composition registers exactly one GSAP timeline, paused, on `window.__timelines["<data-composition-id>"]`. Key must match `data-composition-id` exactly.
7. Composition duration = `tl.duration()`. If the timeline is shorter than the video, the video truncates. Pad with `tl.set({}, {}, <seconds>)` to extend.
8. Never call `.play()`, `.pause()`, or set `.currentTime` on media. The framework owns playback.
9. Never animate `width`/`height`/`top`/`left` directly on a `<video>` — the browser freezes frames. Wrap in a `<div>` and animate the wrapper.
10. Sub-compositions use `<template>` + `data-composition-src`. Their timelines auto-link to the parent — never do `masterTL.add(child)`.
11. Determinism: no `Date.now()`, no unseeded `Math.random()`, no render-time network fetches. Use seeded PRNGs.

## Authoring Loop (with mandatory gates)

1. Read `MOTION_PHILOSOPHY.md` if you haven't this session.
2. Invoke the matching skill before editing.
3. Edit HTML in `index.html` or `compositions/<name>.html`.
4. **Gate 0 — transcript-sync validator** (projects with `assets/transcript.json` + beat chains): `node scripts/validate-beat-sync.mjs` must exit 0. Every beat must carry `data-anchor="<verbatim phrase>"`; validator enforces `-0.2s ≤ (wordStart − beatStart) ≤ 1.8s`. A reference copy lives at workspace `scripts/validate-beat-sync.mjs`. **Non-negotiable after the session-99-percent drift incident** — animations must enter just before the anchor word, never late.
5. `npx hyperframes lint` — fix errors, triage warnings.
6. **Gate 1 — Live Studio preview** (before any render, even draft).
7. After Nate's sign-off: `render --quality draft`.
8. **Visual verification** on the draft (frame extraction + Read).
9. Run the `MOTION_PHILOSOPHY.md` pre-flight checklist (section 4).
10. **Gate 2 — Rendered MP4 preview** (scrubbable on `localhost:8080`). Wait for sign-off.
11. Final: `render --quality standard` (or `high --docker` for archival deterministic output).

### Gate 1 — Live Studio preview (MANDATORY before any render)

```bash
cd video-projects/<project-slug>
npx hyperframes preview    # run_in_background: true
```

Wait for "Studio running" on `http://localhost:3002`. Hand Nate the URL + tell him exactly which sub-compositions to scrub (individual comp URLs like `http://localhost:3002/?comp=v01-kinetic-type` load fastest — the master composition can stall when it includes WebGL shader blocks under software fallback). Wait for explicit sign-off ("looks good, render a draft" / "ship it" / "go ahead"). Silence is not approval. Hot reload means further edits show up live without restart.

### Visual verification (MANDATORY before delivery)

Lint passing ≠ design working. A "successful" render with a cropped face, misaligned text, or a scene landing on the wrong word is a broken render — and lint won't catch any of that. Studio's scrubber drives GSAP only, so Nate can't hear audio or see face-cam move during scrub — **that means Nate has no independent way to verify my visual claims without a Read-confirmed PNG or a scrubbable draft MP4.** Frame-Read is the only evidence he has that I actually did the work.

#### Mid-authoring Playwright gate (MANDATORY after any visual-bug fix)

Any time Nate reports a visual bug, or I change composition / scaling / z-index / text fit / layout CSS, before claiming the fix is done:

1. Ensure the Studio is running on the project port.
2. Drive Playwright against the **solo sub-comp URL** (`http://localhost:<port>/api/projects/<project>/preview/comp/compositions/beats/<file>.html`), not the master — solo screenshots render at full 1920×1080 without face-cam or background clutter and make small details legible.
3. Wait for `window.__timelines["<id>"]`, call `tl.pause()` + `tl.seek(<relative-s>, false)`, screenshot to `renders/sst/` or `renders/verify/`.
4. Call `Read` on the PNG. "Read" means invoke the Read tool so the image loads into context — NOT list the filename, NOT assume it's fine, NOT grep.
5. If the screenshot is ambiguous at thumbnail scale, pair it with a computed-layout dump (`getBoundingClientRect` + `getComputedStyle` on the suspect elements, logged to console). Pixel math beats squinting at a 480-wide thumbnail.
6. After the solo screenshot clears, take a master-timeline screenshot via `scripts/screenshot-at-time.mjs <abs-times>` to verify layering with the face-cam PiP + background.
7. Only after a Read-confirmed PNG (or pair of PNGs) do I tell Nate "fixed" and hand him the Studio URL.

"Lint passes" and "the CSS looks correct" are **not** verification. A PNG I Read is.

#### Gate 2 frame-extraction check (post-render, pre-delivery)

1. Render a draft: `npx hyperframes render --quality draft --output renders/<name>-draft.mp4`
2. Pull one frame per scene at its hero moment + frames at any mid-entrance/transition at risk. Cover the full timeline — don't cherry-pick.
   ```bash
   mkdir -p renders/frames
   for t in <scene1-t> <scene2-t> ...; do
     ffmpeg -y -ss $t -i renders/<name>-draft.mp4 -frames:v 1 -q:v 2 "renders/frames/t${t}.png"
   done
   ```
3. Call `Read` on every PNG — do NOT just list filenames. Verify: speaker's face not cropped, full-screen vs bottom-half mode correct, transitions land on the intended word, captions on-brand and readable, no text overflow/overlap/blank frames.
4. If anything is wrong — fix, re-render, re-verify.

### Gate 2 — Rendered MP4 preview (before final standard render)

Serve `renders/` via `npx serve . -p 8080 -n` (NOT Python's `http.server` — no Range support, scrubbing breaks). Hand Nate `http://localhost:8080/<project>-draft.mp4`. Wait for explicit sign-off on full motion + audio playback. Then run `--quality standard`; report the output path.

The render is the ground truth. "The code looks correct" doesn't clear the bar.

## Using video-use (raw recording → clean edit)

[`video-use`](https://github.com/browser-use/video-use) is installed as a Claude Code skill at `C:\Users\nateh\.claude\skills\video-use`. It transcribes via ElevenLabs Scribe, reasons over packed word timestamps, generates an EDL, and renders per-segment with color grade + 30ms audio fades. Use it as the editor that feeds HyperFrames a clean clip. There are two modes — Claude picks the mode from your phrasing at invocation:

### Mode A — full video-use pipeline (solo)

**Trigger phrases:** "run the full video-use pipeline on X", "use video-use end-to-end", "make a video from X with video-use", "let video-use do everything on X".

**Behavior:** Invoke the `video-use` skill with its default strategy — cuts + color + subtitles + overlays (Manim/PIL). Let it write into its native `edit/` schema so upstream updates stay compatible.

**Output:** `video-projects/<project>/edit/final.mp4` (plus `edit/` intermediates and `project.md`).

**When to use:** The YouTube comparison video showing what video-use produces on its own, or any ad-hoc edit where HyperFrames motion graphics aren't worth the effort.

### Mode B — video-use edits, HyperFrames does motion graphics (production)

**Trigger phrases:** "use video-use to edit X", "just edit X with video-use", "clean up X with video-use for HyperFrames", "edit X then hand off to HyperFrames".

**Behavior:** Invoke the `video-use` skill with `--edit-dir video-projects/<project>/assets` (so all video-use artifacts — EDL, per-source transcripts, final clip — land inside the HyperFrames project). At the strategy-approval step give it this instruction verbatim:

> Edit only. Cut filler words and silence, apply per-segment color grade, 30ms audio fades at cuts. Skip overlays (empty `overlays` list in the EDL). Skip burned subtitles (run render with `--no-subtitles`). Output to `video-projects/<project>/assets/edited.mp4`. Also write `video-projects/<project>/assets/edited.srt` via `--build-subtitles`. Do NOT generate a `final.mp4`.

This results in the following layout inside `video-projects/<project>/assets/`:

```
assets/
├── transcripts/<raw-source-stem>.json   # per-source ElevenLabs Scribe responses (source timeline)
├── edl.json                              # video-use's EDL (cuts, ranges, overlays=[])
├── edited.mp4                            # the cut clip
└── edited.srt                            # master SRT on the edited timeline
```

Then run the adapter to emit Gate 0's transcript shape from the EDL + per-source transcripts:

```bash
node scripts/video-use-to-hyperframes-transcript.mjs video-projects/<project>/assets/edl.json
# reads: assets/edl.json + assets/transcripts/*.json
# writes: assets/transcript.json in { words: [{ text, start, end }, ...] } (edited timeline, seconds)
```

Now switch to HyperFrames authoring: `npx hyperframes init` (if new), wire `<video src="assets/edited.mp4" muted>` + `<audio src="assets/edited.mp4" data-has-audio="true">` into `index.html`, and author motion graphics + captions normally. Gate 0 (`scripts/validate-beat-sync.mjs`) now has a real `assets/transcript.json` to validate beats against.

**Output:** `video-projects/<project>/assets/edited.mp4` + `edited.srt` + `transcript.json`. No `edit/final.mp4` is created in Mode B.

**When to use:** The default production flow. Any video going through the HyperFrames studio for captions, kinetic type, or MOTION_PHILOSOPHY-grade scenes.

### Required env

`C:\Users\nateh\.claude\skills\video-use\.env` must contain `ELEVENLABS_API_KEY=<key>`. Already mirrored from the workspace `.env` at install time. Transcripts are cached at `<edit_dir>/transcripts/<video_stem>.json` — re-runs on the same source are cheap.

## Ad-hoc transcription (ElevenLabs Scribe — workspace default)

**Default to ElevenLabs Scribe** for any one-off transcript request ("transcribe this video", "give me word timestamps for X"). Do NOT use `npx hyperframes transcribe` (it requires whisper-cpp built locally — not installed) or openai-whisper / faster-whisper (avoid the 3 GB PyTorch install). The full `video-use` pipeline above already uses Scribe; this section covers the simpler "just give me a transcript JSON" case.

Use the helper script — handles audio extraction + multipart upload + writes a sibling `<stem>.json`:

```bash
# Output lands at <same-dir-as-input>/<stem>.json
node scripts/transcribe-elevenlabs.mjs path/to/video.mp4

# Options
node scripts/transcribe-elevenlabs.mjs input.mp4 \
  --output custom/path.json \
  --model scribe_v1 \         # or scribe_v1_experimental
  --language en \
  --no-diarize \              # default: diarize=true
  --keep-audio                # keep the extracted .mp3 sibling (default: delete)
```

Reads `ELEVENLABS_API_KEY` from the workspace `.env` (already present). Output schema: `{ language_code, language_probability, text, words: [{ text, start, end, type, speaker_id, logprob }], transcription_id, audio_duration_secs }` — `start`/`end` in seconds. `type` is `"word"` or `"spacing"` (filter `type === "word"` if you just want spoken tokens).

Why ElevenLabs over local Whisper: cloud Scribe gives clean word timestamps + speaker diarization out of the box, no model download (~500 MB–3 GB saved), no PyTorch install, and runs in ~35 s for a 16 min talk vs. several minutes locally on CPU. The mp3 extraction step (mono 16 kHz @ 64 kbps) keeps the upload to ~500 KB/min.

If a Scribe call fails: check key with `curl -H "xi-api-key: $ELEVENLABS_API_KEY" https://api.elevenlabs.io/v1/user/subscription`. 401 = bad/expired key. 413 = file too big; lower the bitrate or split the audio.

## Asset Prep

Re-encode raw recordings to H.264 MP4 before referencing as `<video src>`:

```bash
ffmpeg -i raw.mov -c:v libx264 -preset medium -crf 20 -c:a aac -b:a 192k -movflags +faststart assets/clip.mp4
```

Keeps `assets/` light and avoids codec issues. Use `npx hyperframes doctor` if a render fails partway.

## Prompting Shorthand (what `/hyperframes` understands)

- **Motion easing:** smooth / snappy / bouncy / springy / dramatic / dreamy
- **Caption energy:** hype / corporate / tutorial / storytelling / social
- **Transition energy:** calm (blur) / medium (push) / high (zoom, glitch)
- **Audio reactivity:** bass→scale, treble→glow, amplitude→opacity, mids→shape. Text reactivity 3–6%; backgrounds 10–30%.

Cold-start: *"Using /hyperframes, create a 10-second product intro with a fade-in title over a dark background and subtle background music."* Warm-start: *"Summarize this PDF into a 45-second pitch video using /hyperframes."*

## Registry (browse via `npx hyperframes catalog --type block --json`)

- **Blocks (38):** data viz, outros, social overlays, app/UI, shader transitions, CSS transition packs
- **Components (3):** `grain-overlay`, `shimmer-sweep`, `grid-pixelate-wipe`

Don't guess at block props — fetch the catalog page (see Documentation below).

## Documentation — fetch when skills don't cover enough

Skills encode common authoring patterns; the hosted docs are the source of truth for **every block's props, every package's API, and deeper examples**. Reach for them when brainstorming scenes, picking a transition/component, or digging into a package.

- **Agent index (start here if unsure of a path):** https://hyperframes.heygen.com/llms.txt
- **Full site:** https://hyperframes.heygen.com/introduction
- **Source repo:** https://github.com/heygen-com/hyperframes
- **Inline terminal docs:** `npx hyperframes docs <topic>`

**URL patterns (hit directly with WebFetch):**

- `https://hyperframes.heygen.com/catalog/blocks/<slug>` — full props + examples per block
- `https://hyperframes.heygen.com/catalog/components/<slug>`
- `https://hyperframes.heygen.com/packages/<name>` — `cli`, `core`, `engine`, `player`, `producer`, `studio`
- `https://hyperframes.heygen.com/reference/html-schema` — authoritative data-attribute + timeline-registration spec
