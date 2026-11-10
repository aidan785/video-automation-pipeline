# Colin and Samir (Amelia Dimoldenberg interview), first 7:00: motion-graphics analysis

Source: `video/colin-samir.mp4` (720p, 7:00). Note: `frames/colin-samir/scene_times.txt` and `scene.log` were empty, so scene times below come from a fresh `select='gt(scene,0.3)'` pass printed to stdout (~100 cuts).

## One-paragraph read

Colin and Samir's graphics language is **editorial-white and almost typographic-only**: when a graphic happens the whole frame cuts to an off-white page (#FAFDF8-ish) and the content sits on it like a magazine layout, framed screenshots of YouTube videos with title and channel rows, a round channel logo next to a big black number on a **yellow highlighter block** (#F5F01E) that counts up, a vertical TikTok clip with a stat beside it, a scanned magazine spread, and typewriter interview text with **yellow highlighter swipes** on key lines. Yellow is the only color the show owns; it appears as a flat marker (behind numbers, over lines, as dots in the logo). In the studio, graphics are limited to **word-by-word captions** (white, sentence case, center frame) on punchline lines only. The show intro is a little geometric animation: yellow circles bounce and resize on white, thin black construction lines draw in, and the wordmark "the colin & samir show" assembles with a yellow dot as the "o". Motion is quick fades with small scale, number tickers, and highlighter wipes; no blur, no 3D, no glow.

## Inventory

| Time | Type | Layout (1920x1080) | Type treatment | Color | Surface | Enter | Exit | On screen |
|---|---|---|---|---|---|---|---|---|
| 0:00 to 0:03.6 | Word-by-word caption "I wanted to spoof what the interview is" | Center, y ~520, one line, width ~620 | Bold neo-grotesk (Helvetica/SF-like) sentence case ~58px, tight | White | Flat over footage, no box | Each word fades from ~40% to 100% and rises ~8px over 2 to 3 frames, timed to speech | Line clears on next phrase (cut-off, new line starts at "what") | ~1.2s per phrase |
| 0:07 to 0:11 | Same caption system "who gave you access?" | Upper center over 2-shot, y ~280 | Same | White | Flat | Per word as above | With shot | 1.5s |
| 0:10.5 to 0:14 | YouTube video card (KSI, Jennifer Lawrence, Ed Sheeran) | Off-white full frame; video frame ~1600x900 centered, top margin ~40, title row below (title caps 14px, views/date, channel avatar + name right) | Tiny YouTube UI type | Black on white, red channel logo baked in clip | Flat white page, clip with 4px corner | Hard cut from studio | Hard cut between cards (card to card) | 1 to 1.5s each |
| 0:24 to 0:30 | Caption "you can star in it", "and then you can publish it" | Center/right | Same caption | White | Flat | Per word | Cut | 1.5s |
| 0:30 to 0:48 | Samir to-camera segment (white shelf set) | Clean | | | | | | |
| 0:48.4 to 0:52.9 | Stat counter "340m views" | Off-white full frame. Round logo ~200px at x 230, y 540; number block starts x 440 | Number bold grotesk ~110px black; "views" ~24px | Black, yellow highlighter #F5F01E block behind number, pad ~10px | Flat | Logo scales up from a dot over ~4 frames, everything fades from 0 over ~3 frames, yellow block wipes in left to right, number counts 1m to 340m over ~1.5s ease-out, "views" fades in at ~0.6s | Hard cut | 4.5s |
| 0:52.9 to 0:56.7 | Inset video frame (Louis Theroux, Amelia clips) | Off-white page; clip ~1560x880 centered, 8px radius | None | | Flat white with inset | White wash dissolve: clip fades from ~10% to 100% over ~4 frames with tiny scale settle | Cut to next inset | ~1.5s each |
| 0:56.7 to 1:00.9 | TikTok stat "5.2m videos made on TikTok" | Off-white; previous landscape inset dissolves into a portrait clip ~480x850 at left x 210; number block at x 740, y 540 | Number ~110px black on yellow block; "videos made on TikTok" 24px | Black, yellow | Flat | Landscape card cross-dissolves into the portrait card (~3 frames), number counts 0.1m to 5.2m over ~1.6s, label fades in at ~0.5s | Cut | 4s |
| 1:01 to 1:05 | Guest name supers on clips "Ed Sheeran", "Daniel Kaluuya", "Nick Jonas", "Keke Palmer" | Lower right, x ~1300 to 1800, y ~800 | Handwritten all-caps marker script ~50px | White | Flat over clip | Baked into source clips (Chicken Shop Date style), on with the clip | Cut | ~1s each |
| 1:14 to 1:19 | Show intro / logo build | Off-white full frame | Wordmark "the colin & samir show": bold rounded grotesk lowercase ~140px, "the" ~50px, "&" and "show" small | Black + yellow #F5F01E dots | Flat | Yellow circle rolls in from right edge carrying two face icons, shrinks, splits into two dots, dots roll, one grows huge, thin 2px black construction lines draw in from left; letters cut on around the lines; a yellow dot becomes the "o"; a yellow rectangle wipes under "show" and shrinks to a small square | Cut to studio | ~5s |
| 1:21 to 2:30 | YouTube video cards (Barbie premiere, JLaw) | Off-white page, ~1600x900 clip with title/channel row | Tiny UI | | Flat | Cut, playing clip inside | Cut | 2 to 8s |
| 4:32.8 to 4:39 | Thumbnail-to-card build (Jack Harlow) | Off-white; small thumbnail ~460x250 left of center, title and views below, then cut to full ~1600x900 card | YouTube grid type | | Flat | Thumbnail fades up from 0 with slight scale over ~4 frames (looks like a YouTube home-grid tile) | Cut to the full-size playing card | ~1s tile, ~4s card |
| 6:13.4 to 6:17 | Scanned magazine spread "CHICKEN SHOP DATE" + "2013" | Off-white full frame, spread ~1700x1000 | Spread's own type; added "2013" bold ~60px on yellow block, bottom right | Black on yellow | Flat scan | Spread fades up from white over ~4 frames; "2013" block present | Cut | ~3.5s |
| 6:17 to 6:30 | Typewriter interview text with highlighter | Full-frame macro of the page, two to three columns, partial crop off edges | Courier-like typewriter ~44px | Black, yellow #F5F01E highlight bands | Flat white page, slow drift | Cut in; highlight swipes left to right across one line over ~5 frames, then the next line ~4 frames later | Cut to next crop (new block highlighted) | ~3s per crop |

## Motion grammar

- **Easing feel:** light and clean. Fades are short (3 to 4 frames), with a tiny scale settle; tickers ease out hard (fast early, slow into the final number). Nothing bounces, nothing blurs, no 3D.
- **Entrance duration:** 2 to 3 frames per caption word, 3 to 4 frames for card fades, ~5 frames per highlighter wipe, 1.5s for number count-ups.
- **What moves vs holds:** in cards, the frame/page holds and only the content inside changes (the number ticks, the highlight grows, the playing clip plays). Pages sometimes drift slowly (typewriter scan).
- **Text reveal:** studio captions per word with an opacity + small rise; highlight reveals per line by left-to-right wipe; stats by count-up.
- **Relation to cuts:** the off-white page is a "graphics room": the show hard-cuts from the dark studio to white and back, so the contrast itself is the transition. Within the white room, cards hard-cut or cross-dissolve into each other (landscape to portrait morph), keeping the page persistent so it feels like one continuous layout. No graphic persists over studio footage except captions.
- **Restraint:** captions only on punchlines, not wall-to-wall; one accent color; logo build is the only playful animation.

## Signature moves

1. **White graphics room with framed source card.**
   Hard cut to an off-white page. Source clip at ~1600x900 centered (margins 160 x / 40 top), 4 to 8px radius, a 60px info row beneath (title 16px bold caps left, views/date 12px under it, avatar 28px + channel name right). Clip plays inside. Cards cut card to card on the same page.
2. **Logo + number on highlighter block, count-up.**
   Round 200px logo at left third (x 230), number at x 440, both vertical center. Sequence: 0.00s logo scale 0 to 1 (0.15s); 0.05s yellow block `scaleX 0 to 1` transform-origin left (0.2s); 0.05 to 1.6s number tween 0 to N with expo-out, formatted "340m"; 0.6s unit label fades in 24px black. Hold 2s, cut.
3. **Landscape-to-portrait card morph into a stat.**
   The previous landscape inset shrinks and reshapes into a 9:16 card at left while cross-fading content (0.15 to 0.2s), then the stat block (signature move 2) builds to its right. Keeps the page continuous between two different facts.
4. **Highlighter swipe on quoted text.**
   Full-frame typewriter text (monospace ~44px, black on off-white), slow 2% drift. Yellow band (line height x 1.1) `scaleX 0 to 1` from left over 0.2s behind the key line, next line 0.15s later. Text stays put.
5. **Per-word speech captions on punchlines only.**
   Centered single line ~58px bold sentence case white, each word `opacity .4 to 1, y 8 to 0` over 0.1s on its spoken word, line cleared when the next phrase starts. Used maybe once every 20 to 30s.
6. **Geometric logo build.**
   Yellow circles (dots 60px, hero 300px) roll, split, and resize on white for ~2.5s while 2px black hairlines draw in; wordmark letters cut on around them; a dot becomes the "o"; a yellow bar wipes under a word and collapses to a square. ~5s total.

## Fit for Humanly Possible

1. **Graphics room with framed card: strong fit, recolor.** Our "room" is the oxblood #4B1526 ground instead of white (or a cream #FFF0E6 page for a light variant, used rarely). Screen recordings of the guest's real AI tool sit in a 10px-radius frame, with an info row in Inter Tight (tool name bold cream, "what they used it for" muted cream at 70%). Enter with pop-and-settle (scale .96 to 1, 0.25s, cubic-bezier(.2,.9,.25,1)) instead of a fade. Flat, no shadow, grain over everything.
2. **Number on highlighter block: strong fit, our best stat card.** Number in Bricolage 800 ~140px oxblood on a gold #FFC145 block (gold for the one number), block wipes left to right 0.2s, count-up 1.2s expo-out, unit label Inter Tight cream on the oxblood. Optional round tool logo on a brick #7A1E1E 6px-radius tile, with a small orange #FF8A4C dot as the frame's single orange.
3. **Landscape-to-portrait morph: good fit.** Perfect for "here is the app on desktop, here it is on their phone". Animate the frame's width/height on a wrapper div (not the video), 0.25s, our easing, no bounce.
4. **Highlighter swipe: strong fit.** For prompts, chat transcripts or quotes the guest wrote. Inter Tight or a mono-feel fallback on cream page or brick surface; highlight band in gold for the one key line (if more lines need marking, use cream at 18% opacity so gold stays single). Wipe 0.2s per line.
5. **Per-word captions on punchlines: good fit.** Bricolage 800 cream, sentence case, ~64px, pop-and-settle per word (scale .92 to 1, y 8 to 0, 0.15s). The one stressed word in gold. Keep it rare, same as theirs.
6. **Geometric logo build: fits structurally, not literally.** A Humanly Possible open could do the same "shapes assemble into the wordmark" idea with flat brick and cream rounded rectangles (6/10/14px radii) and one orange dot, but it must avoid their rolling-circle bounce: our shapes should pop in and settle, no rolling, no squash. ~3s, not 5s.
- **Does not fit:** the handwritten name supers (baked into source clips, and script fonts are off-brand); the off-white page as the default (our ground is oxblood; white would read as a different show); YouTube UI chrome replicas for our own content (use our own info row, not YouTube's).

## Picks

- `picks/colin-samir_word-caption.jpg`: 0:01 centered word-by-word caption "I wanted to spoof" over the guest.
- `picks/colin-samir_yt-card.jpg`: 0:10.5 framed YouTube card on the white page with title row and channel avatar.
- `picks/colin-samir_stat-views.jpg`: 0:50.5 round channel logo with "340m views" on the yellow highlighter block.
- `picks/colin-samir_tiktok-stat.jpg`: 0:58.5 portrait TikTok clip with the "videos made on TikTok" stat mid count-up (4.4m).
- `picks/colin-samir_hand-name.jpg`: 1:02.2 handwritten white name super lower right (Daniel Kaluuya), baked into the source clip.
- `picks/colin-samir_logo-mid.jpg`: 1:16.9 logo build mid-state: hairlines, big yellow circle, letters assembling.
- `picks/colin-samir_logo-final.jpg`: 1:18.4 finished wordmark "the colin & samir show" with yellow dot "o" and square.
- `picks/colin-samir_thumb-build.jpg`: 4:33 small YouTube grid tile fading up on white before the full card.
- `picks/colin-samir_magazine.jpg`: 6:14.5 scanned Chicken Shop Date magazine spread with "2013" on a yellow block.
- `picks/colin-samir_typewriter.jpg`: 6:18.6 typewriter interview text with yellow highlighter over "Are you still together? No."
