# AIS+ Skool community captures (9/30)

Source: https://www.skool.com/ai-automation-society-plus (Aidan logged in himself, in a throwaway Chrome profile opened by `tools/skool-capture.mjs login`; captured headless at 2x, muted).

| File | What | Used in |
| --- | --- | --- |
| `thumb-*.png` / `card-*.png` | Classroom course cards (thumbnail art / full card) | via `derived/` |
| `derived/mod-*.png` | Main-path modules 1 to 6 (published), Events, Recordings | Core B "The system" grid, "Never behind" Claude Code row, events row |
| `derived/course-*.png` | Agent Zero, 10 Hours to 10 Seconds, One Person AI Agency, n8n Templates art, cropped just below the card's top-left badge | Core B "What's inside" |
| `derived/calendar-weeks.png` | Calendar, Sept 2026, first 3 weeks (weekly Monday Q&A, Saturday AIS+ Chill sessions) | Core B "Never behind" |
| `classroom-grid.png`, `calendar.png` | Raw full pages | NOT for use: the Skool top bar (Aidan's avatar, notification counts) is in them. Only the crops in `derived/` go on screen |

Flags for Aidan:
- The four courses Nate names in the core (Agent Zero, 10 Hours to 10 Seconds, One Person AI Agency, templates) show a **Draft** badge in the classroom (admin view). The main path members see is Start Here, AI Partner, Portfolio, Claude Code, First Client, Scale. If those four aren't live for members, swap "What's inside" back to text rows (the `courses` UI in build.mjs had them) or to the main-path modules.
- No member names or faces are in any `derived/` image.
