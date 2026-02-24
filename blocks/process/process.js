export default function decorate(block) {
  const rows = [...block.children];
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const intro = document.createElement('div');
  intro.className = 'proc-intro';
  const tag = rows[0]?.children[0]?.textContent?.trim();
  const title = rows[0]?.children[1]?.innerHTML?.trim() || '';
  const desc = rows[0]?.children[2]?.textContent?.trim() || '';
  intro.innerHTML = `
    <div>
      ${tag ? `<div class="sec-tag r">${tag}</div>` : ''}
      ${title ? `<h2 class="sec-h r">${title}</h2>` : ''}
    </div>
    ${desc ? `<p class="r d1">${desc}</p>` : ''}
  `;

  const steps = document.createElement('div');
  steps.className = 'proc-steps r';
  for (let i = 1; i < rows.length; i += 1) {
    const [num, stepTitle, body] = [...rows[i].children].map((c) => c?.textContent?.trim() || '');
    if (!stepTitle) continue;
    const step = document.createElement('div');
    step.className = 'proc-step';
    step.innerHTML = `
      <div class="ps-n">${String(i).padStart(2, '0')}</div>
      <div class="ps-title">${stepTitle}</div>
      ${body ? `<div class="ps-body">${body}</div>` : ''}
      <span class="ps-icon">↗</span>
    `;
    steps.appendChild(step);
  }

  wrap.appendChild(intro);
  wrap.appendChild(steps);
  block.textContent = '';
  block.appendChild(wrap);
}
