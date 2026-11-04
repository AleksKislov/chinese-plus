const { LongestMatchSegmenter } = require('./segmenter.js');
const { logger } = require('../../../src/logger');
const HANZI_DICT = {};
const checkIfWordExists = (word) => HANZI_DICT[word];
const Dictionary = require('../../../src/models/Dictionary');
const { MAX_CN_WORD_LEN } = require('./constants.js');
const segmenter = new LongestMatchSegmenter(checkIfWordExists);

/**
 * @description load all chinese words in memory into HANZI_DICT
 * @param {{_id: string}[]} arr
 */
function fillDict(arr) {
  for (let i = 0; i < arr.length; i++) {
    const word = arr[i]?._id;
    if (word) {
      HANZI_DICT[word] = 1;
    }
  }
}

setTimeout(async () => {
  try {
    fillDict(
      await Dictionary.aggregate([
        {
          $match: {
            chinese: { $type: 'string' },
            $expr: { $lte: [{ $strLenCP: '$chinese' }, MAX_CN_WORD_LEN] },
          },
        },
        { $group: { _id: '$chinese' } },
      ]),
    );
  } catch (err) {
    logger.error({ err }, 'Failed to load HANZI_DICT');
  }

  const toMb = (bytes) => Math.round((bytes / 1024 / 1024) * 100) / 100;
  const { heapUsed, rss } = process.memoryUsage();
  logger.info({ heapUsedMb: toMb(heapUsed), rssMb: toMb(rss) }, 'Dictionary loaded into memory');
}, 100);

module.exports = segmenter;
