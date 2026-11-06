const mongoose = require('mongoose');
const Dictionary = require('../../../models/Dictionary');
const DictionaryTranslation = require('../../../models/DictionaryTranslation');
const DictionaryExample = require('../../../models/DictionaryExample');
const DictionaryRevision = require('../../../models/DictionaryRevision');
const Hanzi = require('../../../../routes/api/dict/dictionary');
const { MAX_CN_WORD_LEN } = require('../../../../routes/api/dict/constants');
const { invalidateTag } = require('../../../cache');
const { HttpError } = require('../../http-error');
const { normalizeTranslation, toEditable } = require('./translations/editable-translation');
const { TRANSLATION_LANGS } = require('./translations/langs');
const { describeUpdate, describeCreate } = require('./word-notify');

/**
 * Saving a dictionary word edited by an admin or moderator: its fields in `dictionaries`, its
 * translations (one per language) in `dictionarytranslations` / `dictionaryexamples` and a
 * revision with the replaced state.
 */

// cached responses that show dictionary translations
const TRANSLATION_CACHE_TAGS = ['hsk-new', 'grammar', 'writing-sheets'];

// same as scripts/backfill-pinyin.js: only short words get a cleanPinyin
const MAX_CLEAN_PINYIN_CHARS = 8;
const DIACRITICS_RE = /[\u0300-\u036f]/g;
const CJK_RE = /[㐀-鿿豈-﫿]/;
const MAX_CHINESE_CHARS = 50;
const MAX_PINYIN_CHARS = 300;

const cleanPinyinOf = (chinese, pinyin) =>
  [...chinese].length <= MAX_CLEAN_PINYIN_CHARS
    ? pinyin.normalize('NFD').replace(DIACRITICS_RE, '').replace(/\s+/g, '').toLowerCase()
    : undefined;

function requiredString(value, max, name) {
  const s = typeof value === 'string' ? value.trim() : '';
  if (!s) throw new HttpError(400, `${name}: обязательное поле`);
  if (s.length > max) throw new HttpError(400, `${name}: длиннее ${max} символов`);
  return s;
}

function chineseString(value, name, required) {
  const s = typeof value === 'string' ? value.trim() : '';
  if (!s && !required) return '';
  requiredString(s, MAX_CHINESE_CHARS, name);
  if (!CJK_RE.test(s)) throw new HttpError(400, `${name}: нет иероглифов`);
  return s;
}

const toObjectId = (id) => (id && mongoose.isValidObjectId(id) ? id : undefined);

/**
 * The word's pinyin, trad. chinese and its translation in `lang` (the language being changed,
 * none for a pinyin-only change), as kept in a revision:
 *   { pinyin, tradChinese?, lang?, senses, examples }
 * With a `lang` and no senses and examples, the word had no translation in that language.
 */
async function takeSnapshot(word, lang) {
  const snapshot = { pinyin: word.pinyin, senses: [], examples: [] };
  if (word.tradChinese) snapshot.tradChinese = word.tradChinese;
  if (!lang) return snapshot;

  const [translation, examples] = await Promise.all([
    DictionaryTranslation.findOne({ wordId: word._id, lang }).select('-_id senses').lean(),
    DictionaryExample.find({ wordId: word._id, lang })
      .select('-_id senseId order zh pinyin labels translation content')
      .sort({ order: 1 })
      .lean(),
  ]);
  return { ...snapshot, lang, senses: translation?.senses || [], examples };
}

/** Replaces the word's translation in its language (document and examples). */
async function saveTranslation(word, { examples, ...translation }) {
  const { lang } = translation;
  await DictionaryExample.collection.deleteMany({ wordId: word._id, lang });
  if (examples.length) {
    await DictionaryExample.collection.insertMany(
      examples.map((example, order) => ({
        wordId: word._id,
        chinese: word.chinese,
        lang,
        order,
        ...example,
      })),
    );
  }
  await DictionaryTranslation.collection.replaceOne(
    { wordId: word._id, lang },
    { wordId: word._id, chinese: word.chinese, ...translation },
    { upsert: true },
  );
}

async function deleteTranslation(word, lang) {
  await DictionaryExample.collection.deleteMany({ wordId: word._id, lang });
  await DictionaryTranslation.collection.deleteOne({ wordId: word._id, lang });
}

const hasTranslation = (snapshot) => snapshot.senses.length > 0 || snapshot.examples.length > 0;

// same translation: compared in the editor shape, which ignores ids, counts and ruTerms
const sameTranslation = (snapshot, normalized) =>
  JSON.stringify(toEditable(snapshot.senses, snapshot.examples)) ===
  JSON.stringify(
    toEditable(
      normalized.senses,
      normalized.examples.map((example, order) => ({ ...example, order })),
    ),
  );

/**
 * Applies an editor's (admin or moderator) changes to an existing word and records the replaced
 * state. A change touches the translation in one language only.
 * @param {object} word - lean `dictionaries` document
 * @param {{ pinyin?, tradChinese?, translation?, removeLang? }} changes - only the given fields
 *        change; `translation`: in the editor shape (translations/editable-translation.js), with
 *        its `lang`, it replaces the word's translation in that language or adds one;
 *        `removeLang`: deletes the word's translation in that language
 * @param {{ editor?: string, action: 'edit' | 'rollback' }} meta
 * @returns {{ word, changes: string[] }} - the updated word and what changed, for the notification
 */
async function updateWordEntry(word, changes, { editor, action }) {
  const $set = {};
  const $unset = {};

  if (changes.pinyin !== undefined) {
    const pinyin = requiredString(changes.pinyin, MAX_PINYIN_CHARS, 'Пиньинь');
    if (pinyin !== (word.pinyin || '').trim()) {
      $set.pinyin = pinyin;
      const cleanPinyin = cleanPinyinOf(word.chinese, pinyin);
      if (cleanPinyin !== undefined) $set.cleanPinyin = cleanPinyin;
      else if (word.cleanPinyin !== undefined) $unset.cleanPinyin = '';
    }
  }
  if (changes.tradChinese !== undefined) {
    const tradChinese = chineseString(changes.tradChinese, 'Традиционное написание', false);
    if (tradChinese !== (word.tradChinese || '')) {
      if (tradChinese) $set.tradChinese = tradChinese;
      else $unset.tradChinese = '';
    }
  }
  if (changes.removeLang && !TRANSLATION_LANGS.includes(changes.removeLang)) {
    throw new HttpError(400, 'Неверный язык перевода');
  }

  let translation =
    changes.translation === undefined ? null : normalizeTranslation(changes.translation);
  const snapshot = await takeSnapshot(word, translation?.lang || changes.removeLang);
  if (translation && sameTranslation(snapshot, translation)) translation = null;

  // a translation that is not there has nothing to remove
  const removeLang = changes.removeLang && hasTranslation(snapshot) ? changes.removeLang : null;
  if (
    removeLang &&
    !(await DictionaryTranslation.exists({ wordId: word._id, lang: { $ne: removeLang } }))
  ) {
    throw new HttpError(400, 'Нельзя удалить единственный перевод слова');
  }

  if (!translation && !removeLang && !Object.keys($set).length && !Object.keys($unset).length) {
    throw new HttpError(400, 'Нет изменений');
  }

  await DictionaryRevision.create({
    wordId: word._id,
    chinese: word.chinese,
    editor: toObjectId(editor),
    action,
    snapshot,
  });
  if (translation) await saveTranslation(word, translation);
  if (removeLang) await deleteTranslation(word, removeLang);

  const update = { $set: { ...$set, edited: true, updatedAt: new Date() } };
  if (Object.keys($unset).length) update.$unset = $unset;
  const updated = await Dictionary.findByIdAndUpdate(word._id, update, {
    returnDocument: 'after',
  }).lean();

  TRANSLATION_CACHE_TAGS.forEach(invalidateTag);
  return {
    word: updated,
    changes: describeUpdate(word, { $set, $unset }, snapshot, { translation, removeLang }),
  };
}

/**
 * Adds a new word with its translation.
 * @param {{ chinese, tradChinese?, pinyin, translation }} fields - translation in the editor shape
 * @returns {{ word, changes: string[] }}
 */
async function createWordEntry(fields, { editor }) {
  const chinese = chineseString(fields.chinese, 'Слово', true);
  const tradChinese = chineseString(fields.tradChinese, 'Традиционное написание', false);
  const pinyin = requiredString(fields.pinyin, MAX_PINYIN_CHARS, 'Пиньинь');
  const translation = normalizeTranslation(fields.translation);

  if (await Dictionary.exists({ chinese })) {
    throw new HttpError(409, `Слово ${chinese} уже есть в словаре`);
  }

  const doc = { chinese, pinyin };
  if (tradChinese && tradChinese !== chinese) doc.tradChinese = tradChinese;
  const cleanPinyin = cleanPinyinOf(chinese, pinyin);
  if (cleanPinyin !== undefined) doc.cleanPinyin = cleanPinyin;

  const word = (await Dictionary.create(doc)).toObject();
  await saveTranslation(word, translation);
  await DictionaryRevision.create({
    wordId: word._id,
    chinese,
    editor: toObjectId(editor),
    action: 'create',
  });

  if ([...chinese].length <= MAX_CN_WORD_LEN) Hanzi.addWord(chinese);
  TRANSLATION_CACHE_TAGS.forEach(invalidateTag);
  return { word, changes: describeCreate(word, translation) };
}

/** Restores the state kept in a revision of the word (recording the current one). */
async function rollbackWordEntry(word, revisionId, { editor }) {
  const revision = mongoose.isValidObjectId(revisionId)
    ? await DictionaryRevision.findOne({ _id: revisionId, wordId: word._id }).lean()
    : null;
  if (!revision) throw new HttpError(404, 'Версия не найдена');
  if (!revision.snapshot) throw new HttpError(400, 'К этой версии нельзя откатиться');

  const { snapshot } = revision;
  const changes = { tradChinese: snapshot.tradChinese || '' };
  if (snapshot.pinyin && snapshot.pinyin.trim()) changes.pinyin = snapshot.pinyin;
  if (snapshot.lang) {
    // no translation in the snapshot: that change added the language
    if (hasTranslation(snapshot)) {
      changes.translation = {
        lang: snapshot.lang,
        ...toEditable(snapshot.senses, snapshot.examples),
      };
    } else {
      changes.removeLang = snapshot.lang;
    }
  }

  return updateWordEntry(word, changes, { editor, action: 'rollback' });
}

module.exports = { updateWordEntry, createWordEntry, rollbackWordEntry };
