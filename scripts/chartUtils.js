import { renderComment } from './commentUtils.js';

window.highchartsDataArray = []; // Ensure highchartsDataArray is initialized

export function generateHighcharts(container, type, chartData, showTitle = true, title = '', highchartsId = null) {
    console.log('Generating Highcharts...', { containerId: container.id, type, chartData, showTitle, title });
    let categories = [];
    let series = [];

    if (type === 'solidgauge') {
        console.log('Generating a solidgauge chart.');
        const gaugeOptions = {
            chart: {
                type: 'solidgauge',
                renderTo: container.id,
                backgroundColor: '#ffffff'
            },
            title: {
                text: showTitle ? title : null,
                style: {
                    fontFamily: 'Inter, Arial, sans-serif',
                    color: '#0b0e2c'
                }
            },
            pane: {
                center: ['50%', '85%'],
                size: '140%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: '#fafafa',
                    borderWidth: 0,
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            exporting: {
                enabled: false
            },
            tooltip: {
                enabled: false
            },
            yAxis: {
                stops: [
                    [0.1, '#7b42ff'],
                    [0.5, '#7440f5'],
                    [0.9, '#663de1']
                ],
                min: 0,
                max: 100,
                lineWidth: 0,
                tickWidth: 0,
                minorTickInterval: null,
                tickAmount: 2,
                title: {
                    y: -70,
                    text: 'Target'
                },
                labels: {
                    y: 16
                }
            },
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true,
                        format: `<div style="text-align:center">
                                    <span style="font-size:25px">{y}</span><br/>
                                    <span style="font-size:12px;opacity:0.4">Achieved</span>
                                 </div>`,
                        style: {
                            fontFamily: 'Inter, Arial, sans-serif',
                            color: '#0b0e2c'
                        }
                    }
                }
            },
            series: [{
                name: 'Business Metric',
                data: [70],
                dataLabels: {
                    format: `<div style="text-align:center">
                                <span style="font-size:25px">{y}</span><br/>
                                <span style="font-size:12px;opacity:0.4">Achieved</span>
                             </div>`,
                    style: {
                        fontFamily: 'Inter, Arial, sans-serif',
                        color: '#0b0e2c'
                    }
                },
                tooltip: {
                    valueSuffix: ' %'
                }
            }],
            credits: {
                enabled: false
            }
        };

        const chart = Highcharts.chart(gaugeOptions);
        const highchartsIndex = highchartsId !== null ? highchartsId : chart.index;
        container.setAttribute('data-highcharts-chart', highchartsIndex);
        console.log('Solidgauge chart created with index:', highchartsIndex);

        window.highchartInstances[container.id] = chart;

        window.highchartsDataArray.push({
            containerId: container.id,
            options: chart.options
        });

        return chart;
    } else if (chartData && chartData.data && chartData.metadata) {
        console.log('Generating chart with provided data and metadata.');
        categories = chartData.data.categories || chartData.data.months || [];

        const seriesKey = Object.keys(chartData.data).find(key => Array.isArray(chartData.data[key]) && chartData.data[key].length > 0 && chartData.data[key][0].values);

        if (seriesKey) {
            series = chartData.data[seriesKey].map(item => ({
                name: item.region || item.category,
                data: item.values
            }));
            console.log('Series data extracted:', series);
        } else {
            console.error('Unsupported data structure for series.');
            return;
        }

        const options = {
            chart: { type: type, renderTo: container.id },
            title: { text: showTitle ? title : null },
            xAxis: { categories: categories },
            yAxis: { title: { text: chartData.metadata.units } },
            series: series
        };

        const chart = Highcharts.chart(options);
        const highchartsIndex = highchartsId !== null ? highchartsId : chart.index;
        container.setAttribute('data-highcharts-chart', highchartsIndex);
        console.log('Chart created with index:', highchartsIndex);

        window.highchartInstances[container.id] = chart;
        window.chartDataTemp[container.id] = chartData;

        window.highchartsDataArray.push({
            containerId: container.id,
            options: chart.options
        });

        return chart;
    } else {
        console.error('Invalid chart data structure.');
    }
}

export function generateRandomSalesCharts() {
    console.log("Starting the process of generating random sales charts.");

    const businessArea = 'sales';
    const businessMetrics = window.businessMetrics[businessArea];
    const chartTypes = ['line', 'bar', 'column', 'area', 'pie'];
    const randomMetrics = getRandomElements(businessMetrics, 4);

    console.log(`Business area selected: ${businessArea}`);
    console.log(`Randomly chosen metrics for chart generation: ${randomMetrics.join(', ')}`);

    randomMetrics.forEach(metric => {
        const chartType = chartTypes[Math.floor(Math.random() * chartTypes.length)];
        const chartName = `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} - ${metric}`;

        console.log(`Preparing to generate chart for metric: ${metric}`);
        console.log(`Chart type selected: ${chartType}`);
        console.log(`Chart name: ${chartName}`);

        const encodedMetric = encodeURIComponent(metric);
        const dataFilePath = `/dummy/data/dummy/${businessArea}/${metric.toLowerCase().replace(/ /g, '_')}.json`;

        console.log(`Initiating data fetch from: ${dataFilePath}`);

        fetch(dataFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data for metric '${metric}': Received status code ${response.status} (${response.statusText})`);
                }
                console.log(`Successfully fetched data for metric: ${metric}`);
                return response.json();
            })
            .then(chartData => {
                console.log(`Data for metric '${metric}' received:`, chartData);

                window.chartCounter++;
                const widgetId = `chart-container-${window.chartCounter}`;

                console.log(`Creating chart widget. ID: ${widgetId}`);

                const chartHtml = `
                    <div class="grid-stack-item" gs-w="6" gs-h="20">
                        <div class="grid-stack-item-content">
                            <button class="delete-widget">✖</button>
                            <div class="drag-handle grabbable">
                                <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="5" y="5" width="5" height="5" fill="black" />
                                    <rect x="5" y="15" width="5" height="5" fill="black" />
                                    <rect x="15" y="5" width="5" height="5" fill="black" />
                                    <rect x="15" y="15" width="5" height="5" fill="black" />
                                    <rect x="25" y="5" width="5" height="5" fill="black" />
                                    <rect x="25" y="15" width="5" height="5" fill="black" />
                                </svg>
                            </div>
                            <div class="chart-container" id="${widgetId}" style="width: 100%; height: 100%;"></div>
                        </div>
                    </div>
                `;
                const el = $(chartHtml).get(0);

                window.grid.addWidget(el, {
                    width: 6,
                    height: 20,
                    autoPosition: true,
                    handle: '.drag-handle'
                });

                console.log(`Chart widget added to the grid layout. Widget ID: ${widgetId}`);

                setTimeout(() => {
                    const container = document.getElementById(widgetId);
                    if (container) {
                        console.log(`Rendering ${chartType} chart in container with ID: ${widgetId}`);
                        generateHighcharts(container, chartType, chartData, true, chartName);
                        updateCurrentLayoutContent();
                        updateHighchartsDataArray();
                    } else {
                        console.error(`Failed to find container element for widget ID: ${widgetId}`);
                    }
                }, 0);
            })
            .catch(error => {
                console.error(`Error during data fetching or chart creation for metric '${metric}':`, error);
            });
    });

    console.log("Completed the generation of random sales charts.");
}

// Helper function to get random elements from an array
function getRandomElements(arr, count) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export function saveLayoutWithCharts() {
    console.log('Save layout button clicked.');
    
    const layoutName = prompt("Enter layout name:");
    if (layoutName) {
        // Step 1: Log current comments before saving
        console.log('Current comments before saving:', window.comments);

        // Check if comments array exists and has content
        if (window.comments && window.comments.length > 0) {
            console.log('Comments are present and ready to be saved.');
        } else {
            console.warn('No comments found before saving.');
        }

        // Saving layout
        const layout = window.grid.save().map(item => {
            const el = item.el || document.querySelector(`.grid-stack-item[gs-x="${item.x}"][gs-y="${item.y}"]`);
            if (!el) return null;
            return {
                x: el.getAttribute('gs-x'),
                y: el.getAttribute('gs-y'),
                width: el.getAttribute('gs-w'),
                height: el.getAttribute('gs-h'),
                content: el.innerHTML
            };
        }).filter(item => item !== null);
        console.log('Layout data collected:', layout);

        // Saving Highcharts data
        window.highchartsDataArray = window.highchartsDataArray.map(data => {
            const chart = Highcharts.charts.find(chart => chart && chart.renderTo.id === data.containerId);
            if (chart) {
                data.options = getCompleteChartOptions(chart);
            }
            return data;
        });
        console.log('Highcharts data collected:', window.highchartsDataArray);

        // Saving grid item dimensions
        window.gridItemDimensions = layout.map(item => ({
            x: item.x,
            y: item.y,
            width: item.width,
            height: item.height
        }));
        console.log('Grid item dimensions collected:', window.gridItemDimensions);

        // Step 2: Log the comments that are about to be saved
        console.log('Saving comments:', window.comments);

        const savedLayouts = JSON.parse(localStorage.getItem('savedLayouts')) || {};

        // Saving everything (layout, charts, grid item dimensions, and comments)
        savedLayouts[layoutName] = {
            layout: layout,
            highchartsDataArray: window.highchartsDataArray,
            gridItemDimensions: window.gridItemDimensions,
            comments: window.comments  // Save comments along with everything else
        };
        localStorage.setItem('savedLayouts', JSON.stringify(savedLayouts));
        console.log('Layout, Highcharts data, and comments saved under name:', layoutName);

        // Step 3: Verify and log the saved comments from localStorage
        const savedData = JSON.parse(localStorage.getItem('savedLayouts'));
        if (savedData && savedData[layoutName] && savedData[layoutName].comments) {
            console.log('Saved comments from localStorage:', savedData[layoutName].comments);
        } else {
            console.error('Saved comments not found in localStorage.');
        }

    } else {
        console.log('No layout name entered. Save operation canceled.');
    }
}

export function loadLayoutWithCharts(layoutName) {
    console.log('Load layout button clicked.');

    // Retrieve the saved layouts from localStorage
    const savedLayouts = JSON.parse(localStorage.getItem('savedLayouts')) || {};
    const layoutData = savedLayouts[layoutName];

    // Step 1: Check if layout data exists
    if (layoutData) {
        console.log('Loading layout:', layoutName);
        
        // Clear current grid
        window.grid.removeAll();
        console.log('Cleared current grid.');

        // Step 2: Restoring grid layout
        if (layoutData.layout && layoutData.layout.length > 0) {
            console.log('Restoring grid layout...');
            layoutData.layout.forEach(item => {
                const el = document.createElement('div');
                el.className = 'grid-stack-item';
                el.setAttribute('gs-x', item.x);
                el.setAttribute('gs-y', item.y);
                el.setAttribute('gs-w', item.width);
                el.setAttribute('gs-h', item.height);
                el.innerHTML = item.content;
                window.grid.addWidget(el);
            });
            console.log('Grid layout restored:', layoutData.layout);
        } else {
            console.warn('No grid layout found in saved data.');
        }

        // Step 3: Restoring Highcharts data
        if (layoutData.highchartsDataArray && layoutData.highchartsDataArray.length > 0) {
            console.log('Restoring Highcharts data...');
            layoutData.highchartsDataArray.forEach(data => {
                initializeHighcharts(data.containerId, data.options);
            });
            console.log('Highcharts data restored:', layoutData.highchartsDataArray);
        } else {
            console.warn('No Highcharts data found in saved data.');
        }

        // Step 4: Restoring comments
        if (layoutData.comments && layoutData.comments.length > 0) {
            console.log('Restoring comments...');
            window.comments = layoutData.comments;  // Restore the comments array
            window.comments.forEach(comment => {
                renderComment(comment.id, comment.x, comment.y);  // Re-render each comment
                console.log(`Comment rendered: id=${comment.id}, text="${comment.text}", x=${comment.x}, y=${comment.y}`);
            });
        } else {
            console.warn('No comments found in saved data.');
        }

        console.log('Layout, Highcharts data, and comments successfully loaded for:', layoutName);
    } else {
        console.error('No layout data found for:', layoutName);
        alert("Error loading layout.");
    }
}

function getCompleteChartOptions(chart) {
    console.log('Getting complete chart options for chart:', chart);
    return {
        chart: chart.options.chart,
        title: chart.options.title,
        subtitle: chart.options.subtitle,
        series: chart.options.series,
        xAxis: chart.options.xAxis,
        yAxis: chart.options.yAxis,
        legend: chart.options.legend,
        tooltip: chart.options.tooltip,
        plotOptions: chart.options.plotOptions,
        exporting: chart.options.exporting,
        annotations: chart.options.annotations,
        credits: chart.options.credits,
        noData: chart.options.noData,
        responsive: chart.options.responsive
    };
}

function initializeHighcharts(containerId, options) {
    console.log('Initializing Highcharts for container:', containerId);
    const container = document.getElementById(containerId);
    if (container) {
        options.chart.renderTo = containerId;
        const chart = Highcharts.chart(options);
        Highcharts.charts[chart.index] = chart;

        setTimeout(() => {
            chart.reflow();
            console.log('Highcharts reflowed for container:', containerId);
        }, 0);
    }
}

export function updateSavedLayouts() {
    console.log('Updating saved layouts in localStorage.');
    const savedLayouts = JSON.parse(localStorage.getItem('savedLayouts')) || {};
    $('#localStorageContent').text(JSON.stringify(savedLayouts, null, 2));
}

export function updateCurrentLayoutContent() {
    console.log('Updating current layout content.');
    if (window.loading) return;
    const currentLayoutContent = window.grid.save().map(item => {
        const el = item.el || document.querySelector('.grid-stack-item');
        if (!el) return null;
        return {
            x: el.getAttribute('gs-x'),
            y: el.getAttribute('gs-y'),
            width: el.getAttribute('gs-w'),
            height: el.getAttribute('gs-h'),
            content: el.innerHTML
        };
    }).filter(item => item !== null);

    localStorage.setItem('currentLayoutContent', JSON.stringify(currentLayoutContent));
    console.log('Current layout content updated in localStorage.');
}

export function updateHighchartsDataArray() {
    console.log('Updating Highcharts data array.');
    if (window.loading) return;
    const updatedHighchartsDataArray = Highcharts.charts.map(chart => {
        if (chart) {
            return {
                containerId: chart.renderTo.id,
                options: getCompleteChartOptions(chart)
            };
        }
        return null;
    }).filter(data => data !== null);

    localStorage.setItem('highchartsDataArray', JSON.stringify(updatedHighchartsDataArray));
    console.log('Highcharts data array updated in localStorage.');
}