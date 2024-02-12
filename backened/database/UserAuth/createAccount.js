const UserCred = require('../models/userCred');
const Account = require('../models/account');
const Encrypt = require('../encrypt');

const {v4: uuid} = require('uuid');

class CreateAccount{
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
    async save(){
        // Check that account doesnt exist first
        const users = await this.accountExists(this.data.email);
        if(users[0]) return false;

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
            pass: this.data.pass
        }
        await this.addAccount(account);
        await this.addCreds(login);

        return true;
    }

    // Finds user in database and returns it
    async accountExists(email){
        return await Account.find({email: email}).exec();
    }

    // Add Account to database
    async addAccount(data){
        const acc = new Account(data)
        await acc.save();
    }

    // Adds LoginCred to database
    async addCreds(data){
        // Encrypt pass
        data.pass = await Encrypt.encryptPass(data.pass);

        const cred = new UserCred(data);
        await cred.save()
    }
}

module.exports = CreateAccount;