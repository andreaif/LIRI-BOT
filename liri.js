// Requier donwload npm 
require("dotenv").config();
let request = require("request");
const moment = require("moment");
const fs = require("fs"); 
const keys = require("./keys.js"); // Link for API keys
const Spotify = require("node-spotify-api"); // SPOTIFY
const spotify = new Spotify(keys.spotify);
let omdb = (keys.omdb); // OMDB 
let bandsintown = (keys.bandsintown); //bansintown

// COMMAND AND INPUT
let userInput = process.argv[2];
let userQuery = process.argv.slice(3).join(" ");

function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            doThis(userQuery);
            break;
        default:
            console.log("Ask me again!");
            break;
    }
}

userCommand(userInput, userQuery);


//function concert-this - Bands in town API 
function concertThis() {
    console.log(`\n - - - - -\n\nSEARCHING FOR...${userQuery}'s next show...`);
    request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=" + bandsintown, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let bandName = JSON.parse(body);
            if (bandName.length > 0) {
                for (i = 0; i < 1; i++) {
                    console.log(`\nTARRRRRRA!...\n\nArtist: ${bandName[i].lineup[0]} \nVenue: ${bandName[i].venue.name}\nVenue Location: ${bandName[i].venue.latitude},${bandName[i].venue.longitude}\nVenue City: ${bandName[i].venue.city}, ${bandName[i].venue.country}`)

                    // MOMENT.JS TO FORMAT THE DATE MM/DD/YYYY
                    let concertDate = moment(bandName[i].datetime).format("MM/DD/YYYY hh:00 A");
                    console.log(`Date and Time: ${concertDate}\n\n- - - - -`);
                };
            } else {
                console.log('Not found!');
            };
        };
    });
};

//function spotify-this-song - Spotify API 
function spotifyThisSong() {
    console.log(`\n - - - - -\n\nSEARCHING FOR..."${userQuery}"`);

    // NOT FOUND, DEFAULT"ACE OF BASE" 
    if (!userQuery) {
        userQuery = "the sign ace of base"
    };
    spotify.search({
        type: 'track',
        query: userQuery,
        limit: 1
    }, function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
     }
       let spotifyArr = data.tracks.items;

        for (i = 0; i < spotifyArr.length; i++) {
           console.log(`\nTARRRRRRA!...\n\nArtist: ${data.tracks.items[i].album.artists[0].name} \nSong: ${data.tracks.items[i].name}\nAlbum: ${data.tracks.items[i].album.name}\nSpotify link: ${data.tracks.items[i].external_urls.spotify}\n\n - - - - -`)
     };
  });
}

//function movie-this - omdb API 
function movieThis() {
    console.log(`\n - - - - -\n\nSEARCHING FOR..."${userQuery}"`);
    if (!userQuery) {
        userQuery = "mr nobody";
    };
    request("http://www.omdbapi.com/?t=" + userQuery + "&apikey=ae9172", function (error, response, body) {
        let movieName = JSON.parse(body);

        // BECAUSE THE ROTTEN TOMATOES RATING WAS NESTED IT WAS NECESSARY TO CAPTURE ITS VALUES IN AN ARRAY TO CREATE A PATH
        let ratingsArr = movieName.Ratings;
        if (ratingsArr.length > 2) {}

        if (!error && response.statusCode === 200) {
            console.log(`\nTARRRRRRA!...\n\nTitle: ${movieName.Title}\nCast: ${movieName.Actors}\nReleased: ${movieName.Year}\nIMDb Rating: ${movieName.imdbRating}\nRotten Tomatoes Rating: ${movieName.Ratings[1].Value}\nCountry: ${movieName.Country}\nLanguage: ${movieName.Language}\nPlot: ${movieName.Plot}\n\n- - - - -`)
        } else {
            return console.log("Not found!. Error:" + error)
        };
    })
};

//function do-what-it-says API
function doThis() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        let dataArr = data.split(",");
        userInput = dataArr[0];
        userQuery = dataArr[1];
        userCommand(userInput, userQuery);
    });
};