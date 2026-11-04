const Dictionary = require('../../../models/Dictionary');
const { Notify } = require('../_misc');

// translations (dictionarytranslations) are not editable until editing of the parsed translation
// is implemented; only pinyin can be changed
async function updateWord(req, res) {
  const { pinyin, id } = req.body;

  if (!pinyin || !id) throw new Error('no pinyin or id to update');

  const wordToEdit = await Dictionary.findById(id);

  if (!isOkToEdit(pinyin, wordToEdit.pinyin)) throw new Error('nothing new to update');

  const newDate = new Date().toISOString();
  const newFields = {
    pinyin,
    edited: true,
    updatedAt: newDate,
    previous: wordToEdit.previous,
  };
  newFields.previous.unshift({
    pinyin: wordToEdit.pinyin,
    editor: req.user.id,
    date: newDate,
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
//   "date" : ISODate("2020-07-07T13:24:52.276Z"),
//   "__v" : 0
// }
