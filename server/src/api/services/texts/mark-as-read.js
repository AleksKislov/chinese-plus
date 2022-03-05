const User = require("../../../models/User");

async function markAsRead(req, res) {
  const user_id = req.user.id;
  const text_id = req.params.id;

  const updatedUser = await User.findByIdAndUpdate(
    user_id,
    {
      $addToSet: { finished_texts: text_id },
    },
    { new: true }
  ).select("-password");

  return res.json(updatedUser);
}

module.exports = { markAsRead };
