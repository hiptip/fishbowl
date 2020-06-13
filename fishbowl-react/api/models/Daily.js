import mongoose from 'mongoose';
const  Schema  =  mongoose.Schema;


const DailySchema =  new Schema(
{

    day: {type: Date},

    nextRoom: {type: Number, default: 0},

});

let  Daily  =  mongoose.model("Daily", DailySchema, 'daily');
module.exports  =  Daily;