/**
 * Created by Thomas on 29/11/2014.
 */


myApp.controller('AccountController', ['$scope', function($scope){
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
    if($scope.currentMenu == undefined)
        $scope.currentMenu = '';

    $scope.connection = function(user){
        console.log("connection");
        console.log(user);
        user.password = CryptoJS.SHA512(user.password);
        pass = user.password;
        console.log(pass.toString());
    };

    $scope.apiConnection = function(){

    };
}]);