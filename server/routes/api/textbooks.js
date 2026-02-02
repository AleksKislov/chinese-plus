const express = require('express');
const router = express.Router();

const Textbook = require('../../src/models/Textbook');
const { getAllWords, shortenTranslation } = require('./services');

//  const words = await getAllWords(req.body);
//     if (isShortRu) {
//       for (let i = 0; i < words.length; i++) {
//         words[i].russian = shortenTranslation(words[i].russian);
//       }
//     }

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

module.exports = router;
