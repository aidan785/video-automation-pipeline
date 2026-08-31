# AIS LIVE — Get Set Up (agenda / booths / networking)

61s doors-open onboarding walkthrough: three numbered steps attendees should do
before the show starts. Same house engine as the Day 1 agenda walkthrough
(depth grid tunnel, chrome italic type, whip cuts, solid AIS/LIVE mark bug),
all-blue styling, no eyebrow dots, no on-screen em dashes.

## Structure

9 beats: intro hero ("First things first.") ->
STEP 01 Build your agenda (+ 3-item checklist: agenda tab, star sessions, pick track) ->
STEP 02 Visit the booths (+ real HyperAgent/Glaido logos, Expo open) ->
STEP 03 Meet people in Networking (+ checklist: profile, networking room, say hi to 3) ->
"You're in the right room." -> AIS LIVE markflash outro.

Signature element: the day rail is repurposed as a 3-STEP progress rail
(STEP 1/2/3 ticks) that fills as each step arrives.

## Build / verify / render

```bash
node _gen-setup.mjs     # -> index.html
node _shots.mjs         # headless frame verification -> frames/
npx hyperframes lint    # 0 errors, 0 warnings
npx hyperframes render --quality standard --workers auto --browser-gpu --gpu --output renders/get-setup-final.mp4
```

Silent by default.

## Status

- Built + frame-verified 2026-07-07; approved same day. Rendered standard (38s render) and DELIVERED to Drive Event Assets/Block 1 Assets as "AIS LIVE - Get Set Up (Agenda, Booths, Networking).mp4" (file 1NGtS5tlBPk05MBGryXths9-T0hC2VvoN).
- Target delivery: Drive > Event Assets > Block 1 Assets (folder 1igWvlWzHX0qWUdT6TJU7PRSr3-A1KX93).
