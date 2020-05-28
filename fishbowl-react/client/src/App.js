import React from 'react';
import { Router, Route, Switch } from "react-router";
import logo from './logo.svg';
import './App.css';
import NewSession from './FishBowl/NewSession'
import { subscribeToTimer } from './api';



class App extends React.Component {
  state = {
    timestamp: 'no timestamp yet'
  };
  constructor(props) {
    super(props);
    subscribeToTimer((err, timestamp) => this.setState({ 
      timestamp 
    }));
  };
  render() {
    //if new session, render intro
    if (true) {
      return <NewSession timestamp={this.state.timestamp}/>;
    }
    //else return the game
  }
}

export default App;
