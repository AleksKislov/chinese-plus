// style='color: #3a6ea5;'  /* Medium blue, good balance */
// style='color: #4682B4;'  /* Steel blue, classic and readable */
// style='color: #5e81ac;'  /* Nordic blue, easy on the eyes */
// style='color: #6c7b95;'  /* Slate blue, subtle but distinct */
// style='color: #3e8d63;'  /* Forest green, natural looking */
// style='color: #4d9375;'  /* Sage green, balanced visibility */
// style='color: #539165;'  /* Moss green, good contrast */
// style='color: #588157;'  /* Medium green, works well everywhere */

const BLUE = 'color: #3a6ea5;';
const GREEN = 'color: #3e8d63;';

const markupTranslation = (text, hasExamples = false) => {
  if (!text) return ' ';

  return text
    .replace(/\[b\]\\\[o\\\]\d\[\/b\]/g, '')
    .replace(/\[b\]/g, `<strong style='${GREEN}'>`)
    .replace(/\[\/b\]/g, '</strong>')
    .replace(/\[c\]/g, `<span style='${GREEN}'>`)
    .replace(/\[\/c\]/g, '</span>')
    .replace(/\[p\]/g, `<em style='font-size: 0.8em; ${GREEN}'>`)
    .replace(/\[\/p\]/g, '</em>')
    .replace(/\[i\]/g, '<em>')
    .replace(/\[\/i\]/g, '</em>')
    .replace(/\[m1\]/g, "<span style='display: block;'>")
    .replace(/\[m\d\]/g, "<span style='display: block;'>")
    .replace(/\[\/m\]/g, '</span>')
    .replace(
      /\[\*\]\[ex\]/g,
      `<div style='${BLUE} text-indent: 5px; ${hasExamples ? '' : 'display: none;'}'>`,
    )
    .replace(/\[\/ex\]\[\/\*\]/g, '</div>')
    .replace(/\\\[(.+?)\\\]/g, '($1)');
};

module.exports = {
  markupTranslation,
};
