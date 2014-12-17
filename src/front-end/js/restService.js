myApp.service('REST', function($http) {

    that = this;

    that.REST = function(method, part, data){
        that.testConnect().success(function(){
            data = $.param(data);
            alert('bonjour');
            return $http({
                url: "http://139.124.187.37:8989/" + part,
                method: method,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: data
            });
        }).error(function(){
            alert('BONJOUR');
        });
    };

    that.testConnect = function() {
        //alert('lel');
        return $http({
            url: "http://192.168.1.3:8989/",
            method: 'GET',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: ' '
        })
    }

});
