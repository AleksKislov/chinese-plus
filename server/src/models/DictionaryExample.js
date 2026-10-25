const mongoose = require('mongoose');

/**
 * Example of a `dictionaries` entry, split out of its DSL markup.
 * `senseId` is the position of its sense in DictionaryTranslation.senses
 * ('2.1' = senses[1].senses[0], null when it is not under any sense).
 * Indexes are created by scripts/split-dictionary-translations.js.
 */
const DictionaryExampleSchema = new mongoose.Schema(
  {
    wordId: { type: mongoose.Schema.Types.ObjectId, ref: 'dictionary' },
    chinese: { type: String },
    lang: { type: String },
    order: { type: Number },
    senseId: { type: String, default: null },
    zh: { type: String },
    pinyin: { type: String },
    labels: { type: [String], default: undefined },
    translation: { type: String },
    content: { type: Array, default: undefined },
  },
  { autoIndex: false, versionKey: false }
);

module.exports = mongoose.model('DictionaryExample', DictionaryExampleSchema, 'dictionaryexamples');
