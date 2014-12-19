myApp.service('REST', function($http, $q, $timeout) {

    RestService = new Object();

    RestService.url = "http://192.168.0.31:8989/";

    RestService.testConnect = function() {
        var timeoutPromise = $timeout(function() {
            canceler.resolve(); //aborts the request when timed out
            alert("Le serveur n'a pas répondu à temps, veuillez recharger la page ou rééssayer plus tard.");
        }, 500);

        var canceler = $q.defer();
        
        $http.get(RestService.url + '/campuses').success(function(data){
            $timeout.cancel(timeoutPromise);
        });
    }

    RestService.REST = function(method, part, data){
        RestService.testConnect();

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
