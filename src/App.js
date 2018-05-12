import React, { Component } from 'react';
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Router, browserHistory, Link, Route } from 'react-router';
import { connect } from 'react-redux';
import { loadProfileData } from './actions/profile'
import _ from 'lodash'
import Playlist from './components/playlist'
import './static/css/styles.css'

const ArtistsTable = ({entries, title}) => {
  const items = _.map(entries, (entry, index) => {
    return (
      <tr key={entry.name}>
        <td>{index+1}</td>
        <td><a href={entry.external_urls.spotify} target="_blank">{entry.name}</a></td>
      </tr>
    )
  })
  return (
    <div className="top-artists">
      <h4>{title}:</h4>
      <table className="top-artists-table">
        <tbody>
          {items}
        </tbody>
      </table>
    </div>
  );
}

const TracksTable = ({entries, title}) => {
  const items = _.map(entries, (entry, index) => {
    return (
      <tr key={entry.name+entry.album}>
        <td>{index+1}</td>
        <td><a href="#" target="_blank">{entry.name}</a></td>
        <td>{entry.album}</td>
        <td>{entry.artist}</td>
      </tr>
    )
  })
  return (
    <div className="top-tracks">
      <h4>{title}:</h4>
      <table className="top-tracks-table">
        <tbody>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Album</th>
            <th>Artist</th>
          </tr>
          {items}
        </tbody>
      </table>
    </div>
  );
}

const Playlists = ({entries}) => {
  const items = _.map(entries, (entry, index) => {
    return (<tr key={entry.name}>
        <td>{index+1}</td>
        <td><a href={"playlist/" + entry.name + '-' +entry.id}>{entry.name}</a></td>
      </tr>
    )
  }); 
  return(
    <div className="playlists">
      <h4>Playlists</h4>
      <table className="playlists-table">
        <tbody>
          {items}
        </tbody>
      </table>
    </div>
  )
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    if (!_.isEmpty(this.props.data) && this.props.template === 'dashboard'){
      const profileData = this.props.data
      return (
        <div className="app-container">
          <h3>Welcome, {profileData.user}!</h3>
          <table className="dashboard-table"><tbody>
            <tr>
              <td>
                <Playlists entries={profileData.playlists} />
              </td>
              <td className="separator"></td>
              <td>
                <ArtistsTable title="Top Artists" entries={profileData.top_artists} />
              </td>
              <td className="separator"></td>
              <td>
                <TracksTable title="Top Tracks" entries={profileData.top_tracks} />
              </td>
            </tr>
          </tbody></table>
        </div>
      );
    }

    else if (!_.isEmpty(this.props.data) && this.props.template === 'playlist'){
      return (
        <Playlist data={this.props.data} />
      )
    }
    else{
      return (
        <p>Loading...</p>
        )
    }
  }
}

function mapStateToProps(state){
  return { profileData: state.profileData }
}

export default connect(
  mapStateToProps
)(App);
