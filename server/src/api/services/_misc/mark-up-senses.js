// HTML for CSV/Anki cards from a parsed translation (dictionarytranslations), styled like
// markupTranslation() does for the DSL markup
const BLUE = 'color: #3a6ea5;';
const GREEN = 'color: #3e8d63;';

const escapeHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const INLINE_STYLES = {
  label: (v) => `<em style='font-size: 0.8em; ${GREEN}'>${v}</em>`,
  comment: (v) => `<em>${v}</em>`,
  pinyin: (v) => `<strong style='${GREEN}'>${v}</strong>`,
  strong: (v) => `<strong style='${GREEN}'>${v}</strong>`,
  en: (v) => `<span style='${GREEN}'>${v}</span>`,
};

const inlineHtml = (parts) =>
  parts.map(({ type, value }) => (INLINE_STYLES[type] || ((v) => v))(escapeHtml(value))).join('');

const labelsHtml = (labels) =>
  labels?.length ? `${INLINE_STYLES.label(escapeHtml(labels.join(' ')))} ` : '';

const exampleHtml = (example) =>
  `<div style='${BLUE} text-indent: 5px;'>${escapeHtml(example.zh || '')} ` +
  `${example.pinyin ? `${INLINE_STYLES.pinyin(escapeHtml(example.pinyin))} ` : ''}` +
  `${labelsHtml(example.labels)}` +
  `${example.content ? inlineHtml(example.content) : escapeHtml(example.translation)}</div>`;

/**
 * @param {object[]} senses - parsed translation tree
 * @param {object[]} examples - the word's examples, rendered under their senses
 */
const markupSenses = (senses, examples = []) => {
  const bySense = new Map();
  examples.forEach((ex) => {
    const key = ex.senseId ?? '';
    bySense.set(key, [...(bySense.get(key) || []), ex]);
  });

  const nodeHtml = (node, id) => {
    const isGroup = node.kind === 'homonym' || node.kind === 'section';
    const marker = node.marker
      ? isGroup
        ? `${INLINE_STYLES.strong(escapeHtml(node.marker))} `
        : `${escapeHtml(node.marker)}) `
      : '';
    const pinyin = node.pinyin ? `${INLINE_STYLES.pinyin(escapeHtml(node.pinyin))} ` : '';
    const text = node.content ? inlineHtml(node.content) : escapeHtml(node.text || '');
    const children = (node.senses || [])
      .map((child, i) => nodeHtml(child, `${id}.${i + 1}`))
      .join('');
    const exs = (bySense.get(id) || []).map(exampleHtml).join('');
    return `<span style='display: block;'>${marker}${pinyin}${labelsHtml(node.labels)}${text}</span>${exs}${children}`;
  };

  return (
    senses.map((node, i) => nodeHtml(node, `${i + 1}`)).join('') +
    (bySense.get('') || []).map(exampleHtml).join('')
  );
};

/** Plain text of the senses: 'гл. получать; добывать; ...' */
const sensesToText = (senses) =>
  senses
    .flatMap((node) => [
      [...(node.labels || []), node.text].filter(Boolean).join(' '),
      node.senses ? sensesToText(node.senses) : '',
    ])
    .filter(Boolean)
    .join('; ');

module.exports = { markupSenses, sensesToText };
