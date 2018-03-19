const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        minlength: 5,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minlength: 5,
        required: true
    }
});

module.exports = mongoose.model('user', UserSchema);
