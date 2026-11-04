const jwt = require('jsonwebtoken');
const User = require('../src/models/User');

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Never blocks the request - only annotates req.isAdmin so a route can serve
 * different content to admins vs everyone else from the same endpoint (e.g.
 * unapproved HSK exams). Contrast with admin-auth.js, which rejects non-admins.
 */
module.exports = async function (req, res, next) {
  req.isAdmin = false;

  if (isDevelopment) {
    req.isAdmin = true; // matches admin-auth.js's dev bypass
    return next();
  }

  const token = req.header('x-auth-token');
  if (!token) return next();

  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);

    if (user.id === process.env.ADMIN_ID) {
      req.isAdmin = true;
      return next();
    }

    const dbUser = await User.findById(user.id).select('role');
    req.isAdmin = Boolean(dbUser && dbUser.role === 'admin');
  } catch (err) {
    req.isAdmin = false;
  }

  next();
};
