import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlock,
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
    const pathname = window.location.pathname || '/';
    const isHome = pathname === '/' || pathname === '/index' || pathname === '/index.html';
    if (isHome) return;
    buildHeroBlock(main);
  } catch (error) {
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Removes the legacy homepage hero section so hero-4 can replace it.
 * @param {Element} main The container element
 */
function removeLegacyHomepageHero(main) {
  const pathname = window.location.pathname || '/';
  const isHome = pathname === '/' || pathname === '/index' || pathname === '/index.html';
  if (!isHome) return;

  const firstSection = main.querySelector(':scope > div:first-child');
  if (!firstSection) return;

  const legacyHero = firstSection.querySelector(':scope > .hero');
  if (!legacyHero) return;

  firstSection.remove();
}

function normalizeAuthorHref(href) {
  if (!href) return href;
  try {
    const url = new URL(href, window.location.origin);
    if (url.hostname === 'file+.vscode-resource.vscode-cdn.net') {
      return url.pathname.startsWith('/') ? url.pathname : `/${url.pathname}`;
    }
    return href;
  } catch {
    return href;
  }
}

/**
 * Rebuilds hero-4 as a proper block when homepage content is flattened into paragraphs.
 * @param {Element} main The main element
 */
function normalizeHomepageHero4(main) {
  const pathname = window.location.pathname || '/';
  const isHome = pathname === '/' || pathname === '/index' || pathname === '/index.html';
  if (!isHome) return;

  // If a real hero-4 block is already authored, don’t interfere.
  if (main.querySelector('.hero-4')) return;

  const firstSection = main.querySelector(':scope > div:first-child');
  if (!firstSection) return;

  const cells = [...firstSection.children].filter((el) => el.tagName === 'P');
  if (cells.length < 9) return;
  if (!cells[0].querySelector('picture, img')) return;

  const primaryLink = cells[4]?.querySelector('a');
  const secondaryLink = cells[5]?.querySelector('a');
  if (primaryLink) primaryLink.href = normalizeAuthorHref(primaryLink.getAttribute('href'));
  if (secondaryLink) secondaryLink.href = normalizeAuthorHref(secondaryLink.getAttribute('href'));

  const getCell = (index) => cells[index]?.innerHTML || '';
  const rows = [
    [getCell(0), getCell(1), getCell(2), getCell(3)],
    [getCell(4), getCell(5), getCell(6), getCell(7)],
  ];

  let cursor = 8;
  while (cursor + 2 < cells.length) {
    rows.push([getCell(cursor), getCell(cursor + 1), getCell(cursor + 2)]);
    cursor += 3;
  }

  firstSection.replaceChildren(buildBlock('hero-4', rows));
}

/**
 * Rebuilds hero-4 as a proper block when DA block preview flattens it into paragraphs.
 * @param {Element} main The main element
 */
function normalizeDaHero4Preview(main) {
  const pathname = window.location.pathname || '';
  if (!pathname.startsWith('/.da/blocks/hero-4')) return;

  const section = main.querySelector(':scope > .section');
  if (!section || section.querySelector('.hero-4')) return;

  const contentWrapper = section.querySelector(':scope > .default-content-wrapper');
  if (!contentWrapper) return;

  const cells = [...contentWrapper.children].filter((el) => el.tagName === 'P');
  if (!cells.length || !cells[0].querySelector('picture, img')) return;

  const getCell = (index) => cells[index]?.innerHTML || '';
  const rows = [
    [getCell(0), getCell(1), getCell(2), getCell(3)],
    [getCell(4), getCell(5), getCell(6), getCell(7)],
  ];

  let cursor = 8;
  while (cursor + 2 < cells.length) {
    rows.push([getCell(cursor), getCell(cursor + 1), getCell(cursor + 2)]);
    cursor += 3;
  }

  const wrapper = document.createElement('div');
  wrapper.append(buildBlock('hero-4', rows));
  section.append(wrapper);
  contentWrapper.remove();
}

/**
 * Ensures hero-4 blocks are decorated even when section wrappers are atypical.
 * @param {Element} main The main element
 */
function ensureHero4Blocks(main) {
  const hero4Blocks = main.querySelectorAll('.hero-4');
  hero4Blocks.forEach((block) => {
    if (block.classList.contains('block')) return;
    const hasBlockRows = !!block.querySelector(':scope > div > div');
    if (!hasBlockRows) return;
    decorateBlock(block);
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
export function decorateMain(main) {
  removeLegacyHomepageHero(main);
  normalizeHomepageHero4(main);
  decorateLinks(main);
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  normalizeDaHero4Preview(main);
  decorateBlocks(main);
  ensureHero4Blocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();

  const main = doc.querySelector('main');
  if (main) {
    try {
      await initializeCommerce();
      decorateMain(main);
      applyTemplates(doc);
      await loadCommerceEager();
    } catch (e) {
      console.error('Error initializing commerce configuration:', e);
      loadErrorPage(418);
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
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCommerceLazy();

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
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
