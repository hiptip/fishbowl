import React from 'react';
import './App.css';
import SocketContext from './SocketContext';
import NewSession from './FishBowl/NewSession';
import JoinSession from './FishBowl/JoinSession';
import { subscribeToTimer } from './api';
import openSocket from 'socket.io-client';
import { useRoutes } from "hookrouter";
import routes from "./router";


const socket = openSocket('http://localhost:9000');

function App() {
  const routeResult = useRoutes(routes);
  return routeResult;
}

export default App;
