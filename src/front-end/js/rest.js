/**
 * Created by Thomas on 29/11/2014.
 */

myApp.controller('AccountController', ['$scope', '$http', function($scope, $http) {
    $scope.menu =
        [ { name : 'Recherche', url : '#/path'},
          { name : 'Trajets', url : '#/mycarpoolings'},
          { name : 'Mon Compte', url : '#/account'}];


    $scope.authToken = $.cookie('authToken');
    $scope.connectButton = {name :'Connexion', url: '#/connection'};
    $scope.user = {};

    $scope.registrationNext = function(user){
        new google.maps.Geocoder().geocode( { 'address': $scope.user.Address }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $scope.user.Long = results[0].geometry.location.lng();
                $scope.user.Lat = results[0].geometry.location.lat();
                $scope.showMenu($scope.menuregistrationnext);
            } else {
                alert("Votre adresse n'a pas pu être validée: " + status);
            }
        });
    };

    $scope.returnHome = function(){
        window.location.href = '#/';;
    };

    $scope.REST = function(method, part, data){

        data = $.param(data);
        return $http({
            url: 'http://localhost:8989/' + part,
            method : method,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'},
            data : data
        });
    };

    $scope.connection = function(auth){
        auth.password_sha512 = CryptoJS.SHA512(auth.Password).toString();

        $scope.REST('POST', 'auth', auth).success(function(data){
            $.param(data);

            if(data.success == true){
                $.cookie('authToken', data.authToken, { expires: 7 });
                $scope.authToken = data.authToken;
                alert('Connexion réussie ! ');
                $scope.message = ''; // Clear previous error messages
                $scope.returnHome();
                $scope.connectButton = 'Deconnexion';
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
        $scope.user.Password = CryptoJS.SHA512($scope.user.PasswordNoHash).toString();
        $scope.user.FavoriteCampus = 1; // @todo REMOVE
        console.log($scope.user);
        $scope.user.PasswordNoHash = ""; // Erase password
        $scope.REST('POST', 'register', $scope.user).success(function(data){

            if (data.success)
            {
                $scope.returnHome();
                return;
            }
            alert(data.success + " " + data.reasons);
        });

    };
}]);