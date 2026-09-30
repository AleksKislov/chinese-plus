import { type ExamSectionType } from './types';

export type HskVersion = 'old' | 'new';

// URL segment for each standard - the same "2"/"3" the word lists use (/hsk/2/table, /hsk/3/table).
export const VERSION_SEGMENT: Record<HskVersion, '2' | '3'> = { old: '2', new: '3' };
export const VERSION_NAME: Record<HskVersion, string> = { old: 'HSK 2.0', new: 'HSK 3.0' };

// HSK 3.0 levels 7-9 are one exam, stored as level "7".
export const HSK_LEVELS: Record<HskVersion, string[]> = {
  old: ['1', '2', '3', '4', '5', '6'],
  new: ['1', '2', '3', '4', '5', '6', '7'],
};

export const levelLabel = (version: HskVersion, lvl: string) =>
  version === 'new' && lvl === '7' ? '7–9' : lvl;

// How searchers name a level: plain "HSK 1" for the old standard, which is what
// everyone still means by it, and an explicit "(HSK 3.0)" for the new one.
export const levelName = (version: HskVersion, lvl: string) =>
  `HSK ${levelLabel(version, lvl)}${version === 'new' ? ' (HSK 3.0)' : ''}`;

export const examsPath = (version?: HskVersion | '', lvl?: string) =>
  `/hsk/exams/${version ? `${VERSION_SEGMENT[version]}/` : ''}${version && lvl ? `${lvl}/` : ''}`;

export const wordsPath = (version: HskVersion, lvl: string) =>
  `/hsk/${VERSION_SEGMENT[version]}/table?lvl=${lvl}`;

export const wordTestsPath = (version: HskVersion, lvl: string) =>
  `/hsk/${VERSION_SEGMENT[version]}/tests?lvl=${lvl}`;

export const ogImagePath = (version?: HskVersion | '', lvl?: string) =>
  `/img/og/hsk-exams${version ? `-${version}` : ''}${version && lvl ? `-${lvl}` : ''}.png`;

// Slugs follow "{version}-{level}-{variant}" (see server/content/hsk-exams/README.md):
// "old-1-h11329" -> "H11329", "new-1-exam-1" -> "№1". Anything else is shown as is.
export const getExamVariant = ({
  slug,
  version,
  level,
}: {
  slug: string;
  version: HskVersion;
  level: string;
}): string => {
  const rest = slug.replace(`${version}-${level}-`, '');
  const numbered = rest.match(/^exam-(\d+)$/);
  return numbered ? `№${numbered[1]}` : rest.toUpperCase();
};

export const pluralRu = (n: number, [one, few, many]: [string, string, string]) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
};

export type OldLevelFormat = {
  words: number;
  questions: number;
  durationMinutes: number;
  sections: ExamSectionType[];
  maxScore: number;
  passScore: number;
};

// Official HSK 2.0 exam format per level (total time includes the minutes given
// to transfer listening answers to the answer sheet).
export const OLD_LEVEL_FORMAT: Record<string, OldLevelFormat> = {
  '1': {
    words: 150,
    questions: 40,
    durationMinutes: 40,
    sections: ['listening', 'reading'],
    maxScore: 200,
    passScore: 120,
  },
  '2': {
    words: 300,
    questions: 60,
    durationMinutes: 55,
    sections: ['listening', 'reading'],
    maxScore: 200,
    passScore: 120,
  },
  '3': {
    words: 600,
    questions: 80,
    durationMinutes: 90,
    sections: ['listening', 'reading', 'writing'],
    maxScore: 300,
    passScore: 180,
  },
  '4': {
    words: 1200,
    questions: 100,
    durationMinutes: 105,
    sections: ['listening', 'reading', 'writing'],
    maxScore: 300,
    passScore: 180,
  },
  '5': {
    words: 2500,
    questions: 100,
    durationMinutes: 125,
    sections: ['listening', 'reading', 'writing'],
    maxScore: 300,
    passScore: 180,
  },
  '6': {
    words: 5000,
    questions: 101,
    durationMinutes: 140,
    sections: ['listening', 'reading', 'writing'],
    maxScore: 300,
    passScore: 180,
  },
};

// Cumulative vocabulary of the updated HSK 3.0 word lists: 300 / +200 / +500 / +1000 /
// +1600 / +1800 / +5560 for levels 7-9.
export const NEW_LEVEL_WORDS: Record<string, number> = {
  '1': 300,
  '2': 500,
  '3': 1000,
  '4': 2000,
  '5': 3600,
  '6': 5400,
  '7': 10960,
};

export const levelWords = (version: HskVersion, lvl: string): number | undefined =>
  version === 'old' ? OLD_LEVEL_FORMAT[lvl]?.words : NEW_LEVEL_WORDS[lvl];
