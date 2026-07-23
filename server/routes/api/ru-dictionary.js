const router = require('express').Router();
const { getWord } = require('../../src/api/services/ru-dictionary');

/**
 * @method  GET
 * @route   api/ru-dictionary/:word
 * @desc    Look up a Russian word (migrated from the standalone Go "books" service)
 * @access  Public
 */
router.get('/:word', getWord);

module.exports = router;
