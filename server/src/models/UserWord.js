const mongoose = require('mongoose');
const UserWordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'dictionary',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // deprecated fields
  // chinese: {
  //   type: String,
  // },
  // translation: {
  //   type: String,
  // },
  // pinyin: {
  //   type: String,
  // },
});

module.exports = UserWord = mongoose.model('userword', UserWordSchema);
