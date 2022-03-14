const router = require("express").Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");

const { getSubtitles } = require("youtube-captions-scraper");

const {
  getById,
  createVideo,
  getAllApprovedVids,
  getNotApprovedVids,
  likeVideo,
} = require("../../src/api/services/videos");

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
 * @route     GET api/videos
 * @desc      Get ALL approved videos
 * @access    Public
 */
router.get("/", getAllApprovedVids);

router.get("/not_approved", getNotApprovedVids);

/**
 * @method  GET
 * @route   GET api/videos/:id
 * @desc    Get the video by ID
 * @access  Public
 */
router.get("/:id", getById);

/**
 *  @route    PUT api/videos/like/:id
 *  @desc     Like a video
 *  @access   Private
 */
router.put("/like/:id", auth, likeVideo);

// router.get("/vids", async (req, res) => {
//   getSubtitles({
//     videoID: "6hWz05iCKls", // youtube video id
//     lang: "zh-CN", // default: `en` zh-CN, ru
//   }).then((captions) => {
//     // console.log(captions);
//     res.json(captions);
//   });
// });

module.exports = router;
