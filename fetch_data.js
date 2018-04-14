var request = require('request'); 
var querystring = require('querystring');

var fetchProfileData = function(access_token, res){
  var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };
  request.get(options, function(error, response, body) {
    var data = {};
    if (!error && response.statusCode === 200) {
      data.user = response.body.id;
      fetchTopArtists(access_token, data, res);
    }
    else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'could_not_retrieve_profile_information'
        }));
    }
  });
}

var fetchTopArtists = function(access_token, data, res){
  var options = {
    url: 'https://api.spotify.com/v1/me/top/artists?time_range=long_term',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };
  request.get(options, function(error, response, body) {
    data.top_artists = [];
    if (!error && response.statusCode === 200) {
      for(var key in response.body.items){
        var artist = response.body.items[key];
        data.top_artists.push({ name: artist.name, external_urls: artist.external_urls });
      }
      fetchTopTracks(access_token, data, res);
    }
    else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'could_not_retrieve_top_artists'
        }));
    }
  });
}

var fetchTopTracks = function(access_token, data, res){
  var options = {
    url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };

  request.get(options, function(error, response, body) {
    data.top_tracks = [];
    if (!error && response.statusCode === 200) {
      for(var key in response.body.items){
        var track = response.body.items[key];
        data.top_tracks.push({ name: track.name, artist: track.artists[0].name, album: track.album.name, external_urls: track.external_urls });
      }
      res.render('index', { show_app: true, data: data });
    }
    else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'could_not_retrieve_top_tracks'
        }));
    }
  });
}

module.exports.fetchProfileData = fetchProfileData;
module.exports.fetchTopArtists = fetchTopArtists;
module.exports.fetchTopTracks = fetchTopTracks;