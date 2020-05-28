import React from 'react';
import logo from './logo.svg';
import './App.css';
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
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
          This is the timer value: {this.state.timestamp}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
