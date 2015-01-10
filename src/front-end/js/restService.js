myApp.service('REST', function($http, $q, $timeout) {

    RestService = new Object();

    RestService.url = "https://srv0.sknz.info:3733/api";

    RestService.testConnect = function() {
        var timeoutPromise = $timeout(function() {
            canceler.resolve(); //aborts the request when timed out
            alert("Le serveur n'a pas répondu à temps, veuillez recharger la page ou rééssayer plus tard.");
        }, 30000);

        var canceler = $q.defer();

        $http.get(RestService.url + '/campuses').success(function(data){
            //$timeout.cancel(timeoutPromise);
        });
    }

    RestService.REST = function(method, part, data, headers){
        //RestService.testConnect();

        // Simplify the requests :)
        headers = (headers === 'json') ? 'application/json' : headers;

        // Clean parameters
        data = (data !== undefined) ? data : {} ;
        part = (part !== undefined) ? part : '';
        method = (method === 'GET' || method === 'POST' || method === 'PUT' || method === 'DELETE') ? method : 'GET';
        headers = (headers !== undefined) ? headers : "application/x-www-form-urlencoded";
        data = (headers === "application/x-www-form-urlencoded") ? $.param(data) : data;
			
        return $http({
            url: RestService.url + '/' + part,
            method: method,
            headers: {'Content-Type': headers},
            data: data,
            withCredentials: true
        });
    };
    return RestService;
});
