/**
 * Languages of `dictionarytranslations`: a word has at most one translation per language
 * (unique index { wordId, lang }). The site shows one of them, the first the word has in
 * TRANSLATION_LANGS order: russian, else english, else the chinese explanation.
 */
const TRANSLATION_LANGS = ['ru', 'en', 'zh'];

/** The translation the site shows, of the translations (any order) of one word; null if none. */
const pickTranslation = (docs) =>
  TRANSLATION_LANGS.map((lang) => docs.find((d) => d.lang === lang)).find(Boolean) || null;

/** The translation the site shows for every word: Map word id (string) -> translation. */
function pickTranslations(docs) {
  const byWord = new Map();
  docs.forEach((d) => {
    const key = String(d.wordId);
    byWord.set(key, [...(byWord.get(key) || []), d]);
  });
  return new Map([...byWord].map(([key, list]) => [key, pickTranslation(list)]));
}

module.exports = { TRANSLATION_LANGS, pickTranslation, pickTranslations };
