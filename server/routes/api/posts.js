const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const { Notify } = require("../../src/api/services/_misc");

const User = require("../../src/models/User");
const Post = require("../../src/models/Post");
const Comment = require("../../src/models/Comment");
const { shortUserInfoFields } = require("../../src/api/consts");

// @route   POST api/posts
// @desc    Create a post
// access   Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Нужен текст").not().isEmpty(),
      check("title", "Нужен заголовок").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findById(req.user.id).select("-password");
      const { text, title, tag } = req.body;

      const newPost = new Post({
        text,
        title,
        tag,
        user: req.user.id,
      });

      const post = await newPost.save();
      if (user.name === "admin") {
        Notify.socialMedia(post);
      } else {
        Notify.admin(`New post from ${user.name} in /posts. Title: ${title}. Text: ${text}`);
      }

      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

/**
 * @route   GET api/posts/infinite?skip=...tag=...
 * @desc    Get posts using inifinite scroll by tag
 * @access  Public
 */
router.get("/infinite", async (req, res) => {
  const { skip, tag } = req.query;
  try {
    const searshQuery = tag ? { tag } : {};
    const skipNum = skip && /^\d+$/.test(skip) ? Number(skip) : 0;
    const posts = await Post.find(searshQuery, undefined, { skip: skipNum, limit: 5 })
      .populate("user", shortUserInfoFields)
      .select("-avatar -name")
      .sort({
        date: -1,
      });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// @route   GET api/posts/:id
// @desc    Get post by id
// access   Public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", shortUserInfoFields)
      .select("-avatar -name");
    if (!post) return res.status(404).json({ msg: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") return res.status(404).json({ msg: "Post not found" });

    res.status(500).send("Server error");
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete post by id
// access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    if (!post) return res.status(404).json({ msg: "Post not found" });

    await post.remove();

    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") return res.status(404).json({ msg: "Post not found" });

    res.status(500).send("Server error");
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment on a post
// access   Private
router.post(
  "/comment/:id",
  [auth, [check("text", "Text is requierd").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Delete a Comment of a post
// access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = await Comment.findById(req.params.comment_id);

    post.comments_id = post.comments_id.filter((comment) => comment.id !== req.params.comment_id);

    await post.save();
    await comment.remove();

    res.json(post.comments_id);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
