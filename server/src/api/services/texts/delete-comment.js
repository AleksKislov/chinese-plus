const Text = require("../../../models/Text");
const Comment = require("../../../models/Comment");

async function deleteComment(req, res) {
  const post = await Text.findById(req.params.id);
  const comment = await Comment.findById(req.params.comment_id);
  post.comments_id = post.comments_id.filter((comment) => comment.id !== req.params.comment_id);
  await post.save();
  await comment.remove();
  return res.json(post.comments_id);
}

module.exports = { deleteComment };
