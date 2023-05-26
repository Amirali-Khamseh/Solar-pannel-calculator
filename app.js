const map = L.map('map').setView([51.505, -0.09], 13);

//map init
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// map icons 
const popup = L.popup();
let marker ;
let lat , lng ;
const Arr = []


function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    marker = L.marker(e.latlng).addTo(map);
 
    lat = e.latlng.lat ;
    lng = e.latlng.lng ;
    console.log('Lat : ' + lat + ' Ing : ' + lng);  
    getData();
}


async function getData(){
    let URL = `https://api.weatherbit.io/v2.0/history/daily?lat=${lat}&lon=${lng}&start_date=2020-05-04&end_date=2020-08-10&units=S&key=d69863dbe8604734946b674ef99b16e2`
    const data  = await fetch(URL);
    const dataParsed =await data.json() ;
    Arr = [...dataParsed]
    console.log(Arr);
   
}
map.on('click', onMapClick);

