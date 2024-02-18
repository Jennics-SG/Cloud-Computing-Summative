/** Name:   WaglyJs.backend.auth.verifyLogin.js
 *  Desc:   Script to verify user login
 *  Author: Jimy Houlbrook
 *  Date:   13/02/24
 */

const UserCred = require('../models/userCred');
const Encrypt = require('../encrypt');

class Login{
    // Try to minimise whats done in the constructor to
    // use async functions instead. 
    // Just make constructors async pls 
    constructor(data){
        // Make sure all data exists & convert to string
        for(let i in data){
            if(data[i] == '')
                return;
            i = i.toString();
        }
        this.data = data;
    }

    // Verify the login data vs the saved credentials
    // Returns the account UUID if verified
    async verify(){
        // Find user account, return undefined if not found
        const account = await this.findUser(this.data.email);

        if(!account){
            console.log('Account not found');
            return undefined;
        }

        // Compare passwords, return undefined if not verified 
        if(! await Encrypt.validPass(this.data.pass, account.pass))
            return undefined;

        return account;
    }

    // Returns the user found from the database
    async findUser(email){
        const accs = await UserCred.find({email: email});
        return accs[0];
    }
}

module.exports = Login;