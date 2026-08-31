# Video Automation - Team Onboarding

Welcome. This repo turns raw talking-head recordings into finished, human-feeling edits with motion graphics, driven by Claude Code and a set of modular editing agents. This guide gets you from zero to editing the AIS Live October ads in both horizontal (16:9) and vertical (9:16).

## 1. What this project is

- A raw recording goes in, a polished edit comes out. The work is split into composable Claude Code skills that run in order: **cut-silences** (trim dead air), **cut-mistakes** (remove stutters, false starts, retakes), **verify-cuts** (a mandatory passing agent that re-transcribes the render and proves every cut landed), **motion-graphics** (tiered cards over the clean edit), and **insert-broll**.
- Compositions are built on [HyperFrames](https://hyperframes.heygen.com), which is HTML-native video (not Remotion). You author scenes as HTML + GSAP timelines and render locally.
- Everything is transcript-driven. ElevenLabs Scribe gives word-level timestamps, and every cut and animation is anchored to those words.
- You do not run the agents by hand. You open Claude Code inside the repo and ask for what you want ("cut the silences in this recording", "run the retake pass", "add motion graphics"). The skills in `.claude/skills/` encode the how. `CLAUDE.md` at the repo root is the full workspace guide and Claude reads it automatically.

## 2. Getting access

**Code:** the repo is private on GitHub at `github.com/aidan785/video-automation-pipeline`. Ask Aidan (aidan@uppitai.com) to add you as a collaborator, then clone it (or fork it if you want your own copy to experiment in):

```bash
git clone https://github.com/aidan785/video-automation-pipeline.git "Video Automation"
```

**Footage:** raw recordings and renders are gitignored and never live in the repo. For the October campaign, sources are in the Drive Marketing folder:
https://drive.google.com/drive/folders/1lnOE7qo_oY4J1mr553FJR8-F9Xt7Mcv1

- `Raw Recordings/AIS Live October Ads RAW.mp4` - all the ad takes in one recording
- `Raw Recordings/AIS Live Oct VSL RAW.mp4` - the VSL source
- `AIS Live AI OS: Talking-Head Ad Scripts` - the 10 ad scripts (hooks, transitions, the two standard bodies)
- Sales page draft and copywriting brief for context

**API key:** you need an `ELEVENLABS_API_KEY` for transcription. Get it from Aidan. Put it in a `.env` file at the repo root. `.env` is gitignored; never commit keys anywhere, including `.env.example`.

## 3. Setup (about 10 minutes)

1. Install: Node 20+, ffmpeg (`brew install ffmpeg` on macOS), Google Chrome, and [Claude Code](https://claude.com/claude-code).
2. `npm install` at the repo root.
3. Create `.env` with `ELEVENLABS_API_KEY=...`
4. Sanity check: `cd` into any project under `video-projects/` and run `npx hyperframes doctor`. It verifies Node, FFmpeg, and Chrome.
5. Open Claude Code at the repo root. It picks up `CLAUDE.md` and all the skills automatically.

## 4. Repo layout in 30 seconds

```
CLAUDE.md, MOTION_PHILOSOPHY.md    workspace guide + motion-graphics aesthetic bible
.claude/skills/                    the editing agents (cut-silences, cut-mistakes, verify-cuts, ...)
scripts/                           shared tooling (transcribe-elevenlabs.mjs, validators)
style-library/                     reusable motion-graphic card pools per look
video-projects/<slug>/             one self-contained folder per video
raw-media/                         gitignored stash for source recordings
```

Each project folder has `index.html` (the composition), `assets/` (media, gitignored), `renders/` (gitignored), and `hyperframes.json`. Always run HyperFrames CLI commands from inside the project folder.

## 5. Editing the October ads (16:9 and 9:16)

Every ad is the same shape: a unique spoken hook, a spoken transition line, then one of two shared bodies (the Start body or the Scale body). So we do not edit 10 full videos. We build each shared body once per orientation, then cut each hook and hard-cut it into the shared body. Only the front of each ad changes.

The previous campaign's projects are the working templates and they live in the repo:

- **Horizontal:** `video-projects/ais-live-ads/` (1920x1080)
- **Vertical:** `video-projects/ais-live-ads-9x16/` (1080x1920)

### The flow per orientation

1. **Prep the source.** Download the raw from Drive, then re-encode to H.264 before referencing it:
   ```bash
   ffmpeg -i raw.mov -c:v libx264 -preset medium -crf 20 -c:a aac -b:a 192k -movflags +faststart assets/clip.mp4
   ```
2. **Transcribe** from the repo root: `node scripts/transcribe-elevenlabs.mjs assets/clip.mp4` (word timestamps land next to the input).
3. **Clean the takes.** In Claude Code: run cut-silences, then cut-mistakes on the body take and each hook take. Aidan re-records lines constantly, so the editorial retake read inside cut-mistakes is mandatory, the mechanical detector only catches a fraction of real retakes. Then run verify-cuts; a PASS is required before any graphics work.
4. **Find the seams.** Using the transcript, locate where each hook ends and the body begins (the body starts at its known first line, per the scripts doc). Trim each hook out as `intro<N>-source.mp4`.
5. **Build the shared body composition once** (motion graphics + CTA ending over the clean body render), then **build one small intro comp per hook** (`_intros/intro<N>.html`) using the same visual system so the cut reads as one continuous look. The intro holds its last beat and hard-cuts into the body, no fancy transition. Keep intro masters in `_intros/` (a second root .html next to index.html breaks lint).
6. **Assemble** with ffmpeg concat stream-copy so audio stays continuous (use absolute paths in the list file):
   ```bash
   ffmpeg -f concat -safe 0 -i list.txt -c copy "Ad N - 16x9.mp4"
   ```

### Horizontal vs vertical: what actually changes

The cut points and audio are identical between orientations. What changes is layout:

- **16:9:** the speaker is reframed (translate + scale) to sit right of center, and motion graphics live in a persistent left panel (onyx scrim + AIS Live grid). Kicker chips and boxed cards, no glow effects, no whip transitions.
- **9:16:** the video stays full-frame with no reframe or scale, the face stays clear up top, and ALL graphics are overlays anchored to the bottom half over a bottom scrim + grid panel. The AIS LIVE bug is centered at the top of the lower band. The only full-screen element is the CTA takeover at the end.

Both projects already implement these layouts; copy the existing project folder, swap in the new footage and beat text, and adjust timings to the new transcript.

### Style rules for anything AIS Live

- Accent color is blue `#37BDF8` only, no other accent colors.
- No em dashes in on-screen text.
- Read `MOTION_PHILOSOPHY.md` before any creative work and run its pre-flight checklist before calling a piece done.

## 6. Quality gates (non-negotiable)

1. `npx hyperframes lint` before every render.
2. **Gate 1:** live Studio preview (`npx hyperframes preview`, port 3002) reviewed and signed off before any render, even a draft.
3. After a draft render: extract one frame per scene and actually look at each one (face not cropped, animations land on the right word, no overflow). Lint passing is not verification.
4. **Gate 2:** review the rendered MP4 (serve with `npx serve . -p 8080 -n`, not Python's http.server) before the final quality render.
5. Never start a full final render without explicit approval.

## 7. Command cheat sheet

```bash
# inside a project folder
npx hyperframes preview                                   # Studio + hot reload :3002
npx hyperframes lint                                      # always before rendering
npx hyperframes render --quality draft   --output renders/draft.mp4
npx hyperframes render --quality standard --output renders/final.mp4

# from the repo root
node scripts/transcribe-elevenlabs.mjs <video-or-audio>   # word-level transcript
npx hyperframes doctor                                    # environment check
```

## 8. Working agreements

- One branch per job, PR into `main`. Keep media out of git (the gitignore already handles mp4/mov/wav, `renders/`, `raw-media/`).
- Small artifacts (transcripts, EDLs, JSON, HTML, poster PNGs) DO get committed, they are what make edits reproducible.
- When in doubt, ask Claude Code inside the repo first. The skills and `CLAUDE.md` encode most answers, including the gotchas from every past edit.

Questions: Aidan Stanik, aidan@uppitai.com
