
import models from '../models';
import moment from 'moment';


// Helper function to update a room
export default async (roomId, update) => {

    let today = new Date();
    let SOD = moment().startOf('day').toDate();
    let EOD = moment(today).endOf('day').toDate();

    let game;

    // Find the roomId today!
    try{
        game = await models.Game.findOneAndUpdate({startTime: {'$gte': SOD, '$lte': EOD}, roomId: roomId}, update, {new: true, upsert: true}, (e)=>{console.log(e)});
        return game;
    }
    catch (e) {
        console.log(e)
    }

    return game;
    
}