import React from 'react';
import { withRouter } from 'react-router-dom';

class Score extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.score}
            </div>
        )
    }
}

export default withRouter(Score);