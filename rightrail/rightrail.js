/**
 * rightrail
 * Brandon Harris (bharris@wikimedia.org)
 * This is the "right rail" module.  When enabled, it adds a right rail with extra exploratory features.
 */

(function ( $ ) {

	// Define required version of the Winter framework.
	var requiredVersion = 0.6;

	// What to do on startup.
	$(function() {

		// Instantiate!
		var om = new RightRail();

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

	var RightRail = function() {
		// Define our module name.
		this.name = 'rightrail';

		// Set to true to force enable.
		// Disables the ability for the user to toggle on or off.
		// Will be set true by toggle/cookie in init process.
		this.enabled = true;

		// This is our init method. You want to call it on startup, after instantiation.
		this.init = function() {
			if (!this.enabled) {
				var ourToggle = $('<li />');
				var ourLink = $('<a />')
							.html('Right Rail: Turn On')
							.click(function() {
								if ($('#container').hasClass('rightbar')) {
									$('#container').removeClass('rightbar');
									$(this).html("Right Rail: Turn On");
									$.cookie('winterRightRail', null, { expires: 0, path: '/' });
									// force a reload
									location.reload(false);
				 				} else {
									$.cookie('winterRightRail', 'true', { expires:7, path: '/' });
									// force a reload
									location.reload(false);
								}
							});
				if ($.cookie('winterRightRail')) {
					this.enabled = true;
					ourLink.html("Right Rail: Turn Off");
				}
				ourToggle.append(ourLink);
				$('#toggleList').append(ourToggle);
			}
			if (this.enabled) {
				$('#container').addClass('rightbar');
			}

			// Now we add the sidebar.

			// First, go away on pretty much everything except articles
			if ( (($.winter.hasTrait('contributions'))
					|| ($.winter.hasTrait('history'))
					// || ($.winter.hasTrait('editor'))
					|| ($.winter.hasTrait('portal'))
					|| ($.winter.hasTrait('user'))
					|| ($.winter.hasTrait('talk'))
					|| ($.winter.hasTrait('watchlist')))
				&& (!$.winter.hasTrait('editor')) 
					) {

				$('#container').removeClass('rightbar'); // remove css

				this.enabled = false; // prevent fireHandlers() from executing
				return;  // buh-bye
			}

			// Add in the actual sidebar.
			$('#container').append($('<div />').attr('id', 'wsidebar'));
		};

		// This method is called when data is loaded and the page must be modified.
		// Must exist; can be empty.
		this.fireHandler = function() { 
			if (!this.enabled ) return; // Don't make extra calls if not needed.


			//console.log("Firing right rail handlers");

			/*
			 * Each thing to slot is handled in its own subroutine to avoid muddying 
			 * this method.  However, that may not be the best way to go about doing it.
			 * (see below re: infoboxes)
			 */

			//topicons/metadata stars
			doMetaData();
			// coordinates. pull out before infobox.
			doCoordinates();
			// Languages
			doLanguages();

			doMainPage();  // Special case the main page.

			// infoboxes
			/*
			 * A problem with Infoboxes is that there can be several. It might be nice to grab
			 * them individually and place them individually.  However, this does not permit
			 * that; infoboxen would have to be managed in this method and not a subroutine.
			 */
			doInfoboxen();
			// navboxes
			doNavboxen();
			// small mboxes
			doMboxen();

			// Final clear point.
			$('#wsidebar').append( $('<br />').css('clear', 'both') );
		};

		// Blow away cookies when called!  Must exist; can be empty.
		this.clearCookies = function() {
			$.cookie('winterRightRail', null, { expires: 0, path: '/' });
		};

		/**
		 * PRIVATE METHODS
		 */

		/**
		 * Pull metadata and topicons out into their own section
		 */
		function doMetaData() {
			// Metadata!!

			// Featured star!
			// These don't have anything unique, so we can construct whole hearted.

			if (($('#featured-star').length) 
				|| ($('#protected-icon').length)
				|| ($('#good-star').length)
				|| ($('#spoken-icon').length) ) {
				// constuct the metadata box
				var mdBox = $('<div />').addClass('rr_box').addClass('rr_mdcontainer');

				// Featured
				if ($('#featured-star').length) {
					// Remove the extant featured-star
					$('#featured-star').remove();
					var tBox = $('<div />').addClass('rr_mdbox')
									.addClass('rr_fs')
									.text('Featured')
									.click(function() {
										window.location = "index.html?page=Wikipedia:Featured_articles";
									});
					mdBox.append(tBox);
				} else if ($('#good-star').length) {
					$('#good-star').remove();
					var tBox = $('<div />').addClass('rr_mdbox')
									.addClass('rr_fs')
									.text('Good')
									.click(function() {
										window.location = "index.html?page=Wikipedia:Good_articles";
									});
					mdBox.append(tBox);
				}

				// Protected
				if ($('#protected-icon').length) {
					// Remove the extant featured-star
					$('#protected-icon').remove();
					var tBox = $('<div />').addClass('rr_mdbox')
									.addClass('rr_prot')
									.text('Protected')
									.click(function() {
										window.location = "index.html?page=Wikipedia:Protection_policy";
									});
					mdBox.append(tBox);
				}
				// Spoken icon. Specialized.
				if ($('#spoken-icon').length) {
					//<a href="index.html?page=File:4chan.ogg" title="File:4chan.ogg"><img alt="Sound-icon.svg" src="http://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sound-icon.svg/15px-Sound-icon.svg.png" width="15" height="11" srcset="//upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sound-icon.svg/23px-Sound-icon.svg.png 1.5x, //upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sound-icon.svg/30px-Sound-icon.svg.png 2x" data-file-width="128" data-file-height="96"></a>
					// Remove the extant featured-star
					$('#spoken-icon').remove();
					var tBox = $('<div />').addClass('rr_mdbox')
								.addClass('rr_spoken').text('Listen');
					mdBox.append(tBox);
				}
				$('#wsidebar').append(mdBox);
			}
		}

		/**
		 * Pull coordinates out into their own section.
		 */
		function doCoordinates() {
			// Coordinates.  Do this before infobox, because it's actually inside the infobox.
			var $coClone = $('#coordinates').clone(true, true);
			if (($coClone.length) && (!$('.coord-missing').length)) {
				// Remove the old one.
				$('#coordinates').remove();
				$coClone.attr('id', ''); // remove its id
				var coBox = $('<div />').addClass('rr_box').addClass('rr_shortbox').addClass('rr_coords');
				coBox.append($coClone);
				$('#wsidebar').append(coBox);
			}			
		}

		function doMainPage() {
			if ($.winter.currentArticle != "Main Page") { return; }

			// Portal links
			var $tbClone = $('table#mp-topbanner').clone(true, true);
			if ($tbClone.length) {
				var cells = $tbClone.find('td:not(:first-child)');
				var t = $('<table/>').addClass('rr_box').attr('id', 'rr_portalbox').append( $('<tbody/>').append( $('<tr/>').append(cells) ));
				$('#wsidebar').append(t);
				$('table#mp-topbanner').remove();
			}

			// table#mp-right - pull into sidebar
			var $mpRClone = $('table#mp-right').clone(true, true);
			if ($mpRClone.length) {
				// Remove the old one.
				$('table#mp-right').remove();
				$('#wsidebar').append($mpRClone);
			}

			// Make the center column full-width now
			var $mpLClone = $('table#mp-left').clone(true, true);
			if ($mpLClone.length) {
				// Remove the old one.
				$('table#mp-left').remove();
				$('table#mp-upper').replaceWith($mpLClone);
			}

			// Add the title of the featured article into the box.
			var faLink = $('#mp-tfa b a, #mp-tfa i a').eq( 0 );
			if (faLink.length) {
				var h = $('<h3/>').html(faLink.attr('title'));
				$('#mp-tfa').children('p').eq(0).prepend(h);
			}

			// Hide all the controls for the main page
			$('#pagetitle').hide();
			$('#actiontabcontainer').css('margin-top', '20px');

		}

		/**
		 * Clone and move infoboxes into the right rail.
		 */
		function doInfoboxen() {

			// <div id="section_SpokenWikipedia" class="infobox sisterproject plainlinks haudio">

			// Move the infobox into the right rail.
			var $ibClone = $('.infobox').clone(true, true);
			if ($ibClone.length) {
				// Remove the old one.
				$('.infobox').remove();
				$('#wsidebar').append($ibClone);
			}
		}

		/**
		 * Clone and move navboxes into the right rail.  Only does for vertical-navboxes
		 */
		function doNavboxen() {
			// Move vertical-navbox into the right rail.
			var $nbClone = $('.vertical-navbox').clone(true, true);
			if ($nbClone.length) {
				// Remove the old one.
				$('.vertical-navbox').remove();
				$('#wsidebar').append($nbClone);
			}
		}

		/**
		 * Clone and move mbox-small into the right rail. 
		 */
		function doMboxen() {
			var $mbClone = $('.mbox-small').clone(true, true);
			if ($mbClone.length) {
				// Remove the old one.
				$('.mbox-small').remove();
				$('#wsidebar').append($mbClone);
			}
		}

		/**
		 * Grab the language list and slot that.
		 * PROBLEM: this currently grabs it as populated/created by the Page() object.  This 
		 * has some undesirable side-effects.  
		 * May want to grab the language list from Page() itself, but that would require
		 * sticking Page() into $.winter
		 */
		function doLanguages() {

			if ($('#langhints').length) {
				$('#pagelanglink').remove(); // removes all lang things

				var lBox = $('<div />').addClass('rr_box').addClass('rr_tight'); // master container

				var lhb = $('<div />').addClass('rr_langs'); // hints container
				var lHints = $('<ul />').attr('id', 'langhints');
				$.each($.winter.page.langlinks, function(number, ll) {
					if (number >= 5) return;
					lHints.append($('<li/>').append(ll.render()));
				});
				lhb.append(lHints);
				lBox.append(lhb);

				// Now build the full language list.
				// only do it if the count is more than the ones already shown.
				if ($.winter.page.langlinks.length > 5) {
					var alb = $('<div />').addClass('rr_alllangs').addClass('clearfix');

					var closer = $('<div />').addClass('rr_expando_close')
											.click(function() {
												$(this).parent().slideToggle('fast');
											});
					alb.append(closer);

					var lList = $('<ul />').attr('id', 'langlist');

					$.each($.winter.page.langlinks, function(number, ll) {
						lList.append( $('<li/>').append(ll.render()) );
					});
					alb.append( $('<div />').addClass('rr_interior').append(lList) );
					lBox.append(alb);

					// expando control
					var ex = $('<div />').addClass('rr_vert_expando')
										.click(function() {
											$(this).parent().children('.rr_alllangs').slideToggle('fast');
										}); 
					lBox.append(ex);
				}

				$('#wsidebar').append(lBox);
			}
		}

		/**
		 * Builds a generic content box for the right rail.
		 */
		function buildRailBox() {
			var theBox = $('<div />').addClass('rr_box');
			return theBox;
		}
	};

}( jQuery ));
