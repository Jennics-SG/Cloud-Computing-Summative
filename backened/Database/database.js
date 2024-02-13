/** Name:   WaglyJs.backend.database.js
 *  Desc:   Script that connects to the database
 *  Author: Jimy Houlbrook
 *  Date:   13/02/24
 */

const mongoose = require('mongoose');
require('dotenv');

class Manager{
    static connect(){
        const mongoDB = process.env.CONNECT;

        // Set up default conn
        mongoose.connect(mongoDB);

        this.db = mongoose.connection;

        // Bunch of stuff to log about the database
        this.db.on('connected', () => {console.log('Database connected');});
        this.db.on('open', () => console.log('Database open'));
        this.db.on('disconnected', () => console.log('Database disconnected'));
        this.db.on('reconnected', () => console.log('Database reconnected'));
        this.db.on('disconnecting', () => console.log('Database disconnecting'));
        this.db.on('close', () => console.log('Database close'));

    }
}

module.exports.manager = Manager