# ARCTIS theme package

Modular SCSS + JS theme extracted from the ARCTIS industrial HVAC page. Drop-in ready for EDS or Magento/Adobe Commerce.

## Build & run

```bash
npm install
npm run dev
```

Runs the Vite dev server (with hot reload). Open the URL shown in the terminal.

```bash
npm run build
```

Produces `/dist`: `dist/css/styles.css`, `dist/js/main.js`, and `dist/index.html`. Use these for deployment or local preview (`npm run preview`).

## Deploy to Magento

1. Copy the contents of `/dist` into your theme’s `web` folder:
   - `dist/css/styles.css` → `app/design/frontend/<Vendor>/eds_theme/web/css/styles.css`
   - `dist/js/main.js` → `app/design/frontend/<Vendor>/eds_theme/web/js/main.js`
2. Register the theme and add the assets in layout (see `magento-theme/` skeleton and `README-magento.md`).
3. Run:

```bash
php bin/magento cache:clean
php bin/magento setup:static-content:deploy -f
php bin/magento setup:upgrade
```

(Use `setup:upgrade` only when you’ve changed theme registration or layout.)

## Project layout

- `src/` — source: `index.html`, `scss/` (tokens, mixins, base, components), `js/` (cursor, counters, reveal, main).
- `dist/` — built CSS and JS (and `index.html` after `npm run build`).
- `magento-theme/` — minimal Magento 2 theme skeleton and copy instructions.
