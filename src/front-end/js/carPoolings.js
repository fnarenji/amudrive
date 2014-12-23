/**
 * Created by thomasmunoz on 19/12/14.
 */

myApp.controller('CarPoolingController', ['$scope', 'mapService', function($scope, mapService){
    $scope.isPanelVisible = true;
    $scope.animal = false;
    $scope.smoke = false;
    $scope.talk = false;
    $scope.radio = false;
    $scope.luggage = false

    mapService.setMarkerCallback(function (json) {
        console.log(json);
        if (json === null)
        {
            $scope.isPanelVisible = true;
            return;
        }
        $scope.isPanelVisible = true;
        $('#search-panel-select-animal').css('background-image', 'url(http://localhost/amudrive/img/animal_' + (json.animals ? 'on' : 'off') + '.png)');
        $('#search-panel-select-smoke').css('background-image', 'url(http://localhost/amudrive/img/smoke_' + (json.smoking ? 'on' : 'off') + '.png)');
        $('#search-panel-select-talk').css('background-image', 'url(http://localhost/amudrive/img/talk_' + (json.talks ? 'on' : 'off') + '.png)');
        $('#search-panel-select-radio').css('background-image', 'url(http://localhost/amudrive/img/radio_' + (json.radio ? 'on' : 'off') + '.png)');
        $('#search-panel-select-luggage').css('background-image', 'url(http://localhost/amudrive/img/luggage_' + (json.luggage > 0 ? 'on' : 'off') + '.png)');
        $('#search-panel-date').html(json.meettime.substr('YYYY-'.length, 'MM-DD'.length).replace('-', '/') + ' ' + json.meettime.substr('YYYY-MM-DDT'.length, 'HH:MM'.length).replace(':', 'h'));
        $('#search-panel-depart').html('L\'adresse est ' + json.address);
        $('#search-panel-arrival').html('Le pôle est ' + json.idCampus);
    });
}]);