import React from "react";
import NewSession from './FishBowl/NewSession';
import JoinSession from './FishBowl/JoinSession';
import SocketContext from './SocketContext';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:9000');

const routes = {
  "/": () => 
        <SocketContext.Provider value={socket}>
            <NewSession /> 
        </SocketContext.Provider>,
  "/join": () => 
        <SocketContext.Provider value={socket}>
            <JoinSession /> 
        </SocketContext.Provider>,
};



export default routes;