import React, { Component } from "react";
import history from './history';
import NewSession from './NewSession';
import JoinSession from './JoinSession';
import CreateCard from './CreateCard';
import Game from './Game';
// import SocketContext from './SocketContext';
import openSocket from 'socket.io-client';
// import { useRoutes } from "hookrouter";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    withRouter
  } from "react-router-dom";

const socket = openSocket('http://localhost:9000');

export default class FishBowlApp extends Component {
    constructor(props) {
        super(props);
        // this.socket = socket.connect();
        // this.socket.on('startGame', this.startGame);
        this.state = {
            appRole: null,
            playerName: null,
            gameId: null,
            team: null,
            gameRole: null,
            myTurn: null,
        };
        
    }

    componentDidMount = () => {
        this.socket = socket.connect();
        this.socket.on('newGameCreated', this.gameDeets);
        this.socket.on('startGame', this.startGame);
    }

    startGame = (data) => {
        history.push('/create');
        //why is this not loading?
    }

    gameDeets = (data) => {
        console.log(data);
        this.setState({ gameId : data.gameId })
    }

    setGame = () => {
        // Socket stuff
    }

    setPlayerName = (name) => {
        this.setState({ playerName : name })
    }

    setGameId = (game) => {
        this.setState({ gameId : game });
    }

    setHost = () => {
        this.setState({ appRole : "Host" });
    }


    // State Mods

    // State Refresh Function


    render = () => {
        return (
           
            <Router history={history}>
                <Switch>
                    <Route exact path="/" render={withRouter((props) => <NewSession {...props} state={this.state} socket={socket} setHost={this.setHost}/>)} />
                    <Route path="/join" render={withRouter((props) => <JoinSession {...props} 
                        state={this.state} 
                        socket={socket} 
                        setPlayerName={this.setPlayerName}
                        setGameId={this.setGameId}
                        />)} />
                    <Route path="/create" render={withRouter((props) => <CreateCard {...props} state={this.state} socket={socket} />)} />
                    <Route path="/game" render={withRouter((props) => <Game {...props} state={this.state} socket={socket} />)} />
                </Switch>
            </Router>
           
        )
       
    }
    



}
