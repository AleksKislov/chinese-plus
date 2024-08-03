const Video = require('../../../models/Video');
const { shortUserInfoFields } = require('../../consts');

async function getVidsInChunks(req, res) {
  const { skip, category } = req.query;
  const validCategory = category && category !== 'undefined';
  const searchQuery = validCategory ? { isApproved: 1, category } : { isApproved: 1 };
  const skipNum = skip && /^\d+$/.test(skip) ? Number(skip) : 0;
  const texts = await Video.find(searchQuery, undefined, {
    skip: skipNum,
    limit: 10,
  })
    .sort({ date: -1 })
    .select('-cnSubs -ruSubs -pySubs -chineseArr')
    .populate('user', shortUserInfoFields);

  return res.json(texts);
}

module.exports = { getVidsInChunks };
