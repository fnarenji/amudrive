/**
 * Created by Thomas on 29/11/2014.
 */

myApp.controller('AccountController', ['$scope', '$http', function($scope, $http){
    $scope.menu =
        [ { "name" : 'Recherche', "url" : 'search.html'},
          { "name" : 'Trajets', "url" : 'path.html'},
          { "name" : 'Mon Compte', "url" : 'account.html'}];

    $scope.showMenu = function(url){
        $scope.currentMenu = url;
    };

    $scope.closeCross = function(){
        $scope.currentMenu = '';
    };

    if($scope.currentMenu === undefined)
        $scope.currentMenu = '';

    $scope.REST = function(method, part, data){

        data = $.param(data);
        return $http({
            url: 'http://192.168.0.31:8989/' + part,
            method : method,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'},
            data : data
        });
    };

    $scope.connection = function(user){
        user.password_sha512 = CryptoJS.SHA512(user.password_sha512).toString();

        $scope.REST('POST', 'auth', user).success(function(){
            alert('Connexion réussie ! ');
        });

        $scope.closeCross();
    };

    $scope.registration = function(user){
       user.Password = CryptoJS.SHA512(user.Password).toString();

       $scope.REST('POST', 'register', user).success(function(){
           alert('Inscription réussie !');
       });

       $scope.closeCross();
    };
}]);