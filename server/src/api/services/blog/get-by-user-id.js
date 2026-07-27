const mongoose = require('mongoose');
const BlogPost = require('../../../models/BlogPost');

async function getByUserId(req, res) {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    return res.json([]);
  }

  const posts = await BlogPost.find({ user: req.params.userId })
    .sort({ date: -1 })
    .select('title categoryInd likes hits _id comments_id date isApproved mainPicUrl');

  return res.json(posts);
}

module.exports = { getByUserId };
