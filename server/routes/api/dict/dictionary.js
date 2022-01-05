// const {redis} = require('../services/redisClient')
// const definitionLookup = word => redis.exists(word);
const {LongestMatchSegmenter} = require("./segmenter.js");
let HANZI_DICT = {};
const checkIfWordExists = word => HANZI_DICT[word];
const segmenter = new LongestMatchSegmenter(checkIfWordExists);


/**
 * @param {Array<{_id: string}>} arr 
 */
function fillDict(arr) {
  for (let i = 0; i < arr.length; i++) {
    if(arr[i] && arr[i]._id) HANZI_DICT[arr[i]._id] = 1;
  }
}

exports.fillDict = fillDict;
exports.segment = segmenter.segment.bind(segmenter);
