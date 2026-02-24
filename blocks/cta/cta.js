export default function decorate(block) {
  const rows = [...block.children];
  const get = (i, j) => rows[i]?.children[j]?.textContent?.trim() || '';
  const eye = get(0, 0);
  const heading = get(0, 1) || get(1, 0);
  const body = get(0, 2) || get(1, 1) || get(2, 0);
  const buttonText = get(0, 3) || get(1, 2) || get(2, 1) || 'Request a Quote';
  let buttonHref = '#';
  rows.forEach((row) => {
    const a = row.querySelector('a[href]');
    if (a && (a.textContent.trim() === buttonText || buttonText === 'Request a Quote')) buttonHref = a.href;
  });
  if (buttonHref === '#') {
    const any = block.querySelector('a[href]');
    if (any) buttonHref = any.href;
  }
  const sub = get(0, 4) || get(1, 3) || get(2, 2) || '';

  const wrap = document.createElement('div');
  wrap.className = 'cta-glass r';
  const safe = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  wrap.innerHTML = `
    <div class="cta-bg">ARCTIS</div>
    <div>
      ${eye ? `<div class="cta-eye">${eye}</div>` : ''}
      ${heading ? `<h2 class="cta-h">${heading.replace(/\n/g, '<br>')}</h2>` : ''}
      ${body ? `<p class="cta-p">${body}</p>` : ''}
    </div>
    <div class="cta-side">
      <a href="${safe(buttonHref)}" class="btn-cta">${safe(buttonText)}</a>
      ${sub ? `<span class="cta-sub">${safe(sub)}</span>` : ''}
    </div>
  `;
  block.textContent = '';
  block.appendChild(wrap);
}
