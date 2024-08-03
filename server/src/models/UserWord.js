const mongoose = require('mongoose');
const UserWordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
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

module.exports = UserWord = mongoose.model('userword', UserWordSchema);
