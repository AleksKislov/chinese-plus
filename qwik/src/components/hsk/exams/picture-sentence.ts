/**
 * Free, rule-based checks for HSK 4+ writing part 2 (看图，用词造句): the taker
 * writes a sentence about a picture using a given word. These catch obvious
 * slips only - they can't judge grammar or whether the sentence fits the
 * picture, so the task stays ungraded (see isUngraded in ./types).
 */

export type SentenceCheck = {
  ok: boolean;
  // Shown in the checklist after checking.
  label: string;
  // Shown under the input while typing when this check fails.
  hint: string;
};

// Chinese characters only - what counts towards the sentence length.
const HANZI_RE = /[㐀-鿿]/g;
// Anything but Chinese characters, Chinese punctuation and digits.
const NON_CHINESE_RE = /[^㐀-鿿\s，。！？、：；“”‘’（）《》…—·0-9]/;
const END_PUNCTUATION_RE = /[。！？]$/;

// The official sample answers are 6-12 characters; anything shorter than this
// is a phrase, not a sentence.
const MIN_HANZI = 5;

export const checkPictureSentence = (
  answer: string | undefined,
  word: string | null,
): SentenceCheck[] => {
  const text = (answer || '').trim();
  const hanzi = text.match(HANZI_RE) || [];
  const minHanzi = Math.max(MIN_HANZI, (word?.length || 0) + 3);
  // What is left once the given word is taken out - "日记日记日记" or
  // "日记很好好好" should not pass as a sentence.
  const rest = (word ? text.split(word).join('') : text).match(HANZI_RE) || [];

  return [
    {
      ok: !!text && !NON_CHINESE_RE.test(text),
      label: 'Только китайские иероглифы',
      hint: 'Пишите только китайскими иероглифами — без латиницы и пиньиня.',
    },
    {
      ok: !word || text.includes(word),
      label: word ? `Есть слово «${word}»` : 'Есть заданное слово',
      hint: `В предложении нужно использовать слово «${word}».`,
    },
    {
      ok: hanzi.length >= minHanzi,
      label: `Не короче ${minHanzi} иероглифов`,
      hint: `Слишком коротко: нужно целое предложение, хотя бы ${minHanzi} иероглифов.`,
    },
    {
      ok: new Set(rest).size >= 3,
      label: 'Кроме заданного слова, есть другие слова',
      hint: 'Добавьте к заданному слову другие слова — подлежащее, сказуемое и т. д.',
    },
    {
      ok: END_PUNCTUATION_RE.test(text),
      label: 'В конце стоит 。, ？ или ！',
      hint: 'Поставьте в конце китайский знак препинания: 。, ？ или ！',
    },
  ];
};

/** The first failing check's hint, for showing under the input while typing. */
export const pictureSentenceHint = (answer: string | undefined, word: string | null) => {
  if (!(answer || '').trim()) return null;
  return checkPictureSentence(answer, word).find((c) => !c.ok)?.hint ?? null;
};
