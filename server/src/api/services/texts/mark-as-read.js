const User = require('../../../models/User');

async function markAsRead(req, res) {
  const userId = req.user.id;
  const textId = req.params.id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { finished_texts: textId },
    },
    { new: true },
  ).select('-password');

  return res.json(updatedUser);
}

module.exports = { markAsRead };
