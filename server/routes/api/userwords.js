const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const UserDictWord = require('../../src/models/UserWord');

const { downloadUserDictWordsCsv } = require('../../src/api/services/userwords');

/**
 * @route     GET api/userwords
 * @desc      Get all the words for personal vocabulary
 * @access    Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const words = await UserDictWord.find({ user: req.user.id })
      .populate('wordId', ['chinese', 'russian', 'pinyin', '_id'])
      .sort({ date: -1 });

    if (words.length <= 0) return res.status(400).json({ msg: 'There are no words yet' });

    // console.log(words);
    res.json(words.map(userWordToDTO));
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
    translation: word.wordId.russian,
    pinyin: word.wordId.pinyin,
    dictWordId: word.wordId._id,
  };
}

/**
 * @route     POST api/userwords
 * @desc      Add new word from dictionary to user vocab
 * @access    Private
 */
router.post('/:wordId', auth, async (req, res) => {
  const newWord = {
    user: req.user.id,
    wordId: req.params.wordId,
  };

  const word = new UserDictWord(newWord);

  try {
    await word.save();

    return res.json(word);
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
