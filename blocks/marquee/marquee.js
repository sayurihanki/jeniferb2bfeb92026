export default function decorate(block) {
  const rows = [...block.children];
  const text = rows.length ? rows.map((row) => row.textContent.trim()).filter(Boolean).join(' · ') : 'Industrial HVAC · Precision Cooling · Certified';
  const strip = document.createElement('div');
  strip.className = 'marquee-strip';
  const inner = document.createElement('div');
  inner.className = 'marquee-inner';
  const parts = text.split(' · ').join(' · ');
  for (let i = 0; i < 4; i += 1) {
    const seg = document.createElement('span');
    seg.className = 'm-seg';
    seg.textContent = parts;
    inner.appendChild(seg);
  }
  strip.appendChild(inner);
  block.textContent = '';
  block.appendChild(strip);
}
