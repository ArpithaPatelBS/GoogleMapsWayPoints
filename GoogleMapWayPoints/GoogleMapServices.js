//Global variables for storing the position info and my location
var my_location_addr = '';
var pos= '';


//Map init function which sets the map values before we start the navigation.
function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  //Setting up the map variables
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 15
  });
  var infoWindow = new google.maps.InfoWindow({map: map});
  
  document.getElementById('directions-panel').style.display = 'none';
  
  //Google Map function to show the route info on the map
  directionsDisplay.setMap(map);
  //Google Map function to show the route info on the text panel
  directionsDisplay.setPanel(document.getElementById('directions-panel'));
  //Function called on click of submit button to get the route info using google directionService and also directionDisplay services
  document.getElementById('submit').addEventListener('click', function() {
		calculateAndDisplayRoute(directionsService, directionsDisplay);
  });
 
 //Get my current location and also set the map with in the bounds of current location.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

	  //Set the map position on my current location
      infoWindow.setPosition(pos);
      
	  
	  //Get my current position address and also store it for getting the directions.
	  var request = new XMLHttpRequest();

        var method = 'GET';
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+pos.lat+','+pos.lng+'&sensor=true';
        var async = true;

        request.open(method, url, async);
        request.onreadystatechange = function(){
          if(request.readyState == 4 && request.status == 200){
            var data = JSON.parse(request.responseText);
            var address = data.results[0];
            my_location_addr = address.formatted_address;
			infoWindow.setContent(my_location_addr);
          }
        };
        request.send();
	  
	  
	  
      map.setCenter(pos);
	  
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  
  
}

//Function to all the google API method to get the route info.
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  //Way point to stop on routing
  var waypts = [];
	  waypts.push({
		location: document.getElementById('waypoint').value,
		stopover: true
	  });
	  //Selected mode of transportaion
  var selectedMode = document.getElementById("mode").value
  //Calling google route to get route info.
  directionsService.route({
    origin:my_location_addr,
	destination: document.getElementById('end').value,
	waypoints: waypts,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode[selectedMode]
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
	  document.getElementById('directions-panel').style.display = 'block';
      directionsDisplay.setDirections(response);      
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}


//Method to handle error while getting my current location
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}