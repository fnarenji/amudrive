myApp.config(function($routeProvider){
   $routeProvider
       .when('/', {templateUrl: 'path.html'})
       .when('/connection', {templateUrl: 'connection.html'})
       .when('/mycarpoolings',{templateUrl: 'mycarpoolings.html'})
       .when('/registration', {templateUrl: 'registration.html'})
       .when('/registrationNext', {templateUrl: 'registration_next.html'})
       .when('/path', {templateUrl: 'path.html'})
       .when('/account', {templateUrl: 'account.html'})
       .otherwise({redirectTo: '/'});
});