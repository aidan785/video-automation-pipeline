# CAIC Booth Video — motion graphics pass

- **Source**: `CAIC Edited for MGs.mp4` (56.6s, 1920x1080@60, cuts/silences already done by Aidan). Re-encoded to `assets/clip.mp4` (CRF 20).
- **Transcript**: ElevenLabs Scribe word timestamps → `assets/transcript.json`.
- **Brand**: CAIC design system (`AIS Certificate Program.zip` → caic-design-system). Deep navy `#07121C` command deck, signal cyan `#37BDF8`, Montserrat + Roboto Mono, blur-and-rise motion (no whips, no bounce — per `VIDEO_BRIEF_HYPERFRAMES.md`).

## Layout

- CAIC world as canvas: radial teal glow (top-left bias), masked 48px cyan grid, edge glow, soft vignette.
- Nate zoomed **1.3x**, pinned right (face ≈ x1330), feathered left edge (`mask-image` 170→660px) + navy scrim so the left column reads. Slow 2.5% push-in across the full spot (`#vidPush`, face-pinned origin).
- All beats live in a left column (x 120–760), vertically centered.

## Beat plan (starts lead anchor word by ~0.2–0.5s)

| # | window | content | anchors |
|---|--------|---------|---------|
| B1 | 0.3–6.2 | THE PROBLEM / "Every Company Wants an *AI Person*" / FINDING ONE IS THE HARD PART | every 0.32, finding 2.88 |
| B2 | 6.4–11.5 | YOU ALREADY + 3 check rows (tutorials / tools / work) | 7.06 / 8.10 / 9.28 |
| B3 | 11.6–19.6 | KNOWING AI vs PROVING IT cards + TWO COMPLETELY DIFFERENT THINGS | 11.84 / 13.78 / 18.30 |
| B4 | 19.8–25.6 | OUR UPCOMING PROGRAM / CERTIFIED AI CONSULTANT / CAIC wordmark / AN AIS CERTIFIED CREDENTIAL | 20.28 / 21.16 / 22.72 |
| B5 | 25.8–33.0 | GRADED CONSULTING WORK + 01 problem / 02 fix / 03 ROI | 26.20 / 27.38 / 28.44 / 29.96 |
| B6 | 33.15–38.1 | YOU WALK OUT WITH + portfolio / credential / letter of rec | 34.40 / 35.28 / 36.28 |
| B7 | 38.3–44.0 | COHORT 001 / big 50 SEATS ONLY / AUG 18 KICKOFF | 38.50 / 41.50 / 43.04 |
| B8 | 44.2–48.1 | JOIN THE WAIT LIST pill + TAP THE BUTTON BELOW | 45.60 / 46.88 |
| B9 | 48.3–56.6 | Seal ceremony (seal.js) + "The Program I Wish I *Had*" + COHORT 001 · AUGUST 18, hold + glow breath | 49.12 |

## Build notes

- Single inline composition `caic-booth`; one master timeline; eyebrows type on at 24 chars/sec (per-char spans built at load).
- Seal generated at runtime by `assets/caic/seal.js` (deterministic).
- Fonts localized in `assets/fonts/` (Montserrat variable + italic, Roboto Mono) — no render-time Google fetch.
- Preview: `node ~/.npm/_npx/702923228c2ce1e6/node_modules/hyperframes/dist/cli.js preview --port 3006` (lands on a free port; 3002–3009 are other block sessions).
- Frame check: serve the project statically (`npx serve . -p 8090 -n`), then `node ../../_shot-caic.mjs http://localhost:8090/ caic-booth "2.5,9.5,..." /tmp/caic-shots/beat` (video shows first frame only when seeking — fine for overlay checks).
- **Gotcha**: in Playwright `evaluate`, never implicitly return `tl.seek(t)` — seek returns the timeline and Playwright hangs forever trying to serialize the cyclic GSAP object. Wrap in braces and `return null`. (This also hangs against the 0.7.x studio `/preview`, which is an SPA + iframe that hot-reloads mid-run — static serve is the reliable path.)

## Status

- Lint clean, beat sync validated (all leads within -0.2..1.8s).
- Gate 1 (Studio preview sign-off) pending. No renders yet — render only on Aidan's go.
