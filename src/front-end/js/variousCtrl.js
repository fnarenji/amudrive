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
                console.log(response.data);
                $scope.campusesTab = response.data.campuses;
            })
    }

    $scope.getCampuses();

    $scope.createRoute = function($item, $model, $label){
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