const mongoose = require('mongoose');

const WordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  word_id: {
    type: Number,
  },
  level: {
    type: Number,
  },
  chinese: {
    type: String,
  },
  translation: {
    type: String,
  },
  pinyin: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Word = mongoose.model('word', WordSchema);
