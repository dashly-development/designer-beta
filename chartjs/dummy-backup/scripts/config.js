// scripts/config.js

window.businessMetrics = {
  sales: ["Units Sold", "Sales Revenue", "Average Order Value", "Sales Growth Rate", "Sales by Region", "Sales by Product Category"],
  marketing: ["Ad Impressions", "Click Through Rate", "Cost Per Click", "Leads Generated", "Conversion Rate", "Customer Acquisition Cost", "Social Media Engagement", "Email Campaign Performance"],
  financial: ["Total Revenue", "Recurring Revenue", "Revenue Growth Rate", "Operating Expenses", "Marketing Expenses", "Employee Salaries", "Net Profit Margin", "Gross Profit", "EBITDA", "Earnings Per Share", "Return on Investment", "Stock Prices", "Dividend Yield"],
  customer: ["Active Users", "Customer Satisfaction Score", "Net Promoter Score", "Churn Rate", "Customer Lifetime Value", "Support Tickets", "Average Resolution Time", "Support Satisfaction"],
  website: ["Page Views", "Unique Visitors", "Session Duration", "Bounce Rate", "Click Paths", "Heatmaps", "Exit Rates", "Sign Up Rate", "Checkout Abandonment Rate", "Form Completion Rate"],
  operational: ["Units Produced", "Production Downtime", "Production Cost Per Unit", "Inventory Levels", "Order Fulfillment Time", "Supply Chain Costs", "Shipping Times", "Delivery Accuracy", "Transportation Costs"],
  hr: ["Employee Count", "Employee Turnover Rate", "Average Tenure", "Employee Satisfaction", "Time to Hire", "Cost Per Hire", "Offer Acceptance Rate", "Training Completion Rate", "Training Costs"],
  it: ["Server Uptime", "Response Times", "Error Rates", "Security Incidents", "Time to Resolve Security Issues", "Compliance Rates", "Number of Deployments", "Bug Fix Rate", "Feature Development Rate"],
  health_safety: ["Health Incidents", "Average Recovery Time", "Safety Incidents", "Safety Training Completion Rate", "Compliance with Safety Regulations"]
};

window.comments = [];
window.highchartsDataArray = [];
window.chartDataTemp = {};
window.highchartInstances = {};
window.chartCounter = 0;
window.pendingChartData = null;
window.pendingChartType = null;
window.pendingChartId = null;
window.commentMode = false;
window.currentCommentId = null;
window.isDragging = false;
window.gridItemDimensions = [];
window.loading = false;

// config.js
export const gaugeConfig = {
  chart: {
      type: 'solidgauge',
      height: '110%',
      backgroundColor: '#ffffff'
  },
  title: {
      text: null,
      style: {
          fontSize: '16px',
          color: '#0b0e2c',
          fontWeight: 'bold',
          align: 'left',
          marginBottom: 12
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
  yAxis: {
      min: 0,
      max: 200,
      stops: [
          [0.1, '#55BF3B'], // green
          [0.5, '#DDDF0D'], // yellow
          [0.9, '#DF5353']  // red
      ],
      lineWidth: 0,
      tickWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      title: {
          y: -70
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
              format: '<div style="text-align:center"><span style="font-size:25px">{y}</span><br/><span style="font-size:12px;opacity:0.4">{unit}</span></div>'
          }
      }
  },
  credits: {
      enabled: false
  },
  exporting: {
      enabled: false
  }
};

Highcharts.setOptions({
  colors: ['#7b42ff', '#7440f5', '#6d3feb', '#663de1', '#603cd7', '#593bcd', '#5239c3', '#4b38b9', '#4536af', '#4b28b3'],
  chart: {
      backgroundColor: '#ffffff', // Set background color
      className: 'custom-highcharts', // Add a custom class for additional styling
      style: {
          fontFamily: 'Inter, sans-serif',
      },
  },
  title: {
      align: 'left', // Align title to the left
      style: {
          color: '#0b0e2c',
          fontWeight: 'bold',
          marginBottom: '12px', // Set margin bottom for title
      },
      margin: 12, // This margin setting may also help with positioning
  },
  subtitle: {
      style: {
          color: '#4a34c2',
          fontWeight: 'bold'
      }
  },
  xAxis: {
      lineColor: '#e9eaf3',
      labels: {
          style: {
              color: '#0b0e2c'
          }
      }
  },
  yAxis: {
      lineColor: '#e9eaf3',
      labels: {
          style: {
              color: '#0b0e2c'
          }
      },
      title: {
          style: {
              color: '#0b0e2c'
          }
      }
  },
  legend: {
      itemStyle: {
          color: '#0b0e2c'
      },
      itemHoverStyle: {
          color: '#7b42ff'
      }
  },
  tooltip: {
      backgroundColor: '#fff',
      borderColor: '#7b42ff',
      style: {
          color: '#0b0e2c'
      }
  }
});