myApp.config(function($routeProvider){
   $routeProvider
       .when('/', {templateUrl: 'html/path.html'})
       .when('/connection', {templateUrl: 'html/connection.html'})
       .when('/mycarpoolings',{templateUrl: 'html/mycarpoolings.html'})
       .when('/registration', {templateUrl: 'html/registration.html'})
       .when('/registrationNext', {templateUrl: 'html/registration_next.html'})
       .when('/path', {templateUrl: 'html/path.html'})
       .when('/account', {templateUrl: 'html/account.html'})
       .when('/manage', {templateUrl: 'html/carPoolingManage.html'})
       .when('/participate', {templateUrl: 'html/carPoolingParticipate.html'})
       .when('/mentions', {templateUrl: 'html/mentions.html'})
       .otherwise({redirectTo: '/'});
});