# Adobe Transfer 4-part — Previz-to-Seedance tutorial edit (2026-08-31)

**Final:** `assets/clean-v5.mp4` — 10:37.9, 3840x1080, verify-cuts PASS.
Source: `~/Projects/Adobe Transfer Folder/{1,2,3,4}.mov` concatenated losslessly in order (33:13 raw).

## Pipeline numbers
- Silence pass: 21:15 removed (64%), incl. a 7:12 unattended generation wait in 3.mov. 18 stretched Scribe tokens clamped (one "So" hid 64s of dead air).
- Mistake pass: 33 editorial cuts (73.3s) + 3 retake-read fixes + 5 residual-silence patches. Detector alone found only 5; the rest came from the editorial read.
- Drift proof: render is +0.77s over EDL, linear r=0.993 across 130 joins (benign concat padding, no stray content).

## Protected demo beats (intentional silent gaps)
- ~0:22 — T-rex clip plays fullscreen for 6s after "...using Blender and CDance."
- ~0:45 — backrooms clip plays fullscreen for 10s after "...was all generated in Blender."

## Judgment calls (kept)
- "you're going for. For example" — cross-sentence, not a stutter.
- "need Blender. Blender 5.2 LTS" — reads naturally after the version-fix cut.
- "really, really good at prompting" — emphatic.
- six-second → 30-second prompt narration (5:09-5:27) — kept both takes; the screen shows him editing the typed prompt, audio matches.
- Tiny "v- video" stutter at 9:38 — too small to cut safely.
- "I need a- reference board" hesitation at 7:17 — natural typing pause, quiet-speech zone.

## Notable cuts
- "and I highly recommend downloading Blender 2.5" — misspoken version, corrected take kept.
- Triple retake "Now to connect your skill..." collapsed to final take.
- "I want to use slash--" false start (raw Scribe heard "/Previz." but audio trails off).
- "Now this generation..." abandoned line before the outro.
- Retake-read catches invisible in raw transcript: "as a re- guide" sliver, doubled "with that, with that".

## ⚠ Flag for Aidan
- **Quiet audio 1:56-2:01** ("Blender 5.2 LTS has just been released...") — he drops to ~-32dB there (rest of the video is much hotter). Real speech, kept, but worth a level ride in Premiere. Several smaller quiet-voice moments exist wherever he reads/types.
- Delivery destination not specified — final left in project assets. Previous 3-part edit was copied to the Adobe Transfer Folder as "<name> - Edited.mp4"; say the word and this one follows.

## Artifacts
- `assets/clean-v1.union-edl.json` — final union EDL (matches clean-v5)
- `assets/verify-report.md` — verify pass report
- `assets/approved-cuts.json`, `assets/retake-specs.json`, `assets/residual*-specs.json` — every cut with reasons
- `assets/clean-v5.transcript.json` — fresh transcript of the final render
- Intermediate renders v1-v4 deleted (regenerable from EDLs)
