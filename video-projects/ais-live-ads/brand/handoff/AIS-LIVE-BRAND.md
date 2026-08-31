# AIS LIVE — Brand & Design System (Source of Truth)

> **For:** Claude Code, animators, designers, anyone producing video / motion / static assets for AIS Live.
> **Version:** v1.0 · 2026 · Internal Reference
> **Use:** Treat this file as the single source of truth. Paste tokens directly, copy components verbatim, follow the motion specs to drive frame-by-frame animation in video/“hyperframe” work.

---

## 0 · TL;DR — what you must respect

1. **One mark only.** The **Shift lockup**: `AIS LIVE` set in **Montserrat 900 Italic**, ALL CAPS, single line, slight gap between the words, with a small red live-dot at the top-right baseline of LIVE. White AIS + Electric-Blue LIVE on dark, or one of the approved colorway substitutes.
2. **One ambient motion.** The red live-dot pulses on a **1.6s ease-in-out infinite** loop with an outward ring. Nothing else moves ambiently.
3. **Three families.** Montserrat (display), Inter (body), JetBrains Mono (eyebrows / specs / tabular).
4. **Two grounds.** Cream (#F0EEE9) for light surfaces, Onyx (#07121C) for dark. Charcoal (#0A0E14) is the deepest dark only.
5. **Three accents.** Electric Blue (primary), Cyber Yellow, Coral. Red is **live-dot only** — never used for type or fills.
6. **No corporate-SaaS, no “dark gaming basement.”** Aesthetic anchor is Figma Config — spatial layering, modular elements, bold high-contrast typography. Inclusive and sophisticated; the audience is broader than 35–45M technical founders.

---

## 1 · Brand North Star — “The Config Aesthetic”

- **Event:** AIS Live: Real Projects, Real Revenue
- **Mission:** AIS Live logo with interchangeable taglines per event.
- **Visual logic:** Spatial layering, modular elements, bold high-contrast typography. The logo already has motion in it — we make it more defined.
- **Audience expansion:** Current demo is 95% male, 35–45. Branding must feel inclusive and sophisticated enough to attract a broader, diverse range of founders and technical leaders.
- **References:** Figma Config (movement & layering), Skeo (depth & blue/black glow), Evoxa (minimal typographic testimonials), Unbound Conference (shapes, fonts, recognizable movement).
- **What we are NOT:** Standard corporate SaaS. Dark gaming basement.

---

## 2 · Design Tokens (paste-ready)

### 2.1 Color tokens

```css
:root {
  /* Surfaces */
  --onyx:      #07121c;   /* primary dark surface */
  --charcoal:  #0a0e14;   /* deepest background */
  --black:     #000000;
  --cream:     #f0eee9;   /* primary light surface */
  --paper:     #ffffff;

  /* Brand accents */
  --blue:      #37bdf8;   /* PRIMARY accent — "LIVE" */
  --yellow:    #f5d82a;
  --coral:     #FF8A5C;
  --red-live:  #ff3b30;   /* live-dot ONLY — never type, never fill */

  /* Ink (text on light) */
  --ink:       #2a251f;
  --ink-soft:  rgba(60,50,40,0.72);
  --ink-mute:  rgba(60,50,40,0.55);
  --rule:      rgba(60,50,40,0.18);

  /* Inverse ink (text on dark) */
  --paper-soft: rgba(209,220,232,0.78);
  --paper-mute: rgba(209,220,232,0.55);
  --rule-dark:  rgba(255,255,255,0.10);
}
```

| Token | Hex | Role |
|---|---|---|
| Onyx | `#07121C` | Primary dark surface, headlines, body on light |
| Charcoal | `#0A0E14` | Deepest background, sponsor blocks |
| Cream | `#F0EEE9` | Primary light surface |
| Paper | `#FFFFFF` | Cards, spec tables, sponsor surfaces |
| Blue · Primary | `#37BDF8` | “LIVE”, links, accents, glow |
| Yellow | `#F5D82A` | Revenue, CTAs, highlights |
| Coral | `#FF8A5C` | Energy, eyebrows on dark, secondary accent |
| Live Red | `#FF3B30` | **Live-dot only** |
| Ink | `#2A251F` | Body text on cream |

### 2.2 Type stacks

```css
:root {
  --font-display: 'Montserrat', sans-serif;     /* 900, often italic */
  --font-body:    'Inter', sans-serif;          /* 300/400/700 */
  --font-mono:    'JetBrains Mono', monospace;  /* 400/700, eyebrows + specs */
}
```

Google Fonts import:

```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### 2.3 Type scale (committed)

| Role | Family | Weight / style | Size | Line | Tracking |
|---|---|---|---|---|---|
| Display XL | Montserrat | 900 italic | 96–150 | 0.9 | −0.04em |
| Page Title | Montserrat | 900 (italic optional) | 56–72 | 0.92 | −0.035em |
| Section | Montserrat | 900 | 30–34 | 1 | −0.035em |
| Mark | Montserrat | 900 italic | scales | 0.9 | −0.03em |
| Body / Deck | Inter | 400 / 700 bold | 13.5–14 | 1.55–1.6 | 0 |
| Eyebrow | JetBrains Mono | 700 UPPER | 10 | — | +0.32em |
| Mono spec | JetBrains Mono | 400 / 700 | 10–11 | 1.55 | +0.18–0.22em |

### 2.4 Spacing & radii

```css
:root {
  --s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px;
  --s-5: 24px; --s-6: 32px; --s-7: 48px; --s-8: 64px;
  --radius-card: 4px;   /* cards, spec tables, lockup tiles */
  --radius-pill: 999px; /* pills, live pill */
}
```

### 2.5 Sheet / print

| Token | Value |
|---|---|
| Sheet | 8.5 × 11in · US Letter · full-bleed |
| Inner pad | 0.6in (top 0.85in to clear chrome eyebrow) |
| Chrome eyebrow / footer | 0.35in from edge · 1px rule · Mono 8 · +0.3em |
| Print rule | strip `blur`, `backdrop-filter`, `box-shadow`, and `[data-print-hide]` |

---

## 3 · The Mark (Shift lockup) — LOCKED

**Status:** Final. The Shift lockup is the only approved AIS Live mark. All earlier wordmarks (italic URL-style `AIS.LIVE`, terminal `$ais.live`, bracketed `[AIS.LIVE]`, monogram, etc.) are deprecated. Do not use on new surfaces.

### 3.1 Anatomy

| Spec | Value |
|---|---|
| Family | Montserrat · **900 italic** |
| Case | ALL CAPS |
| Tracking | **−0.03em** (mark) · −0.035em (display) |
| Line height | **0.9** |
| Word gap | **0.08em** between AIS and LIVE |
| Glow | On dark only · `text-shadow: 0 0 60px rgba(55,189,248,0.55)` (scales with size) |
| Live-dot | `#FF3B30` · **0.16em ⌀** · top `0.08em` · `margin-left 0.06em` from final “E” (tight) |
| Variants | **Primary** (with live-dot) · **Wordmark** (no dot, `.no-dot` class) |

### 3.2 Paste-ready CSS

```css
.mark {
  font-family: 'Montserrat', sans-serif;
  font-style: italic;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 0.9;
  display: inline-flex;
  align-items: baseline;
  position: relative;
}
.mark .ais { color: #fff; }
.mark .gap { display: inline-block; width: 0.08em; }
.mark .live {
  color: #37bdf8;
  position: relative;
  text-shadow: 0 0 60px rgba(55,189,248,0.55);
  padding-right: 0.28em; /* reserves space for the dot */
}
.mark .dot {
  position: absolute;
  top: 0.08em;
  left: 100%;
  margin-left: 0.06em;
  width: 0.16em;
  height: 0.16em;
  border-radius: 50%;
  background: #ff3b30;
  box-shadow: 0 0 0.7em #ff3b30, 0 0 0.25em #ff3b30;
}
.mark.no-dot .live { padding-right: 0; }

/* Theme variants for the mark on different surfaces */
.mark.theme-dark   .ais { color: #fff;    } .mark.theme-dark   .live { color: #37bdf8; text-shadow: 0 0 60px rgba(55,189,248,0.55); }
.mark.theme-blue   .ais { color: #fff;    } .mark.theme-blue   .live { color: #07121c; text-shadow: none; }
.mark.theme-yellow .ais { color: #07121c; } .mark.theme-yellow .live { color: #fff;    text-shadow: none; }
.mark.theme-coral  .ais { color: #07121c; } .mark.theme-coral  .live { color: #fff;    text-shadow: none; }
.mark.theme-cream  .ais { color: #07121c; } .mark.theme-cream  .live { color: #37bdf8; text-shadow: none; }
.mark.theme-paper  .ais { color: #07121c; } .mark.theme-paper  .live { color: #37bdf8; text-shadow: 0 0 30px rgba(55,189,248,0.25); }
```

```html
<span class="mark theme-dark">
  <span class="ais">AIS</span><span class="gap"></span><span class="live">LIVE<span class="dot"></span></span>
</span>
```

### 3.3 Paste-ready React component (auto-recolors per surface)

```jsx
function ShiftMark({ theme = 'dark', size = 18, glow = true, withDot = true }) {
  const m = {
    dark:        { ais: '#fff',    live: '#37bdf8', glow: 'rgba(55,189,248,0.55)' },
    blue:        { ais: '#fff',    live: '#07121c', glow: 'transparent' },
    yellow:      { ais: '#07121c', live: '#fff',    glow: 'transparent' },
    coral:       { ais: '#07121c', live: '#fff',    glow: 'transparent' },
    orange:      { ais: '#07121c', live: '#fff',    glow: 'transparent' }, // alias for coral
    white:       { ais: '#07121c', live: '#37bdf8', glow: 'rgba(55,189,248,0.25)' },
    cream:       { ais: '#07121c', live: '#37bdf8', glow: 'transparent' },
    allblack:    { ais: '#07121c', live: '#07121c', glow: 'transparent' },
    allwhite:    { ais: '#fff',    live: '#fff',    glow: 'transparent' },
    blueblack:   { ais: '#37bdf8', live: '#07121c', glow: 'transparent' },
    yellowblack: { ais: '#f5d82a', live: '#07121c', glow: 'transparent' },
    whiteblue:   { ais: '#fff',    live: '#37bdf8', glow: 'rgba(55,189,248,0.45)' },
    blackblue:   { ais: '#07121c', live: '#37bdf8', glow: 'rgba(55,189,248,0.2)' },
    orangeblack: { ais: '#FF8A5C', live: '#07121c', glow: 'transparent' },
  };
  const c = m[theme] || m.dark;
  const stroke = Math.max(1, size * 0.032);
  return (
    <span style={{
      fontFamily: "'Montserrat', sans-serif",
      fontStyle: 'italic', fontWeight: 900,
      fontSize: size, letterSpacing: '-0.03em', lineHeight: 0.9,
      display: 'inline-flex', alignItems: 'baseline', position: 'relative',
    }}>
      <span style={{ color: c.ais, WebkitTextStroke: `${stroke}px ${c.ais}` }}>AIS</span>
      <span style={{ display: 'inline-block', width: size * 0.12 }} />
      <span style={{
        position: 'relative',
        color: c.live,
        WebkitTextStroke: `${stroke}px ${c.live}`,
        textShadow: glow && c.glow !== 'transparent' ? `0 0 ${size * 0.8}px ${c.glow}` : 'none',
        paddingRight: withDot ? '0.28em' : 0,
      }}>
        LIVE
        {withDot && (
          <span style={{
            position: 'absolute', top: '0.08em', left: '100%', marginLeft: '0.06em',
            width: '0.16em', height: '0.16em', borderRadius: '50%',
            background: '#ff3b30',
            boxShadow: '0 0 0.7em #ff3b30, 0 0 0.25em #ff3b30',
            animation: 'live-pulse 1.6s ease-in-out infinite',
          }} />
        )}
      </span>
    </span>
  );
}
```

### 3.4 Approved colorways (lockup tiles)

| Ground | AIS color | LIVE color | Notes |
|---|---|---|---|
| Onyx `#07121C` | White | Electric Blue | **Primary.** Glow on. |
| Cream `#F0EEE9` | Onyx | Electric Blue | No glow. |
| Paper `#FFFFFF` | Onyx | Electric Blue | Subtle 30px glow ok. |
| Blue `#37BDF8` | White | Onyx | No glow. |
| Yellow `#F5D82A` | Onyx | White | No glow. |
| Coral `#FF8A5C` | Onyx | White | No glow. |
| Charcoal `#0A0E14` | White | Electric Blue | Same as Onyx. |
| Black `#000` | White | Electric Blue | Cinematic / VIP. |
| Mono (all-black) | Onyx | Onyx | Print, embroidery, single-color. |
| Mono (all-white) | White | White | Reverse / avatar. |

### 3.5 Don’ts

- Do **not** use red, yellow, or coral on the **type** in the mark — those colors live in surfaces & accents.
- Do **not** stack AIS / LIVE on two lines. Single line only.
- Do **not** set the mark upright (roman) on production surfaces — italic is the spec. (Upright was explored in `LogoShiftRoman` but is not the final lockup.)
- Do **not** use the live-dot at sizes where it falls below ~3px on screen — drop it instead.
- Do **not** recolor the live-dot. It is always `#FF3B30`.
- Do **not** invent gradients on the mark.

---

## 4 · Live signal (motion) — the ONLY ambient motion

```css
@keyframes live-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255,59,48,0.7), 0 0 8px rgba(255,59,48,0.8);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 8px rgba(255,59,48,0), 0 0 12px rgba(255,59,48,1);
  }
}
.live-dot {
  display: inline-block;
  width: 10px; height: 10px; border-radius: 50%;
  background: #ff3b30;
  animation: live-pulse 1.6s ease-in-out infinite;
}
```

| Spec | Value |
|---|---|
| Color | `#FF3B30` |
| Pulse | scale 1 → 1.1 → 1 |
| Ring | 0 → 8px outward, fading rgba |
| Duration | **1.6s ease-in-out infinite** |
| Print | Strip animation to avoid hard-edged artifacts |

### Live pill (use to badge “On Air” / “Now Live · 4 shifts”)

```css
.live-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px 6px 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 999px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.22em;
  text-transform: uppercase; font-weight: 700; color: #fff;
}
```

---

## 5 · Core components (copy-paste)

### 5.1 Eyebrow

```html
<span class="eyebrow">Brand &amp; Partnership Sheet · 2026</span>
```
```css
.eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.32em;
  text-transform: uppercase; font-weight: 700;
  color: #37bdf8; /* or var(--coral), or currentColor */
  display: inline-flex; align-items: center; gap: 8px;
}
.eyebrow::before { content:''; width:6px; height:6px; border-radius:3px; background:currentColor; }
```

### 5.2 Section header

```html
<div class="sec-head">
  <h2 class="sec-title">How it <em>works</em></h2>
  <span class="num">02 · Section</span>
</div>
```
```css
.sec-head { display:flex; align-items:baseline; justify-content:space-between; border-bottom:1px solid var(--rule); padding-bottom:10px; margin-bottom:24px; }
.sec-title { font-family:'Montserrat',sans-serif; font-weight:900; font-size:34px; letter-spacing:-0.035em; line-height:1; margin:0 0 8px; }
.sec-title em { font-style:italic; color: var(--blue); }
.sec-head .num { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.3em; text-transform:uppercase; font-weight:700; color: var(--ink-mute); }
```

### 5.3 Spec table

```css
.spec {
  display: grid; grid-template-columns: 140px 1fr;
  gap: 4px 16px;
  font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.55;
  padding: 16px 18px;
  background: #fff; border: 1px solid var(--rule);
  border-radius: 4px;
}
.spec .k { color: var(--ink-mute); letter-spacing: 0.18em; text-transform: uppercase; font-size: 9px; padding-top: 2px; }
.spec .v { color: var(--ink); }
```

### 5.4 Mark mini (chrome eyebrow, footer)

```html
<span class="mark-mini">AIS<b>LIVE</b></span>
```
```css
.mark-mini {
  display: inline-flex; align-items: baseline;
  font-family: 'Montserrat', sans-serif; font-style: italic; font-weight: 900;
  font-size: 12px; letter-spacing: -0.02em; color: var(--ink);
}
.mark-mini b { color: var(--blue); font-weight: 900; margin-left: 3px; }
```

### 5.5 Command-deck grid (signature dark background)

```css
.cmd-bg {
  position: relative; background: #07121c;
}
.cmd-bg::before {
  content:''; position:absolute; inset:0;
  background-image:
    linear-gradient(rgba(55,189,248,0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(55,189,248,0.06) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

| Spec | Value |
|---|---|
| Lines | `rgba(55,189,248, .06–.07)` (use .08 for hero) |
| Cell | 24 × 24 |
| Use | Onyx covers, dark hero only |

### 5.6 Glow blob (decor — print-hide)

```css
.glow-blue { position:absolute; width:320px; height:320px; background:#37bdf8; filter:blur(100px); opacity:0.22; border-radius:50%; }
.glow-coral { position:absolute; width:240px; height:240px; background:#FF8A5C; filter:blur(90px); opacity:0.25; border-radius:50%; }
.glow-yellow { position:absolute; width:240px; height:240px; background:#f5d82a; filter:blur(90px); opacity:0.25; border-radius:50%; }
/* mark with data-print-hide and strip filter+blur on @media print */
```

| Spec | Value |
|---|---|
| Filter | `blur(80–140px)` |
| Opacity | 0.16 – 0.30 |
| Print | `data-print-hide` → display:none |

### 5.7 Surface chrome (top eyebrow + footer)

```html
<div class="chrome-top dark">
  <span class="mark-mini" style="color:#fff">AIS<b>LIVE</b></span>
  <span>Design System · v1.0 · 2026</span>
</div>
```
```css
.chrome-top { display:flex; justify-content:space-between; align-items:center;
  font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:0.3em;
  text-transform:uppercase; font-weight:700; color:var(--ink-mute);
  padding:14px 72px; border-bottom:1px solid var(--rule); background:var(--cream); }
.chrome-top.dark { color:var(--paper-mute); border-bottom-color:var(--rule-dark); background:var(--onyx); }
```

---

## 6 · Copy patterns & voice

- **Tagline:** *Real Projects. Real Revenue.*
- **One-liners:**
  - “Real projects. **Real revenue.**”
  - “Stop selling hours. **Sell outcomes.**”
  - “Close **one deal**. Ticket paid.”
  - “One room. One voice.”
  - “Three days. One room.”
  - “You won’t build it sitting alone.”
- **Mono eyebrows:** `BRAND & PARTNERSHIP SHEET · 2026`, `BOARDING · 127 LEFT`, `TRACK 02`, `WAYPOINT 04`, `CHAPTER 01`, `MEMO 004`, `№ 001`.
- **CTAs:** `CLAIM SEAT >>`, `APPLY >>`, `AISLIVE.CO`, `PARTNERS@AISLIVE.CO`.
- **Bold pattern:** italic *colored* run inside a 900 sentence — `Real <em>Revenue</em>.`, `<em>operators’</em> stack`, `is a <em>skill</em>`. Italic is the “movement” inside still type.
- **Numbers:** Big, condensed, negative tracking. `300+`, `28×`, `T-28`, `$10k`. Pair with one short Inter-300 italic line.

---

## 7 · Layout system

- **Page max-width:** 1180px center, with band padding `64px 72px`.
- **Bands alternate ground:** cream → paper → onyx → charcoal. Chrome eyebrow + footer rules separate them.
- **Grid utilities:**
  - `.row { display:flex; gap:20px; }`
  - `.grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }`
  - `.swatch-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:16px; }`
  - `.lockup-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:14px; }`
- **Stack helpers:** `.stack-6 > * + * { margin-top:24px }`, `.stack-7` (32), `.stack-8` (48).

---

## 8 · Surfaces seen in production (catalogue, 35 in-use frames)

These are the canonical layouts in `Finalized AIS Logo.html` — use them as a mental library for placements.

1. **Onyx countdown** — Eyebrow + `T-28` numeral + 1-line sentence + mark.
2. **Yellow speaker card** — Headshot caption + “Stop selling hours.” quote.
3. **Coral field report** — “Made back ticket 28× in 40 days.” + attribution.
4. **Blue track stack** — `BUILD. SELL. SHIP.` huge stacked italic.
5. **Onyx phone-portrait CTA** — REVENUE in yellow + Inter-300 “is a *skill*.”
6. **Onyx landing hero** — “Real Projects. *Real Revenue.*” + Sep 18–20 · Austin TX.
7. **Coral newsprint cover** — “THREE DAYS. ONE ROOM.”
8. **Charcoal wayfinder** — “Client Acquisition *Lab*” + Room/Time.
9. **Onyx crew card** — Speaker bug + email.
10. **Blue social square** — Centered large mark, no glow.
11. **Onyx wide banner** — Mark + tagline + city/date right.
12. **Onyx 4-up access grid** — ALL-ACCESS / REVENUE / LIVE / CREW pass tiles.
13. **Charcoal schedule** — Day 01 timestamps.
14. **Paper sponsor card** — “The *operators’* stack, curated.”
15. **Coral wayfinding** — “BONFIRE & GRIND” outdoor signage.
16. **Cream memo** — “Room is full. *Join the waitlist.*”
17. **Photo-style dark** — italic on-stage quote.
18. **Yellow ticket stub** — Seat + price + dashed tear.
19. **Onyx avatar** — Centered all-white mark.
20. **Cream avatar** — Centered all-black mark.
21. **Electric blue square** — Huge `LIVE.` italic.
22. **Yellow stat** — `300+` operators in one room.
23. **Onyx + cream contrast** — Cohort testimonial.
24. **Coral 28×** — Gain report stat.
25. **Paper investor cover** — Chapter 01 deck cover.
26. **Onyx IG carousel** — `"$10k"` in cyan.
27. **Cream email banner** — Ops Dispatch / Issue 24.
28. **Charcoal yellow-glow ad** — “Close *one deal*. Ticket paid.”
29. **Blue monochrome** — White-only mark.
30. **Black VIP** — Blue glow corner + white/blue mark.
31. **Cream tote-bag** — Big all-black mark + crew tag.
32. **Onyx cap embroidery** — Orange-on-black tag.
33. **Black cinematic billboard** — Coming to Austin Sep 2026.
34. **Paper partner call** — Reach 300+ operators.
35. **Coral press pass** — Metro-card style stub.

---

## 9 · Asset inventory

All assets live in the project under these paths.

### 9.1 PNG logo files (rasterized lockups)

| File | Use |
|---|---|
| `downloads/AIS-LIVE-fat-on-cream.png` | Mark, baked on cream |
| `downloads/AIS-LIVE-fat-on-dark.png` | Mark, baked on onyx |
| `downloads/AIS-LIVE-fat-onyx-transparent.png` | Onyx mark, transparent BG |
| `downloads/AIS-LIVE-fat-white-transparent.png` | White mark, transparent BG |

### 9.2 PNG banner / hero exports

| File | Use |
|---|---|
| `downloads/AIS-Live-Banner-Charcoal-Duotone.png` | Wide banner — charcoal duotone |
| `downloads/AIS-Live-Banner-Grid-Onyx.png` | Wide banner — onyx + command grid |
| `downloads/AIS-Live-Banner-Minimal-Onyx.png` | Wide banner — minimal onyx |
| `downloads/AIS-Live-Banner-Spotlight.png` | Wide banner — spotlight |

### 9.3 Source HTML / JSX (read these for full fidelity)

- `AIS Live - Design System.html` — token + component reference
- `AIS Live - Brand & Partnership Sheet (Live Dot).html` — full brand & partnership sheet (canonical)
- `Finalized AIS Logo.html` — locked Shift lockup + 35 in-use surfaces (canonical for placements)
- `AIS Live Landing Hero.html` / `landing-mocks.jsx` — landing patterns
- `AIS Live - Speaker Cards.html` — speaker card system
- `AIS Live Google Forms Banners.html` — banner exports
- `AIS Live Shift Mockups.html` / `mocks.jsx` — mock library
- `AIS Live Logo Canvas.html` / `logos.jsx` — early logo explorations (deprecated, kept for reference)
- `brand-sheet-livedot.jsx` — the `ShiftMark` React component (auto-recoloring, live-dot included)

---

## 10 · For animation / video / “hyperframe” work

Use this section as the canonical motion brief. Keep the system disciplined: the **live-dot pulse is the only ambient motion**; everything else is intentional and on a beat.

### 10.1 Motion primitives

| Move | Spec | When |
|---|---|---|
| **Live-dot pulse** | scale 1 → 1.1 → 1, ring 0 → 8px, **1.6s ease-in-out infinite** | Whenever the mark is on screen at a size where the dot reads (≥3px) |
| **Mark glow swell** | `text-shadow` blur 30px → 80px, opacity 0.4 → 0.75, **2.4s ease-in-out alternate** | Optional, only on Onyx/Charcoal/Black, never on cream |
| **Word reveal** | clip-path `inset(0 100% 0 0)` → `inset(0 0 0 0)`, **600ms `cubic-bezier(.2,.7,.1,1)`**, AIS then LIVE staggered 80ms | Opening title cards |
| **Italic skew-in** | translateX(−40px) + opacity 0 → 1, **500ms `cubic-bezier(.2,.7,.1,1)`** | Italic accent words (Revenue, skill, operators) |
| **Eyebrow type-in** | width 0 → auto (mono), **400ms steps(N)** | Mono eyebrows; or just fade-in 200ms |
| **Grid scan** | `background-position-x` 0 → 24px loop, **8s linear infinite** | Command-deck grid only, very subtle |
| **Glow blob drift** | translate(±40px, ±20px) loop, **18s ease-in-out alternate** | Decorative blue/yellow/coral blobs |

### 10.2 Standard timing scale

- **Tick** 100ms — micro reactions
- **Beat** 200ms — eyebrow fades, dot bursts
- **Word** 400ms — type-in
- **Phrase** 600ms — full reveal of a sentence
- **Scene** 1600ms — matches the live-dot loop; chapter changes should land on the dot’s 0/100% phase

### 10.3 Easing palette

```css
--ease-snap:   cubic-bezier(.2, .7, .1, 1);   /* reveals, slide-ins */
--ease-soft:   cubic-bezier(.4, 0, .2, 1);    /* fades, scale */
--ease-pulse:  ease-in-out;                   /* live-dot, glow swell */
--ease-linear: linear;                        /* loops, grid scan */
```

### 10.4 Frame-rate & export

- Internal animation work: **60fps**, 1920×1080 for landscape, 1080×1920 for portrait, 1080×1080 square.
- Live-dot duration locks to multiples of **1.6s** so any loop is in phase with the dot.
- Always end on the **rest pose**: AIS white, LIVE blue glow, dot visible.

### 10.5 Sound (if added)

- **Type-in:** mono mechanical tick, low gain
- **Reveal:** soft impact under the LIVE word landing
- **Live-dot pulse:** silent — never sonify

---

## 11 · React / Babel scaffold for video frames

A self-contained frame component you can drop into Claude Code prototypes. Pair with your `Stage / Sprite` animation primitives.

```jsx
function AISFrame({ ground = 'onyx', children, grid = true, glow = true }) {
  const grounds = {
    onyx:     { bg: '#07121c', ink: '#fff' },
    charcoal: { bg: '#0a0e14', ink: '#fff' },
    black:    { bg: '#000',    ink: '#fff' },
    cream:    { bg: '#f0eee9', ink: '#07121c' },
    paper:    { bg: '#fff',    ink: '#07121c' },
    blue:     { bg: '#37bdf8', ink: '#07121c' },
    yellow:   { bg: '#f5d82a', ink: '#07121c' },
    coral:    { bg: '#FF8A5C', ink: '#07121c' },
  };
  const g = grounds[ground] || grounds.onyx;
  const isDark = ['onyx','charcoal','black'].includes(ground);
  return (
    <div style={{ position:'relative', width:'100%', height:'100%',
                  background:g.bg, color:g.ink, overflow:'hidden',
                  fontFamily: "'Inter', sans-serif" }}>
      {grid && isDark && (
        <div style={{ position:'absolute', inset:0,
          backgroundImage:'linear-gradient(rgba(55,189,248,0.07) 1px, transparent 1px),' +
                          'linear-gradient(90deg, rgba(55,189,248,0.07) 1px, transparent 1px)',
          backgroundSize:'24px 24px' }} />
      )}
      {glow && isDark && (
        <div style={{ position:'absolute', top:-60, right:-40,
                      width:320, height:320, background:'#37bdf8',
                      filter:'blur(100px)', opacity:0.22, borderRadius:'50%' }} />
      )}
      <div style={{ position:'relative', width:'100%', height:'100%' }}>{children}</div>
    </div>
  );
}
```

---

## 12 · Quick-reference checklist (before exporting)

- [ ] Mark is **Montserrat 900 italic**, ALL CAPS, single line.
- [ ] Tracking is **−0.03em**, line-height **0.9**, word gap **0.08em**.
- [ ] Glow is **only** on dark grounds. No glow on cream/yellow/coral.
- [ ] Live-dot is **#FF3B30** at 0.16em, top 0.08em, ml 0.06em.
- [ ] Live-dot pulses at **1.6s ease-in-out infinite** — or static if size < ~3px.
- [ ] Body in Inter, eyebrows in JetBrains Mono +0.32em UPPER.
- [ ] One italic accent run per sentence — color blue or coral or yellow.
- [ ] Command-deck grid lines use `rgba(55,189,248, .06–.07)` at 24px cells.
- [ ] Glow blobs use `blur(80–140px)` and opacity 0.16–0.30.
- [ ] No red on type or surfaces. No gradients on the mark.
- [ ] Animations end on the rest pose; loops phase with 1.6s.

---

*End of brief. Read `AIS Live - Brand & Partnership Sheet (Live Dot).html` and `Finalized AIS Logo.html` for the canonical visual references.*
