// "Имя на китайском": data built by server/scripts/build-names.js, served by api/names

export type NameChar = { ch: string; py: string; meaning: string };

export type NameVariant = {
  cn: string;
  py: string;
  chars?: NameChar[]; // full names only, not short forms
  warn?: string[]; // characters with a bad meaning
};

export type RuName = {
  slug: string;
  name: string;
  gender: 'm' | 'f';
  variants: NameVariant[];
  short: { name: string; variants: NameVariant[] }[];
};

export type NameLink = { slug: string; name: string; cn: string };

export type NameResponse = { name: RuName; prev: NameLink | null; next: NameLink | null };

export type NameListItem = {
  slug: string;
  name: string;
  gender: 'm' | 'f';
  cn: string;
  py: string;
  short: string[];
};

export const namesHubUrl = '/names/';
export const nameUrl = (slug: string) => `/names/${slug}/`;
export const dictionaryUrl = (word: string) => `/dictionary/${encodeURIComponent(word)}`;
