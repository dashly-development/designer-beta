import { generateHighcharts, updateCurrentLayoutContent, updateHighchartsDataArray } from './chartUtils.js';

export function initGridStack() {
  console.log('Initializing GridStack...');
  window.grid = GridStack.init({
    cellHeight: 20,
    verticalMargin: 0,
    acceptWidgets: true,
    removable: true,
    removeTimeout: 100,
    dragIn: '.newWidget',
    dragInOptions: { revert: 'invalid', scroll: false, appendTo: 'body', helper: 'clone' },
    handle: '.drag-handle',
    handleClass: 'drag-handle'
  });

  console.log('Making grid items movable and resizable...');
  grid.movable('.grid-stack-item', true);
  grid.resizable('.grid-stack-item', true);

  grid.on('change', function (event, items) {
    console.log('Grid items changed:', items);
    updateCurrentLayoutContent();
    updateHighchartsDataArray();
  });

  grid.on('resizestop', function (event, element) {
    console.log('Resize stopped for element:', element);
    const chartContainer = $(element).find('.chart-container');
    const highchartsIndex = chartContainer.attr('data-highcharts-chart');
    const chart = Highcharts.charts[highchartsIndex];
    if (chart) {
      console.log('Reflowing chart with index:', highchartsIndex);
      chart.reflow();
    }
  });
}

export function handleBusinessAreaChange() {
  console.log('Business area selection changed.');
  const businessArea = $('#businessAreaSelect').val();
  console.log('Selected business area:', businessArea);
  const metrics = window.businessMetrics[businessArea];
  if (!metrics) {
    console.error(`No metrics found for business area: ${businessArea}`);
    return;
  }
  $('#metricSelect').empty().append('<option value="" disabled selected>Select Metric</option>');
  metrics.forEach(metric => {
    $('#metricSelect').append(`<option value="${metric.toLowerCase().replace(/ /g, '_')}">${metric}</option>`);
  });
}

export function handleGenerateChart() {
  console.log('Generate chart button clicked.');
  const businessArea = $('#businessAreaSelect').val();
  const metric = $('#metricSelect').val();
  const chartType = $('#chartTypeSelect').val();
  console.log('Selected business area:', businessArea);
  console.log('Selected metric:', metric);
  console.log('Selected chart type:', chartType);
  window.currentChartType = chartType;
  if (!businessArea || !metric || !chartType) {
    alert("Please select business area, metric, and chart type.");
    return;
  }

  $('#generateChartBtn').prop('disabled', true);
  console.log('Fetching data for chart...');
  const dataFilePath = `/dummy/data/dummy/${businessArea}/${metric}.json`;
  fetch(dataFilePath)
    .then(response => response.json())
    .then(chartData => {
      console.log('Data fetched successfully:', chartData);
      window.chartCounter++;
      window.pendingChartId = `chart-container-${window.chartCounter}`;
      window.pendingChartType = chartType;
      window.pendingChartData = chartData;

      $('#chartNameModal').modal('show');
      $('#generateChartBtn').prop('disabled', false);
    })
    .catch(error => {
      console.error('Error fetching dummy data:', error);
      $('#generateChartBtn').prop('disabled', false);
    });
}

export function handleGenerateClientChart() {
  console.log('Generate client chart button clicked.');
  const client = document.getElementById('clientSelect').value;
  const dashboard = document.getElementById('dashboardSelect').value;
  const dataType = document.getElementById('dataTypeSelect').value;
  const chartType = document.getElementById('clientChartTypeSelect').value;
  console.log('Selected client:', client);
  console.log('Selected dashboard:', dashboard);
  console.log('Selected data type:', dataType);
  console.log('Selected chart type:', chartType);

  if (!client || !dashboard || !dataType || !chartType) {
    alert("Please select client, dashboard, data type, and chart type.");
    return;
  }

  document.getElementById('generateClientChartBtn').disabled = true;
  console.log('Fetching client data for chart...');
  const dataFilePath = `/dummy/data/dummy/${client}/${dashboard}/${dataType}`
  fetch(dataFilePath)
    .then(response => response.json())
    .then(chartData => {
      console.log('Client data fetched successfully:', chartData);
      window.chartCounter++;
      window.pendingChartId = `chart-container-${window.chartCounter}`;
      window.pendingChartType = chartType;
      window.pendingChartData = chartData;

      $('#chartNameModal').modal('show');
      document.getElementById('generateClientChartBtn').disabled = false;
    })
    .catch(error => {
      console.error('Error fetching dummy data:', error);
      document.getElementById('generateClientChartBtn').disabled = false;
    });
}

export function saveChartName() {
  console.log('Save chart name function called.');
  const chartName = $('#chartNameInput').val();
  if (!chartName) {
    alert("Please enter a chart name.");
    return;
  }

  console.log('Chart name entered:', chartName);
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
        <div class="chart-container" id="${window.pendingChartId}" style="width: 100%; height: 100%;"></div>
      </div>
    </div>
  `;
  const el = $(chartHtml).get(0);

  $('#chartNameModal').modal('hide');
  $('#chartNameInput').val('');

  console.log('Adding new chart widget to the grid...');
  window.grid.addWidget(el, {
    width: 6,
    height: 20,
    autoPosition: true,
    handle: '.drag-handle'
  });

  setTimeout(() => {
    const container = document.getElementById(window.pendingChartId);
    if (container) {
      console.log('Generating Highcharts for container:', container.id);
      const chart = generateHighcharts(container, window.pendingChartType, window.pendingChartData, true, chartName);
      updateCurrentLayoutContent();
      updateHighchartsDataArray();
    }
  }, 0);
}

export function deleteWidget(widgetElement) {
  if (confirm('Are you sure you want to delete this widget?')) {
    // Assuming you are using GridStack.js
    window.grid.removeWidget(widgetElement);

    // Optional: Clean up associated data if necessary
    const widgetId = widgetElement.querySelector('.chart-container').id;
    delete window.highchartInstances[widgetId]; // Or similar cleanup if using another data structure
  }
}

export function clearLayout() {
  console.log('Clearing layout...');
  window.grid.removeAll();

  // Optionally, clear related data structures or localStorage
  window.highchartsDataArray = [];
  localStorage.removeItem('currentLayoutContent');
  console.log('Layout cleared and data reset.');
}
