import React from 'react';
import { withRouter } from 'react-router-dom';
import Score from './Score';
import { Card, CardWrapper } from 'react-swipeable-cards';

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state  = {
            cards: null,
            timeleft: null,
            activeCards : null,
            discardedCards : null,
            score: null,
        }
    }

    componentDidMount() {
        this.props.socket.emit('retrieveCards', this.props.state.gameId );
        this.props.socket.on('cardData', this.cardData);
        this.props.socket.on('allPlayersReady', this.allPlayersReady);
        this.props.socket.on('myTurn', this.setTurn);
        this.props.socket.on('timeRemaining', this.timeRemaining);
        this.props.socket.on('retrieveScore', this.retrieveScore);
    }

    cardData = (data) => {
        console.log(data);
        this.setState({
            cards : data.cards,
            activeCards : data.activeCards,
            discardedCards : data.discardedCards
        })
    }

    onSwipe(data) {
        console.log("wee weooooo");
    }

    discardCard(index) {
        let data = {
            gameId: this.props.state.gameId,
            index: index
        }
        this.props.socket.emit('discardCard', data);
    }

    allPlayersReady = () => {
        this.props.setStatusToReady();
    }

    setTurn = (bool) => {
        console.log("here???");
        this.props.setTurn(bool);
    }

    startTimer = () => {
        console.log("starting timer");
        let data = {
            gameId: this.props.state.gameId,
        }
        this.props.socket.emit('startTimer', data);
    }

    timeRemaining = (data) => {
        console.log(data);
        this.setState({ timeleft : data });
        if (data <= 0 && this.props.state.myTurn) {
            this.setTurn(false);
        }
    } 

    retrieveScore = (score) => {
        this.setState({ score : score })
    }

    addToScore(index) {
        let data = {
            gameId: this.props.state.gameId,
        }
        this.props.socket.emit('addToScore', data);
    }


    renderCards = () => {
        let cards = this.state.cards;
        let activeCards = [this.state.activeCards[0], ...this.state.activeCards];
        let firstCard = true;
        return activeCards.map((d) => {
            if (firstCard) {
                firstCard = false;
                return(
                    <Card
                      key={1}
                      onSwipe={this.startTimer.bind(this)}
                    //   onSwipeLeft={this.discardCard.bind(this)}
                      data={"YES"}>
                        {"First Card"}
                    </Card>
                  )
            }
          return(
            <Card
              key={cards[d]._id}
              onSwipe={this.onSwipe.bind(this)}
              onSwipeLeft={this.discardCard.bind(this, d)}
              onSwipeRight={this.addToScore.bind(this, d)}
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
            <div>
                <CardWrapper>
                    {this.state.cards && this.renderCards()}
                </CardWrapper>
                <Score
                  score={this.state.score}
                >
                </Score>
                <p>{this.state.timeleft}</p>
            </div> 
        )
    }
}

export default withRouter(Game);