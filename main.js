const body = document.querySelector('body')

let map = L.map('map').setView([51.505, -0.09], 4);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 8,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
let marker;

class StreetView{
  
  static getRandomLocation(){

    var places = [
    [{ lat: 60.171001,  lng: 24.939350 },  {country: 'Finland'}], // Helsinki, Finland
    [{ lat: 48.858093,  lng: 2.294694 },   {country: 'France'}], // Paris, France
    [{ lat: 51.510020,  lng: -0.134730 },  {country: 'Great Britain'}], // London, Great Britain
    [{ lat: 41.8902,    lng: 12.4922 },      {country: 'Italy'}], // Rome, Italy
    [{ lat: 25.195302,  lng: 55.272879 },  {country: 'United Arab Emirates'}], // Dubai, United Arab Emirates
    [{ lat: 1.283404,   lng: 103.863134 },  {country: 'Singapore'}], // Marina Bay, Singapore
    [{ lat: 29.976768,  lng: 31.135538 },  {country: 'Egypt'}], // Cairo, Egypt
    [{ lat: 40.757876,  lng: -73.985592 }, {country: 'United States'}], // New York, USA
]

    let randomIndex = Math.floor(Math.random() * places.length)
    let randomLat = places[randomIndex][0].lat
    let randomLng = places[randomIndex][0].lng
    let randomCountry = places[randomIndex][1].country

    let gameLocation = {country: randomCountry, lat: randomLat, lng: randomLng}
    return gameLocation;  

  }

  static displayStreetView(){
    let panorama;
    let randomLocation = StreetView.getRandomLocation()
    let randomLat = randomLocation.lat
    let randomLng = randomLocation.lng
    
    console.log(randomLocation)

    function initialize() {
      panorama = new google.maps.StreetViewPanorama(
        document.getElementById("street-view"),
        {
          position: { lat:randomLat, lng: randomLng },
          pov: { heading: 165, pitch: 0 },
          zoom: 0.8,
        },
      );
    }

  window.initialize = initialize;
  
  
  let guessBtn = document.querySelector('#submit');
  guessBtn.addEventListener('click', () => {
      // Vérifier si un marqueur a été placé sur la carte
      if (marker == null) {
          console.log('choisis une location');
          let divResult = document.createElement('div')

          divResult.classList.add('div-result')
          body.appendChild(divResult)
          divResult.textContent = 'Veuillez choisir sur la mappppp'
          setTimeout(()=> {
            divResult.remove()
          }, 3000)
      } 
  });
  }

}



function getClickLocation(e) {
  let latClick = e.latlng.lat;
  let lngClick = e.latlng.lng;
  let clickLocation = { lat: latClick, lng: lngClick };

  let gameLocation = StreetView.getRandomLocation()
  Game.haversineDistance(clickLocation, gameLocation )
  return clickLocation;
}

function onMapClick(e) {
  // Je renvoie l'élement e la fontion getClickLocation
  let clickLocation = getClickLocation(e); 
  
  console.log(clickLocation);

  if (marker) {
    marker.remove();
  }
  let iconPin = L.icon({
    iconUrl: 'assets/pin.png',
    iconSize: [40, 40],
    iconAnchor: [20,36], // point d'ancrage de l'icône
    popupAnchor: [1, -34] // point d'ancrage du popup
  })

  marker = L.marker([clickLocation.lat, clickLocation.lng], {icon: iconPin}).addTo(map); 
}






class Game {

  static haversineDistance(clickLocation, gameLocation){

    let lat1 = clickLocation.lat
    let lng1 = clickLocation.lng
    let lat2 = gameLocation.lat
    let lng2 = gameLocation.lng

// Fonction pour calculer la distance haversine entre deux paires de coordonnées

    // Convertir les degrés en radians
    const toRadians = (angle) => angle * (Math.PI / 180);

    // Rayon de la Terre en kilomètres
    const R = 6371;

    // Différences de latitude et de longitude
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    // Calcul de la distance haversine
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;
    let result = {distance: distance, loc: gameLocation}
    Game.displayResult(result, clickLocation)

    return distance; // Distance en kilomètres
  }

  static displayResult(result, clickLocation){
    let distance = Math.floor(result.distance)
    let gameLocation = result.loc
    let gameCountry = gameLocation.country
    let gameLat = gameLocation.lat
    let gameLng = gameLocation.lng
    let clickLocationArray = [clickLocation.lat, clickLocation.lng]
    let gameLocationArray = [gameLat, gameLng]
    
    
    let guessBtn = document.querySelector('#submit');
    
    let markerResult;
    let polyline;
    
    guessBtn.addEventListener('click', () => {
      
      if (markerResult != null) {
        markerResult.remove()
        polyline.remove()
      } else {
        console.log('ta cliqué sur le bouton et g un resultat');
        let divResult = document.createElement('div')

        divResult.classList.add('div-result')
        body.appendChild(divResult)
        divResult.innerHTML = `
        <h2>Pas loin...</h2><br>
        <h3>Pays : ${gameCountry}</h3>
        <h3>Distance : ${distance}km</h3>
        <button id="againBtn">rejouer</button>`

        map.setView([gameLat, gameLng], 2)
        let againBtn =document.querySelector('#againBtn')
        againBtn.addEventListener('click', ()=> {
          Game.newGame(divResult)
        })
        map.classList.add('mapToggled')

        var gameLocationIcon = L.icon({
          iconUrl: 'assets/reshot-icon-location-PH2QZJAXNG.svg',
          iconSize: [40, 50], // taille de l'icône
          iconAnchor: [20, 36], // point d'ancrage de l'icône
          popupAnchor: [1, -34] // point d'ancrage du popup
      });
      
      markerResult = L.marker([gameLat, gameLng], { icon: gameLocationIcon, title: 'marker' }).addTo(map);
      polyline = L.polyline([clickLocationArray, gameLocationArray], {color: 'red'}).addTo(map)
      
      
      }
    });
    
    console.log('distance en km :' + distance)

    
  }
 static newGame(divResult){
  divResult.remove()
  console.log('remove')
  againBtn.removeEventListener
  
    
}

static loginPage(){
  
  
 }
  
}

let streetView = StreetView.displayStreetView()
map.on('click', onMapClick);