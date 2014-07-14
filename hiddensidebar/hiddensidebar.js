/**
 * hiddensidebar
 * Brandon Harris (bharris@wikimedia.org)
 * This is the "hidden sidebar" module.  When enabled, the sidebar content is hidden until hovering over the
 * logo.  
 * This is experimental and buggy.
 */

(function ( $ ) {

	// Define required version of the Winter framework.
	var requiredVersion = 0.6;

	// What to do on startup.
	$(function() {
		// Instantiate!
		var om = new HiddenSidebar();
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


	var HiddenSidebar = function() {
		// Define our module name.
		this.name = 'hiddensidebar';

		// Set to true to force enable.
		// Disables the ability for the user to toggle on or off.
		// Will be set true by toggle/cookie in init process.
		this.enabled = false;

		// This is our init method. You want to call it on startup, after instantiation.
		this.init = function() {
			if (!this.enabled) {
				var ourToggle = $('<li />');
				var ourLink = $('<a />')
							.html('Sidebar: Hide')
							.click(function() {
								if ($('#container').hasClass('nosidebar')) {
									$(this).html("Sidebar: Hide");
									$('#container').removeClass('nosidebar');
									$('#toolbox').show();
									$.cookie('winterHideSidebar', null, { expires: 0, path: '/' });
									// turn off effects
									$('#toolbox').waypoint('destroy');
									$('#toolbox').waypoint(function(direction) {
										if (direction == "down") {
											$('#content').addClass('winter');
										} else if (direction == "up") {
											$('#content').removeClass('winter');
									 	}
									}, { offset: function() {
											return -$(this).height();
											}
									});

									$('#toolbox').unbind('hover');
									$('#logo').unbind('hover')	
									$('#toolbox').removeClass('stuck');
								} else {
									$(this).html("Sidebar: Show");
									$('#container').addClass('nosidebar');
									$('#toolbox').hide();
									$.cookie('winterHideSidebar', 'true', { expires: 7, path: '/' });
									// add in effects for this page's session
									$('#toolbox').waypoint('sticky', { offset: 40 });
									$('#toolbox').hover(function() {
											$('#toolbox').show();
										}, function() {
											$('#toolbox').fadeOut('slow');
										}
									);

									$('#logo').hover(function() {
											$('#toolbox').show();
										}, function() {
											var isHovered = !!$('#toolbox').filter(function() { return $(this).is(":hover"); }).length;
											if (isHovered) {
												$('#toolbox').fadeOut('slow');
											}
										}
									);
								}
							});

				if ($.cookie('winterHideSidebar')) {
					this.enabled = true;
					ourLink.html("Sidebar: Show");
				}		 
				ourToggle.append(ourLink);
				$('#toggleList').append(ourToggle);
			}
			if (this.enabled) {
				$('#container').addClass('nosidebar');
				$('#toolbox').waypoint('sticky', { offset: 40 });
				$('#toolbox').hover(function() {
						$('#toolbox').show();
					}, function() {
						$('#toolbox').fadeOut('slow');
					}
				);

				$('#logo').hover(function() {
						$('#toolbox').show();
					}, function() {
						var isHovered = !!$('#toolbox').filter(function() { return $(this).is(":hover"); }).length;
						if (isHovered) {
							$('#toolbox').fadeOut('slow');
						}
					}
				);
				$('#toolbox').hide();
			}
		};

		// This method is called when data is loaded and the page must be modified.
		// Must exist; can be empty.
		this.fireHandler = function() { };
		
		// Blow away cookies when called!  Must exist; can be empty.
		this.clearCookies = function() {
			$.cookie('winterHideSidebar', null, { expires: 0, path: '/' });
		};
	};

}( jQuery ));
