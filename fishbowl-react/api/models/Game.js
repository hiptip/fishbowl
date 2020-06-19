import mongoose from 'mongoose';
const  Schema  =  mongoose.Schema;


const CardSchema = new Schema ({

    card: {type: String},
    sender: {type: String},
    // room: {type: String},
    timestamps: {type: Boolean, default: true},

})

const PlayerSchema = new Schema ({

    // Player name
    name: {type: String},

    team: String,

    socketID: String,

    // Game specific player data
    data: mongoose.SchemaTypes.Mixed,    

}, {_id: false})

const  GameScheam  =  new Schema(
{

    // Game type
    gameType: String,

    // Room Id
    roomId: Number,

    // Start time 
    startTime: Date,
    
    // Deck of cards
    cards: [CardSchema],

    // Players
    players: [PlayerSchema],

    // Active dec
    activeCards: [Number],

    // Discard pile
    discardedCards: [Number],

    playersReady: Number,

    teamA: [PlayerSchema],

    teamB: [PlayerSchema],

    teamTurn: String,

    teamAIndex: Number,

    teamBIndex: Number,

    // Game specific data
    data: mongoose.SchemaTypes.Mixed,

    

});

let  Room  =  mongoose.model("Room", GameScheam, 'games');
module.exports  =  Room;