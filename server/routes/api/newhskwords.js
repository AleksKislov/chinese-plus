const router = require("express").Router();

const { apiDecorator } = require("../../src/api/api-decorator");
const {
  getRandomNewHskByLvl,
  getNewHskByLvlAndLimit,
} = require("../../src/api/services/newhskwords");

/**
 * @route     GET api/newhskwords/all
 * @desc      Get all the hsk words by level
 * @access    Public
 */
router.get("/all", apiDecorator(getRandomNewHskByLvl));

/**
 * @route     GET api/newhskwords?query=...
 * @desc      Get new hsk words by hsk level
 * @access    Public
 */
router.get("/", apiDecorator(getNewHskByLvlAndLimit));

/**
 * @route     POST api/lexicon/search
 * @desc      Search chinese words from hsk vocab
 * @access    Public
 */
// router.post("/search", async (req, res) => {
//   try {
//     let lexicon = await Lexicon.find({ chinese: { $regex: req.body.chinese } });
//     res.json(lexicon);
//   } catch (err) {
// logError(err, res);
//   }
// });

module.exports = router;
