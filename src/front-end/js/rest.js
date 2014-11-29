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

    if($scope.currentMenu == undefined)
        $scope.currentMenu = '';
}]);