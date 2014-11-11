'use strict';

var loc = [43.529742, 5.447427];

angular.module('Amudrive', ['AmudriveDirectives']);

/* Controllers */
function SearchForm($scope){


    $scope.showMap = function(){
            map($scope);
    };
}

function map($scope){


    if($scope.loc == undefined)
        $scope.loc = loc;
    else
        loc = $scope.loc;

    var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng($scope.loc[0], $scope.loc[1]),
        mapTypeId: google.maps.MapTypeId.ROADMAP
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
/* Directives */
angular.module('AmudriveDirectives', []).
    directive('googlePlaces', function(){
        return {
            // Remplace l'input google-places par un nouveau (dynamique, permettant l'autocomplete)
            restrict:'EA',
            replace:true,
            scope: {location:'='},
            template: '<input id="google_places_ac" name="google_places_ac" type="text" class="input-block-level searchMap"/>',

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
                    $scope.loc = [place.geometry.location.lat(),place.geometry.location.lng()];

                    // Chargement de la map
                    map($scope);

                    // Applique les modification du scope et recharge les éléments modifiés
                    $scope.$apply();
                });
            }
        }
    });