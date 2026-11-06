const { HttpError } = require('../../../http-error');
const { TRANSLATION_LANGS } = require('./langs');
const { buildRuSearch } = require('./ru-search-terms');

/**
 * Translation of a word in the shape the word editor (admins, moderators) gets and sends back:
 *
 *   { lang, senses: [EditNode], examples: [EditExample] }  // `examples`: not under any sense
 *   lang: 'ru' | 'en' | 'zh' - a word has one translation per language (translations/langs.js)
 *
 *   EditNode    = Node of parse-dsl.js without exampleCount, with the examples of that sense:
 *                 { kind?, marker?, pinyin?, labels?, text?, content?, senses?, examples? }
 *   EditExample = { zh?, pinyin?, labels?, translation?, content? }
 *
 * Examples stay inside their sense, so a sense moved in the editor takes its examples along;
 * senseId, order and exampleCount are worked out here from the positions.
 */

const KINDS = ['homonym', 'section'];
const INLINE_TYPES = ['text', 'label', 'comment', 'ref', 'pinyin', 'en', 'strong'];
// the parsed data goes up to depth 4, 106 senses, 103 examples, 1223 chars of text
const LIMITS = {
  depth: 5,
  nodes: 300,
  examples: 500,
  text: 3000,
  labels: 10,
  label: 100,
  marker: 10,
  pinyin: 300,
  zh: 1000,
};

const invalid = (where, what) => new HttpError(400, `${where}: ${what}`);

/** Trimmed string, undefined when empty. */
function str(value, max, where) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') throw invalid(where, 'ожидается строка');
  const s = value.trim();
  if (s.length > max) throw invalid(where, `длиннее ${max} символов`);
  return s || undefined;
}

function labelList(value, where) {
  if (value === undefined || value === null) return undefined;
  if (!Array.isArray(value) || value.length > LIMITS.labels) {
    throw invalid(where, `не больше ${LIMITS.labels} пометок`);
  }
  const labels = value.map((label) => str(label, LIMITS.label, where)).filter(Boolean);
  return labels.length ? labels : undefined;
}

/** { text, content? }: `content` only when the text has markup, `text` is its plain text. */
function richText(textValue, contentValue, where) {
  if (contentValue === undefined || contentValue === null) {
    const text = str(textValue, LIMITS.text, where);
    return text ? { text } : {};
  }
  if (!Array.isArray(contentValue)) throw invalid(where, 'content должен быть массивом');

  let content = [];
  for (const part of contentValue) {
    if (!part || !INLINE_TYPES.includes(part.type) || typeof part.value !== 'string') {
      throw invalid(where, 'неверный фрагмент текста');
    }
    const prev = content[content.length - 1];
    if (prev && prev.type === part.type) prev.value += part.value;
    else content.push({ type: part.type, value: part.value });
  }
  // the whole text is trimmed, not every fragment
  if (content.length) {
    content[0].value = content[0].value.trimStart();
    content[content.length - 1].value = content[content.length - 1].value.trimEnd();
  }
  content = content.filter((part) => part.value);

  // as in parse-dsl.js: fragments keep their spaces, the plain text has them squashed
  const text = content
    .map((part) => part.value)
    .join('')
    .replace(/\s+/g, ' ');
  if (text.length > LIMITS.text) throw invalid(where, `длиннее ${LIMITS.text} символов`);
  if (!text) return {};
  return content.every((part) => part.type === 'text') ? { text } : { text, content };
}

function normalizeExample(input, where) {
  if (!input || typeof input !== 'object') throw invalid(where, 'неверный пример');
  const example = {};
  const zh = str(input.zh, LIMITS.zh, where);
  const pinyin = str(input.pinyin, LIMITS.pinyin, where);
  const labels = labelList(input.labels, where);
  const { text, content } = richText(input.translation, input.content, where);
  if (!zh && !text) throw invalid(where, 'пустой пример');

  if (zh) example.zh = zh;
  if (pinyin) example.pinyin = pinyin;
  if (labels) example.labels = labels;
  example.translation = text || '';
  if (content) example.content = content;
  return example;
}

/**
 * Checks the translation sent by the editor and builds what is stored:
 * { lang, senses, exampleCount, ruTerms?, examples: [{ senseId, zh?, ..., translation }] }
 * (examples in reading order, their index is `order`). Throws HttpError 400 on bad input.
 */
function normalizeTranslation(input) {
  if (!input || typeof input !== 'object') throw invalid('Перевод', 'нет данных');
  if (!TRANSLATION_LANGS.includes(input.lang)) throw invalid('Перевод', 'не указан язык');

  const examples = [];
  let nodeCount = 0;

  const takeExamples = (list, senseId, where) => {
    if (list === undefined || list === null) return 0;
    if (!Array.isArray(list)) throw invalid(where, 'examples должен быть массивом');
    list.forEach((e, i) =>
      examples.push({ senseId, ...normalizeExample(e, `${where}, пример ${i + 1}`) }),
    );
    if (examples.length > LIMITS.examples) {
      throw invalid('Перевод', `больше ${LIMITS.examples} примеров`);
    }
    return list.length;
  };

  const walk = (list, prefix, depth) => {
    if (!Array.isArray(list)) throw invalid(`Значение ${prefix}`, 'senses должен быть массивом');
    if (list.length && depth > LIMITS.depth) {
      throw invalid(`Значение ${prefix}`, `вложенность больше ${LIMITS.depth}`);
    }
    return list.map((input, i) => {
      const id = prefix ? `${prefix}.${i + 1}` : `${i + 1}`;
      const where = `Значение ${id}`;
      if (!input || typeof input !== 'object') throw invalid(where, 'неверное значение');
      if (++nodeCount > LIMITS.nodes) throw invalid('Перевод', `больше ${LIMITS.nodes} значений`);
      if (input.kind && !KINDS.includes(input.kind)) throw invalid(where, 'неверный тип');

      // keys in the order of parse-dsl.js
      const node = {};
      if (input.kind) node.kind = input.kind;
      const marker = str(input.marker, LIMITS.marker, where);
      if (marker) node.marker = marker;
      const pinyin = str(input.pinyin, LIMITS.pinyin, where);
      if (pinyin) node.pinyin = pinyin;
      const labels = labelList(input.labels, where);
      if (labels) node.labels = labels;
      Object.assign(node, richText(input.text, input.content, where));
      const exampleCount = takeExamples(input.examples, id, where);
      if (exampleCount) node.exampleCount = exampleCount;
      const senses =
        input.senses === undefined || input.senses === null
          ? []
          : walk(input.senses, id, depth + 1);
      if (senses.length) node.senses = senses;

      if (Object.keys(node).length === (node.kind ? 1 : 0)) throw invalid(where, 'пустое значение');
      return node;
    });
  };

  takeExamples(input.examples, null, 'Примеры без значения');
  const senses = walk(input.senses ?? [], '', 1);
  if (!senses.length && !examples.length) throw invalid('Перевод', 'пустой');

  const { lang } = input;
  return {
    lang,
    senses,
    exampleCount: examples.length,
    ...(lang === 'ru' ? buildRuSearch(senses) : {}),
    examples,
  };
}

const EXAMPLE_KEYS = ['zh', 'pinyin', 'labels', 'translation', 'content'];

/**
 * Stored senses + examples (with senseId / order) -> the editor shape. Examples whose sense
 * does not exist go with the ones not under any sense.
 */
function toEditable(senses, examples) {
  const bySense = new Map();
  for (const example of [...examples].sort((a, b) => a.order - b.order)) {
    const out = {};
    for (const key of EXAMPLE_KEYS) if (example[key] !== undefined) out[key] = example[key];
    const key = example.senseId || '';
    if (!bySense.has(key)) bySense.set(key, []);
    bySense.get(key).push(out);
  }

  const walk = (list, prefix) =>
    list.map((node, i) => {
      const id = prefix ? `${prefix}.${i + 1}` : `${i + 1}`;
      const { exampleCount, senses: children, ...out } = node;
      if (children) out.senses = walk(children, id);
      if (bySense.has(id)) {
        out.examples = bySense.get(id);
        bySense.delete(id);
      }
      return out;
    });

  const editable = walk(senses || [], '');
  const rootExamples = bySense.get('') || [];
  bySense.delete('');
  return { senses: editable, examples: [...rootExamples, ...[...bySense.values()].flat()] };
}

module.exports = { normalizeTranslation, toEditable };
