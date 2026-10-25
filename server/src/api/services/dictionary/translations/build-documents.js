const { parseTranslation } = require('./parse-dsl');
const { buildRuSearch } = require('./ru-search-terms');

/**
 * The `dictionarytranslations` document and `dictionaryexamples` documents for one
 * `dictionaries` entry, built from its DSL markup in `russian`.
 * Used by the migration script and when a word is edited, so both stay identical.
 */
function buildDocuments(word) {
  const { lang, senses, examples, warnings } = parseTranslation(word.russian);

  const translation = {
    wordId: word._id,
    chinese: word.chinese,
    lang,
    senses,
    exampleCount: examples.length,
    ...(lang === 'ru' ? buildRuSearch(senses) : {}),
  };
  if (warnings.length) translation.parseWarnings = warnings;

  const exampleDocs = examples.map((example, order) => ({
    wordId: word._id,
    chinese: word.chinese,
    lang,
    order,
    ...example,
  }));

  return { translation, examples: exampleDocs };
}

module.exports = { buildDocuments };
