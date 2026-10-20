import { type BookChapter, type BookPart } from '~/routes/read/books/[id]/layout';

export type ChapterGroup = { part?: BookPart; chapters: BookChapter[] };

const getPart = (chapter: BookChapter) => (chapter.part?.ind != null ? chapter.part : undefined);

// consecutive chapters of the same volume; a book without volumes is one group without `part`
export const groupByPart = (contents: BookChapter[]): ChapterGroup[] =>
  contents.reduce<ChapterGroup[]>((groups, chapter) => {
    const part = getPart(chapter);
    const last = groups.at(-1);
    if (last && last.part?.ind === part?.ind) {
      last.chapters.push(chapter);
    } else {
      groups.push({ part, chapters: [chapter] });
    }
    return groups;
  }, []);

// volumes of the book, one per `ind`, sorted
export const getBookParts = (contents: BookChapter[]): BookPart[] => {
  const parts = new Map<number, BookPart>();
  contents.forEach((chapter) => {
    const part = getPart(chapter);
    if (part && !parts.has(part.ind)) parts.set(part.ind, part);
  });
  return [...parts.values()].sort((a, b) => a.ind - b.ind);
};

export const getPartName = (part: BookPart) =>
  [part.title.ru || `Том ${part.ind}`, part.title.cn].filter(Boolean).join(' · ');

// volume picker state: '' - no volume, 'new' - new volume with the titles below, else volume ind
export type PartChoice = { choice: string; titleRu: string; titleCn: string };

export const resolvePart = (state: PartChoice, parts: BookPart[]): BookPart | null => {
  if (!state.choice) return null;
  if (state.choice === 'new') {
    const title: BookPart['title'] = {};
    if (state.titleCn.trim()) title.cn = state.titleCn.trim();
    if (state.titleRu.trim()) title.ru = state.titleRu.trim();
    return { ind: (parts.at(-1)?.ind ?? 0) + 1, title };
  }
  return parts.find((p) => p.ind === Number(state.choice)) ?? null;
};
