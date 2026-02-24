/**
 * ARCTIS runtime: global atmosphere, cursor, reveal choreography, and accessibility guards.
 */
(function initArctisTheme() {
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = () => window.matchMedia('(pointer: coarse)').matches || !window.matchMedia('(hover: hover)').matches;
  const observedTargets = new WeakSet();
  let revealObserver;

  function injectElements() {
    if (!document.getElementById('arctis-bg-glow')) {
      const glow = document.createElement('div');
      glow.id = 'arctis-bg-glow';
      glow.className = 'arctis-bg-glow';
      document.body.prepend(glow);
    }

    if (!document.getElementById('arctis-dot')) {
      const dot = document.createElement('div');
      dot.id = 'arctis-dot';
      document.body.appendChild(dot);
    }

    if (!document.getElementById('arctis-ring')) {
      const ring = document.createElement('div');
      ring.id = 'arctis-ring';
      document.body.appendChild(ring);
    }

    if (!document.getElementById('arctis-touch-ripple')) {
      const ripple = document.createElement('div');
      ripple.id = 'arctis-touch-ripple';
      document.body.appendChild(ripple);
    }
  }

  function injectSkipLink() {
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main-content';

    if (!document.querySelector('a.arctis-skip-link')) {
      const skip = document.createElement('a');
      skip.href = '#main-content';
      skip.className = 'arctis-skip-link';
      skip.textContent = 'Skip to main content';
      document.body.insertBefore(skip, document.body.firstChild);
    }
  }

  function initCursor() {
    const dot = document.getElementById('arctis-dot');
    const ring = document.getElementById('arctis-ring');
    const ripple = document.getElementById('arctis-touch-ripple');
    if (!dot || !ring || !ripple) return;

    if (prefersReducedMotion()) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      ripple.style.display = 'none';
      return;
    }

    if (isCoarsePointer()) {
      dot.style.display = 'none';
      ring.style.display = 'none';

      document.addEventListener('touchstart', (event) => {
        const touch = event.touches?.[0];
        if (!touch) return;

        ripple.style.left = `${touch.clientX}px`;
        ripple.style.top = `${touch.clientY}px`;
        ripple.classList.remove('is-active');

        requestAnimationFrame(() => {
          ripple.classList.add('is-active');
        });

        window.setTimeout(() => ripple.classList.remove('is-active'), 420);
      }, { passive: true });
      return;
    }

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    document.addEventListener('mousemove', (event) => {
      mx = event.clientX;
      my = event.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });

    function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      requestAnimationFrame(animateRing);
    }

    requestAnimationFrame(animateRing);
  }

  function collectRevealTargets(root = document) {
    const selectors = [
      'main > .section',
      'main .block',
      'main [class^="commerce-"]',
      'main [class*=" commerce-"]',
      'main .cards > ul > li',
      'main .cards-list > ul > li',
      'main .cards-circular > ul > li',
      'main .luxury-events-card',
      'main .product-recommendations .product-grid-item',
      'main .footer-column',
    ];

    const targets = root.querySelectorAll(selectors.join(', '));
    targets.forEach((node, index) => {
      if (!node.hasAttribute('data-arctis-reveal')) {
        node.setAttribute('data-arctis-reveal', '');
      }

      if (!node.hasAttribute('data-arctis-stagger')) {
        node.setAttribute('data-arctis-stagger', String((index % 6) + 1));
      }
    });

    return targets;
  }

  function revealAllImmediately() {
    document.querySelectorAll('[data-arctis-reveal]').forEach((node) => {
      node.classList.add('arctis-visible');
      if (revealObserver) revealObserver.unobserve(node);
    });
  }

  function initRevealObserver() {
    const targets = collectRevealTargets();

    if (prefersReducedMotion() || typeof window.IntersectionObserver === 'undefined') {
      revealAllImmediately();
      return;
    }

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('arctis-visible');
        revealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -44px 0px',
    });

    targets.forEach((target) => {
      if (observedTargets.has(target)) return;
      observedTargets.add(target);
      revealObserver.observe(target);
    });

    // Safety valve so no element remains hidden on observer edge cases.
    window.setTimeout(revealAllImmediately, 2400);

    const main = document.querySelector('main');
    if (!main) return;

    const observer = new MutationObserver((mutations) => {
      const addedElementNodes = mutations.some((mutation) => [...mutation.addedNodes].some((n) => n.nodeType === 1));
      if (!addedElementNodes) return;

      const newTargets = collectRevealTargets(main);
      newTargets.forEach((target) => {
        if (target.classList.contains('arctis-visible')) return;
        if (observedTargets.has(target)) return;
        observedTargets.add(target);
        revealObserver.observe(target);
      });

      window.setTimeout(revealAllImmediately, 2200);
    });

    observer.observe(main, {
      subtree: true,
      childList: true,
    });
  }

  function addLazyShimmerClass() {
    const candidates = document.querySelectorAll(
      '.cards > ul > li, .cards-list > ul > li, .cards-circular > ul > li, .product-recommendations .product-grid-item, .luxury-events-card, [class^="commerce-"] .dropin-card, [class*=" commerce-"] .dropin-card'
    );

    candidates.forEach((item) => item.classList.add('arctis-lazy-shimmer'));
  }

  function init() {
    injectElements();
    injectSkipLink();
    initCursor();
    initRevealObserver();
    addLazyShimmerClass();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
