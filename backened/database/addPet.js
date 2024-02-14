const PetModel = require('./models/pet')

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
        // Make sure there isnt already a dog with the same name assigned to owner
        if(await this.petExists(this.data.name, this.data.owner)) return undefined;

        const pet = new PetModel(this.data);
        await pet.save();
        return pet.uuid
    }

    // Check if pet with same name already assigned to user
    async petExists(name, ownerID){
        return await PetModel.findOne({name: name, owner: ownerID});
    }
}

module.exports = Pet