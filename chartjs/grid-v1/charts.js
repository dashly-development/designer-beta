$(document).ready(function() {
  function createLineChart(container, title) {
    Highcharts.chart(container, {
      chart: {
        type: 'line'
      },
      title: {
        text: title
      },
      series: [{
        data: [1, 3, 2, 4]
      }]
    });
  }

  function createColumnChart(container, title) {
    Highcharts.chart(container, {
      chart: {
        type: 'column'
      },
      title: {
        text: title
      },
      series: [{
        data: [5, 3, 4, 7, 2]
      }]
    });
  }

  function createPieChart(container, title) {
    Highcharts.chart(container, {
      chart: {
        type: 'pie'
      },
      title: {
        text: title
      },
      series: [{
        data: [
          { name: 'A', y: 45 },
          { name: 'B', y: 26 },
          { name: 'C', y: 12 },
          { name: 'D', y: 8 },
          { name: 'E', y: 9 }
        ]
      }]
    });
  }

  function createBarChart(container, title) {
    Highcharts.chart(container, {
      chart: {
        type: 'bar'
      },
      title: {
        text: title
      },
      series: [{
        data: [1, 3, 4, 7, 2]
      }]
    });
  }

  function loadCharts() {
    createLineChart('chart1', 'Line Chart');
    createColumnChart('chart2', 'Column Chart');
    createPieChart('chart3', 'Pie Chart');
    createBarChart('chart4', 'Bar Chart');
  }

  // Expose loadCharts to global scope
  window.loadCharts = loadCharts;
});
