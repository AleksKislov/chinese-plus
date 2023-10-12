const router = require("express").Router();
const auth = require("../../middleware/auth");

const { getYtInfo } = require("../../src/api/services/gcloud");

/**
 * @route   /gcloud/youtube/getInfo?videoId=6hWz05iCKls
 * @access  Private
 */
router.get("/getInfo", auth, getYtInfo);

/**
 * @route   /gcloud/youtube/getSubs?videoId=6hWz05iCKls&lang=en
 * @access  Private
 */
router.get("/getSubs", auth, (req, res) => res.status(404).send("deprecated"));

module.exports = router;
