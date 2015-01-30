/**
 * Created by thomasmunoz on 19/12/14.
 */
myApp.service('placesService', function(){
    placesService = new Object();

    placesService.loc = [];
    placesService.address = "";

    placesService.setLoc = function(loc){placesService.loc = loc;};
    placesService.getLoc = function(){return placesService.loc;};

    placesService.setAddress = function(address){placesService.address = address;};
    placesService.getAddress = function(){return placesService.address;};

    return placesService;
});