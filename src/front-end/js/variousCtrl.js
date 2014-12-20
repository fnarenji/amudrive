myApp.controller('MenuController', ['$scope','sessionService','REST', function($scope,sessionService,REST) {


    $scope.currentMenu = 'menu.html';
    $scope.disconnect = function()
    {
        REST.REST('DELETE','auth');
        sessionService.setAuthToken(undefined);
        window.location = '#/index.html';
    };

    if (sessionService.getAuthToken() == undefined) {

        $scope.menu =
            [
                {name: '    ', url: ''},
                {name: '    ', url: ''},
                {name: '    ', url: ''}
            ]
        $scope.connectButton = {name: 'Connexion', url: '#/connection'}


    }
    else {
        $scope.menu =
            [
                {name: '', url: ''},
                {name: 'Mes trajets', url: '#/mycarpoolings'},
                {name: 'Mon compte', url: '#/account'}
            ]
        $scope.connectButton = {
            name: 'Deconnexion'};
    }

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
                    alert('Les informations ont bien été modifiées');
                })
        }
    };

    $scope.getVehicles = function(id){
        for(var i = 0; i < $scope.user.vehicles.length; ++i)
            if($scope.user.vehicles[i].idVehicle == id)
                return $scope.user.vehicles[i];
    };

    $scope.selectVehicle = function(){
        console.log('hello');
        console.log($scope.vehiculeSelected);
        $scope.vehicleToModify = $scope.getVehicles($scope.vehiculeSelected);
        console.log($scope.vehicleToModify);
        $scope.vehicleToModify.form = "vehicleForm.html";
    };

    $scope.modifyVehicle = function(){
      console.log('modifyVehicle');
      $scope.vehicleToModify.form = undefined;

      if(confirm("Êtes-vous bien sûr de vouloir effectuer ces modifications ?")){
          REST.REST('PUT', 'vehicles', $scope.vehicleToModify, 'json')
              .success(function(){
                 alert('Les informations ont bien été modifiées');
              });
      }
      console.log($scope.vehicleToModify);
    };

    $scope.getInfos().then(function(){
        console.log($scope.infos);
        $scope.loadInfos();
        $scope.setMailHash();
        $scope.loadVehicles();
    });
});