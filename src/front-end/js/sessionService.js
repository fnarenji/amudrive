/**
 * Created by SKNZ on 17/12/2014.
 */


myApp.service('sessionService', function ($cookies) {
    sessionService = new Object();

    var token = $cookies.authToken;

    sessionService.setAuthToken = function (authToken) {
        $cookies.authToken = authToken;
    };

    sessionService.getAuthToken = function () {
        return token;
    };

    return sessionService;
});