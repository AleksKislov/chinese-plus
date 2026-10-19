const UserHsk3Word = require('../../../models/UserHsk3Word');
require('../../../models/Hskword2025');
require('../../../models/Dictionary');

// user's hsk 3.0 words, newest first; translation is joined from `dictionary` like in /api/newhskwords
const findUserHsk3Words = async (userId) => {
  const words = await UserHsk3Word.find({ user: userId })
    .populate({
      path: 'wordId',
      select: ['id', 'lvl', 'cn', 'py', 'audio', 'dictId'],
      populate: { path: 'dictId', select: ['russian'] },
    })
    .sort({ date: -1 })
    .lean();

  // hsk words may be re-imported: skip entries whose word no longer exists
  return words
    .filter((x) => x.wordId)
    .map(({ wordId: word, date }) => ({
      _id: word._id,
      id: word.id,
      lvl: word.lvl,
      cn: word.cn,
      py: word.py,
      ru: word.dictId?.russian || '',
      audio: word.audio,
      date,
    }));
};

module.exports = { findUserHsk3Words };
