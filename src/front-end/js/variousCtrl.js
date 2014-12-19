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

    $scope.user = {};

    $scope.getInfos = function(){
            REST.REST('GET', 'client')
                .success(function(data){
                   $scope.infos = data.client;
                   console.log($scope.infos);
                    $scope.loadPicture();
                    $scope.loadInfos();
                });
    };

    $scope.loadVehicles = function(){
        REST.REST('GET', 'vehicles')
            .success(function(data){
                $scope.user.vehicles = data.vehicles;
            });
    };

    $scope.loadInfos = function(){

      var user = {
        'username' : $scope.infos.userName,
        'firstname' : $scope.infos.firstName,
        'lastname' : $scope.infos.lastName,
        'mailnotifications' : $scope.infos.mailNotifications,
        'phonenotifications' : $scope.infos.phoneNotifications,
        'newsletter' : $scope.infos.newsletter
      };

      $scope.user = user;
    };

    $scope.loadPicture = function(){
        var hash = CryptoJS.MD5($scope.infos.mail).toString();

        $http.jsonp('http://gravatar.com/' + hash + '.json?callback=JSON_CALLBACK"')
            .success(function(data){
                $scope.user.avatar = data.entry[0].photos[0].value;
            });
    };

    $scope.getInfos();
    $scope.loadVehicles();
});