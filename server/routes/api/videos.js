const router = require("express").Router();
const auth = require("../../middleware/auth");
const { getById } = require("../../src/api/services/videos");
const { getSubtitles } = require("youtube-captions-scraper");

/**
 * @method  GET
 * @route   GET api/videos/:id
 * @desc    Get the video by ID
 * @access  Public
 */
// router.get("/:id", getById);

router.get("/vids", async (req, res) => {
  getSubtitles({
    videoID: "6hWz05iCKls", // youtube video id
    lang: "zh-CN", // default: `en` zh-CN, ru
  }).then((captions) => {
    // console.log(captions);
    res.json(captions);
  });
});

module.exports = router;
