const router = require("express").Router();
const auth = require("../../middleware/auth");
const axios = require("axios");
const { getSubtitles } = require("youtube-captions-scraper");

const YT_URLS = {
  captions: `https://www.googleapis.com/youtube/v3/captions?key=${process.env.GC_API_KEY}`,
};

/**
 * @route   /gcloud/youtube/getCaptionsList?videoId=6hWz05iCKls
 * @access  Private
 */
router.get("/getCaptionsList", auth, async (req, res) => {
  const { videoId } = req.query;
  if (!videoId) throw new Error("No videoId provided");

  const { data } = await axios.get(`${YT_URLS.captions}&part=snippet&videoId=${videoId}`);
  res.json(data);
});

/**
 * @route   /gcloud/youtube/getSubs?videoId=6hWz05iCKls
 * @access  Private
 */
router.get("/getSubs", auth, async (req, res) => {
  const { videoId, lang } = req.query;
  if (!videoId) throw new Error("No videoId provided");
  const captions = await getSubtitles({
    videoID: videoId, // yt video id
    lang, // default: `en` zh-CN, ru
  });

  res.json(captions);
});

module.exports = router;
