const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../../src/models/Profile");
const User = require("../../src/models/User");

// @route   GET api/profile/me
// @desc    Get my profile
// access   Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", [
      "name",
      "avatar"
    ]);

    if (!profile) return res.status(400).json({ msg: "There is no profile for this user" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/profile
// @desc    Create or update profile
// access   Private
router.post("/", auth, async (req, res) => {
  const { website, hsk_level, location, fav_char, bio, why_learn, wechat } = req.body;

  // Build profile object
  const profileFields = {};

  profileFields.user = req.user.id;
  if (website) profileFields.website = website;
  if (hsk_level) profileFields.hsk_level = hsk_level;
  if (location) profileFields.location = location;
  if (fav_char) profileFields.fav_char = fav_char;
  if (bio) profileFields.bio = bio;
  if (why_learn) profileFields.why_learn = why_learn;
  if (wechat) profileFields.wechat = wechat;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        {
          $set: profileFields
        },
        { new: true }
      );

      return res.json(profile);
    } else {
      //Create
      profile = new Profile(profileFields);

      await profile.save();

      return res.json(profile);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/profile
// @desc    Get all profiles
// access   Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get one user profile
// access   Public
router.get("/user/:user_id", async (req, res) => {
  try {
    // const profile = await Profile.find({ user: req.params.user_id }).populate("user", [
    //   "name",
    //   "avatar"
    // ]);
    const profile = await User.findById(req.params.user_id).select("name avatar _id role");

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);

    if (err.kind == "ObjectId") return res.status(400).json({ msg: "Profile not found" });
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/profile/user/:user_id
// @desc    Delete profile, user and posts
// access   Private
router.delete("/", auth, async (req, res) => {
  try {
    // @todo - remove user posts

    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // remove profile
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);

    if (err.kind == "ObjectId") return res.status(400).json({ msg: "Profile not found" });
    res.status(500).send("Server error");
  }
});

module.exports = router;
