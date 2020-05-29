import React from 'react';
import SocketContext from '../SocketContext'

class NewSession extends React.Component {
    constructor(props) {
        super(props);
        this.socket = this.props.socket.connect();
        this.socket.on('newGameCreated', this.gameDeets)
      }


    createNewSession = () => {
        this.props.socket.emit('hostCreateNewGame');
    }

    gameDeets = (data) => {
        console.log(data)
    }


    // init() {
    //     IO.socket = io.connect();
    //     IO.bindEvents();
    // },

    // /**
    //  * While connected, Socket.IO will listen to the following events emitted
    //  * by the Socket.IO server, then run the appropriate function.
    //  */
    // bindEvents : function() {
    //     IO.socket.on('connected', IO.onConnected );
    //     IO.socket.on('newGameCreated', IO.onNewGameCreated );
    //     IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom );
    //     IO.socket.on('beginNewGame', IO.beginNewGame );
    //     IO.socket.on('newWordData', IO.onNewWordData);
    //     IO.socket.on('hostCheckAnswer', IO.hostCheckAnswer);
    //     IO.socket.on('gameOver', IO.gameOver);
    //     IO.socket.on('error', IO.error );
    // },

    render() {
        return (
            <div className="New-session">
                <button onClick={this.createNewSession}>Create new game</button>
            </div>
        )
    }

}

const NewSessionWithSocket = props => (
    <SocketContext.Consumer>
    {socket => <NewSession {...props} socket={socket} />}
    </SocketContext.Consumer>
  )
    
export default NewSessionWithSocket

