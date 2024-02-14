const mongoose = require('mongoose');

const schema = mongoose.Schema;

const JobSchema = new schema({
    user: {
        type: String,
        required: true
    },
    walker: {
        type: String,
        required: true
    },
    accepted:{
        type: Boolean,
        required: true
    },
    completed: {
        type: Boolean,
        require: true
    }
})

module.exports = mongoose.model("Job", JobSchema, "Jobs");