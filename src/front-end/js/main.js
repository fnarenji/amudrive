$(document).ready(function() {
	
	// Change the google map element take the width of the window
	$('#map').width($(window).width());

	// margin:auto for search-panel and search-panel-date
	var leftMargin = ($(window).width() - $('#search-panel').width()) / 2;
	$('#search-panel').css('left', leftMargin);
	$('#search-panel-date').css('left', (leftMargin + 5));

	// Everytime you change the size of the window
	$( window ).resize(function() {

		// Change the google map size
	  	$('#map').width($(window).width());

	  	// margin:auto for search-panel and search-panel-date
	  	var leftMargin = ($(window).width() - $('#search-panel').width()) / 2;
	  	$('#search-panel').css('left', leftMargin);
	  	$('#search-panel-date').css('left', (leftMargin + 5));

	});
});