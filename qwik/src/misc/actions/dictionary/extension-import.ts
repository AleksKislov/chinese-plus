import { server$ } from '@builder.io/qwik-city';
import { ApiService } from '../request';
import { getTokenFromCookie } from '../auth';
import CONSTANTS from '~/misc/consts/consts';

/**
 * /dictionary/import: words the user looked up in the browser extension (extension/popup.js
 * opens the page with them), to add to their words. server$ (FE server, see CLAUDE.md), not an
 * action: an action would re-run all route loaders of the page.
 */

export const IMPORT_MAX_WORDS = 300; // as many as the extension keeps (HISTORY_MAX)
const MAX_WORD_LEN = 8;
const HAN_ONLY_RE = /^\p{Script=Han}+$/u;
const OBJECT_ID_RE = /^[a-f0-9]{24}$/;
const ADD_CONCURRENCY = 5;

export const isImportWord = (word: unknown): word is string =>
  typeof word === 'string' && word.length <= MAX_WORD_LEN && HAN_ONLY_RE.test(word);

/** Dictionary entries of the words (several for homographs), with their translations. */
export const getImportWords = server$(async (words: string[]): Promise<DictWord[]> => {
  if (!Array.isArray(words)) return [];
  const valid = [...new Set(words.filter(isImportWord))].slice(0, IMPORT_MAX_WORDS);
  if (!valid.length) return [];
  const found = await ApiService.post('/api/dictionary/allwords', valid, undefined, []);
  // allwords also matches traditional forms: keep the entries of the words themselves
  const wanted = new Set(valid);
  return (found as DictWord[]).filter((word) => wanted.has(word.chinese));
});

export type ImportAddResult = { added: string[] } | { error: string };

/**
 * Adds the entries to the user's words, skipping the ones already there (the backend doesn't
 * check: a second add would make a duplicate). Returns the ids actually added.
 */
export const addImportWords = server$(async function (
  items: { id: string; chinese: string }[],
): Promise<ImportAddResult> {
  const token = getTokenFromCookie(this.cookie);
  if (!token) return { error: 'Войдите, чтобы добавить слова' };
  if (!Array.isArray(items)) return { error: 'Неверный список слов' };
  const valid = items
    .filter((item) => OBJECT_ID_RE.test(item?.id) && isImportWord(item?.chinese))
    .slice(0, IMPORT_MAX_WORDS);

  const own: string[] | null = await ApiService.get('/api/userwords/light', token, null);
  if (!own) return { error: 'Не удалось загрузить ваш словарик, попробуйте ещё раз' };
  const ownSet = new Set(own);
  const seenIds = new Set<string>();
  const todo = valid.filter(({ id, chinese }) => {
    if (ownSet.has(chinese) || seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });
  // all or nothing: the page shows the free places and blocks a bigger selection already
  const free = Math.max(0, CONSTANTS.users.vocabSize - own.length);
  if (todo.length > free) {
    return {
      error: `В словарике свободно мест: ${free} из ${CONSTANTS.users.vocabSize}. Снимите лишние слова или удалите старые в «Мой словарик».`,
    };
  }

  // a few at a time: one request per word, the backend has no bulk add
  const added: string[] = [];
  for (let i = 0; i < todo.length; i += ADD_CONCURRENCY) {
    const batch = todo.slice(i, i + ADD_CONCURRENCY);
    const results = await Promise.all(
      batch.map(({ id }) => ApiService.post(`/api/userwords/${id}`, {}, token, null)),
    );
    batch.forEach(({ id }, n) => results[n] && added.push(id));
  }
  return { added };
});
