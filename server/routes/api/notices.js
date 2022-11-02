const express = require("express");
const router = express.Router();
const adminAuth = require("../../middleware/admin-auth");

const Notice = require("../../src/models/Notice");

// router.post("/", async (req, res) => {
//   try {
//     const { text, display } = req.body;

//     const newNotice = new Notice({
//       text,
//       display
//     });

//     const notice = await newNotice.save();

//     res.json(notice);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

router.post("/edit", adminAuth, async (req, res) => {
  try {
    const { text, display, color } = req.body;
    const [notice] = await Notice.find();
    await Notice.update(
      { _id: notice._id },
      { $set: { text, display, color } },
      { upsert: true, runValidators: true }
    );

    res.json({ msg: "done" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/**
 * @route     GET api/notices
 * @desc      Get the notice (one)
 * @access    Public
 */
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find();

    res.json(notices[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
