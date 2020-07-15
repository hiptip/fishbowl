import React from 'react';
import Score from './Score';
import { withRouter } from 'react-router-dom';

class WaitingPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Score
              teamAscore={this.props.scores.teamAscore}
              teamBscore={this.props.scores.teamBscore}
            ></Score>
        )
    }
}

export default withRouter(WaitingPage);