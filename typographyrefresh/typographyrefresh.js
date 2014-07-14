/**
 * typoegraphyrefresh
 * Brandon Harris (bharris@wikimedia.org)
 * This is the "typography refresh" module.  When enabled, the typography in the page changes to newer
 * styles.  This should likely be made default.
 */

(function ( $ ) {

	// Define required version of the Winter framework.
	var requiredVersion = 0.6;

	// What to do on startup.
	$(function() {
		// Instantiate!
		var om = new TypographyRefresh();

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

	var TypographyRefresh = function() {
		// module name
		this.name = 'typographyrefresh';

		// Set to true to force enable.
		this.enabled = true;

		// This is our init method. You want to call it on startup, after instantiation.		
		this.init = function() {

			if (!this.enabled) {
				var ourToggle = $('<li />');
				var ourLink = $('<a />')
							.html('New Typography: Enable')
							.click(function() {
								if ($('#content').hasClass('typography')) {
									$('#content').removeClass('typography');
									$(this).html("New Typography: Enable");
									$.cookie('winterTypography', null, { expires: 0, path: '/' });
								} else {
									$(this).html("New Typography: Disable");
									$('#content').addClass('typography');
									$.cookie('winterTypography', 'true', { expires:7, path: '/' });
								}
							});
				if ($.cookie('winterTypography')) {
					this.enabled = true;
					ourLink.html("New Typography: Disable");
				}
				ourToggle.append(ourLink);
				$('#toggleList').append(ourToggle);
			}
			if (this.enabled) {
				$('#content').addClass('typography');
			}
		};

		// This method is called when data is loaded and the page must be modified.
		// Must exist; can be empty.
		this.fireHandler = function() { };

		// Blow away cookies when called!
		// Must exist; can be empty.
		this.clearCookies = function() {
			$.cookie('winterTypography', null, { expires: 0, path: '/' });
		};
	};

}( jQuery ));
