import React from 'react';
import SocketContext from '../SocketContext';
import { navigate } from "hookrouter";


class NewSession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameId: ''
        };
        this.socket = this.props.socket.connect();
        this.socket.on('newGameCreated', this.gameDeets);
      }


    createNewSession = () => {
        this.props.socket.emit('hostCreateNewGame');
    }

    joinSession = () => {
        navigate('/join');
        window.location.reload(false);
    }

    gameDeets = (data) => {
        console.log(data);
        this.setState({ gameId : data.gameId })
    }

    render() {
        return (
            <div className="New-session">
                <button onClick={this.createNewSession}>Create new game</button>
                <button onClick={this.joinSession}>Join game</button>
                <div>
                    <p>{this.state.gameId}</p>
                </div>
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

