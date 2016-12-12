var currLat;
var currLong;

// these functions were taken from google's tutorial for google maps api
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7128, lng: -74.0059},
    zoom: 6
  });
  var infoWindow = new google.maps.InfoWindow({map: map});

// Try HTML5 geolocation.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    currLat = position.coords.latitude;
    currLong = position.coords.longitude;
    
    infoWindow.setPosition(pos);
    infoWindow.setContent('Location found.');
    map.setCenter(pos);
    map.setZoom(15);
  }, function() {
    handleLocationError(true, infoWindow, map.getCenter());
  });
} else {
  // Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

// the following is my own code
function getLat () {
  return currLat;
}

function getLong () {
  return currLong;
}



