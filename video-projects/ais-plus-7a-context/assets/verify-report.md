# Verification passes — video-projects/ais-plus-7a-context/assets/clean-fresh.json

Result: FAIL · 7 fail(s), 4 warning(s)

## PASS 1 · silence sweep
- **FAIL** residual pause 0.84s at 1:27.74 between "that." and "Okay,"
- **FAIL** residual pause 0.76s at 1:46.46 between "on." and "Just"
- **FAIL** residual pause 0.90s at 4:36.40 between "whatever," and "Claude"
- **FAIL** residual pause 0.94s at 9:07.70 between "do." and "Okay,"
- **FAIL** residual pause 0.85s at 10:26.35 between "will" and "one"
- **FAIL** residual pause 0.90s at 12:17.78 between "okay?" and "So"

## PASS 2 · cuts sweep
- **WARN** no phrase checks supplied (pass --candidates + --cuts, or --phrases) — cut removal verified by ledger only
- **WARN** possible residual stutter "is, is" at 4:22.64 — re-read in context
- **WARN** possible residual stutter "blah, blah," at 11:30.48 — re-read in context
- **WARN** possible residual stutter "blah, blah." at 11:30.60 — re-read in context

## PASS 3 · ledger sweep
- **FAIL** rendered duration 761.29s vs EDL expectation 760.00s (drift 1.29s)
