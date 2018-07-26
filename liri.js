require("dotenv").config();

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var keys = require("./keys.js");
var fs = require("fs");
var nrc = require('node-run-cmd');

var option = process.argv[2];



function runApp(option, s){
if (option == "my-tweets"){
 
var client = new Twitter({
  consumer_key: keys.twitter.consumer_key,
  consumer_secret: keys.twitter.consumer_secret,
  access_token_key: keys.twitter.access_token_key,
  access_token_secret: keys.twitter.access_token_secret
});

var params = {screen_name: 'boom_mona'};
client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
      for (var i = 0; i < 20; i++){
    console.log('\n Date:' + tweets[i].created_at);
    console.log(tweets[i].text);
      }
  }
});


}else if (option == "spotify-this-song"){
    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
      });

    var song= "";

    if (s == undefined){
        if (process.argv.length > 3){
        song= process.argv[3];

        for (var i = 4; i < process.argv.length; i++){
            song = song + " " + process.argv[i];
        }

        
        }else{
            song = "The Sign";
            
        }
    }else{
        song = s;
    }

    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        console.log("Artist: " + data.tracks.items[0].artists[0].name); 
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Album: " + data.tracks.items[0].album.name); 
        console.log("Spotify link: "+ data.tracks.items[0].external_urls.spotify);

      });

}else if (option == "movie-this"){

    var movie= "";

    if (process.argv.length > 3){
    movie= process.argv[3];

    for (var i = 4; i < process.argv.length; i++){
        movie = movie + " " + process.argv[i];
    }

    
    }else{
        movie = "Mr. Nobody";
        
    }

   request("http://www.omdbapi.com/?t="+movie+"&y=&plot=short&apikey=trilogy", function(error, response, body) {

  // If there were no errors and the response code was 200 (i.e. the request was successful)...
  if (!error && response.statusCode === 200) {

    
    console.log("Movie title: " + JSON.parse(body).Title);
    console.log("\n Year: " + JSON.parse(body).Year);
    console.log("\n IMDB Rating: " + JSON.parse(body).imdbRating);
    console.log("\n Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
    console.log("\n Country: " + JSON.parse(body).Country);
    console.log("\n Language: " + JSON.parse(body).Language);
    console.log("\n Plot: " + JSON.parse(body).Plot);
    console.log("\n Actors: " + JSON.parse(body).Actors+"\n");
  }

});
    
}else if (option == "do-what-it-says"){
    var dataArr = [];
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // We will then print the contents of data
        //console.log(data);
      
        // Then split it by commas (to make it more readable)
        dataArr = data.split(",");
      
        // We will then re-display the content as an array for later use.
        //console.log(dataArr);
        runApp(dataArr[0], dataArr[1]);
        
        //console.log("node liri.js "+ dataArr[0]+ " " + dataArr[1]);
      });

      
}
}

runApp(process.argv[2])