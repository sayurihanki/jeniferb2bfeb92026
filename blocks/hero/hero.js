export default function decorate(block) {
  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  while (block.firstChild) {
    inner.appendChild(block.firstChild);
  }
  block.appendChild(inner);
}
