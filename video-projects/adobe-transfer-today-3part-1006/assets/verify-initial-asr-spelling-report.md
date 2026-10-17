# Verification passes — video-projects/adobe-transfer-today-3part-1006/assets/final-video.json

Result: FAIL · 3 fail(s), 5 warning(s)

## PASS 1 · silence sweep
- **OK** no inter-word pause exceeds 0.75s across 4071 words

## PASS 2 · cuts sweep
- **FAIL** phrase count: "We're gonna be utilizing the MyVoices in Fish Audio." found 0x, expected 1x
- **FAIL** phrase count: "the Fish Audio S 2.1 Pro model" found 0x, expected 1x
- **FAIL** phrase count: "this new Fish Audio S 2.1 Pro audio model" found 0x, expected 1x
- **WARN** possible residual stutter "really, really" at 4:48.36 — re-read in context
- **WARN** possible residual stutter "you. You" at 7:52.56 — re-read in context
- **WARN** possible residual stutter "blah, blah," at 10:22.46 — re-read in context
- **WARN** possible residual stutter "blah, blah," at 10:22.58 — re-read in context
- **WARN** possible residual stutter "blah, blah." at 10:22.84 — re-read in context

## PASS 3 · ledger sweep
- **OK** rendered 1135.67s matches EDL expectation 1135.67s (drift 0.00s)
