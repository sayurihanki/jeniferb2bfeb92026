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

## DA.live Table Template
Paste this into DA.live as a table block:

| hero-4 |  |  |  |
| --- | --- | --- | --- |
| (background image) | Precision HVAC Manufacturing | MASTER<br>THE CLIMATE.<br>OWN THE SPACE. | ARCTIS engineers ultra-precise climate systems for data centers, industrial plants, and mission-critical facilities. Built for environments others abandon. |
| [Explore Systems](/apparel) | [How It Works](/support) | 68.4 °F | Online |
| Cooling | 87% | cooling |  |
| Heat Reject | 31% | heat |  |
| Airflow | 74% | airflow |  |
| Compressor | 56% | compressor |  |
| 1400 | + | Installations Worldwide |  |
| 98 | % | System Efficiency Rating |  |
| 39 | yr | Industry Experience |  |
| 640 | K | Tons Cooling Capacity |  |

## Local Test Content
A local test page is included at:
- `/drafts/tmp/hero-4` (served via `aem up --html-folder drafts ...`)

## Files
- `blocks/hero-4/hero-4.js`
- `blocks/hero-4/hero-4.css`
- `blocks/hero-4/_hero-4.json`
