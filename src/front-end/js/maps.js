'use strict';


var myApp = angular.module('Amudrive', []);

myApp.controller('MapController', ['$scope', mapController]);
myApp.factory('MapService', function ($rootScope) {
    var sharedService = {};

    sharedService.message = '';
    sharedService.addressToCoordRequest
});

function mapController ($scope){

    // Informations de bases pour la map (par défaut)
    $scope.zoom = 15;
    $scope.mapTypeId = google.maps.MapTypeId.ROADMAP;
    $scope.defaultLocation = [43.529742, 5.447427];


    // Coordonnées du point courant
    $scope.loc = ($scope.loc == undefined) ? $scope.defaultLocation : $scope.loc;

    // Tableau de marqueurs
    $scope.tabMarker = [];



    $scope.displayMap = function(){
        console.log('DisplayMap : ' + $scope.loc);
        var mapOptions = {
            zoom: $scope.zoom,
            center: new google.maps.LatLng($scope.loc[0], $scope.loc[1]),
            mapTypeId: $scope.mapTypeId
        };

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        $scope.directionsDisplay = new google.maps.DirectionsRenderer(
            {
                'map' : $scope.map
            });

    };

    $scope.displayMap();

    $scope.directionsService = new google.maps.DirectionsService();

    /* Ajoute un marqueur sur la map*/
    $scope.showMarker = function(){

        if($scope.tabMarker.length < 1)
            return false;

        console.log($scope.tabMarker);

        for(var i = 0; i < $scope.tabMarker.length; i += 2) {
            var loc = $scope.tabMarker[i+1];
            var content = $scope.tabMarker[i];

            console.log('loc : ' + loc + ' content : ' + content);

            var infoWindowContent = '<div class="infoWindow"><h1>' + content[0] + '</h1>'
                                    + '<hr/> ' + content[1] + '</div>';


            var infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent
            });

            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(loc[0], loc[1]),
                visible: true,
                title: content[0]
            });

            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(infoWindowContent);
                    infoWindow.open($scope.map, marker);
                }
            })(marker, i));
        }
    };

    // Ajoute un marqueur à la liste des marqueurs courant
    $scope.addMarker = function(content, loc){
        if(content != undefined && loc != undefined)
            $scope.tabMarker.push(content, loc);

        $scope.showMarker();
    };

    $scope.changeZoom = function(zoom){
        $scope.zoom = (zoom == undefined) ? $scope.zoom : zoom;
        $scope.displayMap();
    };

    $scope.changeLocation = function(loc) {
        $scope.loc = (loc == undefined) ? $scope.loc : loc;
        $scope.displayMap();
    };

    $scope.drawCircle = function(loc, radius){
        $scope.circle = new google.maps.Circle(
            {
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: $scope.map,
                center: new google.maps.LatLng(loc[0], loc[1]),
                radius: radius * 1000
            }
        );
    };

    $scope.changeCircleRadius = function(radius){
        $scope.circle.setRadius(radius * 1000);
    };

    $scope.getRadius = function(){
        return $scope.circle.getRadius();
    };

    $scope.computeRoute = function()
    {
        var dep = new google.maps.LatLng($scope.loc[0], $scope.loc[1]);
        var dest = new google.maps.LatLng($scope.defaultLocation[0], $scope.defaultLocation[1]);
            var request = {
                origin: dep,
                destination: dest,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC
            };

            $scope.directionsService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    $scope.directionsDisplay.setDirections(result);
                    $scope.directionsDisplay.suppressMarkers = true;
                    $scope.directionsDisplay.setOptions({
                            markerOptions : google.maps.Animation.BOUNCE,
                            preserveViewport : false
                    });
                }
            });
    };
}

/* Directives */

myApp.directive('googlePlaces', function(){
        return {
            // Remplace l'input google-places par un nouveau (dynamique, permettant l'autocomplete)
            restrict:'EA',
            replace:true,
            template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level searchMap"/>',
            controller: 'MapController',

            link: function($scope, elm, attrs){
                // Activation de l'autocomplétion (Google Maps gère lui-même la liste)
                // Utilisation du selecteur jQuery $('#google_places_ac') en attendant de trouver mieux
                var autocomplete = new google.maps.places.Autocomplete($('#google_places_ac')[0], {});

                // A chaque changement de lieu (clic sur le lieu), déclechement de l'évènement
                google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    // place contient le lieu choisi (type GeoCoderResult)
                    var place = autocomplete.getPlace();

                    // On sauvegarde dans la variable loc du scope un tableau contenant latitude et longitude
                    // du lieu selectionné (pour pouvoir l'utiliser dans map($scope)
                    var loc = [place.geometry.location.lat(),place.geometry.location.lng()];


                    // Chargement de la map
                    $scope.changeLocation(loc);
                    $scope.drawCircle(loc, 3);
                    console.log($scope.getRadius());
                    $scope.changeCircleRadius(0.5);
                    console.log($scope.getRadius());
                    $scope.computeRoute();
                    // Applique les modification du scope et recharge les éléments modifiés
                    $scope.$apply();
                });
            }
        }
    });