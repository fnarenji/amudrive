/**
 * Created by SKNZ on 17/12/2014.
 */

myApp.service('sessionService', function ($cookies) {
    sessionService = new Object();

    sessionService.load = function(){
      sessionService.authToken = $cookies.authToken;
    };

    sessionService.setAuthToken = function (authToken) {
        $cookies.authToken = authToken;
    };

    sessionService.getAuthToken = function () {
        sessionService.load();
        return sessionService.authToken;
    };

    return sessionService;
});