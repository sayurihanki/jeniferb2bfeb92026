/**
 * ARCTIS theme — injects background glow + custom cursor and runs follow logic.
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectElements();
      initCursor();
    });
  } else {
    injectElements();
    initCursor();
  }
})();
