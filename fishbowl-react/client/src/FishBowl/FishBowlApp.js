import React, { Component } from "react";
import NewSession from './NewSession';
import JoinSession from './JoinSession';
import CreateCard from './CreateCard';
import ChooseTeam from './ChooseTeam';
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
        sessionStorage.setItem("state", this.state);
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
           
            <Router>
                <Switch>
                    <Route exact path="/" render={withRouter((props) => <NewSession {...props} state={this.state} socket={socket} setHost={this.setHost}/>)} />
                    <Route path="/join" render={withRouter((props) => 
                        <div>
                            <JoinSession {...props} 
                                state={this.state} 
                                socket={socket} 
                                setPlayerName={this.setPlayerName}
                                setGameId={this.setGameId}
                            />
                            {/* <ChooseTeam {...props}
                                state={this.state} 
                                socket={socket} 
                            /> */}
                        </div>
                    )} />
                    <Route path="/create" render={withRouter((props) => <CreateCard {...props} state={this.state} socket={socket} />)} />
                    <Route path="/game" render={withRouter((props) => <Game {...props} state={this.state} socket={socket} />)} />
                </Switch>
            </Router>
           
        )
       
    }
    



}
