const router = require('express').Router();
const auth = require('../../middleware/auth');

const {
  getUserHsk3Words,
  getUserHsk3WordIds,
  countUserHsk3Words,
  addUserHsk3Word,
  removeUserHsk3Word,
  downloadUserHsk3Csv,
} = require('../../src/api/services/userhsk3words');

/**
 * @route     GET api/userhsk3words
 * @desc      Get all your HSK 3.0 words (current 2025 list), newest first
 * @access    Private
 */
router.get('/', auth, getUserHsk3Words);

/**
 * @route     GET api/userhsk3words/ids
 * @desc      Get just the HSK 3.0 word ids from your list
 * @access    Private
 */
router.get('/ids', auth, getUserHsk3WordIds);

/**
 * @route     GET api/userhsk3words/count
 * @desc      Get the number of words in your HSK 3.0 list (header count)
 * @access    Private
 */
router.get('/count', auth, countUserHsk3Words);

/**
 * @method   GET
 * @route    api/userhsk3words/csv?has_examples=1
 * @desc     download csv with user HSK 3.0 words
 * @access   Private
 */
router.get('/csv', auth, downloadUserHsk3Csv);

/**
 * @route     POST api/userhsk3words/:wordId
 * @desc      Add HSK 3.0 word (hskword2025 _id) to your HSK 3.0 list
 * @access    Private
 */
router.post('/:wordId', auth, addUserHsk3Word);

/**
 * @route     DELETE api/userhsk3words/:wordId
 * @desc      Remove HSK 3.0 word (hskword2025 _id) from your HSK 3.0 list
 * @access    Private
 */
router.delete('/:wordId', auth, removeUserHsk3Word);

module.exports = router;
