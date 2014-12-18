myApp.service('REST', function($http, sessionService) {

    RestService = new Object();

    RestService.url = "http://192.168.0.31:8989/";

    RestService.testConnect = function() {return $http.get(RestService.url);}

    RestService.REST = function(method, part, data){
        // Clean parameters
        data = (data !== undefined) ? $.param(data) : '' ;
        part = (part !== undefined) ? part : '';
        method = (method === 'GET' || method === 'POST' || method === 'PUT') ? method : 'GET';

        return $http({
            url: RestService.url + part,
            method: method,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: data
        });
    };
    return RestService;
});
