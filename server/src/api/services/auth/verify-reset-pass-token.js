const jwt = require("jsonwebtoken");

async function verifyResetPassToken(req, res) {
  const { token } = req.body;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded?.user?.id;

  if (!userId) return res.status(400).json({ error: "Token not valid" });

  res.json({ msg: "OK" });
}

module.exports = { verifyResetPassToken };
