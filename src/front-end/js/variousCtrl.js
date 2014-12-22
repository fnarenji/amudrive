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

    $scope.loadVehicles = function(){
        REST.REST('GET', 'vehicles')
            .success(function(data){
                $scope.user.vehicles = data.vehicles;
            });
    };

    $scope.loadInfos = function(){
        $scope.user = sessionService.getInfos();
    };

    $scope.setMailHash = function(){
        $scope.user.hash = CryptoJS.MD5(sessionService.getInfos().mail).toString();
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

    sessionService.loadInfos().then(function(){
        console.log(sessionService.getInfos());
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
        REST.REST('POST','vehicles',vehicle,'json')
            .success(function(data){
                if(data.success === true){
                    alert('Véhicule inséré');
                    window.location.reload();
                }
                else
                    alert('Erreur : ' + data.reasons[0]);
            })
    }

    $scope.deleteVehicle = function()
    {
        if(confirm("Êtes-vous bien sûr de vouloir effectuer ces modifications ?")){
            REST.REST('DELETE', 'vehicles', $scope.vehicleToModify, 'json')
                .success(function(data){
                    if(data.success === true){
                        alert('Véhicule supprimé');
                        window.location.reload();
                    }
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
    $scope.campus = {};

    $scope.checkconnection();

    $scope.loadCampuses = function()
    {
        return REST.REST('GET','campuses')
            .success(function(data)
            {
                $scope.campus = data;
            });
    };



    $scope.loadMyCarpooling = function(){
       return REST.REST('GET', 'carpoolings')
            .success(function(data){
                console.log($scope.user.offeredcarpooling);
                console.log(data.offeredCarPoolings);
                $scope.user.offeredcarpooling = data.offeredCarPoolings;
                console.log($scope.user.offeredcarpooling);
               $scope.user.offeredcarpooling.campus
            });

        //console.log($scope.user.offerdcarpooling);
        //console.log(data.offerdcarpooling);
    };

    $scope.loadMyCarpooling();

    $scope.loadMyCarpooling().then(function()
        {
            console.log($scope.campus);
            $scope.loadCampuses().then(function()
            {
                console.log($scope.campus);
            });

        }
    );

    $scope.getCarPooling = function(id){
        for(var i = 0; i < $scope.user.offeredcarpooling.length; ++i)
            if($scope.user.offeredcarpooling[i].idCarPooling == id)
               return $scope.user.offeredcarpooling[i];
    };

    $scope.getCampuses = function (id) {
        console.log('ANGULAR = PLS');
        console.log($scope.campus.campuses.length);
        for(var i = 0; i < $scope.campus.campuses.length; ++i)
        {
            if($scope.campus.campuses[i].idCampus === id)
                return $scope.campus.campuses[i].address;
        }
    };


    $scope.selectCarPooling = function(){
        console.log('hello');
        console.log($scope.carpoolingSelected);
        $scope.carPoolingToModify = $scope.getCarPooling($scope.carpoolingSelected);
        $scope.carPoolingToModify.adrcampus = $scope.getCampuses($scope.carPoolingToModify.idCampus);
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
            if($scope.user.cvalid[i].idCarPooling == id ){
              return $scope.user.cvalid[i];
            }

    };

    $scope.selectv = function(){
        console.log('hello');
        console.log($scope.carpooling2Selected);
        $scope.carPendingToModify = $scope.getVCarPooling($scope.carpooling2Selected);
        console.log($scope.carPendingToModify);
        if(new Date($scope.carPendingToModify.meetTime) < new Date()) {
            $scope.carPendingToModify.form = "comments.html";
            $scope.carPendingToModify.message = undefined;
            $scope.carPendingToModify.markc = 0;
            $scope.carPendingToModify.markd = 0;
        }
        else
            alert('Vous ne pouvez commenter un co-voiturage non terminé');
    };

    $scope.comment = function(comment){
        if(new Date(comment.meetTime) < new Date())
            REST.REST('POST', 'carPooling/comment',comment, 'json')
                .success(function(data){
                    if(data.success === true)
                        alert('Opération réussi');
                })


    }
});