// main.js
import { initializeApp } from './init.js';
import { attachEventHandlers } from './eventHandlers.js';

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  attachEventHandlers();
});