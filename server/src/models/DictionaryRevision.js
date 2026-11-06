const mongoose = require('mongoose');

/**
 * Edit history of a `dictionaries` entry: the state of the word right before an admin changed it
 * (src/api/services/dictionary/word-entry.js). Rolling back restores a snapshot and records the
 * replaced state as a new revision, so a rollback can be undone too.
 *
 *   snapshot: { pinyin, tradChinese?, lang?, senses, examples: [{ senseId, order, zh, ... }] }
 *             null for action 'create'
 */
const DictionaryRevisionSchema = new mongoose.Schema(
  {
    wordId: { type: mongoose.Schema.Types.ObjectId, ref: 'dictionary', index: true },
    chinese: { type: String },
    editor: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    action: { type: String, enum: ['create', 'edit', 'rollback'] },
    date: { type: Date, default: Date.now },
    snapshot: { type: Object, default: null },
  },
  { versionKey: false },
);

module.exports = mongoose.model(
  'DictionaryRevision',
  DictionaryRevisionSchema,
  'dictionaryrevisions',
);
