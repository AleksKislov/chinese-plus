const Text = require('../../../models/Text');
const Video = require('../../../models/Video');
const Donate = require('../../../models/Donate');
const { shortUserInfoFields } = require('../../consts');

// @todo
// const ReputationValueMap = {
//   pressedLike: 1,
//   leftComment: 4,
//   leftFeedback: 5,
//   gotLike: 6,
//   publishedText: 10,
//   publishedVideo: 15, // use when can publish videos
// };

/**
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<[]>} sorted array
 */
async function getTextsPerUserStats(req, res) {
  const [texts, videos, allDonates] = await Promise.all([
    Text.find({ isApproved: 1 }).select('user -_id').populate('user', shortUserInfoFields),
    Video.find({ isApproved: 1 }).select('user -_id').populate('user', shortUserInfoFields),
    Donate.find({ userId: { $ne: null } })
      .select('userId -_id')
      .populate('userId', shortUserInfoFields),
  ]);
  const withoutAdmin = (x) => x.user.name !== 'admin';
  const textsAuthors = texts.filter(withoutAdmin);
  const videoAuthors = videos.filter(withoutAdmin);
  const donates = allDonates.filter((x) => x.userId);

  let result = {};
  for (let i = 0; i < textsAuthors.length; i++) {
    if (result[textsAuthors[i].user._id]) {
      result[textsAuthors[i].user._id].texts++;
    } else {
      result[textsAuthors[i].user._id] = {
        userId: textsAuthors[i].user._id,
        name: textsAuthors[i].user.name,
        newAvatar: textsAuthors[i].user.newAvatar,
        texts: 1,
        videos: 0,
        donates: 0,
      };
    }
  }

  for (let i = 0; i < videoAuthors.length; i++) {
    if (result[videoAuthors[i].user._id]) {
      result[videoAuthors[i].user._id].videos++;
    } else {
      result[videoAuthors[i].user._id] = {
        userId: videoAuthors[i].user._id,
        name: videoAuthors[i].user.name,
        newAvatar: videoAuthors[i].user.newAvatar,
        texts: 0,
        videos: 1,
        donates: 0,
      };
    }
  }

  for (let i = 0; i < donates.length; i++) {
    if (result[donates[i].userId._id]) {
      result[donates[i].userId._id].donates++;
    } else {
      result[donates[i].userId._id] = {
        userId: donates[i].userId._id,
        name: donates[i].userId.name,
        newAvatar: donates[i].userId.newAvatar,
        texts: 0,
        videos: 0,
        donates: 1,
      };
    }
  }

  return res.json(Object.values(result).sort((a, b) => b.texts - a.texts));
}

module.exports = { getTextsPerUserStats };
