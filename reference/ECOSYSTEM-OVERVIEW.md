# Talking-Head Motion-Graphics Ecosystem

How the "Selling AI Education" video (a.k.a. *the AI offer you can sell tomorrow morning*) was built — the skills, scripts, styles, and assets involved, and how they fit together so you can reproduce it.

> **Reference project:** `video-projects/selling-ai-education/`
> **Pipeline in one line:** raw recording → transcribe → cut stutters/silence → analyze for beat moments → generate composition (paper takeovers + left glass pop-outs) → lint/preview/render.

---

## 1. The two signature card styles

This video's look is defined in [`video-projects/selling-ai-education/DESIGN.md`](video-projects/selling-ai-education/DESIGN.md). Two beat types do all the work, both implemented as inline CSS classes inside the composition's `index.html` (there is **no** populated `compositions/beats/` folder for this project — the beats live in `index.html`).

### A. Dark graph-paper full-screen takeover — `.paper-beat`

Used for major thesis lines, stats, section markers, and ladder rungs. The whole frame becomes a dark navy→black surface with faint **cyan + green grid lines**, a perspective grid, a scan sweep, a vignette, and large centered white display type.

- Colors: matte black `#030507`, deep navy `#081118`, cyan accent `#7dd3fc`, green grid accent `#6ee7b7`.
- Typography: Inter, bold display weight, headline up to 104px.
- Duration: ~6–18s. True stat numbers get `<span class="accent">` (cyan).
- Examples in `index.html`: `b001` "Sell hours first.", `b021` "A 61-point adoption gap."

### B. Left glass pop-out — `.left-glass-beat` + `.glass-card.left-popout`

Used for supporting points where the speaker should stay visible. The video wrapper (`#video-stage`) **zooms to 1.30 from the top-left corner** (`transform-origin: 0% 0%`), and a dark frosted glass card slides in on the **left** (`left: 72px`, 690px wide). Card shows a tag + headline + 1–4 concise lines, then exits, then the video zooms back to full frame.

- Motion: scale 1.30, card in after ~0.14s, zoom out only **after** the card clears.
- Examples in `index.html`: `b002` "Three things", `b005a` "Operator to educator".

Both styles were first prototyped in dedicated template projects (see §5).

---

## 2. Skills (reusable know-how packs)

Local skills live under `.claude/skills/` in the workspace root. These encode framework-specific rules that generic web docs don't have, so invoke the matching one before editing.

| Skill | What it does for this pipeline |
| --- | --- |
| **hyperframes-video-beats** | **The core planning skill.** Decides *which* narration moments deserve a beat and whether each is a full-screen paper takeover vs a glass card. Holds the pacing rules (no >30s gap), the transcript-timing method (start a beat 0.2–0.6s before its anchor word), and content-writing rules (glance-comprehension, one idea per card). |
| **hyperframes** | Authoring the composition HTML: `data-start` / `data-duration` / `data-track-index` timing, the render contract, `window.__timelines` registration. |
| **hyperframes-cli** | `init` / `lint` / `preview` / `render` / `transcribe` / `tts` / `doctor` commands. |
| **gsap** | The animations themselves — the 1.30 zoom, card slide-in/out, staggered lines. |
| **hyperframes-registry** | Installing catalog blocks/components via `npx hyperframes add`. |
| **video-use** *(external)* | The raw-recording editor: cuts filler words + silence, color grade, audio fades. Installed separately at `C:\Users\nateh\.claude\skills\video-use` (not bundled here — it's a third-party skill; reinstall with `npx skills add browser-use/video-use`). Used in "Mode B" so its artifacts land inside the HyperFrames project's `assets/`. |

---

## 3. Scripts (the pipeline glue)

### Workspace-level — `scripts/`

| Script | Role |
| --- | --- |
| `transcribe-elevenlabs.mjs` | Default transcriber. Any video/audio → word-level timestamps JSON via ElevenLabs Scribe. Needs `ELEVENLABS_API_KEY` in the workspace `.env`. |
| `video-use-to-hyperframes-transcript.mjs` | Converts video-use's EDL + per-source transcripts into the `transcript.json` shape the beats sync against. |
| `validate-beat-sync.mjs` | **Gate 0.** Every beat must carry `data-anchor="<verbatim phrase>"`; enforces `-0.2s ≤ (wordStart − beatStart) ≤ 1.8s`. Animations must enter just before the anchor word, never late. |
| `preflight.mjs` | Pre-render environment/spec checks. |

### Project-level — `video-projects/selling-ai-education/scripts/`

This is the actual edit→beats pipeline for this video, run in order:

| Step | Script | Output |
| --- | --- | --- |
| 1 | `analyze-source.mjs` | Analyzes the raw transcript — finds retake candidates, repeated words, silence/word gaps. |
| 2 | `build-clean-edit.mjs` | **Cuts stutters + blank space** → `edited-clean.mp4` (+ EDL). |
| 3 | `analyze-edited.mjs` | Re-analyzes the cut version → `edited-segments.json`, `edited-transcript-chunks.md`. |
| 4 | `generate-composition.mjs` | Emits the beat plan into the composition (`index.html` sections styled per `DESIGN.md`). |

---

## 4. Assets & data files

`video-projects/selling-ai-education/assets/` — the data backbone (large media excluded from the kit):

- **`analysis/`** — pipeline intermediates: `beat-plan.json`, `clean-edit-edl.json`, `clean-edit-decisions.md`, `segments.json` / `edited-segments.json`, `retake-candidates.json`, `repeated-words.json`, `word-gaps.json`, transcript-chunk markdown.
- **Transcripts** — `source-transcript-elevenlabs.json` (raw) → `edited-transcript.json` (post-cut, what beats sync against) + `edited-clean-transcript-elevenlabs.json`.
- **Media (NOT in the kit — multi-GB):** `source.mp4` (~8.7 GB raw), `edited-clean.mp4` / `edited-clean-render.mp4` (~850 MB each), `source.mp3`, `edited-clean-audio-check.mp3`. Regenerate these from your own recording with the scripts above.

Project config: `meta.json` (id/name/dimensions/fps), `hyperframes.json` (CLI config), `index.html` (the composition).

---

## 5. Style origins (templates to reuse)

- **`video-projects/dark-graph-paper-template/`** — reusable template for the dark graph-paper full-screen look. Has its own `DESIGN.md`, `AGENTS.md`, `CLAUDE.md`, and a clean `index.html`.
- **`video-projects/devinpod-left-popout/`** — origin of the "left glass pop-out" style (its `DESIGN.md` calls it "the saved left glass pop out style"). Clean `index.html` to copy from.

To start a new video in this style: copy the template's `index.html` + `DESIGN.md` into a new `video-projects/<slug>/`, then run the pipeline.

---

## 6. End-to-end flow

```
        raw source.mp4
              │
              ▼  scripts/transcribe-elevenlabs.mjs   (ELEVENLABS_API_KEY)
     source-transcript-elevenlabs.json
              │
              ▼  video-use skill (Mode B)  +  project/scripts/analyze-source.mjs
     retake-candidates / repeated-words / word-gaps  →  build-clean-edit.mjs
              │
              ▼
     edited-clean.mp4  +  edited-transcript.json   (analyze-edited.mjs)
              │
              ▼  hyperframes-video-beats skill  +  generate-composition.mjs
     beat-plan.json  →  index.html  (.paper-beat + .left-glass-beat, styled per DESIGN.md)
              │
              ▼  validate-beat-sync.mjs  (Gate 0)  +  npx hyperframes lint
              │
              ▼  npx hyperframes preview  →  draft render  →  visual check  →  standard render
                            final MP4 in renders/
```

### Commands (run from inside the project folder)

```bash
cd video-projects/selling-ai-education

# transcript (from workspace root scripts)
node ../../scripts/transcribe-elevenlabs.mjs assets/source.mp4

# pipeline
node scripts/analyze-source.mjs
node scripts/build-clean-edit.mjs
node scripts/analyze-edited.mjs
node scripts/generate-composition.mjs

# validate + preview + render
node ../../scripts/validate-beat-sync.mjs
npx hyperframes lint
npx hyperframes preview                                   # http://localhost:3002
npx hyperframes render --quality draft   --output renders/draft.mp4
npx hyperframes render --quality standard --output renders/final.mp4
```

---

## 7. What you need to reproduce this

- **Node + npm**, the `hyperframes` CLI (`npx hyperframes`), FFmpeg (for editing), Chrome (for render). Check with `npx hyperframes doctor`.
- **`ELEVENLABS_API_KEY`** in the workspace `.env` (transcription).
- The **5 local skills** in §2 (bundled in this kit under `skills/`).
- The **video-use skill** installed separately (see §2).
- The **workspace scripts** (§3) and the **project scripts** (§3).
- A **style template** to copy from (§5).
- Your own **raw recording** to feed in.

---

*Generated as a companion to the kit zip. Media files are intentionally excluded — everything here is text/code you can re-run against a fresh recording.*
