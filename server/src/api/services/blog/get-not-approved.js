const BlogPost = require('../../../models/BlogPost');
const { shortUserInfoFields } = require('../../consts');

async function getNotApproved(req, res) {
  const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0;

  const posts = await BlogPost.find({ isApproved: { $ne: 1 } }, undefined, {
    skip,
    limit: 10,
  })
    .sort({ date: -1 })
    .populate('user', shortUserInfoFields);

  return res.json(posts);
}

module.exports = { getNotApproved };
