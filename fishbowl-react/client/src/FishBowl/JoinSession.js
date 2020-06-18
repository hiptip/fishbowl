import React from 'react';
import SocketContext from '../SocketContext';
import ChooseTeam from './ChooseTeam';
import { withRouter } from 'react-router-dom'

class JoinSession extends React.Component {
    constructor(props) {
        super(props);
        this.playerName = React.createRef();
        this.gameID = React.createRef();
        this.socket = this.props.socket.connect();
        // this.setPlayerName = this.props.setPlayerName;
        this.socket.on('error', this.error);
        //update list of players in room
        this.socket.on('playerJoinedRoom', this.addPlayerToList);
        this.socket.on('startGame', this.startGame)
        this.state = {
            playerList : []
        }
    }

    joinGame = () => {
        var data = {
            gameId : this.gameID.current.value,
            playerName : this.playerName.current.value || 'anon'
        };
        this.props.setGameId(this.gameID.current.value);
        this.props.setPlayerName(this.playerName.current.value);
        // Send the gameId and playerName to the server
        this.props.socket.emit('playerJoinGame', data);
        
    }

    error = (data) => {
        alert(data.message);
    }


    addPlayerToList = (data) => {
        if (Array.isArray(data)) {
            this.setState(
                { playerList: [...this.state.playerList, ...data] }
            )
        } else {
            this.setState(
                { playerList: [...this.state.playerList, data] }
            )
        }
    }

    hostStartGame = () => {
        this.props.socket.emit('startGame', this.props.state.gameId);
    }

    startGame = (data) => {
        this.props.history.push('/create');
    }

    render() {
        return (
            <div className='Join-session'>
                <div>
                    <label>Name:</label>
                    <input ref={this.playerName}></input>
                    <label >Room code:</label>
                    <input ref={this.gameID}></input>
                    <button onClick={this.joinGame}>Enter</button>
                </div>
                <ul>
                    {this.state.playerList.map(playerList => (
                        <li key={playerList}> 
                            {playerList}
                        </li>
                    ))}
                </ul>
                {this.props.state.appRole === "Host" &&
                    <button onClick={this.hostStartGame}>Start Game</button>
                }
                <ChooseTeam socket={this.props.socket} state={this.props.state}/>
            </div>
        )
    }
}

// const JoinSessionWithSocket = props => (
//     <SocketContext.Consumer>
//     {socket => <JoinSession {...props} socket={socket} />}
//     </SocketContext.Consumer>
//   )
    
export default withRouter(JoinSession)
