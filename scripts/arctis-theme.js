/**
 * ARCTIS theme — injects background glow + custom cursor, scroll reveal, and follow logic.
 */
(function initArctisTheme() {
  function injectElements() {
    if (document.getElementById('arctis-bg-glow')) return;

    const glow = document.createElement('div');
    glow.id = 'arctis-bg-glow';
    glow.className = 'arctis-bg-glow';
    document.body.prepend(glow);

    const dot = document.createElement('div');
    dot.id = 'arctis-dot';
    document.body.appendChild(dot);

    const ring = document.createElement('div');
    ring.id = 'arctis-ring';
    document.body.appendChild(ring);
  }

  function initCursor() {
    const dot = document.getElementById('arctis-dot');
    const ring = document.getElementById('arctis-ring');
    if (!dot || !ring) return;

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    });

    function anim() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      requestAnimationFrame(anim);
    }
    requestAnimationFrame(anim);
  }

  function initScrollReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = document.querySelectorAll('main > .section');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    sections.forEach((s) => {
      if (!s.classList.contains('revealed')) {
        s.classList.add('arctis-reveal');
        obs.observe(s);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectElements();
      initCursor();
      initScrollReveal();
    });
  } else {
    injectElements();
    initCursor();
    initScrollReveal();
  }
})();
