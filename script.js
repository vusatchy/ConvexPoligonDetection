

var markers=[];

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
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
        bermudaTriangle.setMap(map);

        // Add a listener for the click event.
    

        infoWindow = new google.maps.InfoWindow;
}

function placeMarker(map, location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
  $.getJSON(url,data=>{
    info=''
    var infowindow = new google.maps.InfoWindow({
        content: info
    });
    infowindow.open(map,marker);
  });
}

function deleteAllMarkers(){
  for(var i=0;i<markers.length;i++){
    markers[i].setMap(null);
  }
  markers=[];
}

function fromKelvinToCelsium(temperature){
  return Math.round(temperature-273.15);
}
