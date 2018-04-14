import React, { Component } from 'react';
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Router, browserHistory, Link, Route } from 'react-router';
import { connect } from 'react-redux';
import { loadProfileData } from './actions/profile'
import _ from 'lodash'

const ArtistsTable = ({entries, title}) => {
  const items = _.map(entries, (entry) => {
    return (
      <tr>
        <td><a href={entry.external_urls.spotify} target="_blank">{entry.name}</a></td>
      </tr>
    )
  })
  return (
    <div>
      <h4>{title}:</h4>
      <table>
        <tbody>
          {items}
        </tbody>
      </table>
    </div>
  );
}

const TracksTable = ({entries, title}) => {
  console.log(entries)
  const items = _.map(entries, (entry) => {
    return (
      <tr>
        <td><a href="#" target="_blank">{entry.name}</a></td>
        <td>{entry.album}</td>
        <td>{entry.artist}</td>
      </tr>
    )
  })
  return (
    <div>
      <h4>{title}:</h4>
      <table>
        <tbody>
          <tr>
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

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentWillMount(){
    this.props.dispatch(loadProfileData(this.props.data))
  }

  render() {
    if (!_.isEmpty(this.props.profileData)){
      const profileData = this.props.profileData
      
      return (
        <div className="app-container">
          <h3>Welcome, {profileData.user}!</h3>
          <ArtistsTable title="Top Artists" entries={profileData.top_artists} />
          <TracksTable title="Top Tracks" entries={profileData.top_tracks} />
        </div>
      );
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
