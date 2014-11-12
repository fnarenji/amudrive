'use strict';


var myApp = angular.module('Amudrive', []);

myApp.controller('MapController', function($scope){
    $scope.zoom = 15;
    $scope.mapTypeId = google.maps.MapTypeId.ROADMAP;
    $scope.defaultLocation = [43.529742, 5.447427];


    $scope.createMap = function(loc){

        if($scope.loc == undefined && loc == undefined)
            $scope.loc = $scope.defaultLocation;

        else if (loc != $scope.defaultLocation && loc != undefined && $scope.loc == undefined || $scope.loc == $scope.defaultLocation)
            $scope.loc = [loc[0], loc[1]];

        else if($scope.loc != $scope.defaultLocation && loc != undefined)
            $scope.loc = [loc[0], loc[1]];

        else
            $scope.loc = $scope.defaultLocation;

        var mapOptions = {
            zoom: $scope.zoom,
            center: new google.maps.LatLng($scope.loc[0], $scope.loc[1]),
            mapTypeId: $scope.mapTypeId
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

       var infoWindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng($scope.loc[0], $scope.loc[1]),
            visible: true,
            title : "Bienvenue à "
        });

        marker.content = '<div class="infoWindowContent"> #SWAG land !</div>';

        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });

    }
});

/* Directives */

myApp.directive('googlePlaces', function(){
        return {
            // Remplace l'input google-places par un nouveau (dynamique, permettant l'autocomplete)
            restrict:'EA',
            replace:true,
            scope: {location:'='},
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
                    $scope.createMap(loc);

                    // Applique les modification du scope et recharge les éléments modifiés
                    $scope.$apply();
                });
            }
        }
    });