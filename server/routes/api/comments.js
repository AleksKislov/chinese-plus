const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../../src/models/User");
const Comment = require("../../src/models/Comment");
const Post = require("../../src/models/Post");
const Text = require("../../src/models/Text");
const Video = require("../../src/models/Video");
const Chapterpage = require("../../src/models/Chapterpage");
const { notifyMe } = require("../../src/api/services/_misc");

// @route   POST api/comments?where=...&id=
// @desc    Create a comment
// access   Private
router.post("/", [auth, [check("text", "Нужен текст").not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const where = req.query.where;
  const id = req.query.id;
  const { path, addressees, commentIdToReply } = req.body;

  let addressees_id;
  if (addressees) {
    addressees_id = addressees.map((x) => {
      return { id: x.id, seenIt: false };
    });
  }

  if (commentIdToReply) {
    const includesUserId = addressees_id.filter((x) => x.id === commentIdToReply.userId);
    if (includesUserId.length === 0)
      addressees_id.push({ id: commentIdToReply.userId, seenIt: false });
  }

  let destination; // where the comment goes

  try {
    const user = await User.findById(req.user.id).select("-password");

    if (where === "post") destination = await Post.findById(id);
    if (where === "text") destination = await Text.findById(id);
    if (where === "video") destination = await Video.findById(id);
    if (where === "book") destination = await Chapterpage.findById(id);

    const newComment = new Comment({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
      post_id: id,
      destination: where,
      addressees: addressees_id,
      commentIdToReply,
      path,
    });

    const comment = await newComment.save();
    destination.comments_id.unshift(comment._id);
    await destination.save();

    if (user.name !== "admin") {
      notifyMe(`New comment from ${user.name} in /${where}s: ${req.body.text}`);
    }

    res.json(destination.comments_id);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/edit", auth, async (req, res) => {
  const { text, id } = req.body;
  try {
    await Comment.findByIdAndUpdate(id, { $set: { text } }, { new: true });

    res.json({ status: "OK 200" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/to_me/:seen_it", auth, async (req, res) => {
  const { seen_it } = req.params;

  let comments;
  try {
    if (seen_it === "false") {
      // comments = await Comment.find({
      //   "addressees.id": req.user.id,
      //   "addressees.seenIt": false
      // }).sort({ date: -1 });
      comments = await Comment.find({
        addressees: { $elemMatch: { id: req.user.id, seenIt: false } },
      }).sort({ date: -1 });
    } else {
      comments = await Comment.find({
        "addressees.id": req.user.id,
        "addressees.seenIt": true,
      })
        .sort({ date: -1 })
        .limit(30);
    }

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// @route   GET api/comments?where=...&id=
// @desc    Get all comments
// access   Public
router.get("/", async (req, res) => {
  const where = req.query.where;
  const id = req.query.id;

  try {
    let destination;
    if (where === "post") destination = await Post.findById(id);
    if (where === "text") destination = await Text.findById(id);
    if (where === "book") destination = await Chapterpage.findById(id);

    const comments = await Comment.find({
      _id: { $in: destination.comments_id },
    }).sort({ date: 1 });

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 *  @route    PUT api/comments/like/:id
 *  @desc     Like a comment
 *  @access   Private
 */
router.put("/like/:id", auth, async (req, res) => {
  try {
    const userName = await User.findById(req.user.id);
    const post = await Comment.findById(req.params.id);

    // check if already liked
    if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
      // return res.status(400).json({ msg: "Уже поставили лайк" });
      post.likes = post.likes.filter((like) => like.user.toString() !== req.user.id);
    } else {
      post.likes.unshift({ user: req.user.id, name: userName.name });
    }

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * @route     GET api/comments/all
 * @desc      Get last 10 comments
 * @access    Public
 */
router.get("/last", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ date: -1 }).limit(10);

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/mark_mentions_as_seen", auth, async (req, res) => {
  try {
    await Comment.updateMany(
      { "addressees.id": req.user.id },
      { "addressees.$.seenIt": true },
      { new: true }
    );
    res.send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
