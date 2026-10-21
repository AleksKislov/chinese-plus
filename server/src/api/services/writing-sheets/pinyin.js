// tone-marked letter -> plain lowercase letter (ü and its tones -> v), one char to one char,
// so syllable borders found in the plain string map back onto the original
const toPlain = (ch) => {
  const nfd = ch.normalize('NFD');
  if (/u/i.test(nfd[0]) && nfd.includes('̈')) return 'v';
  return nfd[0].toLowerCase();
};

const SYLLABLE_RE =
  /(?:[zcs]h|[bpmfdtnlgkhjqxrzcsyw])?[aeiouv]+(?:ng(?![aeiouv])|n(?![aeiouv])|r(?![aeiouv]))?/g;

const HAN_RE = /\p{Script=Han}/u;

const splitPinyin = (py) => {
  const letters = [...py.normalize('NFC')];
  const plain = letters.map(toPlain).join('');
  return [...plain.matchAll(SYLLABLE_RE)].map((m) => {
    // only èr itself keeps its r, zhèr -> zhè (erhua)
    const len = m[0].endsWith('r') && m[0] !== 'er' ? m[0].length - 1 : m[0].length;
    return letters
      .slice(m.index, m.index + len)
      .join('')
      .toLowerCase();
  });
};

// 'bàba' for 爸爸 -> [['爸', 'bà'], ['爸', 'ba']]; null when syllables don't line up with characters
const splitWordPinyin = (cn, py) => {
  const chars = [...cn];
  if (!chars.length || !chars.every((ch) => HAN_RE.test(ch))) return null;

  const syllables = splitPinyin(py || '');
  // erhua: 一点儿 yìdiǎnr - 儿 has no syllable of its own
  if (chars.length === syllables.length + 1 && chars[chars.length - 1] === '儿') chars.pop();
  if (chars.length !== syllables.length) return null;
  return chars.map((ch, i) => [ch, syllables[i]]);
};

const isNeutral = (syllable) => !/[̀́̄̌]/.test(syllable.normalize('NFD'));

module.exports = { splitPinyin, splitWordPinyin, isNeutral, HAN_RE };
