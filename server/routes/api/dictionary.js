const express = require('express');
const router = express.Router();
const Hanzi = require('./dict/dictionary');
const mdbg = require('mdbg');
const nodejieba = require('nodejieba');
const { getAllWords, getWordsForParag } = require('./services');
const auth = require('../../middleware/auth');
const moderatorAuth = require('../../middleware/moderator-auth');
const { cacheRoute, TTL } = require('../../src/cache');

const Dictionary = require('../../src/models/Dictionary');
const { attachSenses } = require('../../src/api/services/dictionary/translations/attach-senses');
const { normalizeRu } = require('../../src/api/services/dictionary/translations/ru-search-terms');
const DictionaryTranslation = require('../../src/models/DictionaryTranslation');

const {
  updateWord,
  getEditedWords,
  wildcardSearch,
  pinyinSearch,
  handwritingSearch,
  getSitemapWords,
  getTranslation,
  getWordForEdit,
  editWord,
  deleteWordTranslation,
  addWord,
  rollbackWord,
} = require('../../src/api/services/dictionary');

const RU_SEARCH_LIMIT = 100;

/**
 * @route     GET api/dictionary?word=...
 * @desc      get chinese word from dictionary; a russian word is looked up in the glosses
 *            of the parsed translations (ruTerms)
 * @access    Public
 */
router.get('/', async (req, res) => {
  const word = req.query.word;
  let re, lexicon;

  try {
    if (word.match(/[\wа-я]+/gi)) {
      const found = await DictionaryTranslation.find({ ruTerms: normalizeRu(word) }, { wordId: 1 })
        .limit(RU_SEARCH_LIMIT)
        .lean();
      lexicon = await attachSenses(
        await Dictionary.find({ _id: { $in: found.map((t) => t.wordId) } })
          .select('-russian')
          .lean(),
      );
    } else {
      re = new RegExp('^(' + word + ')');
      lexicon = await attachSenses(
        await Dictionary.find({ chinese: { $regex: re, $options: 'i' } })
          .select('-russian')
          .lean(),
      );
    }

    res.json(lexicon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route     GET api/dictionary/editedWords
 * @desc      get words edited by admins and moderators (their history: dictionaryrevisions)
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
 * @route     GET api/dictionary/allwords
 * @desc      Get all the words in a text
 * @access    Public
 */
router.post('/allwords', async (req, res) => {
  try {
    res.json(await attachSenses(await getAllWords(req.body).lean()));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

/**
 * @route     GET api/dictionary/sitemap-words
 * @desc      HSK words that have a dictionary entry, for sitemap-dictionary.xml
 * @access    Public
 */
router.get('/sitemap-words', cacheRoute('dictionary-sitemap', { ttl: TTL.DAY }), getSitemapWords);

/**
 * @route     GET api/dictionary/translation/:wordId?examples=true
 * @desc      Parsed translation of a word (dictionarytranslations), with its examples when asked
 * @access    Public
 */
router.get('/translation/:wordId', getTranslation);

/**
 * @route     POST api/dictionary/wildcardSearch
 * @desc      Find chinese words of a fixed length matching a pattern, "?" as a single-char wildcard
 * @access    Public
 */
router.post('/wildcardSearch', wildcardSearch);

/**
 * @route     POST api/dictionary/pinyinSearch
 * @desc      Find chinese words by (accent-free) pinyin, matched against cleanPinyin
 * @access    Public
 */
router.post('/pinyinSearch', pinyinSearch);

/**
 * @route     POST api/dictionary/handwritingSearch
 * @desc      Recognize hand-drawn strokes into candidate chinese characters
 *            (proxies Google's unofficial handwriting input API)
 * @access    Public
 */
router.post('/handwritingSearch', handwritingSearch);

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
    const promises = req.body.map((arr) => getAllWords(arr).lean());
    const segmentedSubs = await Promise.all(promises);
    await attachSenses(segmentedSubs.flat());
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
      lexicon = await DictionaryTranslation.countDocuments({ lang: 'en' });
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

const SEGMENTER_VERSIONS = {
  default: Hanzi.segment.bind(Hanzi),
  v2: Hanzi.segmentFromEnd.bind(Hanzi),
  v3: nodejieba.cut,
};

/**
 * @route     GET api/dictionary/segmenter
 * @desc      GET all words from text SEGMENTED
 * @access    Public
 */
router.post('/segmenter', (req, res) => {
  const { version } = req.query;
  const text = req.body.text;
  const segmenter = SEGMENTER_VERSIONS[version] || SEGMENTER_VERSIONS.default;
  const chineseArr = segmenter(text).filter((word) => word !== ' ');
  res.send(chineseArr);
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
 * @desc    update pinyin of a word
 * @access  Admin, moderator
 */
router.put('/updateWord', moderatorAuth, updateWord);

/**
 * @route   GET api/dictionary/word/:id/edit
 * @desc    word, its translation in the editor shape and its edit history
 * @access  Admin, moderator
 */
router.get('/word/:id/edit', moderatorAuth, getWordForEdit);

/**
 * @route   POST api/dictionary/word
 * @desc    add a word with its translation and examples
 * @access  Admin, moderator
 */
router.post('/word', moderatorAuth, addWord);

/**
 * @route   PUT api/dictionary/word/:id
 * @desc    save pinyin, trad. chinese and the translation (with examples) in one language
 * @access  Admin, moderator
 */
router.put('/word/:id', moderatorAuth, editWord);

/**
 * @route   DELETE api/dictionary/word/:id/translation/:lang?updatedAt=
 * @desc    delete the word's translation in one language (not its only one)
 * @access  Admin, moderator
 */
router.delete('/word/:id/translation/:lang', moderatorAuth, deleteWordTranslation);

/**
 * @route   PUT api/dictionary/word/:id/rollback/:revisionId
 * @desc    restore the word as it was before a revision
 * @access  Admin, moderator
 */
router.put('/word/:id/rollback/:revisionId', moderatorAuth, rollbackWord);

module.exports = router;
