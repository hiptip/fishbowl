const  mongoose  = require("mongoose");
const  Schema  =  mongoose.Schema;
const  CardSchema  =  new Schema(
    {
    card: {
    type: String
    },
    sender: {
    type: String
    },
    room: {
    type: String
        },
    data: mongoose.SchemaTypes.Mixed
    },
        {
    timestamps: true
}
)

const GameSchema = new Schema(
    {
        cards: [CardSchema],

        players: [PlayerSchema],

        activeCards: [Number],

        discardedCards: [Number],

        data: mongoose.SchemaTypes.Mixed

    }
)

let  Stack  =  mongoose.model("Room", GameSchema, 'games');
module.exports  =  Stack;