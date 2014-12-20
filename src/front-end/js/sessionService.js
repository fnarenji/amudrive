/**
 * Created by SKNZ on 17/12/2014.
 */

myApp.service('sessionService', function ($cookies) {
    sessionService = new Object();
    sessionService.authToken = $cookies.authToken;

    sessionService.setAuthToken = function (authToken) {
        $cookies.authToken = authToken;
        sessionService.authToken = authToken;
    };

    sessionService.getAuthToken = function () {
        return sessionService.authToken;
    };

    sessionService.checkConnection = function(){
        if(sessionService.getAuthToken() === undefined)
            window.location = '#/';
    };

    sessionService.disconnect = function(){
        document.cookie = 'authToken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    return sessionService;
});