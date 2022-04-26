const axios = require("axios");

const YT_URLS = {
  captions: `${process.env.YT_BASE_URL}captions?key=${process.env.GC_API_KEY}`,
  info: `${process.env.YT_BASE_URL}videos?key=${process.env.GC_API_KEY}`,
};

async function getYtInfo(req, res) {
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
}

module.exports = { getYtInfo };
