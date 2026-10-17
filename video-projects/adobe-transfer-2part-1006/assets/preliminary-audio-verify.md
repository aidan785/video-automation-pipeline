# Verification passes — video-projects/adobe-transfer-2part-1006/assets/clean-v1-audio.json

Result: FAIL · 2 fail(s), 2 warning(s)

## PASS 1 · silence sweep
- **OK** no inter-word pause exceeds 0.75s across 2778 words

## PASS 2 · cuts sweep
- **FAIL** phrase count: "How can Minecraft be merged into GTA 5?" found 0x, expected 1x
- **FAIL** phrase count: "It's an eight-bit shooter style game," found 0x, expected 1x
- **WARN** possible residual stutter "for. For" at 9:19.11 — re-read in context
- **WARN** possible residual stutter "And, and" at 13:04.59 — re-read in context

## PASS 3 · ledger sweep
- **OK** rendered 804.43s matches EDL expectation 804.43s (drift 0.00s)
