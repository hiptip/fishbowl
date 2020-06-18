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
    let gameInit = await models.Game.create({roomId: roomId, startTime: new Date()});

    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('newGameCreated', {gameId: roomId, gameMongoId: gameInit._id, mySocketId: this.id});

    // Join the Room and wait for the players
    this.join(roomId.toString());

    //create room state
    var room = gameSocket.adapter.rooms[roomId.toString()];

    room.state = { playerList : [], mongoId: gameInit._id, hostId : this.id };
};



/*
 * The Countdown has finished, and the game begins!
 * @param gameId The game ID / room ID
 */
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
        let newPlayer = {name: data.playerName};
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


    console.log("Cards: ", update);


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
    let game = await models.Game.findOneAndUpdate({_id: room.state.mongoId, "players.name" : data.name}, {'$set': {"player.team": data.team}}, {new: true, upsert: true});
    console.log ("Player: ", game);
}

async function teamB(data) {

}

/**
 * A player has tapped a word in the word list.
 * @param data gameId
 */
function playerAnswer(data) {
    // console.log('Player ID: ' + data.playerId + ' answered a question with: ' + data.answer);

    // The player's answer is attached to the data object.  \
    // Emit an event with the answer so it can be checked by the 'Host'
    io.sockets.in(data.gameId).emit('hostCheckAnswer', data);
}

/**
 * The game is over, and a player has clicked a button to restart the game.
 * @param data
 */
function playerRestart(data) {
    // console.log('Player: ' + data.playerName + ' ready for new game.');

    // Emit the player's data back to the clients in the game room.
    data.playerId = this.id;
    io.sockets.in(data.gameId).emit('playerJoinedRoom',data);
}

/* *************************
   *                       *
   *      GAME LOGIC       *
   *                       *
   ************************* */

/**
 * Get a word for the host, and a list of words for the player.
 *
 * @param wordPoolIndex
 * @param gameId The room identifier
 */
function sendWord(wordPoolIndex, gameId) {
    var data = getWordData(wordPoolIndex);
    io.sockets.in(gameId).emit('newWordData', data);
}

/**
 * This function does all the work of getting a new words from the pile
 * and organizing the data to be sent back to the clients.
 *
 * @param i The index of the wordPool.
 * @returns {{round: *, word: *, answer: *, list: Array}}
 */
function getWordData(i){
    // Randomize the order of the available words.
    // The first element in the randomized array will be displayed on the host screen.
    // The second element will be hidden in a list of decoys as the correct answer
    var words = shuffle(wordPool[i].words);

    // Randomize the order of the decoy words and choose the first 5
    var decoys = shuffle(wordPool[i].decoys).slice(0,5);

    // Pick a random spot in the decoy list to put the correct answer
    var rnd = Math.floor(Math.random() * 5);
    decoys.splice(rnd, 0, words[1]);

    // Package the words into a single object.
    var wordData = {
        round: i,
        word : words[0],   // Displayed Word
        answer : words[1], // Correct Answer
        list : decoys      // Word list for player (decoys and answer)
    };

    return wordData;
}

/*
 * Javascript implementation of Fisher-Yates shuffle algorithm
 * http://stackoverflow.com/questions/2450954/how-to-randomize-a-javascript-array
 */
function shuffle(array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * Each element in the array provides data for a single round in the game.
 *
 * In each round, two random "words" are chosen as the host word and the correct answer.
 * Five random "decoys" are chosen to make up the list displayed to the player.
 * The correct answer is randomly inserted into the list of chosen decoys.
 *
 * @type {Array}
 */
var wordPool = [
    {
        "words"  : [ "sale","seal","ales","leas" ],
        "decoys" : [ "lead","lamp","seed","eels","lean","cels","lyse","sloe","tels","self" ]
    },

    {
        "words"  : [ "item","time","mite","emit" ],
        "decoys" : [ "neat","team","omit","tame","mate","idem","mile","lime","tire","exit" ]
    },

    {
        "words"  : [ "spat","past","pats","taps" ],
        "decoys" : [ "pots","laps","step","lets","pint","atop","tapa","rapt","swap","yaps" ]
    },

    {
        "words"  : [ "nest","sent","nets","tens" ],
        "decoys" : [ "tend","went","lent","teen","neat","ante","tone","newt","vent","elan" ]
    },

    {
        "words"  : [ "pale","leap","plea","peal" ],
        "decoys" : [ "sale","pail","play","lips","slip","pile","pleb","pled","help","lope" ]
    },

    {
        "words"  : [ "races","cares","scare","acres" ],
        "decoys" : [ "crass","scary","seeds","score","screw","cager","clear","recap","trace","cadre" ]
    },

    {
        "words"  : [ "bowel","elbow","below","beowl" ],
        "decoys" : [ "bowed","bower","robed","probe","roble","bowls","blows","brawl","bylaw","ebola" ]
    },

    {
        "words"  : [ "dates","stead","sated","adset" ],
        "decoys" : [ "seats","diety","seeds","today","sited","dotes","tides","duets","deist","diets" ]
    },

    {
        "words"  : [ "spear","parse","reaps","pares" ],
        "decoys" : [ "ramps","tarps","strep","spore","repos","peris","strap","perms","ropes","super" ]
    },

    {
        "words"  : [ "stone","tones","steno","onset" ],
        "decoys" : [ "snout","tongs","stent","tense","terns","santo","stony","toons","snort","stint" ]
    }
]