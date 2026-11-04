const Video = require('../../../models/Video');
const Comment = require('../../../models/Comment');
const { invalidateTag } = require('../../../cache');

async function deleteComment(req, res) {
  const post = await Video.findById(req.params.id);
  const comment = await Comment.findById(req.params.comment_id);
  post.comments_id = post.comments_id.filter((comment) => comment.id !== req.params.comment_id);
  await post.save();
  await comment.deleteOne();

  invalidateTag('comments');

  return res.json(post.comments_id);
}

module.exports = { deleteComment };
