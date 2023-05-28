//Getting the project Id from the URl
const projectId = window.location.pathname.split('/').pop();

var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

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
