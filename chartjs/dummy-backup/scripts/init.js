// init.js
import { initGridStack } from './gridUtils.js';
import { loadClientConfig, populateSelectors } from './dataManager.js';
import { updateSavedLayouts, updateCurrentLayoutContent, updateHighchartsDataArray } from './chartUtils.js';

export function initializeApp() {
  // Initialize GridStack
  initGridStack();

  // Load client configuration
  loadClientConfig().then(configData => {
    if (configData) {
      populateSelectors(configData);
    } else {
      console.error('Configuration data is empty or undefined.');
    }
  });

  // Initial UI updates
  updateSavedLayouts();
  updateCurrentLayoutContent();
  updateHighchartsDataArray();
}