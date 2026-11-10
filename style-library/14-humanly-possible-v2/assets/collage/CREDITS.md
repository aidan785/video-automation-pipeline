# Collage family: sourced materials

Every texture, plate, stroke and overlay here is a real scan or filmed footage. None of it is code-generated or AI-generated. Downloaded 2026-11-03. "Changed" lists what was done to the file after download.

## Paper grounds
| file | source | license | changed |
|---|---|---|---|
| `paper-cream.jpg` | "Vintage paper texture" by pinkorchid_too (Sandra), Flickr, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Vintage_paper_texture_-_Flickr_-_pinkorchid_too_(Sandra).jpg | CC BY 2.0 (credit: pinkorchid_too / Sandra) | center crop to 16:9, 2112x1188, saturation lowered toward a neutral cream |
| `paper-book.jpg` | "Blank page, brown paper texture", Internet Archive Book Images (Flickr), via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Blank_page,_brown_paper_texture_(14802136533).jpg | No known copyright restrictions | center crop to 16:9, 2112x1188 |
| `paper-white.jpg` | ambientCG "Paper 001" (photographed paper, color map): https://ambientcg.com/view?id=Paper001 | CC0 | none (2K color map) |

## Archival plates and clippings
| file | source | license | changed |
|---|---|---|---|
| `barbet-cutout.png` | Jacques de Seve, "Le Grand Barbet", drawing for Buffon's Histoire naturelle, 1755. BnF (btv1b105280815), via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Le_Grand_Barbet._-_dessin_-_De_Seve_1755._-_btv1b105280815.jpg | Public domain | dog cut out (u2net matte, hardened) plus a hand-cut, torn strip of the plate's own ledge under the feet; 1518x1240 |
| `tondeuses-chalon-1820.jpg` | John James Chalon, "Les Tondeuses de Chiens", 1820, hand-colored lithograph. Paris Musees / Musee Carnavalet G.10975, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Les_Tondeuses_de_chiens._23,_G.10975_(1_of_3).jpg | CC0 (Paris Musees open content) | resized to 2000 px wide |
| `tondeur-vernet.jpg` | Carle Vernet, "Tondeur de Chiens". Paris Musees G.4384, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Tondeur_de_Chiens._100,_G.4384.jpg | CC0 (Paris Musees open content) | resized to 1200 px wide |
| `receipt-dogtax-1891.jpg` | San Diego City Tax Collector, Dog Tax Receipt, 1891 (San Diego Historical Society Quarterly, 1967), via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:San_Diego_Bum_Dog_Tax_Receipt.jpg | Public domain | none |
| `calendar-1902.jpg` | Theo van Hoytema, calendar page for February 1902, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:February_1902_calendar_with_Starling_-_Theo_van_Hoytema.jpg | Public domain | cropped to the date grid |
| `appointment-book-1933.jpg` | Diary and Appointment Book of Harry S. Truman, page 12 (Truman Library, via DPLA), via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Diary_and_Appointment_Book_of_Harry_S._Truman_-_DPLA_-_02b3cc1dbd115137da592312d8bef93e_(page_12).jpg | Public domain | resized to 1600 px wide |

## Ink
| file | source | license | changed |
|---|---|---|---|
| `ink-stroke-b.png`, `ink-stroke-c.png` | Raw scan `scan5.jpg` from "100 Grunge Brushstrokes and Splatters Set" by Dino0040, OpenGameArt: https://opengameart.org/content/100-grunge-brushstrokes-and-splatters-set (real brush strokes in ink on paper, scanned) | CC0 | stroke cropped, alpha taken from the scan's ink density, tinted #1C070E, trimmed |
| `ink-speckle.png`, `ink-drybrush.png` | same raw scan (`scan5.jpg`, dry-brush and stipple marks) | CC0 | cropped, alpha from ink density (used as the "worn stamp" mask for 3-frame rough entries) |

## Filmed dust
| file | source | license | changed |
|---|---|---|---|
| `dust-light.mp4` (+ poster `dust-light.jpg`) | "Dust and scratches" film texture by ElazaParvin, Pixabay video 257443: https://pixabay.com/videos/id-257443/ | Pixabay Content License (free use, no attribution required; credited anyway) | cropped inside the film gate, grayscale, 1920x1080, 24 fps, 8 s; long vertical scratch lines removed (used multiply, dark specks on light) |
| `dust-dark.mp4` (+ poster `dust-dark.jpg`) | "Film dust scratches overlay" by Gooseflats, Pixabay video 245078: https://pixabay.com/videos/id-245078/ | Pixabay Content License (free use, no attribution required; credited anyway) | 8 s from 0:10, grayscale, 1920x1080, 24 fps; long vertical scratch lines removed (used screen, light specks on dark) |

## Still needed (cannot be downloaded)
- **Tablet-drawn "back." sequence** for `cards/collage/number.html`: must be drawn by a person, per frame, on a tablet. Export `back-seq/back_0001.png ...` (transparent 1920x1080, on ones) and set `BACK_SEQ.frames` in the card. The card shows a placeholder until then.
- **Masking tape scans**: no tape scan with a verified free license was found (the research says the same). Scan our own strips at 600 dpi; the ai-screen card uses no tape until then.
- **Printed-and-scanned chat**: the ai-screen card sets the chat in HTML on the scanned sheet. Print it, scan at 600 dpi, and drop the scan into the sheet's `data-slot="media"`.
