# COMPLETED — final video ready

User approved all 37 cuts with “yes looks good.” Render, fresh transcription, three-pass verification and source-frame comparison are complete. Final: renders/final.mp4. See VERIFICATION.md.

The prior pending-approval and draft-failure notes below are historical and resolved.

# Pipeline state

Order confirmed from content: 1.mov then 2.mov. Source copies are in assets/part1.mov and assets/part2.mov; originals untouched. Combined source 1372.133333 seconds, 3840×1080 at 30 fps.

## Completed

- Both parts transcribed with ElevenLabs Scribe.
- Mandatory stretched-token clamp run; 16 isolated re-transcriptions and RMS checks performed, repairs recorded in assets/transcript-repairs.json.
- Silence EDL and mechanical mistake candidates generated.
- Entire source transcript read editorially. 37 proposed cuts located uniquely with following keep anchors; see CUT-REVIEW.md, assets/proposed-cuts.json and edit-specs.json.
- Intentional “super, super” and grammatical “access to to actually” preserved.
- Initial silence-only MP4 rendered as assets/clean-silences.mp4. Its audio precheck found residual pauses, so this is a draft, not a verified deliverable.
- Source-side residual patches checked using 21 isolated audio transcriptions. assets/residual-cuts.json contains conservative corrections, preserving quiet speech where silencedetect gave false positives (“actual”, “anymore”).
- Corrected silence audio assets/clean-silences-v2.wav/.mp3 is 807.2 seconds. Its fresh audio transcript has one 2.32-second gap around the off-mic unrelated “We can change our names…” fragment; proposed mistake cut 7 removes this region. All other gaps and tail pass. No corrected silence MP4 rendered yet.

## Pending user approval

The cut-mistakes skill explicitly requires candidate presentation and approval. User was shown CUT-REVIEW.md in Codex and asked asynchronously to apply all 37, finish silence-only, or specify edits. No reply received at the time of this note. Do not treat elapsed time as approval. No mistake cuts have been applied.

## Continue after approval

1. Copy approved proposals to assets/approved-cuts.json and record actual user authorization.
2. Run apply-cuts.mjs without --apply for the downstream retimed transcript.
3. Render from ORIGINAL files using render-edit.py v1; it unions source silence EDL, approved source cuts, and residual-cuts.json, uses source frame boundaries and 4ms audio fades. Before final render, inspect short keep slivers: drop sub-0.3-second silence-only slivers but retain any real kept speech. Do not blindly remove short speech.
4. Freshly transcribe the actual rendered MP4. Run find-retakes.mjs and read the full sentence dump; inspect any residual restart not covered by proposals.
5. Run the three verify-cuts passes, plus verify-integrity.py v1 (exact frame count, dimensions, A/V sync, EDL partition). Add phrase checks that account for retained repetitions; generic removed fragments may remain inside the kept take.
6. Inspect extracted frames around edits and the part boundary. Deliver only after PASS. No motion cards or layout changes have been authored; current stage scope follows the recent Adobe Transfer cleanup projects (silences, mistakes, verify).

Shared workspace scripts had pre-existing modifications; this run did not alter them. All work for this run lives in this project folder.

Initial video integrity check: EDL partition, A/V sync, resolution and fps pass, but silence-v1 render has 26,095 frames versus 26,096 expected (one frame short). Investigate ffconcat trim precision at the part boundary before final delivery; do not relax the exact-frame check to hide it. Probe format duration has six-decimal precision, so subtracting the part offset can put a local inpoint just after the intended frame.
