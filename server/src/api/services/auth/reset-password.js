const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../../models/User");

async function resetPassword(req, res) {
  const { password, token } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded?.user?.id;

  if (!userId) return res.status(400).json({ error: "No user id provided" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { password: hashedPassword } },
    { new: true }
  );

  if (!user) return res.status(404).json({ error: "No user found" });

  res.json({ msg: "Password has been changed successfully" });
}

module.exports = { resetPassword };
