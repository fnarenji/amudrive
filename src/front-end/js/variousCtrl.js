myApp.controller('MenuController', ['$scope', function($scope) {
    $scope.menu =
        [
         {name: 'Recherche', url: '#/path'},
         {name: 'Trajets', url: '#/mycarpoolings'},
         {name: 'Mon Compte', url: '#/account'}
        ];
    $scope.connectButton = {name :'Connexion', url: '#/connection'};
}]);

myApp.controller('autocompleteController', function($scope, REST, mapService) {

    $scope.selected = undefined;

    $scope.getCampuses = function(){
        return REST.REST('GET', 'campuses')
            .then(function(response){
                $scope.campusesTab = response.data.campuses;
            })
    }

    $scope.getCampuses();

    $scope.createRoute = function($item, $model){
        mapService.computeRoute([$model.long, $model.lat]);
    };

});

myApp.controller('accountManagerController', function($scope, REST, sessionService){
    $scope.getInfos = function(){
            REST.REST('GET', 'client', sessionService.getAuthToken())
                .success(function(data){
                   console.log(data);
                });
    };
});

myApp.service('placesService', function(){
   placesService = new Object();
   placesService.loc = [];

   placesService.setLoc = function(loc){placesService.loc = loc;};
   placesService.getLoc = function(){return placesService.loc;};

   return placesService;
});