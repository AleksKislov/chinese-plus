const mongoose = require('mongoose');
const BlogPost = require('../../../models/BlogPost');
const { shortUserInfoFields } = require('../../consts');
const { shouldCountHit } = require('../../../hits');

async function getById(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ msg: 'Blog post not found' });
  }

  const countHit = shouldCountHit('blog', req.params.id, req.query.vid);

  const post = countHit
    ? await BlogPost.findByIdAndUpdate(
        req.params.id,
        { $inc: { hits: 1 } },
        { new: true },
      ).populate('user', shortUserInfoFields)
    : await BlogPost.findById(req.params.id).populate('user', shortUserInfoFields);

  if (!post) return res.status(404).json({ msg: 'Blog post not found' });

  return res.json(post);
}

module.exports = { getById };
