// Get the path from the URL
const path = window.location.pathname;
let projectId;
let productId;

// Check if the path contains '/products/all/'
if (path.includes('/products/all/')) {
    // Extract the projectId from the URL
    projectId = path.split('/').pop();
} else if (
    path.includes('/products/update/') ||
    path.includes('/products/delete/') ||
    path.includes('/products/report/') ||
    path.includes('/products/report/history/')
) {
    // Split the path by '/'
    const pathParts = path.split('/');
    // Find the index of 'update', 'delete', 'report', or 'history' segment
    const operationIndex = pathParts.findIndex(part => part === 'update' || part === 'delete' || part === 'report' || part === 'history');
    // Check if the index is valid and there is a segment after 'update', 'delete', 'report', or 'history'
    if (operationIndex !== -1 && operationIndex < pathParts.length - 2) {
        // Extract the projectId from the segment after 'report' or 'history'
        projectId = pathParts[operationIndex + 1];
        // Extract the productId from the segment after projectId
        productId = pathParts[operationIndex + 2];
    }
} else if (path.includes('/products/create/')) {
    const pathParts = path.split('/');
    const createIndex = pathParts.indexOf('create');
    if (createIndex !== -1 && createIndex < pathParts.length - 1) {
        projectId = pathParts[createIndex + 1];
    }
} else {
    // Handle other conditions or fallback behavior here
    // For example, if none of the conditions match, you can set default values or handle the case accordingly
}

console.log(projectId);
console.log(productId);

var map = L.map('map').setView([54, 15], 4);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
// Fit the map to the whole world
map.fitWorld();

fetch(`/products/map/${projectId}`)
    .then(response => response.json())
    .then(products => {
        // Loop through products and add markers to the map
        for (const property in products) {
            products[property].forEach(item => {
                L.marker([item.latitude, item.longitude]).addTo(map);
            });
        }
    })
    .catch(error => console.log('Error fetching products', error));
