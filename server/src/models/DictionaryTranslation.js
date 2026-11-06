const mongoose = require('mongoose');

/**
 * Parsed translation of a `dictionaries` entry (from its DSL markup, now in
 * deprecated_dictionary_russian).
 * Shape of `senses`: src/api/services/dictionary/translations/parse-dsl.js.
 * Filled by scripts/split-dictionary-translations.js, which also creates the indexes
 * (including the russian text index), so none are declared here.
 */
const DictionaryTranslationSchema = new mongoose.Schema(
  {
    wordId: { type: mongoose.Schema.Types.ObjectId, ref: 'dictionary' },
    chinese: { type: String },
    lang: { type: String }, // 'ru' | 'en' | 'zh'
    senses: { type: Array },
    exampleCount: { type: Number },
    ruTerms: { type: [String], default: undefined },
    parseWarnings: { type: [String], default: undefined },
  },
  { autoIndex: false, versionKey: false },
);

module.exports = mongoose.model(
  'DictionaryTranslation',
  DictionaryTranslationSchema,
  'dictionarytranslations',
);
