const express = require("express");
const router = express.Router();

const Lexicon = require("../../src/models/Lexicon");

// @route   GET api/lexicon
// @desc    Get all the hsk words by level
// access   Public
router.get("/all", async (req, res) => {
  const hsk_level = Number(req.query.hsk_level);

  try {
    let allLexicon = await Lexicon.find({ level: hsk_level ? hsk_level : 1 }).sort({ word_id: 1 });

    res.json(allLexicon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/lexicon
// @desc    Get all the words in a text
// access   Public
router.post("/allwords", async (req, res) => {
  try {
    let allLexicon = await Lexicon.find({ chinese: { $in: req.body } });

    res.json(allLexicon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/lexicon?query=...
// @desc    Get words by hsk level
// access   Public
router.get("/", async (req, res) => {
  try {
    const hsk_level = Number(req.query.hsk_level);
    const limit = Number(req.query.limit);
    let start;
    switch (hsk_level) {
      case 1:
        start = 0 + limit * 200;
        break;
      case 2:
        start = 150 + limit * 200;
        break;
      case 3:
        start = 300 + limit * 200;
        break;
      case 4:
        start = 600 + limit * 200;
        break;
      case 5:
        start = 1200 + limit * 200;
        break;
      case 6:
        start = 2500 + limit * 200;
        break;
      default:
        break;
    }
    let end = start + 201;

    let allLexicon = await Lexicon.find({
      level: hsk_level,
      word_id: { $gt: start, $lt: end }
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
