# Stage + Audience — Vox-style AE layer stack

For Nate Podcast intro, Clip1 ("...what will the audience take away...").
All PNGs are 3840x2160 (2x 1080p). Stack in AE back-to-front, offset in Z,
apply lens blur per layer (heavier toward camera on the audience rows).

Layer order (back to front):

| # | File | Alpha | Notes |
|---|------|-------|-------|
| 1 | `out/01-backdrop.png` | opaque | paper bg + grain + grid + closed red curtain (center split for a curtain-open reveal) |
| 2 | `out/02-stage-frame.png` | yes | proscenium arch, scalloped valance, stage floor + skirt |
| 3 | `out/03-spotlights.png` | yes | two blue beams + floor glow — screen/add blend, animate opacity |
| 4 | `out/04-audience-back.png` | yes | ~25 small heads |
| 5 | `out/05-audience-mid.png` | yes | ~14 medium heads |
| 6 | `out/06-audience-front.png` | yes | 8 large heads bleeding off bottom — heaviest lens blur |

`out/_preview-composite.png` = all layers flattened for reference.

Palette mirrors `style-library/01-vox-explainer/tokens.css`:
paper #efe9dc · ink #17130e · red #e23b2e / #c22e22 · blue accent #37BDF8.

Regenerate / tweak: edit `gen.mjs` (all geometry + seeded head variety),
then `node gen.mjs && node shot.mjs`. Deterministic — same seeds, same heads.
