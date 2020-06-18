import React from 'react';
import SocketContext from '../SocketContext';
import { navigate } from "hookrouter";
import { Link, withRouter } from "react-router-dom";


class NewSession extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     gameId: ''
        // };
        // this.socket = this.props.socket.connect();
        // this.socket.on('newGameCreated', this.gameDeets);
      }


    createNewSession = () => {
        this.props.socket.emit('hostCreateNewGame');
        //set myself as host
        this.props.setHost();
        //TODO: go right into join game

    }

    joinSession = () => {
        // navigate('/join');
        // window.location.reload(false);
        // return <Redirect to='/join' />
        // const history = useHistory();
        // history.push("/join");
        
    }

    // gameDeets = (data) => {
    //     console.log(data);
    //     this.setState({ gameId : data.gameId })
    // }

    render() {
        return (
            <div className="New-session">
                <button onClick={this.createNewSession}>Create new game</button>
                <button onClick={() => this.props.history.push('/join')}>Join game</button>
                <div>
                    <p>{this.props.state.gameId}</p>
                </div>
            </div>
        )
    }

}

// const NewSessionWithSocket = props => (
//     <SocketContext.Consumer>
//     {socket => <NewSession {...props} socket={socket} />}
//     </SocketContext.Consumer>
//   )
    
export default withRouter(NewSession)

