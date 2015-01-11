/**
 * Created by thomasmunoz on 11/01/15.
 */

myApp.service('alertService', function() {
    alertService = new Object();
    alertService.displayMessage = function(message){
        $('.alert').css('display', 'table');
        $('.alert p').html(message);
    };

    return alertService;
});