const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Word = require('../../src/models/Word');

// @route   GET api/words
// @desc    Get all your HSK words
// access   Private
router.get('/', auth, async (req, res) => {
  try {
    const words = await Word.find({ user: req.user.id }).sort({ date: -1 });

    if (words.length <= 0) return res.status(400).json({ msg: 'There are no words yet' });

    res.json(words);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/words
// @desc    Add new words to your hsk vocab
// access   Private
router.post('/', auth, async (req, res) => {
  const { chinese, translation, pinyin, level, word_id } = req.body;

  let newWords = {};
  newWords.user = req.user.id;
  newWords.chinese = chinese;
  newWords.translation = translation;
  newWords.pinyin = pinyin;
  newWords.level = level;
  newWords.word_id = word_id;
  const words = new Word(newWords);

  try {
    await words.save();

    return res.json(words);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @desc    Add new words to your hsk vocab
 * @route   DELETE api/words/:word_id
 * @access  Private
 */
router.delete('/:word_id', auth, async (req, res) => {
  // req.user.id
  const word_id = parseInt(req.params.word_id);
  try {
    await Word.findOneAndDelete({ word_id, user: req.user.id });
    return res.json({ msg: 'Word removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/words/all?hsk_level=...
// @desc    Get words by hsk level
// @access  Private
router.get('/all', auth, async (req, res) => {
  try {
    const hsk_level = Number(req.query.hsk_level);

    let allLexicon = await Word.find({
      level: hsk_level,
      user: req.user.id,
    }).sort({ word_id: 1 });

    res.json(allLexicon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
