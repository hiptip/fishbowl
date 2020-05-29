import React from 'react';
import SocketContext from '../SocketContext'

class JoinSession extends React.Component {
    render() {
        return (
            <div className='Join-session'>
                <input></input>
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
