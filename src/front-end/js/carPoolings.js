/**
 * Created by thomasmunoz on 19/12/14.
 */

myApp.controller('CarPoolingController', ['$scope', 'mapService', function($scope, mapService){
    $scope.isPanelVisible = true;
    $scope.animal = false;
    $scope.smoke = false;
    $scope.talk = false;
    $scope.radio = false;
    $scope.luggage = false;

    mapService.setMarkerCallback(function (json) {
        console.log('YOLO');
        if (json === null)
        {
            $scope.isPanelVisible = true;
            return;
        }
        $scope.isPanelVisible = true;
        $scope.animal = json.animals;
        $scope.smoke = json.smoking;
        $scope.talk = json.talk;
        $scope.radio = json.radio;
        $scope.luggage = json.luggage > 0;
        console.log("SWAG");
    });
}]);

// From http://stackoverflow.com/a/15537359
myApp.directive('backImg', function(){
    return function(scope, element, attrs){
        console.log('OKLM');
        attrs.$observe('backImg', function(value) {
            console.log('PATES AU KETCHUP');
            var name = element.attr('id').substr(0, 'search-panel-select-'.length);
            console.log(name);
            element.css({
                'background-image': 'url(../img/' + name  +'_' + value ? 'on' : 'off' + ')'
            });
        });
    };
});
