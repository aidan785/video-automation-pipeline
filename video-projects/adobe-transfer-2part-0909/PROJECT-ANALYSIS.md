# Video Automation project analysis

Reviewed 2026-09-09 against the local working tree, including its existing uncommitted changes. This is a workspace architecture and reliability review plus an actual two-file editing test. It is not a visual approval of every older composition in the archive.

## Assessment

The project has a working, modular editing toolkit and substantial production history. Its strongest parts are the source-coordinate edit lists, word-level transcription, preserved editing decisions, and mandatory fresh-transcript retake review. It is currently an agent-operated toolkit, rather than a single reliable unattended job runner. The README significantly understates its current capabilities, while the dashboard can overstate completion.

The requested workflow is implemented: cut-silences → cut-mistakes → verify-cuts. Those three skills were applied to this job, with an independent passing agent. Motion graphics and B-roll are later stages and were outside this requested cleanup.

## Workspace map

| Location | Role | Assessment |
|---|---|---|
| `CLAUDE.md` | Main pipeline guide, commands and authoring rules | Most useful entry point; substantially newer than README |
| `.claude/skills/` | 11 modular skills | Editing, verification, HyperFrames, GSAP, motion, B-roll and AE transfer instructions are present |
| `scripts/` | Transcription, preview preflight, beat sync, review pages and asset tooling | Reusable utilities; no master edit command in package scripts |
| `video-projects/` | Individual video jobs with source/transcript/EDL/render history | About 48 GB at initial inspection; largest workspace storage consumer |
| `editing-os/` | Node HTTP server, filesystem scanner and visual dashboard | Observes artifacts and recent activity; does not execute the editing agents |
| `style-library/` | Reusable card collections and registry | About 305 MB; supports the later graphics stage |
| `style-templates/` | Starter composition layouts | Small reusable templates |
| `asset-library/` | Cached images, clips and registry | Shared asset acquisition and reuse |
| `reference/` | Worked example and original kit documentation | Useful design/pipeline reference |
| `ae-assets/` | After Effects-related assets | Separate from this cleanup path |
| `raw-media/` | Unassigned original recordings | About 890 MB; deliberately excluded from Git |

The dashboard scan found 107 video projects and 3 utility projects, with renders detected in 52 projects. It flagged 43 render histories as stale; these are dashboard heuristics, not 43 confirmed broken videos.

The 11 local skills are cut-silences, cut-mistakes, verify-cuts, hyperframes, hyperframes-cli, hyperframes-registry, hyperframes-video-beats, hyperframes-to-ae, gsap, motion-graphics, and insert-broll. These are instruction files with supporting scripts. They still need a reasoning agent to read context, choose cuts, and coordinate the tools.

## What works well

1. **Source-coordinate editing.** The combined cut builder maps silence-edited decisions back to the original recording. Revisions can be encoded from the source, avoiding repeated generation loss.
2. **Separated responsibilities.** Silence removal does not intentionally make editorial decisions. Mistake removal handles abandoned takes; verification checks the rendered result.
3. **Explicit editorial history.** JSON EDLs, candidate lists, cut reasons and retake specifications make edits reviewable and reproducible.
4. **Fresh-output verification.** Re-transcribing the actual render is stronger evidence than trusting a transcript mathematically retimed from the original.
5. **Mandatory retake read.** The skill correctly acknowledges that sentence similarity misses most small restarts and some large retakes.
6. **Preserved source media.** Large footage and renders are excluded from Git, while small decisions and transcripts are intended to be tracked.
7. **Local tooling available.** Node v25.9.0, FFmpeg 8.1.1, HyperFrames 0.7.26 and Playwright 1.60.0 are installed. The ElevenLabs transcription request succeeded during this test.

## Reliability findings, in priority order

### 1. The verification ledger can accept malformed EDLs

`verify-passes.mjs` subtracts `e.removed` without requiring that field to exist or be finite. The combined cut builder and the residual/retake patchers do not emit `removed`. Arithmetic then becomes `NaN`, and the `> tolerance` comparisons do not fail. It also does not independently prove that keep ranges and delete ranges form a complete non-overlapping partition of the source.

This is reproduced in `audit/checks.mjs`: a deliberately invalid ledger with source duration 100 seconds, edited duration 1.4 seconds, one second kept, one second deleted, and no `removed` field receives PASS. See `audit/invalid-ledger-result.md`. That fixture is only a diagnostic, not this video's ledger.

**Recommended correction:** validate finite fields and range bounds first; derive removed/kept sums independently; prove full coverage; reject missing or contradictory values. This job writes an explicit `removed` value and uses an independent partition check before delivery.

### 2. The dashboard's verification status does not prove a pass

`editing-os/lib/stages.mjs` marks verification done when `assets/clean.mp4` merely exists. It also treats `.verify.json`/`.checks.json` existence as sufficient, without reading the verdict. Markdown verification reports produced by the actual verifier are not recognized there. The README says a future `verify-report.md` will be direct evidence, but that behavior is absent in the inspected implementation.

The diagnostic fixture confirms that a directory containing only `clean.mp4` produces verify = done. The studio's character animation represents artifact recency, not a currently running verification process.

**Recommended correction:** use a structured verification result containing verdict, render fingerprint, EDL fingerprint, transcript fingerprint, and completion time. Only a matching PASS should mark verification done.

### 3. Silence thresholds need recording-specific calibration

The default -30 dB residual detector proposed 35 extra deletions for this job. Isolated transcription showed that several crossed quiet speech, particularly the phone-camera demonstration. Rechecking at -40 dB reduced the candidates to 13. The retained speech must still be checked after rendering: an acoustic threshold alone cannot prove that a passage is disposable.

The stretched-token clamp has the same limitation. On this job it made 25 clamp operations, including multiple operations on one long token. Some endpoints were too short: for example, `workflow` was reduced to about 69 ms, while its isolated transcription showed a longer spoken word. Short slice checks were used to correct these endpoints.

**Recommended correction:** estimate noise floor, review suspicious clamps, retain word-onset/tail margins, and incorporate acoustic evidence into the transcript instead of trusting either source alone.

### 4. Tokens wholly inside silence can survive the clamp

The clamp handles silence at a token's head, tail, or middle, but skips a token lying entirely inside a silence. This run contained phantom/stretched `Go`, `and`, and `where` tokens. The long `where` token was originally positioned around 50:25–51:04, while an isolated source transcription located the real word around 52:09.7.

**Recommended correction:** separately enumerate every remaining oversized token after clamping and reject impossible timing. Retain an immutable original transcript and a correction ledger. This run keeps both plus isolated audio/transcripts.

### 5. Automatic retake proposals need editorial judgment

The detector found 22 candidates: three retakes and 19 adjacent repeats. Some retake proposals would remove distinct explanations; many adjacent repeats are emphasis or grammatically required. The first editorial pass instead specified 82 precise cuts, followed by a separate passing-agent review.

Examples intentionally retained include “much, much lower,” “very, very important,” the grammatical “access to to set…,” and “Add, add” while creating two image slots. These should not be silently classified as mistakes.

**Recommended correction:** preserve the full-context review and exact keep anchors; do not turn candidate confidence into automatic approval.

### 6. Timing and render implementation need a shared contract

The skills document cumulative video-frame padding in large trim/concat graphs. Arbitrary fractional-second boundaries can cause output duration to differ from EDL duration after hundreds of joins. Separate retimed transcript code also drops a whole word when a boundary excludes only a few milliseconds of its timestamp; the preliminary planned transcript omitted “session” even though almost the entire spoken word was kept.

This run uses a task-local renderer with cuts quantized to the 30 fps source frame grid, PCM audio spliced at matching sample boundaries, and 4 ms audio fades. It seeks directly to the retained video sections. The initial large filter approach was slower because it processed discarded waits and many branches. Final frame count, sample duration and synchronization are checked separately.

**Recommended correction:** define frame/sample rounding and word-overlap rules once, use them in all renderers/transcript mappers, and regression-test many-cut jobs and multi-source seams. `MIN_KEEP = 0.3` can also erase legitimate short kept speech; sliver handling should be aware of words, not only duration.

### 7. Documentation and orchestration lag behind the toolkit

There is no root `AGENTS.md`; the main local guide is `CLAUDE.md`. This session explicitly discovered and read the project skills from `.claude/skills/`. A documented entry point matters when testing the same toolkit through different agent clients.

README still lists silence removal as “building first” and mistake removal as planned, although their skills and prior outputs exist. `package.json` exposes transcription, beat validation, preflight and dashboard commands, but no end-to-end edit command. No dedicated test script or CI directory was found in the reviewed root tooling.

**Recommended correction:** add a resumable job manifest with explicit ordered inputs, source fingerprints, per-stage status, parameters, artifact paths and verified delivery. Update README to point to the real current workflow. Keep creative preview gates separate from plain source cleanup so automation knows which workflow applies.

### 8. Reproducibility and storage need explicit ownership

The working tree already contained modified shared editing scripts and unrelated project work before this job. Those changes were preserved. Only a new job folder was created for this test. The supplied filenames are reused across previous Adobe Transfer jobs, so a path alone is not a stable source identity.

Initial free disk space was about 7.1 GiB. A duplicate 4 GB concatenated source would have consumed most of it. This job instead uses an ordered concat manifest and symlinks to the two originals.

**Recommended correction:** record file sizes, timestamps and hashes, tool versions, skill/script revisions, and source order in every job. Add a retention policy for regenerable intermediates. A symlink-based job requires the originals to remain available; a later archival step can preserve them when storage is available.

### 9. Transcript detection can miss longer jobs

The dashboard reads only the first 16 KB of at most 12 JSON candidates and searches for a `"words"` key. Long ElevenLabs responses place the full text before that key, and jobs with many revision artifacts can exhaust the candidate cap first. A real transcript can therefore appear absent, which can also misclassify the entire project as unknown.

**Recommended correction:** prefer canonical transcript paths or a job manifest; parse a bounded schema instead of relying on arbitrary JSON property order and directory order. The delivered job includes a final transcript with its words array first so it is visible to the existing scanner.

## This test's scope and artifacts

Inputs are `Adobe Transfer Folder/1.mov` then `2.mov`, totaling 3,882.2 seconds (64:42.2). Both are H.264/AAC, 3840×1080, 30 fps, with the screen on the left and webcam on the right. The content is a Blender/Codex/Higgsfield previz tutorial. The edit retains that layout, the tutorial sequence, demonstrations under narration, and the second clip's result review/outro.

The original transcription contains 5,127 words. The silence planning pass removes 2,384.881 seconds (61.4%) before editorial cuts. The final edit is 20:58.267 after three editorial revisions, removing 43:43.933 (67.6%). Exact delivery and verification evidence are recorded in `EDIT-NOTES.md` and the final verification report.

Review artifacts live in `assets/`: original and corrected transcripts, silence and mistake EDLs, approved cuts, isolated transcriptions, render EDLs and fresh verification transcripts. `frames/` contains source overview sheets and final visual checks. `audit/` contains the workspace snapshot and executable demonstrations of the two verification-status issues above.

The shared pipeline code was analyzed but not broadly rewritten as part of this video request. The task-local render helpers make this specific edit reproducible and provide a concrete basis for a later shared-pipeline improvement.
