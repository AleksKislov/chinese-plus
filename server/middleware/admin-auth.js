const jwt = require("jsonwebtoken");

// const isDevMode = process.env.NODE_ENV === "development";

module.exports = function (req, res, next) {
  // get token from header
  const token = req.header("x-auth-token");

  // if (isDevMode) {
  //   req.user = { id: process.env.SNUM23_ID };
  //   return next();
  // }

  // check if no token
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  // verify token
  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    if (user.id !== process.env.ADMIN_ID) throw new Error("No!");
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
