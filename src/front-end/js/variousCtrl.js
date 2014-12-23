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

    $scope.addVehicle = function(){
        console.log('add');
        $scope.vehicleToModify = { form: 'addVehicleForm.html'};
        console.log($scope.vehicleToModify);
    };

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
    };

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
    };

    $scope.user = {};
    $scope.campus = {};

    $scope.checkconnection();

    $scope.loadCampuses = function(){
        return REST.REST('GET','campuses')
            .success(function(data){
                $scope.campus = data;
            });
    };

    $scope.loadMyCarpooling = function(){
       return REST.REST('GET', 'carpoolings')
            .success(function(data){
               console.log('loadMyCarPooling');
                console.log(data.offeredCarPoolings);
                $scope.user.offeredcarpooling = data.offeredCarPoolings;
                console.log($scope.user.offeredcarpooling);
               $scope.user.offeredcarpooling.campus
            });
    };

    $scope.loadMyCarpooling();

    $scope.loadMyCarpooling().then(function(){
            $scope.loadCampuses().then(function(){
                console.log("Chargement ...");
                console.log($scope.user);
                for(var i = 0; i < $scope.user.offeredcarpooling.length; ++i){
                    console.log(i);
                    console.log($scope.user.offeredcarpooling[i]);
                    $scope.user.offeredcarpooling[i].campusName = $scope.getCampuses($scope.user.offeredcarpooling[i].idCampus);
                }
                console.log($scope.campus);
                console.log($scope.user);
                $scope.loadPendCarpooling();
                $scope.loadValidCarpooling();
            });
        }
    );

    $scope.getCarPooling = function(id){
        for(var i = 0; i < $scope.user.offeredcarpooling.length; ++i)
            if($scope.user.offeredcarpooling[i].idCarPooling == id)
               return $scope.user.offeredcarpooling[i];
    };

    $scope.getCampuses = function (id) {
        for(var i = 0; i < $scope.campus.campuses.length; ++i){
            if($scope.campus.campuses[i].idCampus === id)
                return $scope.campus.campuses[i].name;
        }
    };


    $scope.selectCarPooling = function(){
        console.log('hello');
        console.log($scope.carpoolingSelected);
        $scope.carPoolingToModify = $scope.getCarPooling($scope.carpoolingSelected);
        //$scope.carPoolingToModify.adrcampus = $scope.getCampuses($scope.carPoolingToModify.idCampus);
        console.log($scope.carPoolingToModify);
        $scope.carPoolingToModify.form = "carPoolingForm.html";
        $scope.loadPPeople($scope.carPoolingToModify);
        $scope.loadVPeople($scope.carPoolingToModify)
    };

    $scope.modifyCarPooling = function (carpooling) {
        REST.REST('PUT', 'carpoolings',carpooling, 'json')
            .success(function(data){
                if(data.success === true)
                    alert('Opération réussi');
            });
    };

    $scope.deleteCarPooling = function(carpooling) {
        REST.REST('DELETE', 'carpoolings',carpooling, 'json')
            .success(function(data){
                if(data.success === true)
                    alert('Opération réussi');
            });
    };

    $scope.loadPendCarpooling = function(){
        REST.REST('GET', 'carpoolings')
            .success(function(data){
                console.log($scope.user.cpending);

                $scope.user.cpending = data.waitingCarPoolings;
                console.log('data');
                console.log(data.waitingCarPoolings);
                for(var i = 0; i < $scope.user.cpending.length; ++i){
                    console.log(i);
                    console.log($scope.user.cpending[i]);
                    $scope.user.cpending[i].campusName = $scope.getCampuses($scope.user.cpending[i].idCampus);
                }
                console.log("lol");
                console.log($scope.user.cpending);
            });
    };



    $scope.loadValidCarpooling = function(){
        REST.REST('GET', 'carpoolings')
            .success(function(data){
                console.log($scope.user.cvalid);
                console.log(data.joinedCarPoolings);
                $scope.user.cvalid = data.joinedCarPoolings;
                for(var i = 0; i < $scope.user.cvalid.length; ++i){
                    console.log(i);
                    console.log($scope.user.cvalid[i]);
                    $scope.user.cvalid[i].campusName = $scope.getCampuses($scope.user.cvalid[i].idCampus);
                }
                console.log($scope.user.cvalid);
            });
    };



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
            });
    };

    $scope.getVCarPooling = function(id){
        for(var i = 0; i < $scope.user.cvalid.length; ++i)
            if($scope.user.cvalid[i].idCarPooling == id ){
              return $scope.user.cvalid[i];
            }

    };

    $scope.getPPeople = function(PCar,idCP,carPoolingToModify)
    {
        $scope.PPeople = [];
        console.log('lsd');
        console.log(carPoolingToModify);
        for(var i = 0; i < PCar.length; ++i)
        {
            for(var j = 0; j < idCP.length; ++j){
                if (PCar[i].idClient === idCP[j].idClient && idCP[j].idCarPooling === carPoolingToModify.idCarPooling)
                {
                    console.log("omg");
                    console.log(PCar[i]);
                    $scope.PPeople.push(PCar[i]);
                }
            }

        }
        return $scope.PPeople;
    }

    $scope.loadPPeople = function(carPoolingToModify){
        return REST.REST('GET', 'carpoolings')
            .success(function(data){
                console.log('loadPPeople');
                console.log(data.pendingPCarPoolings);
                console.log(carPoolingToModify);
                $scope.user.pendingp = $scope.getPPeople(data.pendingPCarPoolings,data.joinCarPoolings,carPoolingToModify);
                console.log($scope.user.pendingp);
            });
    };

    $scope.loadPPeople();


    $scope.loadVPeople = function(carPoolingToModify){
        return REST.REST('GET', 'carpoolings')
            .success(function(data){
                console.log('validatedp');
                console.log(data.validPCarPoolings);
                console.log(carPoolingToModify);
                $scope.user.validatedp = $scope.getPPeople(data.validPCarPoolings,data.joinCarPoolings,carPoolingToModify);
                console.log($scope.user.validatedp);
            });
    };

    $scope.selectv = function(){
        console.log('hello');
        console.log($scope.carpooling2Selected);
        $scope.carPendingToModify = $scope.getVCarPooling($scope.carpooling2Selected);
        console.log($scope.carPendingToModify);
        if(new Date($scope.carPendingToModify.meetTime) < new Date()){
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


    };

    $scope.peding = undefined;

    $scope.validate = function(user)
    {
        $scope.update = {};
        $scope.update.idClient = parseInt(user);
        $scope.update.idCarPooling = $scope.carPoolingToModify.idCarPooling;
        $scope.update.Accepted = true;
        console.log( $scope.update);
        REST.REST('PUT','carPooling/join',$scope.update)
            .success(function (data) {
                if(data.success === true)
                {
                    $scope.up = {};
                    $scope.up.idCarPooling = $scope.carPoolingToModify.idCarPooling;
                    $scope.up.Room = $scope.carPoolingToModify.room - 1;
                    $scope.up.Luggage = $scope.carPoolingToModify.luggage;

                    console.log('GG Dude :');
                    console.log($scope.up);
                    REST.REST('PUT', 'carPoolings',$scope.up)
                        .success(function(data){
                            if(data.success === true){
                                alert('Opération faite')
                                window.location.reload();
                            }
                        })
                }
            })
    }



});