import React from 'react';
import SocketContext from '../SocketContext'

class JoinSession extends React.Component {
    constructor(props) {
        super(props);
        this.playerName = React.createRef();
        this.gameID = React.createRef();
        this.socket = this.props.socket.connect();
        this.socket.on('error', this.error);
        //update list of players in room
        this.socket.on('playerJoinedRoom', this.addPlayerToList)
        this.state = {
            playerList : []
        }
    }


    joinGame = () => {
        var data = {
            gameId : this.gameID.current.value,
            playerName : this.playerName.current.value || 'anon'
        };
        console.log(data);
        // Send the gameId and playerName to the server
        this.props.socket.emit('playerJoinGame', data);

        
        // Set the appropriate properties for the current player.
        // App.myRole = 'Player';
        // App.Player.myName = data.playerName;
    }

    error = (data) => {
        alert(data.message);
    }

    // newGrocery = {
    //     name: this.state.name
    //   }
      
    //   this.setState(
    //     { groceries: [...this.state.groceries, newGrocery] }
    //   )

    addPlayerToList = (data) => {
        this.setState(
            { playerList: [...this.state.playerList, data.playerName] }
        )
        console.log(this.state.playerList);
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
                        <li>
                            {playerList}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

const JoinSessionWithSocket = props => (
    <SocketContext.Consumer>
    {socket => <JoinSession {...props} socket={socket} />}
    </SocketContext.Consumer>
  )
    
export default JoinSessionWithSocket
