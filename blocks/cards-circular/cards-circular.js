const SYSTEM_COPY = [
  {
    category: 'Flagship Series',
    title: 'Rooftop Central Units',
    description: 'Custom-configured systems engineered for 24/7 mission-critical uptime.',
  },
  {
    category: 'Cooling Series',
    title: 'Magnetic Bearing Chillers',
    description: 'High-COP precision cooling with frictionless compressor technology.',
  },
  {
    category: 'Ventilation Series',
    title: 'Air Handling Units',
    description: 'Humidity control, clean filtration, and modular airflow management.',
  },
  {
    category: 'Distribution',
    title: 'Ductwork Systems',
    description: 'High-performance duct architecture built for dense facility layouts.',
  },
  {
    category: 'Monitoring',
    title: 'Remote Diagnostics',
    description: 'Continuous telemetry with predictive service interventions before failure.',
  },
  {
    category: 'Controls',
    title: 'BMS Integration',
    description: 'BACnet-ready orchestration with AI-assisted load balancing.',
  },
  {
    category: 'Sustainability',
    title: 'Heat Recovery Loops',
    description: 'Capture waste thermal energy and route it into productive reuse.',
  },
  {
    category: 'Reliability',
    title: 'Redundant Core Modules',
    description: 'Fault-tolerant architecture for uninterrupted performance under stress.',
  },
  {
    category: 'Expansion',
    title: 'Scalable Capacity Pods',
    description: 'Rapidly add tonnage without replacing the operational backbone.',
  },
];

export default function decorate(block) {
  const rows = [...block.children];
  const list = document.createElement('ul');
  list.className = 'arctis-systems-grid';

  rows.forEach((row, index) => {
    const [imageCell, textCell] = [...row.children];
    const authoredLink = textCell?.querySelector('a');
    const authoredLabel = authoredLink?.textContent?.trim() || textCell?.textContent?.trim() || '';

    const preset = SYSTEM_COPY[index % SYSTEM_COPY.length];
    const title = authoredLabel || preset.title;
    const href = authoredLink?.href || '/products/default';

    const item = document.createElement('li');
    item.className = 'arctis-system-card';
    item.setAttribute('data-arctis-reveal', '');
    item.setAttribute('data-arctis-stagger', String((index % 6) + 1));

    const visual = document.createElement('div');
    visual.className = 'arctis-system-visual';

    const picture = imageCell?.querySelector('picture')?.cloneNode(true);
    if (picture) {
      visual.append(picture);
    }

    const body = document.createElement('div');
    body.className = 'arctis-system-body';
    body.innerHTML = `
      <p class="arctis-system-category">${preset.category}</p>
      <h3 class="arctis-system-title">${title}</h3>
      <p class="arctis-system-description">${preset.description}</p>
      <a class="arctis-system-link" href="${href}">View System</a>
      <span class="arctis-system-plus" aria-hidden="true">+</span>
    `;

    item.append(visual, body);
    list.append(item);
  });

  block.replaceChildren(list);
}
