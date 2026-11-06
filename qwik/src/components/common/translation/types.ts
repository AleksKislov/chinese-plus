// Parsed dictionary translation, served by GET /api/dictionary/translation/:wordId
// (server: src/api/services/dictionary/translations/parse-dsl.js).

export type TranslationInline = {
  type: 'text' | 'label' | 'comment' | 'ref' | 'pinyin' | 'en' | 'strong';
  value: string;
};

export type TranslationNode = {
  kind?: 'homonym' | 'section';
  marker?: string; // 'I' | 'А' | '1' | 'а'
  pinyin?: string;
  labels?: string[];
  text?: string; // plain text
  content?: TranslationInline[]; // only when the text has markup
  exampleCount?: number;
  senses?: TranslationNode[];
};

export type DictTranslation = {
  wordId: string;
  chinese: string;
  lang: 'ru' | 'en' | 'zh';
  senses: TranslationNode[];
  exampleCount: number;
};

export type DictExample = {
  senseId: string | null; // position of the sense: '2.1' = senses[1].senses[0]
  order: number;
  zh?: string;
  pinyin?: string;
  labels?: string[];
  translation: string;
  content?: TranslationInline[];
};

export type DictTranslationResponse = {
  translation: DictTranslation | null;
  examples: DictExample[];
};

/** Plain text of all senses, e.g. for meta descriptions. */
export const translationToText = (senses: TranslationNode[]): string =>
  senses
    .flatMap((node) => [
      [...(node.labels || []), node.text].filter(Boolean).join(' '),
      node.senses ? translationToText(node.senses) : '',
    ])
    .filter(Boolean)
    .join('; ');
