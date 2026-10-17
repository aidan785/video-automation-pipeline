# Verification passes — video-projects/adobe-transfer-3part-0923/assets/clean-v1-audio.json

Result: FAIL · 14 fail(s), 1 warning(s)

## PASS 1 · silence sweep
- **FAIL** residual pause 0.88s at 4:01.82 between "$8." and "Also,"
- **FAIL** residual pause 0.80s at 4:23.24 between "$40" and "with"
- **FAIL** residual pause 0.78s at 9:52.64 between "$2.79," and "roughly,"
- **FAIL** residual pause 0.82s at 9:59.44 between "$6." and "Again,"

## PASS 2 · cuts sweep
- **FAIL** phrase count: "with Opus 5.5." found 3x, expected 1x (approved cut 3: keeps)
- **FAIL** phrase count: "which is connected to my cloud session?" found 0x, expected 1x (approved cut 5: keeps)
- **FAIL** phrase count: "But what I want to show you" found 0x, expected 1x (approved cut 8: keeps)
- **FAIL** phrase count: "a full agent team," found 0x, expected 1x (approved cut 29: keeps)
- **FAIL** phrase count: "ten seconds long, which is great." found 0x, expected 1x (approved cut 30: keeps)
- **FAIL** phrase count: "in the previs generation" found 0x, expected 1x (approved cut 33: keeps)
- **FAIL** phrase count: "We're going to connect Artlist." found 0x, expected 1x (approved cut 39: removes)
- **FAIL** phrase count: "We're going to connect Artlist," found 0x, expected 1x (approved cut 39: keeps)
- **FAIL** phrase count: "so great on Opus five point five." found 0x, expected 1x (approved cut 48: keeps)
- **FAIL** phrase count: "where there's almost four thousand members" found 0x, expected 1x (approved cut 51: keeps)
- **WARN** possible residual stutter "very, very" at 0:28.50 — re-read in context

## PASS 3 · ledger sweep
- **OK** rendered 648.50s matches EDL expectation 648.50s (drift 0.00s)
