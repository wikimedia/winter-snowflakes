/**
 * testmode
 * Brandon Harris (bharris@wikimedia.org)
 * This is the "Testing mode" module.  When enabled, the framework enters "tester mode" and several
 * behaviors change:
 *   1) The welcome text on the "login" screen changes.
 *   2) The personal tools actions are set to masquerade as other people
 *   3) Sidebar toggles are hidden and disabled.
 *   4) Page content and titles are massaged to further enable masquerade mode.
 */

(function ( $ ) {

	// Define required version of the Winter framework.
	var requiredVersion = 0.6;

	// What to do on startup.
	$(function() {
		// Instantiate!
		var om = new TestMode();

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


	var TestMode = function() {
		// Define our module name
		this.name = 'testmode';

		// Define the test user name.
		this.defaultUserName = 'Accedie';
		
		// This is our init method. You want to call it on startup, after instantiation.		
		this.init = function () {
			// Change some text on the welcome screen.
			var welcomeText = "<p>This is an interactive prototype being used to test updates to the interface for Wikipedia. It is in progress and you may run into bugs or issues. Remember we're testing the system, not you, so have fun and try to act as you normally would on the site.</p><p>This is only a prototype, and nothing you do here will harm Wikipedia, or be saved by the system.</p><p>Please choose a user name to personalize your experience using the prototype:</p>";

			$('#welcometext').html(welcomeText);

			// Hide all the extra control toggles.
			$('#extracontrols').hide();
			// Hide the version marker
			$('#winterversion').hide();
			$('#saveitbox').hide();
		};

		// This method is called when data is loaded and the page must be modified.
		// Must exist; can be empty.
		this.fireHandler = function() {
			console.log("Firing loadHandler for " + this.name);
			//console.log("Default Username: " + this.defaultUserName);

			// the fact that I have to make this local context is stupid.
			var defaultUserName = this.defaultUserName; 

			// Fix user tools
			setNavigation(this.defaultUserName);
			// Fix content and titles
			cleanContent(this.defaultUserName);
		};

		// Blow away cookies when called!  Must exist, can be empty.
		this.clearCookies = function() { };

		/**
		 * PRIVATE METHODS (not really private, hurr durr durr)
		 */

		/**
		 * Resets the targets for the user tools menu and sets them to the forced default user name.
		 * @param defaultUserName the username to masquerade as.
		 */
		function setNavigation(defaultUserName) {
			// This resets the click events for core navigation.
			$("#thediscussion").click(function() {
				window.location = 'index.html?page=User_talk:' + defaultUserName;
			});
			$("#usermenutalk").click(function() {
				window.location = 'index.html?page=User_talk:' + defaultUserName;
			});
			$("#usermenuuserpage").click(function() {
				window.location = 'index.html?page=User:' + defaultUserName;
			});
			$("#theavatar").click(function() {
				window.location = 'index.html?page=User:' + defaultUserName;
			});
			$("#theusername").click(function() {
				window.location = 'index.html?page=User:' + defaultUserName;
			});
			$("#usermenucontributions").click(function() {
				window.location = 'index.html?contribs=' + defaultUserName;
			});
		}

		/**
		 * Grinds the page content and the title and replaces text/usernames
		 * @param defaultUserName the username to masquerade as.
		 */
		function cleanContent(defaultUserName) {
			// This changes page titles, if necessary.
			var pageTitle = $('#pagetitle').html();
			pageTitle = pageTitle.replace(new RegExp(defaultUserName, 'gi'), $.winter.globalUserName);
			$('#pagetitle').html(pageTitle);

			// And this cleans up references in page text.
			var pageText = $('#pagecontent').html();
			pageText = pageText.replace(new RegExp(defaultUserName, 'gi'), $.winter.globalUserName);	
			$('#pagecontent').html(pageText);
		}
	};



}( jQuery ));
