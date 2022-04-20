const router = require("express").Router();
const auth = require("../../middleware/auth");
const axios = require("axios");
const { getSubtitles } = require("youtube-captions-scraper");

const YT_URLS = {
  captions: `https://www.googleapis.com/youtube/v3/captions?key=${process.env.GC_API_KEY}`,
  info: `https://www.googleapis.com/youtube/v3/videos?key=${process.env.GC_API_KEY}`,
};

/**
 * @route   /gcloud/youtube/getInfo?videoId=6hWz05iCKls
 * @access  Private
 */
router.get("/getInfo", auth, async (req, res) => {
  const { videoId } = req.query;
  if (!videoId) throw new Error("No videoId provided");

  const result = await Promise.all([
    axios.get(`${YT_URLS.captions}&part=snippet&videoId=${videoId}`),
    axios.get(`${YT_URLS.info}&part=snippet&id=${videoId}`),
  ]);

  const { title, description, tags } = result[1].data.items[0].snippet;

  res.json({
    title,
    description,
    tags,
    captionLangs: result[0].data.items.map((x) => x.snippet.language),
  });
});

/**
 * @route   /gcloud/youtube/getSubs?videoId=6hWz05iCKls&lang=en
 * @access  Private
 */
router.get("/getSubs", auth, async (req, res) => {
  const { videoId, lang } = req.query;
  if (!videoId) throw new Error("No videoId provided");

  const captions = await getSubtitles({
    videoID: videoId,
    lang, // default: `en` zh-CN, ru
  });

  res.json(captions);
});

module.exports = router;
