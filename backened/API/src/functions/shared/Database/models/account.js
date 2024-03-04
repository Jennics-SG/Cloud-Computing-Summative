const mongoose = require('mongoose');

const schema = mongoose.Schema;

const accountSchema = new schema({
    name: {
        type: String,
        min: 1,
        max: 15,
        required: [true, "What do I call you?"]
    },
    email:{
        type: String,
        required: [true, "How do I stay in contact"]
    },
    actType: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        required: [true, "No user ID assigned"]
    }
});

module.exports = mongoose.model("Account", accountSchema, "Accounts")