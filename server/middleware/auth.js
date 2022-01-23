const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // get token from header
  const token = req.header("x-auth-token");
  const id = req.header("x-google-userid");

  if (id) {
    req.user = { id };
    return next();
  }

  // check if no token
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  // for bot from botty
  if (token === process.env.BOTTY_TOKEN) {
    req.user = { id: process.env.BOTTY_ID }; // name == Botty
    return next();
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
