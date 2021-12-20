const express = require("express");
const router = express.Router();

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
