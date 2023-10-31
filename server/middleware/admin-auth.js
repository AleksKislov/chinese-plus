const jwt = require("jsonwebtoken");
const { isDevelopment } = require("../server");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (isDevelopment) {
    req.user = { id: process.env.SNUM23_ID };
    return next();
  }

  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    if (user.id !== process.env.ADMIN_ID) throw new Error("Not admin!");
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
