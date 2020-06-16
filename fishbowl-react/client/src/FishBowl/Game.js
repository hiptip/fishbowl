import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardWrapper } from 'react-swipeable-cards';

class Game extends React.Component {
    constructor(props) {
        super(props);
        // this.data = ['Alexandre', 'Thomas', 'Lucien'];
    }

    renderCards() {
        let data = [{id: 1, name: "First"},{id: 2, name: "Second"}];
        return data.map((d) => {
          return(
            <Card
              key={d.id}
              onSwipe={console.log("hi anna")}
              data={d}>
                {d.name}
            </Card>
          );
        });
      }

    render() {
        return (
            <CardWrapper>
                {this.renderCards()}
            </CardWrapper>
        )
    }
}

export default withRouter(Game);