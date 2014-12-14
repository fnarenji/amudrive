/**
 * Created by Thomas on 29/11/2014.
 */

myApp.controller('AccountController', ['$scope', 'REST', 'Map', function($scope, REST, Map) {


    $scope.authToken = $.cookie('authToken');
    $scope.user = {};

    $scope.registrationNext = function(user){
        location = Map.addressToCoordinates($scope.user.Address);

        if (location == undefined)
        {
            alert('Votre addresse n\'a pu être géolocalisée. Merci de préciser celle-ci. Si cela ne fonctionne pas, le service peut être temporairement indisponible.');
            return;
        }

        $scope.user.Long = location.lng();
        $scope.user.Lat = location.lat();
        $scope.showMenu($scope.menuregistrationnext);
    };

    $scope.returnHome = function(){
        window.location.href = '#/';;
    };


    $scope.connection = function(auth){
        auth.password_sha512 = CryptoJS.SHA512(auth.Password).toString();

        REST.REST('POST', 'auth', auth).success(function(data){
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
        REST.REST('POST', 'register', $scope.user).success(function(data){

            if (data.success)
            {
                $scope.returnHome();
                return;
            }
            alert(data.success + " " + data.reasons);
        });

    };
}]);