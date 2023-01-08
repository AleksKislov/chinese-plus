const jwt = require("jsonwebtoken");

const isDevMode = process.env.NODE_ENV === "development";

module.exports = function (req, res, next) {
  // const token = req.header("x-auth-token");
  // const id = req.header("x-google-userid");

  const token = req.cookies["xtok"];

  if (isDevMode) {
    req.user = { id: process.env.SNUM23_ID };
    return next();
  }

  // if (id) {
  //   req.user = { id };
  //   return next();
  // }

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
