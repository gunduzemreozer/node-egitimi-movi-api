const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb://movie_user:!23asd@ds115579.mlab.com:15579/movie-api')
        .then(() => {
            console.log('MongoDB: Connected')
        })
        .catch(onRejected => {
            console.log('MondoDB: Error', onRejected);
        });
}