const mongoose = require('mongoose');
const Text = require('../../../models/Text');
const User = require('../../../models/User');
const UserWord = require('../../../models/UserWord');
const OldHskUserWord = require('../../../models/Word');
const { TUTOR } = require('./consts');

// Content of the lesson types (TutorChat.focus): the server picks it, the client only sends a
// text id (or a link to a text page). Everything here is either the user's own list or public,
// approved content.

class LessonError extends Error {}

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// 'Мой словарик' + 'Мой словарик HSK' -> up to VOCAB_WORDS Chinese words: the newest ones (what
// the student is learning now) + random older ones. No translations: the model knows them.
async function pickVocabWords(userId) {
  const [own, hsk] = await Promise.all([
    UserWord.find({ user: userId }).select('date wordId').populate('wordId', 'chinese').lean(),
    OldHskUserWord.find({ user: userId })
      .select('date wordId')
      .populate('wordId', 'chinese')
      .lean(),
  ]);
  const byDate = [...own, ...hsk]
    .filter((w) => w.wordId?.chinese)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((w) => w.wordId.chinese.trim());
  const unique = [...new Set(byDate)];

  const newest = unique.slice(0, TUTOR.VOCAB_NEWEST);
  const rest = shuffle(unique.slice(TUTOR.VOCAB_NEWEST)).slice(
    0,
    TUTOR.VOCAB_WORDS - newest.length,
  );
  return shuffle([...newest, ...rest]);
}

// HSK 1-2 -> easy (1), 3-4 -> normal (2), 5-6 -> hard (3)
const textLevelOf = (hskLevel) => Math.min(3, Math.ceil(hskLevel / 2));

const TEXT_ID_IN_URL = /\/read\/texts\/([0-9a-f]{24})/;

// a text id, or a link to a text page of the site ('…/read/texts/<id>-slug'). The link is never
// opened: only the id is taken from it and looked up in the DB.
function textIdFrom({ textId, textUrl }) {
  if (textId) return mongoose.isValidObjectId(textId) ? String(textId) : null;
  if (typeof textUrl !== 'string' || textUrl.length > 500) return null;
  return textUrl.match(TEXT_ID_IN_URL)?.[1] || null;
}

// approved text -> { textId, textTitle, textLevel, text } (Chinese of the first page, capped)
async function loadLessonText(params) {
  const id = textIdFrom(params);
  if (!id) throw new LessonError('Нужна ссылка на текст с сайта: …/read/texts/…');

  const doc = await Text.findOne({ _id: id, isApproved: 1 })
    .select('title level origintext pages.origintext')
    .lean();
  if (!doc) throw new LessonError('Текст не найден');

  const paragraphs = doc.pages?.length ? doc.pages[0].origintext : doc.origintext;
  const text = (paragraphs || [])
    .join('\n')
    .replace(/[<>]/g, '') // can't close the <lesson_text> tag around it in the prompt
    .trim()
    .slice(0, TUTOR.LESSON_TEXT_LEN);
  if (!text) throw new LessonError('В этом тексте нет китайского текста');

  return { textId: doc._id, textTitle: doc.title, textLevel: doc.level, text };
}

// "Обсудить текст": up to 3 bookmarked texts (Закладки), the rest random approved texts of the
// student's level
async function suggestTexts(userId, hskLevel) {
  const user = await User.findById(userId).select('finished_texts').lean();
  const bookmarked = shuffle(
    await Text.find({ _id: { $in: user?.finished_texts || [] }, isApproved: 1 })
      .select('title level')
      .lean(),
  ).slice(0, 3);

  const missing = 3 - bookmarked.length;
  const random = missing
    ? await Text.aggregate([
        {
          $match: {
            isApproved: 1,
            level: textLevelOf(hskLevel),
            _id: { $nin: bookmarked.map((t) => t._id) },
          },
        },
        { $sample: { size: missing } },
        { $project: { title: 1, level: 1 } },
      ])
    : [];

  return [
    ...bookmarked.map((t) => ({ ...t, bookmarked: true })),
    ...random.map((t) => ({ ...t, bookmarked: false })),
  ];
}

// lesson type -> TutorChat.focus + title. kind: 'chat' | 'vocab' | 'text'
async function buildFocus(userId, lesson = {}) {
  if (lesson.kind === 'vocab') {
    const words = await pickVocabWords(userId);
    if (!words.length) {
      throw new LessonError('В «Моём словарике» пока нет слов — добавьте их со страниц сайта');
    }
    return { focus: { kind: 'vocab', words }, title: 'Повторение моих слов' };
  }
  if (lesson.kind === 'text') {
    const { text, ...meta } = await loadLessonText(lesson);
    return {
      focus: { kind: 'text', ...meta, text },
      title: `Текст: ${meta.textTitle}`.slice(0, 60),
    };
  }
  return { focus: { kind: 'chat' }, title: null };
}

module.exports = { buildFocus, suggestTexts, LessonError };
