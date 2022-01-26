const router = require("express").Router();

const Hskword = require("../../src/models/Hskword");

const logError = (err, res) => {
  console.error(err.message);
  res.status(500).send("Server error");
};

/**
 * @route     GET api/newhskwords/all
 * @desc      Get all the hsk words by level
 * @access    Public
 */
router.get("/all", async (req, res) => {
  const lvl = req.query.hsk_level || "1";

  try {
    const allWords = await Hskword.find({ lvl }).sort({ id: 1 });
    res.json(allWords);
  } catch (err) {
    logError(err, res);
  }
});

/**
 * @route     GET api/newhskwords?query=...
 * @desc      Get new hsk words by hsk level
 * @access    Public
 */
router.get("/", async (req, res) => {
  const WORDS_NUM = 200;
  const lvl = req.query.hsk_level;
  const limit = Number(req.query.limit) || 0;
  const start = 0 + limit * WORDS_NUM;
  const end = start + WORDS_NUM + 1;

  try {
    const allLexicon = await Hskword.find({
      lvl,
      id: { $gt: start, $lt: end },
    }).sort({ id: 1 });

    res.json(allLexicon);
  } catch (err) {
    logError(err, res);
  }
});

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
