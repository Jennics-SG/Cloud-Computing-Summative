// Connects to the database
const mongoose = require('mongoose');
require('dotenv');

class Manager{
    static connect(){
        const mongoDB = process.env.CONNECT;

        // Set up default conn
        mongoose.connect(mongoDB);

        this.db = mongoose.connection;

        this.db.on('connected', () => {console.log('connected');});
        this.db.on('open', () => console.log('open'));
        this.db.on('disconnected', () => console.log('disconnected'));
        this.db.on('reconnected', () => console.log('reconnected'));
        this.db.on('disconnecting', () => console.log('disconnecting'));
        this.db.on('close', () => console.log('close'));

    }

    static disconnect(){
        mongoose.connection.close();
    }
}

module.exports.manager = Manager