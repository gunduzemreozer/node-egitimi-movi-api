const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DirectorSchema = new Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 50
    },
    surname: {
        type: String,
        minlength: 2,
        maxlength: 50
    },
    bio: {
        type: String,
        minlength: 50,
        maxlength: 1000
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('director', DirectorSchema);