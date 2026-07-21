const BlogPost = require('../../../models/BlogPost');
const { shortUserInfoFields } = require('../../consts');

async function getById(req, res) {
  const post = await BlogPost.findByIdAndUpdate(
    req.params.id,
    { $inc: { hits: 1 } },
    { new: true },
  ).populate('user', shortUserInfoFields);

  if (!post) return res.status(404).json({ msg: 'Blog post not found' });

  return res.json(post);
}

module.exports = { getById };
