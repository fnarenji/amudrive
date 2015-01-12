myApp.controller('MenuController', ['$scope','sessionService','REST', function($scope, sessionService, REST) {


    $scope.currentMenu = 'html/menu.html';
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
                {name: 'Mon compte', url: '#/account'},
                {name: 'Mes Covoiturages', url:'#/manage'},
                {name: 'Mes Participations', url: '#/participate'}
            ]
        $scope.connectButton = {
            name: 'Deconnexion'};
    }
    else
    {
        $scope.connectButton = {name: 'Connexion', url: '#/connection'}
        $scope.isRegisterVisible = true;
        $scope.registerButton = {name : 'Inscription', url: '#/registration'}
    }


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

myApp.controller('accountManagerController', function($scope, REST, sessionService, alertService){

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
                    alertService.displayMessage('Les informations ont bien été modifiées');
                })
        }
    };

    $scope.getVehicles = function(id){
        for(var i = 0; i < $scope.user.vehicles.length; ++i)
            if($scope.user.vehicles[i].idVehicle == id)
                return $scope.user.vehicles[i];
    };

    $scope.selectVehicle = function(){
        $scope.vehicleToModify = $scope.getVehicles($scope.vehiculeSelected);
        $scope.vehicleToModify.form = "html/vehicleForm.html";
    };

    $scope.modifyVehicle = function(){
      $scope.vehicleToModify.form = undefined;
      if(confirm("Êtes-vous bien sûr de vouloir effectuer ces modifications ?")){
          REST.REST('PUT', 'vehicles', $scope.vehicleToModify, 'json')
              .success(function(){
                 alertService.displayMessage('Les informations ont bien été modifiées');
              });
      }
    };

    sessionService.loadInfos().then(function(){
        console.log(sessionService.getInfos());
        $scope.loadInfos();
        $scope.setMailHash();
        $scope.loadVehicles();
    });

    $scope.addVehicle = function(){
        $scope.vehicleToModify = { form: 'html/addVehicleForm.html'};
    };

    $scope.insertInDB = function (vehicle) {
        REST.REST('POST','vehicles',vehicle,'json')
            .success(function(data){
                if(data.success === true){
                    alertService.displayMessage('Véhicule inséré');
                    window.location.reload();
                }
                else
                    alertService.displayMessage('Erreur : ' + data.reasons[0]);
            })
    };

    $scope.deleteVehicle = function()
    {
        if(confirm("Êtes-vous bien sûr de vouloir effectuer ces modifications ?")){
            REST.REST('DELETE', 'vehicles', $scope.vehicleToModify, 'json')
                .success(function(data){
                    if(data.success === true){
                        alertService.displayMessage('Véhicule supprimé');
                        window.location.reload();
                    }
                }
            )
        }
    }

});

myApp.controller('carpoolingController',function($scope, REST, sessionService, alertService) {
    $scope.checkconnection = function(){
        sessionService.checkConnection();
    };

    $scope.user = {};
    $scope.campus = {};
    $scope.peding = undefined;
    $scope.displayComments = true;

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
               $scope.user.offeredcarpooling = data.offeredCarPoolings;

               for(var i = 0; i <= data.offeredCarPoolings.length; ++i){
                   d = new Date(data.offeredCarPoolings[i].meetTime);

                   var yyyy = d.getFullYear().toString();
                   var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
                   mm = (mm < 10) ? '0' + mm : mm;
                   var dd  = d.getDate().toString();
                   var hh = d.getHours().toString();
                   var mmm = d.getMinutes().toString();
                   mmm = (mmm < 10) ? '0' + mmm : mmm;
                   var dateToString = dd + '/' + mm + '/' + yyyy + ' ' + hh + 'h' + mmm;

                   $scope.user.offeredcarpooling[i].time = dateToString;
               }
            });
    };

   $scope.loadFirst = function(){
           $scope.loadMyCarpooling().then(function(){
                $scope.loadCampuses().then(function(){
                    for(var i = 0; i < $scope.user.offeredcarpooling.length; ++i)
                        $scope.user.offeredcarpooling[i].campusName = $scope.getCampuses($scope.user.offeredcarpooling[i].idCampus);

                    $scope.loadPendCarpooling();
                    $scope.loadValidCarpooling();
                });
            }
        );
   };

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


    $scope.selectCarPooling = function(id){
        $scope.carPoolingToModify = $scope.getCarPooling(id);
        $scope.loadComments($scope.carPoolingToModify);
        $scope.carPoolingToModify.form = "html/carPoolingForm.html";
        $scope.loadPPeople($scope.carPoolingToModify);
        $scope.loadVPeople($scope.carPoolingToModify)
    };

    $scope.modifyCarPooling = function (carpooling) {
        REST.REST('PUT', 'carpoolings',carpooling, 'json')
            .success(function(data){
                if(data.success === true)
                    alertService.displayMessage('Opération réussi');
            });
    };

    $scope.deleteCarPooling = function(carpooling) {
        REST.REST('DELETE', 'carpoolings',carpooling, 'json')
            .success(function(data){
                if(data.success === true)
                   window.location.reload();
            });
    };

    $scope.loadPendCarpooling = function(){
        REST.REST('GET', 'carpoolings')
            .success(function(data){
                $scope.user.cpending = data.waitingCarPoolings;
                console.log($scope.user.cpending);
                for(var i = 0; i <= $scope.user.cpending.length; ++i){
                    $scope.user.cpending[i].campusName = $scope.getCampuses($scope.user.cpending[i].idCampus);
                    var d = new Date($scope.user.cpending[i].meetTime);

                    var yyyy = d.getFullYear().toString();
                    var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
                    mm = (mm < 10) ? '0' + mm : mm;
                    var dd  = d.getDate().toString();
                    var hh = d.getHours().toString();
                    var mmm = d.getMinutes().toString();
                    mmm = (mmm < 10) ? '0' + mmm : mmm;
                    var dateToString = dd + '/' + mm + '/' + yyyy + ' ' + hh + 'h' + mmm;

                    $scope.user.cpending[i].time = dateToString;

                }

            });
    };

    $scope.loadValidCarpooling = function(){
        REST.REST('GET', 'carpoolings')
            .success(function(data){
                $scope.user.cvalid = data.joinedCarPoolings;

                for(var i = 0; i <= $scope.user.cvalid.length; ++i) {
                    $scope.user.cvalid[i].campusName = $scope.getCampuses($scope.user.cvalid[i].idCampus);
                    var d = new Date($scope.user.cvalid[i].meetTime);

                    var yyyy = d.getFullYear().toString();
                    var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
                    mm = (mm < 10) ? '0' + mm : mm;
                    var dd  = d.getDate().toString();
                    var hh = d.getHours().toString();
                    var mmm = d.getMinutes().toString();
                    mmm = (mmm < 10) ? '0' + mmm : mmm;
                    var dateToString = dd + '/' + mm + '/' + yyyy + ' ' + hh + 'h' + mmm;

                    $scope.user.cvalid[i].time = dateToString;

                }
            });
    };

    $scope.getPCarPooling = function(id){
        for(var i = 0; i < $scope.user.cpending.length; ++i)
            if($scope.user.cpending[i].idCarPooling == id)
                return $scope.user.cpending[i];
    };

    $scope.selectp = function(id){
        $scope.carPendingToModify = $scope.getPCarPooling(id);
        $scope.carPendingToModify.form = "html/deljoin.html";
    };

    $scope.delv = function(carpooling){
        REST.REST('DELETE', 'carPoolings/join',carpooling, 'json')
            .success(function(data){
                if(data.success === true)
                    alertService.displayMessage('Opération réussi');
            });
    };

    $scope.getVCarPooling = function(id){
        for(var i = 0; i < $scope.user.cvalid.length; ++i)
            if($scope.user.cvalid[i].idCarPooling == id ){
              return $scope.user.cvalid[i];
            }

    };

    $scope.getPPeople = function(PCar, idCP, carPoolingToModify)
    {
        $scope.PPeople = [];
        for(var i = 0; i < PCar.length; ++i)
        {
            for(var j = 0; j < idCP.length; ++j){
                if (PCar[i].idClient === idCP[j].idClient && idCP[j].idCarPooling === carPoolingToModify.idCarPooling)
                    $scope.PPeople.push(PCar[i]);
            }

        }
        return $scope.PPeople;
    }

    $scope.loadPPeople = function(carPoolingToModify){
        return REST.REST('GET', 'carpoolings')
            .success(function(data){
                $scope.user.pendingp = $scope.getPPeople(data.pendingPCarPoolings,data.joinCarPoolings,carPoolingToModify);
            });
    };

    $scope.loadPPeople();


    $scope.loadVPeople = function(carPoolingToModify){
        return REST.REST('GET', 'carpoolings')
            .success(function(data){
                $scope.user.validatedp = $scope.getPPeople(data.validPCarPoolings,data.joinCarPoolings,carPoolingToModify);
            });
    };

    $scope.selectv = function(id){
        $scope.carPendingToModify = $scope.getVCarPooling(id);
        console.log('selectv');
        console.log($scope.carPendingToModify);

        // Fixe Date() js :)
        var carPoolingDate = new Date($scope.carPendingToModify.meetTime);
        carPoolingDate.setHours(carPoolingDate.getHours() - 1);

        var today = new Date();
        today.setHours(today.getHours() - 1);

        if(carPoolingDate < today){
            $scope.carPendingToModify.form = "html/comments.html";
            $scope.carPendingToModify.message = undefined;
            $scope.carPendingToModify.markc = 0;
            $scope.carPendingToModify.markd = 0;
        }
        else
            alertService.displayMessage('Vous ne pouvez commenter un co-voiturage non terminé');

    };

    $scope.comment = function(comment){
        if(new Date(comment.meetTime) < new Date()){
            var newComment = {
                'OwnerId': comment.idClient,
                'IdCarPooling': comment.idCarPooling,
                'comment': comment.message,
                'driverMark': comment.markd,
                'poolingMark': comment.markc
            };
            REST.REST('POST', 'carPooling/comment', newComment, 'json')
                .success(function(data){
                    if(data.success === true)
                        alertService.displayMessage('Opération réussi');
                    });
        }
    };


    $scope.validate = function(user)
    {
        $scope.update = {};
        $scope.update.idClient = parseInt(user);
        $scope.update.idCarPooling = $scope.carPoolingToModify.idCarPooling;
        $scope.update.Accepted = true;

        REST.REST('PUT','carPooling/join',$scope.update)
            .success(function (data) {
                if(data.success === true)
                {
                    $scope.up = {};
                    $scope.up.idCarPooling = $scope.carPoolingToModify.idCarPooling;
                    $scope.up.Room = $scope.carPoolingToModify.room - 1;
                    $scope.up.Luggage = $scope.carPoolingToModify.luggage;

                    REST.REST('PUT', 'carPoolings',$scope.up)
                        .success(function(data){
                            if(data.success === true){
                                alertService.displayMessage('Opération effectué')
                                window.location.reload();
                            }
                        })
                }
            })
    }

    $scope.getUserNameById = function(id, user){
      for(var i = 0; i < user.length; ++i)
        if(id == user[i].idClient)
            return user[i].userName;
    };

    $scope.getCommentsById = function(id, Comments, user){
        var tabComments = [];
        console.log('getcomments : ' + id);
        for(var i = 0; i < Comments.length; ++i){
            if(Comments[i].idCarPooling == id){
                tabComments.push(Comments[i]);
                tabComments[i].username = $scope.getUserNameById(tabComments[i].idClient, user);
            }

        }

        return tabComments;
    };

    $scope.loadComments = function(){
        REST.REST('GET', 'carpooling/comment')
            .success(function(data){
                $scope.comments = $scope.getCommentsById($scope.carPoolingToModify.idCarPooling, data.commentsForMe, data.idAssoc)
            });
    };

});