import React from 'react';

class NewSession extends React.Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        This is the timer value: {this.props.timestamp}
                    </p>
                </header>
            </div>
        )
    }
}

export default NewSession