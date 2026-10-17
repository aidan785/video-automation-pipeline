# Verification passes — video-projects/adobe-transfer-today-3part-1006/assets/clean-v2-audio.json

Result: FAIL · 4 fail(s), 5 warning(s)

## PASS 1 · silence sweep
- **FAIL** residual pause 1.38s at 2:58.78 between "just" and "for"

## PASS 2 · cuts sweep
- **FAIL** phrase count: "We're gonna be utilizing the My Voices in Fish Audio." found 0x, expected 1x
- **FAIL** phrase count: "which is just chef's kiss" found 0x, expected 1x
- **FAIL** phrase count: "You can use slash real generator," found 0x, expected 1x
- **WARN** possible residual stutter "really, really" at 4:48.36 — re-read in context
- **WARN** possible residual stutter "you. You" at 7:52.56 — re-read in context
- **WARN** possible residual stutter "blah, blah," at 10:22.46 — re-read in context
- **WARN** possible residual stutter "blah, blah," at 10:22.58 — re-read in context
- **WARN** possible residual stutter "blah, blah." at 10:22.84 — re-read in context

## PASS 3 · ledger sweep
- **OK** rendered 1135.67s matches EDL expectation 1135.67s (drift 0.00s)
