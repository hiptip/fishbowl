import React from 'react';
import { Router, Route, Switch } from "react-router";
import logo from './logo.svg';
import './App.css';
import SocketContext from './SocketContext'
import NewSession from './FishBowl/NewSession'
import { subscribeToTimer } from './api';
import openSocket from 'socket.io-client'

const socket = openSocket('http://localhost:9000');

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
      return  (
        <SocketContext.Provider value={socket}>
          <NewSession timestamp={this.state.timestamp}/>
        </SocketContext.Provider>
      )
    }
    //else return the game
  }
}

export default App;
