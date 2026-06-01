# Video Automation — Workspace Guide

Modular agent pipeline that turns a raw talking-head recording into a polished, human-feeling edit. Built on [HyperFrames](https://hyperframes.heygen.com) (HTML-native video — **not** Remotion). Ported to macOS from Nate's original Windows kit (`hyperframes-video-kit.zip`).

## This project — what we're building

A raw recording goes in; a finished, "human-edited" video comes out, ideally via a single master command (e.g. `/goal edit this video`). The work is split into **granular, composable agents/skills** that the master workflow assembles in order:

1. **Cut silences** — auto-trim pauses/dead air. *(building first)*
2. **Cut mistakes / repeats** — detect false starts, retakes, stutters; decide what to drop. (Manual reasoning in the reference today — this becomes a real agent.)
3. **Tiered motion-graphic cards** — tier-1 = full-screen paper takeover (thesis/stat); tier-2 = glass lower-third. Driven by the `hyperframes-video-beats` skill + a beat-detection pass.
4. **B-roll insertion** — later.

Quality bar: smooth transitions, well-timed motion graphics, open-loop retention structure — viewers should not perceive it as auto-edited. Certification-course content targets premium, "Apple-style" motion graphics.

**Constraints (from project direction):**
- **GitHub** is the shared dev/collab home (Aidan + Nate both contribute).
- **Local rendering**, not cloud — for speed.
- Pipeline is **transcript-driven** via ElevenLabs Scribe (word-level timestamps).
- Each step ships as its own skill under `.claude/skills/` so it stays modular and testable in isolation.

## MOTION_PHILOSOPHY.md — read before brainstorming

`MOTION_PHILOSOPHY.md` at the workspace root is the canonical motion-graphics aesthetic — the deconstructed Infinite Global Payments 30s spot, the gold standard. **Read the full file at the start of any creative session** (composition, scene, storyboard, palette, transitions, kinetic typography, logo reveal). Re-read sections 0 (11 Laws) and 4 (pre-flight checklist) every iteration; run the pre-flight checklist before claiming any motion piece is done.

Defaults: ~1.5s avg scene length, black canvas + perspective grid + crosshairs + vignette + grain, chrome-gradient text with halo glow, motion-blurred whip transitions (never hard cuts), ≤5 symbolic colors, 4–6s outro hold, rule of threes. When a brand brief demands a different aesthetic, keep the *discipline* (one idea per beat, motion in transitions, breathing outros, callbacks) but adapt the palette/texture.

## Skills — use these first

Always invoke the matching skill before writing or modifying compositions. Skills encode framework-specific patterns (`window.__timelines` registration, `data-*` attribute semantics, shader-compatible CSS, relative-timing syntax) that are NOT in generic web docs. Skipping them produces broken compositions. Local skills live under `.claude/skills/`.

| Skill | When to use |
| --- | --- |
| `hyperframes` | Authoring/editing compositions, captions, TTS, audio-reactive animation, transitions |
| `hyperframes-cli` | CLI: `init`, `add`, `lint`, `preview`, `render`, `transcribe`, `tts`, `doctor` |
| `gsap` | GSAP animation — timelines, easing, stagger, plugins, performance |
| `hyperframes-registry` | Installing catalog blocks/components via `npx hyperframes add <name>` |
| `hyperframes-video-beats` | Planning/placing tiered motion-graphic beats (paper takeover vs glass card) |

Not present? `npx skills add heygen-com/hyperframes --yes` then reopen.

## Workspace layout

```
Video Automation/
├── CLAUDE.md, MOTION_PHILOSOPHY.md          ← workspace docs
├── package.json, .env (gitignored)          ← tooling + secrets
├── .claude/skills/                          ← modular agent skills (pipeline steps + hyperframes/gsap)
├── scripts/                                 ← shared workspace scripts (transcribe, validate, preflight)
├── style-templates/                         ← reusable look templates (dark-graph-paper, left-popout)
├── reference/                               ← read-only worked example (selling-ai-education) + originals
├── raw-media/                               ← gitignored stash for unassigned source recordings
└── video-projects/<slug>/                   ← one self-contained folder per video
```

Each project under `video-projects/<slug>/` is self-contained: `index.html` (root composition), `compositions/` (sub-comps via `data-composition-src`), `assets/` (media for this project), `renders/` (gitignored), `hyperframes.json` + `meta.json`. **Always run the HyperFrames CLI from inside the project folder** — it resolves `assets/`/`compositions/`/`renders/` relative to CWD.

### Adding a new video project

1. `mkdir video-projects/<slug>` (kebab-case)
2. `cd video-projects/<slug>`
3. `npx hyperframes init`, or copy `hyperframes.json`/`meta.json` from `style-templates/<look>/` and edit `meta.json`
4. Copy any shared assets the project needs
5. Build the composition; lint + render from inside this folder

## Commands

```bash
# Authoring loop (run from inside a project folder)
npx hyperframes preview                          # Studio + hot reload (port 3002)
npx hyperframes lint                             # static HTML check — always before rendering
npx hyperframes compositions                     # list comp IDs + resolved durations
npx hyperframes render --quality draft  --output renders/draft.mp4
npx hyperframes render --quality standard --output renders/final.mp4   # visually lossless 1080p

# Media pipeline (from workspace root)
node scripts/transcribe-elevenlabs.mjs <video-or-audio>   # word timestamps → <stem>.json next to input
npx hyperframes tts "text" --voice am_adam --output narration.wav

# Diagnostics
npx hyperframes doctor                           # env check (Node, FFmpeg, Chrome, Docker)
npx hyperframes docs <topic>
```

**Render flags:** `--quality draft|standard|high` (CRF 28/18/15) · `--fps 24|30|60` · `--format mp4|mov|webm` · `--gpu` · `--crf <n>` · `--video-bitrate 10M`.

## Render Contract (must-dos and must-not-dos)

1. Root `<div>` needs `id`, `data-composition-id`, `data-start="0"`, `data-width`, `data-height`.
2. Timed visible elements need `class="clip"` — **except** `<video>` and `<audio>` (adding `class="clip"` to `<video>` breaks it).
3. Every timed element needs `data-start`, `data-duration`, `data-track-index`.
4. `data-start` can reference another clip's id: `data-start="intro + 2"`. Same-track clips cannot overlap — use different `data-track-index`.
5. `<video>` must be `muted`; audio belongs in sibling `<audio>` for the mixer. `data-has-audio="true"` only when the video's own audio feeds the mix.
6. Every composition registers exactly one GSAP timeline, paused, on `window.__timelines["<data-composition-id>"]`. Key must match `data-composition-id` exactly.
7. Composition duration = `tl.duration()`. Pad with `tl.set({}, {}, <seconds>)` to extend.
8. Never call `.play()`/`.pause()`/set `.currentTime` on media — the framework owns playback.
9. Never animate `width`/`height`/`top`/`left` on a `<video>` — wrap in a `<div>` and animate the wrapper.
10. Sub-compositions use `<template>` + `data-composition-src`; their timelines auto-link to the parent.
11. Determinism: no `Date.now()`, no unseeded `Math.random()`, no render-time network fetches. Use seeded PRNGs.

## Authoring Loop (with mandatory gates)

1. Read `MOTION_PHILOSOPHY.md` if you haven't this session.
2. Invoke the matching skill before editing.
3. Edit HTML in `index.html` or `compositions/<name>.html`.
4. **Gate 0 — transcript-sync validator** (projects with `assets/transcript.json` + beat chains): `node scripts/validate-beat-sync.mjs` must exit 0. Every beat carries `data-anchor="<verbatim phrase>"`; validator enforces `-0.2s ≤ (wordStart − beatStart) ≤ 1.8s`. Animations enter just before the anchor word, never late.
5. `npx hyperframes lint` — fix errors, triage warnings.
6. **Gate 1 — Live Studio preview** (before any render, even draft). Hand the reviewer the `localhost:3002` URL + which sub-comps to scrub. Wait for explicit sign-off.
7. After sign-off: `render --quality draft`.
8. **Visual verification** — extract one frame per scene at its hero moment, `Read` every PNG (face not cropped, transitions land on the intended word, captions readable, no overflow). Lint passing ≠ design working.
9. Run the `MOTION_PHILOSOPHY.md` pre-flight checklist.
10. **Gate 2 — Rendered MP4 preview** on `localhost:8080` (serve with `npx serve . -p 8080 -n` — NOT Python's http.server; no Range support, scrubbing breaks). Wait for sign-off on full motion + audio.
11. Final: `render --quality standard`. Report the output path.

"Lint passes" and "the CSS looks correct" are **not** verification. A PNG I `Read` is.

## Using video-use (raw recording → clean edit)

[`video-use`](https://github.com/browser-use/video-use) is a separate Claude Code skill (install: `npx skills add browser-use/video-use`). On macOS it installs to `~/.claude/skills/video-use`, with its `.env` (carrying `ELEVENLABS_API_KEY`) at `~/.claude/skills/video-use/.env`. It transcribes via ElevenLabs Scribe, reasons over packed word timestamps, generates an EDL, and renders per-segment with color grade + 30ms audio fades.

**Note for this project:** our own modular agents (cut-silences, cut-mistakes) are the primary path. `video-use` is an alternative/reference editor; if we lean on it, use **Mode B** so its artifacts land inside the HyperFrames project's `assets/` (EDL + per-source transcripts + `edited.mp4`), then run `node scripts/video-use-to-hyperframes-transcript.mjs <project>/assets/edl.json` to emit Gate 0's `transcript.json` shape.

## Ad-hoc transcription (ElevenLabs Scribe — workspace default)

Default to ElevenLabs Scribe for any transcript request. Do NOT use `npx hyperframes transcribe` (needs whisper-cpp built locally) or openai-whisper/faster-whisper (avoid the 3 GB PyTorch install).

```bash
node scripts/transcribe-elevenlabs.mjs path/to/video.mp4      # → <stem>.json next to input
# options: --output path · --model scribe_v1|scribe_v1_experimental · --language en · --no-diarize · --keep-audio
```

Reads `ELEVENLABS_API_KEY` from env or the workspace `.env`. Output schema: `{ language_code, text, words: [{ text, start, end, type, speaker_id }], audio_duration_secs }` — `start`/`end` in seconds; `type` is `"word"` or `"spacing"`. If a call fails: `curl -H "xi-api-key: $ELEVENLABS_API_KEY" https://api.elevenlabs.io/v1/user/subscription` (401 = bad key, 413 = file too big).

## Asset prep

Re-encode raw recordings to H.264 before referencing as `<video src>`:

```bash
ffmpeg -i raw.mov -c:v libx264 -preset medium -crf 20 -c:a aac -b:a 192k -movflags +faststart assets/clip.mp4
```

## Documentation — fetch when skills don't cover enough

- Agent index: https://hyperframes.heygen.com/llms.txt
- Catalog block props: `https://hyperframes.heygen.com/catalog/blocks/<slug>`
- HTML schema (authoritative): https://hyperframes.heygen.com/reference/html-schema
- Inline: `npx hyperframes docs <topic>`

## Reference

`reference/selling-ai-education/` is the full worked example (scripts, transcripts, analysis JSON, composition — media excluded). `reference/ECOSYSTEM-OVERVIEW.md` explains how it was built end-to-end. `reference/CLAUDE.windows-original.md` is the unedited Windows source of this guide.
