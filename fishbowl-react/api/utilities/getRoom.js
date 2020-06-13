
import models from '../models';
import moment from 'moment';

// Helper function to get a room
export default async (roomId) => {

    let today = new Date();
    let SOD = moment().startOf('day').toDate();
    let EOD = moment(today).endOf('day').toDate();

    // Find the roomId today!
    let game = await models.Game.findOne({startTime: {'$gte': SOD, '$lte': EOD}, roomId: roomId});

    return game;

}