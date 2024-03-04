/** Name:   WaglyJs.backend.addPet.js
 *  Desc:   Add new pet to the database
 *  Author: Jimy Houlbrook
 *  Date:   14/02/24
 */

const Database = require('./database')

const {v4: uuid} = require('uuid');

class Pet{
    // Constructor bad Async good
    constructor(data){
        // Make sure all data exists
        for(const i in data){
            if(data[i] == '')
                return
            data[i] = data[i].toString()
        }

        this.data = data;
        this.data.uuid = uuid();
    }

    // Save pet data to database
    async save(){
        console.log('saving pet');
        // Make sure there isnt already a dog with the same name assigned to owner     
        if(await this.petExists(this.data.name, this.data.owner)[0]) return undefined;

        const pet = Database.manager.getPetModel(this.data);
        await pet.save();
        return pet.uuid
    }

    // Check if pet with same name already assigned to user
    async petExists(name, ownerID){
        return await Database.manager.getPetName(name, ownerID);
    }
}

module.exports = Pet