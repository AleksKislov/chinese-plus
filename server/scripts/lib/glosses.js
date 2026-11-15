/**
 * Short Russian glosses and readings of dictionary entries, shared by the export scripts
 * (export-pinyin-chars.js, export-top-chars.js).
 */
const MAX_GLOSS = 24;
const GLOSS_INLINE_TYPES = ['text', 'strong', 'en'];

const normPinyin = (py) => (py || '').trim().toLowerCase().normalize('NFC');
/** Readings of a dictionary entry: ' hǎo, hào' -> ['hǎo', 'hào']. */
const readingsOf = (pinyin) =>
  normPinyin(pinyin)
    .split(/[,;\s/]+/)
    .filter(Boolean);

/** 'лошадь; конь; конский' -> 'лошадь'; drops bracketed comments, cuts to maxLength. */
function shortGloss(text, maxLength = MAX_GLOSS) {
  let gloss = (text || '').replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '');
  gloss = gloss.split(';')[0].replace(/^\s*\*\s*/, '');
  gloss = gloss
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.:!?])/g, '$1')
    .trim();
  if (gloss.length > maxLength) gloss = gloss.split(',')[0].trim();
  if (gloss.length > maxLength) gloss = `${gloss.slice(0, maxLength - 1).trim()}…`;
  gloss = gloss.replace(/^[\s,:.]+|[\s,:.]+$/g, '');
  // no russian word, or pinyin left in it ('а, ă' for 啊)
  return /[а-яё]/i.test(gloss) && !/[À-ɏ]/.test(gloss) ? gloss : '';
}

/** Meaning of a sense without its comments and labels ('местоименная связка…' is a comment). */
const senseText = (node) =>
  node.content
    ? node.content
        .map((inline) => (GLOSS_INLINE_TYPES.includes(inline.type) ? inline.value : ''))
        .join('')
    : node.text || '';

/** First non-empty gloss in a senses tree (depth first). */
function firstGloss(nodes, maxLength) {
  for (const node of nodes || []) {
    const gloss = shortGloss(senseText(node), maxLength);
    if (gloss) return gloss;
    const nested = firstGloss(node.senses, maxLength);
    if (nested) return nested;
  }
  return '';
}

/** Dictionary gloss of `reading` from an entry with these readings and senses. */
function dictionaryGloss(reading, dictPinyin, senses, maxLength) {
  const homonyms = senses || [];
  if (readingsOf(dictPinyin)[0] === reading) {
    // the first reading: homonyms in order, except those marked with another reading
    return firstGloss(
      homonyms.filter(
        (h) => !readingsOf(h.pinyin).length || readingsOf(h.pinyin).includes(reading),
      ),
      maxLength,
    );
  }
  return firstGloss(
    homonyms.filter((h) => readingsOf(h.pinyin).includes(reading)),
    maxLength,
  );
}

const SYLLABLE_RE = /^[a-zāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜü]+$/;

/**
 * Like dictionaryGloss, but also follows the readings marked on single senses (说 has one homonym
 * whose senses are marked shuō, then yuè), and falls back to the sense's comment when it has no
 * plain meaning (们: 'суффикс множественного числа…'). A homonym or sense without a reading of
 * its own (or with a mark like 'A') has the reading of its parent, the entry's first reading at
 * the top.
 */
function readingGloss(reading, dictPinyin, senses, maxLength) {
  const walk = (nodes, inherited) => {
    for (const node of nodes || []) {
      const own = readingsOf(node.pinyin).filter((r) => SYLLABLE_RE.test(r));
      const readings = own.length ? own : inherited;
      if (readings.includes(reading)) {
        const gloss =
          shortGloss(senseText(node), maxLength) || shortGloss(node.text || '', maxLength);
        if (gloss) return gloss;
      }
      const nested = walk(node.senses, readings);
      if (nested) return nested;
    }
    return '';
  };
  return walk(senses, readingsOf(dictPinyin).slice(0, 1));
}

module.exports = { MAX_GLOSS, normPinyin, readingsOf, shortGloss, dictionaryGloss, readingGloss };
