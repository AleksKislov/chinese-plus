const axios = require("axios");

async function getPics(req, res) {
  const headers = { Authorization: process.env.UNSPLASH_APIKEY };
  const url = `https://api.unsplash.com/photos/random?query=${req.params.pic_theme}&count=8&orientation=portrait`;
  const { data } = await axios.get(url, { headers });
  const onlyUrls = data.map((x) => x.urls);
  res.json(onlyUrls);
}

module.exports = { getPics };
