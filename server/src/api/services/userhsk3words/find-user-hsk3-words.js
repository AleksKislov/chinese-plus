const UserHsk3Word = require('../../../models/UserHsk3Word');
require('../../../models/Hskword2025');
const { attachSenses } = require('../dictionary/translations/attach-senses');

// user's hsk 3.0 words, newest first; with the parsed `senses` of their dictionary entry, like in
// /api/newhskwords
const findUserHsk3Words = async (userId) => {
  const words = await UserHsk3Word.find({ user: userId })
    .populate({
      path: 'wordId',
      select: ['id', 'lvl', 'cn', 'py', 'audio', 'dictId'],
    })
    .sort({ date: -1 })
    .lean();

  // hsk words may be re-imported: skip entries whose word no longer exists
  const userWords = words
    .filter((x) => x.wordId)
    .map(({ wordId: word, date }) => ({
      _id: word._id,
      id: word.id,
      lvl: word.lvl,
      cn: word.cn,
      py: word.py,
      dictId: word.dictId,
      audio: word.audio,
      date,
    }));
  return attachSenses(userWords, { idField: 'dictId' });
};

module.exports = { findUserHsk3Words };
