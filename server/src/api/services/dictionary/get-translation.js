const mongoose = require('mongoose');
const DictionaryTranslation = require('../../../models/DictionaryTranslation');
const DictionaryExample = require('../../../models/DictionaryExample');
const { pickTranslation } = require('./translations/langs');

/**
 * @route   GET api/dictionary/translation/:wordId?examples=true
 * @desc    the translation of a dictionary word the site shows (russian, else a fallback language,
 *          see translations/langs.js), with its examples when asked;
 *          { translation: null } when the word has no translation
 */
async function getTranslation(req, res) {
  const { wordId } = req.params;
  if (!mongoose.isValidObjectId(wordId)) throw new Error('invalid word id');

  const withExamples = req.query.examples === 'true';
  // in parallel: all the word's examples, those of the shown translation picked here
  const [translations, allExamples] = await Promise.all([
    DictionaryTranslation.find({ wordId }).select('-_id -ruTerms -parseWarnings').lean(),
    withExamples
      ? DictionaryExample.find({ wordId }).select('-_id -wordId -chinese').sort({ order: 1 }).lean()
      : [],
  ]);
  const translation = pickTranslation(translations);
  const examples = translation ? allExamples.filter((e) => e.lang === translation.lang) : [];

  res.json({ translation, examples });
}

module.exports = { getTranslation };
