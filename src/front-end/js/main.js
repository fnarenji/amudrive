$(document).ready(function() {
	
	// Change the google map element take the width of the window
	$('#map').width($(window).width());

	/* Everytime you change the size of the window, it changes the google
	* map width
	*/
	
	$( window ).resize(function() {
  		$('#map').width($(window).width());
	});
});