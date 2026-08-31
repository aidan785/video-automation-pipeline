# Adobe Transfer 07-24 edit

Source: `/Users/aidanstanik/Projects/Adobe Transfer Folder/2026-07-24 16-53-41.mov`
38:56, 3840x1080 (dual-pane), H.264 + AAC, 2.5 GB.

Pipeline run 7/24: cut-silences -> cut-mistakes -> combined single-pass cut
(`_build-combined-cut.mjs`, with MIN_KEEP 0.3 sliver bridge) -> verify-cuts.

DONE 7/24: 13:08 clean cut, verify PASS (round 4), delivered beside source as
`2026-07-24 16-53-41 Edited.mp4` + cutlist.

Round 3 was the big one: Aidan flagged surviving repeats; a full editorial
retake read (`_retake-pass.mjs`, 62 cuts, ~2:26) pieced the best take of every
re-recorded sentence. His style re-records constantly — future edits must
always do this pass; the mechanical detector caught 3 of ~60.

Round 2 was needed: sub-3s Scribe stretched tokens hid 15 pauses from Agent 1;
`_patch-residual-silences.mjs` re-trimmed them from source-side silencedetect
spans (see verify-report.md for the full story).

Key artifacts in `assets/`:
- `raw-transcript.json` — Scribe word-level (stretched tokens clamped; `.orig` = untouched)
- `raw.silence-edl.json` / `raw.silence-transcript.json` — Agent 1
- `approved-cuts.json` + `raw.cut-candidates.md` — Agent 2 (review decisions in cutlist)
- `final-union-edl.json` — the union EDL actually rendered (source coords)
- `clean.mp4` (15:40) + `clean.cutlist.md` + `verify-report.md` (PASS) + `clean.json` (fresh re-transcript)
