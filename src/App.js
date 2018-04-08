import React, { Component } from 'react';
//import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Router, browserHistory, Link, Route } from 'react-router';

const Home = ({match, location, history}) => {
  return (
    <div>
      <h3>Home</h3>
    </div>
  );
}

export { Home };

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {
    //this.props.history.push('')
    return (
      <div className="app-container">
        <h1> This is the app, successfully rendered!  Yay! </h1>

        <div className="app-container">{this.props.children}</div>
      </div>
    );
  }
}

export default App;
