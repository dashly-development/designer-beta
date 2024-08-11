$(document).ready(function() {
  // Initialize Gridstack
  var grid = GridStack.init({
    cellHeight: 70,
    handle: '.drag-handle',
    resizable: true,
    staticGrid: true // Make the grid non-editable on page load
  });

  // Define grid items
  var items = [
    {x: 0, y: 0, w: 6, h: 6, content: 'chart1'},
    {x: 6, y: 0, w: 6, h: 6, content: 'chart2'},
    {x: 0, y: 6, w: 6, h: 6, content: 'chart3'},
    {x: 6, y: 6, w: 6, h: 6, content: 'chart4'}
  ];

  items = items.map(item => {
    item.content = `<div class="drag-handle"></div>
                    <div id="${item.content}" style="width:100%; height:100%"></div>`;
    return item;
  });

  grid.load(items);

  // Ensure the initial non-editable state hides the handles
  $('.grid-stack').addClass('non-editable');

  $('#edit-button').click(function() {
    grid.setStatic(!grid.opts.staticGrid);
    $(this).text(grid.opts.staticGrid ? 'Enable Edit' : 'Disable Edit');
    // Toggle non-editable class
    $('.grid-stack').toggleClass('non-editable', grid.opts.staticGrid);
    displayCurrentLayout();
  });

  $('#save-as-button').click(function() {
    var layoutName = prompt('Enter layout name:');
    if (layoutName) {
      saveLayout('grid-layout-' + layoutName);
      displayLocalStorage();
      displaySavedLayouts();
    }
  });

  $('#load-button').click(function() {
    displayLayouts();
    $('#loadModal').modal('show');
  });

  $('#clear-all-button').click(function() {
    if (confirm('Are you sure you want to clear all layouts?')) {
      clearAllLayouts();
      displayLocalStorage();
      displayLayouts();
      displaySavedLayouts();
    }
  });

  $(document).on('click', '.load-layout', function() {
    var layoutName = $(this).data('layout-name');
    var savedLayout = localStorage.getItem('grid-layout-' + layoutName);
    if (savedLayout) {
      grid.removeAll(); // Clear the current grid items
      grid.load(JSON.parse(savedLayout).layout);
      console.log('Loaded ' + layoutName);
      $('#loadModal').modal('hide');
      displayCurrentLayout();
    } else {
      alert('No layout found with that name.');
    }
  });

  $(document).on('click', '.delete-layout', function() {
    var layoutName = $(this).data('layout-name');
    localStorage.removeItem('grid-layout-' + layoutName);
    console.log('Deleted ' + layoutName);
    displayLayouts();
    displayLocalStorage();
    displaySavedLayouts();
  });

  function saveLayout(key) {
    var layout = grid.save();
    var layoutData = {
      layout: layout,
      timestamp: new Date().toISOString() // Use ISO string for better date parsing
    };
    localStorage.setItem(key, JSON.stringify(layoutData));
    console.log('Saved layout as ' + key);
  }

  function clearAllLayouts() {
    var keys = Object.keys(localStorage).filter(key => key.startsWith('grid-layout'));
    keys.forEach(key => localStorage.removeItem(key));
    console.log('Cleared all layouts');
  }

  function displayLocalStorage() {
    var keys = Object.keys(localStorage).filter(key => key.startsWith('grid-layout'));
    var localStorageData = keys.map(key => `${key}: ${localStorage.getItem(key)}`).join("\n");
    $("#local-storage-data").text(localStorageData);
  }

  function displayLayouts() {
    var keys = Object.keys(localStorage).filter(key => key.startsWith('grid-layout'));
    keys.sort((a, b) => {
      var dateA = new Date(JSON.parse(localStorage.getItem(a)).timestamp);
      var dateB = new Date(JSON.parse(localStorage.getItem(b)).timestamp);
      return dateB - dateA; // Sort by date descending
    });
    var layoutList = keys.map(key => {
      var name = key.replace('grid-layout-', '');
      var layoutData = JSON.parse(localStorage.getItem(key));
      var timestamp = new Date(layoutData.timestamp).toLocaleString(); // Format the date for display
      return `<div class="row">
                <div class="col-3">${name}</div>
                <div class="col-3">${timestamp}</div>
                <div class="col-3"><button class="btn btn-primary load-layout" data-layout-name="${name}">Load</button></div>
                <div class="col-3"><button class="btn btn-danger delete-layout" data-layout-name="${name}">Delete</button></div>
              </div>`;
    }).join('');
    $("#layout-list").html(layoutList);
  }

  function displayCurrentLayout() {
    var layout = grid.save();
    $("#current-layout-json").text(JSON.stringify(layout, null, 2));
  }

  function displaySavedLayouts() {
    var keys = Object.keys(localStorage).filter(key => key.startsWith('grid-layout'));
    var savedLayouts = keys.map(key => {
      return {
        name: key.replace('grid-layout-', ''),
        data: JSON.parse(localStorage.getItem(key))
      };
    });
    $("#saved-layouts-json").text(JSON.stringify(savedLayouts, null, 2));
  }

  // Ensure loadCharts is called only when it is defined
  if (typeof loadCharts === "function") {
    loadCharts();
  }

  // Display local storage data on page load
  displayLocalStorage();
  displaySavedLayouts();
  displayCurrentLayout();
});