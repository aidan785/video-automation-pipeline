# AIS Live — Handoff Package

**Entry point:** [`AIS-LIVE-BRAND.md`](./AIS-LIVE-BRAND.md)

That single file is the source of truth — tokens, the locked Shift mark, motion specs, components, copy patterns, asset inventory, and animation primitives for video / “hyperframe” work.

## Contents

```
handoff/
├── AIS-LIVE-BRAND.md          ← READ THIS FIRST
├── assets/
│   ├── logos/                 ← Mark PNGs (transparent + baked)
│   └── banners/               ← Banner exports (onyx / charcoal / spotlight)
└── reference/                 ← Full canonical HTML/JSX & original spec
    ├── AIS Live - Design System.html
    ├── AIS Live - Brand & Partnership Sheet (Live Dot).html
    ├── Finalized AIS Logo.html
    ├── brand-sheet-livedot.jsx
    └── Design Specification - AIS Live Branding & Identity.md
```

## How to use with Claude Code

1. Drop `handoff/` into your project.
2. Point Claude Code at `AIS-LIVE-BRAND.md` (paste, attach, or reference).
3. The brief includes:
   - Paste-ready CSS variables (`:root`) and class definitions
   - A drop-in `ShiftMark` React component
   - Motion primitives, easing palette, and timing scale for animated video
   - A canonical `AISFrame` scaffold for video frames
   - Full asset inventory keyed to the `assets/` folder
4. For pixel fidelity, open any `reference/*.html` file in a browser.
