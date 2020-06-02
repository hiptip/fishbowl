import './App.css';
import { useRoutes } from "hookrouter";
import routes from "./router";
import React from 'react';
import FishBowlApp from './FishBowl/FishBowlApp';

class App extends React.Component {
  render() {
    return (
      <FishBowlApp />
    )
  }
}

export default App;
