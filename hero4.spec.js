const { test } = require('@playwright/test');

test('hero4 dom', async ({ page }) => {
  const logs = [];
  page.on('console', (m) => logs.push(`console:${m.type()}:${m.text()}`));
  page.on('pageerror', (e) => logs.push(`pageerror:${e.message}`));
  await page.goto('http://localhost:3000/drafts/tmp/hero-4', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const data = await page.evaluate(() => ({
    hasShell: !!document.querySelector('.hero-4-shell'),
    hasTitle: !!document.querySelector('.hero-4-title'),
    titleText: [...document.querySelectorAll('.hero-4-title-line')].map((n) => n.textContent.trim()),
    hasPanel: !!document.querySelector('.hero-4-panel'),
    stats: document.querySelectorAll('.hero-4-stat-card').length,
    metricRows: document.querySelectorAll('.hero-4-metric-row').length,
    kicker: document.querySelector('.hero-4-kicker')?.textContent?.trim() || null,
  }));
  console.log(JSON.stringify({ data, logs }, null, 2));
  await page.screenshot({ path: '/tmp/hero-4-test.png', fullPage: true });
});
