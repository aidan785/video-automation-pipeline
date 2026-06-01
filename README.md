# Video Automation

A modular agent pipeline that turns a raw talking-head recording into a polished, human-feeling edit — built on [HyperFrames](https://hyperframes.heygen.com) (HTML-native video). The long-term goal is a single command (`/goal edit this video`) that drops a raw file in and renders a finished video out.

## Pipeline (modular agents)

Each step is its own composable skill under `.claude/skills/`, assembled by a master workflow:

| # | Agent | What it does | Status |
|---|-------|--------------|--------|
| 1 | **Cut silences** | Auto-trim pauses / dead air from the transcript timeline | 🔜 building first |
| 2 | **Cut mistakes / repeats** | Detect false starts, retakes, stutters; decide cuts | planned |
| 3 | **Tiered motion-graphic cards** | tier-1 full-screen paper takeovers + tier-2 glass lower-thirds | planned |
| 4 | **B-roll insertion** | Place supporting footage | later |

Everything is transcript-driven via **ElevenLabs Scribe** (word-level timestamps). Rendering is **local** for speed.

## Layout

```
.claude/skills/        modular agent skills + hyperframes/gsap authoring skills
scripts/               shared workspace scripts (transcribe, validate beat-sync, preflight)
style-templates/       reusable look templates (dark-graph-paper, left-popout)
reference/             read-only worked example (selling-ai-education) + originals
video-projects/<slug>/ one self-contained folder per video
raw-media/             gitignored stash for source recordings
CLAUDE.md              full workspace guide — read this
MOTION_PHILOSOPHY.md   canonical motion-graphics aesthetic
```

## Setup

```bash
cp .env.example .env          # then add your ELEVENLABS_API_KEY
npx hyperframes doctor        # check Node, FFmpeg, Chrome
```

Requires Node ≥ 20, FFmpeg, and Chrome (for rendering).

## Start here

Read **[CLAUDE.md](CLAUDE.md)** for the full workspace guide, render contract, and authoring gates. See **[reference/ECOSYSTEM-OVERVIEW.md](reference/ECOSYSTEM-OVERVIEW.md)** for how the reference video was built end-to-end.
