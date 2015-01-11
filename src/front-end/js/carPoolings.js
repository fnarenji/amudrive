/**
 * Created by thomasmunoz on 19/12/14.
 */

myApp.controller('CarPoolingController', ['$scope', 'REST', 'mapService', 'sessionService', 'alertService', function($scope, REST, mapService, sessionService, alertService){
    $scope.isPanelVisible = false;
    $scope.animal = false;
    $scope.smoke = false;
    $scope.talk = false;
    $scope.radio = false;
    $scope.luggage = false;
    $scope.carPoolingSelected = {};
    $scope.campus = {};

    REST.REST('GET','campuses')
            .success(function(data){
                $scope.campus = data;
            });

    $scope.getCampuses = function (id) {
        for(var i = 0; i < $scope.campus.campuses.length; ++i){
            if($scope.campus.campuses[i].idCampus === id)
                return $scope.campus.campuses[i].name;
        }
    };

    $scope.joinCarpooling = function(){
      console.log($scope.carPoolingSelected);
      sessionService.loadInfos().then(function(){
          var join = {
              'IdClient' : sessionService.getInfos().idClient,
              'IdCarPooling' : $scope.carPoolingSelected.idcarpooling
          };
          REST.REST('POST', 'carpoolings/join', join, 'json')
              .success(function(data){
                 alertService.displayMessage('succès');
              });
      });



      //REST.REST('POST', 'carpooling/join', join, 'json')

    };

    mapService.setMarkerCallback(function (json) {
        $scope.carPoolingSelected = json;

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
        $('#search-panel-arrival').html('Le pôle est ' + $scope.getCampuses(json.idcampus));
        $('#search-panel-passenger').html(json.room + ' places restantes');
    });
}]);