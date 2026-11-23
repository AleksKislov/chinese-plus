const mongoose = require('mongoose');
const Text = require('../../../models/Text');
const User = require('../../../models/User');
const UserWord = require('../../../models/UserWord');
const UserHsk3Word = require('../../../models/UserHsk3Word');
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

// vocabulary lists a 'vocab' lesson can use: «Мой словарик» (userwords -> dictionary) and
// «Мой словарик HSK 3.0» (userhsk3words -> hskword2025). Not the old HSK 2.0 list.
const VOCAB_SOURCES = ['own', 'hsk3'];
const VOCAB_LIST_MAX = 1000; // safety cap for one list

// the user's words of one list, newest first: [{ id, cn, py, date }]; id = the word's id
async function listVocab(userId, source) {
  if (source === 'hsk3') {
    const rows = await UserHsk3Word.find({ user: userId })
      .sort({ date: -1 })
      .limit(VOCAB_LIST_MAX)
      .select('wordId date')
      .populate('wordId', 'cn py')
      .lean();
    return rows
      .filter((r) => r.wordId?.cn)
      .map((r) => ({
        id: String(r.wordId._id),
        cn: r.wordId.cn.trim(),
        py: r.wordId.py,
        date: r.date,
      }));
  }
  const rows = await UserWord.find({ user: userId })
    .sort({ date: -1 })
    .limit(VOCAB_LIST_MAX)
    .select('wordId date')
    .populate('wordId', 'chinese pinyin')
    .lean();
  return rows
    .filter((r) => r.wordId?.chinese)
    .map((r) => ({
      id: String(r.wordId._id),
      cn: r.wordId.chinese.trim(),
      py: r.wordId.pinyin,
      date: r.date,
    }));
}

// -> up to VOCAB_WORDS Chinese words (no translations: the model knows them).
// wordIds: picked by the user; only ids from the user's own chosen lists count.
// Without them: the newest words (what the student is learning now) + random older ones.
async function pickVocabWords(userId, { sources, wordIds } = {}) {
  const chosen = VOCAB_SOURCES.filter((src) => !sources?.length || sources.includes(src));
  const words = (await Promise.all(chosen.map((src) => listVocab(userId, src)))).flat();

  if (Array.isArray(wordIds) && wordIds.length) {
    const picked = new Set(wordIds.slice(0, TUTOR.VOCAB_WORDS).map(String));
    return shuffle([...new Set(words.filter((w) => picked.has(w.id)).map((w) => w.cn))]);
  }

  const byDate = words.sort((a, b) => new Date(b.date) - new Date(a.date)).map((w) => w.cn);
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
    const words = await pickVocabWords(userId, lesson.vocab);
    if (!words.length) {
      throw new LessonError(
        lesson.vocab?.wordIds?.length
          ? 'Выбранные слова не найдены в ваших словариках'
          : 'В выбранных словариках пока нет слов — добавьте их со страниц сайта',
      );
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

// 'vocab' lesson: the words the model reported in its "vocab" block (already checked to be
// lesson words). A word answered right moves to practiced, one answered wrong to missed.
function applyVocabProgress(focus, { practiced, missed }) {
  const done = new Set(focus.practiced || []);
  const wrong = new Set(focus.missed || []);
  practiced.forEach((w) => {
    done.add(w);
    wrong.delete(w);
  });
  missed.forEach((w) => {
    wrong.add(w);
    done.delete(w);
  });
  focus.practiced = [...done];
  focus.missed = [...wrong];
}

// for the client: the lesson type without the words / text sent to the model;
// a 'vocab' lesson with its progress (words practised of all)
const lessonInfo = (focus) => ({
  kind: focus?.kind || 'chat',
  ...(focus?.textId && { textId: focus.textId, textTitle: focus.textTitle }),
  ...(focus?.kind === 'vocab' &&
    focus.words && {
      vocabTotal: focus.words.length,
      vocabDone: (focus.practiced || []).length,
    }),
});

module.exports = {
  buildFocus,
  suggestTexts,
  listVocab,
  applyVocabProgress,
  lessonInfo,
  VOCAB_SOURCES,
  LessonError,
};
