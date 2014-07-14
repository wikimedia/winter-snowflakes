/**
 * innertoc
 * Brandon Harris (bharris@wikimedia.org)
 * This is the "inner table of contents" module.  When enabled, the interior table of contents is hidden from view.
 */

(function ( $ ) {

	// Define required version of the Winter framework.
	var requiredVersion = 0.6;

	// What to do on startup.
	$(function() {
		// Instantiate!
		var om = new InnerToc();
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

	var InnerToc = function() {
		// Define our module name.
		this.name = 'innertoc';

		// Set to true to force enable.
		// Disables the ability for the user to toggle on or off.
		// Will be set true by toggle/cookie in init process.
		this.enabled = true;

		// This is our init method. You want to call it on startup, after instantiation.		
		this.init = function() {

			if (!this.enabled) {
				var ourToggle = $('<li />');
				var ourLink = $('<a />')
							.html('Inner ToC: Hide')
							.click(function() {
								if ($('#content').hasClass('notoc')) {
									$('#content').removeClass('notoc');
									$(this).html("Inner ToC: Hide");
									$.cookie('winterNoToC', null, { expires: 0, path: '/' });
								} else {
									$(this).html("Inner ToC: Show");
									$('#content').addClass('notoc');
									$.cookie('winterNoToC', 'true', { expires:7, path: '/' });
								}
							});

				if (($.cookie('winterNoToC')) || (this.enabled)) {
					this.enabled = true;
					ourLink.html("Inner ToC: Show");
				}
				ourToggle.append(ourLink);
				$('#toggleList').append(ourToggle);
			}
			if (this.enabled) {
				$('#content').addClass('notoc');
			}
		};

		// This method is called when data is loaded and the page must be modified.
		// Must exist; can be empty.
		this.fireHandler = function() { };

		// Blow away cookies when called!
		// Must exist; can be empty.
		this.clearCookies = function() {
			$.cookie('winterNoToC', null, { expires: 0, path: '/' });
		};
	};

}( jQuery ));
