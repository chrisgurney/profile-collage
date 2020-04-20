function color(ranges) {
	if (!ranges) {
		ranges = [
			[200, 256],
			[200, 256],
			[200, 256]
		];
	}
	var value = function() {
		// select random range and remove
		var range = ranges.splice(Math.floor(Math.random()*ranges.length), 1)[0];
		// pick a random number from within the range
		return Math.floor(Math.random() * (range[1] - range[0])) + range[0];
	}
	return "rgba(" + value() + "," + value() + "," + value() +",0.9)";
};	

function nextCard() {

	// animate the card out
	$('.card').removeClass('card-anim-in');
	$('.card').addClass('card-anim-out');
	
	setTimeout(function() {
	
		$('.card').addClass('hidden');

		var $user_photos = $('#ri-grid').children('ul').children();

		// take old photo out of focus
		var user_photo_old_li = $('.selected').get();
		var user_photo_old = $(user_photo_old_li).children('a');
		$(user_photo_old).css('transition','all 0.5s linear 0ms');
		$(user_photo_old).css('-webkit-transition','all 0.5s linear 0ms');
		$(user_photo_old).removeClass('focus');
		$(user_photo_old).addClass('gray');
		$(user_photo_old_li).removeData('nochange');
		
		// find a random photo to focus on, that is visible, and don't pick the same one twice
		var user_photo_index = Math.floor(Math.random() * $user_photos.length);
		var user_photo_li = $user_photos.get(user_photo_index);
		var user_photo = $(user_photo_li).children('a');
		while ($(user_photo_li).hasClass('selected') || (user_photo.context.offsetTop > window.innerHeight)) {
			user_photo_index = Math.floor(Math.random() * $user_photos.length);
			user_photo_li = $user_photos.get(user_photo_index);
			user_photo = $(user_photo_li).children('a');
		}
		
		// now that we have a new one, we can remove the selected class
		$(user_photo_old_li).removeClass('selected');					

		// put new photo in focus
		$(user_photo_li).data('nochange','true');
		$(user_photo_li).addClass('selected');
		$(user_photo).css('transition','all 0.5s linear 0ms');
		$(user_photo).css('-webkit-transition','all 0.5s linear 0ms');					
		$(user_photo).removeClass('gray');
		$(user_photo).addClass('focus');

		// copy data to user card
		var $user_id = $(user_photo).data('user-id');				
		var $user_name = $(user_photo).data('user-name');
		var $user_title = $(user_photo).data('user-title');
		var $user_location = $(user_photo).data('user-location');
		var $user_image_url = "./profiles/" + $user_id + ".jpg";
		$('.card-photo').css('background-image', 'url(' + $user_image_url + ')');
		$('.card-name').text($user_name);
		$('.card-title').text($user_title);
		$('.card-content').css('background-color', color());

		// map given locations to filenames (if necessary)		
		switch ($user_location) {
			case 'Toronto':
			case 'Toronto, ON':
			case 'Toronto, Ontario':						
			case 'toronto-ca':						
				$location = 'toronto-ca';
				break;
			case 'sanfrancisco-us':
				$location = 'sanfrancisco-us';							
				break;
			case 'london-uk':
				$location = 'london-uk';						
				break;
			default:
				$location = 'default';
		}

		var $user_location_image_url = "./images/locations/" + $location + ".png";
		$('.card-location').css('background-image', 'url(' + $user_location_image_url + ')');

		setTimeout(function() {

			// show card
			$('.card').removeClass('card-anim-out');					
			$('.card').addClass('card-anim-in');
			$('.card').removeClass('hidden');

			// center the card vertically
			var $cardHeightHalf = ($('.card-content').height() + ($('.card-photo').height() / 4)) / 2;
			var $cardY = window.innerHeight/2 - $cardHeightHalf;				
			$('.card').css('margin-top', $cardY);
		
		}, 1500);					
		
	}, 1000);
					
}

String.prototype.toTitleCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

/**
 * Loads the JSON from the provided URL.
 * 
 * Format:
 * {
 * 	"profiles" : [
 *  	{
 *      "first_name": "dwight",
 *      "last_name": "howard",
 *      "user_id": "heavytiger568",
 *      "job_title": "Customer Support",
 *      "location": "toronto-ca"
 *    },
 *		...
 */
 // ./profiles/_test.json
$.getJSON("https://chrisgurney.github.io/profile-collage/demo.json", function(json) {

	profiles = json.profiles;
	profilesHtml = '<ul id="profiles">';

	for (i = 0; i < profiles.length; i++) {

		user_name = profiles[i].first_name + ' ' + profiles[i].last_name;
		user_name = user_name.replace("-", "&#8209;");
		user_name = user_name.toTitleCase();
		user_title = profiles[i].job_title.replace("-", "&#8209;");
		user_id = profiles[i].user_id;
		user_location = profiles[i].location;
		user_image = './profiles/' + user_id + '.jpg';

		profilesHtml += '<li>';
		profilesHtml += '<a href="#" title="' + user_name + '" data-user-id="' + user_id + '" data-user-name="' + user_name + '" data-user-title="' + user_title + '" data-user-location="' + user_location + '" target="_blank"><img src="' + user_image + '"/></a>';
		profilesHtml += '</li>';

	}
	
	profilesHtml += '</ul>';

	document.getElementById("ri-grid").innerHTML = profilesHtml;

	// remove the spinner
	document.getElementById("spinner").remove();

}).then(function(result) {

	// layout the photo grid
	$('#ri-grid').gridrotator( {
		rows : 7,
		columns : 12,
		animType : 'fadeInOut',
		animSpeed : 4000,
		interval : 1000,
		step : 'random',
		w1024 : {
			rows : 5,
			columns : 6
		},
		w768 : {
			rows : 5,
			columns : 5
		},
		w480 : {
			rows : 6,
			columns : 4
		},
		w320 : {
			rows : 7,
			columns : 4
		},
		w240 : {
			rows : 7,
			columns : 3
		},
	} );

	// main loop to show cards
	nextCard();				
	(function myLoop(i) {
		setTimeout(function () {
			nextCard();
			if (--i) myLoop(i);
		}, 10000) // delay in milliseconds
	})(Infinity); // number of iterations			

});