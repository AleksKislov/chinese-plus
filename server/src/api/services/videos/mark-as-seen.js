const User = require("../../../models/User");

async function markAsSeen(req, res) {
  let mongoMethod = "$addToSet";
  if (req.path.includes("unmark")) mongoMethod = "$pull";

  const userId = req.user.id;
  const videoId = req.params.id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { [mongoMethod]: { seenVideos: videoId } },
    { new: true }
  ).select("-password");

  return res.json(updatedUser);
}

module.exports = { markAsSeen };
