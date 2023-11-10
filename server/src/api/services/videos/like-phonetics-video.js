const VideoLesson = require("../../../models/VideoLesson");
const User = require("../../../models/User");

async function likeVideoLesson(req, res) {
  const userName = await User.findById(req.user.id);
  const post = await VideoLesson.findById(req.params.id);

  // check if already liked
  if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
    post.likes = post.likes.filter((like) => like.user.toString() !== req.user.id);
  } else {
    post.likes.unshift({ user: req.user.id, name: userName.name });
  }

  await post.save();
  return res.json(post.likes);
}

module.exports = { likeVideoLesson };
