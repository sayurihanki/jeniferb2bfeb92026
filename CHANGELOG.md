# Changelog

## 1.0.0 — Modular theme package

- **Tokens:** All `:root` CSS variables extracted to `_tokens.scss` with matching SCSS fallbacks (void, deep, navy, steel, ice, flame, white, muted, glass, rim, fonts).
- **Mixins:** `@mixin glass(...)` for glassy panels; `.reduced-hover` and `$hover-scale` / `$hover-duration` for subtle hovers; `@mixin focus-visible` and `focus-visible-flame` for keyboard focus.
- **Base:** Reset, body, grain overlay, cursor (#dot, #ring), and bg-glow in `_base.scss`.
- **Components:** Nav, hero, glass (hero card), hero-stats, cards (products + section utils + reveal), marquee, features, process, cta, footer split into SCSS partials; all import via `main.scss`.
- **JS:** Modularized into `cursor.js` (initCursor), `counters.js` (countUp, initCounters, initLiveTemp), `reveal.js` (initReveal); `main.js` imports and runs them on DOMContentLoaded.
- **Build:** Vite dev + build; output `dist/css/styles.css`, `dist/js/main.js`; optional `npm run build-css` for Sass-only.
- **Magento:** Minimal theme skeleton (registration.php, theme.xml, default_head_blocks.xml) and README-magento with copy/deploy steps.
