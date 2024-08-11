// uiManager.js
import { updateCurrentLayoutContent } from './chartUtils.js';

export function updateDebugContent() {
    console.log("Updating debug content...");
    let formattedLocalStorage = {};

    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            try {
                formattedLocalStorage[key] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
                formattedLocalStorage[key] = localStorage.getItem(key);
                console.error(`Error parsing localStorage item with key ${key}:`, e);
            }
        }
    }

    console.log("Formatted local storage data:", formattedLocalStorage);
    $('#localStorageContent').text(JSON.stringify(formattedLocalStorage, null, 2));
}

export function highlightSearchTerm(searchTerm) {
    console.log("Highlighting search term:", searchTerm);
    const contentElement = $('#localStorageContent');
    const contentText = contentElement.text().toLowerCase();
    const originalText = contentElement.text();

    const searchResults = [];
    let searchTextIndex = contentText.indexOf(searchTerm);
    while (searchTextIndex !== -1) {
        searchResults.push({
            index: searchTextIndex,
            text: originalText.substring(searchTextIndex, searchTextIndex + searchTerm.length)
        });
        searchTextIndex = contentText.indexOf(searchTerm, searchTextIndex + searchTerm.length);
    }

    if (searchResults.length > 0) {
        console.log(`${searchResults.length} results found.`);
        contentElement.html(originalText.replace(new RegExp(searchTerm, 'gi'), (match) => `<mark>${match}</mark>`));
        $('#searchCounter').text(`${searchResults.length} results found`);
        $('#noResults').hide();
    } else {
        console.log('No results found.');
        $('#searchCounter').text('No results found');
    }
}

export function navigateSearchResults() {
    console.log("Navigating search results...");
    let currentSearchIndex = 0;
    const searchResults = $('#localStorageContent mark');

    if (searchResults.length > 0) {
        if (currentSearchIndex < 0 || currentSearchIndex >= searchResults.length) {
            currentSearchIndex = 0;
        }
        searchResults.removeClass('current');
        const currentMark = $(searchResults[currentSearchIndex]);
        console.log("Highlighting result at index:", currentSearchIndex);
        currentMark.addClass('current');
        currentMark.get(0).scrollIntoView({ behavior: 'smooth', block: 'center' });
        currentSearchIndex++;
    }
}

export function saveTextLabel() {
    console.log("Saving text label...");
    const text = $('#textLabelInput').val();
    const size = $('#textSizeSelect').val();

    if (!text) {
        alert("Please enter text.");
        console.log("Text label not saved; no text entered.");
        return;
    }

    console.log("Text entered:", text);
    console.log("Text size:", size);

    const textLabelHtml = `
        <div class="grid-stack-item" gs-w="2" gs-h="5">
            <div class="grid-stack-item-content" style="padding: 12px; padding-left: 24px; text-align: left;">
                <${size}>${text}</${size}>
            </div>
        </div>
    `;

    const el = $(textLabelHtml).get(0);
    $('#textLabelModal').modal('hide');
    $('#textLabelInput').val('');

    console.log("Adding text label to grid...");
    window.grid.addWidget(el, {
        width: 2,
        height: 5,
        autoPosition: true
    });

    console.log("Text label added to grid.");
    updateCurrentLayoutContent();
}