var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var dishSchema = require('./dishes');


var favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }, 
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}, {timestamps: true});

module.exports = mongoose.model('Favorite', favoriteSchema);