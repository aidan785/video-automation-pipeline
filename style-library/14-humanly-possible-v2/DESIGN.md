# Humanly Possible v2: the researched library

Replaces `13-humanly-possible` (deprecated 2026-11-03: Aidan rejected it because the edge-stripe lower thirds, outline boxes and offset shadows read as AI-made).

Every card here comes from frame-by-frame research of real, human-made work: the reference videos were downloaded and every frame analyzed at native fps. The research for each family is the source of truth, and a card must match its reference frames side by side before it ships.

| Family | Folder | Research (frame-level) | References studied |
|---|---|---|---|
| Kinetic color blocks | `cards/kinetic/` | `raw-media/hp-sampler-refs/kinetic-blocks/ANALYSIS.md` | Burger King rebrand intro (JKR), Spotify Wrapped case studies |
| Netflix doc supers | `cards/netflix-doc/` | `raw-media/hp-sampler-refs/netflix-doc/ANALYSIS.md` | Chef's Table trailer, Great Big Story x2 |
| Outdoor documentary | `cards/outdoor-doc/` | `raw-media/hp-sampler-refs/outdoor-doc/ANALYSIS.md` | The North Face, Salomon, Patagonia films |
| Apple / A24 editorial | `cards/apple-a24/` | `raw-media/hp-sampler-refs/apple-a24/ANALYSIS.md` | Apple Mac Students, Dear Apple, A24 Aftersun trailer |
| Handmade collage | `cards/collage/` | `raw-media/hp-sampler-refs/handmade-collage/ANALYSIS.md` | Vox "Why we say OK", Vox Borders, Aidan's Instagram reel |



Each family covers the same purposes so a show can pick one family (or mix by purpose): `name`, `number`, `ai-screen`, `quote`, `title` (chapter / episode), `transition`.

## Brand (unchanged)
Oxblood #4B1526, cream #FFF0E6, brick #7A1E1E, orange #FF8A4C, gold #FFC145, deep #2C0B16. Bricolage Grotesque 800 (opsz 96) + Inter Tight. One orange and one gold moment per frame. How each family uses the palette is in its research doc's translation spec (for example: outdoor doc keeps color in the grade and type cream only; kinetic swaps whole color fields).

## Banned (the AI tells). `scripts/style-library/lint-hp-tells.mjs` fails a card that has any of these.
1. Accent bars or stripes on the edge of a box (the "highlight on the left side" lower third).
2. Outline boxes, keylines or borders around cards and labels. Exception: the Netflix-doc title stroke box, which is itself the animation (research move 1); it must be marked `data-tell-ok="stroke-box"`.
3. Drop shadows of any kind: `box-shadow`, `drop-shadow()`, `feDropShadow`, flat offset slabs. Exception: real photographed contact shadows in footage or scans.
4. Glass, frosted panels and `backdrop-filter`.
5. Bounce, overshoot, elastic or back eases.
6. Generic blur-in or fade-in on every element. Each move gets the curve its reference measured (cut-on, ink-in, opacity-only fade, per-frame typing, scale snap).
7. Simulated textures standing in for real ones (code-generated paper, tape or dust). Use real scans and filmed overlays, or nothing.
8. Generated or AI imagery. Footage and photos are real (stock stand-ins from Pexels until Dana's shoot), with credits in `assets/footage/CREDITS.md`.
9. Em dashes in any slot copy.

## How cards are built
- One self-contained HTML card, 1920x1080, one paused GSAP timeline on `window.__timelines[ID]`, ID = `hp2-<family>-<purpose>-<treatment>`, every selector scoped under `#ID`.
- Frame-exact: changes are scheduled on exact frames with `tl.set` at `(F-1)/fps` (see `cards/kinetic/` and `style-library/13-humanly-possible/sampler/kinetic-blocks.html`). Measured curves are sampled per frame. This makes every card seek-safe and render-identical.
- Native fps of the family's references (24 or 25; 23.976 rounds to 24).
- Real media lives in `assets/` (footage in `assets/footage/`, Dana cutout `assets/dana-cutout.png`); swap slots are marked `data-slot`.
- Verification before shipping: screenshot the card at the same moments as its reference picks, montage card and reference side by side, Read it, and fix until it holds up. Run the tell linter. Both are required.
