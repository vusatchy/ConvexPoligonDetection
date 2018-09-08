var markers = [];
var redColour = '#FF0000';
var greenColour = '#1ee804';
var polygon = null;

$("#buttonDelete").on("click", deleteAllMarkers);


function initMap() {

    var mapCanvas = document.getElementById("map");
    var myCenter = new google.maps.LatLng(24.886, -70.268);
    var mapOptions = {
        center: myCenter,
        zoom: 5
    };

    var map = new google.maps.Map(mapCanvas, mapOptions);
    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(map, event.latLng);
    });

}

function placeMarker(map, location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
    var listOfMarkers = convertMarkers(markers);
    if (markers.length > 2) {
        if (polygon != null) {
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

function deleteAllMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    if (polygon != null) {
        polygon.setMap(null);
    }
    markers = [];
}

function convertMarkers(listOfMarkers) {
    newMarkers = [];
    listOfMarkers.forEach(function(item) {
        newMarkers.unshift({
            lat: item.getPosition().lat(),
            lng: item.getPosition().lng()
        });
    });
    return newMarkers;
}

function colourChoose(arr) {
    return isRegular(arr) ? greenColour : redColour ;
}


function isRegular(arr) {
    var prodPrev = null;
    for (var p = 1; p < arr.length; p++) {
        var p1 = 0;
        var p2 = 0;
        var p3 = 0;
        if (p == arr.length - 1) {
            p1 = arr[p - 1];
            p2 = arr[p];
            p3 = arr[0];
        } else {
            p1 = arr[p - 1];
            p2 = arr[p];
            p3 = arr[p + 1];

        }
        var ab = {
            lat: p2.lat - p1.lat,
            lng: p2.lng - p1.lng
        };

        var bc = {
            lat: p3.lat - p2.lat,
            lng: p3.lng - p2.lng
        };

        var product = ab.lat * bc.lng - ab.lng * bc.lat;
        if (prodPrev == null) {
            prodPrev = product;
        } else {
            if (Math.sign(product) != Math.sign(prodPrev)) {
                return false;
            }
            prodPrev = product;
        }
       
    }
    return true;
}
