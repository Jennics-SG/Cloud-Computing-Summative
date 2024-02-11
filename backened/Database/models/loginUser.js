// Schema for use with database
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const loginUserSchema = new Schema({
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
    pass: {
        type: String,
        min: 6,
        required: [true, "Gotta authenticate"]
    },
    actType: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("loginUser", loginUserSchema, "Login_Users");