var io;
var gameSocket;
var playerList;
const  connect  = require("./models/dbconnection");

// Mongoose models
import models from './models';

// Utils
import getNextRoom from './utilities/getNextRoom';
import getRoom from './utilities/getRoom';
import updateRoom from './utilities/updateRoom';

/**
 * This function is called by index.js to initialize a new game instance.
 *
 * @param sio The Socket.IO library
 * @param socket The socket object for the connected client.
 */
exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected', { message: "You are connected!" });

    // Host Events
    gameSocket.on('hostCreateNewGame', hostCreateNewGame);
    gameSocket.on('startGame', startGame);
    gameSocket.on('retrieveCards', retrieveCards);
    gameSocket.on('discardCard', discardCard);
    gameSocket.on('teamA', teamA);
    gameSocket.on('teamB', teamB);
    gameSocket.on('playerSubmittedCards', playerSubmittedCards)
    // gameSocket.on('hostRoomFull', hostPrepareGame);
    // gameSocket.on('hostCountdownFinished', hostStartGame);
    // gameSocket.on('hostNextRound', hostNextRound);

    // // Player Events
    gameSocket.on('playerJoinGame', playerJoinGame);

    gameSocket.on('tossInCard', tossInCard);
    // gameSocket.on('playerAnswer', playerAnswer);
    // gameSocket.on('playerRestart', playerRestart);
}

/* *******************************
   *                             *
   *       HOST FUNCTIONS        *
   *                             *
   ******************************* */

/**
 * The 'START' button was clicked and 'hostCreateNewGame' event occurred.
 */
async function hostCreateNewGame() {

    // Get next available room
    let roomId = await getNextRoom();

    // Create a game with the room
    let gameInit = await models.Game.create({roomId: roomId, startTime: new Date(), playersReady: 0, teamAIndex: 0, teamBIndex: 0, teamTurn: "A"});

    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('newGameCreated', {gameId: roomId, gameMongoId: gameInit._id, mySocketId: this.id});

    // Join the Room and wait for the players
    this.join(roomId.toString());

    //create room state
    var room = gameSocket.adapter.rooms[roomId.toString()];

    room.state = { playerList : [], mongoId: gameInit._id, hostId : this.id };
};



//go to card creation screen and set turn
function startGame(data) {
    console.log('Game Started.');
    console.log(data);
    io.sockets.in(data).emit('startGame', "Let's begin");

};

/**
 * A player answered correctly. Time for the next word.
 * @param data Sent from the client. Contains the current round and gameId (room)
 */
function hostNextRound(data) {
    if(data.round < wordPool.length ){
        // Send a new set of words back to the host and players.
        sendWord(data.round, data.gameId);
    } else {
        // If the current round exceeds the number of words, send the 'gameOver' event.
        io.sockets.in(data.gameId).emit('gameOver',data);
    }
}
/* *****************************
   *                           *
   *     PLAYER FUNCTIONS      *
   *                           *
   ***************************** */

/**
 * A player clicked the 'START GAME' button.
 * Attempt to connect them to the room that matches
 * the gameId entered by the player.
 * @param data Contains data entered via player's input - playerName and gameId.
 */
async function playerJoinGame(data) {
    //console.log('Player ' + data.playerName + 'attempting to join game: ' + data.gameId );

    // A reference to the player's Socket.IO socket object
    var sock = this;

    sock.nickname = data.playerName;

    // Look up the room ID in the Socket.IO manager object.
    var room = gameSocket.adapter.rooms[data.gameId];

    // If the room exists...
    if( room != undefined ){
        // attach the socket id to the data object.
        data.mySocketId = sock.id;

        // Join the room
        sock.join(data.gameId);

        //Add player to state
        room.state.playerList.push(data.playerName);

        // Add the player to the mongo game 
        let newPlayer = {name: data.playerName, socketID: sock.id};
        let game = await models.Game.findOneAndUpdate({_id: room.state.mongoId}, {'$addToSet': {players: newPlayer}}, {new: true, upsert: true});
        let players = [];

        for (const player of game.players) {
            players.push(player.name);
        }
       
        //send player to others in the room
        sock.broadcast.to(data.gameId).emit('playerJoinedRoom', data.playerName);

        //send all current players in room to current connectee
        sock.emit('playerJoinedRoom', players);

    } else {
        // Otherwise, send an error message back to the player.
        this.emit('error',{message: "This room does not exist."} );
    }
}

async function tossInCard(data) {

    // Look up the room ID in the Socket.IO manager object.
    var room = gameSocket.adapter.rooms[data.gameId];

    // Add the card to the mongo db collection 
    let newCard = {
        card: data.card,
        sender: data.playerName
    }
    let game = await models.Game.findOneAndUpdate({_id: room.state.mongoId}, {'$addToSet': {cards: newCard}}, {new: true, upsert: true});
    console.log("New Cards: ", game.cards);

    // TODO: Send cards back out to everyone!
    // sock.broadcast.to(data.gameId).emit('newCardDeck', game.cards);

}

async function retrieveCards(data) {
    console.log(data);
    var room = gameSocket.adapter.rooms[data];

    let game = await models.Game.findOne({_id: room.state.mongoId});

    let cards = [];

    for (const card of game.cards) {
        cards.push(card.card);
    }

    //create list of indeces
    let activeCards = Array.from(Array(game.cards.length), (_, index) => index);

    //shuffle indeces 
    activeCards = activeCards.sort(function (a, b) { return 0.5 - Math.random() })

    let cardData = {
        cards: game.cards,
        activeCards: activeCards,
        discardedCards: [],
    }

    //add active cards
    let update = await models.Game.findOneAndUpdate({_id: room.state.mongoId}, {'$addToSet': {activeCards: activeCards}}, {new: true, upsert: true});


    // console.log("Cards: ", update);


    io.sockets.in(data).emit('cardData', cardData);
}

async function discardCard(data) {

    var room = gameSocket.adapter.rooms[data.gameId];

    //add to discardedCards
    let game = await models.Game.findOneAndUpdate({_id: room.state.mongoId}, {'$addToSet': {discardedCards: data.index}}, {new: true, upsert: true});

    console.log ("Added to discard pile", game);

    //remove from activeCards
}


////////////////////////
// PLAYER CHOOSE TEAM //
////////////////////////

async function teamA(data) {
    var room = gameSocket.adapter.rooms[data.gameId];
    let game = await models.Game.findOne({_id: room.state.mongoId});
    let players = game.players;
    let player = players.find(player => player.name == data.name);
    let teamA = await models.Game.findOneAndUpdate({_id: room.state.mongoId}, {'$addToSet': {teamA: player}}, {new: true, upsert: true});


    // player.team = "A";
    teamA.save();

}

async function teamB(data) {
    var room = gameSocket.adapter.rooms[data.gameId];
    let game = await models.Game.findOne({_id: room.state.mongoId});
    let players = game.players;
    let player = players.find(player => player.name == data.name);
    let teamB = await models.Game.findOneAndUpdate({_id: room.state.mongoId}, {'$addToSet': {teamB: player}}, {new: true, upsert: true});
    // player.team = "B";
    teamB.save();
}


//track which players have submitted all their cards
async function playerSubmittedCards(data) {
    var room = gameSocket.adapter.rooms[data.gameId];
    let game = await models.Game.findOne({_id: room.state.mongoId});
    game.playersReady += 1;
    
    console.log("MEATBALL");
    console.log(game.playersReady);
    console.log(game.players.length);
    if (game.playersReady == game.players.length) {
        // choosePresenter(game, data);
        //TODO: randomly choose one socket in room to be the first presenter from team A
        // let players = game.players;


        io.sockets.in(data.gameId).emit('allPlayersReady', "LETS GO");
    }
    game.save();
}

/* *************************
   *                       *
   *      GAME LOGIC       *
   *                       *
   ************************* */


function choosePresenter(data) {
    var room = gameSocket.adapter.rooms[data.gameId];
    let game = await models.Game.findOne({_id: room.state.mongoId});
    io.sockets.in(data.gameId).emit('allPlayersReady', "LETS GO");
    let teamTurn = game.teamTurn;
    switch (teamTurn) {
        case "A": 
            var player = game.teamA[game.teamAIndex % game.teamA.length];
            io.to(player.socketID).emit('myTurn', 'ITs ur turn fool');
            game.teamAIndex += 1;
            game.teamTurn = "B";
            game.save;
        case "B":
            var player = game.teamB[game.teamBIndex % game.teamB.length];
            io.to(player.socketID).emit('myTurn', 'ITs ur turn fool');
            game.teamBIndex += 1;
            game.teamTurn = "A";
            game.save;
    }
}

// function getTeams(game) {

// }

// function turnHandler(data) {
//     var room = gameSocket.adapter.rooms[data.gameId];
//     let game = await models.Game.findOne({_id: room.state.mongoId});
// }