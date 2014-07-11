/**
 * flowingtype
 * Brandon Harris (bharris@wikimedia.org)
 * This module, when enabled, applies "flowtype" to the page.
 */

(function ( $ ) {

	// Define required version of the Winter framework.
	var requiredVersion = 0.6;

	// What to do on startup.
	$(function() {
		// Instantiate!
		var om = new FlowingType();
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

	var FlowingType = function() {
		// Define our module name.
		this.name = 'flowingtype';

		// Set to true to force enable.
		this.enabled = false;

		// This is our init method. You want to call it on startup, after instantiation.
		this.init = function() {

			// Load flowtype.js
			$("head").append( $('<script/>')
									.attr('type', 'text/javascript')
									.attr('src', 'snowflakes/flowingtype/flowtype.js')  );

			var ourToggle = $('<li />');
			var ourLink = $('<a />')
			 			.html('Flowing Type: Turn On')
			 			.click(function() {
			 				if ( $('body').hasClass('rr_flowingtype') ) {
								$('body').removeClass('rr_flowingtype');
								$(this).html("Flowing Type: Turn On");
								$.cookie('winterFlowingType', null, { expires: 0, path: '/' });
								// Have to reload
								location.reload(false);
			 				} else {
								$('body').addClass('rr_flowingtype');

								$('#pagecontent').flowtype();

								$(this).html("Flowing Type: Turn Off");
								$.cookie('winterFlowingType', 'true', { expires:7, path: '/' });
			 				}
			 			});
			if (($.cookie('winterFlowingType')) || (this.enabled)) {
				this.enabled = true;
				$('body').addClass('rr_flowingtype');
				$('#pagecontent').flowtype();
				ourLink.html("Flowing Type: Turn Off");
			}		 
			ourToggle.append(ourLink);

			$('#toggleList').append(ourToggle);	
		};	

		// This method is called when data is loaded and the page must be modified.
		// Must exist; can be empty.
		this.fireHandler = function() { };
		
		// Blow away cookies when called!  Must exist; can be empty.
		this.clearCookies = function() {
			$.cookie('winterFlowingType', null, { expires: 0, path: '/' });
		}
	};

}( jQuery ));
