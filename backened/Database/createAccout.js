const LoginUser = require('./models/loginUser');
const Encrypt = require('./encrypt');

class CreateAccount{
    constructor(data){
        // Make sure all data exists & convert to string to be safe
        for(let i in data){
            if(data[i] == ''){
                this.showUser(`Please enter ${i}`);
                return;
            }
            i = i.toString();
        }

        this.data = data;
    }

    // Save user data into the database
    async save(){
        // Check that account doesnt exist first
        if((await this.accountExists(this.data.name))[0]) return false;

        // Add account if it doesnt exist
        await this.addAccount(this.data);
        return true;
    }

    // Finds user in database and returns it
    async accountExists(name){
        return await LoginUser.find({name: name}).exec();
    }

    // Adds user to database
    async addAccount(data){
        const last = data.pass;

        console.time("Test Hash");
        data.pass = await Encrypt.encryptPass(data.pass);
        console.timeEnd("Test Hash")

        console.time("Test Compare");
        await Encrypt.validPass(last, data.pass);
        console.timeEnd("Test Compare");

        const newUser = new LoginUser(data);

        await newUser.save()
    }
}

module.exports = CreateAccount;