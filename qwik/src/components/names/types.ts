// "Имя на китайском": data built by server/scripts/build-names.js, served by api/names

export type NameChar = { ch: string; py: string; meaning: string };

export type NameVariant = {
  cn: string;
  py: string;
  chars?: NameChar[]; // full names only, not short forms
  warn?: string[]; // characters with a bad meaning
};

// 'mf': a short form of both a male and a female name (Саша, Женя)
export type NameGender = 'm' | 'f' | 'mf';

export type RuName = {
  kind: 'full' | 'short';
  slug: string;
  name: string;
  gender: NameGender;
  of?: { slug: string; name: string }[]; // short forms only: the full names
  variants: NameVariant[];
  short: { name: string; slug: string; variants: NameVariant[] }[];
};

export type NameLink = { slug: string; name: string; cn: string };

export type NameResponse = { name: RuName; prev: NameLink | null; next: NameLink | null };

export type NameListItem = {
  kind: 'full' | 'short';
  slug: string;
  name: string;
  gender: NameGender;
  cn: string;
  py: string;
  short: { name: string; slug: string }[];
};

export const namesHubUrl = '/names/';
export const nameUrl = (slug: string) => `/names/${slug}/`;
export const namesOgImage = '/img/og/names.png';
export const dictionaryUrl = (word: string) => `/dictionary/${encodeURIComponent(word)}`;
