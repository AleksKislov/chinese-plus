const mongoose = require("mongoose");
const DictionarySchema = new mongoose.Schema({
  chinese: { type: String },
  russian: { type: String },
  pinyin: { type: String },
  edited: {
    previousContent: { type: String },
    reason: { type: String },
    bool: {
      type: Boolean,
      default: false,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Dictionary = mongoose.model("dictionary", DictionarySchema);
