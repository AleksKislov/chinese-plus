const mongoose = require("mongoose");
const DictionarySchema = new mongoose.Schema({
  chinese: { type: String },
  russian: { type: String },
  pinyin: { type: String },
  edited: {
    type: Boolean,
    default: false,
  },
  previous: {
    type: Array,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Dictionary = mongoose.model("dictionary", DictionarySchema);
