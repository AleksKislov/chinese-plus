const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
// const config = require("config");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { passport } = require("../../src/auth");

const sessionDays = 3;

const User = require("../../src/models/User");

// @route   GET api/auth
// @desc    Authenticate user
// access   Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/auth
// @desc    Authenticate user and get token
// access   Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { password, email } = req.body;

    try {
      // User exists?
      let user = await User.findOne({ email });

      if (!user) return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

      // return jwt
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        // config.get("jwtSecret"),
        process.env.JWT_SECRET,
        { expiresIn: 3600 * 24 * sessionDays },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 * @route   GET api/auth/google/redirect
 */
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  // res.send(req.user);
  res.redirect(`${process.env.BASE_URL}/login_success/${req.user._id}`);
});

router.post("/google_success", async (req, res) => {
  try {
    const user = await User.findById(req.body.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

/**
 * @route   GET api/auth/google
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.send(req.user);
});

module.exports = router;
