const router = require("express").Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");

const {
  getById,
  createVideo,
  getAllApprovedVids,
  getNotApprovedVids,
  likeVideo,
  deleteComment,
  markAsSeen,
  getVidsInChunks,
  updateVideo,
  getVideosNum,
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
 * @method    POST
 * @route     api/videos/update
 * @desc      Update a video
 * @access    Private
 */
router.post("/update", [auth, [check("videoId", "Нет videoId").not().isEmpty()]], updateVideo);

router.post("/mark_as_seen/:id", auth, markAsSeen);
router.post("/unmark_as_seen/:id", auth, markAsSeen);

/**
 * @method  GET
 * @route   api/videos/infinite?skip=...category=...
 * @desc    Get videos using inifinite scroll and category string
 * @access  Public
 */
router.get("/infinite", getVidsInChunks);

/**
 * @route     GET api/videos
 * @desc      Get ALL approved videos
 * @access    Public
 */
router.get("/all_approved", getAllApprovedVids);

router.get("/not_approved", getNotApprovedVids);

/**
 *  @route   GET api/videos/videos_num
 *  @desc    Get the number of videos, approved and not
 *  @access  Public
 */
router.get("/videos_num", getVideosNum);

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

/**
 * @route     DELETE api/videos/comment/:id/:comment_id
 * @desc      Delete a CommentType of a video
 * @access    Private
 */
router.delete("/comment/:id/:comment_id", auth, deleteComment);

module.exports = router;
