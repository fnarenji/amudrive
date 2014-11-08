$(document).ready(function() {
	
	// Change the google map element take the width of the window
	$('#map').width($('body').width() - 4);

	// margin:auto for search-panel and search-panel-date
	var leftMargin = ($(window).width() - $('#search-panel').width()) / 2;
	$('#search-panel').css('left', leftMargin);
	$('#search-panel-date').css('left', (leftMargin + 5));

    // Put search-panel-select imgs

    // Create an array with the images we want to display
    var img = ['animal', 'radio', 'smoke', 'luggage', 'talk'];
    var url = '';

    // Load all the images
    for(i = 0; i < img.length; ++i){
        url = '../img/' + img[i] + '_off.jpg';
        $('#search-panel-select-' + img[i]).css('background-image', 'url("' + url + '")');
        $('#search-panel-select-' + img[i]).addClass('off');
    }

    // Change the button (red or green)
    $('#search-panel-select').on('click', '[id^=search-panel-select-]', function(){
        var id = $(this).attr('id');
        var name = id.substr(20, id.length);

        var state =  $(this).attr('class') == 'on' ? 'off' : 'on';

        $(this).css('background-image', 'url("../img/' + name + '_' + state + '.jpg")');
        $(this).attr('class', state);


    });


	// Everytime you change the size of the window
    $( window ).resize(function() {
		// Change the google map size
	  	$('#map').width($('body').width());

	  	// margin:auto for search-panel and search-panel-date
	  	var leftMargin = ($(window).width() - $('#search-panel').width()) / 2;
	  	$('#search-panel').css('left', leftMargin);
	  	$('#search-panel-date').css('left', (leftMargin + 5));

	});
});