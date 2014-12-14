myApp.service('Map', function(){
    //To avoid this context conflicts
    that = this;

    // Informations de bases pour la map (par défaut)
    that.zoom = 15;
    that.mapTypeId = google.maps.MapTypeId.ROADMAP;
    that.defaultLocation = [43.529742, 5.447427];


    // Coordonnées du point courant
    that.loc = (that.loc == undefined) ? that.defaultLocation : that.loc;

    // Tableau de marqueurs
    that.tabMarker = [];



    that.displayMap = function(){
        console.log('DisplayMap : ' + that.loc);
        var mapOptions = {
            zoom: that.zoom,
            center: new google.maps.LatLng(that.loc[0], that.loc[1]),
            mapTypeId: that.mapTypeId
        };

        that.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        that.directionsDisplay = new google.maps.DirectionsRenderer(
            {
                'map' : that.map
            });

    };

    that.directionsService = new google.maps.DirectionsService();

    /* Ajoute un marqueur sur la map*/
    that.showMarker = function(){

        if(that.tabMarker.length < 1)
            return false;

        console.log(that.tabMarker);

        for(var i = 0; i < that.tabMarker.length; i += 2) {
            var loc = that.tabMarker[i+1];
            var content = that.tabMarker[i];

            console.log('loc : ' + loc + ' content : ' + content);

            var infoWindowContent = '<div class="infoWindow"><h1>' + content[0] + '</h1>'
                + '<hr/> ' + content[1] + '</div>';


            var infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent
            });

            var marker = new google.maps.Marker({
                map: that.map,
                position: new google.maps.LatLng(loc[0], loc[1]),
                visible: true,
                title: content[0]
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(infoWindowContent);
                    infoWindow.open(that.map, marker);
                }
            })(marker, i));
        }
    };

    // Ajoute un marqueur à la liste des marqueurs courant
    that.addMarker = function(content, loc){
        if(content != undefined && loc != undefined)
            that.tabMarker.push(content, loc);

        that.showMarker();
    };

    that.changeZoom = function(zoom){
        that.zoom = (zoom == undefined) ? that.zoom : zoom;
        //that.displayMap();
    };

    that.changeLocation = function(loc) {
        that.loc = (loc == undefined) ? that.loc : loc;
        //that.displayMap();
    };

    that.drawCircle = function(loc, radius){
        that.circle = new google.maps.Circle(
            {
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: that.map,
                center: new google.maps.LatLng(loc[0], loc[1]),
                radius: radius * 1000
            }
        );
    };

    that.changeCircleRadius = function(radius){
        that.circle.setRadius(radius * 1000);
    };

    that.getRadius = function(){
        return that.circle.getRadius();
    };

    that.computeRoute = function(){
        var dep = new google.maps.LatLng(that.loc[0], that.loc[1]);
        var dest = new google.maps.LatLng(that.defaultLocation[0], that.defaultLocation[1]);
        var request = {
            origin: dep,
            destination: dest,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC
        };

        that.directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                that.directionsDisplay.setDirections(result);
                that.directionsDisplay.suppressMarkers = true;
                that.directionsDisplay.setOptions({
                    markerOptions : google.maps.Animation.BOUNCE,
                    preserveViewport : false
                });
            }
        });
    };

    that.addressToCoordinates = function(address){
        location = undefined;
        new google.maps.Geocoder().geocode( { 'address': address }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                location = results[0].geometry.location;
            }
        });
        return location;
    };
});