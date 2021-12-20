const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { googleStrategy } = require("./strategies");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(new GoogleStrategy(googleStrategy.strategyOptions, googleStrategy.verify));

module.exports = passport;
