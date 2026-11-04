const jwt = require('jsonwebtoken');
const User = require('../src/models/User');

const isDevelopment = process.env.NODE_ENV === 'development';

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
      req.user = user;
      return next();
    }

    const dbUser = await User.findById(user.id).select('role');
    if (!dbUser || dbUser.role !== 'admin') throw new Error('Not admin!');

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
