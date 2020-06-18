import React from 'react';
import { withRouter } from 'react-router-dom';

class CreateCard extends React.Component {
    constructor(props) {
        super(props);
        this.cardContents = React.createRef();
        this.state = {
            count : 1
        }
        // this.playerName = this.props
    }

    tossInCard = () => {
        var data = {
            playerName : this.props.state.playerName, //update this
            card : this.cardContents.current.value,
            gameId : this.props.state.gameId,
        };
        // Send the gameId and playerName to the server
        this.setState(
            { count : this.state.count + 1 }
        )
        this.props.socket.emit('tossInCard', data);

        if (this.state.count == 10) {
            //go to game and wait for other players
            this.props.history.push('/game');
            //set game status to waiting
            
        }
        
    }

    toGame = () => {
        this.props.history.push('/game');
    }

    render() {
        return (
            <div>
                <p>Type a thing</p>
                <form>
                    <input ref={this.cardContents}></input>
                    <button type="button" onClick={this.tossInCard}>Toss in bowl</button>
                    <p>{this.state.count} / 10</p>
                </form>
                <button onClick={this.toGame}>all set</button>
            </div>
        )
    }
}

export default withRouter(CreateCard);