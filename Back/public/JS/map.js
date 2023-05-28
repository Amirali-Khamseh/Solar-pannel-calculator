
//Leaftlet setup
var map = L.map('map').setView([51.505, -0.09], 13);

// Add the tile layer (you may need to adjust the URL based on the tile provider you choose)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

// Create a marker and add it to the map
var marker = L.marker([51.505, -0.09], { draggable: true }).addTo(map);

// Event listener for when the marker is dragged
marker.on('dragend', function (event) {
    var marker = event.target;
    var position = marker.getLatLng();
    var lat = position.lat;
    var lng = position.lng;

    // Update the latitude and longitude values
    document.getElementById('latitude').value = lat;
    document.getElementById('longitude').value = lng;
});


//Setting up the value for the user's range input
const value = document.querySelector("#value")
const input = document.querySelector("#pi_input")
value.textContent = input.value
input.addEventListener("input", (event) => {
  value.textContent = event.target.value
})
