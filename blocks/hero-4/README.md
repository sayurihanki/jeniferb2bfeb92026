# Hero-4 Block

## Overview
`hero-4` is a cinematic hero block designed for ARCTIS-style landing sections. It renders:
- background media with dark atmospheric overlays
- kicker + large multiline headline
- supporting copy + two CTAs
- live metrics panel with progress bars
- bottom stats strip

## Content Model
Use up to 10 rows with max 4 cells per row.

| Hero-4 |
| --- |
| Image | Kicker | Title | Description |
| Primary CTA | Secondary CTA | Temperature | Status badge |
| Metric label | Metric value | Metric tone (`cooling`, `heat`, `airflow`, `compressor`) |
| Metric label | Metric value | Metric tone |
| Metric label | Metric value | Metric tone |
| Metric label | Metric value | Metric tone |
| Stat value | Stat suffix | Stat label |
| Stat value | Stat suffix | Stat label |
| Stat value | Stat suffix | Stat label |
| Stat value | Stat suffix | Stat label |

### Defaults
- Metrics rows (3-6) are optional; defaults are used when omitted.
- Stats rows (7-10) are optional; defaults are used when omitted.
- CTA links fall back to `/apparel` and `/support`.

## Authoring Notes
- Keep title on separate lines for best visual result (line breaks supported).
- Use semantic links in CTA cells (`<a>`).
- Keep metric values as percentages (e.g. `87%`) for proper progress bar width.

## Local Test Content
A local test page is included at:
- `/drafts/tmp/hero-4` (served via `aem up --html-folder drafts ...`)

## Files
- `blocks/hero-4/hero-4.js`
- `blocks/hero-4/hero-4.css`
- `blocks/hero-4/_hero-4.json`
