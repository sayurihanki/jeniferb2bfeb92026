function animateCounter(el, target) {
  const duration = 1200;
  const start = performance.now();
  const from = 0;

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - t) ** 4;
    const value = Math.round(from + (target - from) * eased);
    el.textContent = value.toLocaleString('en-US');
    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function initStatCounters(block) {
  const statValues = block.querySelectorAll('[data-stat-target]');
  if (!statValues.length) return;

  const startCounters = () => {
    statValues.forEach((el) => {
      if (el.dataset.statStarted === 'true') return;
      el.dataset.statStarted = 'true';
      animateCounter(el, Number(el.dataset.statTarget || 0));
    });
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    startCounters();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      startCounters();
      observer.disconnect();
    });
  }, { threshold: 0.2 });

  observer.observe(block);
}

export default function decorate(block) {
  const rows = [...block.children];
  const firstRow = rows[0];
  const heroPicture = firstRow?.querySelector('picture')?.cloneNode(true);

  const metrics = [
    { label: 'Cooling', value: '87%', className: 'is-cooling' },
    { label: 'Heat Reject', value: '31%', className: 'is-heat' },
    { label: 'Airflow', value: '74%', className: 'is-airflow' },
    { label: 'Compressor', value: '56%', className: 'is-compressor' },
  ];

  const stats = [
    { target: 1400, suffix: '+', label: 'Installations worldwide' },
    { target: 98, suffix: '%', label: 'System efficiency rating' },
    { target: 39, suffix: ' yr', label: 'Industry experience' },
    { target: 640, suffix: 'K', label: 'Tons cooling capacity' },
  ];

  const media = document.createElement('div');
  media.className = 'arctis-hero-media';
  if (heroPicture) {
    media.append(heroPicture);
  }

  const heroMarkup = document.createRange().createContextualFragment(`
    <div class="arctis-hero-shell" data-arctis-reveal data-arctis-stagger="1">
      <div class="arctis-hero-ring" aria-hidden="true"></div>
      <div class="arctis-hero-overlay" aria-hidden="true"></div>
      <div class="arctis-hero-inner">
        <div class="arctis-hero-copy" data-arctis-reveal data-arctis-stagger="2">
          <p class="arctis-hero-kicker">Precision HVAC Manufacturing</p>
          <h1 class="arctis-hero-title">
            <span>MASTER</span>
            <span><em>THE</em> CLIMATE.</span>
            <span><strong>OWN</strong> THE SPACE.</span>
          </h1>
          <p class="arctis-hero-subtitle">
            ARCTIS engineers ultra-precise climate systems for data centers, industrial plants,
            and mission-critical facilities. Built for environments others abandon.
          </p>
          <div class="arctis-hero-actions">
            <a class="button arctis-primary" href="/apparel">Explore Systems</a>
            <a class="arctis-text-link" href="/support">How It Works</a>
          </div>
        </div>
        <aside class="arctis-hero-glass" data-arctis-reveal data-arctis-stagger="3" aria-label="Live system metrics">
          <div class="arctis-glass-head">
            <span>Zone Alpha - Live</span>
            <span class="arctis-live">Online</span>
          </div>
          <div class="arctis-temp-wrap">
            <span class="arctis-temp-value">68.4</span>
            <span class="arctis-temp-unit">°F</span>
          </div>
          <p class="arctis-temp-label">Supply Air Temperature - Zone A</p>
          <div class="arctis-metric-list"></div>
          <div class="arctis-glass-foot">
            <span>All systems nominal</span>
            <span>12 active zones</span>
          </div>
        </aside>
      </div>
      <div class="arctis-hero-stats" data-arctis-reveal data-arctis-stagger="4"></div>
    </div>
  `);

  const metricList = heroMarkup.querySelector('.arctis-metric-list');
  metrics.forEach((metric) => {
    const row = document.createElement('div');
    row.className = `arctis-metric-row ${metric.className}`;
    row.innerHTML = `
      <span>${metric.label}</span>
      <div class="arctis-metric-track"><div class="arctis-metric-fill" style="width:${metric.value}"></div></div>
      <span>${metric.value}</span>
    `;
    metricList.append(row);
  });

  const statsRow = heroMarkup.querySelector('.arctis-hero-stats');
  stats.forEach((stat, idx) => {
    const item = document.createElement('article');
    item.className = 'arctis-stat';
    item.setAttribute('data-arctis-stagger', String((idx % 6) + 1));
    item.innerHTML = `
      <p class="arctis-stat-value"><span data-stat-target="${stat.target}">0</span><small>${stat.suffix}</small></p>
      <p class="arctis-stat-label">${stat.label}</p>
    `;
    statsRow.append(item);
  });

  const shell = heroMarkup.querySelector('.arctis-hero-shell');
  shell.prepend(media);

  block.replaceChildren(heroMarkup);
  initStatCounters(block);
}
