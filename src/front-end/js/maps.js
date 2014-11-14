'use strict';


var myApp = angular.module('Amudrive', []);

myApp.controller('MapController', ['$scope', mapController])

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

    };

    $scope.displayMap();
    /* Ajoute un marqueur sur la map*/

    $scope.showMarker = function(){

        if($scope.tabMarker.length < 1)
            return false;

        console.log($scope.tabMarker);

        for(var i = 0; i < $scope.tabMarker.length; i += 2) {
            var loc = $scope.tabMarker[i+1];
            var content = $scope.tabMarker[i];

            console.log('loc : ' + loc + ' content : ' + content);
            var infoWindow = new google.maps.InfoWindow();

            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(loc[0], loc[1]),
                visible: true,
                title: content[0]
            });

            marker.content = '<div class="infoWindowContent">' + content[1] + '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
            });
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
                    $scope.addMarker(['Bienvenue', 'Bonjour !'], loc);
                    //$scope.testMarker();
                    // Applique les modification du scope et recharge les éléments modifiés
                    $scope.$apply();
                });
            }
        }
    });