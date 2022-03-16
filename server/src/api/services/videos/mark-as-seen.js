const User = require("../../../models/User");

async function markAsSeen(req, res) {
  const userId = req.user.id;
  const videoId = req.params.id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { seenVideos: videoId },
    },
    { new: true }
  ).select("-password");

  return res.json(updatedUser);
}

module.exports = { markAsSeen };
