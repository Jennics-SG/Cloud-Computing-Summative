// Connects to the database
const mongoose = require('mongoose');
require('dotenv');

module.exports.connect = () => {
    // Set up default conn

    //console.log(process.env)

    const mongoDB = process.env.CONNECT || console.log('error connecting');
    mongoose.connect(mongoDB, {useNewUrlParser: true});

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, "MongoDB Connection Error:"));
    db.once('open', () => {
        console.log("Database Connection Established")
    });
}