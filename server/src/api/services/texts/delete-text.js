const Text = require('../../../models/Text');

async function deleteText(req, res) {
  await Text.deleteOne({ _id: req.params.id });
  return res.json({ msg: 'done' });
}

module.exports = { deleteText };
