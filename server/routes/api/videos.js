const router = require("express").Router();
const auth = require("../../middleware/auth");
const { getSubtitles } = require("youtube-captions-scraper");
const { check } = require("express-validator");

const { getById, createVideo } = require("../../src/api/services/videos");

/**
 * @method    POST
 * @route     api/videos/create
 * @desc      Create a video
 * @access    Private
 */
router.post(
  "/create",
  [
    auth,
    [
      check("cnSubs", "Нужны субтитры").not().isEmpty(),
      check("title", "Нужен заголовок").not().isEmpty(),
      check("lvl", "Нужно указать уровень").not().isEmpty(),
    ],
  ],
  createVideo
);

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
