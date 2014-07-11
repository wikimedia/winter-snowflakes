
Creating Snowflakes

Snowflakes are Winter modules.  They change the behavior of the prototype.

Each snowflake requires two files: a javascript file and a css file.  The css file can be empty but it *must* exist.

Create a directory in the "snowflakes" directory named for your module. The .css and .js files must be named the same.  So:

		snowflakes/mymodule/mymodule.js
		snowflakes/mymodule/mymodule.css

The js file is a simple jquery thingamajig.  Look at "darkfooter" for a simple example or "testmode" for a more complex one.

Snowflakes are activated and loaded from index.html inside the primary <script> section.  Look for the section labeled "WINTER: MODULES" and clone one of the lines below, inserting the name of the module to be loaded.  The framework will take care of loading the js and css files for you.

(Note that this process will likely be reworked to use a more intelligent manifest).








