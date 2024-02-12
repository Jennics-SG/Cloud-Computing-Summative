const UserCred = require('../models/userCred');
const Encrypt = require('../encrypt');

class Login{
    constructor(data){
        // Make sure all data exists & convert to string
        for(let i in data){
            if(data[i] == '')
                return
            i = i.toString();
        }
        this.data = data;
    }

    async verify(){
        console.log(this.data);

        // Find user account
        const account = await this.findUser(this.data.email);
        if(!account){
            console.log('Account  not found')
            return;
        }

        console.log(account);
    }

    async findUser(email){
        return await UserCred.findOne({email: email}).exec();
    }

    // Find user with email

    // Compare pass

    // Return
}

module.exports = Login;