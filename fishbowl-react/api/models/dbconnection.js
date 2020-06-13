import mongoose from 'mongoose';
mongoose.Promise  = require("bluebird");
const  url  =  "mongodb://localhost:27017/fishbowl";
const  connect  =  mongoose.connect(url, { useNewUrlParser: true  });
module.exports  =  connect;