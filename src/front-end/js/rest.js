/**
 * Created by Thomas on 29/11/2014.
 */

myApp.controller('AccountController', ['$scope', 'REST', 'mapService', 'sessionService', 'placesService', function($scope, REST, mapService, sessionService, placesService)
{
    $scope.authToken = sessionService.getAuthToken();
    $scope.user = {};
    $scope.path = {};

    $scope.registrationLocation = function(loc){$scope.loc = loc;};

    $scope.registrationNext = function(user){
        var loc = placesService.getLoc();

        if (loc === undefined){
            alert('Votre addresse n\'a pu être géolocalisée. Merci de préciser celle-ci. Si cela ne fonctionne pas, ' +
                  'le service peut être temporairement indisponible.');
            return;
        }

        $scope.user.Long = loc[0];
        $scope.user.Lat = loc[1];
        $scope.user.Address = placesService.getAddress();
        $scope.user = user;
        console.log($scope.user);
        // Radio buttons fix
        $scope.user.MailNotifications = $scope.user.PhoneNotifications = $scope.user.Newsletter = "true";

        $scope.goTo('registrationNext');
    };

    $scope.goTo = function(url){
        urlf = '#/';
        urlf += (url === undefined) ? '' : url;
        window.location.href = urlf;
    };


    $scope.connection = function(auth){
        auth.password_sha512 = CryptoJS.SHA512(auth.Password).toString();
        auth.Password = undefined;

        REST.REST('POST', 'auth', auth).success(function(data){
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

        $scope.user.PasswordNoHash = undefined; // Erase password
        $scope.user.MessagingParameters = 1;

        REST.REST('POST', 'register', $scope.user, 'application/json').success(function(data){
            if (data.success){
                alert('Inscription réussie, vous allez bientôt recevoir un mail de validation afin de ' +
                      'valider votre compte et commencer à utiliser notre site');
                $scope.goTo();
                return;
            }
            alert(data.success + " " + data.reasons);
        });
    };

    $scope.search = function(path) {
        var loc = placesService.getLoc();

        if (loc === undefined){
            alert('Votre addresse n\'a pu être géolocalisée. Merci de préciser celle-ci. Si cela ne fonctionne pas, ' +
            'le service peut être temporairement indisponible.');
            return;
        }

        console.log(loc);

        $scope.path.Long = loc[0];
        $scope.path.Lat = loc[1];
        $scope.path.Address = placesService.getAddress();
        $scope.path.Radius = $('#rayon').slider("option", "value");
        $scope.path.CampusToAddress = true;

        //mapService.drawCircle(loc, $scope.path.Radius);
        console.log($scope.path);


    }
}]);