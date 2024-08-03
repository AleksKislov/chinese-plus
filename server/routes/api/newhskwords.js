const router = require('express').Router();

const {
  getRandomNewHskByLvl,
  getNewHskByLvlAndLimit,
  searchNewHsk,
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

module.exports = router;
