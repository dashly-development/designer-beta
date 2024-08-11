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

export function exportGridAsPdf() {
    console.log("Exporting grid as PDF...");

    const gridElement = document.querySelector('.grid-stack');
    if (!gridElement) {
        console.error('Grid element not found!');
        return;
    }

    console.log('Grid element found, proceeding to render...');

    // Reflow Highcharts charts to ensure they are fully rendered
    Highcharts.charts.forEach((chart, index) => {
        if (chart) {
            chart.reflow();
            console.log(`Reflowed chart at index ${index}`);
        }
    });

    // Hide unwanted elements (e.g., delete buttons, other UI elements)
    document.querySelectorAll('.grid-stack .unwanted-element').forEach(el => el.style.display = 'none');

    // Prompt user for filename
    const fileName = prompt("Enter a name for the exported PDF file:", "grid-export");
    if (!fileName) {
        console.log('Export cancelled by user.');
        return;
    }

    domtoimage.toPng(gridElement, {
        quality: 0.95,
        width: gridElement.offsetWidth,
        height: gridElement.offsetHeight
    })
        .then((dataUrl) => {
            console.log('Image data URL created');
            const img = new Image();
            img.src = dataUrl;

            img.onload = function () {
                console.log('Image loaded, creating PDF...');
                const pdf = new window.jspdf.jsPDF('l', 'pt', [img.width, img.height]);
                pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
                pdf.save(`${fileName}.pdf`);
                console.log('PDF saved successfully');

                // Restore visibility of elements after rendering
                document.querySelectorAll('.grid-stack .unwanted-element').forEach(el => el.style.display = '');
            };

            img.onerror = function (error) {
                console.error('Image failed to load:', error);
            };
        })
        .catch((error) => {
            console.error('Error capturing grid as image:', error);
        });
}

// Toggle Picture Mode
export function togglePictureMode() {
    const gridStack = document.querySelector('.grid-stack');
    const pictureModeBtn = document.getElementById('pictureModeBtn');
    const commentIcons = document.querySelectorAll('.comment-icon');

    console.log("Toggling Picture Mode");
    if (!gridStack.classList.contains('picture-mode')) {
        console.log("Entering Picture Mode");

        // Add picture mode class
        gridStack.classList.add('picture-mode');

        // Add pressed state to button
        pictureModeBtn.classList.add('active');
        pictureModeBtn.style.backgroundColor = '#4a34c2';  // Secondary purple color
        pictureModeBtn.style.color = '#ffffff';  // White text color

        // Check the contents of window.comments
        console.log("window.comments data:", window.comments);

        // Show all comments in Picture Mode
        commentIcons.forEach(icon => {
            const commentPopup = icon.querySelector('.comment-popup');
            const commentId = icon.getAttribute('data-id');

            console.log(`Processing comment icon with ID: ${commentId}`);

            if (commentPopup) {
                const comment = window.comments.find(c => c.id.toString() === commentId); // Ensure IDs match as strings

                if (comment) {
                    console.log(`Found comment for ID ${commentId}: ${comment.text}`);
                    commentPopup.textContent = comment.text; // Set the comment text
                    commentPopup.style.display = 'block'; // Make it visible
                } else {
                    console.log(`No comment found for ID ${commentId}`);
                }
            } else {
                console.log(`No comment popup found for icon with ID: ${commentId}`);
            }
        });
        console.log("Comments made visible");

        // Show the screenshot button
        showScreenshotButton();

    } else {
        console.log("Exiting Picture Mode");

        // Remove picture mode class
        gridStack.classList.remove('picture-mode');

        // Remove pressed state from button
        pictureModeBtn.classList.remove('active');
        pictureModeBtn.style.backgroundColor = '';  // Reset to default
        pictureModeBtn.style.color = '';  // Reset to default

        // Hide comments when exiting Picture Mode
        commentIcons.forEach(icon => {
            const commentPopup = icon.querySelector('.comment-popup');
            if (commentPopup) {
                commentPopup.style.display = 'none'; // Hide the popups
            }
        });
        console.log("Comments hidden");

        // Hide the screenshot button
        hideScreenshotButton();
    }
}

// Show screenshot button modal
export function showScreenshotButton() {
    console.log("Showing screenshot button");
    const screenshotBtn = document.createElement('div');
    screenshotBtn.id = 'screenshotBtn';
    screenshotBtn.innerHTML = `<button class="btn btn-secondary">Screenshot 📷</button>`;

    screenshotBtn.style.position = 'fixed';
    screenshotBtn.style.bottom = '20px';
    screenshotBtn.style.right = '20px';
    screenshotBtn.style.zIndex = '1000';
    document.body.appendChild(screenshotBtn);

    screenshotBtn.addEventListener('click', takeScreenshot);
}

// Hide screenshot button modal
export function hideScreenshotButton() {
    console.log("Hiding screenshot button");
    const screenshotBtn = document.getElementById('screenshotBtn');
    if (screenshotBtn) {
        screenshotBtn.remove();
    }
}

// Function to take a screenshot
export function takeScreenshot() {
    console.log("Taking screenshot");
    const gridStack = document.querySelector('.grid-stack');
    html2canvas(gridStack).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = prompt("Enter screenshot name:", "screenshot") + '.png';
        link.click();
    }).catch(error => {
        console.error("Error taking screenshot:", error);
    });
}

// Event listener for the "Picture" button
document.getElementById('pictureModeBtn').addEventListener('click', togglePictureMode);