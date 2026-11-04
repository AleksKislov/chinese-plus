const User = require('../../../models/User');

// legacy ADMIN_ID env var is still the primary super-admin identity;
// `role` on the user document is what grants moderator (and newer admin) access
async function getUserPrivileges(userId) {
  if (userId === process.env.ADMIN_ID) return { isAdmin: true, isModerator: false };

  const user = await User.findById(userId).select('role');
  return {
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator',
  };
}

module.exports = { getUserPrivileges };
