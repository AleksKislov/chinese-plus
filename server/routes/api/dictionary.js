const express = require('express');
const router = express.Router();
const Hanzi = require('./dict/dictionary');
const mdbg = require('mdbg');
const { getAllWords, getWordsForParag } = require('./services');
const auth = require('../../middleware/auth');

const Dictionary = require('../../src/models/Dictionary');

const { updateWord, rollbackUpdate, getEditedWords } = require('../../src/api/services/dictionary');

/**
 * @route     GET api/dictionary?word=...
 * @desc      get chinese word from dictionary
 * @access    Public
 */
router.get('/', async (req, res) => {
  const word = req.query.word;
  let re, lexicon;

  try {
    if (word.match(/[\wа-я]+/gi)) {
      re = new RegExp('[\\s|\\]](' + word + ')');
      lexicon = await Dictionary.find({ russian: { $regex: re, $options: 'gm' } });
    } else {
      re = new RegExp('^(' + word + ')');
      lexicon = await Dictionary.find({ chinese: { $regex: re, $options: 'i' } });
    }

    res.json(lexicon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route     GET api/dictionary/editedWords
 * @desc      get words with previously edited values
 * @access    Public
 */
router.get('/editedWords', getEditedWords);

/**
 * @route       POST api/dictionary
 * @desc        Add array of words to dictionary
 * @access      Private
 * @deprecated  for private use only
 */
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
 * @route     POST api/dictionary
 * @desc      Add one word to dictionary
 * @access    Private
 */
router.post('/', auth, async (req, res) => {
  try {
    const alreadyExists = await Dictionary.find({ chinese: req.body.chinese });

    if (alreadyExists && alreadyExists[0]) {
      return res.send(`The word ${req.body.chinese} already inserted`);
    }

    await new Dictionary(req.body).save();
    res.send('Data inserted');
  } catch (err) {
    console.log(err);
  }
});

/**
 * @route     GET api/dictionary/allwords
 * @desc      Get all the words in a text
 * @access    Public
 */
router.post('/allwords', async (req, res) => {
  const { isShortRu } = req.query;
  try {
    const words = await getAllWords(req.body);
    if (isShortRu) {
      for (let i = 0; i < words.length; i++) {
        words[i].russian = shortenTranslation(words[i].russian);
      }
    }
    res.json(words);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

function shortenTranslation(txt) {
  if (!txt) return '';
  txt = txt.replace(/\[\*\]\[ex\].*?\[\/ex\]\[\/\*\]/g, '').replaceAll('[m3][/m]', '');
  if (txt.length > 400) {
    const ind = txt.slice(200, txt.length).indexOf('[m2]');
    txt = txt.slice(0, ind + 200);
  }
  return txt;
}

router.post('/wordsForParag', auth, async (req, res) => {
  const userId = req.user?.id;

  try {
    res.json(await getWordsForParag({ ...req.body, userId }));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @todo сделать в виде одного запроса
router.post('/allWordsForVideo', async (req, res) => {
  try {
    const promises = req.body.map((arr) => getAllWords(arr));
    const segmentedSubs = await Promise.all(promises);
    for (let i = 0; i < segmentedSubs.length; i++) {
      const words = segmentedSubs[i];
      for (let k = 0; k < words.length; k++) {
        words[k].russian = shortenTranslation(words[k].russian);
      }
    }
    res.json(segmentedSubs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/getTextPinyin', auth, async (req, res) => {
  try {
    const promises = req.body.map((word) => mdbg.get(word).catch((e) => word));
    const resArr = await Promise.all(promises); // some long words might stay as is

    const splitWordsArr = resArr.map((el) => {
      if (el.hasOwnProperty('definitions') || el.length === 1) return el;
      return el.split('');
    });

    const singleCharPromises = splitWordsArr.flat(1).map((el) => {
      if (!el.hasOwnProperty('definitions')) {
        return mdbg.get(el).catch((e) => el);
      }
      return el;
    });

    const readyObjects = await Promise.all(singleCharPromises);

    const pinyinText = readyObjects.map((el) => {
      if (!el.hasOwnProperty('definitions')) return el;

      const innerArr = Object.values(el.definitions);
      const pyObj = innerArr.find((x) => x.hasOwnProperty('pinyin'));
      return pyObj.pinyin;
    });

    const allChunks = [];
    let chunk = [];
    pinyinText.forEach((x) => {
      if (x !== '\n') {
        chunk.push(x);
      } else {
        allChunks.push(chunk);
        chunk = [];
      }
    });
    if (chunk.length) allChunks.push(chunk);

    res.json(allChunks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route   GET api/dictionary/certain
 * @desc    GET all words that have...
 * @access  Public
 */
router.get('/certain/:word', async (req, res) => {
  const word = req.params.word;
  let re, lexicon;

  // console.log(word);
  try {
    if (word === 'eng') {
      re = new RegExp(/^[\p{Latin}\p{Common}]+$/);
      lexicon = await Dictionary.find({
        russian: { $regex: re, $options: 'g' },
      }).countDocuments();
    } else if (word === 'pinyin') {
      re = new RegExp(/ --| _/);
      lexicon = await Dictionary.find({
        pinyin: { $regex: re },
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
    res.status(500).send('Server error');
  }
});

/**
 * @route     GET api/dictionary/segmenter
 * @desc      GET all words from text SEGMENTED
 * @access    Public
 */
router.post('/segmenter', (req, res) => {
  res.send(Hanzi.segment(req.body.text));
});

/**
 * @desc        add new hsk words to db
 * @deprecated  for inner use only
 */
// router.get("/add_hsk", async (req, res) => {
//   try {
//     for await (const x of band) {
//       const [found] = await Dictionary.find({ chinese: x.cn });
//       // console.log(found.chinese);
//       if (found) {
//         const newWord = new Hskword({
//           id: x.id,
//           lvl: bandNum, // aka band
//           cn: found.chinese,
//           ru: found.russian,
//           py: found.pinyin,
//           opt: x.opt,
//         });

//         await newWord.save().catch((e) => console.log("ошибка с", x));
//       } else {
//         console.log("не нашли", x.cn);
//       }
//     }

//     res.json({ done: 200 });
//   } catch (err) {
//     console.error(err);
//   }
// });

// [54, 108, 113, 336, 373, 476, 481, 542]
// 长    倒   得   老   面    省   实在  头

// router.post("/addpinyin", async (req, res) => {
//   // const ans = await Dictionary.find({ pinyin: " -" }).limit(500);

//   // const arr = ans.map((x) => x.chinese);
//   // console.log(arr);
//   const promises = arr.map((word) => mdbg.get(word).catch((e) => word));
//   const resArr = await Promise.all(promises);

//   res.json(resArr);
// });

/**
 * @method  PUT
 * @route   api/dictionary/updateWord
 * @desc    update translation or pinyin for a word
 * @access  Private
 */
router.put('/updateWord', auth, updateWord);

/**
 * @method  PUT
 * @desc    roll back using previous content of a word
 * @route   api/dictionary/rollbackUpdate?wordId...&prevInd=
 * @access  Private
 */
router.put('/rollbackUpdate', auth, rollbackUpdate);

module.exports = router;
