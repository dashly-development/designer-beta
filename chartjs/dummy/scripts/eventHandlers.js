// eventHandlers.js
import { initCommentMode, initDesignMode, openCommentModal } from './commentUtils.js';
import { handleBusinessAreaChange, handleGenerateChart, handleGenerateClientChart, saveChartName, deleteWidget, clearLayout } from './gridUtils.js';
import { loadLayoutWithCharts, saveLayoutWithCharts, generateRandomSalesCharts } from './chartUtils.js';
import { saveTextLabel, updateDebugContent, highlightSearchTerm, navigateSearchResults, exportGridAsPdf, togglePictureMode } from './uiManager.js';

export function attachEventHandlers() {
    console.log("Attaching event handlers...");

    // Mode switching buttons
    $('#commentModeBtn').on('click', function () {
        console.log("Comment mode button clicked.");
        initCommentMode();
    });
    $('#designModeBtn').on('click', function () {
        console.log("Design mode button clicked.");
        initDesignMode();
    });

    // Modal interactions
    $('#commentModal').on('shown.bs.modal', function () {
        console.log("Comment modal shown.");
        $('#commentInput').focus();
    });

    $('#chartNameModal').on('shown.bs.modal', function () {
        console.log("Chart name modal shown.");
        $('#chartNameInput').focus().off('keypress').on('keypress', function (e) {
            if (e.which === 13) {
                console.log("Chart name input enter key pressed.");
                saveChartName();
                e.preventDefault();
            }
        });
    });

    // Grid interactions
    $('.grid-stack').on('click', function (e) {
        console.log("Grid stack item clicked.");
        openCommentModal(e, this);
    });

    // Business area and chart generation
    $('#businessAreaSelect').on('change', function () {
        console.log("Business area selected.");
        handleBusinessAreaChange();
    });
    $('#generateChartBtn').on('click', function () {
        console.log("Generate chart button clicked.");
        handleGenerateChart();
    });
    $('#generateClientChartBtn').on('click', function () {
        console.log("Generate client chart button clicked.");
        handleGenerateClientChart();
    });
    $('#saveChartName').on('click', function () {
        console.log("Save chart name button clicked.");
        saveChartName();
    });

    // Attach delete event handler
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('delete-widget')) {
            const widget = event.target.closest('.grid-stack-item');
            deleteWidget(widget);
        }
    });

    // Attach clear layout event handler
    $('#clearLayoutBtn').on('click', function () {
        if (confirm('Are you sure you want to clear the layout? This action cannot be undone.')) {
            clearLayout();
        }
    });

    // Attach event handler for the Load button
    $('#loadLayoutBtn').on('click', function () {
        console.log("Load layout button clicked.");

        // Populate the dropdown with saved layouts
        const savedLayouts = JSON.parse(localStorage.getItem('savedLayouts')) || {};
        const layoutDropdown = $('#layoutDropdown');
        layoutDropdown.empty(); // Clear existing options

        if (Object.keys(savedLayouts).length > 0) {
            // Add an initial option
            layoutDropdown.append('<option value="" disabled selected>Select a layout</option>');

            // Add options for each saved layout
            Object.keys(savedLayouts).forEach(layoutName => {
                layoutDropdown.append(`<option value="${layoutName}">${layoutName}</option>`);
            });

            // Show the modal
            $('#loadLayoutModal').modal('show');
        } else {
            alert("No saved layouts found.");
        }
    });

    // Event handler for loading the selected layout
    $('#loadLayoutButton').off('click').on('click', function () {
        const layoutName = $('#layoutDropdown').val();
        if (layoutName) {
            console.log("Loading layout:", layoutName);
            loadLayoutWithCharts(layoutName);
            $('#loadLayoutModal').modal('hide');
        } else {
            alert("Please select a layout.");
        }
    });

    $('#saveLayoutBtn').on('click', function () {
        console.log("Save layout button clicked.");
        saveLayoutWithCharts();
    });

    // Text label
    $('#addTextLabelBtn').on('click', function () {
        console.log("Add text label button clicked.");
        $('#textLabelModal').modal('show');
    });
    $('#saveTextLabelBtn').on('click', function () {
        console.log("Save text label button clicked.");
        saveTextLabel();
    });

    // Generate random sales charts
    $('#generateRandomChartsBtn').on('click', function () {
        console.log("Generate random sales charts button clicked.");
        generateRandomSalesCharts();
    });

    // Debugging
    $('#debugBtn').on('click', function () {
        console.log("Debug button clicked.");
        $('#debugModal').modal('show');
        updateDebugContent();
    });

    // Clear local storage
    $('#clearLocalStorageBtn').on('click', function () {
        console.log("Clear local storage button clicked.");
        localStorage.clear();
        updateDebugContent();
    });

    // Search functionality
    $('#searchBox').on('input', function () {
        const searchTerm = $(this).val().toLowerCase();
        console.log("Search input:", searchTerm);
        if (searchTerm) {
            highlightSearchTerm(searchTerm);
        } else {
            console.log("Search term cleared.");
            $('#localStorageContent').html($('#localStorageContent').text()); // Remove highlights
            $('#searchCounter').text('');
        }
    });

    $('#searchBox').on('keydown', function (e) {
        if (e.key === 'Enter') {
            console.log("Search box enter key pressed.");
            navigateSearchResults();
        }
    });

    // Attach the event handler for the Export PDF button
    document.getElementById('exportPdfBtn').addEventListener('click', exportGridAsPdf);

    console.log("Event handlers attached.");

    // Event listener for the "Picture" button
    document.getElementById('pictureModeBtn').addEventListener('click', togglePictureMode);
}