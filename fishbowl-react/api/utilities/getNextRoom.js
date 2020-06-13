
import models from '../models';
import moment from 'moment';

// Helper function to get the next available room
export default async () => {

    // Check if a model for today exists
    let today = new Date();
    let SOD = moment().startOf('day').toDate();
    let EOD = moment(today).endOf('day').toDate();

    console.log("Start of Day: ", SOD);
    console.log("End of Day: ", EOD);

    // If theres a document greater than yesterday: no need to make a new one!
    let daily = await models.Daily.findOne({day: {'$gte': SOD, '$lte': EOD}});

    if (!daily) {
        // Create one 
        console.log("Creating Daily");
        daily = await models.Daily.create({day: today});
    }

    // Get the room id
    const roomId = daily.nextRoom;

    // Incriment 
    await models.Daily.findOneAndUpdate({ _id: daily._id }, { $inc: { nextRoom: 1 } });

    return roomId;

}