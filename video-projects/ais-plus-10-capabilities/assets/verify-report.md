# Verification passes — video-projects/ais-plus-10-capabilities/assets/clean-fresh.json

Result: FAIL · 2 fail(s), 1 warning(s)

## PASS 1 · silence sweep
- **FAIL** residual pause 0.92s at 1:25.94 between "even" and "what"
- **FAIL** residual pause 0.76s at 1:33.00 between "did," and "and"

## PASS 2 · cuts sweep
- **WARN** no phrase checks supplied (pass --candidates + --cuts, or --phrases) — cut removal verified by ledger only
- **OK** no immediate word repeats remain

## PASS 3 · ledger sweep
- **OK** rendered 169.70s matches EDL expectation 169.50s (drift 0.20s)
