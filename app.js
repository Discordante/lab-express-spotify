require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:

app.get('/',(req, res, next) => {
    res.render('index')
})

app.get('/artist-search-results',(req, res, next) => {
    spotifyApi
    .searchArtists(req.query.singer)
    .then(data => {
        console.log('The received data from the API: ', data.body.artists)
        res.render('artist-search-results', { results: data.body })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/albums/:id', (req, res, next) => {
    spotifyApi
    .getArtistAlbums(req.params.id)
    .then(data => {
        res.render('albums', { results: data.body })
    })
    .catch(err => console.log('The error while searching artists occurred: ', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
