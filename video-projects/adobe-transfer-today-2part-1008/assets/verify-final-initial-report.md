# Verification passes — video-projects/adobe-transfer-today-2part-1008/assets/final-video.json

Result: FAIL · 2 fail(s), 5 warning(s)

## PASS 1 · silence sweep
- **OK** no inter-word pause exceeds 0.75s across 2761 words

## PASS 2 · cuts sweep
- **FAIL** phrase count: "Okay, so this build has no speech-to-text." found 0x, expected 1x (cut 30 kept take)
- **FAIL** phrase count: "nine-minute and one-second video" found 0x, expected 1x (cut 32 kept take)
- **WARN** possible residual stutter "very, very" at 5:13.94 — re-read in context
- **WARN** possible residual stutter "this. This" at 9:36.92 — re-read in context
- **WARN** possible residual stutter "very, very" at 10:29.96 — re-read in context
- **WARN** possible residual stutter "Photocraft. Photocraft." at 12:04.58 — re-read in context
- **WARN** possible residual stutter "it. It" at 12:14.16 — re-read in context

## PASS 3 · ledger sweep
- **OK** rendered 776.33s matches EDL expectation 776.33s (drift 0.00s)
