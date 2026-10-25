const mongoose = require('mongoose');
const DictionaryTranslation = require('../../../models/DictionaryTranslation');
const DictionaryExample = require('../../../models/DictionaryExample');

/**
 * @route   GET api/dictionary/translation/:wordId?examples=true
 * @desc    parsed translation of a dictionary word, with its examples when asked;
 *          { translation: null } when the word has no parsed translation (not migrated)
 */
async function getTranslation(req, res) {
  const { wordId } = req.params;
  if (!mongoose.isValidObjectId(wordId)) throw new Error('invalid word id');

  const withExamples = req.query.examples === 'true';
  const [translation, examples] = await Promise.all([
    DictionaryTranslation.findOne({ wordId }).select('-_id -ruTerms -parseWarnings').lean(),
    withExamples
      ? DictionaryExample.find({ wordId }).select('-_id -wordId -chinese').sort({ order: 1 }).lean()
      : [],
  ]);

  res.json({ translation, examples });
}

module.exports = { getTranslation };
