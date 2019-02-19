
//call all API Keys

exports.spotify = {
 id: process.env.SPOTIFY_ID,
 secret: process.env.SPOTIFY_SECRET
};

exports.bandsintown = {
    id: process.env.BANDSINTOWN_ID
}

exports.omdb = {
    id: process.env.OMDB_ID
}

console.log('this is loaded');