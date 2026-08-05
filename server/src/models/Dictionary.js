const mongoose = require('mongoose');
const DictionarySchema = new mongoose.Schema({
  chinese: { type: String, index: true },
  tradChinese: { type: String, index: true },
  duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'dictionary', index: true },
  russian: { type: String },
  pinyin: { type: String },
  cleanPinyin: { type: String, index: true },
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

module.exports = Dictionary = mongoose.model('dictionary', DictionarySchema);
