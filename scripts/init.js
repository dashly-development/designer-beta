// init.js
import { initGridStack } from './gridUtils.js';
import { loadClientConfig, populateSelectors } from './dataManager.js';
import { updateSavedLayouts, updateCurrentLayoutContent, updateHighchartsDataArray } from './chartUtils.js';
import { initializeIndexedDB } from './indexedDBUtils.js';

export function initializeApp() {
  // Initialize IndexedDB before anything else
  initializeIndexedDB()
    .then(database => {
      window.db = database;  // Make sure the global db is set
      console.log('IndexedDB initialized in initializeApp:', window.db);

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
    })
    .catch(error => {
      console.error('Error initializing IndexedDB in initializeApp:', error);
    });
}