# Verification passes — video-projects/adobe-transfer-3part-0920/assets/clean-v1-audio.json

Result: FAIL · 2 fail(s), 3 warning(s)

## PASS 1 · silence sweep
- **OK** no inter-word pause exceeds 0.75s across 2335 words

## PASS 2 · cuts sweep
- **FAIL** phrase count: "Creating your assets and your game's story." found 0x, expected 1x (cut 10 keeps)
- **FAIL** phrase count: "and I'm going to create a tab" found 0x, expected 1x (cut 55 keeps)
- **WARN** possible residual stutter "this. This" at 0:43.38 — re-read in context
- **WARN** possible residual stutter "I'm, I'm" at 8:59.95 — re-read in context
- **WARN** possible residual stutter "Thanks, thanks" at 10:50.91 — re-read in context

## PASS 3 · ledger sweep
- **OK** rendered 652.87s matches EDL expectation 652.87s (drift 0.00s)
