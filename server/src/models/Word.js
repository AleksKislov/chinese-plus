const mongoose = require('mongoose');

// user old hsk words. Joins with the `lexicons` collection
const WordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'lexicon',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Word = mongoose.model('word', WordSchema);
