import '../scss/main.scss';
import { initCursor } from './cursor.js';
import { initCounters, initLiveTemp } from './counters.js';
import { initReveal } from './reveal.js';

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initCounters();
  initLiveTemp();
  initReveal();
});
