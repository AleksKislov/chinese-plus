const RussianWord = require('../../../models/RussianWord');
const { RU_COLLATION } = RussianWord;
const { checkRuWord } = require('./check-ru-word');
const { findNameSlug } = require('../names');

/**
 * @route   GET api/ru-dictionary/:word
 * @desc    look up a Russian word; if not found, suggest spellcheck alternatives
 * @access  Public
 */
async function getWord(req, res) {
  const word = req.params.word;
  // the same word may exist in several cases (e.g. a name and a common noun): prefer the exact one
  const matches = await RussianWord.find({ ru: word }).collation(RU_COLLATION).limit(5);
  const found = matches.find((m) => m.ru === word) || matches[0];

  if (found) {
    // "Александр" also has its own page on /names
    return res.json({ word: found, other: [], nameSlug: findNameSlug(word) });
  }

  const other = await checkRuWord(word);
  res.json({ word: null, other, nameSlug: findNameSlug(word) });
}

module.exports = { getWord };
