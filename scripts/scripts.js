import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';
import {
  loadCommerceEager,
  loadCommerceLazy,
  initializeCommerce,
  applyTemplates,
  decorateLinks,
  loadErrorPage,
} from './commerce.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  decorateLinks(main);
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  // #region agent log
  fetch('http://127.0.0.1:7280/ingest/bbb10b0a-be90-44c9-b1bc-39270d124459', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '7da593' }, body: JSON.stringify({ sessionId: '7da593', location: 'scripts.js:loadEager:entry', message: 'loadEager started', data: { hasMain: !!doc.querySelector('main'), bodyAppearBefore: document.body.classList.contains('appear') }, timestamp: Date.now(), hypothesisId: 'H1' }) }).catch(() => {});
  // #endregion
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();

  /* Show body immediately so content is never stuck hidden (body:not(.appear){display:none}) */
  document.body.classList.add('appear');
  // #region agent log
  fetch('http://127.0.0.1:7280/ingest/bbb10b0a-be90-44c9-b1bc-39270d124459', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '7da593' }, body: JSON.stringify({ sessionId: '7da593', location: 'scripts.js:loadEager:afterAppear', message: 'appear added to body', data: { bodyAppearAfter: document.body.classList.contains('appear') }, timestamp: Date.now(), hypothesisId: 'H1' }) }).catch(() => {});
  // #endregion

  /* ARCTIS: inject background glow */
  if (!document.querySelector('.bg-glow')) {
    const bgGlow = document.createElement('div');
    bgGlow.className = 'bg-glow';
    document.body.prepend(bgGlow);
  }

  /* ARCTIS: custom cursor (only when fine pointer and no reduce-motion) */
  try {
    const useCursor = window.matchMedia('(pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (useCursor && !document.getElementById('dot')) {
      const dot = document.createElement('div');
      dot.id = 'dot';
      const ring = document.createElement('div');
      ring.id = 'ring';
      document.body.appendChild(dot);
      document.body.appendChild(ring);
      let mx = 0; let my = 0; let rx = 0; let ry = 0;
      document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = `${mx}px`;
        dot.style.top = `${my}px`;
      });
      (function anim() {
        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        ring.style.left = `${rx}px`;
        ring.style.top = `${ry}px`;
        requestAnimationFrame(anim);
      }());
      document.body.style.cursor = 'none';
    }
  } catch (e) {
    // Cursor must not block page display
  }

  const main = doc.querySelector('main');
  // #region agent log
  fetch('http://127.0.0.1:7280/ingest/bbb10b0a-be90-44c9-b1bc-39270d124459', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '7da593' }, body: JSON.stringify({ sessionId: '7da593', location: 'scripts.js:loadEager:mainCheck', message: 'main element check', data: { mainExists: !!main, firstSectionExists: !!(main && main.querySelector('.section')), sectionCount: main ? main.querySelectorAll('.section').length : 0 }, timestamp: Date.now(), hypothesisId: 'H2' }) }).catch(() => {});
  // #endregion
  if (main) {
    try {
      await initializeCommerce();
      decorateMain(main);
      applyTemplates(doc);
      await loadCommerceEager();
    } catch (e) {
      // #region agent log
      fetch('http://127.0.0.1:7280/ingest/bbb10b0a-be90-44c9-b1bc-39270d124459', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '7da593' }, body: JSON.stringify({ sessionId: '7da593', location: 'scripts.js:loadEager:catch', message: 'commerce/decoration threw', data: { err: String(e && e.message) }, timestamp: Date.now(), hypothesisId: 'H3' }) }).catch(() => {});
      // #endregion
      console.error('Error initializing commerce configuration:', e);
      /* Do not replace page with 418.html — show content anyway so the site is not blank */
      try {
        decorateMain(main);
        applyTemplates(doc);
      } catch (e2) {
        console.error('Fallback decoration failed:', e2);
      }
    }
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  // #region agent log
  fetch('http://127.0.0.1:7280/ingest/bbb10b0a-be90-44c9-b1bc-39270d124459', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '7da593' }, body: JSON.stringify({ sessionId: '7da593', location: 'scripts.js:loadLazy:entry', message: 'loadLazy started', data: { mainExists: !!main, headerExists: !!doc.querySelector('header'), footerExists: !!doc.querySelector('footer') }, timestamp: Date.now(), hypothesisId: 'H4' }) }).catch(() => {});
  // #endregion
  if (main) await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));
  // #region agent log
  fetch('http://127.0.0.1:7280/ingest/bbb10b0a-be90-44c9-b1bc-39270d124459', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '7da593' }, body: JSON.stringify({ sessionId: '7da593', location: 'scripts.js:loadLazy:afterSections', message: 'after loadSections', data: { sectionCount: main ? main.querySelectorAll('.section').length : 0 } }, timestamp: Date.now(), hypothesisId: 'H5' }) }).catch(() => {});
  // #endregion

  loadCommerceLazy();

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  /* ARCTIS scroll reveal */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  function observeReveal(container) {
    (container || doc).querySelectorAll('.r').forEach((el) => {
      if (!el.dataset.revealObserved) {
        el.dataset.revealObserved = '1';
        revealObs.observe(el);
      }
    });
  }
  observeReveal(doc);
  if (main) {
    const mo = new MutationObserver(() => observeReveal(main));
    mo.observe(main, { childList: true, subtree: true });
  }
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

(async function loadDa() {
  const usp = new URL(window.location.href).searchParams;
  if (!usp.get('dapreview') && !usp.get('ue-preview')) return;
  const { default: daPreview } = await import('https://da.live/scripts/dapreview.js');
  const { default: uePreview } = await import('../ue/scripts/ue.js');
  daPreview(loadPage, uePreview);
}());
