const Text = require("../../../models/Text");
const User = require("../../../models/User");

async function likeText(req, res) {
  const user = await User.findById(req.user.id);
  const post = await Text.findById(req.params.id);

  // check if already liked
  if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
    // return res.status(400).json({ msg: "Уже поставили лайк" });
    post.likes = post.likes.filter((like) => like.user.toString() !== req.user.id);
  } else {
    post.likes.unshift({ user: req.user.id, name: user.name });
  }

  await post.save();
  return res.json(post.likes);
}

module.exports = { likeText };
