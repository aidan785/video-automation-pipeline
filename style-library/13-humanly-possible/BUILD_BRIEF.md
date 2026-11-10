# Humanly Possible card build brief (for builder agents)

You are building motion-graphic cards for `style-library/13-humanly-possible/`. The bar is premium, hand-made broadcast quality. Your cards will sit next to two finished gold cards, and anything that looks templated, cheap or off-brand gets thrown out.

## Read first (all of them, fully)
1. `style-library/13-humanly-possible/DESIGN.md`: the motion grammar, color rules, the card plan and the "what not to do" list.
2. `style-library/13-humanly-possible/tokens.css`: every color, gradient, font and ease. Use the variables. Never hardcode hex in CSS (the inline logo SVG fill `#FFF0E6` and GSAP color tweens are the only exceptions).
3. The two gold cards, which are your templates for structure, conventions and finish:
   - `cards/tier1/t1-title-linebox.html` (tier 1: burn ground, grain filter, CustomEase "hpPop", drift on the bg layer, mirrored exit, `#t=` seek hook)
   - `cards/tier2/t2-lowerthird-threestep.html` (tier 2: transparent, deep scrim for legibility, per-line pop)
4. The reference analysis for each move you build: `references/analysis/<video>.md` (sections "Signature moves" and "Fit for Humanly Possible"). Hero frames are in `references/frames/`. Your card list below names the source for each card.

## Card contract (every card)
- Standalone HTML, 1920x1080. Root `<div id="ID" data-composition-id="ID" data-start="0" data-width="1920" data-height="1080">` where ID = `hp-<tier>-<purpose>-<treatment>` (e.g. `hp-t1-stat-highlighter`). File name = `<t1|t2|lay|tr|st>-<purpose>-<treatment>.html` in the folder given below.
- Self-scoping: EVERY CSS selector is prefixed `#ID`; every DOM query goes through `ROOT`; SVG filter/gradient ids are prefixed with ID.
- Same head as the gold cards (Google Fonts link, `../../tokens.css`), same GSAP 3.14.2 + CustomEase CDN scripts, same `hpPop` registration with the `power3.out` fallback.
- Exactly one paused GSAP timeline on `window.__timelines[ID]`. Duration padded with `tl.set({}, {}, DUR)`. Include the `#t=` seek hook exactly like the gold cards (and re-seed grain after seeking).
- Deterministic: no `Math.random()`, no `Date.now()`. If you need randomness, use a seeded LCG (e.g. `let s=7; const rnd=()=>(s=(s*16807)%2147483647)/2147483647;`). Grain seed stepped by `Math.floor(tl.time()*12)`.
- Build and register the timeline synchronously. Never wait on `document.fonts.ready`. Do not measure text with getBoundingClientRect to lay things out.
- Text lives in elements with `data-slot="<name>"`. Words that should land on spoken words carry `data-at="<seconds>"`. One `<em>` in a slot = the gold word (style `em{font-style:normal;color:var(--hp-gold)}`). Placeholder copy is about everyday people using AI (a dog groomer, a baker, an ER nurse, a shop teacher, a bookkeeper). Plain, concrete, sentence case. **No em dashes anywhere.**
- Tier 1 = opaque full frame with grain. Tier 2 = transparent body/root; only the card itself paints; never cover the center of frame where a face sits unless the card is explicitly a side card on the empty side.
- Exits: mirror the entrance in 0.25 to 0.3 s near the end of DUR, or design it to be cut away (say which in the header comment).
- Header comment like the gold cards: what it is, the move and its source, the slots.

## Brand discipline (checked on every card)
- One orange element per frame. One gold element per frame (a number, a word, or one highlighter block). Count them.
- No glass, glow, neon, blur halos, drop shadows (a flat `0 8px 0 var(--hp-deep)` offset is allowed for cards over footage), no bounce/back/elastic eases, no spins, no fades over 0.3 s, no letter-by-letter typing on headlines.
- Bricolage Grotesque 800 + `font-variation-settings:"opsz" 96` + tracking -0.03em for display; Inter Tight for everything else. Radii 6/10/14 only (redaction bars square).
- Never type "Humanly Possible" as a logo. For the mark, copy the inline SVG from `t1-title-linebox.html`. Lockup SVG files are in `assets/logo/` (reference them as `../../assets/logo/<file>.svg` via `<img>`).
- Only one `background-clip:text` element per card.
- Demo media: `../../assets/demo/` has `dana.jpg baker.jpg nurse.jpg teacher.jpg` (portrait 1100x1467), `place-dana.jpg place-baker.jpg` (1920x1080), `hands.jpg` (2000x1125, hands on a phone), `plate.jpg` (2400x1005 landscape), `cam-guest.jpg cam-host.jpg` (1280x720 webcam stand-ins). Use them as `<img>` or CSS backgrounds, as stand-ins the assembler swaps for real footage (mark the element `data-slot="media"` or similar). Screens, chats, prompts, phones and app UIs are BUILT IN HTML (clean rebuilt UI, no browser chrome, no real brand logos). AI chat UI should be generic (label it "Assistant"), cream or oxblood themed, never a ChatGPT/Claude replica.

## Verify every card yourself (mandatory)
A screenshot server is running at `http://localhost:8091/` (the workspace root). The harness page takes the card path, a time and an optional backdrop:

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1920,1080 --virtual-time-budget=5000 --screenshot="<your-shots-dir>/<name>_<t>.png" "http://localhost:8091/style-library/13-humanly-possible/_preview/shot.html?card=cards/<folder>/<file>.html&t=<seconds>&bg=bg-talking.jpg"
```
(`bg=` only for tier 2 / overlays: `bg-talking.jpg` dark interview, `bg-bright.jpg` bright daylight. Check tier 2 on BOTH.)

Shoot each card at least at: mid-entrance, the hero hold (all elements landed), and mid-exit. Read every PNG. Fix overflow, collisions, clipped descenders, illegible type, wrong counts of orange/gold, anything that looks cheap. Iterate until it's genuinely good. Then delete your shots.

## Write only
- Your card files (paths given in your task).
- Screenshots in `/private/tmp/claude-501/-Users-aidanstanik-Projects-Video-Automation/5388ea2d-bce0-4433-beac-e4c4d6aa00c5/scratchpad/hp-shots/<your-group-letter>/` (create it; delete PNGs when done).
- One metadata file `style-library/13-humanly-possible/_meta/<group-letter>.json`: an array of `{ "id": "humanly-possible.<tier>.<purpose>.<treatment>", "tier": "tier1|tier2|layout|transition|sting", "purpose": "...", "treatment": "...", "file": "cards/<folder>/<file>.html", "slots": [{ "name", "type": "text|richtext|number|list|media", "maxChars"?, "maxItems"?, "notes"? }], "duration": { "min", "max" }, "summary": "one line" }`.

Do NOT touch `style.json`, `registry.json`, `DESIGN.md`, `tokens.css`, the gold cards, `_preview/`, other groups' files, or anything outside these paths. If you think tokens.css needs a new value, define it locally in your card's `#ID{}` block and mention it in your reply.

## Reply with
Your card files, one line each on what you built, anything you could not make work, and any token you added locally.
