const mongoose = require('mongoose');
const User = require('../../../models/User');
const { Notify } = require('../_misc');
const { logger } = require('../../../logger');

/**
 * Telegram notification (Notify.admin) about a dictionary word an admin or moderator added, edited or rolled
 * back: what changed, who did it and a link to the word.
 */

const WORD_URL = 'https://www.chineseplus.club/dictionary/';
const MAX_DIFF_LINES = 15;
const LINE_CHARS = 150;
const NEW_WORD_SENSES = 5;

const cut = (s) => (s.length > LINE_CHARS ? `${s.slice(0, LINE_CHARS)}…` : s);

// "[разг.] опыт" for every sense, in reading order; positions and numbers are left out, so a
// moved or renumbered sense is not a change of its text
function senseLines(senses) {
  const lines = [];
  const walk = (list) =>
    list.forEach((n) => {
      const line = [n.pinyin, n.labels && `[${n.labels.join(' ')}]`, n.text]
        .filter(Boolean)
        .join(' ');
      if (line) lines.push(line);
      if (n.senses) walk(n.senses);
    });
  walk(senses || []);
  return lines;
}

const exampleLines = (examples) =>
  (examples || []).map((e) =>
    [e.zh, e.pinyin, e.labels && `[${e.labels.join(' ')}]`, e.translation]
      .filter(Boolean)
      .join(' '),
  );

// lines only in `before` / only in `after`, repeated lines counted
function listDiff(before, after) {
  const left = new Map();
  before.forEach((line) => left.set(line, (left.get(line) || 0) + 1));
  const added = [];
  for (const line of after) {
    const n = left.get(line);
    if (n) left.set(line, n - 1);
    else added.push(line);
  }
  const removed = [...left].flatMap(([line, n]) => Array(n).fill(line));
  return { removed, added };
}

const LANG_TITLES = { ru: 'русский', en: 'английский', zh: 'китайский' };

/**
 * What an update changes, as lines of the message.
 * @param {object} word - the word before the change
 * @param {{ $set, $unset }} fields - its changed fields
 * @param {object} snapshot - the word before the change, with its translation in the changed
 *        language (word-entry.js takeSnapshot)
 * @param {{ translation: object|null, removeLang: string|null }} translationChange - the new
 *        normalized translation (null when unchanged) or the removed language
 */
function describeUpdate(word, { $set, $unset }, snapshot, { translation, removeLang }) {
  const lines = [];
  if ($set.pinyin) lines.push(`Пиньинь: ${(word.pinyin || '').trim() || '—'} → ${$set.pinyin}`);
  if ($set.tradChinese || $unset.tradChinese !== undefined) {
    lines.push(`Трад.: ${word.tradChinese || '—'} → ${$set.tradChinese || '—'}`);
  }

  const oldSenses = senseLines(snapshot.senses);
  if (removeLang) {
    lines.push(
      `Удалён перевод (${LANG_TITLES[removeLang]}): значений ${oldSenses.length}, примеров ${snapshot.examples.length}`,
    );
  }
  if (!translation) return lines;

  const newSenses = senseLines(translation.senses);
  const senses = listDiff(oldSenses, newSenses);
  const examples = listDiff(exampleLines(snapshot.examples), exampleLines(translation.examples));
  const diff = [
    ...senses.removed.map((l) => `− ${l}`),
    ...senses.added.map((l) => `+ ${l}`),
    ...examples.removed.map((l) => `− пример: ${l}`),
    ...examples.added.map((l) => `+ пример: ${l}`),
  ];

  const isNew = !snapshot.senses.length && !snapshot.examples.length;
  lines.push(
    `${isNew ? 'Новый перевод' : 'Перевод'} (${LANG_TITLES[translation.lang]}): значений ${
      oldSenses.length
    } → ${newSenses.length}, примеров ${snapshot.examples.length} → ${translation.examples.length}`,
  );
  if (!diff.length) lines.push('изменены порядок, вложенность или тип значений / примеров');
  lines.push(...diff.slice(0, MAX_DIFF_LINES).map(cut));
  if (diff.length > MAX_DIFF_LINES) lines.push(`… и ещё ${diff.length - MAX_DIFF_LINES}`);
  return lines;
}

/** The new word, as lines of the message. */
function describeCreate(word, translation) {
  const senses = senseLines(translation.senses);
  const lines = [`Пиньинь: ${word.pinyin}`, `Перевод: ${LANG_TITLES[translation.lang]}`];
  if (word.tradChinese) lines.push(`Трад.: ${word.tradChinese}`);
  lines.push(`Значений ${senses.length}, примеров ${translation.examples.length}`);
  lines.push(...senses.slice(0, NEW_WORD_SENSES).map((l) => cut(`+ ${l}`)));
  if (senses.length > NEW_WORD_SENSES) lines.push(`… и ещё ${senses.length - NEW_WORD_SENSES}`);
  return lines;
}

/**
 * @param {string} title - 'Изменено слово', ...
 * @param {{ chinese: string }} word
 * @param {string[]} changes - lines from describeUpdate / describeCreate
 * @param {string} [editorId] - id of the admin or moderator
 */
async function notifyWordChange(title, word, changes, editorId) {
  try {
    const editor = mongoose.isValidObjectId(editorId)
      ? await User.findById(editorId).select('name').lean()
      : null;
    const lines = [
      `${title}: ${word.chinese}`,
      `Автор: ${editor?.name || '?'} (${editorId || '?'})`,
      ...changes,
      WORD_URL + encodeURIComponent(word.chinese),
    ];
    await Notify.admin(lines.join('\n'));
  } catch (err) {
    logger.error({ err }, 'notifyWordChange failed');
  }
}

module.exports = { describeUpdate, describeCreate, notifyWordChange };
