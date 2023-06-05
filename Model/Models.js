var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  firstName: {
    required: true,
    type: String
  },
  lastName: {
    required: true,
    type: String
  },
  mobile: {
    required: true,
    type: Number
  },
  experience: {
    required: true,
    type: String
  },
  resume: {
    required: true,
    type: Buffer
  }
}, { timestamps: true, versionKey: false });

var User = mongoose.model('User', userSchema);
module.exports = User;
