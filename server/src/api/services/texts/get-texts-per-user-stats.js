const Text = require("../../../models/Text");

/**
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<TextPerUserInfo[]>} sorted array
 */
async function getTextsPerUserStats(req, res) {
  const texts = await Text.find().sort({ date: -1 }).select("user name length");
  let result = {};

  for (let i = 0; i < texts.length; i++) {
    if (result[texts[i].user]) {
      result[texts[i].user].num++;
      result[texts[i].user].length += texts[i].length;
    } else {
      result[texts[i].user] = new TextPerUserInfo(1, texts[i]);
    }
  }

  const sorted = Object.values(result).sort((a, b) =>
    b.num - a.num === 0 ? b.length - a.length : b.num - a.num
  );

  return res.json(sorted);
}

class TextPerUserInfo {
  constructor(num, { name, userid, length }) {
    this.num = num; // quantity of texts published by user
    this.name = name;
    this.userid = userid;
    this.length = length;
  }
}

module.exports = { getTextsPerUserStats };
