const Text = require('../../../models/Text');
const { invalidateTag } = require('../../../cache');

async function deleteText(req, res) {
  await Text.deleteOne({ _id: req.params.id });
  invalidateTag('texts');
  return res.json({ msg: 'done' });
}

module.exports = { deleteText };
