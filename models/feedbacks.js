const monogoose = require('mongoose')
const Schema = monogoose.Schema;

const feedbackSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  telNum: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  agree: {
    type: String,
    default: false
  },
  contactType: String,
  message: String
});

module.exports = monogoose.model('Feedback', feedbackSchema);