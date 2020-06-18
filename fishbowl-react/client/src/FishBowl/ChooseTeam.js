import React from 'react';
import { withRouter } from 'react-router-dom';

class ChooseTeam extends React.Component {
    constructor(props) {
        super(props);
    }

    teamA = () => {
        let data = {
            gameId: this.props.state.gameId,
            name: this.props.state.playerName,
            team: "A",
        }
        this.props.socket.emit('teamA', data);
    }

    teamB = () => {
        // this.props.socket.emit('teamB', data);
    }

    render() {
        return (
            <div>
                <button onClick={this.teamA}>Team A</button>
                <button onClick={this.teamB}>Team B</button>
            </div>
        )
    }
}

export default withRouter(ChooseTeam);