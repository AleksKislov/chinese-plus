const mongoose = require('mongoose');

// user hsk 3.0 words. Joins with the `hskword2025` collection (current hsk 3.0 list)
const UserHsk3WordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'hskword2025',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

UserHsk3WordSchema.index({ user: 1, wordId: 1 }, { unique: true });

module.exports = mongoose.model('userhsk3word', UserHsk3WordSchema);
