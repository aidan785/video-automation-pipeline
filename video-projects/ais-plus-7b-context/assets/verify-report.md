# Verification passes — video-projects/ais-plus-7b-context/assets/clean-fresh.json

Result: FAIL · 1 fail(s), 3 warning(s)

## PASS 1 · silence sweep
- **FAIL** residual pause 0.78s at 1:11.74 between "So" and "if"

## PASS 2 · cuts sweep
- **WARN** no phrase checks supplied (pass --candidates + --cuts, or --phrases) — cut removal verified by ledger only
- **WARN** possible residual stutter "major, major" at 0:55.44 — re-read in context
- **WARN** possible residual stutter "really, really" at 3:28.94 — re-read in context

## PASS 3 · ledger sweep
- **OK** rendered 313.11s matches EDL expectation 312.76s (drift 0.35s)
