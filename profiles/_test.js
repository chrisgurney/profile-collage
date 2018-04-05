/**
 * Gets test data from randomuser.me.
 * Outputs JSON and downloads pictures to the current directory.
 * If needed, you can temporarily host JSON on http://myjson.com/ for testing.
 * 
 * Usage: node _test.js > _test.json
 */

'use strict';

const https = require("https");
const fs = require("fs");

const url = "https://randomuser.me/api/?nat=us,ca&results=100&inc=name,login,picture";

// additional random data (optional)
var test_locations = 
  ['toronto-ca', 'sanfrancisco-us', 'london-uk', 'somewhereelse'];
var test_titles = 
  ['UX Designer', 'Developer', 'Sr. Developer', 'Product Manager', 
   'Sales East', 'Sales West', 'Accounts Receivable', 'Customer Support', 
   'Client Services', 'Recruiter', 'Benefits Coordinator'];

https.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {

    body = JSON.parse(body);
    var results = body.results;

    console.log('{');
    console.log('  "profiles" : [');

		for (var i = 0; i < results.length; i++) {

      console.log('    {');
      console.log(`      "first_name": "${results[i].name.first}",`);
      console.log(`      "last_name": "${results[i].name.last}",`);
      console.log(`      "user_id": "${results[i].login.username}",`);
      console.log(`      "job_title": "${test_titles[Math.floor(Math.random() * test_titles.length)]}",`);
      console.log(`      "location": "${test_locations[Math.floor(Math.random() * test_locations.length)]}"`);
      if (i != results.length - 1) {
        console.log('    },');        
      }
      else {
        console.log('    }');        
      }

      // download photo as username.jpg
      var file_url = results[i].picture.large;
      var file_name = results[i].login.username + '.jpg';
      // console.log(`Downloading: ${file_url} as ${file_name}`);
      download(file_url, file_name, function() {});

	  }

    console.log('  ]');
    console.log('}');

  });
});

/**
 * Downloads provided URL to given destination.
 */
var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};