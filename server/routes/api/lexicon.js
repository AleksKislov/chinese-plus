const router = require('express').Router();
const {
  getHskByLvlAndLimit,
  getRandomHskByLvl,
  searchHsk,
} = require('../../src/api/services/lexicon');

/**
 * @route     GET api/lexicon/all?hsk_level=
 * @desc      Get all old hsk words by level
 * @access    Public
 */
router.get('/all', getRandomHskByLvl);

/**
 * @route     GET api/lexicon?hsk_level=...
 * @desc      Get old hsk words by hsk level with limit
 * @access    Public
 */
router.get('/', getHskByLvlAndLimit);

/**
 * @route     POST api/lexicon/search
 * @desc      Search chinese words from hsk vocab
 * @access    Public
 */
router.post('/search', searchHsk);

module.exports = router;
