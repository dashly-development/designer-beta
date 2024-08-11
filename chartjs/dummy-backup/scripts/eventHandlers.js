// eventHandlers.js
import { initCommentMode, initDesignMode, openCommentModal } from './commentUtils.js';
import { handleBusinessAreaChange, handleGenerateChart, handleGenerateClientChart, saveChartName } from './gridUtils.js';
import { loadLayoutWithCharts, saveLayoutWithCharts } from './chartUtils.js';
import { saveTextLabel, updateDebugContent, highlightSearchTerm, navigateSearchResults } from './uiManager.js';
import { generateRandomSalesCharts } from './chartUtils.js';

export function attachEventHandlers() {
    console.log("Attaching event handlers...");

    // Mode switching buttons
    $('#commentModeBtn').on('click', function() {
        console.log("Comment mode button clicked.");
        initCommentMode();
    });
    $('#designModeBtn').on('click', function() {
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
    $('#businessAreaSelect').on('change', function() {
        console.log("Business area selected.");
        handleBusinessAreaChange();
    });
    $('#generateChartBtn').on('click', function() {
        console.log("Generate chart button clicked.");
        handleGenerateChart();
    });
    $('#generateClientChartBtn').on('click', function() {
        console.log("Generate client chart button clicked.");
        handleGenerateClientChart();
    });
    $('#saveChartName').on('click', function() {
        console.log("Save chart name button clicked.");
        saveChartName();
    });

    // Layout management
    $('#loadLayoutBtn').on('click', function () {
        console.log("Load layout button clicked.");
        const layoutName = prompt("Enter layout name to load:");
        if (layoutName) {
            console.log("Loading layout:", layoutName);
            loadLayoutWithCharts(layoutName);
        }
    });
    $('#saveLayoutBtn').on('click', function() {
        console.log("Save layout button clicked.");
        saveLayoutWithCharts();
    });

    // Text label
    $('#addTextLabelBtn').on('click', function () {
        console.log("Add text label button clicked.");
        $('#textLabelModal').modal('show');
    });
    $('#saveTextLabelBtn').on('click', function() {
        console.log("Save text label button clicked.");
        saveTextLabel();
    });

    // Generate random sales charts
    $('#generateRandomChartsBtn').on('click', function() {
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

    console.log("Event handlers attached.");
}