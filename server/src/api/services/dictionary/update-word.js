const Dictionary = require("../../../models/Dictionary");
const { Notify } = require("../_misc");

async function updateWord(req, res) {
  const { pinyin, russian, id } = req.body;

  if ((!pinyin && !russian) || !id) throw new Error("nothing to update");

  const wordToEdit = await Dictionary.findById(id);

  const newFields = {};
  if (isOkToEdit(pinyin, wordToEdit.pinyin)) {
    newFields.pinyin = pinyin;
  }
  if (isOkToEdit(russian, wordToEdit.russian)) {
    newFields.russian = russian;
  }

  if (!newFields.pinyin && !newFields.russian) throw new Error("nothing to update");

  newFields.edited = true;
  newFields.previous = wordToEdit.previous;
  newFields.previous.unshift({
    russian: wordToEdit.russian,
    pinyin: wordToEdit.pinyin,
    editor: req.user.id,
    date: new Date().toISOString(),
  });

  const editedWord = await Dictionary.findByIdAndUpdate(id, { $set: newFields }, { new: true });
  Notify.admin(`Изменено слово: ${wordToEdit.chinese}`);

  res.json(editedWord);
}

module.exports = { updateWord };

/**
 * @param {string} newField
 * @param {string} oldField
 */
function isOkToEdit(newField, oldField) {
  return newField && newField.trim() !== oldField.trim();
}

// {
//   "_id" : ObjectId("5f0477a4172f4114b21d362e"),
//   "chinese" : "二连浩特",
//   "pinyin" : " èrliánhàotè",
//   "russian" : " [m1]Эрэн-Хото [i](городской уезд автономного района Внутренняя Монголия КНР)[/i][/m]",
//   "date" : ISODate("2020-07-07T13:24:52.276Z"),
//   "__v" : 0
// }
