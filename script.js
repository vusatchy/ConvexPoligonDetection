

var markers=[];
var redColour = '#FF0000';
var greenColour = '#1ee804';
var polygon = null;

$( "#button" ).on("click", notify);
$( "#buttonDelete" ).on("click",deleteAllMarkers);

function notify(){
  var name=$("#city").val();
    var pattern="http://api.openweathermap.org/data/2.5/weather?q=";
  var key="&appid=925cc41bc09b3f676d485f96d7ac9ac4";
  var url=pattern+name+key;
  $.getJSON(url,data=>{
    $("#name").text(name);
    $("#temperature").text(fromKelvinToCelsium(data.main.temp)+" C");
    $("#speed").text(data.wind.speed+" meter/sec");
    $("#press").text(data.main.pressure+"  hPa");
  });
}


function initMap() {
  var mapCanvas = document.getElementById("map");
  var myCenter=new google.maps.LatLng(24.886, -70.268);
  var mapOptions = {center: myCenter, zoom: 5};
  var map = new google.maps.Map(mapCanvas, mapOptions);
  google.maps.event.addListener(map, 'click', function(event) {
    placeMarker(map, event.latLng);
  });
  var triangleCoords = [
            {lat: 25.774, lng: -80.190},
            {lat: 18.466, lng: -66.118},
            {lat: 32.321, lng: -64.757}
        ];

        // Construct the polygon.
        var bermudaTriangle = new google.maps.Polygon({
          paths: triangleCoords,
          strokeColor: greenColour,
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: greenColour ,
          fillOpacity: 0.35
        });
        bermudaTriangle.setMap(map);

     
}

function placeMarker(map, location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
  var listOfMarkers = convertMarkers(markers);
  if(markers.length > 2){
       if(polygon != null){
	polygon.setMap(null);
       }
       var colour = colourChoose(listOfMarkers);
       polygon = new google.maps.Polygon({
          paths: listOfMarkers,
          strokeColor: colour,
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: colour,
          fillOpacity: 0.35
        });
        polygon.setMap(map);
   }
}

function deleteAllMarkers(){
  for(var i=0;i<markers.length;i++){
    markers[i].setMap(null);
  }
  if(polygon != null){
	polygon.setMap(null);
       }
  markers=[];
}

function convertMarkers(listOfMarkers){
  newMarkers = [];
  listOfMarkers.forEach(function (item) {
       newMarkers.unshift({lat: item.getPosition().lat(), lng: item.getPosition().lng()});
  });
  return newMarkers;
}

function colourChoose(arr){
   return !isRegular(arr) ? redColour : greenColour;
}

var products = []

function isRegular(arr){
	var prodPrev = null;
	for(var p = 1;p < arr.length;p++){
		var p1 = 0;
		var p2 = 0;
		var p3 = 0;
		if(p == arr.length - 1){
		     p1 = arr[p - 1];
		     p2 = arr[p];
		     p3 = arr[0];
		}
		else {
	    	   p1 = arr[p - 1];
		   p2 = arr[p];
		   p3 = arr[p + 1];
		  
		}
 		var ab = 
		{ 
  			lat: p2.lat - p1.lat, 
  			lng: p2.lng - p1.lng
		};

		var bc = 
		{ 
  			lat: p3.lat - p2.lat, 
  			lng: p3.lng - p2.lng
		};

		var product = ab.lat * bc.lng - ab.lng * bc.lat;
		if (prodPrev == null){
			prodPrev = product; 
		}
		else{
		     if(Math.sign(product) != Math.sign(prodPrev)){
			return false;
		     }
		     prodPrev = product; 
		}
	        products.push(prodPrev);	
		
	}
	return true;
}

function getCosByThreePoint(p1,p2,p3){
	p2p1 = getVect(p2,p1);
	p2p3 = getVect(p2,p3);
	p2p1Length = getLength(p2p1);
	p2p3Length = getLength(p2p3);
	production  = scalarProduction(p2p1,p2p3);
	return production/(p2p1Length * p2p3Length)
}

function getVect(p2,pn){
	return { lat: p2.lat - pn.lat , lng: p2.lng - pn.lng };
}

function getLength(point){
   return Math.sqrt(point.lat * point.lat + point.lng * point.lng);
}

function scalarProduction(p1,p2){
   return p1.lat * p2.lat + p1.lng * p2.lng;
}
