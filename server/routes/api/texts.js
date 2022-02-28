const router = require("express").Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");

const { createTxt, updateTxt } = require("../../src/api/services/texts");

const User = require("../../src/models/User");
const Text = require("../../src/models/Text");
const LongText = require("../../src/models/LongText");

/**
 * @method    POST
 * @route     api/texts/create
 * @desc      Create a text
 * @access    Private
 */
router.post(
  "/create",
  [
    auth,
    [
      check("origintext", "Нужен текст").not().isEmpty(),
      check("title", "Нужен заголовок").not().isEmpty(),
      check("level", "Нужно указать уровень").not().isEmpty(),
    ],
  ],
  createTxt
);

/**
 * @method    POST
 * @route     api/texts/update
 * @desc      Update a text
 * @access    Private
 */
router.post("/update", auth, updateTxt);

// @route   GET api/texts
// @desc    Get ALL the texts
// access   Public
router.get("/", async (req, res) => {
  try {
    const texts = await Text.find({ isApproved: 1 })
      .sort({ date: -1 })
      .select("date title level categoryInd likes hits user name _id comments_id");

    res.json(texts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * @return {object array} - sorted array
 * @example
 * [{ num: 16, name: "admin", userid: "5f301a8f0aa547478da68c18" },
 * { num: 9, name: "Aleksandr Kislov",userid: "5ee31c7847fd670ce93b83cc" },
 * { num: 7, name: "Sergei Guer", userid: "600728cd4c87149d9552bba7" }]
 */
router.get("/statistics", async (req, res) => {
  try {
    const texts = await Text.find().sort({ date: -1 }).select("user name length");

    let result = {};

    for (let i = 0; i < texts.length; i++) {
      if (result[texts[i].user]) {
        result[texts[i].user].num++;
        result[texts[i].user].length += texts[i].length;
      } else {
        result[texts[i].user] = {
          num: 1,
          name: texts[i].name,
          userid: texts[i].user,
          length: texts[i].length,
        };
      }
    }
    const sorted = Object.values(result).sort((a, b) =>
      b.num - a.num === 0 ? b.length - a.length : b.num - a.num
    );

    res.json(sorted);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/texts/comment/:id/:comment_id
// @desc    Delete a Comment of a text
// access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Text.findById(req.params.id);
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

/**
 * @method  GET
 * @route   api/texts/infinite?skip=...categoryInd=...
 * @desc    Get texts using inifinite scroll and category index
 * @access  Public
 */
router.get("/infinite", async (req, res) => {
  try {
    const { skip, categoryInd } = req.query;
    const searchQuery = categoryInd ? { isApproved: 1, categoryInd } : { isApproved: 1 };
    const skipNum = skip && /^\d+$/.test(skip) ? Number(skip) : 0;
    const texts = await Text.find(searchQuery, undefined, {
      skip: skipNum,
      limit: 10,
    })
      .sort({ date: -1 })
      .select("-origintext -translation -chinese_arr");

    res.json(texts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/not_approved", async (req, res) => {
  try {
    const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0;
    const shortTexts = await Text.find(
      { name: { $ne: "admin" }, isApproved: { $ne: 1 }, belongsToLongText: null },
      undefined,
      {
        skip,
        limit: 10,
      }
    )
      .sort({ date: -1 })
      .select("-origintext -translation -chinese_arr");

    const longTexts = await LongText.find({ isApproved: { $ne: 1 } }, undefined, {
      skip,
      limit: 10,
    }).sort({ date: -1 });

    const texts = [...shortTexts, ...longTexts].sort((a, b) => b.date - a.date);
    res.json(texts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 *  @route   GET api/texts/approved_num
 *  @desc    Get the number of approved texts
 *  @access  Public
 */
router.get("/approved_num", async (req, res) => {
  try {
    const allTexts = await Text.find().select("isApproved belongsToLongText");

    const approvedTexts = allTexts.filter((x) => x.isApproved);

    const total = allTexts.length;
    const approved = approvedTexts.length;
    const notApproved = total - approved;

    return res.json({ total, approved, notApproved });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") return res.status(404).json({ msg: "Post not found" });

    res.status(500).send("Server error");
  }
});

/**
 * @route   GET api/texts/id
 * @desc    Get the text by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const text = await Text.findByIdAndUpdate(req.params.id, { $inc: { hits: 1 } }, { new: true });

    if (!text) return res.status(404).json({ msg: "Text not found" });

    res.json(text);
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") return res.status(404).json({ msg: "Post not found" });

    res.status(500).send("Server error");
  }
});

/**
 * @route   GET api/texts/id
 * @desc    Get the text by ID
 * @access  Public
 */
router.get("/longtext/:id", async (req, res) => {
  try {
    const text = await LongText.findByIdAndUpdate(
      req.params.id,
      { $inc: { hits: 1 } },
      { new: true }
    );

    if (!text) return res.status(404).json({ msg: "Text not found" });

    res.json(text);
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") return res.status(404).json({ msg: "Post not found" });

    res.status(500).send("Server error");
  }
});

/**
 * @route   GET api/texts/user/userId
 * @desc    Get all the texts by user who published them
 * @access   Public
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const texts = await Text.find({ user: req.params.userId })
      .sort({ date: -1 })
      .select("title level categoryInd likes hits _id comments_id");
    res.json(texts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * @desc    Mark text as already read for the user
 */
router.post("/mark_finished_texts/:id", auth, async (req, res) => {
  const user_id = req.user.id;
  const text_id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        $addToSet: { finished_texts: text_id },
      },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.post("/unmark_finished_texts/:id", auth, async (req, res) => {
  const user_id = req.user.id;
  const text_id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      {
        $pull: { finished_texts: text_id },
      },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

/**
 *  @route    PUT api/texts/like/:id
 *  @desc     Like a text
 *  @access   Private
 */
router.put("/like/:id", auth, async (req, res) => {
  try {
    const userName = await User.findById(req.user.id);
    const post = await Text.findById(req.params.id);

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

// router.put("/update_likes", async (req, res) => {
//   const { textId } = req.body;
//   try {
//     const text = await Text.findById(textId);

//     const newFields = {};
//     if (text.likes && text.likes.length > 0) {
//       newFields.likes = text.likes.map(async like => {
//         const user = await User.findById(like.user).catch(e => console.log(e));
//         await Text.updateOne(
//           { _id: textId, "likes.user": like.user },
//           { $set: { "likes.$.name": user.name } }
//         );
//       });
//     }

//     res.json({ done: textId });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// router.get("/update_all/yes", async (req, res) => {
//   try {
//     const texts = await Text.updateMany({}, { categoryInd: 0 });

//     res.json({ ok: "ok" });
//   } catch (err) {
//     console.error(err);
//     if (err.kind === "ObjectId") return res.status(404).json({ msg: "Post not found" });

//     res.status(500).send("Server error");
//   }
// });

// /**
//  * @route     POST api/texts/post_longtext
//  * @desc      Create a long text
//  * @access    Private
//  */
// router.post(
//   "/post_longtext",
//   [
//     auth,
//     [
//       check("origintext", "Нужен текст").not().isEmpty(),
//       check("title", "Нужен заголовок").not().isEmpty(),
//       check("level", "Нужно указать уровень").not().isEmpty(),
//     ],
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
//     // console.log(req.body);

//     const user = req.user.id;

//     const {
//       origintext,
//       title,
//       description,
//       level,
//       tags,
//       translation,
//       length,
//       pic_url,
//       theme_word,
//       name,
//       categoryInd,
//       source,
//       // textId,
//       // isApproved,
//       chinese_arr,
//     } = req.body;

//     try {
//       const newLongText = new LongText({
//         theme_word,
//         pic_url,
//         title,
//         description,
//         level,
//         length,
//         tags,
//         name,
//         categoryInd,
//         source,
//         user,
//         // translation,
//         // chinese_arr,
//         // origintext,
//         // isApproved,
//       });

//       const longText = await newLongText.save();
//       const promises = [];

//       for (let i = 0; i < 2; i++) {
//         const page = new Text({
//           belongsToLongText: longText._id,
//           theme_word,
//           pic_url,
//           title,
//           description,
//           level,
//           length,
//           tags,
//           name,
//           categoryInd,
//           source,
//           user,
//           translation: [translation[i]],
//           chinese_arr,
//           origintext: [origintext[i]],
//           // isApproved,
//         });

//         promises.push(page.save());
//       }

//       const pages = await Promise.all(promises);

//       const newField = {
//         pages: pages.map((x) => {
//           return {
//             page: x._id,
//           };
//         }),
//       };

//       await LongText.findByIdAndUpdate(
//         longText._id,
//         {
//           $set: newField,
//         },
//         { new: true }
//       );

//       notifyMe(`New LONG TEXT from ${name}. Title: ${title}`);

//       res.json({ msg: "Success" });
//     } catch (err) {
//       console.error(err);
//       res.status(500).send("Server error while trying add a long text");
//     }
//   }
// );

module.exports = router;
