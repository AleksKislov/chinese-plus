// State of the word editor for admins and moderators (/dictionary/edit/[id], /dictionary/add) and its conversion
// to / from the editor shape of the API (server: translations/editable-translation.js).
//
// Text with markup is edited as one string: {c:…} comment, {ref:上海} link to a word,
// {l:…} label, {en:…} english, {py:…} pinyin, {b:…} bold. "\{c:" and "\}" are literal.

import type {
  DictExample,
  TranslationInline,
  TranslationNode,
} from '../../common/translation/types';

export type EditExample = {
  zh?: string;
  pinyin?: string;
  labels?: string[];
  translation?: string;
  content?: TranslationInline[];
};

export type EditNode = Omit<TranslationNode, 'exampleCount' | 'senses'> & {
  senses?: EditNode[];
  examples?: EditExample[];
};

export type TranslationLang = 'ru' | 'en' | 'zh';

// in the order the site picks the translation it shows (server: translations/langs.js)
export const TRANSLATION_LANGS: TranslationLang[] = ['ru', 'en', 'zh'];

export const LANG_TITLES: Record<TranslationLang, string> = {
  ru: 'русский',
  en: 'английский',
  zh: 'китайский (толкование)',
};

export type EditTranslation = {
  lang?: TranslationLang;
  senses: EditNode[];
  examples: EditExample[];
};

export type WordRevision = {
  _id: string;
  date: ISODate;
  action: 'create' | 'edit' | 'rollback';
  editor: string;
  lang: TranslationLang | null; // language of the changed translation, null: pinyin only
  pinyin: string;
  summary: string;
};

export type WordForEdit = {
  word: {
    _id: string;
    chinese: string;
    tradChinese: string;
    pinyin: string;
    updatedAt: ISODate | null;
  };
  // the word's translations: at most one per language
  translations: Partial<Record<TranslationLang, EditTranslation & { parseWarnings: string[] }>>;
  // the one the site shows: russian, else english, else chinese
  shownLang: TranslationLang | null;
  revisions: WordRevision[];
};

export type EditorExample = {
  uid: string;
  zh: string;
  pinyin: string;
  labels: string;
  text: string;
};

export type EditorNode = {
  uid: string;
  kind: '' | 'homonym' | 'section';
  marker: string;
  pinyin: string;
  labels: string; // "ист., г. | разг."
  text: string; // with markup
  examples: EditorExample[];
  senses: EditorNode[];
};

export type EditorState = {
  chinese: string;
  tradChinese: string;
  pinyin: string;
  lang: TranslationLang;
  senses: EditorNode[];
  examples: EditorExample[]; // not under any sense
};

// labels have commas and slashes in them ("ист., г."), but no "|"
const LABEL_SEPARATOR = ' | ';

export const newUid = () => Math.random().toString(36).slice(2, 10);

const MARKUP_TYPES: Record<string, TranslationInline['type']> = {
  c: 'comment',
  ref: 'ref',
  l: 'label',
  en: 'en',
  py: 'pinyin',
  b: 'strong',
};
const MARKUP_PREFIXES = Object.fromEntries(
  Object.entries(MARKUP_TYPES).map(([prefix, type]) => [type, prefix]),
) as Record<TranslationInline['type'], string>;
const MARKUP_START_RE = /\{(c|ref|l|en|py|b):/g;

/** Inline content (or plain text) -> one string with markup. */
export const contentToMarkup = (text?: string, content?: TranslationInline[]): string => {
  if (!content) return (text || '').replace(MARKUP_START_RE, '\\$&');
  return content
    .map((part) =>
      part.type === 'text'
        ? part.value.replace(MARKUP_START_RE, '\\$&')
        : `{${MARKUP_PREFIXES[part.type]}:${part.value.replace(/}/g, '\\}')}}`,
    )
    .join('');
};

/** String with markup -> inline content; plain text when there is no markup. */
export const markupToContent = (
  markup: string,
): { text?: string; content?: TranslationInline[] } => {
  const content: TranslationInline[] = [];
  const push = (type: TranslationInline['type'], value: string) => {
    const prev = content[content.length - 1];
    if (prev && prev.type === type) prev.value += value;
    else if (value) content.push({ type, value });
  };

  let i = 0;
  while (i < markup.length) {
    const rest = markup.slice(i);
    const escaped = rest.match(/^\\(\{(c|ref|l|en|py|b):)/);
    if (escaped) {
      push('text', escaped[1]);
      i += escaped[0].length;
      continue;
    }
    const start = rest.match(/^\{(c|ref|l|en|py|b):/);
    if (start) {
      // the value runs to the first "}" that is not "\}"; unclosed markup stays text
      let j = start[0].length;
      let value = '';
      while (j < rest.length && rest[j] !== '}') {
        if (rest[j] === '\\' && rest[j + 1] === '}') {
          value += '}';
          j += 2;
        } else {
          value += rest[j++];
        }
      }
      if (j < rest.length) {
        push(MARKUP_TYPES[start[1]], value);
        i += j + 1;
        continue;
      }
    }
    push('text', markup[i]);
    i++;
  }

  if (content.every((part) => part.type === 'text')) {
    return { text: content.map((part) => part.value).join('') };
  }
  return { text: content.map((part) => part.value).join(''), content };
};

const labelsToString = (labels?: string[]) => (labels || []).join(LABEL_SEPARATOR);
const stringToLabels = (s: string) =>
  s
    .split('|')
    .map((label) => label.trim())
    .filter(Boolean);

const toEditorExample = (e: EditExample): EditorExample => ({
  uid: newUid(),
  zh: e.zh || '',
  pinyin: e.pinyin || '',
  labels: labelsToString(e.labels),
  text: contentToMarkup(e.translation, e.content),
});

const toEditorNode = (n: EditNode): EditorNode => ({
  uid: newUid(),
  kind: n.kind || '',
  marker: n.marker || '',
  pinyin: n.pinyin || '',
  labels: labelsToString(n.labels),
  text: contentToMarkup(n.text, n.content),
  examples: (n.examples || []).map(toEditorExample),
  senses: (n.senses || []).map(toEditorNode),
});

export const emptyNode = (): EditorNode => toEditorNode({});
export const emptyExample = (): EditorExample => toEditorExample({});

export const toEditorState = (
  word: { chinese: string; tradChinese: string; pinyin: string },
  translation: EditTranslation,
): EditorState => ({
  chinese: word.chinese,
  tradChinese: word.tradChinese,
  pinyin: (word.pinyin || '').trim(),
  lang: translation.lang || 'ru',
  senses: translation.senses.map(toEditorNode),
  examples: translation.examples.map(toEditorExample),
});

/** Editor state for the word's translation in `lang`; one empty sense when it has none yet. */
export const editorStateFor = (data: WordForEdit, lang: TranslationLang): EditorState => {
  const translation = data.translations[lang] || { senses: [{}], examples: [] };
  return toEditorState(data.word, { ...translation, lang });
};

const fromEditorExample = (e: EditorExample): EditExample => {
  const { text, content } = markupToContent(e.text);
  const out: EditExample = { zh: e.zh, pinyin: e.pinyin, translation: text };
  const labels = stringToLabels(e.labels);
  if (labels.length) out.labels = labels;
  if (content) out.content = content;
  return out;
};

const fromEditorNode = (n: EditorNode): EditNode => {
  const { text, content } = markupToContent(n.text);
  const out: EditNode = { marker: n.marker, pinyin: n.pinyin, text };
  if (n.kind) out.kind = n.kind;
  const labels = stringToLabels(n.labels);
  if (labels.length) out.labels = labels;
  if (content) out.content = content;
  if (n.examples.length) out.examples = n.examples.map(fromEditorExample);
  if (n.senses.length) out.senses = n.senses.map(fromEditorNode);
  return out;
};

/** Translation to send to the API (it trims and checks everything itself). */
export const fromEditorState = (
  state: EditorState,
): EditTranslation & { lang: TranslationLang } => ({
  lang: state.lang,
  senses: state.senses.map(fromEditorNode),
  examples: state.examples.map(fromEditorExample),
});

/** Everything the editor would save, to tell whether there are unsaved changes. */
export const editorSnapshot = (state: EditorState) =>
  JSON.stringify([state.chinese, state.tradChinese, state.pinyin, fromEditorState(state)]);

/** Translation in the shape ParsedTranslation renders, for the preview. */
export const toPreview = (
  state: EditorState,
): { senses: TranslationNode[]; examples: DictExample[] } => {
  const examples: DictExample[] = [];
  const addExamples = (list: EditorExample[], senseId: string | null) =>
    list.forEach((e) => {
      const { zh, pinyin, labels, translation, content } = fromEditorExample(e);
      examples.push({
        senseId,
        order: examples.length,
        zh,
        pinyin,
        labels,
        translation: translation || '',
        content,
      });
    });

  const walk = (list: EditorNode[], prefix: string): TranslationNode[] =>
    list.map((n, i) => {
      const id = prefix ? `${prefix}.${i + 1}` : `${i + 1}`;
      const node: TranslationNode = fromEditorNode(n);
      delete (node as EditNode).examples;
      addExamples(n.examples, id);
      node.senses = n.senses.length ? walk(n.senses, id) : undefined;
      return node;
    });

  addExamples(state.examples, null);
  return { senses: walk(state.senses, ''), examples };
};

/** Every sense with its position ('2.1') and a short title, for "move example to" selects. */
export const senseOptions = (state: EditorState): { id: string; uid: string; title: string }[] => {
  const out: { id: string; uid: string; title: string }[] = [];
  const walk = (list: EditorNode[], prefix: string) =>
    list.forEach((n, i) => {
      const id = prefix ? `${prefix}.${i + 1}` : `${i + 1}`;
      const title = [n.marker, markupToContent(n.text).text || n.labels].filter(Boolean).join(' ');
      out.push({ id, uid: n.uid, title: title.slice(0, 40) });
      walk(n.senses, id);
    });
  walk(state.senses, '');
  return out;
};

export const findNode = (list: EditorNode[], uid: string): EditorNode | null => {
  for (const n of list) {
    if (n.uid === uid) return n;
    const inner = findNode(n.senses, uid);
    if (inner) return inner;
  }
  return null;
};

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
const CYR_UPPER = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ';
const CYR_LOWER = 'абвгдежзиклмнопрстуфхцчшщэюя';

const nextMarker = (style: string, i: number) => {
  if (/^\d+$/.test(style)) return String(i + 1);
  if (ROMAN.includes(style)) return ROMAN[i] || String(i + 1);
  if (CYR_UPPER.includes(style)) return CYR_UPPER[i] || String(i + 1);
  if (CYR_LOWER.includes(style)) return CYR_LOWER[i] || String(i + 1);
  return style;
};

/**
 * Renumbers the markers that are set, in each list of siblings, keeping their style
 * (1, 2… / I, II… / А, Б… / а, б…) taken from the first marked sense of the list.
 */
export const renumber = (list: EditorNode[]) => {
  const marked = list.filter((n) => n.marker.trim());
  const style = marked[0]?.marker.trim() || '';
  marked.forEach((n, i) => (n.marker = nextMarker(style, i)));
  list.forEach((n) => renumber(n.senses));
};
