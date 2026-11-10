# Build brief: one family of the Humanly Possible v2 library

You are building ONE family of cards for `style-library/14-humanly-possible-v2/`. The creative director (Aidan) rejected the previous library because it looked AI-made. This library exists to fix that, and every card is built from frame-level research of real human-made work. Matching the reference is the job; inventing new decoration is not.

## Read first, fully
1. `style-library/14-humanly-possible-v2/DESIGN.md`: the family index, the brand, the BANNED list, how cards are built.
2. Your family's research: `raw-media/hp-sampler-refs/<research-folder>/ANALYSIS.md`. Its frame counts, curves, positions and tells are your spec.
3. Your family's reference frames: `raw-media/hp-sampler-refs/<research-folder>/picks/*.jpg`. Read every one. Also look at `allframes/` sheets for the signature moves you build.
4. The structural gold standard: `style-library/13-humanly-possible/sampler/kinetic-blocks.html` (frame-exact `tl.set` scheduling, per-frame sampled curves, opacity-based layer hiding, `#f=` and `#t=` seek hooks). Copy its scheduling helpers. Do NOT copy its look unless you are the kinetic family.

## Cards to build (6), same purposes in every family
Use the research's translation spec for the first three. Design the last three from the same research (the moves, curves and tells it measured), not from habit.
1. `name`: the person's name and what they do. Content: "Dana Ruiz", "Dog groomer in Tulsa".
2. `number`: one result number. Content: "6 hours a week", plus "back".
3. `ai-screen`: the AI moment. Prompt "Write a friendly reminder text for tomorrow's grooms"; key reply line "Reply C to confirm, or R and we'll find a new time." highlighted.
4. `quote`: the guest's best line. Content: "I didn't hire help. I got my evenings back."
5. `title`: chapter or episode title. Content: chapter "02", title "The front desk answers itself" (or the episode title "She got her Saturdays back").
6. `transition`: the family's signature transition between two shots (use two footage clips from `assets/footage/`).

File names: `cards/<family-folder>/<purpose>.html`. Composition ID: `hp2-<family-folder>-<purpose>`. Scope every selector under `#ID`. One paused GSAP timeline on `window.__timelines[ID]`, padded to its full duration with `tl.set({}, {}, DUR)`. Mark fillable text with `data-slot`; mark swappable media with `data-slot="media"` (or `media-2`, etc.).

## Media
- Footage: `assets/footage/*.mp4` (1920x1080, 24 fps, 8 s, Pexels, credits in `CREDITS.md`) with a poster `*.jpg` beside each. Available: `groom_6132700` (scissors on a dog, close), `groom_6816875` (clippers on a yorkie, close), `groom_6816883` (clippers, wider), `groom_6131725` (wet dog), `groom2_6131038` (groomer at the table, wide), `phone_8142388`, `phone_856405`, `phone_6963836` (hands on phones), `field_5805200` (sunset wheat), `field_30178060` (golden wheat close), `prairie_13975529` (golden field and clouds), `prairie_8087832`, `dusk_33845059`, `dusk_5941610` (small town at dusk).
- Use `<video src="../../assets/footage/x.mp4" muted playsinline preload="auto">` (never `class="clip"` on video, never call play/pause or set currentTime: the renderer owns playback). For still verification screenshots, the poster jpg is fine as an `<img>` stand-in, but the card should use the video.
- Dana cutout (stand-in, from a generated photo; replace with a real shoot later): `assets/dana-cutout.png` (transparent PNG).
- Phone/AI screens: build the chat UI in HTML only if your research says the reference rebuilt it; otherwise put the real phone footage in and track graphics to it as the research says.
- If your family needs real textures (collage: paper, tape, ink, dust, an engraving), download real scans from the free sources listed in your research (CC0 / public domain first). Save them in `assets/<family-folder>/` with a `CREDITS.md` (source URL + license per file). No code-generated stand-ins for textures.

## Banned (the linter fails these): run `node scripts/style-library/lint-hp-tells.mjs` on your files
Accent stripes on box edges; outline/keyline boxes (Netflix-doc stroke box exception: `data-tell-ok="stroke-box"`); shadows of any kind (box-shadow, text-shadow, drop-shadow, feDropShadow); glass / backdrop-filter outside the nature-glass family; bounce/back/elastic eases; Math.random / Date.now; em dashes. Also banned by review: blur-in or fade-in as a default entrance, code-generated textures, generated imagery.

## Verification (mandatory, before you call a card done)
A static server runs at `http://localhost:8091/` (workspace root). Cards seek with `#f=<frame>`.
1. For each card, pick the reference frame(s) it matches. Screenshot your card at the equivalent frames:
   `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080 --virtual-time-budget=6000 --user-data-dir=<your-shots>/prof_<n> --screenshot=<your-shots>/<card>_f<frame>.png "http://localhost:8091/style-library/14-humanly-possible-v2/cards/<family>/<card>.html#f=<frame>"` (use a fresh `--user-data-dir` per parallel shot and delete it after).
   Video frames may not decode in headless screenshots; if the video area is blank, verify layout with the poster image temporarily swapped in, then restore the video.
2. Montage your frame beside the reference frame (`magick ref.jpg yours.png -resize 960x540 +append side.jpg`) and Read it. Ask: would a viewer believe these came from the same team? Fix and reshoot until yes.
3. Shoot every card at 3+ moments (entrance, hold, exit or end) and Read every PNG.
4. Run the linter. It must pass.
Your shots dir: `/private/tmp/claude-501/-Users-aidanstanik-Projects-Video-Automation/5388ea2d-bce0-4433-beac-e4c4d6aa00c5/scratchpad/hp2/<family-folder>/`. Delete PNGs when done.

## Write only
Your family folder `cards/<family-folder>/`, `assets/<family-folder>/` (textures you sourced), your shots dir, and `_meta/<family-folder>.json`: an array of `{ "id": "humanly-possible-v2.<family-folder>.<purpose>", "tier": "tier1|tier2|transition", "purpose": "<purpose>", "family": "<family-folder>", "file": "cards/<family-folder>/<purpose>.html", "fps": 24, "duration": { "min": s, "max": s }, "slots": [{ "name", "type": "text|richtext|number|media", "maxChars"? }], "matches": ["<pick filename>", ...], "summary": "one line" }` (tier2 = transparent overlay over footage; tier1 = owns the full frame). Nothing else: not style.json, registry, DESIGN.md, other families, or the scratchpad root.

## Reply with
Your files, one line per card (what it does and which reference frame it matches), linter result, anything you could not make work, and every asset you downloaded with its license.
