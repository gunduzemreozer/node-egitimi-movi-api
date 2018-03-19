const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title: {
        type: String,
        required: [true, '{PATH} alanı zorunludur!'],
        minlength: [3, '{PATH} alanına girilen `{VALUE}` değeri ({MINLENGTH}) karakterden fazla olmalıdır!'],
        maxlength: [15, '{PATH} alanına girilen `{VALUE}` değeri ({MAXLENGTH}) karakterden az olmalıdır!']
    },
    category: {
        type: String,
        minlength: 1,
        maxlength: 30
    },
    country: {
        type: String,
        minlength: 1,
        maxlength: 30
    },
    year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear()
    },
    imdbScore: {
        type: Number,
        min: 0,
        max: 10
    },
    director_id: Schema.Types.ObjectId,
    createDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('movie', MovieSchema);
