// Get the path from the URL
// Get the path from the URL
const path = window.location.pathname;
let projectId;

// Check if the path contains '/products/all/'
if (path.includes('/products/all/')) {
    // Extract the projectId from the URL
    projectId = path.split('/').pop();
} else if (path.includes('/products/update/') || path.includes('/products/delete/')) {
    // Split the path by '/'
    const pathParts = path.split('/');
    // Find the index of the 'update' or 'delete' segment
    const index = pathParts.indexOf('update') !== -1 ? pathParts.indexOf('update') : pathParts.indexOf('delete');
    // Check if the index is valid and there is a segment after 'update' or 'delete'
    if (index !== -1 && index < pathParts.length - 1) {
        // Extract the projectId from the next segment
        projectId = pathParts[index + 1];
    }
}

console.log(projectId);


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
            products[property].forEach((item) => {
                L.marker([item.latitude, item.longitude]).addTo(map);
            });
        }


    })
    .catch(error => console.log('Error fetching products', error));
