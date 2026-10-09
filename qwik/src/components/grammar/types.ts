import { type TooltipSegment } from '~/misc/helpers/content/parse-text-words';

export type GrammarExample = {
  cn: string;
  segments: TooltipSegment[]; // cn split into dictionary words, for tooltips
  py: string;
  ru: string;
  audio?: string; // path under CONST_URLS.myAudioURL
};

export type GrammarRule = {
  title: string;
  pattern?: string;
  text?: string;
  examples: GrammarExample[];
};

export type GrammarTopic = {
  _id: string;
  slug: string;
  level: string;
  ind: number;
  category: GrammarCategory;
  group?: string;
  title: { cn: string; ru: string };
  items: string[];
  summary: string;
  rules: GrammarRule[];
  notes: string[];
};

// level page list item: the full topic is loaded when it is opened
export type GrammarTopicSummary = Pick<
  GrammarTopic,
  'slug' | 'level' | 'ind' | 'category' | 'title' | 'items' | 'summary'
>;

export type GrammarTopicLink = { slug: string; title: { cn: string; ru: string } };

export type GrammarTopicResponse = {
  topic: GrammarTopic;
  prev: GrammarTopicLink | null;
  next: GrammarTopicLink | null;
};

export type GrammarLevelInfo = { level: string; count: number };

// syllabus sections, in syllabus order
export const GRAMMAR_CATEGORIES = {
  morphemes: { cn: '语素', ru: 'Морфемы' },
  'word-classes': { cn: '词类', ru: 'Части речи' },
  phrases: { cn: '短语', ru: 'Словосочетания' },
  'sentence-parts': { cn: '句子成分', ru: 'Члены предложения' },
  'sentence-types': { cn: '句子的类型', ru: 'Типы предложений' },
  aspects: { cn: '动作的态', ru: 'Виды действия' },
  expressions: { cn: '特殊表达法', ru: 'Особые способы выражения' },
  discourse: { cn: '语段（句群）', ru: 'Связный текст' },
} as const;

export type GrammarCategory = keyof typeof GRAMMAR_CATEGORIES;

export const grammarLevelLabel = (level: string) => (level === '789' ? '7-9' : level);

export const GRAMMAR_PATH = '/start/textbook';
export const grammarLevelUrl = (level: string) =>
  level === '1' ? `${GRAMMAR_PATH}/` : `${GRAMMAR_PATH}/?lvl=${level}`;
export const grammarTopicUrl = (slug: string) => `${GRAMMAR_PATH}/${slug}/`;
