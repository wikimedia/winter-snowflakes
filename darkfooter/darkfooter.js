/**
 * darkfooter
 * Brandon Harris (bharris@wikimedia.org)
 * This is the "dark footer" module.  When enabled, the footer design changes to have a dark background.
 */

(function ( $ ) {

	// Define required version of the Winter framework.
	var requiredVersion = 0.6;

	// What to do on startup.
	$(function() {

		// Instantiate!
		var om = new DarkFooter();

		// IMPORTANT: We must register ourselves.
		// Throw an error if we aren't at the right version.
		if (requiredVersion > $.winter.version) {
			alert("Cannot load Winter module '" + om.name + "'; version incompatability." );
			return;
		}
		// Tell the framework we exist.
		$.winter.registerModule(om);
		om.init();
	});

	var DarkFooter = function() {
		// Define our module name.
		this.name = 'darkfooter';

		// Set to true to force enable.
		// Disables the ability for the user to toggle on or off.
		// Will be set true by toggle/cookie in init process.
		this.enabled = true;

		// This is our init method. You want to call it on startup, after instantiation.
		this.init = function() {
			if (!this.enabled) {
				var ourToggle = $('<li />');
				var ourLink = $('<a />')
							.html('Dark Footer: Turn On')
							.click(function() {
								if ($('#footer').hasClass('dark')) {
									$('#footer').removeClass('dark');
									$(this).html("Dark Footer: Turn On");
									$.cookie('winterDarkFooter', null, { expires: 0, path: '/' });
								} else {
									$('#footer').addClass('dark');
									$(this).html("Dark Footer: Turn Off");
									$.cookie('winterDarkFooter', 'true', { expires:7, path: '/' });
								}
							});
				if ($.cookie('winterDarkFooter')) {
					this.enabled = true;
					ourLink.html("Dark Footer: Turn Off");
				}		 
				ourToggle.append(ourLink);
				$('#toggleList').append(ourToggle);
			}
			if (this.enabled) {
				$('#footer').addClass('dark');
			}
		};

		// This method is called when data is loaded and the page must be modified.
		// Must exist; can be empty.
		this.fireHandler = function() { };

		// Blow away cookies when called!  Must exist; can be empty.
		this.clearCookies = function() {
			$.cookie('winterDarkFooter', null, { expires: 0, path: '/' });
		};
	};

}( jQuery ));
