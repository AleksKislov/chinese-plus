const router = require('express').Router();
const {
  getHskByLvlAndLimit,
  getRandomHskByLvl,
  searchHsk,
  downloadOldHskCsv,
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

/**
 * @route     GET api/lexicon/csv/:hsk_level?is_html=1
 * @desc      download csv with chinese words from hsk vocab by level (is_html is for ANKI html representation)
 * @access    Public
 */
router.get('/csv/:hsk_level', downloadOldHskCsv);

module.exports = router;
