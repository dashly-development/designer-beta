// indexedDBUtils.js

const DB_NAME = 'DashboardDesignerDB';
const DB_VERSION = 1;
const STORE_NAME = 'layouts';

export function initializeIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'layoutName' });
                console.log('Object store created');
            }
        };

        request.onsuccess = function (event) {
            console.log('IndexedDB initialized successfully');
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            console.error('Error initializing IndexedDB:', event.target.error);
            reject(event.target.error);
        };
    });
}

export function saveLayoutToIndexedDB(db, layoutName, data) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        // Clean the layout data to remove non-serializable items (like functions)
        const cleanedData = deepCloneAndSanitize(data);

        const request = store.put({
            layoutName: layoutName,
            layout: cleanedData.layout,
            highchartsDataArray: cleanedData.highchartsDataArray,
            gridItemDimensions: cleanedData.gridItemDimensions,
            comments: cleanedData.comments,
        });

        request.onsuccess = function () {
            console.log(`Layout "${layoutName}" saved successfully.`);
            resolve();
        };

        request.onerror = function (event) {
            console.error(`Error saving layout "${layoutName}":`, event.target.error);
            reject(event.target.error);
        };
    });
}

function deepCloneAndSanitize(obj) {
    // This function clones the object and removes non-serializable data like functions
    return JSON.parse(JSON.stringify(obj, function (key, value) {
        if (typeof value === 'function') {
            return undefined; // Remove functions from the object
        }
        return value; // Keep serializable data
    }));
}

export function loadLayoutFromIndexedDB(db, layoutName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(layoutName);

        request.onsuccess = function (event) {
            if (event.target.result) {
                console.log(`Layout "${layoutName}" loaded successfully.`);
                resolve(event.target.result);
            } else {
                reject(`Layout "${layoutName}" not found.`);
            }
        };

        request.onerror = function (event) {
            console.error(`Error loading layout "${layoutName}":`, event.target.error);
            reject(event.target.error);
        };
    });
}

export function getAllLayouts(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            console.error('Error fetching all layouts:', event.target.error);
            reject(event.target.error);
        };
    });
}

export function deleteLayoutFromIndexedDB(db, layoutName) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(layoutName);

        request.onsuccess = function () {
            console.log(`Layout "${layoutName}" deleted successfully.`);
            resolve();
        };

        request.onerror = function (event) {
            console.error(`Error deleting layout "${layoutName}":`, event.target.error);
            reject(event.target.error);
        };
    });
}

export function clearIndexedDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = function (event) {
            const db = event.target.result;
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(STORE_NAME);

            const clearRequest = objectStore.clear();
            clearRequest.onsuccess = function () {
                console.log('IndexedDB storage cleared.');
                resolve();
            };

            clearRequest.onerror = function (event) {
                console.error('Error clearing IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        };

        request.onerror = function (event) {
            console.error('Error opening IndexedDB:', event.target.error);
            reject(event.target.error);
        };
    });
}
