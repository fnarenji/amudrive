myApp.service('REST', function($http) {

    that = this;

    that.REST = function(method, part, data){

        data = $.param(data);
        return $http({
            url: "http://localhost:8989/" + part,
            method : method,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'},
            data : data
        });
    };

});
