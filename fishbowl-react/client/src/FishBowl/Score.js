import React from 'react';
import { withRouter } from 'react-router-dom';

class Score extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                Team A Score: {this.props.teamAscore}
                Team B Score: {this.props.teamBscore}
            </div>
        )
    }
}

export default withRouter(Score);