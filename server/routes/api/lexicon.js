const router = require("express").Router();

const Lexicon = require("../../src/models/Lexicon");

/**
 * @route     GET api/lexicon?hsk_level
 * @desc      Get all old hsk words by level
 * @access    Public
 */
router.get("/all", async (req, res) => {
  const level = Number(req.query.hsk_level) || 1;

  try {
    const allLexicon = await Lexicon.find({ level }).sort({ word_id: 1 });

    res.json(allLexicon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route     GET api/lexicon?hsk_level=...
 * @desc      Get old hsk words by hsk level with limit
 * @access    Public
 */
router.get("/", async (req, res) => {
  const WORDS_NUM = 200;
  const level = req.query.hsk_level || "1";
  const limit = Number(req.query.limit) || 0;

  const firstIdPerLvl = {
    1: 0,
    2: 150,
    3: 300,
    4: 600,
    5: 1200,
    6: 2500,
  };

  try {
    const start = firstIdPerLvl[level] + WORDS_NUM * limit;
    const end = start + WORDS_NUM + 1;

    const allLexicon = await Lexicon.find({
      level,
      word_id: { $gt: start, $lt: end },
    }).sort({ word_id: 1 });

    res.json(allLexicon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route     POST api/lexicon/search
 * @desc      Search chinese words from hsk vocab
 * @access    Public
 */
router.post("/search", async (req, res) => {
  try {
    let lexicon = await Lexicon.find({ chinese: { $regex: req.body.chinese } });
    res.json(lexicon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
