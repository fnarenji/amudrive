/**
 * Created by SKNZ on 17/12/2014.
 */

myApp.service('sessionService', function ($cookies) {
    sessionService = new Object();
    sessionService.authToken = $cookies.authToken;

    sessionService.setAuthToken = function (authToken) {
        $.cookie('authToken', authToken, { expires: 7, domain: 'http://localhost:8989/' });
    };

    sessionService.getAuthToken = function () {
        return sessionService.authToken;
    };

    return sessionService;
});