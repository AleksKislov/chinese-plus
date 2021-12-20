const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const hanzi = require("./dict/dictionary");
// const { redisClient } = require("./services");
const { getAllWords, segmentText } = require("./services");

const Dictionary = require("../../src/models/Dictionary");

setTimeout(async () => {
  hanzi.start();
  // let lexicon;
  // try {
  //   lexicon = await Dictionary.find({}, undefined, {
  //     skip: 2400000,
  //     limit: 100000
  //   }).select("chinese");
  //   console.log(lexicon.length);
  //   console.log(lexicon[0]);
  //   lexicon.forEach(x => {
  //     redisClient.set(x.chinese, true);
  //   });
  // } catch (err) {
  //   console.log(err);
  // }
  // redisClient.get("好", res => {
  //   console.log("haoooo", res);
  // });

  // redisClient.dbsize(num => {
  //   console.log("haoooo", num);
  // });

  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}, 1000);

// @route   GET api/dictionary?word=...
// @desc    Search chinese word in dictionary
// access   Public
router.get("/", async (req, res) => {
  const word = req.query.word;
  let re, lexicon;

  try {
    if (word.match(/[\wа-я]+/gi)) {
      re = new RegExp("[\\s|\\]](" + word + ")");
      lexicon = await Dictionary.find({ russian: { $regex: re, $options: "gm" } });
    } else {
      re = new RegExp("^(" + word + ")");
      lexicon = await Dictionary.find({ chinese: { $regex: re, $options: "i" } });
    }

    res.json(lexicon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/dictionary
// @desc    Add array of words to dictionary
// access   Private
// router.post("/", auth, async (req, res) => {
//   const arr = req.body;

//   Dictionary.insertMany(arr)
//     .then(() => {
//       console.log("Data inserted");
//       res.send("Data inserted");
//     })
//     .catch(error => {
//       console.log(error);
//     });
// });

/**
 * @route     GET api/lexicon
 * @desc      Get all the words in a text
 * @access    Public
 */
router.post("/allwords", async (req, res) => {
  try {
    const allLexicon = await getAllWords(req.body);
    res.json(allLexicon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/dictionary/certain
// @desc    GET all words that have...
// access   public
router.get("/certain/:word", async (req, res) => {
  const word = req.params.word;
  let re, lexicon;

  // console.log(word);
  try {
    if (word === "eng") {
      re = new RegExp(/^[\p{Latin}\p{Common}]+$/);
      lexicon = await Dictionary.find({
        russian: { $regex: re, $options: "g" }
      }).countDocuments();
    } else if (word === "pinyin") {
      re = new RegExp(/ --| _/);
      lexicon = await Dictionary.find({
        pinyin: { $regex: re }
      }).countDocuments();
    }
    // else if (word === "all") {
    //   lexicon = await Dictionary.countDocuments();
    // } else if (word === "ref") {
    //   re = new RegExp(/\[ref\]/);
    //   lexicon = await Dictionary.find({ russian: { $regex: re } }).countDocuments();
    // } else if (word === "allref") {
    //   re = new RegExp(/\[ref\]/);
    //   lexicon = await Dictionary.find({ russian: { $regex: re } });
    // }

    res.json(lexicon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// TODO edit all refs
// router.get("/editref/:id", async (req, res) => {
//   const id = req.params.id;

//   try {
//     let wordToEdit = await Dictionary.findById(id);

//     if (wordToEdit.edited.bool === false) {
//       const matchedArr = wordToEdit.russian.match(/(\[ref\])(.*)(\[\/ref)/);
//       // res.send(matchedArr[2]);

//       const foundWord = matchedArr[2];
//       // console.log(foundWord);
//       const wordToRefer = await Dictionary.findOne({ chinese: foundWord });

//       wordToEdit.edited.bool = true;
//       wordToEdit.edited.previousContent = wordToEdit.russian;
//       wordToEdit.edited.reason = "ref";
//       wordToEdit.russian = wordToEdit.russian + wordToRefer.russian;
//       const edited = await Dictionary.findOneAndUpdate(
//         { _id: id },
//         {
//           $set: wordToEdit
//         },
//         { new: true }
//       );
//       res.json(edited);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// });

/**
 * @route     GET api/dictionary/segmenter
// @desc      GET all words from text SEGMENTED
// @access    Public
 */
router.post("/segmenter", (req, res) => {
  // const wordsarr = await hanzi.segment(req.body.text);
  const wordsarr = segmentText(req.body.text);
  console.log(wordsarr)

  res.send(wordsarr);
});

module.exports = router;
