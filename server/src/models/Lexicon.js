const mongoose = require("mongoose");
const LexiconSchema = new mongoose.Schema({
  word_id: {
    type: Number
  },
  level: {
    type: Number
  },
  chinese: {
    type: String
  },
  translation: {
    type: String
  },
  pinyin: {
    type: String
  }
});

module.exports = Lexicon = mongoose.model("lexicon", LexiconSchema);
