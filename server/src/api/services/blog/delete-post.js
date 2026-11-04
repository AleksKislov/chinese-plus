const BlogPost = require('../../../models/BlogPost');

async function deletePost(req, res) {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.json({ msg: 'done' });

  const isAdmin = req.user.id === process.env.ADMIN_ID;
  const isOwner = post.user.toString() === req.user.id;
  if (!isOwner && !isAdmin) return res.status(403).json({ msg: 'Not authorized' });

  await BlogPost.deleteOne({ _id: req.params.id });
  return res.json({ msg: 'done' });
}

module.exports = { deletePost };
