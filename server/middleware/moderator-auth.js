const jwt = require('jsonwebtoken');
const { isDevelopment } = require('../server');
const User = require('../src/models/User');

module.exports = async function (req, res, next) {
  const token = req.header('x-auth-token');

  if (isDevelopment) {
    req.user = { id: process.env.DEV_USER_ID };
    return next();
  }

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);

    if (user.id === process.env.ADMIN_ID) {
      req.user = { id: user.id };
      return next();
    }

    const dbUser = await User.findById(user.id).select('role');
    if (!dbUser || !['admin', 'moderator'].includes(dbUser.role)) {
      throw new Error('Not authorized');
    }

    req.user = { id: user.id };
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
