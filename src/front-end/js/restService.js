myApp.service('REST', function($http) {

    that = this;

    that.REST = function(method, part, data){
        testConnect().success(function(){
            data = $.param(data);
            alert('bonjour');
            return $http({
                url: "http://localhost:8989/" + part,
                method: method,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: data
            });
        }).error(function(){
            alert('BONJOUR');
        });
    };

    var testConnect = function() {
        return $http({
            url: "http://localhost:8989/campuses",
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: ' '
        })
    }

});
