const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wordSchema = new Schema({
  date: {
    type: String,
    required: true,
  },
  word: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Word", wordSchema);
