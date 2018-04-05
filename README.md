# Profile Collage

Have a TV sitting around the office doing nothing?

This web app displays a grid of profile photos, choosing one at random on an interval, displaying more information about that individual. It has been formatted for large televisions.

Data is pulled from a given JSON endpoint (see below).

## Installation + Configuration

This is a self-contained web app that includes all dependencies.

Download everything to a directory, customize these files to use your branding (logo, colors):

* `index.html` - Points to logo image `images/collage-logo.png`.
* `/js/profile-collage.js` - Points to JSON endpoint, and defines dimensions of grid (may need to customize, depending on TV size). Customize how locations are mapped to location icons here (optional).
* `/css/profile-collage.css` - Defines font, background image, and background color (shown behind tiles).

The JSON endpoint needs to provide JSON in the following format:

```{
 	"profiles" : [
 		{
 			"first_name": "dwight",
 			"last_name": "howard",
 			"user_id": "heavytiger568",
			"job_title": "Customer Support",
			"location": "toronto-ca"
 		},
 		...```

Download profile images to `/profiles` with filenames that correlate to the `user_id` of each profile. The `_test.js` node script might be helpful here (see _Testing_).

## Testing

You can use the `/profiles/_test.js` script to pull down profiles from <https://randomuser.me>. This script outputs JSON and downloads profile photos to the current directory.

		$ node _test.js > _test.json

If needed, you can temporarily host the JSON on <http://myjson.com/> for testing.

# FUTURE

Improvements I want to make in the future:

* Put all configuration into a single JSON file, read in via JavaScript and set in HTML.

# Credits

* Building background image by Sean Pollock via Unsplash.