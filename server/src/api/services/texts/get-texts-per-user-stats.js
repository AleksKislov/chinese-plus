const Text = require("../../../models/Text");
const { shortUserInfoFields } = require("../../consts");

const ReputationValueMap = {
  pressedLike: 1,
  leftComment: 4,
  leftFeedback: 5,
  gotLike: 6,
  publishedText: 10,
  publishedVideo: 15, // use when can publish videos
};

/**
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<TextPerUserInfo[]>} sorted array
 */
async function getTextsPerUserStats(req, res) {
  const authors = (
    await Text.find({ isApproved: 1 }).select("user -_id").populate("user", shortUserInfoFields)
  ).filter((text) => text.user.name !== "admin");

  console.log(authors[0]);
  let result = {};
  for (let i = 0; i < authors.length; i++) {
    if (result[authors[i].user._id]) {
      result[authors[i].user._id].num++;
    } else {
      result[authors[i].user._id] = {
        _id: authors[i].user._id,
        name: authors[i].user.name,
        newAvatar: authors[i].user.newAvatar,
        num: 1,
      };
    }
  }

  const sorted = Object.values(result).sort((a, b) => b.num - a.num);

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
