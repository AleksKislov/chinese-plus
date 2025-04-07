const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const OldHskUserWord = require('../../src/models/Word');

const { downloadUserOldHskCsv } = require('../../src/api/services/words');

// @route   GET api/words
// @desc    Get all your HSK words
// access   Private
router.get('/', auth, async (req, res) => {
  try {
    const words = await OldHskUserWord.find({ user: req.user.id })
      .populate('wordId', ['chinese', 'translation', 'pinyin', 'level', 'word_id', '_id'])
      .sort({ date: -1 });

    if (words.length <= 0) return res.status(400).json({ msg: 'There are no words yet' });

    // console.log(words);
    res.json(words.map(oldHskWordToDTO));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

function oldHskWordToDTO(word) {
  return {
    _id: word._id,
    chinese: word.wordId.chinese,
    translation: word.wordId.translation,
    pinyin: word.wordId.pinyin,
    level: word.wordId.level,
    word_id: word.wordId.word_id,
    hskWordId: word.wordId._id,
  };
}

// @route   POST api/words/:wordId
// @desc    Add new word to your hsk vocab
// access   Private
router.post('/:wordId', auth, async (req, res) => {
  const newWord = {
    user: req.user.id,
    wordId: req.params.wordId,
  };
  const word = new OldHskUserWord(newWord);

  try {
    await word.save();

    return res.json(word);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @desc    Remove old hsk word from user hsk vocab
 * @route   DELETE api/words/:wordId
 * @access  Private
 */
router.delete('/:wordId', auth, async (req, res) => {
  try {
    await OldHskUserWord.findOneAndDelete({
      user: req.user.id,
      wordId: req.params.wordId,
    });
    return res.json({ msg: 'OldHskUserWord removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/words/all?hsk_level=...
// @desc    Get words by hsk level
// @access  Private
// router.get('/all', auth, async (req, res) => {
//   try {
//     let allLexicon = await OldHskUserWord.find({
//       level: +req.query.hsk_level,
//       user: req.user.id,
//     }).sort({ word_id: 1 });

//     res.json(allLexicon);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

/**
 * @method   GET
 * @route    api/words/csv
 * @desc     download csv with user words from dictionary
 * @access   Private
 */
router.get('/csv', auth, downloadUserOldHskCsv);

module.exports = router;
