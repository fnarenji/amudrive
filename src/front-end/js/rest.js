/**
 * Created by Thomas on 29/11/2014.
 */

myApp.controller('AccountController', ['$scope', 'REST', 'mapService', 'sessionService', function($scope, REST, mapService, sessionService) {


    $scope.authToken = sessionService.getAuthToken();
    $scope.user = {};

    $scope.registrationNext = function(user){
        var loc = mapService.addressToCoordinates($scope.user.Address);

        if (loc === undefined)
        {
            alert('Votre addresse n\'a pu être géolocalisée. Merci de préciser celle-ci. Si cela ne fonctionne pas, le service peut être temporairement indisponible.');
            return;
        }

        $scope.user.Long = loc.lng();
        $scope.user.Lat = loc.lat();
        $scope.goTo('registrationNext');
    };

    $scope.goTo = function(url){
        urlf = '#/';
        urlf += (url === undefined) ? '' : url;
        alert(urlf);
        window.location.href = urlf;
    };


    $scope.connection = function(auth){
        auth.password_sha512 = CryptoJS.SHA512(auth.Password).toString();

        REST.REST('POST', 'auth', auth).success(function(data){
            $.param(data);

            if(data.success == true){
                //$.cookie('authToken', data.authToken, { expires: 7 });
                sessionService.setAuthToken(data.authToken);
                $scope.authToken = data.authToken;
                alert('Connexion réussie ! ');
                $scope.message = ''; // Clear previous error messages
                $scope.goTo();
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
                $scope.goTo();
                return;
            }
            alert(data.success + " " + data.reasons);
        });

    };
}]);