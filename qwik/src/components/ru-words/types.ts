// "Мама на китайском": curated words in server/content/ru-words/ru-words.json, served by api/ru-words

import { type NameChar } from '~/components/names/types';

export type WordAudio = {
  hsk: string | null; // lowest HSK 3.0 level: '1'..'6' | '789'
  audio: string | null; // path in the audio bucket (CONST_URLS.myAudioURL)
};

export type RuWordAlt = WordAudio & { cn: string; py: string; ru: string };

export type RuWordLink = { slug: string; ru: string; cn: string };

export type RuWordPage = {
  type: 'word';
  word: WordAudio & {
    slug: string;
    ru: string; // lowercase, except proper nouns ("Китай")
    cn: string;
    py: string;
    note: string;
    also: string[];
    alt: RuWordAlt[];
    meaning: string; // first meaning in the dictionary
  };
  chars: NameChar[];
  examples: { zh: string; pinyin?: string; translation: string }[];
  topic: { slug: string; name: string; title: string };
  related: RuWordLink[];
  prev: RuWordLink | null;
  next: RuWordLink | null;
  nameSlug: string | null; // the word is also a Russian name ("Надежда")
};

export type RuTopicPage = {
  type: 'topic';
  topic: { slug: string; name: string; title: string; intro: string };
  words: (WordAudio & { slug: string; ru: string; cn: string; py: string })[];
  topics: { slug: string; title: string }[];
};

export type RuWordResponse = RuWordPage | RuTopicPage;

export type RuWordTopicListItem = {
  slug: string;
  name: string;
  title: string;
  words: { slug: string; ru: string; cn: string; py: string; also: string[] }[];
};

export const ruWordsHubUrl = '/na-kitayskom/';
export const ruWordUrl = (slug: string) => `/na-kitayskom/${slug}/`;

/** "мама" -> "Мама" (for titles; proper nouns are already capitalized) */
export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
