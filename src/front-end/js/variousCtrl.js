myApp.controller('MenuController', ['$scope','sessionService','REST', function($scope, sessionService, REST) {


    $scope.currentMenu = 'menu.html';
    $scope.disconnect = function()
    {
        REST.REST('DELETE','auth');
        sessionService.disconnect();
        window.location = '#/';
    };

    if (sessionService.getAuthToken() !== undefined){
        $scope.menu =
            [
                {name: 'Recherche', url: '#/path'},
                {name: 'Mes trajets', url: '#/mycarpoolings'},
                {name: 'Mon compte', url: '#/account'}
            ]
        $scope.connectButton = {
            name: 'Deconnexion'};
    }
    else
        $scope.connectButton = {name: 'Connexion', url: '#/connection'}

}]);

myApp.controller('autocompleteController', function($scope, REST, mapService) {

    $scope.selected = undefined;
    $scope.vehicleToModify = {};

    $scope.getCampuses = function(){
        return REST.REST('GET', 'campuses')
            .then(function(response){
                $scope.campusesTab = response.data.campuses;
            })
    }
    $scope.getCampuses();

    $scope.createRoute = function($item, $model, $label){
        mapService.computeRoute([$model.long, $model.lat]);
    };

    $scope.saveCampus = function($item, $model, user){
        user.FavoriteCampus = $model.idCampus;
    }
});

myApp.controller('accountManagerController', function($scope, REST, sessionService){
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

    $scope.addVehicle = function()
    {
        console.log('add');
        $scope.vehicleToModify = { form: 'addVehicleForm.html'};
        console.log($scope.vehicleToModify);
    }

    $scope.insertInDB = function (vehicle) {
        console.log(vehicle)
        REST.REST('POST','vehicles',vehicle,'json')
            .success(function(data)
            {

                if(data.success === true)
                     alert('Vehiclue inserer');
                else
                    alert('Erreur : ' + data.reasons[0]);
            })
    }

    $scope.deleteVehicle = function()
    {
        console.log('Delete vehicle');
        console.log($scope.vehicleToModify);
        if(confirm("Êtes-vous bien sûr de vouloir effectuer ces modifications ?")){
            REST.REST('DELETE', 'vehicles', $scope.vehicleToModify, 'json')
                .success(function(data){
                    console.log(data);
                    if(data.success === true)
                         alert('Vehicule delete ');
                    else
                        alert('Erreur pendant la suppression');
                }
            )
        }
    }

});

myApp.controller('carpoolingController',function($scope, REST, sessionService)
{
    $scope.checkconnection = function(){
        sessionService.checkConnection();
    }
    $scope.user = {};

    $scope.loadMyCarpooling = function(){
        REST.REST('GET', 'carpoolings')
            .success(function(data){
                console.log($scope.user.offeredcarpooling);
                console.log(data.offeredCarPoolings);
                $scope.user.offeredcarpooling = data.offeredCarPoolings;
                console.log($scope.user.offeredcarpooling);
            });
        //console.log($scope.user.offerdcarpooling);
        //console.log(data.offerdcarpooling);
    };

    $scope.loadMyCarpooling();

    $scope.getCarPooling = function(id){
        for(var i = 0; i < $scope.user.offeredcarpooling.length; ++i)
            if($scope.user.offeredcarpooling[i].idCarPooling == id)
               return $scope.user.offeredcarpooling[i];
    };

    $scope.selectCarPooling = function(){
        console.log('hello');
        console.log($scope.carpoolingSelected);
        $scope.carPoolingToModify = $scope.getCarPooling($scope.carpoolingSelected);
        console.log($scope.carPoolingToModify);
        $scope.carPoolingToModify.form = "carPoolingForm.html";
    };

    $scope.modifyCarPooling = function (carpooling) {
        REST.REST('PUT', 'carpoolings',carpooling, 'json')
            .success(function(data){
                if(data.success === true)
                    alert('Opération réussi');
            })
    }

    $scope.deleteCarPooling = function(carpooling) {
        REST.REST('DELETE', 'carpoolings',carpooling, 'json')
            .success(function(data){
                if(data.success === true)
                    alert('Opération réussi');
            })
    }

    $scope.loadPendCarpooling = function(){
        REST.REST('GET', 'carpoolings')
            .success(function(data){
                console.log($scope.user.cpending);
                console.log(data.waitingCarPoolings);
                $scope.user.cpending = data.waitingCarPoolings;
                console.log($scope.user.cpending);
            });
        //console.log($scope.user.offerdcarpooling);
        //console.log(data.offerdcarpooling);
    };

    $scope.loadPendCarpooling();

    $scope.loadValidCarpooling = function(){
        REST.REST('GET', 'carpoolings')
            .success(function(data){
                console.log($scope.user.cvalid);
                console.log(data.joinedCarPoolings);
                $scope.user.cvalid = data.joinedCarPoolings;
                console.log($scope.user.cvalid);
            });
        //console.log($scope.user.offerdcarpooling);
        //console.log(data.offerdcarpooling);
    };

    $scope.loadValidCarpooling();

    $scope.getPCarPooling = function(id){
        for(var i = 0; i < $scope.user.cpending.length; ++i)
            if($scope.user.cpending[i].idCarPooling == id)
                return $scope.user.cpending[i];
    };

    $scope.selectp = function(){
        console.log('hello');
        console.log($scope.carpooling1Selected);
        $scope.carPendingToModify = $scope.getPCarPooling($scope.carpooling1Selected);
        console.log($scope.carPendingToModify);
        $scope.carPendingToModify.form = "deljoin.html";
    };

    $scope.delv = function(carpooling){
        REST.REST('DELETE', 'carPoolings/join',carpooling, 'json')
            .success(function(data){
                if(data.success === true)
                    alert('Opération réussi');
            })
    }

    $scope.getVCarPooling = function(id){
        for(var i = 0; i < $scope.user.cvalid.length; ++i)
            if($scope.user.cvalid[i].idCarPooling == id)
                return $scope.user.cvalid[i];
    };

    $scope.selectv = function(){
        console.log('hello');
        console.log($scope.carpooling2Selected);
        $scope.carPendingToModify = $scope.getVCarPooling($scope.carpooling2Selected);
        console.log($scope.carPendingToModify);
        $scope.carPendingToModify.form = "comments.html";
        $scope.carPendingToModify.message = undefined;
        $scope.carPendingToModify.markc = 0;
        $scope.carPendingToModify.markd = 0;
    };

    $scope.comment = function(comment){
        REST.REST('POST', 'carPooling/comment',comment, 'json')
            .success(function(data){
                if(data.success === true)
                    alert('Opération réussi');
            })
    }
});