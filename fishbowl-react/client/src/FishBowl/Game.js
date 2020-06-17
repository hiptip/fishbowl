import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardWrapper } from 'react-swipeable-cards';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.props.socket.emit('retrieveCards', this.props.state.gameId);
        this.props.socket.on('cardData', this.cardData);
        this.state  = {
            cards: null,
        }
    }

    // componentDidMount() {
        
    // }

    cardData = (data) => {
        console.log(data);
        this.setState({
            cards : data.cards,
            activeCards : data.activeCards,
            discardedCards : data.discardedCards
        })
    }

    renderCards = () => {
        let cards = this.state.cards;
        let activeCards = this.state.activeCards;
        return activeCards.map((d) => {
          return(
            <Card
              key={cards[d]._id}
              onSwipe={console.log("hi anna")}
              data={cards[d]}>
                {cards[d].card}
            </Card>
          );
        });
      }

    render() {
        return (
            <CardWrapper>
                {this.state.cards && this.renderCards()}
            </CardWrapper>
        )
    }
}

export default withRouter(Game);