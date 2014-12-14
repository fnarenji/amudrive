'use strict';

myApp.controller('MapController', ['$scope','Map', mapController]);

myApp.factory('MapService', function ($rootScope) {
    var sharedService = {};

    sharedService.message = '';
    sharedService.addressToCoordRequest
});
function mapController($scope, Map){
    Map.displayMap();
}
/* Directives */

myApp.directive('googlePlaces', function(Map){
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
                    Map.changeLocation(loc);
                    Map.drawCircle(loc, 3);

                    console.log(Map.getRadius());
                    Map.changeCircleRadius(0.5);

                    console.log(Map.getRadius());
                    Map.computeRoute();
                    Map.displayMap();
                });
            }
        }
    });