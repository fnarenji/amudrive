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

    MapService.gm = google.maps;

    markerCallback = function () {};

    var markers = [];

    MapService.displayMap = function(){
        console.log('DisplayMap : ' + MapService.loc);
        var mapOptions = {
            zoom: MapService.zoom,
            center: new google.maps.LatLng(MapService.loc[0], MapService.loc[1]),
            mapTypeId: MapService.mapTypeId
        };



        MapService.map = new MapService.gm.Map(document.getElementById('map'), mapOptions);

        MapService.directionsDisplay = new google.maps.DirectionsRenderer(
            {
                'map' : MapService.map
            });

        MapService.oms = new OverlappingMarkerSpiderfier(MapService.map);

        var iw = new MapService.gm.InfoWindow();

        MapService.oms.addListener('spiderfy', function(markers) {
            iw.close();
        });

    };

    MapService.changeCampus = function(loc){
      MapService.campus = loc;
    };

    MapService.directionsService = new google.maps.DirectionsService();

    // Ajoute un marqueur à la liste des marqueurs courant
    MapService.addMarker = function(content, loc, json){
        var marker = new google.maps.Marker({
            map: MapService.map,
            position: loc,
            title: "SWAG",
            json: json
        });

        var infoWindowContent = '<div class="infoWindow"><h1>' + content + '</h1>' + content + '</div>';


        var infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
        });

        google.maps.event.addListener(marker, 'click', function (marker) {
            return function() {
                markerCallback(marker.json);
                $('#search-panel').css('display', 'block');
                $('#search-panel-date').css('display', 'block');
            }
        }(marker));

        markers.push(marker);
        markerCallback(null);
    };

    MapService.clearMarkers = function () {
        for (var i = 0; i < MapService.tabMarker.length; ++i) {
            markers[i].setMap(null);
        }
        markers = [];
    };

    MapService.setMarkerCallback = function (callback) {
        markerCallback = callback;
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
        if (typeof MapService.circle !== 'undefined') // such js
            MapService.circle.setMap(null); // Remove current circle

        MapService.circle = new google.maps.Circle(
            {
                strokeColor: '#0000FF',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#0000FF',
                fillOpacity: 0.35,
                map: MapService.map,
                center: new google.maps.LatLng(loc[0], loc[1]),
                radius: radius
            }
        );
    };

    MapService.changeCircleRadius = function(radius){
        MapService.circle.setRadius(radius);
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

    return MapService;
});