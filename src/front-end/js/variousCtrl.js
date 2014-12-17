myApp.controller('MenuController', ['$scope', function($scope) {
    $scope.menu =
        [
         {name: 'Recherche', url: '#/path'},
         {name: 'Trajets', url: '#/mycarpoolings'},
         {name: 'Mon Compte', url: '#/account'}
        ];

    $scope.connectButton = {name :'Connexion', url: '#/connection'};
}]);