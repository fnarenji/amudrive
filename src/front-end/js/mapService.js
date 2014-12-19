myApp.service('mapService', function(){
    //To avoid this context conflicts
    MapService = new Object();

    // Informations de bases pour la map (par défaut)
    MapService.zoom = 15;
    MapService.mapTypeId = google.maps.MapTypeId.ROADMAP;
    MapService.defaultLocation = [43.529742, 5.447427];


    // Coordonnées du point courant
    MapService.loc = (MapService.loc == undefined) ? MapService.defaultLocation : MapService.loc;

    // Tableau de marqueurs
    MapService.tabMarker = [];



    MapService.displayMap = function(){
        console.log('DisplayMap : ' + MapService.loc);
        var mapOptions = {
            zoom: MapService.zoom,
            center: new google.maps.LatLng(MapService.loc[0], MapService.loc[1]),
            mapTypeId: MapService.mapTypeId
        };

        MapService.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        MapService.directionsDisplay = new google.maps.DirectionsRenderer(
            {
                'map' : MapService.map
            });

    };

    MapService.directionsService = new google.maps.DirectionsService();

    /* Ajoute un marqueur sur la map*/
    MapService.showMarker = function(){

        if(MapService.tabMarker.length < 1)
            return false;

        console.log(MapService.tabMarker);

        for(var i = 0; i < MapService.tabMarker.length; i += 2) {
            var loc = MapService.tabMarker[i+1];
            var content = MapService.tabMarker[i];

            console.log('loc : ' + loc + ' content : ' + content);

            var infoWindowContent = '<div class="infoWindow"><h1>' + content[0] + '</h1>'
                + '<hr/> ' + content[1] + '</div>';


            var infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent
            });

            var marker = new google.maps.Marker({
                map: MapService.map,
                position: new google.maps.LatLng(loc[0], loc[1]),
                visible: true,
                title: content[0]
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(infoWindowContent);
                    infoWindow.open(MapService.map, marker);
                }
            })(marker, i));
        }
    };

    // Ajoute un marqueur à la liste des marqueurs courant
    MapService.addMarker = function(content, loc){
        if(content != undefined && loc != undefined)
            MapService.tabMarker.push(content, loc);

        MapService.showMarker();
    };

    MapService.changeZoom = function(zoom){
        MapService.zoom = (zoom == undefined) ? MapService.zoom : zoom;
        //MapService.displayMap();
    };

    MapService.changeLocation = function(loc) {
        MapService.loc = (loc == undefined) ? MapService.loc : loc;
        //MapService.displayMap();
    };

    MapService.drawCircle = function(loc, radius){
        MapService.circle = new google.maps.Circle(
            {
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: MapService.map,
                center: new google.maps.LatLng(loc[0], loc[1]),
                radius: radius * 1000
            }
        );
    };

    MapService.changeCircleRadius = function(radius){
        MapService.circle.setRadius(radius * 1000);
    };

    MapService.getRadius = function(){
        return MapService.circle.getRadius();
    };

    MapService.computeRoute = function(loc){
        console.log(loc);
        var dep = new google.maps.LatLng(MapService.loc[0], MapService.loc[1]);
        var dest = new google.maps.LatLng(loc[0], loc[1]);
        var request = {
            origin: dep,
            destination: dest,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC
        };

        MapService.directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                MapService.directionsDisplay.setDirections(result);
                MapService.directionsDisplay.suppressMarkers = true;
                MapService.directionsDisplay.setOptions({
                    markerOptions : google.maps.Animation.BOUNCE,
                    preserveViewport : false
                });
            }
        });
    };

    /*MapService.addressToCoordinates = function(address){
        new google.maps.Geocoder().geocode( { 'address': address }, function(results, status) {
            //if (status == google.maps.GeocoderStatus.OK) {
                console.log(results);
                return results[0].geometry.loc;
            //}
        });
        //return loc;
    };*/

    return MapService;
});