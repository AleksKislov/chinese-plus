const User = require('../../models/User');
const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const googleStrategy = {
  strategyOptions: {
    clientID: process.env.AUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    callbackURL: `/api/auth/google/redirect`,
  },
  verify: async (accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    try {
      const user = await User.findOne({
        $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
      }).select('-password');

      if (user && user.googleId) {
        done(null, user);
      } else if (user && user.email) {
        // set googleId
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          {
            $set: { googleId: profile.id },
          },
          { new: true },
        ).select('-password');
        done(null, updatedUser);
      } else {
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(uuid.v4(), salt);

        await newUser.save();
        done(null, newUser);
      }
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = { googleStrategy };
