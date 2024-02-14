/** Name:   WaglyJs.backend.database.js
 *  Desc:   Script that connects to the database
 *  Author: Jimy Houlbrook
 *  Date:   13/02/24
 */

// Using absolute paths with models bcs they hate relative paths
const PetModel = require('../database/models/pet');
const AccountModel = require('../database/models/account');
const CredsModel = require('../database/models/userCred');

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

    static getAccountModel(data){
        return new AccountModel(data);
    }

    static async getAccountEmail(email){
        return await AccountModel.find({email: email});
    }

    static async getAccount(userID){
        return await AccountModel.findOne({uuid: userID});
    }

    static getCredsModel(data){
        return new CredsModel(data)
    }

    static getPetModel(data){
        return new PetModel(data)
    }

    static async getPetName(name, owner){
        return await PetModel.find({name: name, owner: owner})
    }

    static async getPets(userID){
        return await PetModel.find({owner: userID});
    }

    static async getWalkers(){
        return await AccountModel.find({actType: "walker"});
    }

}

module.exports.manager = Manager