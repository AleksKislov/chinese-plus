const router = require("express").Router();
const { apiDecorator } = require("../../src/api/api-decorator");
const {
  getHskByLvlAndLimit,
  getRandomHskByLvl,
  searchHsk,
} = require("../../src/api/services/lexicon");

/**
 * @route     GET api/lexicon/all?hsk_level=
 * @desc      Get all old hsk words by level
 * @access    Public
 */
router.get("/all", apiDecorator(getRandomHskByLvl));

/**
 * @route     GET api/lexicon?hsk_level=...
 * @desc      Get old hsk words by hsk level with limit
 * @access    Public
 */
router.get("/", apiDecorator(getHskByLvlAndLimit));

/**
 * @route     POST api/lexicon/search
 * @desc      Search chinese words from hsk vocab
 * @access    Public
 */
router.post("/search", apiDecorator(searchHsk));

module.exports = router;
