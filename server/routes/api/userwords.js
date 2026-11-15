const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../../middleware/auth');

const UserDictWord = require('../../src/models/UserWord');
const { attachSenses } = require('../../src/api/services/dictionary/translations/attach-senses');

const { downloadUserDictWordsCsv } = require('../../src/api/services/userwords');

// same as CONSTANTS.users.vocabSize on the frontend (and the HSK 3.0 list's limit)
const VOCAB_SIZE = 300;

/**
 * @route     GET api/userwords
 * @desc      Get all the words for personal vocabulary
 * @access    Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const words = await UserDictWord.find({ user: req.user.id })
      .populate('wordId', ['chinese', 'pinyin', '_id'])
      .sort({ date: -1 });

    if (words.length <= 0) return res.status(400).json({ msg: 'There are no words yet' });

    // console.log(words);
    res.json(await attachSenses(words.map(userWordToDTO), { idField: 'dictWordId' }));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route     GET api/userwords/light
 * @desc      Get just the chinese strings for the user's vocabulary (cheap lookup set,
 *            no wordId join fields beyond chinese) - used app-wide (reader, header count)
 * @access    Private
 */
router.get('/light', auth, async (req, res) => {
  try {
    const words = await UserDictWord.find({ user: req.user.id })
      .populate('wordId', ['chinese'])
      .select('wordId')
      .lean();

    res.json(words.map((w) => w.wordId?.chinese).filter(Boolean));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

function userWordToDTO(word) {
  return {
    _id: word._id,
    date: word.date,
    chinese: word.wordId.chinese,
    pinyin: word.wordId.pinyin,
    dictWordId: word.wordId._id,
  };
}

/**
 * @route     POST api/userwords
 * @desc      Add new word from dictionary to user vocab (at most VOCAB_SIZE words; an existing
 *            one is returned as is)
 * @access    Private
 */
router.post('/:wordId', auth, async (req, res) => {
  const { wordId } = req.params;
  if (!mongoose.isValidObjectId(wordId)) return res.status(400).json({ msg: 'Invalid word id' });
  const filter = { user: req.user.id, wordId };

  try {
    // no duplicates: the same word added twice (two tabs, a double click) stays one
    const existing = await UserDictWord.findOne(filter);
    if (existing) return res.json(existing);

    if ((await UserDictWord.countDocuments({ user: req.user.id })) >= VOCAB_SIZE) {
      return res.status(400).json({ msg: `Limit of ${VOCAB_SIZE} words` });
    }

    return res.json(await new UserDictWord(filter).save());
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   DELETE api/userwords
 * @desc    Remove all the words from your vocab ("Очистить список" on /me/words)
 * @access  Private
 */
router.delete('/', auth, async (req, res) => {
  try {
    const { deletedCount } = await UserDictWord.deleteMany({ user: req.user.id });
    return res.json({ deleted: deletedCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   DELETE api/userwords/:wordId
 * @desc    Delete word from your vocab using dict word id
 * @access  Private
 */
router.delete('/:wordId', auth, async (req, res) => {
  try {
    await UserDictWord.findOneAndDelete({
      user: req.user.id,
      wordId: req.params.wordId,
    });
    return res.json({ msg: 'Word removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @method   GET
 * @route    api/userwords/csv?has_examples=1
 * @desc     download csv with user words from dictionary
 * @access   Private
 */
router.get('/csv', auth, downloadUserDictWordsCsv);

module.exports = router;
