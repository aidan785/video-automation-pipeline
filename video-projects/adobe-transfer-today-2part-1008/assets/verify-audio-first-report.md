# Verification passes — video-projects/adobe-transfer-today-2part-1008/assets/clean-v1-audio.json

Result: FAIL · 6 fail(s), 5 warning(s)

## PASS 1 · silence sweep
- **OK** no inter-word pause exceeds 0.75s across 2755 words

## PASS 2 · cuts sweep
- **FAIL** phrase count: "which is eight hundred" found 0x, expected 1x (cut 3 kept take)
- **FAIL** phrase count: "nine minute and one second video," found 0x, expected 1x (cut 32 kept take)
- **FAIL** phrase count: "three minutes and thirty-seven..." found 0x, expected 1x (cut 33 removed phrase)
- **FAIL** phrase count: "three minutes and thirty-seven seconds" found 0x, expected 1x (cut 33 kept take)
- **FAIL** phrase count: "I have yet to find the Effects Craft" found 0x, expected 1x (cut 43 kept take)
- **FAIL** phrase count: "About eighty percent of my watchers aren't subscribed," found 0x, expected 1x (cut 46 kept take)
- **WARN** possible residual stutter "very, very" at 5:13.94 — re-read in context
- **WARN** possible residual stutter "this. This" at 9:36.92 — re-read in context
- **WARN** possible residual stutter "very, very" at 10:29.96 — re-read in context
- **WARN** possible residual stutter "Photocraft. "Photocraft."" at 12:04.58 — re-read in context
- **WARN** possible residual stutter "it. It" at 12:14.16 — re-read in context

## PASS 3 · ledger sweep
- **OK** rendered 776.33s matches EDL expectation 776.33s (drift 0.00s)
