const mongoose = require('mongoose');

/**
 * DEPRECATED: the DSL markup ("[m1]1) кот, кошка[/m][m2][*][ex]...") that `dictionaries` kept in
 * `russian`, moved out by scripts/move-russian-to-deprecated.js. `_id` is the dictionary entry id.
 * The site reads translations from dictionarytranslations / dictionaryexamples; this is only the
 * source for re-running scripts/split-dictionary-translations.js and for the names scripts.
 */
const DeprecatedDictionaryRussianSchema = new mongoose.Schema(
  {
    chinese: { type: String },
    russian: { type: String },
  },
  { autoIndex: false, versionKey: false },
);

module.exports = mongoose.model(
  'DeprecatedDictionaryRussian',
  DeprecatedDictionaryRussianSchema,
  'deprecated_dictionary_russian',
);
