

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
   return (arr.length % 2 == 0) ? redColour : greenColour;
}

function fromKelvinToCelsium(temperature){
  return Math.round(temperature-273.15);
}
