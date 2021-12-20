const mongoose = require("mongoose");
const DictionarySchema = new mongoose.Schema({
  chinese: {
    type: String
  },
  russian: {
    type: String
  },
  pinyin: {
    type: String
  },
  edited: {
    previousContent: {
      type: String
    },
    bool: {
      type: Boolean,
      default: false
    },
    reason: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Dictionary = mongoose.model("dictionary", DictionarySchema);
