const router = require("express").Router();
const auth = require("../../middleware/auth");
const axios = require("axios");

const YT_URLS = {
  captions: `https://www.googleapis.com/youtube/v3/captions?key=${process.env.GC_API_KEY}`,
};

/**
 * @route   /gcloud/youtube/getCaptions?videoId=M7FIvfx5J10
 * @access  Private
 */
router.get("/getCaptions", auth, async (req, res) => {
  const { videoId } = req.query;
  if (!videoId) throw new Error("No videoId provided");
  // getSubtitles({
  //   videoID, // youtube video id
  //   lang, // default: `en` zh-CN, ru
  // }).then((captions) => {
  //   // console.log(captions);
  //   res.json(captions);
  // });

  const { data } = await axios.get(`${YT_URLS.captions}&part=snippet&videoId=M7FIvfx5J10`);
  res.json(data);
});

module.exports = router;
