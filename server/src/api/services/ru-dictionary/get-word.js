const RussianWord = require('../../../models/RussianWord');
const { checkRuWord } = require('./check-ru-word');

/**
 * @route   GET api/ru-dictionary/:word
 * @desc    look up a Russian word; if not found, suggest spellcheck alternatives
 * @access  Public
 */
async function getWord(req, res) {
  const word = req.params.word;
  const found = await RussianWord.findOne({ ru: word });

  if (found) {
    return res.json({ word: found, other: [] });
  }

  const other = await checkRuWord(word);
  res.json({ word: null, other });
}

module.exports = { getWord };
