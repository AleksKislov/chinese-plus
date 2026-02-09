const express = require('express');
const router = express.Router();

const Textbook = require('../../src/models/Textbook');
const { getAllWords, shortenTranslation } = require('./services');

/**
 * @route     GET api/textbooks
 * @desc      get all levels and topics from textbooks
 * @access    Public
 */
router.get('/', async (req, res) => {
  const { lvl } = req.query;
  try {
    if (lvl) {
      const response = await Textbook.find({ level: lvl })
        .select('level ind topic content')
        .sort({ ind: 1 })
        .lean();

      const allChineseWords = {};
      for (const topic of response) {
        for (const contentItem of topic.content) {
          for (const example of contentItem.examples) {
            for (const cnWord of example.cn) {
              allChineseWords[cnWord] = 1;
            }
          }
        }
      }

      // shorten translations for tooltips
      const allChineseForTooltips = await getAllWords(Object.keys(allChineseWords));
      for (let i = 0; i < allChineseForTooltips.length; i++) {
        allChineseForTooltips[i].russian = shortenTranslation(allChineseForTooltips[i].russian);
      }

      // attach tooltips data to examples
      for (const topic of response) {
        for (const contentItem of topic.content) {
          for (const example of contentItem.examples) {
            const tooltips = [];
            for (const cnWord of example.cn) {
              const wordData = allChineseForTooltips.find((w) => w.chinese === cnWord);
              if (wordData) {
                tooltips.push(wordData);
              } else {
                tooltips.push(cnWord);
              }
            }
            example.cn = tooltips;
          }
        }
      }

      return res.json(response);
    } else {
      const result = await Textbook.find({}).select('level ind').sort({ level: 1 });
      const allLevels = {};
      for (const item of result) {
        if (!allLevels[item.level]) {
          allLevels[item.level] = 1;
        } else {
          allLevels[item.level]++;
        }
      }
      return res.json(allLevels);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// for local usage
// function pinyinToAscii(s) {
//   return s
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '')
//     .replace(/ü/g, 'u')
//     .replace("'", '')
//     .replace(',', '');
// }

// router.post('/new', async (req, res) => {
//   const { level, all } = req.body;

//   const promises = [];
//   for (let i = 0; i < all.length; i++) {
//     const item = all[i];

//     item.ind = i;
//     item.level = level;
//     item.content.map((contentItem) => {
//       contentItem.examples = contentItem.examples.map((example) => {
//         example.audio = pinyinToAscii(example.py.split(' ').join(''));
//         return example;
//       });
//       return contentItem;
//     });
//     promises.push(item);
//   }

//   try {
//     await Textbook.insertMany(promises);
//     res.json({ msg: 'Textbooks added' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

module.exports = router;
