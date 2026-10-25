const Dictionary = require('../../../models/Dictionary');
const { syncTranslation } = require('./translations/sync-translation');

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
  if (newFields.russian !== undefined) await syncTranslation(editedWord);
  res.json(editedWord);
}

module.exports = { rollbackUpdate };
