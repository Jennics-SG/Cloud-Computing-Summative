const mongoose = require('mongoose');

const schema = mongoose.Schema;

const JobSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    walker: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Job", JobSchema, "Jobs");