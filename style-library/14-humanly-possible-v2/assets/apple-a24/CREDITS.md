# apple-a24 assets

| File | Source | License |
| --- | --- | --- |
| `ambientcg-paper001-color.jpg` | ambientCG "Paper 001" (color map, 2K JPG), https://ambientcg.com/view?id=Paper001, downloaded 2026-11-03 via https://ambientcg.com/get?file=Paper001_2K-JPG.zip | CC0 1.0 (public domain) |
| `paper-warm.jpg`, `paper-cool.jpg` | Derived from `ambientcg-paper001-color.jpg`: resized to 1920x1080, multiplied by a flat tint (warm #CFC1B6 / cool #C6C6C2) and a radial vignette with ImageMagick, to match Aftersun's warm-grey and cool-grey paper (centre about #C6B7AB / #BDBCB7, corners about #A39588 / #9D9C97). | CC0 (derivative) |
| `mosh/title-plate.mp4` | Made by `mosh/build-mosh.sh title` from `footage/dusk_33845059.mp4` + screenshots of `cards/apple-a24/title.html` (#f=29, #f=84) + `paper-warm.jpg` + `footage/groom_6131725.mp4`. Real I-frame-drop datamosh. | Footage per `../footage/CREDITS.md` (Pexels license) |
| `mosh/transition-plate.mp4` | Made by `mosh/build-mosh.sh transition` from `footage/groom2_6131038.mp4` + `footage/groom_6131725.mp4`. Real I-frame-drop datamosh. | Footage per `../footage/CREDITS.md` (Pexels license) |

Fonts load from Google Fonts at runtime (not stored here): Inter Tight, Bricolage Grotesque, EB Garamond, Courier Prime (all SIL Open Font License).

Rebuild the plates after changing title text or swapping shots:
```
cd style-library/14-humanly-possible-v2
assets/apple-a24/mosh/build-mosh.sh title assets/footage/dusk_33845059.mp4 S1.png S2.png assets/footage/groom_6131725.mp4 assets/apple-a24/mosh/title-plate.mp4
assets/apple-a24/mosh/build-mosh.sh transition assets/footage/groom2_6131038.mp4 assets/footage/groom_6131725.mp4 assets/apple-a24/mosh/transition-plate.mp4 24 14 36
```
