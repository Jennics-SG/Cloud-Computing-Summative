/** Name:   WaglyJs.backend.auth.createAccount.js
 *  Desc:   Script to verify user login
 *  Author: Jimy Houlbrook
 *  Date:   13/02/24
 */

const Database = require('../database');
const Encrypt = require('../encrypt');

const {v4: uuid} = require('uuid');

// Class containing all the logic to save a user to database
class Account{
    // Still hate JS constructors, check verify login for deatails
    constructor(data){
        // Make sure all data exists & convert to string to be safe
        for(let i in data){
            if(data[i] == '')
                return;
            i = i.toString();
        }

        this.data = data;

        // Generate UUID
        this.data.uuid = uuid();
    }

    // Save user data into the database
    // Returns the account UUID if save successful
    async save(){
        // Check that account doesnt exist first
        const users = await this.accountExists(this.data.email);
        if(users[0]) return undefined;

        // Wish i did this in TS, wanna use interfaces to
        // Make sure these objects dont have wrong types

        // Account Data
        const account = {
            name: this.data.name,
            email: this.data.email,
            actType: this.data.actType,
            uuid: this.data.uuid
        }

        // Login Creds
        const login = {
            uuid: this.data.uuid,
            email: this.data.email,
            pass: this.data.pass,
            refresh: " "
        }

        // Save to cred and account db
        let acc = await this.addAccount(account);
        await this.addCreds(login);

        return acc;
    }

    // Finds user in database and returns it
    async accountExists(email){
        return await Database.manager.getAccountEmail(email)
    }

    // Add Account to database, return acc uuid
    async addAccount(data){
        const acc = Database.manager.getAccountModel(data);
        await acc.save();
        return acc.uuid
    }

    // Adds LoginCred to database
    async addCreds(data){
        console.log(data.pass)

        // Encrypt pass
        data.pass = await Encrypt.encryptPass(data.pass);

        const cred = Database.manager.getCredsModel(data);
        await cred.save()
    }
}

module.exports = Account;