// dataManager.js

export async function loadClientConfig() {
    console.log("Loading client configuration...");
    try {
        const response = await fetch('https://raw.githubusercontent.com/dashly-development/designer-beta/main/scripts/clientConfig.json');
        const config = await response.json();
        console.log("Client configuration loaded:", config);
        return config;
    } catch (error) {
        console.error('Error loading configuration:', error);
        return null;
    }
}

export function populateSelectors(configData) {
    console.log("Populating selectors with configuration data:", configData);
    const clientSelect = document.getElementById('clientSelect');
    const dashboardSelect = document.getElementById('dashboardSelect');
    const dataTypeSelect = document.getElementById('dataTypeSelect');

    if (configData && Array.isArray(configData.clients)) {
        clientSelect.innerHTML = '<option value="" disabled selected>Select Client</option>';
        configData.clients.forEach(client => {
            console.log("Adding client option:", client.name);
            const option = document.createElement('option');
            option.value = client.name.toLowerCase().replace(/ /g, '_');
            option.text = client.name;
            clientSelect.appendChild(option);
        });

        clientSelect.addEventListener('change', () => {
            console.log("Client selected:", clientSelect.value);
            dashboardSelect.innerHTML = '<option value="" disabled selected>Select Dashboard</option>';
            dataTypeSelect.innerHTML = '<option value="" disabled selected>Select Data Type</option>';

            const selectedClient = configData.clients.find(client => client.name.toLowerCase().replace(/ /g, '_') === clientSelect.value);
            if (selectedClient && Array.isArray(selectedClient.dashboards)) {
                console.log("Populating dashboards for client:", selectedClient.name);
                selectedClient.dashboards.forEach(dashboard => {
                    console.log("Adding dashboard option:", dashboard.name);
                    const option = document.createElement('option');
                    option.value = dashboard.name.toLowerCase().replace(/ /g, '_');
                    option.text = dashboard.name;
                    dashboardSelect.appendChild(option);
                });
            }
        });

        dashboardSelect.addEventListener('change', () => {
            console.log("Dashboard selected:", dashboardSelect.value);
            dataTypeSelect.innerHTML = '<option value="" disabled selected>Select Data Type</option>';
            const selectedClient = configData.clients.find(client => client.name.toLowerCase().replace(/ /g, '_') === clientSelect.value);
            const selectedDashboard = selectedClient.dashboards.find(dashboard => dashboard.name.toLowerCase().replace(/ /g, '_') === dashboardSelect.value);

            if (selectedDashboard && Array.isArray(selectedDashboard.data_types)) {
                console.log("Populating data types for dashboard:", selectedDashboard.name);
                selectedDashboard.data_types.forEach(dataType => {
                    console.log("Adding data type option:", dataType);
                    const option = document.createElement('option');
                    option.value = dataType;
                    option.text = dataType.replace(/_/g, ' ').replace('.json', '');
                    dataTypeSelect.appendChild(option);
                });
            }
        });
    } else {
        console.error("No clients data found in configuration.");
    }
}