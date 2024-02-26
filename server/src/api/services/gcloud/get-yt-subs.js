const { getSubtitles } = require("youtube-captions-scraper");

async function getYtSubs(req, res) {
  const { videoId, lang } = req.query;
  if (!videoId) throw new Error("No videoId provided");

  const captions = await getSubtitles({
    videoID: videoId,
    lang, // default: `en` zh-CN, ru
  });

  res.json(captions);
}

module.exports = { getYtSubs };
