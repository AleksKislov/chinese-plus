const { notifyMe } = require("./notifyMe");
const { updateOrCreate, fetchReading } = require("./updateOrCreate");
const { translateText } = require("./translateText");
const { translateRuText } = require("./translateRuText");
const { getAllWords } = require("./getAllWords");
// const { redis } = require("./redisClient");

module.exports = {
  getAllWords,
  notifyMe,
  updateOrCreate,
  fetchReading,
  translateText,
  translateRuText,
  // redis
};
