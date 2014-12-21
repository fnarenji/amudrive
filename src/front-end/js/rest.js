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
        window.location = urlf;
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
                window.location = ''; // Call to $scope.goTo() doesn't reload the page
            }
            else if(data.reasons != undefined)
                $scope.message = data.reasons;
            else
                $scope.message = "Les identifiants saisis sont incorrects ou ce nom d'utilisateur n'existe pas";

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

        $scope.path.long = loc[0];
        $scope.path.lat = loc[1];

        $scope.path.radius = $('#rayon').slider("option", "value");
        var interval =  $('#battement').slider("option", "values");

        $scope.path.campusToAddress = true;

        var date = new Date(path.Date + 'T' + path.Time);

        date.setMinutes(date.getMinutes() + $('#battement').slider("option", "values")[0]);
        $scope.path.minMeetTime = date.toUTCString();
        date.setMinutes(date.getMinutes() -  $('#battement').slider("option", "values")[0] + $('#battement').slider("option", "values")[1]);
        $scope.path.maxMeetTime = date.toUTCString();

        mapService.drawCircle(loc, $scope.path.Radius);
        $scope.path.idCampus = path.CampusName.idCampus;
        console.log($scope.path);

        console.log(JSON.stringify($scope.path));
        REST.REST('POST', 'carpoolings/search', JSON.stringify($scope.path), 'json')
            .success(function(data){
               console.log(data);
            });
    };
}]);