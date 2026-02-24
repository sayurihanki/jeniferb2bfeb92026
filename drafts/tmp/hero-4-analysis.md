# Hero-4 Block Analysis

## Todo List
1. [ ] Start dev server
2. [x] Analyze & plan
3. [x] Design content model
4. [x] Identify/create test content
5. [x] Implement
6. [x] Lint & test
7. [x] Final validation
8. [ ] Ship it

## Goal
Create a new `hero-4` EDS block that reproduces the cinematic ARCTIS hero section (headline, CTAs, live metrics panel, and stats strip) while keeping author input simple and semantic.

## Visual/Interaction Notes
- Full-bleed hero shell with dark atmospheric overlays and ring geometry accents.
- Left column: kicker, large multi-line title, supporting paragraph, primary + secondary CTA.
- Right column: frosted live metrics card with temperature and progress bars.
- Bottom row: four compact stat cards.
- Strong hover effects on CTA and panel surfaces.
- Responsive behavior:
  - Desktop: 2-column hero + stat row.
  - Tablet/mobile: 1-column, card stacks below copy, stat row collapses to 2 or 1 columns.

## Content Model
`hero-4` uses up to 10 rows with max 4 cells per row:

1. Row 1: `Image | Kicker | Title | Description`
2. Row 2: `Primary CTA | Secondary CTA | Temperature | Status badge`
3. Rows 3-6: metrics (`Label | Value | Tone`) optional
4. Rows 7-10: stats (`Value | Suffix | Label`) optional

If metrics/stats rows are omitted, defaults are used.

## Acceptance Criteria
- Block decorates cleanly into hero layout and does not throw errors with partial author content.
- Hero renders and remains readable at mobile/tablet/desktop breakpoints.
- CTA links resolve from authored links/text when provided, else fallback defaults.
- Metrics/stats support authored values and fallback defaults.
- No `innerHTML` injection from authored content.
