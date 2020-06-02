import React from 'react';
import SocketContext from '../SocketContext';
import { navigate } from "hookrouter";
import { Link } from "react-router-dom";


class NewSession extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     gameId: ''
        // };
        console.log(this.props.socket);
        // this.socket = this.props.socket.connect();
        // this.socket.on('newGameCreated', this.gameDeets);
      }


    createNewSession = () => {
        this.props.socket.emit('hostCreateNewGame');
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
                <Link to="/join"><button>Join game</button></Link>
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
    
export default NewSession

