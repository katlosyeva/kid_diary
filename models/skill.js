const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
  date: {
    type: String,
    required: true
  },
  skill: {
    type: String,
    required: true
  },
  // baby_owner: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Baby',
  //   required: true
  // }
});

module.exports = mongoose.model('Skill', skillSchema);