const Text = require("../../../models/Text");
const CommentType = require("../../../models/CommentType");

async function deleteComment(req, res) {
  const post = await Text.findById(req.params.id);
  const comment = await CommentType.findById(req.params.comment_id);
  post.comments_id = post.comments_id.filter((comment) => comment.id !== req.params.comment_id);
  await post.save();
  await comment.remove();
  return res.json(post.comments_id);
}

module.exports = { deleteComment };
