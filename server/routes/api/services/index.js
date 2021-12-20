const { notifyMe } = require("./notifyMe");
const { updateOrCreate, fetchReading } = require("./updateOrCreate");
const { translateText } = require("./translateText");
const { translateRuText } = require("./translateRuText");
// const { redisClient } = require("./redisClient");
const { getAllWords } = require("./getAllWords");
const { segmentText } = require("./segmentText");

module.exports = {
  segmentText,
  getAllWords,
  notifyMe,
  updateOrCreate,
  fetchReading,
  translateText,
  translateRuText,
  // redisClient
};
