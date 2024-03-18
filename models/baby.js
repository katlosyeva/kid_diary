const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const babySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  skills: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Skill'
    }
  ],
  words:[
    {
        type: Schema.Types.ObjectId,
        ref: 'Word'
      }
  ]
});

module.exports = mongoose.model('Baby', babySchema);