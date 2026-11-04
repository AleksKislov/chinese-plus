const mongoose = require('mongoose');
const UserHsk3Word = require('../../../models/UserHsk3Word');
const Hskword2025 = require('../../../models/Hskword2025');
const { findUserHsk3Words } = require('./find-user-hsk3-words');

// same as CONSTANTS.users.vocabSize on the frontend
const VOCAB_SIZE = 300;

const getUserHsk3Words = async (req, res) => {
  res.json(await findUserHsk3Words(req.user.id));
};

// just the hsk word ids - used to mark selected words in the hsk 3.0 tables
const getUserHsk3WordIds = async (req, res) => {
  const words = await UserHsk3Word.find({ user: req.user.id }).select('wordId').lean();
  res.json(words.map((x) => String(x.wordId)));
};

const countUserHsk3Words = async (req, res) => {
  res.json({ count: await UserHsk3Word.countDocuments({ user: req.user.id }) });
};

const addUserHsk3Word = async (req, res) => {
  const { wordId } = req.params;
  if (!mongoose.isValidObjectId(wordId)) return res.status(400).json({ msg: 'Invalid word id' });

  if (!(await Hskword2025.exists({ _id: wordId }))) {
    return res.status(404).json({ msg: 'Word not found' });
  }

  const filter = { user: req.user.id, wordId };
  if (await UserHsk3Word.exists(filter)) return res.json({ msg: 'Word already added' });

  if ((await UserHsk3Word.countDocuments({ user: req.user.id })) >= VOCAB_SIZE) {
    return res.status(400).json({ msg: `Limit of ${VOCAB_SIZE} words` });
  }

  try {
    res.json(await UserHsk3Word.create(filter));
  } catch (err) {
    // a parallel request has just added it (unique index on user + wordId)
    if (err.code === 11000) return res.json({ msg: 'Word already added' });
    throw err;
  }
};

const removeUserHsk3Word = async (req, res) => {
  const { wordId } = req.params;
  if (!mongoose.isValidObjectId(wordId)) return res.status(400).json({ msg: 'Invalid word id' });

  await UserHsk3Word.findOneAndDelete({ user: req.user.id, wordId });
  res.json({ msg: 'UserHsk3Word removed' });
};

module.exports = {
  getUserHsk3Words,
  getUserHsk3WordIds,
  countUserHsk3Words,
  addUserHsk3Word,
  removeUserHsk3Word,
};
