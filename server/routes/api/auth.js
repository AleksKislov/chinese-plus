const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { passport } = require("../../src/auth");

const User = require("../../src/models/User");

function encodeJWT(id) {
  return new Promise((resolve, reject) => {
    jwt.sign({ user: { id } }, process.env.JWT_SECRET, { expiresIn: "30d" }, (err, token) => {
      if (err) return reject(err);
      else return resolve(token);
    });
  });
}

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
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { password, email } = req.body;

    try {
      // User exists?
      let user = await User.findOne({ email });

      if (!user) return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });

      const token = await encodeJWT(user._id);
      res.json({ token });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

/**
 * @route   GET api/auth/google/redirect
 */
router.get("/google/redirect", passport.authenticate("google"), async (req, res) => {
  // res.send(req.user);
  try {
    const token = await encodeJWT(req.user._id);
    res.redirect(`${process.env.BASE_URL}/login_success/${token}`);
  } catch (err) {
    res.status(500).send("Server error", err.message);
  }
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
    scope: ["profile", "email"],
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.send(req.user);
});

module.exports = router;
