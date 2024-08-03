const Dictionary = require('../../../models/Dictionary');

async function rollbackUpdate(req, res) {
  const { wordId, prevInd } = req.query;
  const wordToEdit = await Dictionary.findById(wordId);

  const newFields = {};
  const prev = wordToEdit.previous[prevInd];
  const prevArr = [...wordToEdit.previous];
  if (prev) {
    newFields.russian = prev.russian;
    newFields.pinyin = prev.pinyin;
    prevArr.splice(+prevInd, 1);
    newFields.previous = prevArr;
    newFields.updatedAt = new Date().toISOString();
  }

  const editedWord = await Dictionary.findByIdAndUpdate(wordId, { $set: newFields }, { new: true });
  res.json(editedWord);
}

module.exports = { rollbackUpdate };
