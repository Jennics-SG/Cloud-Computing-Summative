const mongoose = require('mongoose');

const schema = mongoose.Schema;

const petScehma = new schema({
    uuid: {
        type: String,
        required: [true, 'No Pet ID assigned'],
    },
    name: {
        type: String,
        min: 1,
        max: 15,
        required: [true, 'What do you call them?']
    },
    size: {
        type: String,
        min: 1,
        max: 1,
        required: [true, "How big are they?"]
    },
    owner: {
        type: String,
        required: [true, 'No Owner ID assigned']
    }
})

module.exports = mongoose.model("Pet", petScehma, "Pets");