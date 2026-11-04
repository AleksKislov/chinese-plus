const mongoose = require('mongoose');
const Dictionary = require('../../../models/Dictionary');
const { HttpError } = require('../../http-error');
const { notifyWordChange } = require('./word-notify');
const { updateWordEntry } = require('./word-entry');

// quick pinyin edit (the modal in tooltips); the translation is edited on /dictionary/edit/:id
async function updateWord(req, res) {
  const { pinyin, id } = req.body;

  if (!pinyin || !id) throw new HttpError(400, 'no pinyin or id to update');

  const wordToEdit = mongoose.isValidObjectId(id) ? await Dictionary.findById(id).lean() : null;
  if (!wordToEdit) throw new HttpError(404, 'Слово не найдено');

  const { word: editedWord, changes } = await updateWordEntry(
    wordToEdit,
    { pinyin },
    { editor: req.user.id, action: 'edit' },
  );
  notifyWordChange('Изменено слово', wordToEdit, changes, req.user.id);

  res.json(editedWord);
}

module.exports = { updateWord };
