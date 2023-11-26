const router = require("express").Router();
const auth = require("../../middleware/auth");
// const adminAuth = require("../../middleware/admin-auth");
const { check } = require("express-validator");

const {
  createTxt,
  updateTxt,
  getTextsPerUserStats,
  getAllApprovedTexts,
  deleteComment,
  getById,
  getByUserId,
  getTextsNum,
  getNotApprovedTexts,
  getTextsInChunks,
  likeText,
  markAsRead,
  markAsNotRead,
  // deleteText,
  getMarkedTexts,
  editChineseArr,
  getSimilarTexts,
} = require("../../src/api/services/texts");
const adminAuth = require("../../middleware/admin-auth");

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

/**
 * @method    PUT
 * @route     api/texts/edit-chinese-arr
 * @desc      Update text's chinese_arr
 * @access    Private
 */
router.put("/edit-chinese-arr", adminAuth, editChineseArr);

/**
 * @method    GET
 * @route     api/texts/marked
 * @desc      get all marked texts
 * @access    Private
 */
router.get("/marked", auth, getMarkedTexts);

/**
 * @route     GET api/texts
 * @desc      Get ALL approved texts
 * @access    Public
 */
router.get("/", getAllApprovedTexts);

/**
 * @route     GET api/texts/similar
 * @desc      Get similar texts using tags and lvl
 * @access    Public
 */
router.get("/similar", getSimilarTexts);

/**
 * @route   GET api/texts/statistics
 * @desc    Get texts per user statistics info, who publish how many texts and chars
 * @example
 * [{ num: 16, name: "admin", userid: "5f301a8f0aa547478da68c18" },
 * { num: 9, name: "Aleksandr Kislov",userid: "5ee31c7847fd670ce93b83cc" },
 * { num: 7, name: "Sergei Guer", userid: "600728cd4c87149d9552bba7" }]
 */
router.get("/statistics", getTextsPerUserStats);

// /**
//  * @route     DELETE api/texts/:id
//  * @desc      Delete a Text
//  * @access    Private
//  */
// router.delete("/delete/:id", adminAuth, deleteText);

/**
 * @route     DELETE api/texts/comment/:id/:comment_id
 * @desc      Delete a Comment of a text
 * @access    Private
 */
router.delete("/comment/:id/:comment_id", auth, deleteComment);

/**
 * @method  GET
 * @route   api/texts/infinite?skip=...categoryInd=...
 * @desc    Get texts using inifinite scroll and category index
 * @access  Public
 */
router.get("/infinite", getTextsInChunks);

router.get("/not_approved", getNotApprovedTexts);

/**
 *  @route   GET api/texts/texts_num
 *  @desc    Get the number of texts, approved and not
 *  @access  Public
 */
router.get("/texts_num", getTextsNum);

/**
 * @method  GET
 * @route   GET api/texts/:id
 * @desc    Get the text by ID
 * @access  Public
 */
router.get("/:id", getById);

/**
 * @method    GET
 * @route     GET api/texts/user/:userId
 * @desc      Get all the texts by user who published them
 * @access    Public
 */
router.get("/user/:userId", getByUserId);

/**
 * @desc    Mark text as already read for the user
 */
router.post("/mark_finished_texts/:id", auth, markAsRead);
router.post("/unmark_finished_texts/:id", auth, markAsNotRead);

/**
 *  @route    PUT api/texts/like/:id
 *  @desc     Like a text
 *  @access   Private
 */
router.put("/like/:id", auth, likeText);

module.exports = router;
