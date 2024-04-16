

let panorama;

function initialize() {
  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view"),
    {
      position: { lat:48.78974523145507, lng: 2.035116042914666 },
      pov: { heading: 165, pitch: 0 },
      zoom: 0.8,
    },
  );
}

window.initialize = initialize;


let map = L.map('map').setView([51.505, -0.09], 4);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 4,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function onMapClick(e){
    console.log('bonjour')
    console.log(e.latlng)
    let latClick = e.latlng.lat
    let lngClick = e.latlng.lng

    let marker = L.marker([latClick, lngClick]).addTo(map)
}

map.on('click', onMapClick);