# Blender Previz Tutorial — 1.mov followed by 2.mov

Source order: `/Users/aidanstanik/Projects/Adobe Transfer Folder/1.mov` then `2.mov`.

Content: Blender/Codex/Higgsfield tutorial covering scene examples, computer-use setup, building a previz scene, environment and character reference sheets, the master video prompt, the Blender plugin, phone camera control, generation, and the final result/outro.

## Edit decisions

- Preserve original 3840×1080, 30 fps, screen-left/webcam-right layout.
- Remove long generation waits, browsing dead air, abandoned takes, repeated explanations, and off-topic background speech captured during a wait.
- First editorial pass: 82 source-anchored decisions, each reviewed with the following kept phrase. The automatic detector suggested 22 candidates; several were false positives.
- Passing-agent refinements: remove the abandoned `create` before `sculpt things`, `to as` before `why`, and a partial `S-` before Seedance. Tighten three residual pauses.
- Restore “I don't know” after “flat view.” The shared builder's minimum-keep rule had bridged away that short phrase. The final edit retains the first complete “I don't know” and removes the redundant restart.
- Final boundary refinement: widen the portal-sentence restart cut by 0.1 seconds total. This removes a residual `j-` while keeping the complete “just like I had shown you” phrase. The isolated revised audio transcribes cleanly.
- Preserve intentional emphasis (`much, much`, `very, very`, `really, really`), the grammatical “access to to set…,” and “Add, add” while adding two reference slots.
- No generated voice, narration replacement, graphics, music, captions, crop, or speed change was used.

## Timing and encoding

Original: 64:42.200. Final planned duration: 20:58.267. Removed: 43:43.933, or about 67.6%.

The final edit contains 250 retained source intervals. The second input begins around 19:59.633 in the final timeline. Both original files are preserved; their order, metadata and SHA-256 fingerprints are in `run-manifest.json`.

Final video is encoded once from the original H.264 media using libx264, CRF 18, preset fast, with AAC stereo at 192 kb/s. Cuts align to source frames, audio aligns to matching 48 kHz samples, and 4 ms fades avoid discontinuities at joins. A concat manifest references the originals without duplicating the 4 GB first recording. The task-local renderer seeks only into retained sections instead of decoding long deleted waits through hundreds of filter branches.

## Verification evidence

The passing agent performs three complete sweeps over a fresh transcription of the actual MP4: silence, editorial cuts/retakes, and ledger/coverage. The final verdict is recorded in `assets/verify-report.md`; automated findings are kept separately from contextual adjudication of meaningful repeated words.

The independent integrity script checks finite EDL fields, non-overlapping ordered keep/delete ranges, complete partition of the source, exact expected frame count, source resolution, audio duration, and A/V duration agreement. This supplements the shared verifier's missing-field weakness documented in `PROJECT-ANALYSIS.md`.

Contact sheets show the start of every retained segment; sampled frames are compared with their source counterparts. A full FFmpeg decode check tests for damaged media. The source contact sheets also confirm that idle browsing/generation windows were removed.

## Reproduce the final encode

Run from the Video Automation workspace root:

```sh
node video-projects/adobe-transfer-2part-0909/render-edit.mjs \
  video-projects/adobe-transfer-2part-0909/assets/refinements-v3.json \
  video-projects/adobe-transfer-2part-0909/assets/clean-v3.mp4
```

This requires the two source files still to exist at their recorded paths. After any re-render, re-transcribe and rerun all verification; old reports do not certify new bytes.

Important artifacts: `edit-specs.json`, `assets/approved-cuts.json`, `assets/source.json`, `assets/source.orig.json`, `assets/source.silence-edl.json`, `assets/seed.union-edl.json`, `assets/refinements-v3.json`, `assets/clean-v3.union-edl.json`, the final fresh transcript, verification report and complete removal ledger.

`PROJECT-ANALYSIS.md` contains the full workspace review, including reproduced verifier/dashboard issues. Shared pipeline files and unrelated pre-existing edits were left as found. Early draft media may be removed to conserve space; transcripts, EDLs and decision history remain.

## Completed delivery

Final actual-MP4 verification: **PASS**, all three sweeps, 70/70 phrase checks, zero gaps above 0.70 seconds, and no remaining editorial mistakes identified. Full decode passed with no errors; all 250 join frames were visually inspected, with 26 source-frame comparisons. Audio/video duration difference is 0.000016 seconds.

Delivered video: `/Users/aidanstanik/Projects/Adobe Transfer Folder/Blender Previz Tutorial - Edited.mp4`. A verified identical copy is in `renders/final/`. SHA-256: `8c3de9d51f5ca1350a761ab84fec6198bf05bf7b8c349179155141ec2190ecfc`. The complete root QA record is `assets/final-qa.json`; delivery fingerprints are in `run-manifest.json`.
