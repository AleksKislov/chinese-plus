const BlogPost = require('../../../models/BlogPost');
const User = require('../../../models/User');

async function likePost(req, res) {
  const user = await User.findById(req.user.id);
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ msg: 'Blog post not found' });

  if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
    post.likes = post.likes.filter((like) => like.user.toString() !== req.user.id);
  } else {
    post.likes.unshift({ user: req.user.id, name: user.name });
  }

  await post.save();
  return res.json(post.likes);
}

module.exports = { likePost };
