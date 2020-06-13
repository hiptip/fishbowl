import mongoose from 'mongoose';
const  Schema  =  mongoose.Schema;

const  cardSchema  =  new Schema(
    {
    card: {
    type: String
    },
    sender: {
    type: String
    },
    room: {
    type: String
        }
    },
        {
    timestamps: true
});

let  Stack  =  mongoose.model("Stack", cardSchema);
module.exports  =  Stack;