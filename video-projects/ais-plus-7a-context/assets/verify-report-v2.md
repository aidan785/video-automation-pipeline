# Verification passes — video-projects/ais-plus-7a-context/assets/clean-v2-fresh.json

Result: FAIL · 2 fail(s), 4 warning(s)

## PASS 1 · silence sweep
- **FAIL** residual pause 0.86s at 8:52.44 between "do." and "Okay,"

## PASS 2 · cuts sweep
- **WARN** no phrase checks supplied (pass --candidates + --cuts, or --phrases) — cut removal verified by ledger only
- **WARN** possible residual stutter "is, is" at 4:12.50 — re-read in context
- **WARN** possible residual stutter "blah, blah," at 11:13.92 — re-read in context
- **WARN** possible residual stutter "blah, blah." at 11:14.04 — re-read in context

## PASS 3 · ledger sweep
- **FAIL** rendered duration 740.49s vs EDL expectation 739.06s (drift 1.43s)
