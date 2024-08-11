// debugUtils.js

export function updateDebugContent() {
    console.log("Updating debug content...");
    let formattedLocalStorage = {};

    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            try {
                formattedLocalStorage[key] = JSON.parse(localStorage.getItem(key));
                console.log(`Parsed localStorage item: key=${key}`, formattedLocalStorage[key]);
            } catch (e) {
                formattedLocalStorage[key] = localStorage.getItem(key);
                console.warn(`Error parsing localStorage item: key=${key}`, e);
            }
        }
    }

    console.log("Formatted localStorage data ready for display:", formattedLocalStorage);
    showDebugContent(formattedLocalStorage);
}