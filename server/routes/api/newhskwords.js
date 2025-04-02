const router = require('express').Router();

const {
  getRandomNewHskByLvl,
  getNewHskByLvlAndLimit,
  searchNewHsk,
  downloadNewHskCsv,
  // getAudio,
} = require('../../src/api/services/newhskwords');

// for internal use only
// router.get("/get-audio", getAudio);

/**
 * @route     GET api/newhskwords/all?hsk_level=
 * @desc      Get all the hsk words by level
 * @access    Public
 */
router.get('/all', getRandomNewHskByLvl);

/**
 * @route     GET api/newhskwords?query=...
 * @desc      Get new hsk words by hsk level
 * @access    Public
 */
router.get('/', getNewHskByLvlAndLimit);

/**
 * @route     POST api/newhskwords/search
 * @desc      Search chinese words from hsk vocab
 * @access    Public
 */
router.post('/search', searchNewHsk);

/**
 * @route     GET api/newhskwords/csv/:hsk_level?is_html=1&has_examples=1
 * @desc      download csv with chinese words from hsk vocab by level (is_html is for ANKI html representation)
 * @access    Public
 */
router.get('/csv/:hsk_level', downloadNewHskCsv);

module.exports = router;
