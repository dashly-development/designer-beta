// main.js
import { initializeApp } from './init.js';
import { attachEventHandlers } from './eventHandlers.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    attachEventHandlers();
});

// Debug console functionality
(function () {
    const debugConsole = document.getElementById('debugConsole');
    const logContent = debugConsole.querySelector('.log-content');

    // Helper function to format the log entry
    function formatLog(message, type, source) {
        const logEntry = document.createElement('div');
        logEntry.classList.add('log-entry', type);
        logEntry.innerHTML = `<span class="log-source">${source}</span>: ${message}`;
        return logEntry;
    }

    // Override console methods
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = function (...args) {
        originalLog.apply(console, args);
        logContent.appendChild(formatLog(args.join(' '), 'log', getLogSource()));
    };

    console.warn = function (...args) {
        originalWarn.apply(console, args);
        logContent.appendChild(formatLog(args.join(' '), 'warn', getLogSource()));
    };

    console.error = function (...args) {
        originalError.apply(console, args);
        logContent.appendChild(formatLog(args.join(' '), 'error', getLogSource()));
    };

    // Function to get the source of the log (file and line number)
    function getLogSource() {
        const error = new Error();
        if (error.stack) {
            const stack = error.stack.split('\n');
            if (stack[3]) {
                return stack[3].trim();
            }
        }
        return '';
    }

    // Toggle debug console visibility
    document.getElementById('debugToggleBtn').addEventListener('click', function () {
        debugConsole.style.display = debugConsole.style.display === 'none' ? 'block' : 'none';
    });

    // Clear logs
    document.getElementById('clearLogsBtn').addEventListener('click', function () {
        logContent.innerHTML = '';
    });

    // Filter logs
    document.getElementById('filterLogsInput').addEventListener('input', function (e) {
        const filter = e.target.value.toLowerCase();
        document.querySelectorAll('.log-entry').forEach(entry => {
            entry.style.display = entry.textContent.toLowerCase().includes(filter) ? '' : 'none';
        });
    });
})();

function toggleLogDetail(element) {
    const detail = element.nextElementSibling;
    if (detail.style.display === 'none' || detail.style.display === '') {
        detail.style.display = 'block';
        element.textContent = '[-]';
    } else {
        detail.style.display = 'none';
        element.textContent = '[+]';
    }
}

// Function to initialize the custom console log system
function initializeCustomConsole() {
    document.addEventListener('DOMContentLoaded', function() {
        // Ensure the DOM is fully loaded before adding event listeners
        
        // Event listeners for filter icons
        document.querySelectorAll('.filter-icon').forEach(icon => {
            icon.addEventListener('click', function() {
                setFilterType(this.dataset.type);
            });
        });

        // Dynamic event listener for log object summary to expand/collapse details
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('log-object-summary')) {
                toggleLogDetail(event.target);
            }
        });
    });

    // Global variable to keep track of the current filter type
    let currentFilterType = 'all'; // Default to showing all logs

    // Counters for each log type
    let logCount = 0;
    let warnCount = 0;
    let errorCount = 0;
    let logCountTop = 0;
    let warnCountTop = 0;
    let errorCountTop = 0;

    // Function to set the active filter type and apply the filter
    function setFilterType(type) {
        currentFilterType = type;
        document.querySelectorAll('.filter-icon').forEach(icon => {
            icon.classList.toggle('active', icon.dataset.type === type);
        });
        filterLogs(type);
    }

    // Function to filter displayed logs based on the selected filter type
    function filterLogs(type) {
        document.querySelectorAll('.log-entry').forEach(entry => {
            entry.style.display = (type === 'all' || entry.classList.contains(type)) ? '' : 'none';
        });
    }

    // Function to format log messages, including handling objects and arrays
    function formatLogMessage(args) {
        try {
            const stack = new Error().stack;
            const stackLine = stack.split('\n')[2].trim();
            const fileInfo = stackLine.match(/\((.*):(\d+):(\d+)\)$/);

            if (fileInfo) {
                const [ , filePath, line, column ] = fileInfo;
                const fileName = filePath.split('/').pop();
                return {
                    source: `at console.log (${fileName}:${line}:${column})`,
                    message: args.map(arg => formatLogArg(arg)).join(' ')
                };
            }
        } catch (e) {
            return {
                source: '',
                message: args.map(arg => formatLogArg(arg)).join(' ')
            };
        }
        return {
            source: '',
            message: args.map(arg => formatLogArg(arg)).join(' ')
        };
    }

    // Function to format individual arguments, including handling circular structures
    function formatLogArg(arg) {
        if (typeof arg === 'object' && arg !== null) {
            try {
                return `
                    <span class="log-object">
                        <span class="log-object-summary">[+]</span>
                        <span class="log-object-detail" style="display:none;">${safeStringify(arg)}</span>
                    </span>`;
            } catch (e) {
                return `<span class="log-object">[Circular]</span>`;
            }
        }
        return arg;
    }

    // Custom function to safely stringify objects, handling circular references
    function safeStringify(obj, replacer = null, space = 2) {
        const cache = new Set();
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.has(value)) {
                    return '[Circular]';
                }
                cache.add(value);
            }
            return value;
        }, space);
    }

    // Function to update the log counts in the UI
    function updateLogCounts() {
        document.getElementById('logCount').textContent = logCount;
        document.getElementById('warnCount').textContent = warnCount;
        document.getElementById('errorCount').textContent = errorCount;
        document.getElementById('logCountTop').textContent = logCountTop;
        document.getElementById('warnCountTop').textContent = warnCountTop;
        document.getElementById('errorCountTop').textContent = errorCountTop;
    }

    // Override console methods to capture and display logs
    (function() {
        const logContent = document.querySelector('.log-content');
        
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        function appendLog({source, message}, type) {
            const logEntry = document.createElement('div');
            logEntry.classList.add('log-entry', type);
            
            const logSource = document.createElement('span');
            logSource.classList.add('log-source');
            logSource.innerHTML = source;
            
            logEntry.appendChild(logSource);
            logEntry.insertAdjacentHTML('beforeend', message);

            // Update counters based on log type
            if (type === 'log') logCount++;
            if (type === 'warn') warnCount++;
            if (type === 'error') errorCount++;
            // Update counters based on log type
            if (type === 'log') logCountTop++;
            if (type === 'warn') warnCountTop++;
            if (type === 'error') errorCountTop++;

            updateLogCounts();

            logContent.appendChild(logEntry);
            logContent.scrollTop = logContent.scrollHeight; // Scroll to the bottom

            // Reapply the last active filter to ensure consistency
            filterLogs(currentFilterType);
        }

        console.log = function(...args) {
            const formattedMessage = formatLogMessage(args);
            appendLog(formattedMessage, 'log');
        };

        console.warn = function(...args) {
            const formattedMessage = formatLogMessage(args);
            appendLog(formattedMessage, 'warn');
        };

        console.error = function(...args) {
            const formattedMessage = formatLogMessage(args);
            appendLog(formattedMessage, 'error');
        };

        // Capture unhandled errors
        window.onerror = function(message, source, lineno, colno, error) {
            console.error(`${message} at ${source}:${lineno}:${colno}`);
            return false; // Let the browser display the error
        };
    })();
}

// Initialize the custom console log system
initializeCustomConsole();