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

    $scope.saveCampus = function($item, $model, user){
        user.FavoriteCampus = $model.idCampus;
    }
});

myApp.controller('accountManagerController', function($scope, REST, sessionService, $http){
    $scope.checkconnection = function(){
        sessionService.checkConnection();
    }
    $scope.user = {};

    $scope.getInfos = function(){
        return REST.REST('GET', 'client')
            .success(function(data){
               $scope.infos = data.client;
            });
    };

    $scope.loadVehicles = function(){
        REST.REST('GET', 'vehicles')
            .success(function(data){
                $scope.user.vehicles = data.vehicles;
            });
    };

    $scope.loadInfos = function(){
      var user = $scope.infos;

      $scope.user = user;
    };

    $scope.setMailHash = function(){
        $scope.user.hash = CryptoJS.MD5($scope.infos.mail).toString();
    };
    $scope.modify = function(){
        if(confirm("Êtes-vous bien sûr de vouloir effectuer ces modifications ?")){
            REST.REST('PUT', 'client', $scope.user, 'json')
                .success(function(){
                    alert('Les informations ont bien été modifié');
                })
        }
    };
    $scope.getInfos().then(function(){
        console.log($scope.infos);
        $scope.loadInfos();
        $scope.setMailHash();
        $scope.loadVehicles();
    });
});