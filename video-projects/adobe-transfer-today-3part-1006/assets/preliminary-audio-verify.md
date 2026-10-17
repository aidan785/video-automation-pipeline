# Verification passes — video-projects/adobe-transfer-today-3part-1006/assets/clean-v1-audio.json

Result: FAIL · 2 fail(s), 7 warning(s)

## PASS 1 · silence sweep
- **FAIL** residual pause 1.38s at 2:58.78 between "just" and "for"
- **FAIL** residual pause 0.84s at 11:08.36 between "say" and "either"

## PASS 2 · cuts sweep
- **WARN** no phrase checks supplied (pass --candidates + --cuts, or --phrases) — cut removal verified by ledger only
- **WARN** possible residual stutter "really, really" at 4:48.36 — re-read in context
- **WARN** possible residual stutter "you. You" at 7:52.56 — re-read in context
- **WARN** possible residual stutter "blah, blah," at 10:22.46 — re-read in context
- **WARN** possible residual stutter "blah, blah," at 10:22.58 — re-read in context
- **WARN** possible residual stutter "blah, blah." at 10:22.70 — re-read in context
- **WARN** possible residual stutter "in- in-" at 14:16.92 — re-read in context

## PASS 3 · ledger sweep
- **OK** rendered 1139.20s matches EDL expectation 1139.20s (drift 0.00s)
