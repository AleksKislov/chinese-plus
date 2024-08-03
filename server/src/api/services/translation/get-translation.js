const { googleTranslate } = require('./google-translate');

/**
 * @desc get translation for Chinese txt
 */
async function getTranslation(req, res) {
  const translation = await googleTranslate(req.body.text);
  if (translation) return res.json({ translation });
  return res.status(500).send('Server error');
}

module.exports = { getTranslation };
