var request = require('request') 
var querystring = require('querystring')
var _ = require('lodash')

var fetchProfileData = function(access_token, res){
  var options = {
    url: 'https://api.spotify.com/v1/me',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  }
  request.get(options, function(error, response, body) {
    var data = {}
    if (!error && response.statusCode === 200) {
      data.user = response.body.id
      fetchTopArtists(access_token, data, res)
    }
    else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'could_not_retrieve_profile_information'
        }))
    }
  })
}

var fetchTopArtists = function(access_token, data, res){
  var options = {
    url: 'https://api.spotify.com/v1/me/top/artists?time_range=long_term',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  }
  request.get(options, function(error, response, body) {
    data.top_artists = []
    if (!error && response.statusCode === 200) {
      for(var key in response.body.items){
        var artist = response.body.items[key]
        data.top_artists.push({ name: artist.name, external_urls: artist.external_urls })
      }
      fetchTopTracks(access_token, data, res)
    }
    else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'could_not_retrieve_top_artists'
        }))
    }
  })
}

var fetchTopTracks = function(access_token, data, res){
  var options = {
    url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  }

  request.get(options, function(error, response, body) {
    data.top_tracks = []
    if (!error && response.statusCode === 200) {
      for(var key in response.body.items){
        var track = response.body.items[key]
        data.top_tracks.push({ name: track.name, artist: track.artists[0].name, album: track.album.name, external_urls: track.external_urls })
      }
      fetchPlaylists(access_token, data, res)
    }
    else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'could_not_retrieve_top_tracks'
        }))
    }
  })
}

var fetchPlaylists = function(access_token, data, res){
  var options = {
    url: 'https://api.spotify.com/v1/me/playlists',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  }

  request.get(options, function(error, response, body) {
    data.playlists = []
    if (!error && response.statusCode === 200) {
      for(var key in response.body.items){
        var playlist = response.body.items[key]
        if (playlist.owner.id === 'tim.hammer'){
          data.playlists.push({
            name: playlist.name,
            id: playlist.id
          })
        }
      }
      res.render('index', { show_app: true, data: data })
    }
    else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'could_not_retrieve_playlists'
        }))
    }
  })
}

var fetchPlaylistTracks = function(access_token, res, playlist_id, name){
  var data = {name: name, id: playlist_id, tracks: []}
  var options = {
    url: `https://api.spotify.com/v1/users/tim.hammer/playlists/${playlist_id}/tracks`,
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
      res.render('playlist', { show_app: true, data: data })
    }
    else {
      res.redirect('/#' +
        querystring.stringify({
          error: 'could_not_retrieve_playlists'
        }))
    }
  })
}




module.exports = {
  fetchProfileData: fetchProfileData,
  fetchTopArtists: fetchTopArtists,
  fetchTopTracks: fetchTopTracks,
  fetchPlaylistTracks: fetchPlaylistTracks
}
