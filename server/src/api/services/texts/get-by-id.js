const Text = require("../../../models/Text");

async function getById(req, res) {
  const text = await Text.findByIdAndUpdate(req.params.id, { $inc: { hits: 1 } }, { new: true });
  if (!text) return res.status(404).json({ msg: "Text not found" });
  return res.json(text);
}

module.exports = { getById };
