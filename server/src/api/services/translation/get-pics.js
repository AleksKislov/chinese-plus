const axios = require('axios');

const ALLOWED_ORIENTATIONS = ['portrait', 'landscape', 'squarish'];

async function getPics(req, res) {
  // 'any' (or nothing recognized) skips the orientation filter -> Unsplash returns a random mix
  const orientation = ALLOWED_ORIENTATIONS.includes(req.query.orientation)
    ? req.query.orientation
    : req.query.orientation
      ? null
      : 'portrait';
  const headers = { Authorization: process.env.UNSPLASH_APIKEY };
  const orientationParam = orientation ? `&orientation=${orientation}` : '';
  const url = `https://api.unsplash.com/photos/random?query=${req.params.pic_theme}&count=8${orientationParam}`;
  const { data } = await axios.get(url, { headers });
  const onlyUrls = data.map((x) => x.urls);
  res.json(onlyUrls);
}

module.exports = { getPics };
