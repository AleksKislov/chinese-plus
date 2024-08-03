const { LongestMatchSegmenter } = require('./segmenter.js');
const HANZI_DICT = {};
const checkIfWordExists = (word) => HANZI_DICT[word];
const segmenter = new LongestMatchSegmenter(checkIfWordExists);

/**
 * @description load all chinese words in memory into HANZI_DICT{word: 1}
 * @param {{_id: string}[]} arr
 */
function fillDict(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]?._id) HANZI_DICT[[arr[i]._id]] = 1;
  }
}

setTimeout(async () => {
  try {
    fillDict(await Dictionary.aggregate([{ $group: { _id: '$chinese' } }]));
  } catch (err) {
    console.log(err);
  }

  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}, 100);

module.exports = segmenter;
