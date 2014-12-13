/**
 * Created by Thomas on 29/11/2014.
 */

myApp.controller('AccountController', ['$scope', '$http', function($scope, $http){
    $scope.menu =
        [ { "name" : 'Recherche', "url" : 'search.html'},
          { "name" : 'Trajets', "url" : 'mycarpoolings.html'},
          { "name" : 'Mon Compte', "url" : 'account.html'}];

    $scope.menusearch = "search.html";
    $scope.menupath = "path.html";
    $scope.menuconnection = "connection.html";
    $scope.menuaccount = "account.html";
    $scope.menuregistration = "registration.html";
    $scope.menuregistrationnext = "registration_next.html";
    $scope.usersave = '';

    $scope.showMenu = function(url){
        $scope.currentMenu = url;
    };

    $scope.registrationNext = function(user){
      $scope.usersave = user;

        new google.maps.Geocoder().geocode( { 'address': user.Address }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                user.Longitude = results[0].geometry.location.lng();
                user.Latitude = results[0].geometry.location.lat();
                $scope.showMenu($scope.menuregistrationnext);
            } else {
                alert("Votre adresse n'a pas pu être validée: " + status);
            }
        });
    };

    $scope.closeCross = function(){
        $scope.currentMenu = $scope.menupath;
    };

    if($scope.currentMenu === undefined)
        $scope.currentMenu = $scope.menupath;

    $scope.REST = function(method, part, data){

        data = $.param(data);
        return $http({
            url: 'http://localhost:8989/' + part,
            method : method,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'},
            data : data
        });
    };

    $scope.connection = function(user){
        user.password_sha512 = CryptoJS.SHA512(user.password_sha512).toString();

        $scope.REST('POST', 'auth', user).success(function(data){
            $.param(data);

            if(data.success == true){
                alert('Connexion réussie ! ');
                $scope.closeCross();
            }
            else if(data.reasons != undefined)
            {
                $scope.message = data.reasons;
            }
            else{
                $scope.message = "Les identifiants saisis sont incorrects ou ce nom d'utilisateur n'existe pas";
            }

        });


    };

    $scope.registration = function(user) {
        $.extend(user, $scope.usersave); // fuuuuu, dirtiest shit ever, where's yo service bitch ?
        user.Password = CryptoJS.SHA512(user.Password).toString();

        $scope.REST('POST', 'register', user).success(function(data){

            if (data.success)
            {
                $scope.closeCross();
                return;
            }
            alert(data.success + " " + data.reasons);
        });

    };
}]);