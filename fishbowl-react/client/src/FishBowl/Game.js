import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, CardWrapper } from 'react-swipeable-cards';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.props.socket.emit('retrieveCards', this.props.state.gameId);
        this.props.socket.on('cardData', this.cardData);
        this.props.socket.on('allPlayersReady', this.allPlayersReady);
        this.props.socket.on('myTurn', this.setTurn);
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

    discardCard = (index) => {
        let data = {
            gameId: this.props.state.gameId,
            index: index
        }
        this.props.socket.emit('discardCard', data);
    }

    allPlayersReady = () => {
        this.props.setStatusToReady();
    }

    setTurn = () => {
        console.log("here???");
        this.props.setTurn();
    }

    renderCards = () => {
        let cards = this.state.cards;
        let activeCards = this.state.activeCards;
        return activeCards.map((d) => {
          return(
            <Card
              key={cards[d]._id}
              onSwipeLeft={this.discardCard(d)}
              data={cards[d]}>
                {cards[d].card}
            </Card>
          );
        });
      }

    render() {
        if (this.props.state.waitingStatus) {
            return (
                <div>Waiting for other players</div>
            )
        } else if (!this.props.state.myTurn) {
            //its my turn
            return (
                <div>itss someseonwe gelsesasg aturn</div>
            )
        }
        return (
            <CardWrapper>
                {this.state.cards && this.renderCards()}
            </CardWrapper>
        )
    }
}

export default withRouter(Game);