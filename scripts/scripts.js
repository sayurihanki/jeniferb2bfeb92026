import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
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
  decorateSections,
  IS_UE,
  IS_DA,
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
    // Check if h1 or picture is already inside a hero block
    if (h1.closest('.hero') || picture.closest('.hero')) {
      return; // Don't create a duplicate hero block
    }
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

function isLandingPage(main) {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const hasCommerceContent = main.querySelector('[class*="commerce-"], .product-details, .product-list-page');
  return pathSegments.length <= 1 && !hasCommerceContent;
}

function hasKeywordSection(main, keywords) {
  const headingMatches = [...main.querySelectorAll('h2, h3')].some((heading) => {
    const text = heading.textContent.toLowerCase();
    return keywords.some((keyword) => text.includes(keyword));
  });
  return headingMatches;
}

function createGeneratedSection(sectionClass) {
  const section = document.createElement('div');
  section.classList.add('landing-generated', sectionClass);
  return section;
}

function createFeaturesSection() {
  const section = createGeneratedSection('landing-features');
  const content = document.createElement('div');
  const intro = document.createElement('div');
  intro.className = 'landing-section-intro';
  intro.innerHTML = `
    <p class="landing-eyebrow">Why teams switch</p>
    <h2>Everything you need to launch and scale faster</h2>
    <p>From first visit to paid conversion, every screen is optimized for clarity, trust, and action.</p>
  `;

  const cardsBlock = document.createElement('div');
  cardsBlock.className = 'cards';
  [
    {
      title: 'Fast setup',
      description: 'Launch your workspace in minutes with prebuilt flows, ready-to-use templates, and smart defaults.',
    },
    {
      title: 'Conversion-first UX',
      description: 'Guide visitors with clear hierarchy, confident messaging, and frictionless calls-to-action.',
    },
    {
      title: 'Built for collaboration',
      description: 'Keep product, design, and marketing aligned with shared workflows and reusable components.',
    },
    {
      title: 'Actionable insights',
      description: 'Track user behavior and campaign impact with simple dashboards your team will actually use.',
    },
  ].forEach((feature) => {
    const row = document.createElement('div');
    const body = document.createElement('div');
    body.innerHTML = `<h3>${feature.title}</h3><p>${feature.description}</p>`;
    row.append(body);
    cardsBlock.append(row);
  });

  content.append(intro, cardsBlock);
  section.append(content);
  return section;
}

function createPricingSection() {
  const section = createGeneratedSection('landing-pricing');
  const content = document.createElement('div');
  content.innerHTML = `
    <div class="landing-section-intro">
      <p class="landing-eyebrow">Pricing</p>
      <h2>Simple plans for every stage</h2>
      <p>Start free, upgrade when your traffic and team grow.</p>
    </div>
    <div class="pricing-grid" id="pricing">
      <article class="pricing-plan">
        <p class="pricing-plan-name">Free</p>
        <p class="pricing-plan-price">$0<span>/month</span></p>
        <ul>
          <li>Up to 1,000 monthly visitors</li>
          <li>Core landing page templates</li>
          <li>Email support</li>
        </ul>
        <p><a class="button secondary" href="#get-started">Get started</a></p>
      </article>
      <article class="pricing-plan pricing-plan-recommended">
        <p class="pricing-badge">Recommended</p>
        <p class="pricing-plan-name">Pro</p>
        <p class="pricing-plan-price">$49<span>/month</span></p>
        <ul>
          <li>Up to 50,000 monthly visitors</li>
          <li>A/B testing and advanced analytics</li>
          <li>Priority chat support</li>
        </ul>
        <p><a class="button" href="#get-started">Start Pro</a></p>
      </article>
      <article class="pricing-plan">
        <p class="pricing-plan-name">Team</p>
        <p class="pricing-plan-price">$129<span>/month</span></p>
        <ul>
          <li>Unlimited projects and seats</li>
          <li>Shared design systems</li>
          <li>Dedicated success manager</li>
        </ul>
        <p><a class="button secondary" href="#get-started">Talk to sales</a></p>
      </article>
    </div>
  `;
  section.append(content);
  return section;
}

function createFaqSection() {
  const section = createGeneratedSection('landing-faq');
  const content = document.createElement('div');
  const intro = document.createElement('div');
  intro.className = 'landing-section-intro';
  intro.innerHTML = `
    <p class="landing-eyebrow">FAQ</p>
    <h2>Questions, answered</h2>
  `;

  const accordion = document.createElement('div');
  accordion.className = 'accordion';
  [
    {
      question: 'Can I upgrade or downgrade at any time?',
      answer: 'Yes. You can change plans at any time and your billing is prorated automatically.',
    },
    {
      question: 'Do you offer a free trial for paid plans?',
      answer: 'Every new Pro and Team account includes a 14-day trial with access to all premium features.',
    },
    {
      question: 'Is this mobile-friendly out of the box?',
      answer: 'Yes. The layout and components are optimized for modern devices, from small screens to large desktops.',
    },
    {
      question: 'What support options are available?',
      answer: 'Free includes email support. Pro adds priority chat. Team includes a dedicated onboarding specialist.',
    },
  ].forEach((item) => {
    const row = document.createElement('div');
    const label = document.createElement('div');
    const body = document.createElement('div');
    label.innerHTML = `<p>${item.question}</p>`;
    body.innerHTML = `<p>${item.answer}</p>`;
    row.append(label, body);
    accordion.append(row);
  });

  content.append(intro, accordion);
  section.append(content);
  return section;
}

function createNewsletterSection() {
  const section = createGeneratedSection('landing-newsletter');
  const content = document.createElement('div');
  content.id = 'get-started';
  content.innerHTML = `
    <div class="newsletter-card">
      <p class="landing-eyebrow">Stay in the loop</p>
      <h2>Get practical growth ideas in your inbox</h2>
      <p>Join product teams and founders receiving one short, actionable email each week.</p>
      <form class="landing-newsletter-form" novalidate>
        <label for="landing-newsletter-email">Work email</label>
        <div class="newsletter-form-row">
          <input id="landing-newsletter-email" type="email" name="email" placeholder="you@company.com" required />
          <button type="submit" class="button">Subscribe</button>
        </div>
        <p class="newsletter-message" aria-live="polite"></p>
      </form>
    </div>
  `;
  section.append(content);
  return section;
}

function ensureLandingSections(main) {
  if (!isLandingPage(main)) return;

  const hasHero = main.querySelector('.hero, h1');
  const hasFeatures = main.querySelector('.cards') || hasKeywordSection(main, ['feature', 'benefit']);
  const hasPricing = main.querySelector('#pricing, .pricing-grid') || hasKeywordSection(main, ['pricing', 'plan']);
  const hasFaq = main.querySelector('.accordion, details') || hasKeywordSection(main, ['faq', 'question']);
  const hasNewsletter = main.querySelector('input[type="email"], .landing-newsletter-form') || hasKeywordSection(main, ['newsletter', 'subscribe']);

  if (!hasHero) {
    const hero = createGeneratedSection('landing-hero-fallback');
    const heroContent = document.createElement('div');
    heroContent.innerHTML = `
      <div class="landing-hero-content">
        <p class="landing-eyebrow">Built for modern teams</p>
        <h1>Design higher-converting landing pages faster</h1>
        <p>Create polished experiences with clear messaging, stronger trust, and better conversion performance.</p>
        <p><a class="button" href="#pricing">See pricing</a></p>
      </div>
    `;
    hero.append(heroContent);
    main.prepend(hero);
  }

  if (!hasFeatures) main.append(createFeaturesSection());
  if (!hasPricing) main.append(createPricingSection());
  if (!hasFaq) main.append(createFaqSection());
  if (!hasNewsletter) main.append(createNewsletterSection());
}

function attachNewsletterHandlers(main) {
  const forms = main.querySelectorAll('.landing-newsletter-form');
  forms.forEach((form) => {
    if (form.dataset.initialized === 'true') return;
    form.dataset.initialized = 'true';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const message = form.querySelector('.newsletter-message');
      if (!emailInput || !message) return;

      if (!emailInput.value || !emailInput.checkValidity()) {
        message.textContent = 'Please enter a valid email address.';
        form.dataset.status = 'error';
        return;
      }

      message.textContent = 'Thanks for subscribing. We will be in touch soon.';
      form.dataset.status = 'success';
      form.reset();
    });
  });
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
    // auto block `*/fragments/*` references
    const fragments = main.querySelectorAll('a[href*="/fragments/"]');
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(frag.firstElementChild);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    if (!main.querySelector('.hero')) buildHeroBlock(main);
    ensureLandingSections(main);
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
  attachNewsletterHandlers(main);
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
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

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

// UE Editor support before page load
if (IS_UE) {
  // eslint-disable-next-line import/no-unresolved
  await import(`${window.hlx.codeBasePath}/scripts/ue.js`).then(({ default: ue }) => ue());
}

loadPage();

(async function loadDa() {
  if (!IS_DA) return;
  // eslint-disable-next-line import/no-unresolved
  import('https://da.live/scripts/dapreview.js').then(({ default: daPreview }) => daPreview(loadPage));
}());
