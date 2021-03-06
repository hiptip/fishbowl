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
            sender : "Nick", //update this
            card : this.cardContents.current.value,
            room : 6969 //update this
        };
        // Send the gameId and playerName to the server
        this.setState(
            { count : this.state.count + 1 }
        )
        this.props.socket.emit('tossInCard', data);
        
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
            </div>
        )
    }
}

export default withRouter(CreateCard);