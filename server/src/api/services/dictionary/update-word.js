const Dictionary = require("../../../models/Dictionary");

async function updateWord(req, res) {
  const { pinyin, russian, id } = req.body;

  if ((!pinyin && !russian) || !id) throw new Error("nothing to update");

  const wordToEdit = await Dictionary.findById(id);

  const newFields = {};
  if (pinyin) newFields.pinyin = pinyin;
  if (russian) newFields.russian = russian;

  newFields.edited = true;
  newFields.previous = wordToEdit.previous;
  newFields.previous.push({
    russian: wordToEdit.russian,
    pinyin: wordToEdit.pinyin,
  });

  const editedWord = await Dictionary.findByIdAndUpdate(id, { $set: newFields }, { new: true });

  res.json(editedWord);
}

module.exports = { updateWord };

// {
//   "_id" : ObjectId("5f0477a4172f4114b21d362e"),
//   "chinese" : "二连浩特",
//   "pinyin" : " èrliánhàotè",
//   "russian" : " [m1]Эрэн-Хото [i](городской уезд автономного района Внутренняя Монголия КНР)[/i][/m]",
//   "date" : ISODate("2020-07-07T13:24:52.276Z"),
//   "__v" : 0
// }
