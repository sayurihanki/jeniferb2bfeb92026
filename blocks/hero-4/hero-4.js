import { createOptimizedPicture } from '../../scripts/aem.js';

const DEFAULT_METRICS = [
  { label: 'Cooling', value: '87%', tone: 'cooling' },
  { label: 'Heat Reject', value: '31%', tone: 'heat' },
  { label: 'Airflow', value: '74%', tone: 'airflow' },
  { label: 'Compressor', value: '56%', tone: 'compressor' },
];

const DEFAULT_STATS = [
  { value: '1400', suffix: '+', label: 'Installations Worldwide' },
  { value: '98', suffix: '%', label: 'System Efficiency Rating' },
  { value: '39', suffix: 'yr', label: 'Industry Experience' },
  { value: '640', suffix: 'K', label: 'Tons Cooling Capacity' },
];

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function getCells(row) {
  if (!row) return [];
  return [...row.children];
}

function getCellText(cell, fallback = '') {
  return cell?.textContent?.trim() || fallback;
}

function getCellLines(cell, fallback = []) {
  const raw = cell?.innerText || '';
  const lines = raw.split('\n').map((line) => line.trim()).filter(Boolean);
  return lines.length ? lines : fallback;
}

function getLinkData(cell, fallbackLabel, fallbackHref) {
  const link = cell?.querySelector('a');
  if (link) {
    const href = sanitizeHref(link.getAttribute('href'), fallbackHref);
    const label = link.textContent?.trim() || fallbackLabel;
    return { href, label };
  }

  const text = getCellText(cell);
  if (text) {
    return { href: sanitizeHref(text, fallbackHref), label: text };
  }

  return { href: sanitizeHref(fallbackHref, '/'), label: fallbackLabel };
}

function toneClass(tone) {
  const normalized = tone.trim().toLowerCase();
  if (normalized === 'heat') return 'is-heat';
  if (normalized === 'airflow') return 'is-airflow';
  if (normalized === 'compressor') return 'is-compressor';
  return 'is-cooling';
}

function decorateTitleLines(titleEl, lines) {
  lines.forEach((line, index) => {
    const lineEl = createElement('span', 'hero-4-title-line');

    if (index === 1 && line.toUpperCase().startsWith('THE ')) {
      const accent = createElement('span', 'hero-4-accent-ice', 'THE');
      lineEl.append(accent, document.createTextNode(` ${line.slice(4)}`));
    } else if (index === 2 && line.toUpperCase().startsWith('OWN ')) {
      const accent = createElement('span', 'hero-4-accent-flame', 'OWN');
      lineEl.append(accent, document.createTextNode(` ${line.slice(4)}`));
    } else {
      lineEl.textContent = line;
    }

    titleEl.append(lineEl);
  });
}

function sanitizeHref(href, fallbackHref) {
  const raw = (href || '').trim();
  if (!raw) return fallbackHref;
  if (raw.startsWith('/') || raw.startsWith('./') || raw.startsWith('../') || raw.startsWith('#') || raw.startsWith('?')) {
    return raw;
  }

  try {
    const parsed = new URL(raw, window.location.origin);
    return SAFE_PROTOCOLS.has(parsed.protocol) ? raw : fallbackHref;
  } catch {
    return fallbackHref;
  }
}

function parseTemperature(input, fallbackValue = '68.4', fallbackUnit = '°F') {
  const raw = (input || '').trim();
  if (!raw) return { value: fallbackValue, unit: fallbackUnit };

  const match = raw.match(/^([+-]?\d+(?:\.\d+)?)\s*(.*)$/);
  if (!match) return { value: raw, unit: fallbackUnit };

  return {
    value: match[1] || fallbackValue,
    unit: match[2]?.trim() || fallbackUnit,
  };
}

function buildMetricRow(metric) {
  const row = createElement('div', `hero-4-metric-row ${toneClass(metric.tone || 'cooling')}`);
  const label = createElement('span', 'hero-4-metric-label', metric.label);
  const track = createElement('div', 'hero-4-metric-track');
  const fill = createElement('div', 'hero-4-metric-fill');
  const numeric = Number.parseFloat(String(metric.value).replace(/[^\d.]/g, ''));
  fill.style.width = `${Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : 0}%`;
  track.append(fill);
  const value = createElement('span', 'hero-4-metric-value', metric.value);
  row.append(label, track, value);
  return row;
}

function buildStatCard(stat) {
  const card = createElement('article', 'hero-4-stat-card');
  const value = createElement('p', 'hero-4-stat-value');
  value.append(createElement('span', 'hero-4-stat-number', stat.value));
  value.append(createElement('small', 'hero-4-stat-suffix', stat.suffix));
  const label = createElement('p', 'hero-4-stat-label', stat.label);
  card.append(value, label);
  return card;
}

export default function decorate(block) {
  const rows = [...block.children];

  const [heroRow, ctaRow, ...dataRows] = rows;
  const heroCells = getCells(heroRow);
  const ctaCells = getCells(ctaRow);

  const backgroundCell = heroCells[0];
  const kicker = getCellText(heroCells[1], 'Precision HVAC Manufacturing');
  const titleLines = getCellLines(heroCells[2], ['MASTER', 'THE CLIMATE.', 'OWN THE SPACE.']);
  const description = getCellText(
    heroCells[3],
    'ARCTIS engineers ultra-precise climate systems for data centers, industrial plants, and mission-critical facilities. Built for environments others abandon.',
  );

  const primaryCta = getLinkData(ctaCells[0], 'Explore Systems', '/apparel');
  const secondaryCta = getLinkData(ctaCells[1], 'How It Works', '/support');
  const temperature = getCellText(ctaCells[2], '68.4 °F');
  const badge = getCellText(ctaCells[3], 'Online');

  const authoredMetrics = dataRows
    .slice(0, 4)
    .map((row) => {
      const cells = getCells(row);
      return {
        label: getCellText(cells[0]),
        value: getCellText(cells[1]),
        tone: getCellText(cells[2], 'cooling'),
      };
    })
    .filter((item) => item.label && item.value);

  const authoredStats = dataRows
    .slice(4, 8)
    .map((row) => {
      const cells = getCells(row);
      return {
        value: getCellText(cells[0]),
        suffix: getCellText(cells[1]),
        label: getCellText(cells[2]),
      };
    })
    .filter((item) => item.value && item.label);

  const metrics = authoredMetrics.length ? authoredMetrics : DEFAULT_METRICS;
  const stats = authoredStats.length ? authoredStats : DEFAULT_STATS;

  const shell = createElement('section', 'hero-4-shell');
  shell.setAttribute('data-arctis-reveal', '');
  shell.setAttribute('data-arctis-stagger', '1');

  const media = createElement('div', 'hero-4-media');
  const image = backgroundCell?.querySelector('picture img');
  if (image) {
    media.append(createOptimizedPicture(image.src, image.alt || '', false, [{ width: '2000' }, { width: '750' }]));
  }

  const overlay = createElement('div', 'hero-4-overlay');
  const ring = createElement('div', 'hero-4-ring');

  const inner = createElement('div', 'hero-4-inner');

  const copy = createElement('div', 'hero-4-copy');
  copy.setAttribute('data-arctis-reveal', '');
  copy.setAttribute('data-arctis-stagger', '2');

  const kickerEl = createElement('p', 'hero-4-kicker', kicker);
  const titleEl = createElement('h1', 'hero-4-title');
  decorateTitleLines(titleEl, titleLines);
  const descriptionEl = createElement('p', 'hero-4-description', description);

  const actions = createElement('div', 'hero-4-actions');
  const primary = createElement('a', 'hero-4-button hero-4-button-primary', primaryCta.label);
  primary.href = primaryCta.href;
  const secondary = createElement('a', 'hero-4-button hero-4-button-secondary', secondaryCta.label);
  secondary.href = secondaryCta.href;
  actions.append(primary, secondary);

  copy.append(kickerEl, titleEl, descriptionEl, actions);

  const panel = createElement('aside', 'hero-4-panel');
  panel.setAttribute('data-arctis-reveal', '');
  panel.setAttribute('data-arctis-stagger', '3');

  const panelHeader = createElement('div', 'hero-4-panel-header');
  panelHeader.append(
    createElement('span', 'hero-4-panel-title', 'Zone Alpha - Live'),
    createElement('span', 'hero-4-panel-badge', badge),
  );

  const tempWrap = createElement('p', 'hero-4-temperature');
  const { value: tempValue, unit: tempUnit } = parseTemperature(temperature);
  tempWrap.append(createElement('span', 'hero-4-temperature-value', tempValue), createElement('span', 'hero-4-temperature-unit', tempUnit));

  const tempLabel = createElement('p', 'hero-4-temperature-label', 'Supply Air Temperature - Zone A');

  const metricList = createElement('div', 'hero-4-metric-list');
  metrics.forEach((metric) => metricList.append(buildMetricRow(metric)));

  const panelFooter = createElement('div', 'hero-4-panel-footer');
  panelFooter.append(
    createElement('span', 'hero-4-panel-status', 'All systems nominal'),
    createElement('span', 'hero-4-panel-zones', '12 active zones'),
  );

  panel.append(panelHeader, tempWrap, tempLabel, metricList, panelFooter);

  inner.append(copy, panel);

  const statsRow = createElement('div', 'hero-4-stats');
  statsRow.setAttribute('data-arctis-reveal', '');
  statsRow.setAttribute('data-arctis-stagger', '4');
  stats.forEach((stat) => statsRow.append(buildStatCard(stat)));

  shell.append(media, overlay, ring, inner, statsRow);
  block.replaceChildren(shell);
}
