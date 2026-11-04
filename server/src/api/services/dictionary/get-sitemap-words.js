const Dictionary = require('../../../models/Dictionary');
const Lexicon = require('../../../models/Lexicon');
const Hskword2025 = require('../../../models/Hskword2025');

/**
 * @route GET api/dictionary/sitemap-words
 *
 * Distinct HSK words (HSK 2.0 lexicon + HSK 3.0 2025 list) that have a dictionary
 * entry, i.e. a real /dictionary/{word}/ page. Feeds the frontend's
 * sitemap-dictionary.xml - only words worth indexing, not the whole dictionary.
 */
const getSitemapWords = async (req, res) => {
  const [oldWords, newWords] = await Promise.all([
    Lexicon.distinct('chinese'),
    Hskword2025.distinct('cn'),
  ]);

  const candidates = [...new Set([...oldWords, ...newWords])].filter(Boolean);
  const words = await Dictionary.distinct('chinese', { chinese: { $in: candidates } });

  res.json(words.sort());
};

module.exports = { getSitemapWords };
