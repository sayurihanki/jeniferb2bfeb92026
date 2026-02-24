export default function decorate(block) {
  const rows = [...block.children];
  const footerRow = rows[3];
  const privacyCell = footerRow?.children?.[0];
  const actionCell = footerRow?.children?.[1];
  const authoredLink = actionCell?.querySelector('a');

  const actionLabel = authoredLink?.textContent?.trim() || actionCell?.textContent?.trim() || 'Request a Quote';
  const actionHref = authoredLink?.href || '/support';

  const cta = document.createElement('section');
  cta.className = 'newsletter arctis-newsletter';
  cta.setAttribute('data-arctis-reveal', '');
  cta.setAttribute('data-arctis-stagger', '2');

  cta.innerHTML = `
    <div class="arctis-cta-bg" aria-hidden="true">ARCTIS</div>
    <div class="arctis-cta-inner">
      <div class="arctis-cta-main" data-arctis-reveal data-arctis-stagger="3">
        <p class="arctis-cta-kicker">// Ready to build?</p>
        <h2 class="arctis-cta-title">LET'S BUILD<br><span>YOUR SYSTEM</span></h2>
        <p class="arctis-cta-text">
          Speak with an ARCTIS engineer. We will spec your project architecture,
          capacity profile, and installation constraints with no upfront commitment.
        </p>
      </div>
      <div class="arctis-cta-side" data-arctis-reveal data-arctis-stagger="4">
        <a class="button arctis-cta-button" href="${actionHref}">${actionLabel}</a>
        <p class="arctis-cta-sub">or call 1-800-ARCTIS-1</p>
      </div>
    </div>
  `;

  if (privacyCell?.innerHTML?.trim()) {
    const foot = document.createElement('p');
    foot.className = 'arctis-cta-privacy';
    foot.innerHTML = privacyCell.innerHTML;
    cta.append(foot);
  }

  block.replaceChildren(cta);
}
