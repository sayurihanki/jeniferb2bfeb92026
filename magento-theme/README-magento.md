# Magento 2 theme — copy instructions

1. Copy the full `magento-theme` folder into your Magento app design path:
   - `magento-theme/` → `app/design/frontend/<Vendor>/eds_theme/`
   So you have: `app/design/frontend/<Vendor>/eds_theme/registration.php`, `theme.xml`, `Magento_Theme/layout/default_head_blocks.xml`.

2. Copy the built assets from this repo’s `dist/` into the theme’s `web/` folder:
   - `dist/css/styles.css` → `app/design/frontend/<Vendor>/eds_theme/web/css/styles.css`
   - `dist/js/main.js` → `app/design/frontend/<Vendor>/eds_theme/web/js/main.js`

3. In `registration.php`, replace `Vendor` with your vendor name (e.g. `Acme`). In `theme.xml` and layout, the theme code is `Vendor/eds_theme` (e.g. `Acme/eds_theme`).

4. Apply the theme (Stores → Configuration → General → Design) and run:
   - `php bin/magento cache:clean`
   - `php bin/magento setup:static-content:deploy -f`
   - `php bin/magento setup:upgrade` (only when theme or layout changed)

This theme does not compile Magento assets; it only adds the ARCTIS CSS and JS via `default_head_blocks.xml`.
