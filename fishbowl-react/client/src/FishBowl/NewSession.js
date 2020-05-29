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

    joinSession = () => {
        
    }

    gameDeets = (data) => {
        console.log(data)
    }

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

