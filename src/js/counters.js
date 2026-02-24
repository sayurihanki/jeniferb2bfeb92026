export function countUp(el, target, dur) {
  if (!el) return;
  const t0 = performance.now();
  function step(t) {
    const p = Math.min((t - t0) / dur, 1);
    const ease = 1 - (1 - p) ** 3;
    el.textContent = Math.round(ease * target).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function initCounters() {
  setTimeout(() => {
    countUp(document.getElementById('s1'), 4200, 1800);
    countUp(document.getElementById('s2'), 98, 1500);
    countUp(document.getElementById('s3'), 37, 1200);
    countUp(document.getElementById('s4'), 850, 1800);
  }, 1200);
}

/** Live temp ticker for #heroTemp and #featTemp */
export function initLiveTemp() {
  let base = 68.4;
  const ids = ['heroTemp', 'featTemp'];
  setInterval(() => {
    base += (Math.random() - 0.5) * 0.2;
    base = Math.max(67.8, Math.min(69.2, base));
    const v = base.toFixed(1);
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.textContent = v;
    });
  }, 3000);
}
