const mongoose = require('mongoose');
const commentSchema = require('./comments').schema;
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency; 

var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default:false      
    },
    comments: [commentSchema]
}, {timestamps: true});

module.exports = mongoose.model('Dish', dishSchema);
// module.exports = {'schema': dishSchema, 'model': mongoose.model('Dish', dishSchema)};