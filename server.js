
var express = require('express'); 
var request = require('request'); 
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var _ = require('lodash')

var dataFunctions = require('./fetch_data');
var fetchProfileData = dataFunctions.fetchProfileData;
var fetchTopArtists = dataFunctions.fetchTopArtists;
var fetchTopTracks = dataFunctions.fetchTopTracks;
var fetchPlaylistTracks = dataFunctions.fetchPlaylistTracks;

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = process.env.REDIRECT_URI; // Your redirect uri

const bodyParser = require('body-parser')

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';
var access_token = '';
var refresh_token = '';

var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/src/static'))
app.use(cookieParser());

app.set('views', __dirname + '/src/views');

app.get('/', function(req, res) {

  res.render('index.ejs', { show_app: false, data: {} });
})

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  var scope = 'user-read-private user-read-email user-top-read playlist-modify-public';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/playlist/:name-:id', function(req, res) {
  fetchPlaylistTracks(access_token, res, 0, req.params.id, req.params.name)
});

app.get('/dashboard', function(req, res) {
  fetchProfileData(access_token, res)
})

app.get('/callback', function(req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        access_token = body.access_token,
        refresh_token = body.refresh_token;
        res.redirect('/dashboard')
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.post('/playlist', function (req, res) {
  const playlist_id = req.body.id
  const old_playlist = {id: playlist_id, tracks: []}

  fetchPlaylistTracksForSort(access_token, res, 0, playlist_id, req)
})

var fetchPlaylistTracksForSort = function(access_token, res, offset, playlist_id, req, data = {}){
  var data = _.isEmpty(data) ? {name: req.body.name, id: playlist_id, tracks: []} : data;
  var options = {
    url: `https://api.spotify.com/v1/users/tim.hammer/playlists/${playlist_id}/tracks?offset=${offset}`,
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  }

  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      for(var key in response.body.items){
        var track = response.body.items[key]
        data.tracks.push({
          name: track.track.name,
          artists: _.map(track.track.artists, function(entry) { return entry.name }),
          album: track.track.album.name,
          added_at: track.added_at,
          id: track.track.id
        })
      }
      if(response.body.items.length === 0)
        sortPlaylist(data.tracks, req.body.tracks, playlist_id, req.body.name, res)
      else
        fetchPlaylistTracksForSort(access_token, res, offset+=100, playlist_id, req, data)
    }
    else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'could_not_retrieve_playlists_for_sort'
        }))
    }
  })
}


var sortPlaylist = function(old_tracks, new_tracks, playlist_id, playlist_name, res) {
  replaceTrack(old_tracks, new_tracks, 0, playlist_id, playlist_name, res)
}

var replaceTrack = function(old_tracks, new_tracks, new_index, playlist_id, playlist_name, res){
  if(new_index < new_tracks.length){
    const old_index = _.findIndex(old_tracks, (old_track) => { return old_track.id === new_tracks[new_index].id })
    var options = {
      url: `https://api.spotify.com/v1/users/tim.hammer/playlists/${playlist_id}/tracks`,
      headers: { 'Authorization': 'Bearer ' + access_token },
      json: true,
      method: 'PUT',
      body: {range_start: old_index, insert_before: new_index}
    }

    request.put(options, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        old_tracks.splice(new_index, 0, old_tracks.splice(old_index, 1)[0])
        replaceTrack(old_tracks, new_tracks, new_index+=1, playlist_id, playlist_name, res)
      }
      else {
        console.log(body.error)
      }
    })
  }
  else{
    return('all done here')
  }
}

console.log('Listening on 8888');
app.listen(8888);
