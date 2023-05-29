//Getting the project Id from the URl
const projectId = window.location.pathname.split('/')[2];
const id = window.location.pathname.split('/')[3];
console.log(id);
var map = L.map('map').setView([54, 15], 4);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//Getting one specific product from the enpi point  
fetch(`/products/map/${projectId}`)
    .then(response => response.json())
    .then(products => {
        // Loop through products and add markers to the map
        for (const property in products) {
            products[property].forEach((item) => {

                if (item._id === id) {

                    var marker = L.marker([item.latitude, item.longitude], { draggable: true }).addTo(map);
                    marker.on('dragend', function (event) {
                        var marker = event.target;
                        var position = marker.getLatLng();
                        var lat = position.lat;
                        var lng = position.lng;

                        // Update the latitude and longitude values
                        document.getElementById('latitude').value = lat;
                        document.getElementById('longitude').value = lng;
                    });
                }

            });
        }


    })
    .catch(error => console.log('Error fetching products', error));







//Setting up the value for the user's range input
const value = document.querySelector("#value")
const input = document.querySelector("#pi_input")
value.textContent = input.value
input.addEventListener("input", (event) => {
    value.textContent = event.target.value
})
