const mongoose = require('mongoose');
const Dictionary = require('../../../models/Dictionary');
const DictionaryTranslation = require('../../../models/DictionaryTranslation');
const DictionaryExample = require('../../../models/DictionaryExample');
const DictionaryRevision = require('../../../models/DictionaryRevision');
const { HttpError } = require('../../http-error');
const { notifyWordChange } = require('./word-notify');
const { toEditable } = require('./translations/editable-translation');
const { TRANSLATION_LANGS, pickTranslation } = require('./translations/langs');
const { updateWordEntry, createWordEntry, rollbackWordEntry } = require('./word-entry');

const REVISIONS_LIMIT = 50;
const SUMMARY_CHARS = 80;

async function findWord(id) {
  const word = mongoose.isValidObjectId(id) ? await Dictionary.findById(id).lean() : null;
  if (!word) throw new HttpError(404, 'Слово не найдено');
  return word;
}

// `updatedAt` the editor loaded: a change is refused when the word changed since
function checkVersion(word, updatedAt) {
  const loaded = updatedAt ? new Date(updatedAt).getTime() : null;
  const current = word.updatedAt ? new Date(word.updatedAt).getTime() : null;
  if (loaded !== current) {
    throw new HttpError(409, 'Слово изменили, пока вы его редактировали: обновите страницу');
  }
}

// first sense text of a snapshot, for the history list
function summary(senses) {
  for (const node of senses || []) {
    if (node.text) return node.text.slice(0, SUMMARY_CHARS);
    const inner = summary(node.senses);
    if (inner) return inner;
  }
  return '';
}

/**
 * @route   GET api/dictionary/word/:id/edit
 * @desc    word with its translations in the editor shape (translations/editable-translation.js),
 *          by language: { ru?: { senses, examples, parseWarnings }, en?, zh? }; `shownLang` - the
 *          one the site shows (translations/langs.js); and the edit history
 */
async function getWordForEdit(req, res) {
  const word = await findWord(req.params.id);
  const [translations, examples, revisions] = await Promise.all([
    DictionaryTranslation.find({ wordId: word._id })
      .select('-_id lang senses parseWarnings')
      .lean(),
    DictionaryExample.find({ wordId: word._id }).select('-_id -wordId -chinese').lean(),
    DictionaryRevision.find({ wordId: word._id })
      .sort({ date: -1 })
      .limit(REVISIONS_LIMIT)
      .populate('editor', 'name')
      .lean(),
  ]);

  const byLang = {};
  for (const lang of TRANSLATION_LANGS) {
    const translation = translations.find((t) => t.lang === lang);
    if (!translation) continue;
    byLang[lang] = {
      ...toEditable(
        translation.senses,
        examples.filter((e) => e.lang === lang),
      ),
      parseWarnings: translation.parseWarnings || [],
    };
  }

  res.json({
    word: {
      _id: word._id,
      chinese: word.chinese,
      tradChinese: word.tradChinese || '',
      pinyin: word.pinyin || '',
      updatedAt: word.updatedAt || null,
    },
    translations: byLang,
    shownLang: pickTranslation(translations)?.lang || null,
    revisions: revisions.map(({ _id, date, action, editor, snapshot }) => ({
      _id,
      date,
      action,
      editor: editor?.name || '',
      lang: snapshot?.lang || null,
      pinyin: snapshot?.pinyin || '',
      summary: summary(snapshot?.senses),
    })),
  });
}

/**
 * @route   PUT api/dictionary/word/:id
 * @body    { pinyin, tradChinese, translation, updatedAt } - `translation` (with its `lang`)
 *          replaces the word's translation in that language or adds one; `updatedAt` the editor
 *          loaded, the save is refused when the word changed since
 */
async function editWord(req, res) {
  const word = await findWord(req.params.id);
  const { pinyin, tradChinese, translation, updatedAt } = req.body;

  checkVersion(word, updatedAt);

  const { word: updated, changes } = await updateWordEntry(
    word,
    { pinyin, tradChinese, translation },
    { editor: req.user?.id, action: 'edit' },
  );
  notifyWordChange('Изменено слово', word, changes, req.user?.id);
  res.json(updated);
}

/**
 * @route   DELETE api/dictionary/word/:id/translation/:lang?updatedAt=
 * @desc    delete the word's translation in one language (not its only one)
 */
async function deleteWordTranslation(req, res) {
  const word = await findWord(req.params.id);
  checkVersion(word, req.query.updatedAt);
  const { lang } = req.params;
  if (!(await DictionaryTranslation.exists({ wordId: word._id, lang }))) {
    throw new HttpError(404, 'Перевода на этом языке нет');
  }

  const { word: updated, changes } = await updateWordEntry(
    word,
    { removeLang: lang },
    { editor: req.user?.id, action: 'edit' },
  );
  notifyWordChange('Изменено слово', word, changes, req.user?.id);
  res.json(updated);
}

/**
 * @route   POST api/dictionary/word
 * @body    { chinese, tradChinese, pinyin, translation }
 */
async function addWord(req, res) {
  const { chinese, tradChinese, pinyin, translation } = req.body;
  const { word, changes } = await createWordEntry(
    { chinese, tradChinese, pinyin, translation },
    { editor: req.user?.id },
  );
  notifyWordChange('Добавлено слово', word, changes, req.user?.id);
  res.json(word);
}

/**
 * @route   PUT api/dictionary/word/:id/rollback/:revisionId
 */
async function rollbackWord(req, res) {
  const word = await findWord(req.params.id);
  const { word: updated, changes } = await rollbackWordEntry(word, req.params.revisionId, {
    editor: req.user?.id,
  });
  notifyWordChange('Откат слова', word, changes, req.user?.id);
  res.json(updated);
}

module.exports = { getWordForEdit, editWord, deleteWordTranslation, addWord, rollbackWord };
