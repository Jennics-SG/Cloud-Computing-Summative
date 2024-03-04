// Schema for use with database
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const loginUserSchema = new Schema({
    uuid: {
        type: String,
        required: [true, "No user ID assigned"]
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        min: 6,
        required: [true, "Gotta authenticate"]
    },
    refresh: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("UserCred", loginUserSchema, "User_Creds");