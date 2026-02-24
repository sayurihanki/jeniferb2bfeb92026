export default function decorate(block) {
  const rows = [...block.children];
  const layout = document.createElement('div');
  layout.className = 'feat-layout';

  const left = document.createElement('div');
  left.className = 'r';
  const tag = rows[0]?.children[0]?.textContent?.trim();
  const title = rows[0]?.children[1]?.innerHTML?.trim() || '';
  if (tag) {
    const tagEl = document.createElement('div');
    tagEl.className = 'sec-tag';
    tagEl.style.marginBottom = '18px';
    tagEl.textContent = tag;
    left.appendChild(tagEl);
  }
  if (title) {
    const h2 = document.createElement('h2');
    h2.className = 'sec-h';
    h2.style.marginBottom = '48px';
    h2.innerHTML = title;
    left.appendChild(h2);
  }

  const monitor = document.createElement('div');
  monitor.className = 'monitor-glass';
  monitor.innerHTML = `
    <div class="mg-bar">
      <div class="mg-dot"></div><div class="mg-dot"></div><div class="mg-dot"></div>
      <span class="mg-label">Live System Monitor — Zone Alpha</span>
    </div>
    <div class="mg-body">
      <div class="mg-readout">
        <span class="mg-temp-n" id="featTemp">68.4</span>
        <span class="mg-temp-u">°F</span>
      </div>
      <div class="mg-zone">Supply Air Temperature · Zone Alpha</div>
      <div class="mg-split"></div>
      <div class="mg-metrics">
        <div class="mg-metric">
          <div class="mg-mh"><span class="mg-mn">Cooling load</span><span class="mg-mv">87%</span></div>
          <div class="mg-bg"><div class="mg-fill mgf-a" style="width:87%"></div></div>
        </div>
        <div class="mg-metric">
          <div class="mg-mh"><span class="mg-mn">Heat rejection</span><span class="mg-mv">31%</span></div>
          <div class="mg-bg"><div class="mg-fill mgf-b" style="width:31%"></div></div>
        </div>
        <div class="mg-metric">
          <div class="mg-mh"><span class="mg-mn">Airflow CFM</span><span class="mg-mv">74%</span></div>
          <div class="mg-bg"><div class="mg-fill mgf-c" style="width:74%"></div></div>
        </div>
        <div class="mg-metric">
          <div class="mg-mh"><span class="mg-mn">Compressor</span><span class="mg-mv">56%</span></div>
          <div class="mg-bg"><div class="mg-fill mgf-d" style="width:56%"></div></div>
        </div>
      </div>
    </div>
    <div class="mg-footer">
      <span class="mg-ok"><span class="live-dot"></span> All systems nominal</span>
      <span class="mg-zones">12 active zones</span>
    </div>
  `;
  left.appendChild(monitor);

  const list = document.createElement('div');
  list.className = 'feat-list r d2';
  for (let i = 1; i < rows.length; i += 1) {
    const [num, featTitle, body, featTag] = [...rows[i].children].map((c) => c?.textContent?.trim() || '');
    if (!featTitle) continue;
    const item = document.createElement('div');
    item.className = 'feat-item';
    item.innerHTML = `
      <div class="feat-num">${String(i).padStart(2, '0')}</div>
      <div>
        <div class="feat-title">${featTitle}</div>
        ${body ? `<div class="feat-body">${body}</div>` : ''}
        ${featTag ? `<span class="feat-tag">${featTag}</span>` : ''}
      </div>
    `;
    list.appendChild(item);
  }

  layout.appendChild(left);
  layout.appendChild(list);
  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.appendChild(layout);
  block.textContent = '';
  block.appendChild(wrap);
}
