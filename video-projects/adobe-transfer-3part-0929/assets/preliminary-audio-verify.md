# Verification passes — video-projects/adobe-transfer-3part-0929/assets/clean-v1-audio.json

Result: FAIL · 6 fail(s), 11 warning(s)

## PASS 1 · silence sweep
- **FAIL** residual pause 1.34s at 8:24.40 between "three." and "Okay."
- **FAIL** residual pause 0.82s at 8:33.58 between "jugs." and "The"
- **FAIL** residual pause 1.34s at 8:54.64 between "that." and "Oh,"
- **FAIL** residual pause 1.60s at 9:00.80 between "in?" and "Oh,"
- **FAIL** residual pause 0.82s at 9:08.20 between "sensitive." and "Oh,"
- **FAIL** residual pause 1.22s at 13:26.11 between "No." and "Well,"

## PASS 2 · cuts sweep
- **WARN** no phrase checks supplied (pass --candidates + --cuts, or --phrases) — cut removal verified by ledger only
- **WARN** possible residual stutter "Subway, Subway" at 0:39.02 — re-read in context
- **WARN** possible residual stutter "very, very" at 7:48.50 — re-read in context
- **WARN** possible residual stutter "this. This" at 8:13.70 — re-read in context
- **WARN** possible residual stutter "Very, very" at 11:27.14 — re-read in context
- **WARN** possible residual stutter "No, no," at 12:03.74 — re-read in context
- **WARN** possible residual stutter "no, no." at 12:03.96 — re-read in context
- **WARN** possible residual stutter "it, it" at 14:50.37 — re-read in context
- **WARN** possible residual stutter "this. This" at 15:21.49 — re-read in context
- **WARN** possible residual stutter "I'm, I'm" at 16:23.05 — re-read in context
- **WARN** possible residual stutter "here, here" at 16:46.33 — re-read in context

## PASS 3 · ledger sweep
- **OK** rendered 1098.17s matches EDL expectation 1098.17s (drift 0.00s)
