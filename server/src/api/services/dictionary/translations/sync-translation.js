const DictionaryTranslation = require('../../../../models/DictionaryTranslation');
const DictionaryExample = require('../../../../models/DictionaryExample');
const { buildDocuments } = require('./build-documents');

/**
 * Rebuilds the translation and examples of an edited `dictionaries` entry, so they
 * keep matching its `russian` markup.
 */
async function syncTranslation(word) {
  const { translation, examples } = buildDocuments(word);

  await DictionaryTranslation.collection.replaceOne({ wordId: word._id }, translation, {
    upsert: true,
  });
  await DictionaryExample.collection.deleteMany({ wordId: word._id });
  if (examples.length) await DictionaryExample.collection.insertMany(examples);
}

module.exports = { syncTranslation };
