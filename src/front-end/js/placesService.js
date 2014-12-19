/**
 * Created by thomasmunoz on 19/12/14.
 */
myApp.service('placesService', function(){
    placesService = new Object();
    placesService.loc = [];

    placesService.setLoc = function(loc){placesService.loc = loc;};
    placesService.getLoc = function(){return placesService.loc;};

    return placesService;
});