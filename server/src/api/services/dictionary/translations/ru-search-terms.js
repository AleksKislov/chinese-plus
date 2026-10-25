/**
 * Russian search fields for `dictionarytranslations`, built from the parsed senses
 * (see parse-dsl-translation.js). Only words with lang 'ru' get them.
 *
 *   ruTerms - short glosses for exact / prefix lookup: "кот, кошка" -> ['кот', 'кошка'].
 *             Stored normalized (lowercase, ё -> е), so queries must go through
 *             normalizeRu() too; an anchored regex (/^кош/) then uses the plain index.
 */

const CYRILLIC_RE = /[а-яё]/i;
const MAX_TERM_LENGTH = 60;
const MAX_TERM_WORDS = 5;
const MAX_TERMS = 50;

// segments that are not the translation itself: (comments), labels, refs, pinyin, english
const TERM_SEGMENT_TYPES = new Set(['text', 'strong']);

const normalizeRu = (s) => s.toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim();

function senseTermSource(node) {
  if (!node.content) return node.text || '';
  return node.content
    .map((s) => (TERM_SEGMENT_TYPES.has(s.type) ? s.value : ' '))
    .join('');
}

function termsFromText(text) {
  let s = text;
  // nested parentheses: "пробка (напр. бутылки (стеклянной))"
  for (let prev = null; prev !== s; ) {
    prev = s;
    s = s.replace(/\([^()]*\)/g, ' ');
  }
  return s
    .split(/[;,]/)
    // optional parts give both variants: "в конце [концов]" -> "в конце", "в конце концов"
    .flatMap((t) => (/\[[^[\]]*\]/.test(t) ? [t.replace(/\[[^[\]]*\]/g, ''), t.replace(/[[\]]/g, '')] : [t]))
    .map((t) => normalizeRu(t.replace(/^[\s*—–\-:.]+|[\s.!?…:—–\-]+$/g, '')))
    .filter(
      (t) =>
        CYRILLIC_RE.test(t) &&
        t.length <= MAX_TERM_LENGTH &&
        t.split(' ').length <= MAX_TERM_WORDS
    );
}

function buildRuSearch(senses) {
  const terms = new Set();
  const walk = (list) => {
    for (const node of list) {
      if (node.text) {
        for (const term of termsFromText(senseTermSource(node))) {
          if (terms.size < MAX_TERMS) terms.add(term);
        }
      }
      if (node.senses) walk(node.senses);
    }
  };
  walk(senses);
  return { ruTerms: [...terms] };
}

module.exports = { buildRuSearch, normalizeRu };
